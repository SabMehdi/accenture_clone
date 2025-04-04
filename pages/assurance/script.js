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
});