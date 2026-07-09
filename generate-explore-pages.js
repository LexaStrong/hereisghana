// Script to generate individual explore detail pages
// Run with: node generate-explore-pages.js

const fs = require('fs');
const path = require('path');

const attractions = [
    {
        num: 1,
        title: "Kwame Nkrumah Memorial Park",
        slug: "explore-kwame-nkrumah",
        img: "https://placehold.co/600x400/1f3b33/ffffff?text=Kwame%20Nkrumah%20Memorial%20Park",
        category: "Monuments & Statues",
        rating: "4.0",
        reviews: "938",
        desc: "The final resting place of Ghana's first President and Africanist, Osagyefo Dr. Kwame Nkrumah. The park holds immense historical significance for the pan-African movement and Ghana's independence. The mausoleum is set within beautifully landscaped gardens that represent the serenity and accomplishments of Nkrumah's legacy.",
        expectations: ["Mausoleum Architecture", "Personal Artifacts Museum", "Guided History Tour", "Landscaped Memorial Gardens"],
        exists: true
    },
    {
        num: 2,
        title: "Kakum National Park",
        slug: "explore-kakum-national-park",
        img: "https://upload.wikimedia.org/wikipedia/commons/1/16/Kakum.jpg",
        category: "National Parks",
        rating: "4.2",
        reviews: "750",
        desc: "Kakum National Park, located in the coastal environs of the Central Region of Ghana, covers an area of 375 square kilometres. Established in 1931 as a reserve, it was gazetted as a national park only in 1992. The uniqueness of this park lies in the fact that it was established at the initiative of the local people. It is one of only 3 locations in Africa with a canopy walkway, which is 350 metres long and connects seven tree tops.",
        expectations: ["Canopy Walkway Experience", "Tropical Rainforest Hiking", "Wildlife & Bird Watching", "Guided Nature Tours"]
    },
    {
        num: 3,
        title: "Anagkazo Campus. ABMTC Ghana",
        slug: "explore-anagkazo-campus",
        img: "https://placehold.co/600x400/1f3b33/ffffff?text=Anagkazo%20Campus.%20ABMTC%20Ghana",
        category: "Nature & Wildlife Areas",
        rating: "5.0",
        reviews: "185",
        desc: "Anagkazo Campus, home to the Anagkazo Bible and Ministry Training Centre (ABMTC), is a beautiful and serene campus located in Ghana. It serves as a spiritual retreat and training ground, offering visitors a tranquil environment surrounded by nature.",
        expectations: ["Campus Tour", "Spiritual Retreat Experience", "Scenic Grounds", "Cultural Immersion"]
    },
    {
        num: 4,
        title: "Makola Market",
        slug: "explore-makola-market",
        img: "https://upload.wikimedia.org/wikipedia/commons/4/46/Makola_Market_Entrance%2C_Accra%2C_Ghana.JPG",
        category: "Flea & Street Markets",
        rating: "4.0",
        reviews: "202",
        desc: "Makola Market is a marketplace and shopping district in the center of Accra, the capital of Ghana. A wide array of products is sold in the markets and its surrounding streets, from car parts to land snails. Dominated by women traders, the market sells fresh produce, manufactured and imported foods, clothes, shoes, tools, medicines, and pots and pans. Jewellery made from locally handcrafted beads can also be found for sale.",
        expectations: ["Vibrant Market Experience", "Local Textiles & Beads", "Traditional Crafts Shopping", "Authentic Ghanaian Culture"]
    },
    {
        num: 5,
        title: "Aburi Botanical Gardens",
        slug: "explore-aburi-gardens",
        img: "https://upload.wikimedia.org/wikipedia/commons/1/12/Aburi_garden_2.jpg",
        category: "Gardens",
        rating: "3.9",
        reviews: "373",
        desc: "Aburi Botanical Gardens is a garden in Aburi in the Eastern Region of Ghana. The Garden occupies an area of 64.8 hectares. It was opened in March 1890 and was founded by Governor William Brandford-Griffith and Dr. John Farrell Easmon. The gardens played an important role in encouraging cocoa production in South Ghana, by supplying cheap cocoa seedlings and information about scientific farming methods.",
        expectations: ["Historic Colonial-Era Gardens", "Diverse Plant Species", "Peaceful Nature Walks", "Scenic Mountain Views"]
    },
    {
        num: 6,
        title: "Bojo Beach",
        slug: "explore-bojo-beach",
        img: "https://placehold.co/600x400/1f3b33/ffffff?text=Bojo%20Beach",
        category: "Beaches",
        rating: "3.9",
        reviews: "387",
        desc: "Bojo Beach is a beautiful and serene beach destination in Ghana, offering a peaceful retreat from the bustling city of Accra. Accessible by a short boat ride across a lagoon, the beach provides a unique and exclusive experience with its clean sands, calm waters, and lush coconut palms.",
        expectations: ["Boat Ride Across Lagoon", "Clean Sandy Beach", "Swimming & Relaxation", "Beachside Dining"]
    },
    {
        num: 7,
        title: "Cape Coast Castle",
        slug: "explore-cape-coast-castle",
        img: "https://upload.wikimedia.org/wikipedia/commons/a/a0/Cape_Coast_Castle%2C_Cape_Coast%2C_Ghana.JPG",
        category: "Castles",
        rating: "4.5",
        reviews: "636",
        desc: "Cape Coast Castle is one of about forty \"slave castles\" built on the Gold Coast of West Africa (now Ghana) by European traders. Originally a Portuguese trading post established in 1555, it later became a center for the Atlantic slave trade. The castle is included on the UNESCO World Heritage List because of its testimony to the Atlantic gold and slave trades. Walk through the dungeons and the infamous \"Door of No Return\".",
        expectations: ["UNESCO World Heritage Site", "Historical Dungeon Tours", "Door of No Return", "Museum & Exhibits"]
    },
    {
        num: 8,
        title: "Elmina Castle",
        slug: "explore-elmina-castle",
        img: "https://upload.wikimedia.org/wikipedia/commons/a/a7/Elmina_Castle_-_Ghana.jpg",
        category: "Historic Sites",
        rating: "4.5",
        reviews: "495",
        desc: "Elmina Castle, or Fort St. George, was erected by the Portuguese in 1482. It holds several profound distinctions: it was the first trading post built on the Gulf of Guinea and is the oldest extant European building in Sub-Saharan Africa. The castle is recognised by UNESCO as a World Heritage Site because of its place in the Atlantic slave trade.",
        expectations: ["Oldest European Building in Sub-Saharan Africa", "UNESCO World Heritage Site", "Guided Historical Tour", "Fishing Harbor Views"]
    },
    {
        num: 9,
        title: "Wli Waterfalls",
        slug: "explore-wli-waterfalls",
        img: "https://placehold.co/600x400/1f3b33/ffffff?text=Wli%20Waterfalls",
        category: "Waterfalls",
        rating: "4.6",
        reviews: "191",
        desc: "Wli Waterfalls, located in the Volta Region of Ghana, is the tallest waterfall in West Africa. The falls are situated within the Agumatsa Wildlife Sanctuary and can be reached via a scenic trek through lush tropical forest. The lower falls are accessible to most visitors, while the upper falls require a more challenging hike.",
        expectations: ["Tallest Waterfall in West Africa", "Nature Trek Through Forest", "Wildlife Sanctuary", "Swimming at the Falls"]
    },
    {
        num: 10,
        title: "Labadi Beach",
        slug: "explore-labadi-beach",
        img: "https://upload.wikimedia.org/wikipedia/commons/3/39/Solnedgang_p%C3%A5_Labadi_beach.jpg",
        category: "Beaches",
        rating: "3.4",
        reviews: "650",
        desc: "Labadi Beach, more properly known as La Pleasure Beach, is the busiest beach on Ghana's coast. It is one of Accra's beaches and is maintained by the local hotels. On holidays and weekends there are often performances of reggae, hiplife, playback, and cultural drumming and dancing. Aside from visiting the beach to have fun, people visit the place early morning to work out.",
        expectations: ["Vibrant Beach Atmosphere", "Live Music & Performances", "Local Food Vendors", "Horse Riding on Beach"]
    },
    {
        num: 11,
        title: "Osu Castle",
        slug: "explore-osu-castle",
        img: "https://upload.wikimedia.org/wikipedia/commons/4/46/Osu_Castle_%28also_known_as_Fort_Christiansborg_or_Christiansborg_Castle%29_in_Accra%2C_Ghana.jpg",
        category: "Castles",
        rating: "4.1",
        reviews: "68",
        desc: "Osu Castle (also known as Fort Christiansborg) is a castle located in Osu, Accra, on the coast of the Gulf of Guinea. Built by Denmark-Norway in the 1660s, it served as the seat of government for the Danish Gold Coast and later the British Gold Coast. In 1902, it became the seat of government in the Gold Coast. It is inscribed on the UNESCO World Heritage List.",
        expectations: ["UNESCO World Heritage Site", "Colonial-Era Architecture", "Historical Government Seat", "Coastal Views"]
    },
    {
        num: 12,
        title: "Accra Mall",
        slug: "explore-accra-mall",
        img: "https://upload.wikimedia.org/wikipedia/commons/d/d6/Accra_Mall_%28Entrance%29.jpg",
        category: "Shopping Malls",
        rating: "3.9",
        reviews: "353",
        desc: "Accra Mall is a shopping mall in Accra, Ghana, located near the Tetteh Quarshie Interchange. Commissioned on 4 July 2008, it is the first fully enclosed mall to be built in the country. As of 2017, approximately 7 million people visit the mall annually. It offers a wide range of retail shops, restaurants, and entertainment options.",
        expectations: ["Modern Shopping Experience", "International & Local Brands", "Food Court & Restaurants", "Cinema & Entertainment"]
    },
    {
        num: 13,
        title: "Shai Hills Resource Reserve",
        slug: "explore-shai-hills",
        img: "https://upload.wikimedia.org/wikipedia/commons/1/1b/Shai_Hills_Resource_Reserve.jpg",
        category: "Nature & Wildlife Areas",
        rating: "3.7",
        reviews: "72",
        desc: "Shai Hills Resource Reserve is a resource reserve located in Doryumu in the Shai Osudoku District, Greater Accra Region of southern Ghana. It lies along the Tema-Akosombo Highway some 57 km from Accra. The reserve offers hiking trails, caves with bat colonies, and opportunities to spot baboons, antelopes, and various bird species.",
        expectations: ["Wildlife Viewing", "Hiking Trails", "Bat Cave Exploration", "Scenic Rock Formations"]
    },
    {
        num: 14,
        title: "Artists Alliance Gallery",
        slug: "explore-artists-alliance",
        img: "https://placehold.co/600x400/1f3b33/ffffff?text=Artists%20Alliance%20Gallery",
        category: "Art Galleries",
        rating: "4.7",
        reviews: "44",
        desc: "Artists Alliance Gallery is a renowned art gallery in Ghana that showcases the works of talented Ghanaian and African artists. The gallery features a diverse collection of paintings, sculptures, textiles, and mixed media works that celebrate African culture and creativity.",
        expectations: ["Contemporary African Art", "Local Artist Exhibitions", "Handcrafted Sculptures", "Art Purchases Available"]
    },
    {
        num: 15,
        title: "Kokrobite Beach",
        slug: "explore-kokrobite-beach",
        img: "https://upload.wikimedia.org/wikipedia/commons/b/b8/Samvera_Summers.jpg",
        category: "Beaches",
        rating: "3.7",
        reviews: "99",
        desc: "Kokrobite is a town along the Atlantic coast, 30 km west of Accra. It is known for traditional sea fishing, its white-sand beaches and its lively nightlife. Kokrobite is a popular destination for tourists, backpackers and international volunteers seeking beaches and a break from the busy capital city.",
        expectations: ["White Sand Beach", "Traditional Drumming & Dancing", "Academy of African Music and Arts", "Beachside Nightlife"]
    },
    {
        num: 16,
        title: "W.E.B. DuBois Center",
        slug: "explore-dubois-center",
        img: "https://placehold.co/600x400/1f3b33/ffffff?text=W.E.B.%20DuBois%20Center",
        category: "Historic Sites",
        rating: "4.2",
        reviews: "118",
        desc: "The W.E.B. Du Bois Memorial Centre for Pan-African Culture is a research institute and memorial in Accra, Ghana, dedicated to the life and work of W.E.B. Du Bois. Du Bois spent the last years of his life in Ghana, becoming a citizen before his death in 1963. The centre houses his personal library, papers, and his gravesite.",
        expectations: ["Pan-African History Museum", "Du Bois Personal Library", "Gravesite & Memorial", "Research Archives"]
    },
    {
        num: 17,
        title: "Boti Falls",
        slug: "explore-boti-falls",
        img: "https://upload.wikimedia.org/wikipedia/commons/7/71/Boti_Falls%2C_Eastern_Region.JPG",
        category: "Waterfalls",
        rating: "3.7",
        reviews: "42",
        desc: "Boti Falls is a twin waterfall located at Boti in Yilo Krobo District in the Eastern Region of Ghana. These twin falls come from two rivers and are referred to as female and male; according to local myth, a rainbow is formed when they merge. During full flow you are surrounded in a canyon of falling water, reached at the bottom of 250 concrete steps.",
        expectations: ["Twin Waterfall Experience", "250-Step Descent", "Rainbow Formation (Rainy Season)", "Umbrella Rock Nearby"]
    },
    {
        num: 18,
        title: "Mole National Park",
        slug: "explore-mole-national-park",
        img: "https://upload.wikimedia.org/wikipedia/commons/6/69/Elefant_Ghana.jpg",
        category: "National Parks",
        rating: "4.3",
        reviews: "173",
        desc: "Mole National Park is Ghana's largest wildlife refuge covering about 4,577 square kilometers of fairly undisturbed Guinea savannah in the northern part of Ghana. The park is also Ghana's most developed tourism site in terms of tourist amenities and features West Africa's first luxury safari lodge.",
        expectations: ["Elephant & Wildlife Sightings", "Safari Lodge Accommodation", "Guided Walking Safaris", "Bird Watching (300+ Species)"],
        exists: true
    },
    {
        num: 19,
        title: "Kejetia Market",
        slug: "explore-kejetia-market",
        img: "https://upload.wikimedia.org/wikipedia/commons/1/15/Kumasi.jpg",
        category: "Flea & Street Markets",
        rating: "4.1",
        reviews: "67",
        desc: "The Kumasi Central Market, also known as Kejetia Market, is an open-air marketplace in Kumasi, a city in the Ashanti Region of Ghana. The market has over 8,000 stores and stalls, making it the largest single market in West Africa. About 50,000 people visit the market daily, while there are 20,000 vendors operating in it.",
        expectations: ["Largest Market in West Africa", "Traditional Kente Cloth", "Local Crafts & Souvenirs", "Authentic Ashanti Culture"]
    },
    {
        num: 20,
        title: "See Ghana Dmc",
        slug: "explore-see-ghana-dmc",
        img: "https://placehold.co/600x400/1f3b33/ffffff?text=See%20Ghana%20Dmc",
        category: "Nature & Wildlife Areas",
        rating: "5.0",
        reviews: "43",
        desc: "Tourism in Ghana is regulated by the Ministry of Tourism, Arts & Culture. This ministry is responsible for the development and promotion of tourism related activities in Ghana. See Ghana DMC provides curated destination management services to help visitors explore the best of Ghana.",
        expectations: ["Guided Tours", "Destination Management", "Custom Itineraries", "Local Expert Guides"]
    },
    {
        num: 21,
        title: "Legon Botanical Gardens",
        slug: "explore-legon-gardens",
        img: "https://placehold.co/600x400/1f3b33/ffffff?text=Legon%20Botanical%20Gardens",
        category: "Gardens",
        rating: "4.0",
        reviews: "17",
        desc: "Legon Botanical Gardens is a beautiful garden located near the University of Ghana campus in Accra. The gardens offer a peaceful escape from city life with walking trails, canopy walkways, picnic areas, and a variety of tropical plants and trees. It's a popular destination for families and nature lovers.",
        expectations: ["Canopy Walkway", "Nature Walks", "Picnic Areas", "Bird Watching"]
    },
    {
        num: 22,
        title: "Lake Bosumtwi",
        slug: "explore-lake-bosumtwi",
        img: "https://upload.wikimedia.org/wikipedia/commons/d/d7/An_Explosive_Beginning_for_Lake_Bosumtwi_%28154739_-_151229_lrg%29.jpg",
        category: "Points of Interest & Landmarks",
        rating: "4.0",
        reviews: "42",
        desc: "Lake Bosomtwe, also spelled Bosumtwi, is the only natural lake in Ghana. It is situated within an ancient impact crater that is about 10.5 kilometres in diameter. About 30 km south-east of Kumasi, the capital of Ashanti, it is a popular recreational area. The Ashanti consider Bosomtwe a sacred lake.",
        expectations: ["Sacred Ashanti Lake", "Ancient Impact Crater", "Swimming & Boat Rides", "Village Visits Around the Lake"]
    },
    {
        num: 23,
        title: "Manhyia Palace Museum",
        slug: "explore-manhyia-palace",
        img: "https://upload.wikimedia.org/wikipedia/commons/0/0a/Manhyia_Palace_Museum.jpg",
        category: "Speciality Museums",
        rating: "4.1",
        reviews: "140",
        desc: "The Manhyia Palace is the seat of the Asantehene, as well as his official residence. It is located in Manhyia, Kumasi, the capital of the Ashanti Region of Ghana. The first palace is now a museum showcasing Ashanti royal heritage, artifacts, and the rich history of the Ashanti Kingdom.",
        expectations: ["Ashanti Royal Heritage", "Historical Artifacts", "Guided Palace Tour", "Cultural Education"]
    },
    {
        num: 24,
        title: "Busua Beach",
        slug: "explore-busua-beach",
        img: "https://placehold.co/600x400/1f3b33/ffffff?text=Busua%20Beach",
        category: "Beaches",
        rating: "4.6",
        reviews: "27",
        desc: "Busua is a beach resort and fishing village in the Ahanta West District of the Western Region in Ghana, about 30 kilometers west of Sekondi-Takoradi in the Gulf of Guinea. The inhabitants speak the Akan language dialect Ahanta. Busua fishing village is known for blue marlin and tuna fishery.",
        expectations: ["Surfing & Water Sports", "Fishing Village Experience", "Scenic Western Coast", "Relaxed Beach Atmosphere"]
    },
    {
        num: 25,
        title: "Tafi Atome Monkey Sanctuary",
        slug: "explore-tafi-atome",
        img: "https://upload.wikimedia.org/wikipedia/commons/d/d8/Tafi_Atome_Monkey_Sanctuary.jpg",
        category: "Nature & Wildlife Areas",
        rating: "4.4",
        reviews: "74",
        desc: "Tafi Atome Monkey Sanctuary is a traditional sacred grove conservation established in 1993 as a community-based ecotourism project. Tafi Atome is the home of mona and patas monkeys. Visitors can interact with the friendly monkeys in their natural habitat and learn about local conservation efforts.",
        expectations: ["Mona Monkey Interaction", "Sacred Grove Walk", "Community Ecotourism", "Nature Photography"]
    },
    {
        num: 26,
        title: "Accra Zoo",
        slug: "explore-accra-zoo",
        img: "https://placehold.co/600x400/1f3b33/ffffff?text=Accra%20Zoo",
        category: "Zoos",
        rating: "3.3",
        reviews: "12",
        desc: "Accra Zoo is a zoological garden in the heart of Accra, Ghana. The zoo houses a variety of animals including lions, hyenas, monkeys, and various bird species. It provides an educational and family-friendly experience for visitors wanting to see African wildlife.",
        expectations: ["African Wildlife", "Educational Tours", "Family-Friendly Experience", "Variety of Animal Species"]
    },
    {
        num: 27,
        title: "Sajuna Beach Club",
        slug: "explore-sajuna-beach-club",
        img: "https://upload.wikimedia.org/wikipedia/commons/3/38/Akosombo_Dam_hydroelectric_plant.jpg",
        category: "Sports Complexes",
        rating: "3.9",
        reviews: "16",
        desc: "Sajuna Beach Club is a recreational sports complex in Ghana offering visitors a blend of water sports, relaxation, and entertainment. The club provides a premium experience with its well-maintained facilities and scenic waterfront location.",
        expectations: ["Water Sports", "Beach Relaxation", "Premium Facilities", "Scenic Waterfront"]
    },
    {
        num: 28,
        title: "Mount Afadja",
        slug: "explore-mount-afadja",
        img: "https://upload.wikimedia.org/wikipedia/commons/5/54/Mountain_Afadja.jpg",
        category: "Mountains",
        rating: "4.8",
        reviews: "22",
        desc: "Mount Afadja, known as Afadjato to the Ewe people of Ghana and Togo, is one of the highest mountains in Ghana. The summit is located in the Volta Region, near the border with Togo. Part of the Agumatsa sub-range of the West Africa Mountains, it offers stunning panoramic views from the top.",
        expectations: ["Mountain Hiking", "Panoramic Views", "Volta Region Scenery", "Physical Adventure Challenge"]
    },
    {
        num: 29,
        title: "Oxford Street, Accra",
        slug: "explore-oxford-street",
        img: "https://placehold.co/600x400/1f3b33/ffffff?text=Oxford%20Street%2C%20Accra",
        category: "Points of Interest & Landmarks",
        rating: "3.7",
        reviews: "80",
        desc: "Oxford Street in the Osu neighborhood of Accra is one of the city's most vibrant and popular streets. Lined with shops, restaurants, bars, and nightlife venues, it is a hub of activity and a must-visit for anyone exploring Ghana's capital city.",
        expectations: ["Vibrant Nightlife", "Shopping & Street Vendors", "Restaurant Scene", "Cultural Hub of Accra"]
    },
    {
        num: 30,
        title: "Black Star Gate",
        slug: "explore-black-star-gate",
        img: "https://placehold.co/600x400/1f3b33/ffffff?text=Black%20Star%20Gate",
        category: "Historic Sites",
        rating: "4.2",
        reviews: "126",
        desc: "Black Star Gate is a historic monument and landmark in Accra, Ghana. It is part of the Independence Square complex and symbolizes Ghana's independence and the pan-African movement. The gate features the iconic black star, a symbol of African freedom.",
        expectations: ["Independence Square Complex", "Historic Monument", "Pan-African Symbolism", "Photography Spot"]
    }
];

