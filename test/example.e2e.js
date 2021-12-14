const http = require('http');
const payloads = require('../payloads');

function old_isSafeRedirect(url) {
    if (typeof url !== 'string') {
        throw new TypeError(`Invalid url: ${url}`);
    }

    // Prevent open redirects using the //foo.com format (double forward slash).
    if (/\/\//.test(url)) {
        return false;
    }

    return !/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(url);
}


const safeBaseUrl = new URL('http://localhost:3000');
function toSafeRedirect(dangerousRedirect) {
    
    let url;
    try {
        url = new URL(dangerousRedirect, safeBaseUrl);
    } catch (e) {
        return undefined;
    }
    if (url.origin === safeBaseUrl.origin) {
        return url.toString();
    }
    return undefined;
}

describe('open redirect', () => {

    let server;
    let ok;
    let bad;
    
    before((done) => {
        ok = 0;
        bad = 0;
        server = http.createServer((req, res) => {
            const q = new URL(req.url, 'http://localhost:3000').searchParams;
            try {
                const url = toSafeRedirect(q.get('url'));
                if (q.get('url') && url) {
                    res.writeHead(302, {
                        Location: url
                    });    
                }
            } catch(e) {
                // Do nothing, node can't write the header
            }
            
            res.end();
        });
        server.listen(3000, done);
    });
    
    after((done) => {
        console.log('OK', ok, ',', 'BAD', bad);
        server.close(done);
    });
    
    for (let payload of payloads) {
        it(`should not visit external host with ${payload}`, async () => {
            await browser.setTimeout({ 'pageLoad': 1000 });
            await browser.url(`/?url=${payload}`);
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

