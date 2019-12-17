# testcafe-once-hook

This module provides TestCafe hooks executed once in a single browser even when you run tests in multiple browsers. This functionality is a workaround for an issue described in [#1345](https://github.com/DevExpress/testcafe/issues/1345).

The `testcafe-once-hook` module exports two functions:

- `oncePerFixture` runs in the first specified browser before and after all tests in a fixture. Unlike the `fixture.before` and `fixture.after` hooks designed for server-side operations, `oncePerFixture` allows you to execute test actions in the browser.
- `oncePerTest` runs in the first specified browser before and after each test in a fixture, while regular `beforeEach` and `afterEach` hooks run in every browser. 
