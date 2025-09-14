document.addEventListener("DOMContentLoaded", function () {
  const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
  const navList = document.querySelector(".nav-list");

  mobileMenuToggle.addEventListener("click", function () {
    if (window.innerWidth <= 768) {
      navList.classList.toggle("show-mobile");
      mobileMenuToggle.classList.toggle("active");
    }
  });

  // Close mobile menu when clicking outside of it
  document.addEventListener("click", function (event) {
    const isClickInside =
      navList.contains(event.target) || mobileMenuToggle.contains(event.target);

    if (
      !isClickInside &&
      window.innerWidth <= 768 &&
      navList.classList.contains("show-mobile")
    ) {
      navList.classList.remove("show-mobile");
      mobileMenuToggle.classList.remove("active");
    }
  });

  // Close mobile menu on window resize
  window.addEventListener("resize", function () {
    if (window.innerWidth > 768) {
      navList.classList.remove("show-mobile");
      mobileMenuToggle.classList.remove("active");
    }
  });

  // Close mobile menu when clicking on a link
  const navLinks = document.querySelectorAll(".nav-list a");
  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      if (window.innerWidth <= 768) {
        navList.classList.remove("show-mobile");
        mobileMenuToggle.classList.remove("active");
      }
    });
  });
});
