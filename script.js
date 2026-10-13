// Apply the saved theme and wire up the responsive navigation.
const themeToggle = document.querySelector(".theme-toggle");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const themeIcon = document.querySelector(".theme-icon");
const year = document.querySelector("#current-year");
const savedTheme = localStorage.getItem("portfolio-theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const isDark = theme === "dark";
  themeToggle.setAttribute("aria-pressed", String(isDark));
  themeToggle.setAttribute("aria-label", `Switch to ${isDark ? "light" : "dark"} mode`);
  themeIcon.textContent = isDark ? "☀" : "☾";
}

setTheme(savedTheme || (prefersDark ? "dark" : "light"));

themeToggle.addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  setTheme(nextTheme);
  localStorage.setItem("portfolio-theme", nextTheme);
});

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  navLinks.classList.toggle("is-open", !isOpen);
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.setAttribute("aria-expanded", "false");
    navLinks.classList.remove("is-open");
  });
});

year.textContent = String(new Date().getFullYear());

// Validate meaningful form input and show a local-only confirmation.
const contactForm = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");

if (contactForm && formStatus) {
  const nameField = contactForm.elements.namedItem("name");
  const messageField = contactForm.elements.namedItem("message");
  const fields = [nameField, contactForm.elements.namedItem("email"), messageField];

  fields.forEach((field) => {
    field.addEventListener("input", () => field.setCustomValidity(""));
  });

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    nameField.setCustomValidity(nameField.value.trim() ? "" : "Please enter your name.");
    messageField.setCustomValidity(messageField.value.trim() ? "" : "Please enter a message.");

    if (!contactForm.reportValidity()) {
      return;
    }

    contactForm.reset();
    formStatus.textContent = "Thanks for reaching out! This demo form doesn’t send messages yet—please email me directly using the link below.";
    formStatus.hidden = false;
  });
}

// Cycle through three taglines with a type-and-erase effect.
const typedTagline = document.querySelector(".typed-tagline");
const taglineCursor = document.querySelector(".typing-cursor");
const taglines = [
  "I turn thoughtful ideas into clear, useful digital experiences.",
  "I build simple, human-centered digital products.",
  "I bring good ideas to life with design and code."
];
let typingTimer;

if (typedTagline && taglineCursor) {
  function startTaglineAnimation() {
    window.clearTimeout(typingTimer);

    if (prefersReducedMotion.matches) {
      typedTagline.textContent = taglines[0];
      taglineCursor.hidden = true;
      return;
    }

    taglineCursor.hidden = false;
    let phraseIndex = 0;
    let characterIndex = taglines[0].length;
    let deleting = true;

    function animateTagline() {
      const phrase = taglines[phraseIndex];
      typedTagline.textContent = phrase.slice(0, characterIndex);

      if (deleting) {
        characterIndex -= 1;
        if (characterIndex < 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % taglines.length;
          characterIndex = 0;
        }
        typingTimer = window.setTimeout(animateTagline, 32);
      } else {
        characterIndex += 1;
        if (characterIndex > taglines[phraseIndex].length) {
          deleting = true;
          typingTimer = window.setTimeout(animateTagline, 1500);
        } else {
          typingTimer = window.setTimeout(animateTagline, 55);
        }
      }
    }

    typingTimer = window.setTimeout(animateTagline, 1500);
  }

  startTaglineAnimation();
  prefersReducedMotion.addEventListener("change", startTaglineAnimation);
}

// Reveal page sections as they enter view, unless motion is reduced.
if ("IntersectionObserver" in window && !prefersReducedMotion.matches) {
  const sectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll("main > section").forEach((section) => {
    section.classList.add("reveal-section");
    sectionObserver.observe(section);
  });
}
