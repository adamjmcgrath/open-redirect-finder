exports.config = {
    specs: [
        './test/*.js'
    ],
    maxInstances: 1,
    capabilities: [
         { maxInstances: 5,
           browserName: 'chrome',
           acceptInsecureCerts: true },
        // { browserName: 'safari' },
        // { browserName: 'firefox' }
        ], 
    // Level of logging verbosity: trace | debug | info | warn | error | silent
    logLevel: 'info',
    bail: 0,
    baseUrl: 'http://localhost:3000',
    waitforTimeout: 10000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,
    services: ['chromedriver', 'safaridriver', [
        'geckodriver',
        {
            args: ['--log=info'],
            logs: './logs'
        }
    ]],
    safaridriverArgs: ['-p 4444'], // use the specified port. Default is 4444
    safaridriverLogs: './',
    framework: 'mocha',
    reporters: ['spec'],
    mochaOpts: {
        ui: 'bdd',
        timeout: 60000
    },
}
