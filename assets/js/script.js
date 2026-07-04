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
                
                if (detailsTitle) detailsTitle.textContent = title;
                if (detailsImg) detailsImg.src = img;
                if (detailsDesc) detailsDesc.textContent = desc;
                if (detailsBookBtn) detailsBookBtn.setAttribute('data-activity', title);
                
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
    } // <-- Added missing brace

    // Testimonial Slider Logic
    const testimonialItems = document.querySelectorAll('.testimonial-item');
    const dots = document.querySelectorAll('.testimonial-text .dot');
    const prevBtn = document.getElementById('prevTestimonial');
    const nextBtn = document.getElementById('nextTestimonial');
    
    if (testimonialItems.length > 0) {
        let currentSlide = 0;

        const showSlide = (index) => {
            testimonialItems.forEach(item => item.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));
            
            testimonialItems[index].classList.add('active');
            dots[index].classList.add('active');
            currentSlide = index;
        };

        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => {
                let newIndex = currentSlide - 1;
                if (newIndex < 0) newIndex = testimonialItems.length - 1;
                showSlide(newIndex);
            });

            nextBtn.addEventListener('click', () => {
                let newIndex = currentSlide + 1;
                if (newIndex >= testimonialItems.length) newIndex = 0;
                showSlide(newIndex);
            });
        }

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showSlide(index);
                resetInterval();
            });
        });

        // 3s Auto Slideshow
        let slideInterval;
        
        const startInterval = () => {
            slideInterval = setInterval(() => {
                if (nextBtn) nextBtn.click();
            }, 3000);
        };

        const resetInterval = () => {
            clearInterval(slideInterval);
            startInterval();
        };

        startInterval();
        
        if (prevBtn) prevBtn.addEventListener('click', resetInterval);
        if (nextBtn) nextBtn.addEventListener('click', resetInterval);
    }
});
