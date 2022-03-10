const payloads = require('../payloads');
const express = require('express');

describe('open redirect', () => {

    let server;
    let ok;
    let bad;
    let redirected;

    beforeEach(() => {
        redirected = false;
    });

    before((done) => {
        ok = 0;
        bad = 0;
        const app = express();


        app.use((req, res, next) => {
            if (redirected) {
                next()
            } else {
                // Collapse leading slashes fix:
                const url = req.originalUrl.replace(/^\/+/, '/');
                res.redirect(url);
                redirected = true;
            }

        });

        app.get('/', (req, res) => {
            res.send(`hello`);
        });
        server = app.listen(3000, done);
    });

    after((done) => {
        console.log('OK', ok, ',', 'BAD', bad);
        server.close(done);
    });

    for (let payload of payloads) {
        it(`should not visit external host with ${payload}`, async () => {
            await browser.setTimeout({ 'pageLoad': 1000 });
            const url = `http://localhost:3000${ payload.startsWith('/') ? '' : '/' }${payload}`;
            await browser.url(url);
            const hostname = new URL(await browser.getUrl()).hostname

            const isOk = hostname === 'localhost';
            if (isOk) {
                ok++;
            } else {
                bad++;
                console.log('BAD PAYLOAD', payload, decodeURIComponent(payload));
            }
        });
    }
});

//FF OK 283 , BAD 4
//Chrome OK 279 , BAD 8
//Safari OK 286 , BAD 0

