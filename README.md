# testcafe-once-hook

This is a workaround for the `beforeAll` feature described in `put-a-link-here`.

The main idea of the feature request is to add the capability to execute test actions via TestController (click, hover, typeText, etc) once per fixture before starting all tests.

Use case:
* we have a db;
* we want to add a single record into the db using the user interface and test actions;
* we want to run tests in different browsers;
* we want to remove a test record from the db using the user interface and test actions.
