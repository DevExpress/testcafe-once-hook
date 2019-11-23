export function once (fn) {
    let executed              = false;
    let waitResolver          = null;
    let doneResolver          = null;
    let browserEnterHookCount = 0;
    let executionCount        = 0;

    const waitAllBrowsersPromise = new Promise(resolve => {
       waitResolver = resolve;
    });

    const donePromise = new Promise(resolve => {
        doneResolver = resolve;
    });

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

        browserEnterHookCount++;

        if (browserEnterHookCount === browserCount)
            waitResolver();

        await waitAllBrowsersPromise;

        const beforeHookOnce = isInFixtureBeforeEachHook && executionCount === 0;
        const afterHookOnce  = isInFixtureAfterEachHook && executionCount === browserCount - 1;
        const needExecute    = !executed && (beforeHookOnce || afterHookOnce);

        if (needExecute) {
            executed = true;

            if (typeof fn === 'function') {
                try {
                    await fn(t);
                }
                catch (err) {
                    t.testRun.errOnHook = err;
                }
            }
        }

        executionCount++;

        if (executionCount === browserCount)
            doneResolver();

        await donePromise;

        if (t.testRun.errOnHook)
            throw t.testRun.errOnHook;
    };
}
