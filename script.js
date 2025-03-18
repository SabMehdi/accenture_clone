document.addEventListener("DOMContentLoaded", function () {
  const dropdown = document.querySelector(".dropdown");
  const dropdownContent = document.querySelector(".dropdown-container");

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
  // script.js
  const cards = document.querySelectorAll(".sticky-card");

  function revealOnScroll() {
    cards.forEach((card) => {
      const cardTop = card.getBoundingClientRect().top;
      if (cardTop < window.innerHeight - 100) {
        card.classList.add("show");
      }
    });
  }

  window.addEventListener("scroll", revealOnScroll);
});

let currentIndex = 0;

function moveSlide(direction) {
  const carouselInner = document.querySelector(".carousel-inner");
  const totalItems = document.querySelectorAll(".carousel-item").length;

  currentIndex += direction;

  if (currentIndex < 0) {
    currentIndex = totalItems - 1;
  } else if (currentIndex >= totalItems) {
    currentIndex = 0;
  }

  const offset = -currentIndex * 100;
  carouselInner.style.transform = `translateX(${offset}%)`;
}
