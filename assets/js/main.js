/* ============================================================
   Kaldeen Restaurant — main.js
   Handles:
   1. Auto footer year
   2. Navbar scroll effect
   3. Mobile menu
   4. Scroll reveal animation
   5. Active nav for multi-page site
   6. Smooth scroll for hash links
   ============================================================ */

/* ---------- 1. Auto-update footer year ---------- */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ---------- 2. Navbar scroll effect ---------- */
const navbar = document.getElementById("navbar");

function handleNavbarScroll() {
  if (!navbar) return;

  if (window.scrollY > 40) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
}

window.addEventListener("scroll", handleNavbarScroll, { passive: true });
handleNavbarScroll();

/* ---------- 3. Mobile Menu Toggle ---------- */
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");

function closeMobileMenu() {
  if (!mobileMenu || !hamburger) return;
  mobileMenu.classList.remove("open");
  hamburger.classList.remove("open");
  hamburger.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
}

if (hamburger && mobileMenu) {
  hamburger.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("open");
    hamburger.classList.toggle("open", isOpen);
    hamburger.setAttribute("aria-expanded", String(isOpen));
    document.body.style.overflow = isOpen ? "hidden" : "";
  });

  mobileMenu.querySelectorAll(".mobile-link").forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  document.addEventListener("click", (e) => {
    if (!navbar) return;
    if (!navbar.contains(e.target)) {
      closeMobileMenu();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeMobileMenu();
    }
  });
}

/* ---------- 4. Scroll-Reveal Animation ---------- */
const animatedEls = document.querySelectorAll("[data-animate]");

if ("IntersectionObserver" in window && animatedEls.length) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = parseInt(el.dataset.delay || "0", 10);

          setTimeout(() => {
            el.classList.add("visible");
          }, delay);

          observer.unobserve(el);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  animatedEls.forEach((el) => revealObserver.observe(el));
} else {
  animatedEls.forEach((el) => el.classList.add("visible"));
}

/* ---------- 5. Active nav link for multi-page site ---------- */
const currentPage = window.location.pathname.split("/").pop() || "index.html";
const allNavLinks = document.querySelectorAll(".nav-link, .mobile-link");

allNavLinks.forEach((link) => {
  const href = link.getAttribute("href");

  if (href === currentPage) {
    link.classList.add("active");
  } else if (
    !href.startsWith("http") &&
    !href.startsWith("tel:") &&
    !href.startsWith("mailto:")
  ) {
    link.classList.remove("active");
  }
});

/* ---------- 6. Smooth scroll for anchor links ---------- */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const target = document.querySelector(this.getAttribute("href"));
    if (!target) return;

    e.preventDefault();

    const offset =
      parseInt(
        getComputedStyle(document.documentElement).getPropertyValue("--nav-h"),
        10
      ) || 72;

    const top = target.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({
      top,
      behavior: "smooth"
    });
  });
});

/* ---------- 7. Menu filter + search ---------- */
const menuFilterButtons = document.querySelectorAll("[data-menu-filter]");
const menuSearchInput = document.querySelector("[data-menu-search]");
const menuCards = document.querySelectorAll(".menu-card");

if (menuCards.length) {
  let activeMenuCategory = "all";

  function normalizeText(value) {
    return (value || "").toLowerCase().trim();
  }

  function filterMenuCards() {
    const searchValue = normalizeText(menuSearchInput ? menuSearchInput.value : "");

    menuCards.forEach((card) => {
      const category = normalizeText(card.dataset.category);
      const searchData = normalizeText(card.dataset.search);
      const title = normalizeText(
        card.querySelector(".menu-card-title")?.textContent
      );
      const description = normalizeText(
        card.querySelector(".menu-card-text")?.textContent
      );

      const matchesCategory =
        activeMenuCategory === "all" || category === activeMenuCategory;

      const matchesSearch =
        searchValue === "" ||
        searchData.includes(searchValue) ||
        title.includes(searchValue) ||
        description.includes(searchValue);

      if (matchesCategory && matchesSearch) {
        card.classList.remove("is-hidden");
      } else {
        card.classList.add("is-hidden");
      }
    });
  }

  menuFilterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeMenuCategory = button.dataset.menuFilter || "all";

      menuFilterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      filterMenuCards();
    });
  });

  if (menuSearchInput) {
    menuSearchInput.addEventListener("input", filterMenuCards);
  }

  filterMenuCards();
}