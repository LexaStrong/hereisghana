const fs = require('fs');
const cheerio = require('cheerio');

const detailsModalHTML = `
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
`;

function convertFile(filename) {
    const content = fs.readFileSync(filename, 'utf8');
    const $ = cheerio.load(content);
    
    let modified = false;

    $('.tour-card').each((i, el) => {
        const card = $(el);
        
        // If it already has the class, skip
        if (card.hasClass('open-details-modal')) return;

        card.addClass('open-details-modal');
        card.css('cursor', 'pointer');
        
        const title = card.find('h3').text().trim();
        const desc = card.find('.tour-desc').text().trim();
        const style = card.find('.card-img').attr('style') || '';
        // Extract URL from style="background-image: url('...');"
        const match = style.match(/url\(['"]?(.*?)['"]?\)/);
        const img = match ? match[1] : '';

        card.attr('data-title', title);
        card.attr('data-img', img);
        card.attr('data-desc', desc);

        // Remove the href from the btn-icon so it doesn't redirect
        const btnIcon = card.find('.btn-icon');
        if (btnIcon.length) {
            btnIcon.removeAttr('href');
        }

        modified = true;
    });

    if (modified) {
        if ($('#detailsModal').length === 0) {
            $('body').append(detailsModalHTML);
        }
        fs.writeFileSync(filename, $.html());
        console.log(`Updated ${filename}`);
    } else {
        console.log(`No changes made to ${filename} (or already updated).`);
    }
}

convertFile('tours.html');
convertFile('index.html');
