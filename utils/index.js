class Helper {
    constructor () {
        console.log('new helper');
        this.browserCount          = 0;
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

    static async executeFn (fn, t) {
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

    static getTestPhases (t) {
        const isInFixtureBeforeEachHook = t.testRun.phase === 'inFixtureBeforeEachHook';
        const isInFixtureAfterEachHook  = t.testRun.phase === 'inFixtureAfterEachHook';

        return { isInFixtureBeforeEachHook, isInFixtureAfterEachHook };
    }

    static needSkipHook (t) {
        const test      = t.testRun.test;
        const tests     = test.fixture.testFile.collectedTests;
        const testIndex = tests.indexOf(test);

        const { isInFixtureBeforeEachHook, isInFixtureAfterEachHook } = Helper.getTestPhases(t);

        const isFirstTestInFixture = testIndex === 0 && isInFixtureBeforeEachHook;
        const isLastTestInFixture  = testIndex === tests.length - 1 && isInFixtureAfterEachHook;

        return !isFirstTestInFixture && !isLastTestInFixture;
    }


    async waitAllBrowsersEnterHook () {
        this.browserEnterHookCount++;

        console.log('start hook: ' + this.browserEnterHookCount);

        if (this.browserEnterHookCount === this.browserCount)
            this.waitResolver();

        await this.waitAllBrowsersPromise;

        console.log('waitAllBrowsersPromise');
    }

    async waitAllBrowsersLeaveHook () {
        if (this.executionCount === this.browserCount)
            this.doneResolver();

        await this.donePromise;

        console.log('donePromise');
    }

    async executeFn (fn, t) {
        const { isInFixtureBeforeEachHook, isInFixtureAfterEachHook } = Helper.getTestPhases(t);

        const beforeHookOnce = isInFixtureBeforeEachHook && this.executionCount === 0;
        const afterHookOnce  = isInFixtureAfterEachHook && this.executionCount === this.browserCount - 1;
        const needExecute    = !this.executed && (beforeHookOnce || afterHookOnce);

        console.log(`need execute: ${needExecute} executed: ${this.executed} ${this.executionCount} ${beforeHookOnce} ${afterHookOnce}`);

        if (needExecute) {
            this.executed = true;

            await Helper.executeFn(fn, t);
        }

        this.executionCount++;
    }
}

export function oncePerFixture (fn) {
    let helper = new Helper();

    return async function (t) {
        if (Helper.needSkipHook(t))
            return;

        helper.browserCount = t.testRun.opts.browsers.length;

        await helper.waitAllBrowsersEnterHook();

        await helper.executeFn(fn, t);

        await helper.waitAllBrowsersLeaveHook();


        if (t.testRun.errOnHook)
            throw t.testRun.errOnHook;
    };
}

export function oncePerTest (fn) {
    let helper = new Helper();

    return async function (t) {
        console.log('enter the hook');

        helper.browserCount = t.testRun.opts.browsers.length;

        await helper.waitAllBrowsersEnterHook();

        await helper.executeFn(fn, t);

        await helper.waitAllBrowsersLeaveHook();

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




// export function beforeFixture (fn) {
//     const helper = initialize();
//
//     return async function (t) {
//         const test         = t.testRun.test;
//         const tests        = test.fixture.testFile.collectedTests;
//         const testIndex    = tests.indexOf(test);
//         const browserCount = t.testRun.opts.browsers.length;
//
//         const isInFixtureBeforeEachHook = t.testRun.phase === 'inFixtureBeforeEachHook';
//         const isInFixtureAfterEachHook  = t.testRun.phase === 'inFixtureAfterEachHook';
//
//         const isFirstTestInFixture = testIndex === 0 && isInFixtureBeforeEachHook;
//         const isLastTestInFixture  = testIndex === tests.length - 1 && isInFixtureAfterEachHook;
//
//         if (!isFirstTestInFixture && !isLastTestInFixture)
//             return;
//
//         helper.browserEnterHookCount++;
//
//         if (helper.browserEnterHookCount === browserCount)
//             helper.waitResolver();
//
//         await helper.waitAllBrowsersPromise;
//
//         const beforeHookOnce = isInFixtureBeforeEachHook && helper.executionCount === 0;
//         const afterHookOnce  = isInFixtureAfterEachHook && helper.executionCount === browserCount - 1;
//         const needExecute    = !helper.executed && (beforeHookOnce || afterHookOnce);
//
//         if (needExecute) {
//             helper.executed = true;
//
//             await executeFn(fn, t);
//         }
//
//         helper.executionCount++;
//
//         if (helper.executionCount === browserCount)
//             helper.doneResolver();
//
//         await helper.donePromise;
//
//         if (t.testRun.errOnHook)
//             throw t.testRun.errOnHook;
//     };
// }
