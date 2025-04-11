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

  const menu = document.getElementById("mobile-menu");
  const menuLinks = document.getElementById("nav-menu-list");
  const expertisesToggle = document.getElementById("expertises-toggle");
  const expertisesDropdown = expertisesToggle.nextElementSibling; // Get the dropdown content
  const navbarRight = document.querySelector(".navbar-right"); // Get the right side container

  // --- Burger Menu Toggle ---
  menu.addEventListener("click", () => {
    menu.classList.toggle("is-active"); // Optional: for styling the burger icon itself
    menuLinks.classList.toggle("active");

    // If menu is closing and expertises dropdown is open, close it too
    if (
      !menuLinks.classList.contains("active") &&
      expertisesDropdown.classList.contains("active")
    ) {
      expertisesDropdown.classList.remove("active");
      expertisesToggle.classList.remove("open");
    }
  });

  // --- Mobile Dropdown Toggle ---
  expertisesToggle.addEventListener("click", (e) => {
    // Only prevent default and toggle on smaller screens (where burger is visible)
    if (window.innerWidth <= 960) {
      e.preventDefault(); // Prevent link navigation only on mobile toggle
      expertisesToggle.classList.toggle("open"); // For arrow rotation
      expertisesDropdown.classList.toggle("active");
    }
  });

  // --- Move Right-Side Items to Mobile Menu ---
  function setupMobileMenu() {
    if (window.innerWidth <= 960) {
      // Check if items haven't already been moved
      if (!menuLinks.querySelector(".mobile-only")) {
        // Clone or create items for mobile menu
        const searchItem = document.createElement("li");
        searchItem.classList.add("nav-item", "mobile-only");
        searchItem.innerHTML = `<a href="#" class="nav-links"><i class="fas fa-search"></i> Search</a>`;
        menuLinks.appendChild(searchItem);

        const localeItem = document.createElement("li");
        localeItem.classList.add("nav-item", "mobile-only");
        localeItem.innerHTML = `<a href="#" class="nav-links"><i class="fas fa-globe"></i> France</a>`;
        menuLinks.appendChild(localeItem);
      }
    } else {
      // Screen is larger, remove mobile-only items if they exist
      const mobileOnlyItems = menuLinks.querySelectorAll(".mobile-only");
      mobileOnlyItems.forEach((item) => item.remove());

      // Ensure main menu and dropdown are correctly reset if window resized while open
      menu.classList.remove("is-active");
      menuLinks.classList.remove("active");
      expertisesDropdown.classList.remove("active");
      expertisesToggle.classList.remove("open");
    }
  }

  // Initial setup on load
  setupMobileMenu();

  // Adjust mobile menu items on window resize
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      setupMobileMenu();
    }, 250); // Debounce resize event
  });
});
