// --- START OF FILE script.js ---

document.addEventListener("DOMContentLoaded", function () {
    const menuIcon = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu-list');
    const closeBtn = document.getElementById('close-menu');
    const dropdownToggles = navMenu.querySelectorAll('.nav-item.dropdown > .nav-links');
    // const backButtons = navMenu.querySelectorAll('.submenu-back-btn'); // No longer needed
    const tabletBreakpoint = 960; // The breakpoint where mobile styles START

    // --- Burger Menu Toggle ---
    menuIcon.addEventListener('click', () => {
        navMenu.classList.add('active');
        menuIcon.style.display = 'none';
    });

    // --- Close Button ---
    closeBtn.addEventListener('click', () => {
        closeMobileMenu();
    });

    // --- Mobile Submenu Accordion Toggle ---
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            // Only activate accordion behavior below the tablet breakpoint
            if (window.innerWidth <= tabletBreakpoint) {
                e.preventDefault(); // Prevent default link behavior
                const parentItem = toggle.closest('.nav-item.dropdown');

                if (parentItem) {
                    // Toggle the 'submenu-open' class for accordion effect
                    parentItem.classList.toggle('submenu-open');

                    // Optional: Close other open submenus when opening a new one
                    // Find all open sibling submenus and close them
                    const openSiblings = parentItem.parentNode.querySelectorAll('.nav-item.dropdown.submenu-open');
                    openSiblings.forEach(sibling => {
                        if (sibling !== parentItem) {
                            sibling.classList.remove('submenu-open');
                        }
                    });
                }
            }
            // Note: For desktop (> tabletBreakpoint), the default link behavior (if href="#")
            // or CSS :hover will handle the dropdown.
        });
    });

    // --- Mobile Submenu Back Button --- (REMOVED - No longer needed for accordion)
    // backButtons.forEach(button => { ... }); // Delete this section

    // --- Helper Function to Close Menu and Reset States ---
    function closeMobileMenu() {
        navMenu.classList.remove('active');
        // navMenu.classList.remove('submenu-visible'); // No longer needed

        // Close any open accordion submenus when closing the main menu
        const openSubmenus = navMenu.querySelectorAll('.nav-item.submenu-open');
        openSubmenus.forEach(submenu => {
            submenu.classList.remove('submenu-open');
        });

        // Show burger icon only if below the breakpoint
        if (window.innerWidth <= tabletBreakpoint) {
             menuIcon.style.display = 'block';
        } else {
             menuIcon.style.display = 'none';
        }
    }

    // --- Close Menu on Resize to Desktop ---
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > tabletBreakpoint) {
                // If menu is active when resizing to desktop, close it
                if (navMenu.classList.contains('active')) {
                   closeMobileMenu();
                }
                 menuIcon.style.display = 'none';
            } else {
                // Resizing back to mobile/tablet
                 if (!navMenu.classList.contains('active')) {
                    // Ensure burger is visible if menu is closed
                    menuIcon.style.display = 'block';
                 } else {
                    // Ensure burger is hidden if menu is open
                    menuIcon.style.display = 'none';
                 }
                 // Reset any potential desktop inline styles on dropdowns if needed
                 // (CSS should handle this, but good to be aware)
                 navMenu.querySelectorAll('.dropdown-content').forEach(dd => {
                    dd.style.display = ''; // Let CSS control display
                 });
            }
        }, 250);
    });

    // --- Optional: Close menu if clicking outside of it on mobile ---
    document.addEventListener('click', (event) => {
        if (window.innerWidth <= tabletBreakpoint && // Only apply this logic on mobile/tablet
            navMenu.classList.contains('active') &&
            !navMenu.contains(event.target) &&
            !menuIcon.contains(event.target))
        {
            closeMobileMenu();
        }
    });

});
// --- END OF FILE script.js ---