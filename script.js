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

  const leftSide = document.getElementById('leftSide');
  const mainImage = document.getElementById('mainImage');
  const secondaryImage = document.getElementById('secondaryImage');
  const rightSide = document.getElementById('rightSide');
  const scrollIndicator = document.getElementById('scrollIndicator');
  const componentSpacer = document.getElementById('componentSpacer');
  const stickyComponent = document.getElementById('stickyComponent');
  const componentTrigger = document.getElementById('componentTrigger');
  
  // Get body margin value to account for it in calculations
  const bodyMargin = parseInt(window.getComputedStyle(document.body).marginLeft);
  
  // Initial state - ensure full viewport width
  leftSide.style.width = '100vw';
  rightSide.style.display = 'none';
  
  // Define the threshold where elements change
  const widthThreshold = 60; // percentage of viewport width
  const secondImageThreshold = 60; // percentage of viewport width
  
  // Throttle function to limit how often the scroll event fires
  function throttle(callback, limit) {
      let waiting = false;
      return function() {
          if (!waiting) {
              callback.apply(this, arguments);
              waiting = true;
              setTimeout(function() {
                  waiting = false;
              }, limit);
          }
      }
  }
  
  // Function to update the layout based on scroll position
  function updateLayout() {
      // Get the position of the component trigger relative to the viewport
      const triggerRect = componentTrigger.getBoundingClientRect();
      const componentSpacerRect = componentSpacer.getBoundingClientRect();
      
      // Calculate progress through the component
      let progress = 0;
      
      // If we're past the trigger point
      if (triggerRect.top <= 0) {
          // Calculate how far through the component we are
          const distanceScrolled = Math.abs(componentSpacerRect.top);
          
          // We use 40% of the total spacer height for the shrinking effect
          // This makes the shrinking happen more gradually over a longer scroll distance
          const effectiveDistance = componentSpacer.offsetHeight * 0.4;
          
          // Cap progress at 40% of the total scroll distance
          progress = Math.min(1, distanceScrolled / effectiveDistance);
          
          // Apply easing function to make the transition feel more natural
          // This cubic easing slows down the transition at the beginning and end
          progress = easeInOutCubic(progress);
      }
      
      // Calculate the width of the left side based on progress
      const fullViewportWidth = window.innerWidth; // full viewport width 
      const minWidth = fullViewportWidth * 0.5; // 50% of viewport
      const leftWidth = fullViewportWidth - (progress * (fullViewportWidth - minWidth));
      const rightWidth = fullViewportWidth - leftWidth;
      
      // Update the layout with pixel values
      leftSide.style.width = leftWidth + 'px';
      
      // Calculate left width as percentage of viewport
      const leftWidthPercentage = (leftWidth / fullViewportWidth) * 100;
      
      // Toggle right side display based on threshold
      if (leftWidthPercentage <= widthThreshold) {
          if (rightSide.style.display === 'none') {
              rightSide.style.display = 'flex';
              rightSide.style.width = rightWidth + 'px';
          } else {
              rightSide.style.width = rightWidth + 'px';
          }
      } else {
          rightSide.style.display = 'none';
      }
      
      // Show/hide the secondary image based on left side width percentage
      secondaryImage.style.opacity = leftWidthPercentage < secondImageThreshold ? 1 : 0;
      
      // Hide scroll indicator after scrolling begins
      scrollIndicator.style.opacity = progress > 0.05 ? 0 : 0.8;
  }
  
  // Easing function for smoother transitions
  function easeInOutCubic(t) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }
  
  // Throttled scroll event for better performance
  const throttledUpdate = throttle(updateLayout, 10);
  
  // Listen for scroll events
  window.addEventListener('scroll', throttledUpdate);
  
  // Also update on resize to maintain proportions
  window.addEventListener('resize', updateLayout);
  
  // Initial layout update
  updateLayout();
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
