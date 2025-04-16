document.addEventListener("DOMContentLoaded", function () {
  // Navbar menu functionality remains unchanged
  const menuIcon = document.getElementById("mobile-menu");
  const navMenu = document.getElementById("nav-menu-list");
  const closeBtn = document.getElementById("close-menu");
  const dropdownToggles = navMenu.querySelectorAll(
    ".nav-item.dropdown > .nav-links"
  );
  const tabletBreakpoint = 960;

  // Burger Menu Toggle
  menuIcon?.addEventListener("click", () => {
    navMenu.classList.add("active");
    menuIcon.style.display = "none";
  });

  // Close Button
  closeBtn?.addEventListener("click", () => {
    closeMobileMenu();
  });

  // Mobile Submenu Accordion Toggle
  dropdownToggles.forEach((toggle) => {
    toggle.addEventListener("click", (e) => {
      if (window.innerWidth <= tabletBreakpoint) {
        e.preventDefault();
        const parentItem = toggle.closest(".nav-item.dropdown");
        if (parentItem) {
          parentItem.classList.toggle("submenu-open");
          const openSiblings = parentItem.parentNode.querySelectorAll(
            ".nav-item.dropdown.submenu-open"
          );
          openSiblings.forEach((sibling) => {
            if (sibling !== parentItem) {
              sibling.classList.remove("submenu-open");
            }
          });
        }
      }
    });
  });

  function closeMobileMenu() {
    navMenu.classList.remove("active");
    const openSubmenus = navMenu.querySelectorAll(".nav-item.submenu-open");
    openSubmenus.forEach((submenu) => {
      submenu.classList.remove("submenu-open");
    });

    if (window.innerWidth <= tabletBreakpoint) {
      menuIcon.style.display = "block";
    } else {
      menuIcon.style.display = "none";
    }
  }

  // Window resize handler
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth > tabletBreakpoint) {
        if (navMenu.classList.contains("active")) {
          closeMobileMenu();
        }
        menuIcon.style.display = "none";
      } else {
        if (!navMenu.classList.contains("active")) {
          menuIcon.style.display = "block";
        } else {
          menuIcon.style.display = "none";
        }
        navMenu.querySelectorAll(".dropdown-content").forEach((dd) => {
          dd.style.display = "";
        });
      }
    }, 250);
  });

  // Close menu if clicking outside
  document.addEventListener("click", (event) => {
    if (
      window.innerWidth <= tabletBreakpoint &&
      navMenu.classList.contains("active") &&
      !navMenu.contains(event.target) &&
      !menuIcon.contains(event.target)
    ) {
      closeMobileMenu();
    }
  });

  //////// Scroll Reveal Effect for Section with Sticky Container //////////

  // Select elements
  const section = document.querySelector(".scroll-reveal-section");
  const stickyContainer = section?.querySelector(".sticky-container");
  const textElement = section?.querySelector(".centered-text");
  const maskedElement = section?.querySelector(".masked-content");
  const finalContent = section?.querySelector(".final-content");
  const ANIMATION_END_PROGRESS = 0.75;
  // Early exit if essential elements are missing
  if (
    !section ||
    !stickyContainer ||
    !textElement ||
    !maskedElement ||
    !finalContent
  ) {
    console.warn(
      "Scroll reveal elements (including final content) not found. Effect disabled."
    );
    return;
  }

  // Constants
  const initialMaskSizePx = 150; // Should match SCSS variable $initial-mask-size if changed

  // --- Helper Functions ---
  const calculateMaxMaskSize = () => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    // Calculate diagonal and add a buffer (e.g., 10%) for safety
    return Math.sqrt(viewportWidth ** 2 + viewportHeight ** 2) * 1.1;
  };

  // --- State Variables ---
  let maxMaskSize = calculateMaxMaskSize();

  // --- Event Listeners ---
  window.addEventListener("resize", () => {
    maxMaskSize = calculateMaxMaskSize();
    handleScroll(); // Re-run calculations on resize
  });

  window.addEventListener("scroll", handleScroll, { passive: true }); // Passive listener for performance

  // --- Core Scroll Handling Logic ---
  function handleScroll() {
    const sectionHeight = section.offsetHeight;
    const viewportHeight = window.innerHeight;
    const scrollDistance = sectionHeight - viewportHeight; // Total scroll range for the effect

    // Edge Case: Section shorter than viewport
    if (scrollDistance <= 0) {
      setFinalState();
      return;
    }

    // Get section position relative to viewport
    const sectionRect = section.getBoundingClientRect();

    // Determine current state based on scroll position
    let currentState = determineScrollState(sectionRect, scrollDistance);

    // Apply styles based on state
    switch (currentState) {
      case "before":
        setInitialState();
        break;
      case "after":
        setFinalState();
        break;
      case "during":
        updateAnimationState(sectionRect, scrollDistance);
        break;
    }
  }

  // --- State Determination Function ---
  function determineScrollState(rect, distance) {
    if (rect.top > 0) {
      return "before";
    } else if (rect.top < -distance) {
      return "after";
    } else {
      return "during";
    }
  }

  // --- State Update Functions ---
  function setInitialState() {
    textElement.style.opacity = "1";
    const initialMaskValue = `${initialMaskSizePx}px ${initialMaskSizePx}px`;
    maskedElement.style.maskSize = initialMaskValue;
    maskedElement.style.webkitMaskSize = initialMaskValue;
    finalContent.classList.remove("visible");
  }

  function setFinalState() {
    textElement.style.opacity = "0";
    const finalMaskValue = `${maxMaskSize.toFixed(0)}px ${maxMaskSize.toFixed(
      0
    )}px`;
    maskedElement.style.maskSize = finalMaskValue;
    maskedElement.style.webkitMaskSize = finalMaskValue;
    finalContent.classList.add("visible");
  }

  function updateAnimationState(rect, distance) {
    const scrollFromSectionTop = -rect.top;
    const overallProgress = scrollFromSectionTop / distance;
    // Clamp overall progress between 0 and 1
    const clampedOverallProgress = Math.max(0, Math.min(1, overallProgress));

    // Calculate progress specifically for the fade/grow animation (0 to 1)
    // This animation progress should reach 1 when overall progress hits ANIMATION_END_PROGRESS
    const animationProgress = Math.min(1, clampedOverallProgress / ANIMATION_END_PROGRESS);

    // --- Use animationProgress for fade and grow ---
    const textFadeEndThreshold = 0.25; // e.g., Text fades out during first 25% of *animation* duration
    const maskGrowStartThreshold = 0.25;// e.g., Mask grows during last 75% of *animation* duration

    // 1. Update Text Opacity (based on animationProgress)
    let textOpacity = 1;
    if (animationProgress <= textFadeEndThreshold) {
         // Calculate fade relative to the text fade phase duration
         const fadeProgress = animationProgress / textFadeEndThreshold;
         textOpacity = 1 - fadeProgress;
    } else {
         textOpacity = 0; // Fully faded after threshold
    }
    textElement.style.opacity = Math.max(0, Math.min(1, textOpacity)).toFixed(2);


    // 2. Update Mask Size (based on animationProgress)
    let currentMaskSize = initialMaskSizePx;
    if (animationProgress >= maskGrowStartThreshold) {
        // Calculate growth relative to the mask grow phase duration
        const growthPhaseDuration = 1 - maskGrowStartThreshold;
        const growthProgress = growthPhaseDuration > 0
            ? (animationProgress - maskGrowStartThreshold) / growthPhaseDuration
            : 1; // If start threshold is 1, jump to end size

        currentMaskSize = initialMaskSizePx + growthProgress * (maxMaskSize - initialMaskSizePx);
        // Clamp mask size between initial and max values
        currentMaskSize = Math.max(initialMaskSizePx, Math.min(maxMaskSize, currentMaskSize));
    }
    const sizePx = currentMaskSize.toFixed(0);
    const maskSizeValue = `${sizePx}px ${sizePx}px`;
    maskedElement.style.maskSize = maskSizeValue;
    maskedElement.style.webkitMaskSize = maskSizeValue;


    // 3. Update Final Content Visibility (based on clampedOverallProgress)
    // Show the final content once the overall scroll has passed the animation end point
    if (clampedOverallProgress >= ANIMATION_END_PROGRESS) {
        finalContent.classList.add('visible');
    } else {
        // Hide it if scrolling back up before the animation end point
        finalContent.classList.remove('visible');
    }
}

  // --- Initial Call ---
  handleScroll(); // Run once on load to set initial state correctly



  const statsSection = document.querySelector('.global-team-stats-section');

  if (statsSection) { // Check if the section exists on the page
      const observerOptions = {
          root: null, // Use the viewport as the root
          rootMargin: '0px 0px -50px 0px', // Trigger slightly before it's fully in view
          threshold: 0.1 // Trigger when 10% of the element is visible
      };

      const observerCallback = (entries, observer) => {
          entries.forEach(entry => {
              if (entry.isIntersecting) {
                  entry.target.classList.add('is-visible');
                  observer.unobserve(entry.target); // Stop observing once visible (optional)
              }
              // No 'else' needed if you only want the animation to run once
          });
      };

      const statsObserver = new IntersectionObserver(observerCallback, observerOptions);
      statsObserver.observe(statsSection);
  }
  // --- End Global Stats Animation ---

});
