const webdriverio = require('webdriverio');
const t = require('tap');
const {sel} = require('./utils/global');

const options = {
    desiredCapabilities: {
        browserName: 'chrome'
    },
    deprecationWarnings: false
};

t.test("TestCommentAdd", async (t) => {
    const driver = webdriverio.remote(options);
    await driver.init();
    var url = '';
    await t.beforeEach(async (t) => {
        await driver
            .url('http://localhost:3020')
            .setValue(sel('sidebar-input-username'), 'jijka')
            .setValue(sel('sidebar-input-password'), '123123')
            .click(sel('sidebar-btn-submit'))
            .waitForExist(sel('sidebar-username'), 10000)
            .click(sel('sidebar-btn-post-add'))
            .waitForExist(sel('btn-post-form-title'), 10000)
            .setValue(sel('btn-post-form-title'), 'Test title')
            .setValue(sel('btn-post-form-body'), 'Body of post')
            .click(sel('btn-post-send'))
            .waitForExist(sel('header-logo'), 10000);
        url = await driver.getUrl();
        await driver.click(sel('header-logo'))
            .waitForExist(sel(url), 10000);
    });
    await t.afterEach(async (t) => {
        await driver
            .click(sel('sidebar-btn-logout'));
    });
    await t.test('comment add', async (t) => {
        await driver
            .click(sel(url))
            .waitForExist(sel('comment-body'), 10000)
            .setValue(sel('comment-body'), 'Test comment')
            .click(sel('comment-btn-send'))
            .waitForExist(sel('Test comment-body'), 10000);
        const body = await driver.getText(sel('Test comment-body'));
        t.equal(body, 'Test comment', "error body");
    });
    await driver.end();
});