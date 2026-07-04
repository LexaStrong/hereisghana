const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const BASE_DIR = path.join(__dirname);
const ASSETS_DIR = path.join(BASE_DIR, 'assets');
const TOURS_DIR = path.join(BASE_DIR, 'tours');
const EXPLORE_DIR = path.join(BASE_DIR, 'explore');

// Create directories
[ASSETS_DIR, path.join(ASSETS_DIR, 'css'), path.join(ASSETS_DIR, 'js'), path.join(ASSETS_DIR, 'images'), TOURS_DIR, EXPLORE_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Move Assets
const moveFile = (src, dest) => {
    if (fs.existsSync(src)) fs.renameSync(src, dest);
};

moveFile(path.join(BASE_DIR, 'style.css'), path.join(ASSETS_DIR, 'css', 'style.css'));
moveFile(path.join(BASE_DIR, 'script.js'), path.join(ASSETS_DIR, 'js', 'script.js'));

// Move Images folder contents
const moveFolder = (srcDir, destDir) => {
    if (!fs.existsSync(srcDir)) return;
    const items = fs.readdirSync(srcDir);
    items.forEach(item => {
        const srcPath = path.join(srcDir, item);
        const destPath = path.join(destDir, item);
        if (fs.statSync(srcPath).isDirectory()) {
            if (!fs.existsSync(destPath)) fs.mkdirSync(destPath);
            moveFolder(srcPath, destPath);
        } else {
            moveFile(srcPath, destPath);
        }
    });
};
moveFolder(path.join(BASE_DIR, 'images'), path.join(ASSETS_DIR, 'images'));

// Map files to new destinations
const htmlFiles = fs.readdirSync(BASE_DIR).filter(file => file.endsWith('.html'));

const fileMap = {};
htmlFiles.forEach(file => {
    if (file.startsWith('tour-')) {
        fileMap[file] = `tours/${file}`;
    } else if (file.startsWith('explore-')) {
        fileMap[file] = `explore/${file}`;
    } else {
        fileMap[file] = file;
    }
});

const getDepth = (filePath) => (filePath.match(/\//g) || []).length;

const getRelativePath = (fromPath, toPath) => {
    const fromDepth = getDepth(fromPath);
    const prefix = fromDepth > 0 ? '../'.repeat(fromDepth) : '';
    return prefix + toPath;
};

// Process HTML files
Object.keys(fileMap).forEach(file => {
    const srcPath = path.join(BASE_DIR, file);
    const destPath = path.join(BASE_DIR, fileMap[file]);
    const fileDepth = getDepth(fileMap[file]);
    const assetPrefix = fileDepth > 0 ? '../'.repeat(fileDepth) : '';

    let content = fs.readFileSync(srcPath, 'utf8');
    const $ = cheerio.load(content);

    // Update Links
    $('link[href="style.css"]').attr('href', `${assetPrefix}assets/css/style.css`);
    $('script[src="script.js"]').attr('src', `${assetPrefix}assets/js/script.js`);
    
    $('[href]').each((i, el) => {
        const href = $(el).attr('href');
        if (href && !href.startsWith('http') && !href.startsWith('#')) {
            // Check if it's an image
            if (href.startsWith('images/')) {
                $(el).attr('href', `${assetPrefix}assets/${href}`);
            } else if (fileMap[href]) {
                $(el).attr('href', getRelativePath(fileMap[file], fileMap[href]));
            } else if (href === 'contact.html') {
                $(el).attr('href', getRelativePath(fileMap[file], 'contact.html'));
            }
        }
    });

    $('[src]').each((i, el) => {
        const src = $(el).attr('src');
        if (src && src.startsWith('images/')) {
            $(el).attr('src', `${assetPrefix}assets/${src}`);
        }
    });

    $('[style*="url(\'images/"]').each((i, el) => {
        let style = $(el).attr('style');
        style = style.replace(/url\('images\//g, `url('${assetPrefix}assets/images/`);
        $(el).attr('style', style);
    });

    // Update Book Now buttons
    if (fileMap[file].startsWith('tours/') || fileMap[file].startsWith('explore/')) {
        const title = $('h1').text().trim();
        $('.booking-card a.btn').attr('href', '#');
        $('.booking-card a.btn').addClass('open-booking-modal');
        $('.booking-card a.btn').attr('data-activity', title);
        $('.booking-card a.btn').text('REQUEST TO BOOK'); // Standardize text
    }

    // Inject SEO, GEO, AEO
    const metaTitle = $('title').text();
    const seoHtml = `
    <!-- Advanced SEO, GEO & AEO -->
    <meta name="description" content="Discover curated African experiences, luxury travel, and bespoke itineraries with Here is Ghana Tours. Experience the rich culture, history, and wildlife of Ghana.">
    <meta name="keywords" content="Ghana tours, diaspora travel, heritage tours Ghana, West Africa travel, custom itineraries, luxury travel Ghana, Kakum, Cape Coast, Accra city tour">
    <meta name="geo.region" content="GH">
    <meta name="geo.placename" content="Accra">
    <meta name="geo.position" content="5.6037;-0.1870">
    <meta name="ICBM" content="5.6037, -0.1870">
    <meta property="og:title" content="${metaTitle}">
    <meta property="og:description" content="Bespoke travel and curated African experiences in Ghana. Book your custom itinerary today.">
    <meta property="og:type" content="website">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${metaTitle}">
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "TravelAgency",
      "name": "Here is Ghana Tours",
      "image": "https://www.example.com/assets/images/logo.png",
      "@id": "",
      "url": "https://www.example.com",
      "telephone": "+233000000000",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "20 Boundary Rd",
        "addressLocality": "Accra",
        "addressCountry": "GH"
      }  
    }
    </script>
    `;

    // Only inject if not already injected
    if (!content.includes('Advanced SEO')) {
        $('head').append(seoHtml);
    }

    // Modal HTML Injection (add to end of body)
    if (!$('#bookingModal').length) {
        const modalHtml = `
        <!-- Booking Modal -->
        <div id="bookingModal" class="modal-overlay">
            <div class="modal-content">
                <span class="close-modal"><i class='bx bx-x'></i></span>
                <h3 style="margin-bottom: 20px; font-family: var(--font-body);">Book Your Experience</h3>
                <form>
                    <div class="form-group">
                        <label>Full Name</label>
                        <input type="text" class="form-control" placeholder="John Doe">
                    </div>
                    <div class="form-group">
                        <label>Email Address</label>
                        <input type="email" class="form-control" placeholder="john@example.com">
                    </div>
                    <div class="form-group">
                        <label>Selected Activity</label>
                        <input type="text" id="modalActivity" class="form-control" readonly>
                    </div>
                    <div class="form-group">
                        <label>Preferred Date</label>
                        <input type="date" class="form-control">
                    </div>
                    <div class="form-group">
                        <label>Travelers</label>
                        <select class="form-control">
                            <option>1 Adult</option>
                            <option>2 Adults</option>
                            <option>Family</option>
                            <option>Group</option>
                        </select>
                    </div>
                    <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 10px;">CONFIRM REQUEST</button>
                </form>
            </div>
        </div>
        `;
        $('body').append(modalHtml);
    }

    fs.writeFileSync(destPath, $.html());
    
    // Remove old file if it moved
    if (fileMap[file] !== file) {
        fs.unlinkSync(srcPath);
    }
});

console.log("Refactor complete.");
