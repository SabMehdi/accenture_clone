document.addEventListener("DOMContentLoaded", function () {
  const carousel = document.querySelector(".carousel");
  if (!carousel) return; // Exit if carousel not found

  const track = carousel.querySelector(".carousel-track");
  const slides = Array.from(track.children);
  const nextButton = carousel.querySelector(".carousel-button.next");
  const prevButton = carousel.querySelector(".carousel-button.prev");
  const pausePlayButton = carousel.querySelector(".carousel-button.pauseplay");
  const paginationCurrent = carousel.querySelector(
    ".carousel-pagination .current-slide"
  );
  const paginationTotal = carousel.querySelector(
    ".carousel-pagination .total-slides"
  );
  const pauseIcon = '<i class="fas fa-pause"></i>';
  const playIcon = '<i class="fas fa-play"></i>';

  const totalSlides = slides.length;
  let currentIndex = 0;
  let autoplayInterval = null;
  let isAutoplaying = true; // Autoplay starts by default
  const AUTOPLAY_DELAY = 5000; // 5 seconds

  const moveToSlide = (targetIndex) => {
    if (targetIndex < 0) {
      targetIndex = totalSlides - 1;
    } else if (targetIndex >= totalSlides) {
      targetIndex = 0;
    }

    const offset = -(targetIndex * 100); // Use percentage for responsiveness
    track.style.transform = `translateX(${offset}%)`;
    currentIndex = targetIndex;
    updateControls();
  };

  // Function to update buttons and pagination
  const updateControls = () => {
    // --- Pagination ---
    if (paginationCurrent) paginationCurrent.textContent = currentIndex + 1;
    if (paginationTotal) paginationTotal.textContent = totalSlides;

    if (pausePlayButton) {
      if (isAutoplaying) {
        pausePlayButton.innerHTML = pauseIcon;
        pausePlayButton.setAttribute("aria-label", "Pause Carousel");
      } else {
        pausePlayButton.innerHTML = playIcon;
        pausePlayButton.setAttribute("aria-label", "Play Carousel");
      }
    }
  };

  const startAutoplay = () => {
    if (!isAutoplaying) return; // Don't start if already stopped manually
    stopAutoplay(); // Clear any existing interval first
    autoplayInterval = setInterval(() => {
      moveToSlide(currentIndex + 1);
    }, AUTOPLAY_DELAY);
    isAutoplaying = true; // Ensure flag is set
    updateControls(); // Update button icon
  };

  const stopAutoplay = () => {
    clearInterval(autoplayInterval);
    autoplayInterval = null;
    // Note: We don't set isAutoplaying = false here unless the *user* clicks pause
  };

  const pauseAutoplayManual = () => {
    stopAutoplay();
    isAutoplaying = false; // Set flag because user explicitly paused
    updateControls();
  };

  const startAutoplayManual = () => {
    isAutoplaying = true; // Set flag because user explicitly played
    startAutoplay();
    // updateControls() called within startAutoplay
  };

  // --- Event Listeners ---
  nextButton.addEventListener("click", () => {
    moveToSlide(currentIndex + 1);
    // Reset autoplay timer only if it was running
    if (isAutoplaying) {
      startAutoplay(); // Restart interval
    }
  });

  prevButton.addEventListener("click", () => {
    moveToSlide(currentIndex - 1);
    // Reset autoplay timer only if it was running
    if (isAutoplaying) {
      startAutoplay(); // Restart interval
    }
  });

  pausePlayButton.addEventListener("click", () => {
    if (isAutoplaying) {
      pauseAutoplayManual();
    } else {
      startAutoplayManual();
    }
  });

  // Optional: Pause on hover
  carousel.addEventListener("mouseenter", () => {
    if (isAutoplaying && autoplayInterval) {
      // Only stop if running
      stopAutoplay();
    }
  });
  carousel.addEventListener("mouseleave", () => {
    if (isAutoplaying && !autoplayInterval) {
      startAutoplay();
    }
  });

  // --- Initial Setup ---
  track.style.transition = "transform 0.5s ease-in-out"; // Add transition via JS
  updateControls(); // Set initial pagination
  startAutoplay(); // Start autoplay on load
  /////////////////////////////////////////////////////////////////////////////////////////////
  function getAverageColor(canvas, startX, width, height) {
    const ctx = canvas.getContext("2d");
    const imageData = ctx.getImageData(startX, 0, width, height);
    const data = imageData.data;
    let r = 0,
      g = 0,
      b = 0;
    let count = 0;

    for (let i = 0; i < data.length; i += 4) {
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
      count++;
    }

    return {
      r: Math.round(r / count),
      g: Math.round(g / count),
      b: Math.round(b / count),
    };
  }

  function rgbToRgba(r, g, b, alpha) {
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  const card = document.querySelectorAll(".card");
  card.forEach((card) => {
    const imageUrl = card.dataset.image;
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imageUrl;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const halfWidth = canvas.width / 2;
      const color1 = getAverageColor(canvas, 0, halfWidth, canvas.height);
      const color2 = getAverageColor(
        canvas,
        halfWidth,
        halfWidth,
        canvas.height
      );

      card.style.setProperty("--bg-image", `url(${imageUrl})`);
      card.style.setProperty(
        "--gradient-color-1",
        rgbToRgba(color1.r, color1.g, color1.b, 0.8)
      );
      card.style.setProperty(
        "--gradient-color-2",
        rgbToRgba(color2.r, color2.g, color2.b, 0.8)
      );
    };
  });
  /////////////////////////////////////////////////////////////////////////////////
  // Scroll animation handler
  const handleScroll = () => {
    const wrapper = document.querySelector(".scroll-effect-wrapper");
    const imageContainer = wrapper.querySelector(".scroll-image-container");
    const content = wrapper.querySelector(".content");
    const paragraphs = wrapper.querySelectorAll(".paragraph-reveal");

    // Get wrapper's position relative to viewport
    const rect = wrapper.getBoundingClientRect();

    // Calculate how far the top of the wrapper is scrolled past the top of the viewport
    const scrollTopInWrapper = -rect.top;

    // Total scrollable distance *within the wrapper* that drives the animation
    // Wrapper height minus the height of the sticky section (which is 1 viewport height)
    const scrollableHeight = wrapper.offsetHeight - window.innerHeight;

    // Calculate scroll progress (0 to 1) based on wrapper scroll
    // Ensure progress doesn't go below 0 or above 1
    const scrollProgress = Math.min(
      1,
      Math.max(0, scrollTopInWrapper / scrollableHeight)
    );

    const imageStartWidth = 100;
    const imageEndWidth = 45;
    const currentImageWidth =
      imageStartWidth - scrollProgress * (imageStartWidth - imageEndWidth);
    // Clamp width to ensure it doesn't go beyond bounds due to potential easing/overscroll
    imageContainer.style.width = `${Math.max(
      imageEndWidth,
      Math.min(imageStartWidth, currentImageWidth)
    )}vw`;

    const contentAppearThreshold = 0.6;

    if (scrollProgress >= contentAppearThreshold) {
      content.classList.add("visible");
    } else {
      content.classList.remove("visible");
      paragraphs.forEach((paragraph) => {
        paragraph.classList.remove("visible");
      });
    }
  };

  handleScroll();
  window.addEventListener("scroll", handleScroll);

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
