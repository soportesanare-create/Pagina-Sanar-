document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

  // Año dinámico
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // Navegación móvil
  const navToggle = document.getElementById("navToggle");
  if (navToggle) {
    navToggle.addEventListener("click", () => {
      body.classList.toggle("nav-open");
    });
  }

  
  // Modal: Representantes
  const repsModal = document.getElementById("repsModal");
  const repsCloseBtn = document.getElementById("repsModalClose");
  const repsBackdrop = repsModal ? repsModal.querySelector("[data-reps-close]") : null;

  function openRepsModal() {
    if (!repsModal) return;
    repsModal.classList.add("open");
    repsModal.setAttribute("aria-hidden", "false");
    body.classList.add("modal-open");
  }
  function closeRepsModal() {
    if (!repsModal) return;
    repsModal.classList.remove("open");
    repsModal.setAttribute("aria-hidden", "true");
    body.classList.remove("modal-open");
  }

  if (repsCloseBtn) repsCloseBtn.addEventListener("click", closeRepsModal);
  if (repsBackdrop) repsBackdrop.addEventListener("click", closeRepsModal);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && repsModal && repsModal.classList.contains("open")) {
      closeRepsModal();
    }
  });


// Scroll suave para links internos
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href");
      if (targetId === "#representantes") {
        e.preventDefault();
        body.classList.remove("nav-open");
        openRepsModal();
        return;
      }

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 80;
        const rect = targetEl.getBoundingClientRect();
        const offsetTop = rect.top + window.scrollY - headerOffset;
        window.scrollTo({ top: offsetTop, behavior: "smooth" });
        body.classList.remove("nav-open");
      }
    });
  });

  // Contadores animados
  const counters = document.querySelectorAll(".counter");
  const animateCounters = () => {
    counters.forEach((counter) => {
      const updateCount = () => {
        const target = parseInt(counter.getAttribute("data-count") || "0", 10);
        const current = parseInt(counter.textContent || "0", 10);
        const increment = Math.ceil(target / 80);
        if (current < target) {
          counter.textContent = String(current + increment);
          requestAnimationFrame(updateCount);
        } else {
          counter.textContent = String(target);
        }
      };
      updateCount();
    });
  };

  let countersStarted = false;
  const heroSection = document.querySelector(".hero");
  if ("IntersectionObserver" in window && heroSection) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !countersStarted) {
            countersStarted = true;
            animateCounters();
          }
        });
      },
      { threshold: 0.4 }
    );
    observer.observe(heroSection);
  } else {
    animateCounters();
  }

  // Reveal on scroll
  const revealElements = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 }
    );
    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add("reveal-visible"));
  }

  // Filtro de tratamientos
  const filterChips = document.querySelectorAll(".chip-filter");
  const treatmentCards = document.querySelectorAll(".treatment-card");

  filterChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const filter = chip.getAttribute("data-filter");
      filterChips.forEach((c) => c.classList.remove("chip-active"));
      chip.classList.add("chip-active");

      treatmentCards.forEach((card) => {
        const category = card.getAttribute("data-category");
        if (filter === "all" || category === filter) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      });
    });
  });

  // Testimonios slider
  const testimonialsSlider = document.getElementById("testimonialsSlider");
  const testimonials = document.querySelectorAll(".testimonial");
  const dots = document.querySelectorAll(".dot");
  let currentIndex = 0;
  let sliderInterval;

  const updateTestimonialsHeight = () => {
    if (!testimonialsSlider) return;
    const active = testimonialsSlider.querySelector(".testimonial.active");
    const dotsWrap = testimonialsSlider.querySelector(".slider-dots");

    const activeH = active ? active.offsetHeight : 0;
    const dotsH = dotsWrap ? dotsWrap.offsetHeight : 0;
    const extra = 24; // aire visual
    const min = Math.max(activeH + dotsH + extra, 220);
    testimonialsSlider.style.minHeight = `${min}px`;
  };

  const setActiveSlide = (index) => {
    testimonials.forEach((t, i) => {
      t.classList.toggle("active", i === index);
    });
    dots.forEach((d, i) => {
      d.classList.toggle("active", i === index);
    });
    currentIndex = index;
    updateTestimonialsHeight();
  };

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const index = parseInt(dot.getAttribute("data-index") || "0", 10);
      setActiveSlide(index);
      restartSlider();
    });
  });

  const nextSlide = () => {
    const nextIndex = (currentIndex + 1) % testimonials.length;
    setActiveSlide(nextIndex);
  };

  const startSlider = () => {
    sliderInterval = setInterval(nextSlide, 7000);
  };

  const restartSlider = () => {
    clearInterval(sliderInterval);
    startSlider();
  };

  if (testimonials.length > 0) {
    // Altura inicial para evitar que la sección siguiente se encime
    updateTestimonialsHeight();

    // Recalcular al cambiar el tamaño (móvil / rotación)
    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updateTestimonialsHeight, 120);
    });

    startSlider();
  }

  // Filtro de sedes
  const sedeFilter = document.getElementById("sedeFilter");
  const sedesCards = document.querySelectorAll(".sede-card");

  if (sedeFilter) {
    sedeFilter.addEventListener("change", () => {
      const value = sedeFilter.value;
      sedesCards.forEach((card) => {
        const city = card.getAttribute("data-city");
        if (value === "all" || city === value) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      });
    });

  // Mapa modal sedes
  const mapModal = document.getElementById("mapModal");
  const mapFrame = document.getElementById("mapModalFrame");
  const mapTitle = document.getElementById("mapModalTitle");
  const mapOpenLink = document.getElementById("mapModalOpen");
  const mapCloseBtn = document.getElementById("mapModalClose");
  const sedeGalleryTrack = document.getElementById("sedeGalleryTrack");
  const sedeGalleryThumbs = document.getElementById("sedeGalleryThumbs");
  const sedeGalleryMeta = document.getElementById("sedeGalleryMeta");
  const sedeGalleryPrev = document.getElementById("sedeGalleryPrev");
  const sedeGalleryNext = document.getElementById("sedeGalleryNext");

  const sedeGalleryData = {
  "morelia": [
    "assets/img/sedes/morelia/morelia-001.webp",
    "assets/img/sedes/morelia/morelia-002.webp",
    "assets/img/sedes/morelia/morelia-003.webp",
    "assets/img/sedes/morelia/morelia-004.webp",
    "assets/img/sedes/morelia/morelia-005.webp",
    "assets/img/sedes/morelia/morelia-006.webp",
    "assets/img/sedes/morelia/morelia-007.webp",
    "assets/img/sedes/morelia/morelia-008.webp",
    "assets/img/sedes/morelia/morelia-009.webp",
    "assets/img/sedes/morelia/morelia-010.webp",
    "assets/img/sedes/morelia/morelia-011.webp",
    "assets/img/sedes/morelia/morelia-012.webp",
    "assets/img/sedes/morelia/morelia-014.webp",
    "assets/img/sedes/morelia/morelia-015.webp",
    "assets/img/sedes/morelia/morelia-016.webp",
    "assets/img/sedes/morelia/morelia-017.webp",
    "assets/img/sedes/morelia/morelia-018.webp",
    "assets/img/sedes/morelia/morelia-019.webp",
    "assets/img/sedes/morelia/morelia-020.webp",
    "assets/img/sedes/morelia/morelia-021.webp",
    "assets/img/sedes/morelia/morelia-022.webp",
    "assets/img/sedes/morelia/morelia-023.webp"
  ],
  "narvarte": [
    "assets/img/sedes/narvarte/narvarte-001.webp",
    "assets/img/sedes/narvarte/narvarte-002.webp",
    "assets/img/sedes/narvarte/narvarte-003.webp",
    "assets/img/sedes/narvarte/narvarte-004.webp",
    "assets/img/sedes/narvarte/narvarte-005.webp",
    "assets/img/sedes/narvarte/narvarte-006.webp",
    "assets/img/sedes/narvarte/narvarte-008.webp",
    "assets/img/sedes/narvarte/narvarte-009.webp",
    "assets/img/sedes/narvarte/narvarte-010.webp",
    "assets/img/sedes/narvarte/narvarte-011.webp",
    "assets/img/sedes/narvarte/narvarte-013.webp",
    "assets/img/sedes/narvarte/narvarte-014.webp",
    "assets/img/sedes/narvarte/narvarte-015.webp",
    "assets/img/sedes/narvarte/narvarte-016.webp",
    "assets/img/sedes/narvarte/narvarte-017.webp",
    "assets/img/sedes/narvarte/narvarte-018.webp",
    "assets/img/sedes/narvarte/narvarte-019.webp",
    "assets/img/sedes/narvarte/narvarte-020.webp",
    "assets/img/sedes/narvarte/narvarte-021.webp",
    "assets/img/sedes/narvarte/narvarte-022.webp",
    "assets/img/sedes/narvarte/narvarte-023.webp",
    "assets/img/sedes/narvarte/narvarte-024.webp",
    "assets/img/sedes/narvarte/narvarte-025.webp",
    "assets/img/sedes/narvarte/narvarte-026.webp",
    "assets/img/sedes/narvarte/narvarte-027.webp",
    "assets/img/sedes/narvarte/narvarte-028.webp",
    "assets/img/sedes/narvarte/narvarte-032.webp",
    "assets/img/sedes/narvarte/narvarte-033.webp",
    "assets/img/sedes/narvarte/narvarte-034.webp",
    "assets/img/sedes/narvarte/narvarte-035.webp",
    "assets/img/sedes/narvarte/narvarte-036.webp",
    "assets/img/sedes/narvarte/narvarte-037.webp",
    "assets/img/sedes/narvarte/narvarte-038.webp",
    "assets/img/sedes/narvarte/narvarte-039.webp",
    "assets/img/sedes/narvarte/narvarte-040.webp",
    "assets/img/sedes/narvarte/narvarte-041.webp",
    "assets/img/sedes/narvarte/narvarte-042.webp",
    "assets/img/sedes/narvarte/narvarte-043.webp",
    "assets/img/sedes/narvarte/narvarte-044.webp",
    "assets/img/sedes/narvarte/narvarte-045.webp",
    "assets/img/sedes/narvarte/narvarte-046.webp",
    "assets/img/sedes/narvarte/narvarte-047.webp",
    "assets/img/sedes/narvarte/narvarte-048.webp",
    "assets/img/sedes/narvarte/narvarte-049.webp",
    "assets/img/sedes/narvarte/narvarte-050.webp",
  ],
  "toluca": [
    "assets/img/sedes/toluca/toluca-001.webp",
    "assets/img/sedes/toluca/toluca-002.webp",
    "assets/img/sedes/toluca/toluca-003.webp",
    "assets/img/sedes/toluca/toluca-004.webp",
    "assets/img/sedes/toluca/toluca-005.webp",
    "assets/img/sedes/toluca/toluca-007.webp",
    "assets/img/sedes/toluca/toluca-008.webp",
    "assets/img/sedes/toluca/toluca-009.webp",
    "assets/img/sedes/toluca/toluca-010.webp",
    "assets/img/sedes/toluca/toluca-011.webp",
    "assets/img/sedes/toluca/toluca-012.webp",
    "assets/img/sedes/toluca/toluca-013.webp",
    "assets/img/sedes/toluca/toluca-014.webp",
    "assets/img/sedes/toluca/toluca-015.webp",
    "assets/img/sedes/toluca/toluca-016.webp",
    "assets/img/sedes/toluca/toluca-017.webp",
    "assets/img/sedes/toluca/toluca-018.webp",
    "assets/img/sedes/toluca/toluca-019.webp",
    "assets/img/sedes/toluca/toluca-020.webp",
    "assets/img/sedes/toluca/toluca-021.webp",
    "assets/img/sedes/toluca/toluca-022.webp",
    "assets/img/sedes/toluca/toluca-023.webp",
    "assets/img/sedes/toluca/toluca-024.webp",
    "assets/img/sedes/toluca/toluca-025.webp",
    "assets/img/sedes/toluca/toluca-026.webp",
    "assets/img/sedes/toluca/toluca-027.webp",
    "assets/img/sedes/toluca/toluca-028.webp",
    "assets/img/sedes/toluca/toluca-029.webp",
    "assets/img/sedes/toluca/toluca-030.webp",
    "assets/img/sedes/toluca/toluca-031.webp",
    "assets/img/sedes/toluca/toluca-032.webp",
    "assets/img/sedes/toluca/toluca-033.webp",
    "assets/img/sedes/toluca/toluca-034.webp",
    "assets/img/sedes/toluca/toluca-035.webp",
    "assets/img/sedes/toluca/toluca-036.webp",
    "assets/img/sedes/toluca/toluca-037.webp",
    "assets/img/sedes/toluca/toluca-038.webp",
    "assets/img/sedes/toluca/toluca-039.webp",
    "assets/img/sedes/toluca/toluca-040.webp",
    "assets/img/sedes/toluca/toluca-041.webp",
    "assets/img/sedes/toluca/toluca-042.webp",
    "assets/img/sedes/toluca/toluca-043.webp",
    "assets/img/sedes/toluca/toluca-044.webp",
    "assets/img/sedes/toluca/toluca-045.webp",
    "assets/img/sedes/toluca/toluca-046.webp",
    "assets/img/sedes/toluca/toluca-047.webp",
    "assets/img/sedes/toluca/toluca-048.webp",
    "assets/img/sedes/toluca/toluca-049.webp",
    "assets/img/sedes/toluca/toluca-050.webp",
    "assets/img/sedes/toluca/toluca-051.webp",
    "assets/img/sedes/toluca/toluca-052.webp",
    "assets/img/sedes/toluca/toluca-053.webp",
    "assets/img/sedes/toluca/toluca-054.webp",
    "assets/img/sedes/toluca/toluca-055.webp",
    "assets/img/sedes/toluca/toluca-056.webp",
    "assets/img/sedes/toluca/toluca-057.webp",
    "assets/img/sedes/toluca/toluca-058.webp",
    "assets/img/sedes/toluca/toluca-059.webp",
    "assets/img/sedes/toluca/toluca-060.webp",
    "assets/img/sedes/toluca/toluca-061.webp",
    "assets/img/sedes/toluca/toluca-062.webp",
    "assets/img/sedes/toluca/toluca-063.webp"
  ]
};

  let lastFocusedEl = null;
  let sedeGalleryTimer = null;
  let currentGalleryIndex = 0;

  const stopSedeGalleryAutoplay = () => {
    if (sedeGalleryTimer) {
      clearInterval(sedeGalleryTimer);
      sedeGalleryTimer = null;
    }
  };

  const renderSedeGallery = (sedeKey, title, startIndex = 0) => {
    if (!sedeGalleryTrack || !sedeGalleryThumbs || !sedeGalleryMeta) return;
    const images = sedeGalleryData[sedeKey] || [];
    currentGalleryIndex = Math.max(0, Math.min(startIndex, Math.max(images.length - 1, 0)));

    sedeGalleryTrack.innerHTML = images.map((src, index) => `
      <div class="sede-gallery-slide${index === currentGalleryIndex ? ' is-active' : ''}" data-index="${index}">
        <img src="${src}" alt="Foto ${index + 1} de ${title || 'la sede'}" loading="lazy" decoding="async">
      </div>
    `).join("");

    sedeGalleryThumbs.innerHTML = images.map((src, index) => `
      <button class="sede-thumb${index === currentGalleryIndex ? ' is-active' : ''}" type="button" data-index="${index}" aria-label="Ver foto ${index + 1}">
        <img src="${src}" alt="Miniatura ${index + 1}" loading="lazy" decoding="async">
      </button>
    `).join("");

    const updateGallery = (nextIndex) => {
      const slides = Array.from(sedeGalleryTrack.querySelectorAll('.sede-gallery-slide'));
      const thumbs = Array.from(sedeGalleryThumbs.querySelectorAll('.sede-thumb'));
      if (!slides.length) {
        sedeGalleryMeta.textContent = 'Sin fotos';
        return;
      }
      currentGalleryIndex = (nextIndex + slides.length) % slides.length;
      slides.forEach((slide, idx) => slide.classList.toggle('is-active', idx === currentGalleryIndex));
      thumbs.forEach((thumb, idx) => thumb.classList.toggle('is-active', idx === currentGalleryIndex));
      sedeGalleryMeta.textContent = `${currentGalleryIndex + 1} / ${slides.length}`;
      const activeThumb = thumbs[currentGalleryIndex];
      if (activeThumb) activeThumb.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
    };

    sedeGalleryThumbs.querySelectorAll('.sede-thumb').forEach((thumb) => {
      thumb.addEventListener('click', () => {
        updateGallery(Number(thumb.dataset.index || 0));
        stopSedeGalleryAutoplay();
      });
    });

    if (sedeGalleryPrev) {
      sedeGalleryPrev.onclick = () => {
        updateGallery(currentGalleryIndex - 1);
        stopSedeGalleryAutoplay();
      };
    }

    if (sedeGalleryNext) {
      sedeGalleryNext.onclick = () => {
        updateGallery(currentGalleryIndex + 1);
        stopSedeGalleryAutoplay();
      };
    }

    updateGallery(currentGalleryIndex);
    stopSedeGalleryAutoplay();
    if (images.length > 1) {
      sedeGalleryTimer = setInterval(() => updateGallery(currentGalleryIndex + 1), 4200);
    }
  };

  const openMapModal = ({ title, address, href, sedeKey }) => {
    if (!mapModal || !mapFrame || !mapTitle || !mapOpenLink) return;

    const safeHref = typeof href === "string" && href.startsWith("http") ? href : "#";
    const safeTitle = title || "Ubicación";
    const safeAddress = address || "";

    mapTitle.textContent = safeTitle;
    mapOpenLink.href = safeHref;
    mapFrame.src = "https://www.google.com/maps?q=" + encodeURIComponent(safeAddress) + "&output=embed";
    renderSedeGallery(sedeKey || "", safeTitle, 0);

    lastFocusedEl = document.activeElement;
    document.body.classList.add("modal-open");
    mapModal.classList.add("is-open");
    mapModal.setAttribute("aria-hidden", "false");

    if (mapCloseBtn) mapCloseBtn.focus();
  };

  const closeMapModal = () => {
    if (!mapModal || !mapFrame) return;
    mapModal.classList.remove("is-open");
    mapModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    mapFrame.src = "about:blank";
    stopSedeGalleryAutoplay();

    if (lastFocusedEl && typeof lastFocusedEl.focus === "function") {
      lastFocusedEl.focus();
    }
    lastFocusedEl = null;
  };

  document.querySelectorAll(".sede-details").forEach((link) => {
    link.addEventListener("click", (e) => {
      if (!mapModal) return;
      const address = link.getAttribute("data-address") || "";
      if (!address) return;

      e.preventDefault();
      openMapModal({
        title: link.getAttribute("data-title") || "Ubicación",
        address,
        href: link.getAttribute("href") || "#",
        sedeKey: link.getAttribute("data-sede") || "",
      });
    });
  });

  const sedePins = document.querySelectorAll(".sede-pin");
  if (sedePins.length > 0) {
    sedePins.forEach((pin) => {
      pin.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        const title = pin.getAttribute("data-title") || pin.getAttribute("aria-label") || "Ubicación";
        const address = pin.getAttribute("data-address") || "";
        const href = pin.getAttribute("data-href") || "#";
        const sedeKey = pin.getAttribute("data-sede") || "";

        if (address) {
          openMapModal({ title, address, href, sedeKey });
        }
      });
    });
  }

  if (mapCloseBtn) {
    mapCloseBtn.addEventListener("click", closeMapModal);
  }

  if (mapModal) {
    mapModal.addEventListener("click", (e) => {
      const target = e.target;
      if (target && target.getAttribute && target.getAttribute("data-map-close") === "true") {
        closeMapModal();
      }
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mapModal && mapModal.classList.contains("is-open")) {
      closeMapModal();
    }
  });


  }

  // Toast helper
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toastMessage");
  const showToast = (message) => {
    if (!toast || !toastMessage) return;
    toastMessage.textContent = message;
    toast.classList.add("toast-visible");
    setTimeout(() => {
      toast.classList.remove("toast-visible");
    }, 3500);
  };

  // "Enviar" del formulario (simulado)
  const btnEnviar = document.getElementById("btnEnviar");
  const form = document.querySelector(".contact-form");

  if (btnEnviar && form) {
    btnEnviar.addEventListener("click", () => {
      const nombre = document.getElementById("nombre");
      const telefono = document.getElementById("telefono");
      const correo = document.getElementById("correo");

      if (!nombre.value || !telefono.value || !correo.value) {
        showToast("Por favor completa los campos obligatorios.");
        return;
      }

      form.reset();
      showToast("¡Gracias! Un coordinador Sanaré se pondrá en contacto contigo.");
    });
  }


  // Carrusel (Contacto - columna derecha)
  const galleryRoot = document.getElementById("contactGallery");
  if (galleryRoot) {
    const track = galleryRoot.querySelector(".sgc-track");
    const slides = Array.from(galleryRoot.querySelectorAll(".sgc-slide"));
    const prevBtn = galleryRoot.querySelector(".sgc-prev");
    const nextBtn = galleryRoot.querySelector(".sgc-next");
    const dotsWrap = galleryRoot.querySelector(".sgc-dots");

    let idx = 0;
    let timer = null;
    const intervalMs = 5200;

    const dots = slides.map((_, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "sgc-dot";
      b.setAttribute("aria-label", `Ir a la imagen ${i + 1}`);
      b.addEventListener("click", () => goTo(i, true));
      dotsWrap && dotsWrap.appendChild(b);
      return b;
    });

    const render = () => {
      if (track) track.style.transform = `translateX(${-idx * 100}%)`;
      dots.forEach((d, i) => d.setAttribute("aria-selected", i === idx ? "true" : "false"));
    };

    const stop = () => {
      if (timer) clearInterval(timer);
      timer = null;
    };

    const start = () => {
      stop();
      timer = setInterval(() => goTo(idx + 1, false), intervalMs);
    };

    const goTo = (i, userAction) => {
      idx = (i + slides.length) % slides.length;
      render();
      if (userAction) start();
    };

    const next = () => goTo(idx + 1, true);
    const prev = () => goTo(idx - 1, true);

    if (nextBtn) nextBtn.addEventListener("click", next);
    if (prevBtn) prevBtn.addEventListener("click", prev);

    // Swipe (móvil)
    let startX = 0;
    let dx = 0;
    let dragging = false;

    galleryRoot.addEventListener("touchstart", (e) => {
      dragging = true;
      startX = e.touches[0].clientX;
      dx = 0;
    }, { passive: true });

    galleryRoot.addEventListener("touchmove", (e) => {
      if (!dragging) return;
      dx = e.touches[0].clientX - startX;
    }, { passive: true });

    galleryRoot.addEventListener("touchend", () => {
      if (!dragging) return;
      dragging = false;
      if (Math.abs(dx) > 40) {
        dx < 0 ? next() : prev();
      }
    });

    // Pausa al pasar mouse
    galleryRoot.addEventListener("mouseenter", stop);
    galleryRoot.addEventListener("mouseleave", start);

    render();
    start();
  }

});
