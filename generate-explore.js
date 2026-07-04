const fs = require('fs');
const cheerio = require('cheerio');
const https = require('https');

const attractions = [
    { num: 1, title: 'Kwame Nkrumah Memorial Park', rating: '4.0', reviews: '938', category: 'Monuments & Statues', desc: '', ways: '139', img: '' },
    { num: 2, title: 'Kakum National Park', rating: '4.2', reviews: '750', category: 'National Parks', desc: '', ways: '173', img: '' },
    { num: 3, title: 'Anagkazo Campus. ABMTC Ghana', search: 'Anagkazo', rating: '5.0', reviews: '185', category: 'Nature & Wildlife Areas', desc: '', ways: '0', img: '' },
    { num: 4, title: 'Makola Market', rating: '4.0', reviews: '202', category: 'Flea & Street Markets', desc: '', ways: '0', img: '' },
    { num: 5, title: 'Aburi Botanical Gardens', rating: '3.9', reviews: '373', category: 'Gardens', desc: '', ways: '0', img: '' },
    { num: 6, title: 'Bojo Beach', rating: '3.9', reviews: '387', category: 'Beaches', desc: '', ways: '0', img: '' },
    { num: 7, title: 'Cape Coast Castle', rating: '4.5', reviews: '636', category: 'Castles', desc: '', ways: '154', img: '' },
    { num: 8, title: 'Elmina Castle', rating: '4.5', reviews: '495', category: 'Historic Sites', desc: '', ways: '131', img: '' },
    { num: 9, title: 'Wli Waterfalls', rating: '4.6', reviews: '191', category: 'Waterfalls', desc: '', ways: '37', img: '' },
    { num: 10, title: 'Labadi Beach', rating: '3.4', reviews: '650', category: 'Beaches', desc: '', ways: '0', img: '' },
    { num: 11, title: 'Osu Castle', rating: '4.1', reviews: '68', category: 'Castles', desc: '', ways: '0', img: '' },
    { num: 12, title: 'Accra Mall', rating: '3.9', reviews: '353', category: 'Shopping Malls', desc: '', ways: '0', img: '' },
    { num: 13, title: 'Shai Hills Resource Reserve', rating: '3.7', reviews: '72', category: 'Nature & Wildlife Areas', desc: '', ways: '55', img: '' },
    { num: 14, title: 'Artists Alliance Gallery', search: 'Artists Alliance Gallery Accra', rating: '4.7', reviews: '44', category: 'Art Galleries', desc: '', ways: '11', img: '' },
    { num: 15, title: 'Kokrobite Beach', search: 'Kokrobite', rating: '3.7', reviews: '99', category: 'Beaches', desc: '', ways: '1', img: '' },
    { num: 16, title: 'W.E.B. DuBois Center', search: 'W. E. B. Du Bois Memorial Centre for Pan-African Culture', rating: '4.2', reviews: '118', category: 'Historic Sites', desc: '', ways: '71', img: '' },
    { num: 17, title: 'Boti Falls', rating: '3.7', reviews: '42', category: 'Waterfalls', desc: '', ways: '26', img: '' },
    { num: 18, title: 'Mole National Park', rating: '4.3', reviews: '173', category: 'National Parks', desc: '', ways: '15', img: '' },
    { num: 19, title: 'Kejetia Market', rating: '4.1', reviews: '67', category: 'Flea & Street Markets', desc: '', ways: '34', img: '' },
    { num: 20, title: 'See Ghana Dmc', search: 'Tourism in Ghana', rating: '5.0', reviews: '43', category: 'Nature & Wildlife Areas', desc: '', ways: '0', img: '' },
    { num: 21, title: 'Legon Botanical Gardens', rating: '4.0', reviews: '17', category: 'Gardens', desc: '', ways: '4', img: '' },
    { num: 22, title: 'Lake Bosumtwi', rating: '4.0', reviews: '42', category: 'Points of Interest & Landmarks', desc: '', ways: '7', img: '' },
    { num: 23, title: 'Manhyia Palace Museum', search: 'Manhyia Palace', rating: '4.1', reviews: '140', category: 'Speciality Museums', desc: '', ways: '60', img: '' },
    { num: 24, title: 'Busua Beach', search: 'Busua', rating: '4.6', reviews: '27', category: 'Beaches', desc: '', ways: '1', img: '' },
    { num: 25, title: 'Tafi Atome Monkey Sanctuary', rating: '4.4', reviews: '74', category: 'Nature & Wildlife Areas', desc: '', ways: '39', img: '' },
    { num: 26, title: 'Accra Zoo', rating: '3.3', reviews: '12', category: 'Zoos', desc: '', ways: '4', img: '' },
    { num: 27, title: 'Sajuna Beach Club', search: 'Akosombo', rating: '3.9', reviews: '16', category: 'Sports Complexes', desc: '', ways: '1', img: '' },
    { num: 28, title: 'Mount Afadja', rating: '4.8', reviews: '22', category: 'Mountains', desc: '', ways: '22', img: '' },
    { num: 29, title: 'Oxford Street, Accra', rating: '3.7', reviews: '80', category: 'Points of Interest & Landmarks', desc: '', ways: '17', img: '' },
    { num: 30, title: 'Black Star Gate', search: 'Black Star Monument', rating: '4.2', reviews: '126', category: 'Historic Sites', desc: '', ways: '25', img: '' }
];

