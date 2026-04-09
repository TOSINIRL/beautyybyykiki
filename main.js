document.addEventListener('DOMContentLoaded', () => {
    // Header Scroll Effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle (Basic Logic)
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    mobileMenuBtn.addEventListener('click', () => {
        alert('Mobile menu functionality would open a sleek drawer here.');
    });

    // Scroll Reveal Animations
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    
    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        revealElements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < windowHeight - elementVisible) {
                el.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Run once on load

    // --- EmailJS Initialization ---
    // (Ensure you replace these with your actual EmailJS public key in production)
    if (typeof emailjs !== 'undefined') {
        // emailjs.init("YOUR_PUBLIC_KEY");
    }

    // --- Contact Form Handling ---
    const contactForm = document.getElementById('contactForm');
    const contactSubmitBtn = document.getElementById('contactSubmitBtn');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const originalText = contactSubmitBtn.innerText;
            contactSubmitBtn.innerText = "Sending...";
            
            // Example of EmailJS call:
            // emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', '#contactForm')
            setTimeout(() => {
                alert('Thank you for your message! KiKi will get back to you soon.');
                contactForm.reset();
                contactSubmitBtn.innerText = originalText;
            }, 1000);
        });
    }

    // --- Review Form Handling ---
    const reviewForm = document.getElementById('reviewForm');
    if (reviewForm) {
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = reviewForm.querySelector('button');
            const originalText = btn.innerText;
            btn.innerText = "Submitting Review...";

            // Send via EmailJS to moderation inbox
            setTimeout(() => {
                alert('Review submitted for moderation. Thank you for your feedback!');
                reviewForm.reset();
                btn.innerText = originalText;
            }, 1000);
        });
    }

    // --- FAQ Accordion Logic ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            item.classList.toggle('active');
        });
    });

    // Smooth Scroll for Nav Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    // --- About Section Carousel ---
    const track = document.querySelector('.carousel-track');
    const slides = document.querySelectorAll('.carousel-slide');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const carouselDots = document.querySelectorAll('.dot');
    
    let currentSlide = 0;

    const updateCarousel = (index) => {
        if (!track) return;
        track.style.transform = `translateX(-${index * 100}%)`;
        
        carouselDots.forEach(dot => dot.classList.remove('active'));
        if (carouselDots[index]) carouselDots[index].classList.add('active');
        
        slides.forEach(slide => slide.classList.remove('active'));
        if (slides[index]) slides[index].classList.add('active');
        
        currentSlide = index;
    };

    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', () => {
            let nextIndex = (currentSlide + 1) % slides.length;
            updateCarousel(nextIndex);
        });

        prevBtn.addEventListener('click', () => {
            let prevIndex = (currentSlide - 1 + slides.length) % slides.length;
            updateCarousel(prevIndex);
        });
        
        // Auto-play every 5 seconds
        setInterval(() => {
            let nextIndex = (currentSlide + 1) % slides.length;
            updateCarousel(nextIndex);
        }, 5000);
    }

    carouselDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            updateCarousel(index);
        });
    });

    // Touch Swipe Support for Carousel
    let touchStartX = 0;
    let touchEndX = 0;

    if (track) {
        track.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        track.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
    }

    const handleSwipe = () => {
        const threshold = 50; // minimum distance to register a swipe
        if (touchEndX < touchStartX - threshold) {
            // Swipe Left -> Next Slide
            let nextIndex = (currentSlide + 1) % slides.length;
            updateCarousel(nextIndex);
        } else if (touchEndX > touchStartX + threshold) {
            // Swipe Right -> Prev Slide
            let prevIndex = (currentSlide - 1 + slides.length) % slides.length;
            updateCarousel(prevIndex);
        }
    };

    // --- Booking Calendar System ---
    const monthYearLabel = document.getElementById('currentMonthAndYear');
    const calendarDaysGrid = document.getElementById('calendarDays');
    const timeGrid = document.getElementById('timeGrid');
    const selectedDateLabel = document.getElementById('selectedDateLabel');
    const bookingBtn = document.getElementById('bookingBtn');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    
    // Modal Elements
    const successModal = document.getElementById('bookingSuccessModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const modalDate = document.getElementById('modalDate');
    const modalTime = document.getElementById('modalTime');

    // --- Mock Firebase DB for Bookings ---
    // Simulates database to prevent double bookings. Replace with actual Firebase Firestore.
    let mockDatabase = JSON.parse(localStorage.getItem('kiki_bookings')) || {};
    
    const isSlotBooked = (date, time) => {
        return mockDatabase[date] && mockDatabase[date].includes(time);
    };

    const bookSlotInFirebase = (date, time) => {
        if (!mockDatabase[date]) mockDatabase[date] = [];
        mockDatabase[date].push(time);
        localStorage.setItem('kiki_bookings', JSON.stringify(mockDatabase));
    };

    let currentDate = new Date(2025, 11, 1); // December 2025 as default
    let activeSelection = null;
    let selectedStyle = null;
    let selectedTime = null;

    const updateBookingButton = () => {
        if (!bookingBtn) return;
        if (activeSelection && selectedTime) {
            bookingBtn.disabled = false;
            bookingBtn.classList.remove('disabled');
            bookingBtn.innerText = `Book Appointment at ${selectedTime}`;
            bookingBtn.style.opacity = "1";
        } else {
            bookingBtn.disabled = true;
            bookingBtn.classList.add('disabled');
            bookingBtn.style.opacity = "0.5";
            if (!activeSelection) {
                bookingBtn.innerText = "Start by Selecting a Date";
            } else {
                bookingBtn.innerText = "Next: Pick a Time";
            }
        }
    };

    // Modal Events
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            if (successModal) successModal.classList.remove('active');
        });
    }

    if (bookingBtn) {
        bookingBtn.addEventListener('click', () => {
            if (!activeSelection || !selectedTime) return;
            
            // 1. Firebase Check: Prevent double booking at the last second
            if (isSlotBooked(activeSelection, selectedTime)) {
                alert("Sorry, this time slot was just booked by someone else. Please choose another time.");
                renderTimeSlots(); // Refresh to show it as disabled
                selectedTime = null;
                updateBookingButton();
                return;
            }

            const originalText = bookingBtn.innerText;
            bookingBtn.innerText = "Processing Booking...";
            bookingBtn.disabled = true;

            // 2. Process via EmailJS and Save to "Firebase"
            setTimeout(() => {
                bookSlotInFirebase(activeSelection, selectedTime);
                renderTimeSlots(); // Update UI
                
                // Show Success Modal
                if (modalDate) modalDate.innerText = activeSelection;
                if (modalTime) modalTime.innerText = selectedTime;
                if (successModal) successModal.classList.add('active');

                // Reset Button
                bookingBtn.innerText = originalText;
                selectedTime = null;
                updateBookingButton();
            }, 1500);
        });
    }

    const renderCalendar = () => {
        if (!calendarDaysGrid) return;
        calendarDaysGrid.innerHTML = "";
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        
        monthYearLabel.innerText = `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

        const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
        const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

        // Empty slots for previous month days
        for (let i = 0; i < firstDay; i++) {
            const emptySpan = document.createElement('div');
            emptySpan.classList.add('calendar-day', 'day-empty');
            calendarDaysGrid.appendChild(emptySpan);
        }

        // Days of the month
        for (let d = 1; d <= daysInMonth; d++) {
            const dayEl = document.createElement('div');
            dayEl.classList.add('calendar-day');
            dayEl.innerText = d;

            // Specific Unavailable Dates (Dec 24, 25, 26) as per user screenshot
            if (currentDate.getMonth() === 11 && (d === 24 || d === 25 || d === 26)) {
                dayEl.classList.add('day-unavailable');
            }

            // Highlighting specific days from the screenshot for demo
            if (currentDate.getMonth() === 11 && d === 3) dayEl.classList.add('day-active-selected');
            if (currentDate.getMonth() === 11 && d === 27) dayEl.classList.add('day-selected-secondary');

            dayEl.addEventListener('click', () => {
                if (dayEl.classList.contains('day-unavailable')) return;
                
                document.querySelectorAll('.calendar-day').forEach(el => {
                    el.classList.remove('day-active-selected');
                    // Keep the demo's secondary selection visible unless clicked
                });
                
                dayEl.classList.add('day-active-selected');
                activeSelection = `${months[currentDate.getMonth()]} ${d}, ${currentDate.getFullYear()}`;
                selectedDateLabel.innerText = activeSelection;
                updateBookingButton();
                renderTimeSlots();
            });

            calendarDaysGrid.appendChild(dayEl);
        }
    };

    const renderTimeSlots = () => {
        // Updated to 7:00 AM - 10:00 PM range
        const times = [
            "7:00 AM", "8:30 AM", "10:00 AM", "11:30 AM", 
            "1:00 PM", "2:30 PM", "4:00 PM", "5:30 PM", 
            "7:00 PM", "8:30 PM", "10:00 PM"
        ];
        timeGrid.innerHTML = "";
        
        let hasAvailable = false;
        times.forEach(t => {
            const btn = document.createElement('button');
            btn.classList.add('time-btn');
            btn.innerText = t;
            
            // Check Firebase mock for availability
            if (activeSelection && isSlotBooked(activeSelection, t)) {
                btn.disabled = true;
                btn.style.opacity = "0.3";
                btn.style.textDecoration = "line-through";
                btn.style.cursor = "not-allowed";
            } else {
                hasAvailable = true;
                btn.onclick = () => {
                    document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    selectedTime = t;
                    updateBookingButton();
                };
            }
            timeGrid.appendChild(btn);
        });

        if (!hasAvailable) {
            timeGrid.innerHTML = '<div class="time-placeholder">Fully booked for this date. Check another day!</div>';
        }
    };

    if (prevMonthBtn && nextMonthBtn) {
        prevMonthBtn.onclick = () => {
            currentDate.setMonth(currentDate.setMonth() - 1);
            renderCalendar();
        };

        nextMonthBtn.onclick = () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar();
        };
    }

    renderCalendar();

    // --- Luxury GOLD DUST Particle System ---
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouse = { x: null, y: null };

        const resize = () => {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            ctx.scale(dpr, dpr);
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
            createParticles();
        };

        const updateMousePosition = (x, y) => {
            mouse.x = x;
            mouse.y = y;
        };

        window.addEventListener('mousemove', (e) => updateMousePosition(e.x, e.y));
        window.addEventListener('touchstart', (e) => {
            if (e.touches[0]) updateMousePosition(e.touches[0].clientX, e.touches[0].clientY);
        }, { passive: true });
        window.addEventListener('touchmove', (e) => {
            if (e.touches[0]) updateMousePosition(e.touches[0].clientX, e.touches[0].clientY);
        }, { passive: true });
        window.addEventListener('touchend', () => {
            mouse.x = null;
            mouse.y = null;
        });

        class Particle {
            constructor() {
                this.init();
            }

            init() {
                this.x = Math.random() * window.innerWidth;
                this.y = Math.random() * window.innerHeight;
                this.size = Math.random() * 2.5 + 0.8; // Larger
                this.speedX = (Math.random() - 0.5) * 0.4;
                this.speedY = (Math.random() - 0.5) * 0.4;
                this.color = '#4A3B2F'; // Rich Brown / Charcoal
                this.opacity = Math.random() * 0.4 + 0.2; // Even more subtle
                this.life = Math.random() * 100;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // Mouse influence - Subtle Attraction
                if (mouse.x && mouse.y) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < 200) {
                        this.x += dx / 120; // Slower, more elegant
                        this.y += dy / 120;
                    }
                }

                if (this.x < 0 || this.x > window.innerWidth) this.speedX *= -1;
                if (this.y < 0 || this.y > window.innerHeight) this.speedY *= -1;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.globalAlpha = this.opacity;
                // Subtle neutral shadow
                ctx.shadowBlur = 2;
                ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }

        const createParticles = () => {
            const count = Math.floor((window.innerWidth * window.innerHeight) / 7000); // Slightly fewer
            particles = [];
            for (let i = 0; i < count; i++) {
                particles.push(new Particle());
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw mouse glow - Very Faint Neutral Glow
            if (mouse.x && mouse.y) {
                const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 300);
                gradient.addColorStop(0, 'rgba(74, 59, 47, 0.08)'); // Very faint brown
                gradient.addColorStop(1, 'rgba(245, 235, 224, 0)');
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            particles.forEach((p, i) => {
                p.update();
                p.draw();

                // Connect nearby particles - Dark Brown / Black
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 120) {
                        ctx.beginPath();
                        ctx.strokeStyle = '#0A0A0A'; // Black connections
                        ctx.globalAlpha = (1 - distance / 120) * 0.1; // Very faint
                        ctx.lineWidth = 0.4;
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }

                // Connect particles to mouse - Subtle Brown
                if (mouse.x && mouse.y) {
                    const dx = p.x - mouse.x;
                    const dy = p.y - mouse.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < 180) {
                        ctx.beginPath();
                        ctx.strokeStyle = '#4A3B2F'; // Brown connection
                        ctx.globalAlpha = (1 - distance / 180) * 0.15;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.stroke();
                    }
                }
            });
            requestAnimationFrame(animate);
        };

        resize();
        createParticles();
        animate();
    }
});
