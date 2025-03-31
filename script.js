document.addEventListener("DOMContentLoaded", function () {
  const dropdown = document.querySelector(".dropdown");
  const dropdownContent = document.querySelector(".dropdown-container");
  const slideIndicator = document.querySelector(".slide-indicator");
  const totalItems = document.querySelectorAll(".carousel-item").length;

  dropdown.addEventListener("click", function () {
    if (dropdownContent.style.display === "flex") {
      dropdownContent.style.display = "none";
    } else {
      dropdownContent.style.display = "flex";
    }
  });

  document.addEventListener("click", function (event) {
    if (!dropdown.contains(event.target)) {
      dropdownContent.style.display = "none";
    }
  });

  let autoSlideInterval;

  function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
      moveSlide(1);
    }, 2000);
  }

  function stopAutoSlide() {
    clearInterval(autoSlideInterval);
  }

  startAutoSlide();

  const pauseBtn = document.getElementById("pauseBtn");
  const playBtn = document.getElementById("playBtn");

  if (pauseBtn && playBtn) {
    pauseBtn.addEventListener("click", () => {
      stopAutoSlide();
      playBtn.removeAttribute("hidden");
      pauseBtn.setAttribute("hidden", "true");
    });

    playBtn.addEventListener("click", () => {
      startAutoSlide();
      pauseBtn.removeAttribute("hidden");
      playBtn.setAttribute("hidden", "true");
    });
  }

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
  let currentIndex = 0;

  function moveSlide(direction) {
    const carouselInner = document.querySelector(".carousel-inner");

    currentIndex += direction;
    if (currentIndex < 0) {
      currentIndex = totalItems - 1;
    } else if (currentIndex >= totalItems) {
      currentIndex = 0;
    }

    const offset = -currentIndex * 100;
    carouselInner.style.transform = `translateX(${offset}%)`;

    // Update the slide indicator
    slideIndicator.textContent = `${currentIndex + 1}/${totalItems}`;
  }

  // Initialize the slide indicator
  slideIndicator.textContent = `1/${totalItems}`;

  const cards = document.querySelectorAll(".sticky-card");

  // Scroll animation handler
  const handleScroll = () => {
    const scrollSection = document.querySelector('.scroll-section');
    const rect = scrollSection.getBoundingClientRect();
    const scrollPosition = window.scrollY;
    const sectionTop = rect.top;
    const imageContainer = document.querySelector('.scroll-image-container');
    const paragraphs = document.querySelectorAll('.paragraph-reveal');

    if (sectionTop <= 0 && rect.bottom >= window.innerHeight) {
      imageContainer.classList.add('fixed');
      imageContainer.classList.remove('bottom');
      scrollSection.classList.remove('shrinked');
    } else if (rect.bottom < window.innerHeight) {
      imageContainer.classList.remove('fixed');
      imageContainer.classList.add('bottom');
      scrollSection.classList.add('shrinked');
    } else {
      imageContainer.classList.remove('fixed', 'bottom');
      scrollSection.classList.remove('shrinked');
    }

    // Reveal paragraphs on scroll with a stagger effect
    paragraphs.forEach((paragraph, index) => {
      const rect = paragraph.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight - 100;
      
      if (isVisible) {
        setTimeout(() => {
          paragraph.classList.add('visible');
        }, index * 100);
      }
    });
  };

  window.addEventListener('scroll', handleScroll);


});
