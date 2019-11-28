import { oncePerFixture } from '../../utils';

const beforeHook = oncePerFixture(async t => {
    await t.click('#non-existing-element');
});

fixture `Error in the 'beforeHook'`
    .page `http://localhost:3000`
    .beforeEach(beforeHook);

test('check two posts 1', async t => {
    await t.wait(1000);
});

test('check two posts 2', async t => {
    await t.wait(1000);
});

test('check two posts 3', async t => {
    await t.wait(1000);
});
