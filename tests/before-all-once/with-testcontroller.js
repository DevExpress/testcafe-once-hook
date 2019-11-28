import { Selector } from 'testcafe';

import { oncePerFixture } from '../../utils';
import { getPosts } from '../../utils/db';

const prepareDB = oncePerFixture(async t => {
    await t.click(Selector('a').withText('Add'));
});

const cleanDB = oncePerFixture(async t => {
    await t.click(Selector('a').withText('Remove'));
});

fixture `With TestController`
    .page `http://localhost:3000`
    .before(() => {
        if (getPosts().length !== 1)
            throw new Error('Only one record should be store in the DB');
    })
    .after(() => {
        if (getPosts().length !== 1)
            throw new Error('Only one record should be store in the DB');
    })
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
