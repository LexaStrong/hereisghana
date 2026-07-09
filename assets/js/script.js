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

    // Details modal removed — cards now link to dedicated pages

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
