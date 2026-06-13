/* ==========================================================================
   ATH MEADOWS LANDING PAGE - BRAND INTERACTIONS
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ==========================================
       1. STICKY NAVBAR NAVIGATION
       ========================================== */
    const navbar = document.getElementById("navbar");
    const navLinksList = document.querySelectorAll(".nav-link");
    
    window.addEventListener("scroll", () => {
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add("scrolled");
            } else {
                navbar.classList.remove("scrolled");
            }
        }
        
        // Active link highlighting on scroll
        let currentSection = "";
        const sections = document.querySelectorAll("section");
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute("id");
            }
        });
        
        navLinksList.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${currentSection}`) {
                link.classList.add("active");
            }
        });
    });


    /* ==========================================
       2. MOBILE MENU NAVIGATION
       ========================================== */
    const menuToggle = document.getElementById("menu-toggle");
    const navLinks = document.getElementById("nav-links");
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => {
            menuToggle.classList.toggle("active");
            navLinks.classList.toggle("mobile-active");
        });

        // Close menu when a link is clicked
        navLinks.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                menuToggle.classList.remove("active");
                navLinks.classList.remove("mobile-active");
            });
        });
    }



    /* ==========================================
       3.1 PROJECT HIGHLIGHTS SLIDER
       ========================================== */
    const hlTrack = document.getElementById("highlights-track");
    const hlPrevBtn = document.getElementById("highlights-prev");
    const hlNextBtn = document.getElementById("highlights-next");
    const hlDotsContainer = document.getElementById("highlights-dots");
    
    let hlCurrentIndex = 0;
    const hlCards = document.querySelectorAll(".highlight-premium-card");
    const hlTotalCards = hlCards.length;

    const getHlCardsPerView = () => {
        if (window.innerWidth <= 576) return 1;
        if (window.innerWidth <= 991) return 2;
        return 3;
    };

    const updateHlSlider = () => {
        const cardsPerView = getHlCardsPerView();
        const maxIndex = Math.max(0, hlTotalCards - cardsPerView);
        
        if (hlCurrentIndex > maxIndex) {
            hlCurrentIndex = maxIndex;
        }

        if (hlCards.length > 0) {
            const cardWidth = hlCards[0].offsetWidth;
            const gap = 30; // Matches CSS gap
            const moveDistance = hlCurrentIndex * (cardWidth + gap);
            
            if (hlTrack) {
                hlTrack.style.transform = `translateX(-${moveDistance}px)`;
            }
        }

        // Rebuild dots dynamically: one dot per card (matching user screenshots)
        if (hlDotsContainer) {
            hlDotsContainer.innerHTML = "";
            for (let i = 0; i < hlTotalCards; i++) {
                const dot = document.createElement("span");
                dot.className = `highlights-dot${i === hlCurrentIndex ? " active" : ""}`;
                dot.setAttribute("data-slide", i);
                dot.addEventListener("click", () => {
                    hlCurrentIndex = Math.min(i, maxIndex);
                    updateHlSlider();
                });
                hlDotsContainer.appendChild(dot);
            }
        }
    };

    if (hlTrack && hlCards.length > 0) {
        if (hlNextBtn) {
            hlNextBtn.addEventListener("click", () => {
                const cardsPerView = getHlCardsPerView();
                const maxIndex = Math.max(0, hlTotalCards - cardsPerView);
                if (hlCurrentIndex < maxIndex) {
                    hlCurrentIndex++;
                    updateHlSlider();
                } else {
                    // Loop back to start
                    hlCurrentIndex = 0;
                    updateHlSlider();
                }
            });
        }

        if (hlPrevBtn) {
            hlPrevBtn.addEventListener("click", () => {
                if (hlCurrentIndex > 0) {
                    hlCurrentIndex--;
                    updateHlSlider();
                } else {
                    // Loop to end
                    const cardsPerView = getHlCardsPerView();
                    hlCurrentIndex = Math.max(0, hlTotalCards - cardsPerView);
                    updateHlSlider();
                }
            });
        }

        window.addEventListener("resize", updateHlSlider);
        // Run once initial size is known
        setTimeout(updateHlSlider, 100);
    }
    /* ==========================================
       4. LOCATION TABS SYSTEM
       ========================================== */
    const tabButtons = document.querySelectorAll(".loc-tab-btn");
    const tabImg = document.getElementById("tab-visual-img");
    const landmarkLists = document.querySelectorAll(".location-list");

    const tabImagesMapping = {
        schools: "assets/location-school.png",
        colleges: "assets/location-college.png",
        hospitals: "assets/location-hospital.png",
        banks: "assets/location-bank.png",
        transportation: "assets/location-transport.png"
    };

    const tabMetadata = {
        schools: { title: "Nearby Schools", count: "6 places found" },
        colleges: { title: "Nearby Colleges", count: "4 places found" },
        hospitals: { title: "Nearby Hospitals", count: "4 places found" },
        banks: { title: "Nearby Banks", count: "4 places found" },
        transportation: { title: "Nearby Transportation", count: "4 places found" }
    };

    tabButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const tabKey = btn.getAttribute("data-tab");

            // Update button styling
            tabButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            // Fade out image, swap source, fade in
            if (tabImg) {
                tabImg.style.opacity = "0.2";
                setTimeout(() => {
                    tabImg.src = tabImagesMapping[tabKey];
                    tabImg.style.opacity = "1";
                }, 150);
            }

            // Update active category badge
            const activeBadge = document.getElementById("active-category-badge");
            if (activeBadge) {
                activeBadge.innerHTML = btn.innerHTML;
            }

            // Update list title and count
            const listTitle = document.getElementById("list-dynamic-title");
            const listCount = document.getElementById("list-dynamic-count");
            if (listTitle) {
                listTitle.textContent = tabMetadata[tabKey].title;
            }
            if (listCount) {
                listCount.textContent = tabMetadata[tabKey].count;
            }

            // Toggle Lists
            landmarkLists.forEach(list => {
                list.classList.remove("active");
                if (list.getAttribute("id") === `list-${tabKey}`) {
                    list.classList.add("active");
                }
            });
        });
    });


    /* ==========================================
       5. FLOOR PLAN TOGGLE & FILTER
       ========================================== */
    const planToggleButtons = document.querySelectorAll(".plan-toggle-btn");
    const floorPlanCards = document.querySelectorAll(".floor-plan-card");

    planToggleButtons.forEach(button => {
        button.addEventListener("click", () => {
            planToggleButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");
            
            const selectedType = button.getAttribute("data-type");

            floorPlanCards.forEach(card => {
                const cardType = card.getAttribute("data-plan-type");
                
                if (selectedType === cardType) {
                    card.classList.remove("hide");
                    setTimeout(() => {
                        card.style.opacity = "1";
                        card.style.transform = "scale(1)";
                    }, 50);
                } else {
                    card.style.opacity = "0";
                    card.style.transform = "scale(0.95)";
                    setTimeout(() => {
                        card.classList.add("hide");
                    }, 300);
                }
            });
        });
    });


    /* ==========================================
       6. FLOOR PLAN LIGHTBOX MODAL
       ========================================== */
    const floorplanModal = document.getElementById("floorplan-modal");
    const modalImg = document.getElementById("modal-img");
    const modalPlanTitle = document.getElementById("modal-plan-title");
    const modalCloseBtn = document.getElementById("modal-close-btn");
    const modalDownloadBtn = document.getElementById("modal-download-btn");
    const viewPlanButtons = document.querySelectorAll(".view-plan-btn");

    if (floorplanModal && viewPlanButtons.length > 0) {
        viewPlanButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                const imgSrc = btn.getAttribute("data-img");
                const imgTitle = btn.getAttribute("data-title");
                
                modalImg.src = imgSrc;
                modalPlanTitle.innerText = imgTitle;
                floorplanModal.classList.add("active");
                document.body.style.overflow = "hidden";
            });
        });

        const closeModal = () => {
            floorplanModal.classList.remove("active");
            document.body.style.overflow = "auto";
        };

        modalCloseBtn.addEventListener("click", closeModal);
        floorplanModal.addEventListener("click", (e) => {
            if (e.target === floorplanModal) closeModal();
        });

        modalDownloadBtn.addEventListener("click", () => {
            alert(`Brochure Download Triggered: ${modalPlanTitle.innerText} layout map file.`);
        });
    }

    document.querySelectorAll(".download-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const planType = btn.getAttribute("data-plan");
            alert(`Downloading layout blueprint file: ATH_Meadows_${planType}.pdf`);
        });
    });


    /* ==========================================
       7. LEAD FORM VALIDATION & ACTIONS
       ========================================== */
    const leadForm = document.getElementById("lead-form");
    const heroLeadForm = document.getElementById("hero-lead-form");
    const successOverlay = document.getElementById("form-success");
    const closeSuccessBtn = document.getElementById("close-success-btn");

    const showSuccessMessage = () => {
        if (successOverlay) {
            successOverlay.classList.add("active");
        }
    };

    if (leadForm) {
        leadForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const nameField = document.getElementById("name");
            const mobileField = document.getElementById("mobile");
            const emailField = document.getElementById("email");
            let isValid = true;

            document.querySelectorAll(".form-group").forEach(grp => grp.classList.remove("invalid"));

            if (nameField.value.trim().length < 3) {
                nameField.parentElement.classList.add("invalid");
                isValid = false;
            }

            const phoneRegex = /^[6-9]\d{9}$/;
            if (!phoneRegex.test(mobileField.value.trim())) {
                mobileField.parentElement.classList.add("invalid");
                isValid = false;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailField.value.trim())) {
                emailField.parentElement.classList.add("invalid");
                isValid = false;
            }

            if (isValid) {
                showSuccessMessage();
                leadForm.reset();
            }
        });
    }

    if (heroLeadForm) {
        heroLeadForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const nameField = document.getElementById("strip-name");
            const emailField = document.getElementById("strip-email");
            const phoneField = document.getElementById("strip-phone");
            
            let isValid = true;

            const phoneRegex = /^[6-9]\d{9}$/;
            if (!phoneRegex.test(phoneField.value.trim()) || nameField.value.trim().length < 3) {
                alert("Please fill in valid name and 10-digit mobile number details.");
                isValid = false;
            }

            if (isValid) {
                showSuccessMessage();
                heroLeadForm.reset();
            }
        });
    }

    if (closeSuccessBtn) {
        closeSuccessBtn.addEventListener("click", () => {
            successOverlay.classList.remove("active");
        });
    }


    /* ==========================================
       8. SCROLL REVEAL OBSERVER (AESTHETIC REVEALS)
       ========================================== */
    const revealElements = document.querySelectorAll(".scroll-reveal, .card-reveal-left, .card-reveal-right");

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("revealed");
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealElements.forEach(el => revealObserver.observe(el));
});
