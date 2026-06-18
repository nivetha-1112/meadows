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

        // Touch Swipe support for Mobile
        let touchStartX = 0;
        let touchStartY = 0;
        let touchStartTime = 0;
        const swipeThreshold = 50; // minimum distance in px
        const swipeMaxTime = 500;  // maximum time in ms

        hlTrack.addEventListener("touchstart", (e) => {
            const touch = e.changedTouches[0];
            touchStartX = touch.pageX;
            touchStartY = touch.pageY;
            touchStartTime = Date.now();
        }, { passive: true });

        hlTrack.addEventListener("touchend", (e) => {
            const touch = e.changedTouches[0];
            const touchEndX = touch.pageX;
            const touchEndY = touch.pageY;
            const touchElapsedTime = Date.now() - touchStartTime;

            const diffX = touchEndX - touchStartX;
            const diffY = touchEndY - touchStartY;

            // Check if swipe is horizontal and within time/distance thresholds
            if (touchElapsedTime <= swipeMaxTime && Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) >= swipeThreshold) {
                const cardsPerView = getHlCardsPerView();
                const maxIndex = Math.max(0, hlTotalCards - cardsPerView);

                if (diffX < 0) {
                    // Swiped Left -> Go Next
                    if (hlCurrentIndex < maxIndex) {
                        hlCurrentIndex++;
                    } else {
                        hlCurrentIndex = 0; // Loop back
                    }
                } else {
                    // Swiped Right -> Go Prev
                    if (hlCurrentIndex > 0) {
                        hlCurrentIndex--;
                    } else {
                        hlCurrentIndex = maxIndex; // Loop to end
                    }
                }
                updateHlSlider();
            }
        }, { passive: true });

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
       5. NEW PREMIUM FLOOR PLAN TABS & SUB-TABS
       ========================================== */
    const floorPlansData = {
        "b1-car-parking": {
            subtitle: "BLOCK - 1 | CAR PARKING",
            img: "assets/FloorPlans/carparkingplan.png",
            meta: "Ground Floor | Car Parking Plan"
        },
        "b1-1st-floor": {
            subtitle: "BLOCK - 1 | 1ST FLOOR PLAN",
            img: "assets/FloorPlans/firtsfp.png",
            meta: "First Floor Plan"
        },
        "b1-5th-floor": {
            subtitle: "BLOCK - 1 | 5TH FLOOR PLAN",
            img: "assets/FloorPlans/floorplan005.png",
            meta: "5A | 3BHK | 1520 Sq.Ft | North Facing | Private Terrace"
        },
        "b1-2bhk": {
            subtitle: "BLOCK - 1 | APARTMENT - 1H, 2H, 3H, 4H",
            img: "assets/FloorPlans/floorplan002.png",
            meta: "East Facing | 2BHK | 1010 Sq.Ft"
        },
        "b1-3bhk": {
            subtitle: "BLOCK - 1 | APARTMENT - 1A, 2A, 3A, 4A",
            img: "assets/FloorPlans/floorplan001.png",
            meta: "North Facing | 3BHK | 1520 Sq.Ft"
        }
    };


    const sidebarTabs = document.querySelectorAll(".floor-sidebar-tab");
    const floorSubtitle = document.getElementById("floor-subtitle");
    const activePlanImg = document.getElementById("active-floor-plan-img");
    const activePlanZoomBtn = document.getElementById("active-floor-plan-zoom");
    const floorMetaText = document.getElementById("floor-meta-text");

    const updateFloorPlanDisplay = (plan) => {
        // Set visual elements
        if (floorSubtitle) floorSubtitle.textContent = plan.subtitle;
        if (activePlanImg) {
            activePlanImg.style.opacity = "0.2";
            setTimeout(() => {
                activePlanImg.src = plan.img;
                activePlanImg.alt = plan.subtitle;
                activePlanImg.style.opacity = "1";
            }, 150);
        }
        if (floorMetaText) floorMetaText.textContent = plan.meta;
        if (activePlanZoomBtn) {
            activePlanZoomBtn.setAttribute("data-img", plan.img);
            activePlanZoomBtn.setAttribute("data-title", plan.subtitle);
        }
    };

    const handleTabActivation = (tabKey) => {
        const data = floorPlansData[tabKey];
        if (!data) return;

        updateFloorPlanDisplay(data);
    };

    sidebarTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            sidebarTabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            
            const tabKey = tab.getAttribute("data-tab");
            handleTabActivation(tabKey);
        });
    });

    // Initialize with first tab active
    if (sidebarTabs.length > 0) {
        handleTabActivation("b1-car-parking");
    }



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

                // Trigger Brochure PDF Download
                const link = document.createElement("a");
                link.href = "assets/Meadows Brochure.pdf"; // Fallback to logo image so download works. Replace with assets/brochure.pdf when available.
                link.target = "_blank";
                link.download = "ATH_Meadows_Brochure.pdf";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
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

    /* ==========================================
       9. DYNAMIC YOUTUBE EMBED ON CLICK
       ========================================== */
    const videoPlaceholders = document.querySelectorAll(".video-placeholder");
    videoPlaceholders.forEach(placeholder => {
        placeholder.addEventListener("click", () => {
            const videoId = placeholder.getAttribute("data-video-id");
            if (window.location.protocol === "file:") {
                // Bypass local file:// origin restrictions by opening in a new tab
                window.open(`https://www.youtube.com/watch?v=${videoId}`, "_blank");
            } else {
                // Load inline autoplay iframe on http/https web servers
                const iframe = document.createElement("iframe");
                iframe.className = "map-video-iframe";
                iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
                iframe.title = "ATH Meadows Apartment Walkthrough";
                iframe.frameBorder = "0";
                iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
                iframe.allowFullscreen = true;

                // Replace placeholder contents with the iframe
                placeholder.parentNode.replaceChild(iframe, placeholder);
            }
        });
    });

    /* ==========================================
       10. BACK TO TOP BUTTON
       ========================================== */
    const backToTopBtn = document.getElementById("back-to-top-btn");

    if (backToTopBtn) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add("show");
            } else {
                backToTopBtn.classList.remove("show");
            }
        });

        backToTopBtn.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    /* ==========================================
       11. ENQUIRY POPUP MODAL (FORM FLOW)
       ========================================== */
    const enquiryModal = document.getElementById("enquiry-modal");
    const heroEnquireBtn = document.getElementById("hero-enquire-btn");
    const enquiryModalCloseBtn = document.getElementById("enquiry-modal-close-btn");
    const enquiryFormContainer = document.getElementById("enquiry-form-container");
    const enquiryStep3 = document.getElementById("enquiry-step-3");
    const popupLeadForm = document.getElementById("popup-lead-form");
    const enquirySuccessCloseBtn = document.getElementById("enquiry-success-close-btn");

    if (enquiryModal) {
        let modalShownOnScroll = false;

        const openEnquiryModal = () => {
            if (enquiryFormContainer) enquiryFormContainer.style.display = "block";
            if (enquiryStep3) enquiryStep3.style.display = "none";
            if (popupLeadForm) popupLeadForm.reset();

            enquiryModal.classList.add("active");
            document.body.style.overflow = "hidden";
            modalShownOnScroll = true;
        };

        // Auto-open enquiry form modal when scrolling down the page
        window.addEventListener("scroll", () => {
            if (!modalShownOnScroll && window.scrollY > 100) {
                openEnquiryModal();
            }
        });

        // Open Modal via Hero Enquire Button
        if (heroEnquireBtn) {
            heroEnquireBtn.addEventListener("click", (e) => {
                e.preventDefault();
                openEnquiryModal();
            });
        }

        // Open Modal via Navbar "Contact Us" Buttons
        const contactUsButtons = document.querySelectorAll(".nav-cta-btn-previous, .nav-btn-mobile");
        contactUsButtons.forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                openEnquiryModal();
            });
        });

        const closeEnquiryModal = () => {
            enquiryModal.classList.remove("active");
            document.body.style.overflow = "auto";
        };

        // Close Modal Actions
        if (enquiryModalCloseBtn) {
            enquiryModalCloseBtn.addEventListener("click", closeEnquiryModal);
        }
        enquiryModal.addEventListener("click", (e) => {
            if (e.target === enquiryModal) closeEnquiryModal();
        });
        if (enquirySuccessCloseBtn) {
            enquirySuccessCloseBtn.addEventListener("click", closeEnquiryModal);
        }

        // Form Submission
        if (popupLeadForm) {
            popupLeadForm.addEventListener("submit", (e) => {
                e.preventDefault();

                const nameField = document.getElementById("popup-name");
                const mobileField = document.getElementById("popup-mobile");
                const emailField = document.getElementById("popup-email");
                let isValid = true;

                document.querySelectorAll("#popup-lead-form .form-group").forEach(grp => grp.classList.remove("invalid"));

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
                    // Transition to Success Step
                    if (enquiryFormContainer) enquiryFormContainer.style.display = "none";
                    if (enquiryStep3) enquiryStep3.style.display = "block";
                }
            });
        }
    }

    /* ==========================================
       12. FLOOR PLAN ENQUIRE CLICK (BROCHURE DOWNLOAD)
       ========================================== */
    const floorPlanEnquireBtns = document.querySelectorAll(".floor-plan-enquire-btn");
    floorPlanEnquireBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // Trigger Brochure PDF Download
            const link = document.createElement("a");
            link.href = "assets/Meadows Brochure.pdf";
            link.target = "_blank";
            link.download = "ATH_Meadows_Brochure.pdf";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    });
});
