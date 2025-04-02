document.addEventListener("DOMContentLoaded", function () {
    const menuIcon = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu-list');
    const closeBtn = document.getElementById('close-menu');
    const dropdownToggles = navMenu.querySelectorAll('.nav-item.dropdown > .nav-links');
    const backButtons = navMenu.querySelectorAll('.submenu-back-btn');
    const mobileBreakpoint = 960; // Match SCSS variable

    // --- Burger Menu Toggle ---
    menuIcon.addEventListener('click', () => {
        // menuIcon.classList.toggle('is-active'); // Optional: for styling the burger icon itself
        navMenu.classList.add('active'); // Use add, removal is handled by close button or resize
    });

    // --- Close Button ---
    closeBtn.addEventListener('click', () => {
        closeMobileMenu();
    });

    // --- Mobile Submenu Open ---
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            // Only activate submenu logic on mobile
            if (window.innerWidth <= mobileBreakpoint) {
                e.preventDefault(); // Prevent default link behavior on mobile tap

                const parentItem = toggle.closest('.nav-item.dropdown');
                if (parentItem) {
                    // Activate the specific submenu
                    parentItem.classList.add('submenu-active');
                    // Add class to main menu to hide other top-level items
                    navMenu.classList.add('submenu-visible');
                }
            }
            // On desktop, the default link behavior might be desired, or nothing if it's just a hover menu
        });
    });

    // --- Mobile Submenu Back Button ---
    backButtons.forEach(button => {
        button.addEventListener('click', () => {
            const parentItem = button.closest('.nav-item.dropdown');
            if (parentItem) {
                // Deactivate the specific submenu
                parentItem.classList.remove('submenu-active');
                // Remove class from main menu to show top-level items again
                navMenu.classList.remove('submenu-visible');
            }
        });
    });

    // --- Helper Function to Close Menu and Reset States ---
    function closeMobileMenu() {
        navMenu.classList.remove('active');
        navMenu.classList.remove('submenu-visible'); // Ensure this is removed

        // Find any active submenu item and deactivate it
        const activeSubmenu = navMenu.querySelector('.nav-item.submenu-active');
        if (activeSubmenu) {
            activeSubmenu.classList.remove('submenu-active');
        }

        // menuIcon.classList.remove('is-active'); // Optional burger style reset
    }

    // --- Close Menu on Resize to Desktop ---
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > mobileBreakpoint) {
                // If menu is open when resizing to desktop, close it
                if (navMenu.classList.contains('active')) {
                   closeMobileMenu();
                }
            }
        }, 250); // Debounce resize event
    });

    // --- Optional: Close menu if clicking outside of it on mobile ---
    document.addEventListener('click', (event) => {
        // Check if menu is active, click is outside menu and outside burger icon
        if (navMenu.classList.contains('active') &&
            !navMenu.contains(event.target) &&
            !menuIcon.contains(event.target)) {
            closeMobileMenu();
        }
    });

});