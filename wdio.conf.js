import allure from 'allure-commandline';

export const config = { // Change `exports.config` to `export const config`
    user: process.env.BROWSERSTACK_USERNAME,
    key: process.env.BROWSERSTACK_ACCESS_KEY,
    runner: 'local',
    specs: ['./test/specs/**/Books.js'],
    exclude: [],
    maxInstances: 10,
    capabilities: [{ browserName: 'chrome' }],
    logLevel: 'info',
    bail: 0,
    baseUrl: 'http://localhost:8000',
    waitforTimeout: 10000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,
    services: ['selenium-standalone'],
    framework: 'mocha',
    reporters: [
        'spec',
        [
            'allure',
            {
                outputDir: 'allure-results',
                disableWebdriverStepsReporting: false,
                disableWebdriverScreenshotsReporting: false,
            },
        ],
    ],
    mochaOpts: {
        ui: 'bdd',
        timeout: 60000
    },
    afterTest: async function(test, context, { error }) {
        if (error) {
            const screenshot = await browser.takeScreenshot();
            allure.addAttachment('Failure Screenshot', Buffer.from(screenshot, 'base64'), 'image/png');
        }
    },
    onComplete: function() {
        return new Promise((resolve) => {
            try {
                const generation = allure(['generate', 'allure-results', '--clean']);
                const generationTimeout = setTimeout(() => {
                    console.log('Allure report generation timed out');
                    resolve();
                }, 10000);
                generation.on('exit', function(exitCode) {
                    clearTimeout(generationTimeout);
                    console.log(exitCode === 0 ? 'Allure report successfully generated' : 'Allure report generation failed');
                    resolve();
                });
            } catch (error) {
                console.log('Error generating report:', error);
                resolve();
            }
        });
    },
};
