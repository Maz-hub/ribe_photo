// NAVBAR SCROLL EFFECT
function userScroll() {
  const navbar = document.querySelector(".navbar");
  const toTopBtn = document.querySelector("#to-top");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("bg-dark");
      navbar.classList.add("navbar-sticky");
      toTopBtn.classList.add("show");
    } else {
      navbar.classList.remove("bg-dark");
      navbar.classList.remove("navbar-sticky");
      toTopBtn.classList.remove("show");
    }
  });
}

// GO TO TOP BTN
function scrollToTop() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

// SMOOTH SCROLLING
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
    });
  });
});

// run when DOM is loaded / Event Listeners
document.addEventListener("DOMContentLoaded", userScroll);
document.querySelector("#to-top").addEventListener("click", scrollToTop);

// MASONRY
window.onload = () => {
  const grid = document.querySelector(".masonry-grid");
  if (grid) {
    const masonryInstance = new Masonry(grid, {
      itemSelector: ".gallery-item",
      gutter: 10,
    });

    // Force Masonry to re-layout after window resizing
    window.addEventListener("resize", () => {
      masonryInstance.layout();
    });
  }
};

// LIGHTBOX
(function () {
  const lb = document.createElement("div");
  lb.id = "lightbox";
  lb.innerHTML =
    '<button id="lb-prev">&#8592;</button>' +
    '<div id="lb-body"><img id="lb-img"><p id="lb-caption"></p></div>' +
    '<button id="lb-next">&#8594;</button>' +
    '<button id="lb-close">&times;</button>';
  document.body.appendChild(lb);

  const img = document.getElementById("lb-img");
  const cap = document.getElementById("lb-caption");
  let slides = [], idx = 0;

  function open(i) {
    idx = i;
    img.src = slides[i].src;
    cap.textContent = slides[i].title;
    lb.style.display = "flex";
  }
  function close() { lb.style.display = "none"; }
  function prev() { open((idx - 1 + slides.length) % slides.length); }
  function next() { open((idx + 1) % slides.length); }

  document.querySelectorAll("[data-lightbox]").forEach((el, i) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      slides = [...document.querySelectorAll("[data-lightbox]")].map((a) => ({
        src: a.href,
        title: a.dataset.title || "",
      }));
      open(i);
    });
  });

  document.getElementById("lb-prev").addEventListener("click", (e) => { e.stopPropagation(); prev(); });
  document.getElementById("lb-next").addEventListener("click", (e) => { e.stopPropagation(); next(); });
  document.getElementById("lb-close").addEventListener("click", close);
  lb.addEventListener("click", (e) => { if (e.target === lb) close(); });
  document.addEventListener("keydown", (e) => {
    if (lb.style.display !== "flex") return;
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
    if (e.key === "Escape") close();
  });
})();

// EMAILS
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");

  // Contact form only exists on /contact — bail out on all other pages
  if (!form) return;

  const flashMessage = document.getElementById("flash-message");

  form.addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent default form submission

    const formData = new FormData(form);

    try {
      // Ensure the request goes to the correct route and uses POST
      const response = await fetch("/send_email", {
        method: "POST",
        body: formData,
      });

      const messageText = await response.text();

      if (response.ok) {
        // Show success message
        flashMessage.textContent = "Your message has been sent successfully!";
        flashMessage.className = "alert alert-success";
      } else {
        // Show error message
        flashMessage.textContent = `Error: ${messageText}`;
        flashMessage.className = "alert alert-danger";
      }

      // Display the message and hide it after a few seconds
      flashMessage.style.display = "block";
      setTimeout(() => {
        flashMessage.style.display = "none";
      }, 5000);

      // Clear form fields on success
      if (response.ok) {
        form.reset();
      }
    } catch (error) {
      // Show error message if Fetch fails
      flashMessage.textContent = "An error occurred. Please try again.";
      flashMessage.className = "alert alert-danger";
      flashMessage.style.display = "block";

      setTimeout(() => {
        flashMessage.style.display = "none";
      }, 5000);
    }
  });
});
