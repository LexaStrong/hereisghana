const https = require('https');

function fetchWiki(title) {
    return new Promise((resolve, reject) => {
        const url = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts|pageimages&format=json&exintro=1&explaintext=1&piprop=original&titles=${encodeURIComponent(title)}`;
        const options = {
            headers: {
                'User-Agent': 'AntigravityAgent/1.0 (contact@example.com)'
            }
        };
        https.get(url, options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                const parsed = JSON.parse(data);
                const pages = parsed.query.pages;
                const pageId = Object.keys(pages)[0];
                if (pageId === '-1') resolve(null);
                else {
                    resolve({
                        extract: pages[pageId].extract,
                        image: pages[pageId].original ? pages[pageId].original.source : null
                    });
                }
            });
        }).on('error', reject);
    });
}

async function test() {
    console.log(await fetchWiki('Makola Market'));
    console.log(await fetchWiki('Aburi Botanical Gardens'));
}

test();