function fetchWiki(title) {
    return new Promise((resolve) => {
        const url = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts|pageimages&format=json&exintro=1&explaintext=1&piprop=original&titles=${encodeURIComponent(title)}`;
        const options = { headers: { 'User-Agent': 'AntigravityAgent/1.0 (contact@example.com)' } };
        https.get(url, options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    const pages = parsed.query.pages;
                    const pageId = Object.keys(pages)[0];
                    if (pageId === '-1') {
                        resolve(null);
                    } else {
                        resolve({
                            extract: pages[pageId].extract,
                            image: pages[pageId].original ? pages[pageId].original.source : null
                        });
                    }
                } catch(e) { resolve(null); }
            });
        }).on('error', () => resolve(null));
    });
}

async function run() {
    console.log('Fetching Wikipedia data for 30 attractions...');
    for (let att of attractions) {
        const searchTerm = att.search || att.title;
        const wikiData = await fetchWiki(searchTerm);
        
        if (wikiData) {
            // Trim description to ~120 chars for card, keep full for modal
            let fullDesc = wikiData.extract || `${att.title} is a popular destination in Ghana.`;
            att.fullDesc = fullDesc;
            att.desc = fullDesc.length > 120 ? fullDesc.substring(0, 120) + '...' : fullDesc;
            
            // Use local images if preferred, else wiki image, else fallback
            att.img = wikiData.image || `https://placehold.co/600x400/1f3b33/ffffff?text=${encodeURIComponent(att.title)}`;
        } else {
            const fb = `${att.title} is a beautiful place in Ghana.`;
            att.fullDesc = fb;
            att.desc = fb;
            att.img = `https://placehold.co/600x400/1f3b33/ffffff?text=${encodeURIComponent(att.title)}`;
        }
        console.log(`✓ Fetched: ${att.title}`);
    }

    const htmlPath = 'explore.html';
    const content = fs.readFileSync(htmlPath, 'utf8');
    const $ = cheerio.load(content);

    const section = $('section.section .container');
    section.empty();

    const grid = $('<div class="ta-grid"></div>');

    attractions.forEach(att => {
        // Escape quotes
        const safeTitle = att.title.replace(/'/g, "&#39;").replace(/"/g, "&quot;");
        const safeDesc = att.fullDesc.replace(/'/g, "&#39;").replace(/"/g, "&quot;");
        const safeImg = att.img;

        let cardHTML = `
        <div class="ta-card open-details-modal" style="cursor: pointer;" data-title="${safeTitle}" data-img="${safeImg}" data-desc="${safeDesc}">
            <img src="${safeImg}" class="ta-card-img" alt="${safeTitle}">
            <div class="ta-card-content">
                <h3 class="ta-card-title">${att.num}. ${safeTitle}</h3>
                <div class="ta-card-rating">
                    <span style="font-weight:700;">${att.rating}</span> 
                    <span class="dots">●●●●○</span>
                    <span>(${att.reviews})</span>
                </div>
                <div class="ta-card-category">${att.category}</div>
                <div class="ta-card-desc">${att.desc}</div>
            </div>
            <div class="ta-card-footer">
                <button class="ta-card-btn open-booking-modal" data-activity="${safeTitle}">Request to Book</button>
            </div>
        </div>`;
        
        grid.append(cardHTML);
    });

    section.append(grid);
    
    // Add Details Modal HTML if not exists
    if ($('#detailsModal').length === 0) {
        $('body').append(`
        <!-- Details Modal -->
        <div id="detailsModal" class="modal-overlay">
            <div class="details-modal-content">
                <span class="close-modal"><i class="bx bx-x"></i></span>
                <img src="" class="details-modal-img" alt="">
                <div class="details-modal-body">
                    <h2 class="details-title">Title</h2>
                    <p class="details-desc">Description</p>
                    <button class="btn btn-primary open-booking-modal" style="width: 100%;">BOOK THIS EXPERIENCE</button>
                </div>
            </div>
        </div>
        `);
    }

    fs.writeFileSync(htmlPath, $.html());
    console.log('Successfully updated explore.html with Wikipedia data and Modals!');
}

run();
