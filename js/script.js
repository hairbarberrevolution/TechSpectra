const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
document.body.classList.add("motion-ready");
const root = document.documentElement;
root.style.setProperty("--pointer-x", "-500px");
root.style.setProperty("--pointer-y", "-500px");

const titleElements = [...document.querySelectorAll("h1, h2")];
titleElements.forEach((title) => {
  if (title.closest(".code-window")) return;
  title.classList.add("kinetic-title");
  const walker = document.createTreeWalker(title, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  let currentNode = walker.nextNode();
  while (currentNode) {
    textNodes.push(currentNode);
    currentNode = walker.nextNode();
  }
  let wordIndex = 0;
  textNodes.forEach((textNode) => {
    const fragment = document.createDocumentFragment();
    textNode.textContent.split(/(\s+)/).forEach((part) => {
      if (!part) return;
      if (/^\s+$/.test(part)) {
        fragment.append(document.createTextNode(part));
      } else {
        const word = document.createElement("span");
        word.className = "title-word";
        word.textContent = part;
        word.style.setProperty("--word-index", wordIndex);
        fragment.append(word);
        wordIndex += 1;
      }
    });
    textNode.replaceWith(fragment);
  });
});
document.body.classList.add("titles-ready");

if ("IntersectionObserver" in window) {
  const titleObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("title-in");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  titleElements.forEach((title) => titleObserver.observe(title));
} else {
  titleElements.forEach((title) => title.classList.add("title-in"));
}

const finePointer = window.matchMedia("(pointer: fine)");
let customCursor;
if (finePointer.matches) {
  customCursor = document.createElement("div");
  customCursor.className = "custom-cursor";
  customCursor.setAttribute("aria-hidden", "true");
  document.body.append(customCursor);
  document.body.classList.add("custom-cursor-enabled");
  window.addEventListener("pointermove", (event) => {
    root.style.setProperty("--pointer-x", `${event.clientX}px`);
    root.style.setProperty("--pointer-y", `${event.clientY}px`);
    customCursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
  }, { passive: true });
  document.querySelectorAll("a, button, select, .portfolio-visual, .problem-card, .solution-card").forEach((target) => {
    target.addEventListener("pointerenter", () => customCursor.classList.add("is-hovering"));
    target.addEventListener("pointerleave", () => customCursor.classList.remove("is-hovering"));
  });
}

const updateScrollSignal = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
  root.style.setProperty("--scroll-progress", Math.min(1, Math.max(0, progress)));
  root.style.setProperty("--hero-scroll", `${Math.min(window.scrollY, 700) * -0.045}px`);
};
window.addEventListener("scroll", updateScrollSignal, { passive: true });
updateScrollSignal();

if (finePointer.matches) {
  document.querySelectorAll(".portfolio-visual, .plan-card, .comparison-card, .problem-card").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const bounds = card.getBoundingClientRect();
      const x = event.clientX / bounds.width - bounds.left / bounds.width;
      const y = event.clientY / bounds.height - bounds.top / bounds.height;
      const rotateX = (0.5 - y) * 4;
      const rotateY = (x - 0.5) * 5;
      card.style.setProperty("--tilt-x", `${rotateX}deg`);
      card.style.setProperty("--tilt-y", `${rotateY}deg`);
      card.classList.add("tilting");
    });
    card.addEventListener("pointerleave", () => {
      card.classList.remove("tilting");
      card.style.removeProperty("--tilt-x");
      card.style.removeProperty("--tilt-y");
    });
  });
}

document.querySelectorAll(".button, .nav-cta").forEach((button) => {
  if (!finePointer.matches) return;
  button.addEventListener("pointermove", (event) => {
    const bounds = button.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    button.style.setProperty("--mag-x", `${x * 7}px`);
    button.style.setProperty("--mag-y", `${y * 5}px`);
    button.classList.add("magnetic-active");
  });
  button.addEventListener("pointerleave", () => {
    button.classList.remove("magnetic-active");
    button.style.removeProperty("--mag-x");
    button.style.removeProperty("--mag-y");
  });
});

