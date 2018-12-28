const webdriverio = require('webdriverio');
const t = require('tap');
const {sel} = require('./utils/global');

const options = {
    desiredCapabilities: {
        browserName: 'chrome'
    },
    deprecationWarnings: false
};

t.test("TestLogin", async (t) => {
    const driver = webdriverio.remote(options);
    await driver.init();
    await t.test('check title', async (t) => {
        await driver.url('http://localhost:3020');
        await driver
            .setValue(sel('sidebar-input-username'), 'jijka')
            .setValue(sel('sidebar-input-password'), '123123')
            .click(sel('sidebar-btn-submit'))
            .waitForExist(sel('sidebar-username'), 10000);

        const username = await driver.getText(sel('sidebar-username'));
        t.contains(username, 'jijka');
    });
    await driver.end();
});