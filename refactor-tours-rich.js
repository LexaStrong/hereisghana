const fs = require('fs');
const cheerio = require('cheerio');
const path = require('path');

const tourMapping = {
    "Accra City Tour": "tour-accra-city.html",
    "Accra to Cape Coast Tour": "tour-accra-cape-coast.html",
    "Day Tour of Cape Coast": "tour-cape-coast-elmina.html",
    "Quad Biking & Waterfalls": "tour-quad-biking.html",
    "Wli Waterfalls & Mount Afadjato": "tour-wli-waterfalls.html",
    "2 Days Ghana Adventure": "tour-2-days-adventure.html",
    "3 Days Accra & Cape Coast": "tour-3-days-accra-cape.html",
    "Boat Cruise & Shai Hills": "tour-boat-cruise.html"
};

function getRichHTML(title) {
    const filename = tourMapping[title];
    if (!filename) return null;
    
    const filePath = path.join(__dirname, 'tours', filename);
    if (!fs.existsSync(filePath)) return null;

    const content = fs.readFileSync(filePath, 'utf8');
    const $ = cheerio.load(content);
    
    // We want to extract .tour-detail-grid inner HTML
    const grid = $('.tour-detail-grid');
    if (grid.length === 0) return null;
    // Remove the message below the button
    grid.find('p').filter(function() {
        return $(this).text().includes('custom itinerary based on this tour');
    }).remove();

    return grid.html();
}

function convertFile(filename) {
    const content = fs.readFileSync(filename, 'utf8');
    const $ = cheerio.load(content);
    
    let modified = false;

    $('.tour-card').each((i, el) => {
        const card = $(el);
        const title = card.attr('data-title') || card.find('h3').first().text().trim();
        
        // Ensure it's marked as open-details-modal
        if (!card.hasClass('open-details-modal')) {
            card.addClass('open-details-modal');
            card.css('cursor', 'pointer');
        }

        const richHTML = getRichHTML(title);
        
        if (richHTML) {
            // Remove old if exists
            card.find('.tour-full-details').remove();
            
            // Append new
            card.append(`<div class="tour-full-details" style="display: none;">${richHTML}</div>`);
            modified = true;
        }
    });

    if (modified) {
        fs.writeFileSync(filename, $.html());
        console.log(`Updated ${filename} with rich HTML!`);
    } else {
        console.log(`No changes made to ${filename}.`);
    }
}

convertFile('tours.html');
convertFile('index.html');
