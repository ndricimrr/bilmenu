document.addEventListener("DOMContentLoaded", function () {
  const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
  const navList = document.querySelector(".nav-list");

  mobileMenuToggle.addEventListener("click", function () {
    if (window.innerWidth <= 768) {
      navList.classList.toggle("show-mobile");
    }
  });

  // Close mobile menu when clicking outside of it
  document.addEventListener("click", function (event) {
    const isClickInside =
      navList.contains(event.target) || mobileMenuToggle.contains(event.target);

    if (!isClickInside && window.innerWidth <= 768) {
      navList.classList.remove("show-mobile");
    }
  });

  // Close mobile menu on window resize
  window.addEventListener("resize", function () {
    if (window.innerWidth > 768) {
      navList.classList.remove("show-mobile");
    }
  });
});
