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

});