function generateExplorePage(attraction) {
    return `<!DOCTYPE html><html lang="en"><head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${attraction.title} - Here is Ghana Tours</title>
    <link rel="icon" href="../assets/images/logo.png">
    <meta property="og:image" content="images/logo.png">
    <link rel="stylesheet" href="../assets/css/style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&amp;family=Plus+Jakarta+Sans:wght@300;400;500;600;700&amp;display=swap" rel="stylesheet">
    <link href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet">
    <style>
        @media (max-width: 900px) {
            .tour-detail-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>

    <!-- Advanced SEO, GEO & AEO -->
    <meta name="description" content="${attraction.title} - Discover this amazing destination in Ghana with Here is Ghana Tours. ${attraction.desc.substring(0, 150)}">
    <meta name="keywords" content="Ghana tours, ${attraction.title}, ${attraction.category}, Ghana travel, West Africa travel">
    <meta name="geo.region" content="GH">
    <meta name="geo.placename" content="Accra">
    <meta name="geo.position" content="5.6037;-0.1870">
    <meta name="ICBM" content="5.6037, -0.1870">
    <meta property="og:title" content="${attraction.title} - Here is Ghana Tours">
    <meta property="og:description" content="${attraction.desc.substring(0, 200)}">
    <meta property="og:type" content="website">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${attraction.title} - Here is Ghana Tours">
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "TouristAttraction",
      "name": "${attraction.title}",
      "image": "${attraction.img}",
      "description": "${attraction.desc.substring(0, 200).replace(/"/g, '\\"')}",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "GH"
      }
    }
    </script>
    </head>
<body>

    <!-- Navigation -->
    <nav class="navbar solid-nav">
        <div class="container nav-container">
            <a href="../index.html" class="logo">
                <i class="bx bx-landscape"></i>
                <div>
                    <h2>Here is Ghana</h2>
                    <span>TOURS</span>
                </div>
            </a>
            
            <div class="nav-links">
                <a href="../index.html">Home</a>
                <a href="../explore.html" class="active">Explore with Us</a>
                <a href="../tours.html">Tours</a>
                <a href="../about.html">About Us</a>
                <a href="../contact.html">Contact</a>
            </div>

            <a href="../contact.html" class="btn btn-primary nav-btn">BOOK NOW</a>

            <div class="mobile-menu-btn">
                <i class="bx bx-menu"></i>
            </div>
        </div>
    </nav>

    <!-- Mobile Menu -->
    <div class="mobile-menu">
        <div class="mobile-menu-header">
            <a href="../index.html" class="logo">
                <i class="bx bx-landscape"></i>
                <div>
                    <h2>Here is Ghana</h2>
                    <span>TOURS</span>
                </div>
            </a>
            <i class="bx bx-x close-menu"></i>
        </div>
        <div class="mobile-nav-links">
            <a href="../index.html">Home</a>
            <a href="../explore.html" class="active">Explore with Us</a>
            <a href="../tours.html">Tours</a>
            <a href="../about.html">About Us</a>
            <a href="../contact.html">Contact</a>
        </div>
    </div>

    <!-- Page Header -->
    <header class="page-header" style="background-image: url('${attraction.img}');">
        <div class="hero-overlay"></div>
        <div class="container page-header-content">
            <h1>${attraction.title}</h1>
            <p>${attraction.category} &bull; <span style="font-weight:700;">${attraction.rating}</span> <span class="dots">●●●●○</span> (${attraction.reviews} reviews)</p>
        </div>
    </header>

    <!-- Attraction Details -->
    <section class="section">
        <div class="container tour-detail-grid">
            
            <!-- Main Content -->
            <div class="tour-main">
                <h2>About This Attraction</h2>
                <p>${attraction.desc}</p>

                <div class="tour-section">
                    <h3>What to Expect</h3>
                    <ul class="included-list">
                        ${attraction.expectations.map(exp => `<li><i class="bx bx-check-circle"></i> ${exp}</li>`).join('\n                        ')}
                    </ul>
                </div>
            </div>

            <!-- Sidebar -->
            <div class="tour-sidebar">
                <div class="booking-card">
                    <h3>Visit This Attraction</h3>
                    <p style="margin-top: 10px; color: var(--text-light);">Experience ${attraction.title} with a private guide.</p>
                    <a href="../contact.html" class="btn btn-primary open-booking-modal" style="width: 100%; padding: 15px; margin-top: 15px;" data-activity="${attraction.title}">REQUEST TO BOOK</a>
                    <p style="font-size: 0.8rem; text-align: center; margin-top: 15px; color: var(--text-light);">We will build a custom itinerary around this attraction.</p>
                </div>

                <div class="booking-card" style="margin-top: 20px;">
                    <h3>Quick Info</h3>
                    <ul class="tour-meta-list">
                        <li><i class="bx bx-category"></i> ${attraction.category}</li>
                        <li><i class="bx bx-star"></i> Rating: ${attraction.rating}/5 (${attraction.reviews} reviews)</li>
                        <li><i class="bx bx-map"></i> Ghana</li>
                    </ul>
                </div>
            </div>

        </div>
    </section>

    <!-- Back to Explore -->
    <section style="padding: 0 0 60px;">
        <div class="container" style="text-align: center;">
            <a href="../explore.html" class="btn btn-outline"><i class="bx bx-arrow-back"></i> Back to All Attractions</a>
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <div class="container footer-grid">
            <div class="footer-brand">
                <a href="../index.html" class="logo footer-logo">
                    <i class="bx bx-landscape"></i>
                    <div>
                        <h2>Here is Ghana</h2>
                        <span>TOURS</span>
                    </div>
                </a>
                <p style="margin-top: 15px; font-size: 0.9rem; opacity: 0.8;">20 Boundary Rd, Accra<br>Open 08:00 - 22:00 Daily</p>
                <div class="social-links">
                    <a href="https://www.facebook.com/hereisghanatours/" target="_blank"><i class="bx bxl-facebook"></i></a>
                    <a href="https://instagram.com/hereisghanatours" target="_blank"><i class="bx bxl-instagram"></i></a>
                    <a href="https://www.youtube.com/@hereisghanatours4499" target="_blank"><i class="bx bxl-youtube"></i></a>
                    <a href="https://www.tripadvisor.com/Attraction_Review-g293797-d19071267-Reviews-Here_is_Ghana_Tours-Accra_Greater_Accra.html" target="_blank"><i class="bx bxl-trip-advisor"></i></a>
                </div>
            </div>
            
            <div class="footer-links">
                <h4>COMPANY</h4>
                <ul>
                    <li><a href="../about.html">About Us</a></li>
                    <li><a href="../tours.html">Our Tours</a></li>
                    <li><a href="../contact.html">Contact</a></li>
                </ul>
            </div>
            
            <div class="footer-links">
                <h4>SUPPORT</h4>
                <ul>
                    <li><a href="../about.html#faq">FAQs</a></li>
                    <li><a href="#">Terms &amp; Conditions</a></li>
                    <li><a href="#">Privacy Policy</a></li>
                    <li><a href="#">Cancellation Policy</a></li>
                </ul>
            </div>

            <div class="footer-links">
                <h4>EXPLORE WITH US</h4>
                <ul>
                    <li><a href="explore-greater-accra.html">Accra</a></li>
                    <li><a href="explore-eastern-volta.html">Cape Coast</a></li>
                    <li><a href="explore-eastern-volta.html">Volta Region</a></li>
                    <li><a href="explore-northern.html">Northern Region</a></li>
                </ul>
            </div>

            <div class="footer-contact">
                <h4>LET'S PLAN YOUR DREAM TRIP</h4>
                <p>Speak with our travel experts</p>
                <a href="../contact.html" class="btn btn-outline">CONTACT US</a>
            </div>
        </div>
    </footer>

    <script src="../assets/js/script.js"></script>

        <!-- Booking Modal -->
        <div id="bookingModal" class="modal-overlay">
            <div class="modal-content">
                <span class="close-modal"><i class="bx bx-x"></i></span>
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
                        <input type="text" id="modalActivity" class="form-control" readonly="">
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
        </body></html>`;
}

// Generate pages
const exploreDir = path.join(__dirname, 'explore');

attractions.forEach(attraction => {
    if (attraction.exists) {
        console.log(`SKIP (exists): ${attraction.slug}.html`);
        return;
    }
    const filePath = path.join(exploreDir, `${attraction.slug}.html`);
    const html = generateExplorePage(attraction);
    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`CREATED: ${attraction.slug}.html`);
});

console.log('\nDone! Generated explore pages.');
