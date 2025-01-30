const { join } = require('path');
const allure = require('@wdio/allure-reporter').default;

exports.config = {
    runner: 'local',
    maxInstances: 5,
    specs: ['./test/specs/**/*.js'],
    capabilities: [{
        maxInstances: 1,
        browserName: 'chrome',
        acceptInsecureCerts: true,
        'goog:chromeOptions': {
            args: ['--headless', '--disable-gpu', '--window-size=1920,1080']
        }
    }],
    logLevel: 'info',
    bail: 0,
    baseUrl: 'http://localhost',
    waitforTimeout: 10000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,
    services: ['chromedriver'],
    framework: 'mocha',
    reporters: [['allure', { outputDir: 'allure-results', disableWebdriverStepsReporting: true, disableWebdriverScreenshotsReporting: false }]],
    mochaOpts: {
        ui: 'bdd',
        timeout: 60000
    },
    before: function () {
        require('@babel/register');
    },
    afterTest: async function(test, context, { error }) {
        if (error) {
            const screenshot = await browser.takeScreenshot();
            allure.addAttachment('Failure Screenshot', Buffer.from(screenshot, 'base64'), 'image/png');
        }
    },
    onComplete: function () {
        const report = require('child_process').exec('allure generate allure-results --clean -o allure-report', (error, stdout, stderr) => {
            if (error) {
                console.error(`Error generating Allure report: ${error.message}`);
                return;
            }
            if (stderr) {
                console.error(`Allure report stderr: ${stderr}`);
                return;
            }
            console.log(`Allure report generated: ${stdout}`);
        });
        report.on('exit', (code) => {
            console.log(`Allure report process exited with code ${code}`);
        });
    }
};
