const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
document.body.classList.add("motion-ready");

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const comparison = document.querySelector("[data-comparison]");
if (comparison) {
  if ("IntersectionObserver" in window) {
    const comparisonObserver = new IntersectionObserver((entries, observer) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        comparison.classList.add("is-visible");
        observer.disconnect();
      }
    }, { threshold: 0.25 });
    comparisonObserver.observe(comparison);
  } else {
    comparison.classList.add("is-visible");
  }
}

const revealTargets = document.querySelectorAll(".manifesto .section-intro, .manifesto-body, .process-card, .portfolio-main, .service-row, .principles-grid, .plan-card, .comparison-heading, .comparison-card, .maintenance, .contact-intro, .contact-form-wrap, .final-cta-inner");
revealTargets.forEach((element, index) => {
  element.classList.add("reveal");
  element.style.setProperty("--reveal-delay", `${Math.min(index % 4, 3) * 90}ms`);
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealTargets.forEach((element) => revealObserver.observe(element));
} else {
  revealTargets.forEach((element) => element.classList.add("is-revealed"));
}

document.querySelectorAll("[data-year]").forEach((year) => {
  year.textContent = new Date().getFullYear();
});

const contactForm = document.querySelector("#contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(contactForm);
    const name = String(formData.get("name") || "").trim();
    const contact = String(formData.get("contact") || "").trim();
    const request = String(formData.get("request") || "").trim();
    const message = String(formData.get("message") || "").trim();
    const contactLine = contact ? `Contatto: ${contact}\n` : "";
    const whatsappText = `Ciao TechSpectra, vorrei parlare di un progetto.\n\nNome: ${name}\n${contactLine}Richiesta: ${request}\nMessaggio: ${message}`;
    const whatsappUrl = `https://wa.me/393311230888?text=${encodeURIComponent(whatsappText)}`;
    const feedback = contactForm.querySelector(".form-feedback");
    if (feedback) feedback.textContent = "Apertura di WhatsApp…";
    window.open(whatsappUrl, "_blank", "noopener");
  });
}