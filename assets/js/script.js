document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const closeBtn = document.querySelector('.close-menu');
    const navLinks = document.querySelectorAll('.mobile-nav-links a');

    // Open mobile menu
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.add('open');
        document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
    });

    // Close mobile menu
    const closeMenu = () => {
        mobileMenu.classList.remove('open');
        document.body.style.overflow = 'auto'; // Restore scrolling
    };

    closeBtn.addEventListener('click', closeMenu);

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Booking Modal Logic
    const bookingModal = document.getElementById('bookingModal');
    const openModalBtns = document.querySelectorAll('.open-booking-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const modalActivityInput = document.getElementById('modalActivity');

    if (bookingModal) {
        openModalBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const activityName = btn.getAttribute('data-activity');
                if (modalActivityInput && activityName) {
                    modalActivityInput.value = activityName;
                }
                bookingModal.style.display = 'block';
            });
        });

        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => {
                bookingModal.style.display = 'none';
            });
        }

        window.addEventListener('click', (e) => {
            if (e.target === bookingModal) {
                bookingModal.style.display = 'none';
            }
        });
        
        const form = bookingModal.querySelector('form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                alert('Thank you! Your booking request has been submitted.');
                bookingModal.style.display = 'none';
            });
        }
    }

    // Details Modal Logic
    const detailsModal = document.getElementById('detailsModal');
    const openDetailsBtns = document.querySelectorAll('.open-details-modal');
    
    if (detailsModal) {
        const detailsImg = detailsModal.querySelector('.details-modal-img');
        const detailsTitle = detailsModal.querySelector('.details-title');
        const detailsDesc = detailsModal.querySelector('.details-desc');
        const detailsBookBtn = detailsModal.querySelector('.open-booking-modal');
        const closeDetailsBtn = detailsModal.querySelector('.close-modal');

        openDetailsBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                // If clicked on the book button inside the card, ignore
                if(e.target.classList.contains('ta-card-btn')) return; 
                
                const title = btn.getAttribute('data-title');
                const img = btn.getAttribute('data-img');
                const desc = btn.getAttribute('data-desc');
                const fullDetails = btn.querySelector('.tour-full-details');
                
                const modalBody = detailsModal.querySelector('.details-modal-body');
                
                if (fullDetails) {
                    modalBody.innerHTML = fullDetails.innerHTML;
                    if (detailsImg) detailsImg.src = img || '';
                    
                    // Re-bind booking buttons
                    const injectedBtns = modalBody.querySelectorAll('.open-booking-modal');
                    injectedBtns.forEach(b => {
                        b.addEventListener('click', (ev) => {
                            ev.preventDefault();
                            const act = b.getAttribute('data-activity') || title;
                            const modalActivityInput = document.getElementById('modalActivity');
                            if (modalActivityInput) modalActivityInput.value = act;
                            detailsModal.style.display = 'none';
                            const bookingModal = document.getElementById('bookingModal');
                            if (bookingModal) bookingModal.style.display = 'block';
                        });
                    });
                } else {
                    modalBody.innerHTML = `
                        <h2 class="details-title">${title}</h2>
                        <p class="details-desc">${desc}</p>
                        <button class="btn btn-primary open-booking-modal" data-activity="${title}" style="width: 100%;">BOOK THIS EXPERIENCE</button>
                    `;
                    if (detailsImg) detailsImg.src = img || '';
                    
                    const bookBtn = modalBody.querySelector('.open-booking-modal');
                    if (bookBtn) {
                        bookBtn.addEventListener('click', (ev) => {
                            ev.preventDefault();
                            const modalActivityInput = document.getElementById('modalActivity');
                            if (modalActivityInput) modalActivityInput.value = title;
                            detailsModal.style.display = 'none';
                            const bookingModal = document.getElementById('bookingModal');
                            if (bookingModal) bookingModal.style.display = 'block';
                        });
                    }
                }
                
                detailsModal.style.display = 'block';
            });
        });

        if (closeDetailsBtn) {
            closeDetailsBtn.addEventListener('click', () => {
                detailsModal.style.display = 'none';
            });
        }

        window.addEventListener('click', (e) => {
            if (e.target === detailsModal) {
                detailsModal.style.display = 'none';
            }
        });
        
        // Ensure book button inside details modal closes details and opens booking
        if (detailsBookBtn) {
            detailsBookBtn.addEventListener('click', () => {
                detailsModal.style.display = 'none';
            });
        }
    }

    // Testimonial Slider Logic
    const testimonialItems = document.querySelectorAll('.testimonial-item');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    let currentTestimonial = 0;
    let testimonialInterval;

    if (testimonialItems.length > 0) {
        const showTestimonial = (index) => {
            testimonialItems.forEach(item => item.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));
            
            testimonialItems[index].classList.add('active');
            dots[index].classList.add('active');
        };

        const nextTestimonial = () => {
            currentTestimonial = (currentTestimonial + 1) % testimonialItems.length;
            showTestimonial(currentTestimonial);
        };

        const prevTestimonialFunc = () => {
            currentTestimonial = (currentTestimonial - 1 + testimonialItems.length) % testimonialItems.length;
            showTestimonial(currentTestimonial);
        };

        const startSlider = () => {
            testimonialInterval = setInterval(nextTestimonial, 3000);
        };

        const stopSlider = () => {
            clearInterval(testimonialInterval);
        };

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                stopSlider();
                nextTestimonial();
                startSlider();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                stopSlider();
                prevTestimonialFunc();
                startSlider();
            });
        }

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                stopSlider();
                currentTestimonial = index;
                showTestimonial(currentTestimonial);
                startSlider();
            });
        });

        startSlider();
    }

    // Explore Page "Show More" Mobile Logic
    const exploreGrid = document.querySelector('.ta-grid');
    // Ensure this is the explore page (which has 30 items)
    if (exploreGrid && exploreGrid.children.length > 6 && window.location.pathname.includes('explore')) {
        exploreGrid.classList.add('mobile-collapsed');
        
        const showMoreContainer = document.createElement('div');
        showMoreContainer.className = 'show-more-container';
        showMoreContainer.style.textAlign = 'center';
        showMoreContainer.style.marginTop = '30px';
        
        const showMoreBtn = document.createElement('button');
        showMoreBtn.className = 'btn btn-outline show-more-btn';
        showMoreBtn.textContent = 'Show More Attractions';
        showMoreBtn.style.width = '100%';
        
        showMoreContainer.appendChild(showMoreBtn);
        exploreGrid.parentNode.insertBefore(showMoreContainer, exploreGrid.nextSibling);
        
        showMoreBtn.addEventListener('click', () => {
            exploreGrid.classList.remove('mobile-collapsed');
            showMoreContainer.style.display = 'none';
        });
    }

});
