export function once (fn) {
    let executed       = false;
    let resolver       = null;
    let executionCount = 0;

    const promise = new Promise(resolve => {
        resolver = resolve;
    });

    return async function (t) {
        const test      = t.testRun.test;
        const tests     = test.fixture.testFile.collectedTests;
        const testIndex = tests.indexOf(test);

        const isInFixtureBeforeEachHook = t.testRun.phase === 'inFixtureBeforeEachHook';
        const isInFixtureAfterEachHook  = t.testRun.phase === 'inFixtureAfterEachHook';

        const isFirstTestInFixture = testIndex === 0 && isInFixtureBeforeEachHook;
        const isLastTestInFixture  = testIndex === tests.length - 1 && isInFixtureAfterEachHook;

        if (!isFirstTestInFixture && !isLastTestInFixture)
            return;

        const beforeHookOnce = isInFixtureBeforeEachHook && executionCount === 0;
        const afterHookOnce  = isInFixtureAfterEachHook && executionCount === t.testRun.opts.browsers.length - 1;
        const needExecute    = !executed && (beforeHookOnce || afterHookOnce);

        if (needExecute) {
            executed = true;

            if (typeof fn === 'function')
                await fn(t);
        }

        executionCount++;

        if (executionCount === t.testRun.opts.browsers.length)
            resolver();

        await promise;
    };
}
