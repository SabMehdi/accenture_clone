document.addEventListener("DOMContentLoaded", function () {
    const menuIcon = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu-list');
    const closeBtn = document.getElementById('close-menu');
    const dropdownToggles = navMenu.querySelectorAll('.nav-item.dropdown > .nav-links');
    const backButtons = navMenu.querySelectorAll('.submenu-back-btn');
    const mobileBreakpoint = 960; // Match SCSS variable

    // --- Burger Menu Toggle ---
    menuIcon.addEventListener('click', () => {
        navMenu.classList.add('active'); // Show the menu panel
        menuIcon.style.display = 'none'; // <<< HIDE the burger icon
    });

    // --- Close Button ---
    closeBtn.addEventListener('click', () => {
        closeMobileMenu();
    });

    // --- Mobile Submenu Open ---
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            if (window.innerWidth <= mobileBreakpoint) {
                e.preventDefault();
                const parentItem = toggle.closest('.nav-item.dropdown');
                if (parentItem) {
                    parentItem.classList.add('submenu-active');
                    navMenu.classList.add('submenu-visible');
                }
            }
        });
    });

    // --- Mobile Submenu Back Button ---
    backButtons.forEach(button => {
        button.addEventListener('click', () => {
            const parentItem = button.closest('.nav-item.dropdown');
            if (parentItem) {
                parentItem.classList.remove('submenu-active');
                navMenu.classList.remove('submenu-visible');
            }
        });
    });

    // --- Helper Function to Close Menu and Reset States ---
    function closeMobileMenu() {
        navMenu.classList.remove('active');
        navMenu.classList.remove('submenu-visible');

        const activeSubmenu = navMenu.querySelector('.nav-item.submenu-active');
        if (activeSubmenu) {
            activeSubmenu.classList.remove('submenu-active');
        }

        // Check if we are still in mobile view before showing the burger
        // This prevents it from showing if resized to desktop while menu was open
        if (window.innerWidth <= mobileBreakpoint) {
             menuIcon.style.display = 'block'; // <<< SHOW the burger icon again
        }
        // If window is wider than breakpoint, CSS rules should already hide it,
        // but setting it explicitly ensures it's hidden if JS ever showed it incorrectly.
        else {
             menuIcon.style.display = 'none';
        }
    }

    // --- Close Menu on Resize to Desktop ---
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // Always check the current state on resize finish
            if (window.innerWidth > mobileBreakpoint) {
                // If menu is active when resizing to desktop, close it
                if (navMenu.classList.contains('active')) {
                   closeMobileMenu(); // This will now also handle burger display
                }
                 // Ensure burger is hidden on desktop regardless of menu state
                 menuIcon.style.display = 'none';
            } else {
                // If resizing back to mobile AND the menu is NOT active,
                // ensure the burger icon is visible (CSS should handle this, but JS can reinforce)
                 if (!navMenu.classList.contains('active')) {
                    menuIcon.style.display = 'block';
                 }
                 // If menu IS active on mobile, burger should remain hidden (handled by open/close logic)
            }
        }, 250);
    });

    // --- Optional: Close menu if clicking outside of it on mobile ---
    document.addEventListener('click', (event) => {
        if (navMenu.classList.contains('active') &&
            !navMenu.contains(event.target) &&
            !menuIcon.contains(event.target)) { // Make sure click wasn't on the (now hidden) burger space
            closeMobileMenu(); // This will now also show the burger
        }
    });

