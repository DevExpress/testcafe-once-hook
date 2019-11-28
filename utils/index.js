class Helper {
    constructor () {
        console.log('new helper');

        this.executed              = false;
        this.browserEnterHookCount = 0;
        this.executionCount        = 0;

        this.waitAllBrowsersPromise = new Promise(resolve => {
            this.waitResolver = resolve;
        });

        this.donePromise = new Promise(resolve => {
            this.doneResolver = resolve;
        });
    }

    async waitAllBrowsersEnterHook (browserCount) {
        this.browserEnterHookCount++;

        console.log('start hook: ' + this.browserEnterHookCount);

        if (this.browserEnterHookCount === browserCount)
            this.waitResolver();

        await this.waitAllBrowsersPromise;

        console.log('waitAllBrowsersPromise');
    }

    async waitAllBrowsersLeaveHook (browserCount) {
        if (this.executionCount === browserCount)
            this.doneResolver();

        await this.donePromise;

        console.log('donePromise');
    }

    async executeFn (fn, t, browserCount) {
        const isInFixtureBeforeEachHook = t.testRun.phase === 'inFixtureBeforeEachHook';
        const isInFixtureAfterEachHook  = t.testRun.phase === 'inFixtureAfterEachHook';

        const beforeHookOnce = isInFixtureBeforeEachHook && this.executionCount === 0;
        const afterHookOnce  = isInFixtureAfterEachHook && this.executionCount === browserCount - 1;

        const needExecute    = !this.executed && (beforeHookOnce || afterHookOnce);

        console.log(`need execute: ${needExecute} executed: ${this.executed} ${this.executionCount} ${beforeHookOnce} ${afterHookOnce}`);

        if (needExecute) {
            this.executed = true;

            await executeFn(fn, t);
        }

        this.executionCount++;
    }
}

export function beforeFixture (fn) {
    const helper = initialize();

    return async function (t) {
        const test         = t.testRun.test;
        const tests        = test.fixture.testFile.collectedTests;
        const testIndex    = tests.indexOf(test);
        const browserCount = t.testRun.opts.browsers.length;

        const isInFixtureBeforeEachHook = t.testRun.phase === 'inFixtureBeforeEachHook';
        const isInFixtureAfterEachHook  = t.testRun.phase === 'inFixtureAfterEachHook';

        const isFirstTestInFixture = testIndex === 0 && isInFixtureBeforeEachHook;
        const isLastTestInFixture  = testIndex === tests.length - 1 && isInFixtureAfterEachHook;

        if (!isFirstTestInFixture && !isLastTestInFixture)
            return;

        helper.browserEnterHookCount++;

        if (helper.browserEnterHookCount === browserCount)
            helper.waitResolver();

        await helper.waitAllBrowsersPromise;

        const beforeHookOnce = isInFixtureBeforeEachHook && helper.executionCount === 0;
        const afterHookOnce  = isInFixtureAfterEachHook && helper.executionCount === browserCount - 1;
        const needExecute    = !helper.executed && (beforeHookOnce || afterHookOnce);

        if (needExecute) {
            helper.executed = true;

            await executeFn(fn, t);
        }

        helper.executionCount++;

        if (helper.executionCount === browserCount)
            helper.doneResolver();

        await helper.donePromise;

        if (t.testRun.errOnHook)
            throw t.testRun.errOnHook;
    };
}

export function oncePerTest (fn) {
    let helper = new Helper();

    return async function (t) {
        console.log('enter the hook');
        const browserCount = t.testRun.opts.browsers.length;

        await helper.waitAllBrowsersEnterHook(browserCount);

        await helper.executeFn(fn, t, browserCount);

        await helper.waitAllBrowsersLeaveHook(browserCount);

        helper = new Helper();

        if (t.testRun.errOnHook) {
            console.log('err');
            throw t.testRun.errOnHook;
        }
    };
}



function initialize () {
    const executed              = false;
    const browserEnterHookCount = 0;
    const executionCount        = 0;

    let waitResolver = null;
    let doneResolver = null;

    const waitAllBrowsersPromise = new Promise(resolve => {
        waitResolver = resolve;
    });

    const donePromise = new Promise(resolve => {
        doneResolver = resolve;
    });

    return {
        executed,
        waitResolver,
        doneResolver,
        browserEnterHookCount,
        executionCount,
        waitAllBrowsersPromise,
        donePromise
    }
}

async function executeFn (fn, t) {
    if (typeof fn === 'function') {
        try {
            console.log('executeFn');

            await fn(t);
        }
        catch (err) {

            console.log('catched');

            t.testRun.errOnHook = err;
        }
    }
}