const heroArt = document.querySelector(".hero-art");
if (heroArt && finePointer.matches) {
  heroArt.addEventListener("pointermove", (event) => {
    const bounds = heroArt.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    heroArt.style.setProperty("--hero-rotate-x", `${y * -3}deg`);
    heroArt.style.setProperty("--hero-rotate-y", `${x * 4}deg`);
  });
  heroArt.addEventListener("pointerleave", () => {
    heroArt.style.removeProperty("--hero-rotate-x");
    heroArt.style.removeProperty("--hero-rotate-y");
  });
}

const revealCard = document.querySelector("[data-reveal-card]");
if (revealCard) {
  revealCard.addEventListener("click", (event) => {
    if (window.matchMedia("(hover: none)").matches && !revealCard.classList.contains("is-revealed")) {
      event.preventDefault();
      revealCard.classList.add("is-revealed");
      revealCard.setAttribute("aria-label", "Apri il sito Hair Barber Revolution");
    }
  });
}

const codeLines = document.querySelectorAll(".code-line");
if (codeLines.length) {
  const codeMarkup = [
    "<i>01</i><strong>const</strong> presence <mark>=</mark> <u>local</u>;",
    "<i>02</i><strong>function</strong> <u>makeItReal</u>(idea) {",
    "<i>03</i>&nbsp;&nbsp;return <mark>idea</mark>.<u>withCharacter</u>();",
    "<i>04</i>}",
    "<i>05</i>",
    "<i>06</i><strong>export default</strong> <mark>site</mark>;"
  ];
  const showFinalCode = (line, index) => {
    line.innerHTML = codeMarkup[index];
    const cursor = document.createElement("span");
    cursor.className = "typing-cursor";
    cursor.setAttribute("aria-hidden", "true");
    line.append(cursor);
  };
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let totalDelay = prefersReducedMotion ? 0 : 480;
  codeLines.forEach((line, index) => {
    const text = line.dataset.line || "";
    line.textContent = "";
    if (prefersReducedMotion) {
      showFinalCode(line, index);
      return;
    }
    totalDelay += index === 0 ? 0 : 90;
    setTimeout(() => {
      let character = 0;
      const cursor = document.createElement("span");
      cursor.className = "typing-cursor";
      cursor.setAttribute("aria-hidden", "true");
      line.append(cursor);
      const typeNext = () => {
        if (character < text.length) {
          cursor.before(document.createTextNode(text[character]));
          character += 1;
          setTimeout(typeNext, 13);
        } else {
          showFinalCode(line, index);
        }
      };
      typeNext();
    }, totalDelay);
    totalDelay += text.length * 13;
  });
}

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
  const requestSelect = contactForm.querySelector("#request");
  const requestIcon = contactForm.querySelector("#request-icon");
  const requestIcons = {
    "Un sito vetrina": '<svg viewBox="0 0 48 48" fill="none"><rect x="8" y="10" width="32" height="28" rx="3" stroke="currentColor" stroke-width="1.5"/><path d="M8 18h32M15 14h1M20 14h1M25 14h1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
    "Un sito con funzionalità dinamiche": '<svg viewBox="0 0 48 48" fill="none"><circle cx="11" cy="24" r="4" stroke="currentColor" stroke-width="1.5"/><circle cx="37" cy="13" r="4" stroke="currentColor" stroke-width="1.5"/><circle cx="37" cy="35" r="4" stroke="currentColor" stroke-width="1.5"/><path d="M15 23l18-8M15 25l18 8" stroke="currentColor" stroke-width="1.5"/></svg>',
    "Un restyling": '<svg viewBox="0 0 48 48" fill="none"><path d="M24 7l3.8 11.2L39 22l-11.2 3.8L24 37l-3.8-11.2L9 22l11.2-3.8L24 7z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M39 33l1.8 4.2L45 39l-4.2 1.8L39 45l-1.8-4.2L33 39l4.2-1.8L39 33z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>',
    "Non lo so ancora": '<svg viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="16" stroke="currentColor" stroke-width="1.5"/><path d="M24 14v10l7 5M24 8v2M24 38v2M8 24h2M38 24h2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>'
  };
  if (requestSelect && requestIcon) {
    requestSelect.addEventListener("change", () => {
      requestIcon.innerHTML = requestIcons[requestSelect.value] || requestIcons["Un sito vetrina"];
      requestIcon.classList.add("is-set");
    });
  }
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