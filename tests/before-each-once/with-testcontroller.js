import { Selector } from 'testcafe';

import { beforeEach } from '../../utils';
import { getPosts } from '../../utils/db';

const prepareDB = beforeEach(async t => {
    await t.expect(getPosts().length).eql(1);

    await t.click(Selector('a').withText('Add'));

    await t.expect(getPosts().length).eql(2);
});

const cleanDB = beforeEach(async t => {
    await t.expect(getPosts().length).eql(2);

    await t.click(Selector('a').withText('Remove'));

    await t.expect(getPosts().length).eql(1);
});

fixture `With TestController`
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
