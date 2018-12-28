const webdriverio = require('webdriverio');
const t = require('tap');
const {sel} = require('./utils/global');

const options = {
    desiredCapabilities: {
        browserName: 'chrome'
    },
    deprecationWarnings: false
};

t.test("TestPostAdd", async (t) => {
    const driver = webdriverio.remote(options);
    await driver.init();
    await t.beforeEach(async (t) => {
        await driver
            .url('http://localhost:3020')
            .setValue(sel('sidebar-input-username'), 'jijka')
            .setValue(sel('sidebar-input-password'), '123123')
            .click(sel('sidebar-btn-submit'))
            .waitForExist(sel('sidebar-username'), 10000);
    });
    await t.afterEach(async (t) => {
        await driver
            .click(sel('sidebar-btn-logout'));
    });
    await t.test('post add', async (t) => {
        await driver
            .click(sel('sidebar-btn-post-add'))
            .waitForExist(sel('btn-post-form-title'), 10000)
            .setValue(sel('btn-post-form-title'), 'Test title')
            .setValue(sel('btn-post-form-body'), 'Body of post')
            .click(sel('btn-post-send'))
            .waitForExist(sel('post-title'), 10000);

        const title = await driver.getText(sel('post-title'));
        const body = await driver.getText(sel('post-body'));
        t.equal(title, 'Test title', "error title");
        t.equal(body, 'Body of post', "error body");
    });
    await driver.end();
});