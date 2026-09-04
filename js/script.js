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
  const terminalFields = [...contactForm.querySelectorAll(".terminal-input, .terminal-select, .terminal-textarea")];
  const positionBlockCaret = (field) => {
    if (!field.matches(".terminal-input, .terminal-textarea")) return;
    const line = field.closest(".terminal-input-line");
    const blockCaret = line?.querySelector(".terminal-block-caret");
    if (!line || !blockCaret) return;
    const styles = window.getComputedStyle(field);
    const fieldRect = field.getBoundingClientRect();
    const mirror = document.createElement("div");
    const marker = document.createElement("span");
    const beforeCaret = field.value.slice(0, field.selectionStart ?? field.value.length);
    mirror.style.position = "fixed";
    mirror.style.left = `${fieldRect.left - field.scrollLeft}px`;
    mirror.style.top = `${fieldRect.top - field.scrollTop}px`;
    mirror.style.width = `${field.clientWidth}px`;
    mirror.style.height = `${field.clientHeight}px`;
    mirror.style.boxSizing = "border-box";
    mirror.style.padding = styles.padding;
    mirror.style.border = "0";
    mirror.style.font = styles.font;
    mirror.style.letterSpacing = styles.letterSpacing;
    mirror.style.lineHeight = styles.lineHeight;
    mirror.style.whiteSpace = field.matches("textarea") ? "pre-wrap" : "pre";
    mirror.style.wordBreak = "break-word";
    mirror.style.overflowWrap = "break-word";
    mirror.style.visibility = "hidden";
    mirror.style.pointerEvents = "none";
    mirror.textContent = beforeCaret || "\u200b";
    marker.textContent = "\u200b";
    mirror.append(marker);
    document.body.append(mirror);
    const markerRect = marker.getBoundingClientRect();
    blockCaret.style.left = `${field.offsetLeft + markerRect.left - fieldRect.left}px`;
    blockCaret.style.top = `${field.offsetTop + markerRect.top - fieldRect.top}px`;
    blockCaret.style.height = `${parseFloat(styles.lineHeight) || 20}px`;
    blockCaret.classList.toggle("is-empty", beforeCaret.length === 0);
    mirror.remove();
  };
  terminalFields.forEach((field, index) => {
    const line = field.closest(".terminal-input-line");
    if (line) {
      line.addEventListener("click", () => field.focus());
    }
    ["input", "click", "keyup", "select", "focus"].forEach((eventName) => {
      field.addEventListener(eventName, () => requestAnimationFrame(() => positionBlockCaret(field)));
    });
    field.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && field.matches("input, select") && !event.shiftKey) {
        event.preventDefault();
        terminalFields[index + 1]?.focus();
      }
      if (event.key === "Enter" && field.matches("textarea") && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        contactForm.requestSubmit();
      }
    });
  });
  window.addEventListener("resize", () => {
    const activeField = document.activeElement;
    if (activeField?.matches(".terminal-input, .terminal-textarea")) positionBlockCaret(activeField);
  });
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