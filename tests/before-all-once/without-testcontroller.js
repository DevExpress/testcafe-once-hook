import { Selector } from 'testcafe';

import { oncePerFixture } from '../../utils';
import { addPost, removePost } from '../../utils/db';

const prepareDB = oncePerFixture(async t => {
    addPost();
});

const cleanDB = oncePerFixture(async t => {
    removePost();
});

fixture `Without TestController`
    .page `http://localhost:3000`
    .beforeEach(prepareDB)
    .afterEach(cleanDB);

test('check two posts 1', async t => {
    await t.navigateTo('about:blank');
    await t.navigateTo('http://localhost:3000');
    await t.expect(Selector('tr').count).eql(2);
});

test('check two posts 2', async t => {
    await t.navigateTo('about:blank');
    await t.navigateTo('http://localhost:3000');
    await t.expect(Selector('tr').count).eql(2);
});

test('check two posts 3', async t => {
    await t.navigateTo('about:blank');
    await t.navigateTo('http://localhost:3000');
    await t.expect(Selector('tr').count).eql(2);
});
