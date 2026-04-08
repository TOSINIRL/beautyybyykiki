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
    const navLinksList = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinksList) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinksList.classList.toggle('active');
        });
    }

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

    // Form Submission Handling
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for your message! KiKi will get back to you soon.');
            contactForm.reset();
        });
    }

    // Smooth Scroll for Nav Links
    const navLinks = document.querySelectorAll('.nav-links a, .nav-cta a, .hero-actions a');
    
    navLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 70;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // If mobile menu is open, close it (basic logic)
                const mobileNav = document.querySelector('.nav-links');
                if (mobileNav && mobileNav.classList.contains('active')) {
                   mobileNav.classList.remove('active');
                }
            }
        });
    });

    // Active Link Highlighting on Scroll
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-links a');

    const highlightNav = () => {
        let scrollY = window.pageYOffset;
        
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 100;
            const sectionId = current.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navItems.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', highlightNav);
    highlightNav();
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
    const bookingService = document.getElementById('bookingService');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');

    let currentDate = new Date(); // Start with current date
    let activeSelection = null;
    let selectedStyle = null;
    let selectedTime = null;

    const clientName = document.getElementById('clientName');
    const clientEmail = document.getElementById('clientEmail');
    const clientPhone = document.getElementById('clientPhone');

    const updateBookingButton = () => {
        if (!bookingBtn) return;
        const service = bookingService ? bookingService.value : null;
        const nameInput = clientName ? clientName.value.trim() : null;
        const emailInput = clientEmail ? clientEmail.value.trim() : null;
        const phoneInput = clientPhone ? clientPhone.value.trim() : null;

        if (service && activeSelection && selectedTime && nameInput && emailInput && phoneInput) {
            bookingBtn.disabled = false;
            bookingBtn.classList.remove('disabled');
            bookingBtn.innerText = `Confirm Booking for ${selectedTime}`;
            bookingBtn.style.opacity = "1";
        } else {
            bookingBtn.disabled = true;
            bookingBtn.classList.add('disabled');
            bookingBtn.style.opacity = "0.5";
            
            if (!service) {
                bookingBtn.innerText = "1. Select a Service";
            } else if (!activeSelection) {
                bookingBtn.innerText = "2. Pick a Date";
            } else if (!selectedTime) {
                bookingBtn.innerText = "3. Pick a Time";
            } else {
                bookingBtn.innerText = "4. Enter Your Contact Info";
            }
        }
    };

    if (bookingService) bookingService.addEventListener('change', updateBookingButton);
    if (clientName) clientName.addEventListener('input', updateBookingButton);
    if (clientEmail) clientEmail.addEventListener('input', updateBookingButton);
    if (clientPhone) clientPhone.addEventListener('input', updateBookingButton);

    if (bookingBtn) {
        // --- EMAILJS CONFIGURATION ---
        // 1. Sign up at emailjs.com
        // 2. Head to 'Account' -> 'API Keys' and copy your Public Key
        // 3. Paste it below:
        const EMAILJS_PUBLIC_KEY = "UlOSlGfDmCQAsy0Aj"; 
        
        if (typeof emailjs !== 'undefined') {
            emailjs.init(EMAILJS_PUBLIC_KEY);
        }

        bookingBtn.addEventListener('click', async () => {
            const bookingData = {
                service: bookingService.value,
                date: activeSelection,
                time: selectedTime,
                name: clientName.value,
                email: clientEmail.value,
                phone: clientPhone.value,
                addDesign: document.getElementById('addDesign').checked ? "Yes (+$5)" : "No"
            };

            bookingBtn.innerText = "Processing Booking...";
            bookingBtn.disabled = true;

            try {
                const serviceID = "service_aj78gfg";
                const stylistTemplateID = "template_ogx7wxe";
                const clientTemplateID = "template_7t6ikwf";

                // 1. Send Alert Email to Stylist
                const emailPromise = emailjs.send(serviceID, stylistTemplateID, {
                    client_name: bookingData.name,
                    client_email: bookingData.email,
                    client_phone: bookingData.phone,
                    service_type: bookingData.service,
                    appointment_date: bookingData.date,
                    appointment_time: bookingData.time,
                    add_design: bookingData.addDesign,
                    to_email: "kikikanu12@gmail.com"
                });

                // 2. Send SMS alert to Stylist (Telus)
                const smsPromise = emailjs.send(serviceID, stylistTemplateID, {
                    client_name: bookingData.name,
                    client_email: bookingData.email,
                    client_phone: bookingData.phone,
                    service_type: bookingData.service,
                    appointment_date: bookingData.date,
                    appointment_time: bookingData.time,
                    to_email: "6479067715@msg.telus.com"
                });

                // 3. Send Confirmation Email to the CLIENT
                const clientPromise = emailjs.send(serviceID, clientTemplateID, {
                    name: bookingData.name,
                    email: bookingData.email,
                    service: bookingData.service,
                    date: bookingData.date,
                    time: bookingData.time,
                    add_design: bookingData.addDesign,
                    to_email: bookingData.email
                });

                const results = await Promise.all([emailPromise, smsPromise, clientPromise]);

                if (results[0].status === 200) {
                    const successModal = document.getElementById('successModal');
                    const modalMessage = document.getElementById('modalMessage');
                    const closeModal = document.getElementById('closeModal');
                    
                    if (successModal && modalMessage) {
                        modalMessage.innerHTML = `
                            <div class="modal-details-list">
                                <p>Hi there 🤎, thank you for booking with BeautyybyyKiKi! 🤎</p>
                                <hr>
                                <p>📍 <strong>Service:</strong> ${bookingData.service}</p>
                                <p>📅 <strong>Date:</strong> ${bookingData.date}</p>
                                <p>⏰ <strong>Time:</strong> ${bookingData.time}</p>
                                <p>🎨 <strong>Add Design:</strong> ${bookingData.addDesign}</p>
                                <p>📍 <strong>Location:</strong> Address will be sent after deposit</p>
                                <hr>
                                <p><strong>Please arrive with:</strong></p>
                                <ul>
                                    <li>Hair washed</li>
                                    <li>Free of buildup</li>
                                </ul>
                                <p>Blowdrying/Detangling is <strong>included</strong>! 🫶🏾</p>
                                <hr>
                                <p>💳 <strong>Deposit & Payment:</strong><br>
                                Your appointment is only secured once your <strong>$15 deposit</strong> is sent. The remaining balance can be paid in <strong>Cash or E-transfer</strong> at your appointment.<br>
                                Deposits are non-refundable. Please provide 24h notice for rescheduling.</p>
                                <p><strong>Email for deposit:</strong> <a href="mailto:kikikanu12@gmail.com">kikikanu12@gmail.com</a></p>
                                <hr>
                                <p>⏰ <strong>Please Note:</strong><br>
                                • Please try arrive on time. If running late, please send a text! 🫶🏾<br>
                                • No extra guests unless approved</p>
                                <hr>
                                <p style="font-style: italic; text-align: center;">If you have any questions, feel free to message me 💌</p>
                                <p style="text-align: center; font-size: 1.1rem;">Thank you for booking with me 🤎<br><strong>BeautyybyyKiKi</strong></p>
                            </div>
                        `;
                        successModal.classList.add('active');
                        
                        // Clear checkbox
                        const designCheckbox = document.getElementById('addDesign');
                        if (designCheckbox) designCheckbox.checked = false;
                        
                        closeModal.addEventListener('click', () => {
                            successModal.classList.remove('active');
                        });
                    }
                    
                    // Reset everything
                    if (bookingService) bookingService.value = "";
                    if (clientName) clientName.value = "";
                    if (clientEmail) clientEmail.value = "";
                    if (clientPhone) clientPhone.value = "";
                    activeSelection = null;
                    selectedTime = null;
                    updateBookingButton();
                    renderCalendar();
                } else {
                    throw new Error('EmailJS Error');
                }
            } catch (err) {
                console.error('Booking failed:', err);
                // Fallback for when keys aren't set up yet
                alert(`System Notification: Booking details captured for ${bookingData.name}. (Note to owner: Please connect your EmailJS Public Key in main.js to receive this via Email/Text!)`);
                bookingBtn.innerText = "Confirm Booking";
                bookingBtn.disabled = false;
            }
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
        const times = [
            "7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", 
            "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", 
            "7:00 PM", "8:00 PM", "9:00 PM", "10:00 PM"
        ];
        timeGrid.innerHTML = "";
        times.forEach(t => {
            const btn = document.createElement('button');
            btn.classList.add('time-btn');
            btn.innerText = t;
            btn.onclick = () => {
                document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                selectedTime = t;
                updateBookingButton();
            };
            timeGrid.appendChild(btn);
        });
    };

    if (prevMonthBtn && nextMonthBtn) {
        prevMonthBtn.onclick = () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
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
            const count = Math.min(Math.floor((window.innerWidth * window.innerHeight) / 10000), 60); 
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
                    
                    if (Math.abs(dx) < 120 && Math.abs(dy) < 120) {
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