//   const purpleNavbar = document.getElementById('purpleNavbar');
  const purpleNavToggle = document.getElementById('purpleNavToggle');
  const purpleNavMenu = document.getElementById('purpleNavMenu');

  if (purpleNavToggle && purpleNavbar && purpleNavMenu) {

    purpleNavToggle.addEventListener('click', () => {
      purpleNavbar.classList.toggle('purple-menu-open');
      const isExpanded = purpleNavToggle.getAttribute('aria-expanded') === 'true';
      purpleNavToggle.setAttribute('aria-expanded', !isExpanded);
    });

    document.addEventListener('click', (event) => {
        const isClickInsidePurpleNav = purpleNavbar.contains(event.target);
        if (!isClickInsidePurpleNav && purpleNavbar.classList.contains('purple-menu-open')) {
            purpleNavbar.classList.remove('purple-menu-open');
            purpleNavToggle.setAttribute('aria-expanded', 'false');
        }
    });

    purpleNavMenu.querySelectorAll('.purple-nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (purpleNavbar.classList.contains('purple-menu-open')) {
                purpleNavbar.classList.remove('purple-menu-open');
                purpleNavToggle.setAttribute('aria-expanded', 'false');
            }
        });
    });

  }
   /////////////////////////////////////////////////////////////////////////////////////////////////
   
   const segmentTriggers = document.querySelectorAll('.segments-nav .segment-trigger');
   const segmentPanes = document.querySelectorAll('.segments-content .segment-pane');

   if (segmentTriggers.length === 0 || segmentPanes.length === 0) {
       console.warn("Segments navigation or content panes not found.");
       return; // Exit if elements aren't found
   }

   // Function to switch segments
   function switchSegment(targetSegmentId) {
       // Deactivate all triggers and panes
       segmentTriggers.forEach(trigger => trigger.classList.remove('active'));
       segmentPanes.forEach(pane => pane.classList.remove('active'));

       // Find the matching trigger and pane
       const activeTrigger = document.querySelector(`.segment-trigger[data-segment="${targetSegmentId}"]`);
       const activePane = document.querySelector(`.segment-pane[data-segment="${targetSegmentId}"]`);

       // Activate the selected ones
       if (activeTrigger) {
           activeTrigger.classList.add('active');
       }
       if (activePane) {
           activePane.classList.add('active');
       } else {
           console.warn(`Content pane for segment "${targetSegmentId}" not found.`);
       }
   }

   // Add click event listeners to triggers
   segmentTriggers.forEach(trigger => {
       trigger.addEventListener('click', (event) => {
           const targetSegment = event.target.dataset.segment;
           if (targetSegment) {
               switchSegment(targetSegment);
           }
       });

       // Optional: Add keyboard support (Enter/Space)
       trigger.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault(); // Prevent default space scroll/enter submit
                const targetSegment = event.target.dataset.segment;
                if (targetSegment) {
                    switchSegment(targetSegment);
                }
            }
        });
   });


   /////////////////////////////////////////////////////////////////////////////////////////////

   const slider = document.querySelector('.partners-slider');
   if (!slider) return; // Exit if slider element doesn't exist

   const track = slider.querySelector('.partners-track');
   const cards = slider.querySelectorAll('.partner-card');
   const prevButton = slider.querySelector('.slider-btn.prev');
   const nextButton = slider.querySelector('.slider-btn.next');

   if (!track || !prevButton || !nextButton || cards.length === 0) {
       console.warn('Slider elements (track, buttons, or cards) not found.');
       if(prevButton) prevButton.style.display = 'none'; // Hide buttons if setup fails
       if(nextButton) nextButton.style.display = 'none';
       return;
   }

   let currentIndex = 0;
   let cardWidth = 0;
   let trackGap = 0;
   let cardsInView = calculateCardsInView(); // Function to determine based on viewport

   function calculateCardWidthAndGap() {
       if (cards.length > 0) {
           const cardStyle = window.getComputedStyle(cards[0]);
           //offsetWidth includes padding and border, but not margin
           cardWidth = cards[0].offsetWidth;

           // Get gap value from the track's style
           const trackStyle = window.getComputedStyle(track);
           trackGap = parseFloat(trackStyle.gap) || 0;

           // Effective width for sliding includes the gap
           return cardWidth + trackGap;
       }
       return 0; // No cards
   }

   function calculateCardsInView() {
       // This is an approximation - determines how many cards *mostly* fit
       // You might adjust this logic based on your specific card widths/breakpoints
       const viewportWidth = slider.querySelector('.partners-viewport').clientWidth;
       const slideWidth = calculateCardWidthAndGap();
       if (slideWidth > 0) {
           // See how many full cards + gaps fit
            return Math.max(1, Math.floor(viewportWidth / slideWidth));
       }
       return 1; // Default to 1 if calculation fails
   }


   function updateSliderPosition() {
       const slideWidth = calculateCardWidthAndGap();
       if (slideWidth > 0) {
            // Calculate the total offset needed
           const offset = -currentIndex * slideWidth;
           track.style.transform = `translateX(${offset}px)`;
       }
       updateButtonStates();
   }

   function updateButtonStates() {
       // Disable prev button if at the beginning
       prevButton.disabled = currentIndex === 0;

       // Disable next button if the last potential full view is reached
       // We can slide until the 'cardsInView'-th card from the end is reached
       const maxIndex = cards.length - cardsInView; // Or adjust based on how you want the end to behave
        nextButton.disabled = currentIndex >= maxIndex || maxIndex <= 0; // also disable if not enough cards to scroll

       // Alternative end condition: disable when the *last* card is fully visible or partially visible at the end
       // const lastCardFullyVisibleIndex = cards.length - cardsInView;
       // nextButton.disabled = currentIndex >= lastCardFullyVisibleIndex;

       // Simpler end condition: Disable when you can't slide one more full card width
       // nextButton.disabled = currentIndex >= cards.length - 1; // Might allow empty space at the end
   }


   function handleResize() {
       // Recalculate based on new viewport size
       cardsInView = calculateCardsInView();
       // Snap back to a valid position if current index becomes invalid
       const maxIndex = Math.max(0, cards.length - cardsInView);
        if (currentIndex > maxIndex) {
            currentIndex = maxIndex;
        }
       updateSliderPosition(); // Adjust position and button states
   }

   // Event Listeners
   nextButton.addEventListener('click', () => {
       const maxIndex = cards.length - cardsInView;
       if (currentIndex < maxIndex) {
           currentIndex++;
           updateSliderPosition();
       }
   });

   prevButton.addEventListener('click', () => {
       if (currentIndex > 0) {
           currentIndex--;
           updateSliderPosition();
       }
   });

   // Resize listener
   let resizeTimerSection;
   window.addEventListener('resize', () => {
       clearTimeout(resizeTimerSection);
       resizeTimerSection = setTimeout(handleResize, 250); // Debounce resize events
   });

   // Initial setup
   handleResize(); // Calculate initial state

    // Hide buttons if there are not enough cards to scroll
    if (cards.length <= cardsInView) {
        prevButton.style.display = 'none';
        nextButton.style.display = 'none';
    }

});