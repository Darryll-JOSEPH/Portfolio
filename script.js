// ========== PORTFOLIO JAVASCRIPT ========== 

// ========== CAROUSEL COMPÉTENCES (existant) ==========
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.skills-carousel').forEach(carousel => {
    let isDown = false;
    let startX, scrollLeft;

    carousel.addEventListener('mousedown', e => {
      isDown = true;
      carousel.classList.add('dragging');
      startX = e.pageX - carousel.offsetLeft;
      scrollLeft = carousel.scrollLeft;
    });

    carousel.addEventListener('mouseleave', () => {
      isDown = false;
      carousel.classList.remove('dragging');
    });

    carousel.addEventListener('mouseup', () => {
      isDown = false;
      carousel.classList.remove('dragging');
    });

    carousel.addEventListener('mousemove', e => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - carousel.offsetLeft;
      const walk = (x - startX) * 1.5;
      carousel.scrollLeft = scrollLeft - walk;
    });

    carousel.addEventListener('click', e => {
      if (isDown) e.preventDefault();
    });
  });
});

// ========== SCROLL TO TOP BUTTON ==========
document.addEventListener('DOMContentLoaded', function() {
  const scrollBtn = document.querySelector('.back-to-top') || document.getElementById('backToTop');

  if (scrollBtn) {
    // Ajouter l'événement de clic pour faire défiler vers le haut
    scrollBtn.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    // Afficher/masquer le bouton selon le scroll
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        scrollBtn.classList.add('show');
      } else {
        scrollBtn.classList.remove('show');
      }
    });
  }
});

// ========== SMOOTH SCROLL ==========
document.addEventListener('DOMContentLoaded', function() {
  // Scroll fluide sur tous les liens internes
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });
});

// ========== CONTACT FORM HANDLER (Google Forms) ==========
document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('contactForm');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      const submitBtn = document.getElementById('submitBtn');
      const originalText = submitBtn.innerHTML;
      
      // Désactiver le bouton et montrer le loading
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
      
      // Le formulaire va se soumettre vers Google Forms
      // Après 2 secondes, on affiche le succès
      setTimeout(() => {
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Message envoyé !';
        submitBtn.style.backgroundColor = '#10b981';
        
        // Réinitialiser le formulaire
        contactForm.reset();
        
        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.style.backgroundColor = '';
          submitBtn.disabled = false;
        }, 3000);
      }, 2000);
    });
  }
});

// ========== GALERIE LIGHTBOX AVANCÉE ==========
class ProjectGallery {
  constructor() {
    this.currentIndex = 0;
    this.images = [];
    this.modal = null;
    this.isOpen = false;
    
    this.init();
  }
  
  init() {
    this.createModal();
    this.bindEvents();
  }
  
  createModal() {
    // Créer le modal lightbox
    this.modal = document.createElement('div');
    this.modal.className = 'lightbox-modal';
    this.modal.innerHTML = `
      <div class="lightbox-content">
        <img class="lightbox-img" src="" alt="">
        
        <!-- Boutons de navigation flottants -->
        <button class="lightbox-nav prev" aria-label="Image précédente">
          <i class="fas fa-chevron-left"></i>
        </button>
        <button class="lightbox-nav next" aria-label="Image suivante">
          <i class="fas fa-chevron-right"></i>
        </button>
        
        <!-- Contrôles en bas -->
        <div class="lightbox-controls">
          <div class="lightbox-info">
            <div class="lightbox-counter">Image 1 sur 1</div>
            <div class="lightbox-caption">Description de l'image</div>
          </div>
          
          <div class="lightbox-buttons">
            <button class="lightbox-btn nav-btn" id="prevBtn">
              <i class="fas fa-chevron-left"></i> Précédent
            </button>
            <button class="lightbox-btn nav-btn" id="nextBtn">
              Suivant <i class="fas fa-chevron-right"></i>
            </button>
            <button class="lightbox-btn close-btn" id="closeBtn">
              <i class="fas fa-times"></i> Fermer
            </button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(this.modal);
    
    // Bind des boutons du modal
    this.bindModalEvents();
  }
  
  bindModalEvents() {
    const prevBtn = this.modal.querySelector('#prevBtn');
    const nextBtn = this.modal.querySelector('#nextBtn');
    const closeBtn = this.modal.querySelector('#closeBtn');
    const prevNav = this.modal.querySelector('.lightbox-nav.prev');
    const nextNav = this.modal.querySelector('.lightbox-nav.next');
    
    prevBtn.addEventListener('click', () => this.previous());
    nextBtn.addEventListener('click', () => this.next());
    closeBtn.addEventListener('click', () => this.close());
    prevNav.addEventListener('click', () => this.previous());
    nextNav.addEventListener('click', () => this.next());
    
    // Fermer avec Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
    
    // Navigation avec flèches
    document.addEventListener('keydown', (e) => {
      if (!this.isOpen) return;
      
      if (e.key === 'ArrowLeft') {
        this.previous();
      } else if (e.key === 'ArrowRight') {
        this.next();
      }
    });
    
    // Fermer en cliquant sur le fond
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.close();
      }
    });
  }
  
  open(images, startIndex = 0) {
    this.images = images;
    this.currentIndex = startIndex;
    this.isOpen = true;
    
    this.modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    this.updateDisplay();
    this.updateNavigation();
  }
  
  close() {
    this.isOpen = false;
    this.modal.style.display = 'none';
    document.body.style.overflow = '';
  }
  
  next() {
    if (this.currentIndex < this.images.length - 1) {
      this.currentIndex++;
      this.updateDisplay();
      this.updateNavigation();
    }
  }
  
  previous() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updateDisplay();
      this.updateNavigation();
    }
  }
  
  updateDisplay() {
    const img = this.modal.querySelector('.lightbox-img');
    const counter = this.modal.querySelector('.lightbox-counter');
    const caption = this.modal.querySelector('.lightbox-caption');
    
    if (this.images[this.currentIndex]) {
      img.src = this.images[this.currentIndex].src;
      img.alt = this.images[this.currentIndex].alt;
      counter.textContent = `Image ${this.currentIndex + 1} sur ${this.images.length}`;
      caption.textContent = this.images[this.currentIndex].title || this.images[this.currentIndex].alt;
    }
  }
  
  updateNavigation() {
    const prevBtn = this.modal.querySelector('#prevBtn');
    const nextBtn = this.modal.querySelector('#nextBtn');
    const prevNav = this.modal.querySelector('.lightbox-nav.prev');
    const nextNav = this.modal.querySelector('.lightbox-nav.next');
    
    // Désactiver/activer les boutons selon la position
    prevBtn.disabled = this.currentIndex === 0;
    nextBtn.disabled = this.currentIndex === this.images.length - 1;
    prevNav.disabled = this.currentIndex === 0;
    nextNav.disabled = this.currentIndex === this.images.length - 1;
    
    // Mettre à jour les styles
    [prevBtn, prevNav].forEach(btn => {
      if (btn.disabled) {
        btn.style.opacity = '0.3';
      } else {
        btn.style.opacity = '1';
      }
    });
    
    [nextBtn, nextNav].forEach(btn => {
      if (btn.disabled) {
        btn.style.opacity = '0.3';
      } else {
        btn.style.opacity = '1';
      }
    });
  }
}

// Initialiser la galerie
let projectGallery;

document.addEventListener('DOMContentLoaded', function() {
  projectGallery = new ProjectGallery();
  
  // Initialiser les galeries existantes
  initProjectGalleries();
  
  // Initialiser les images cliquables des fonctionnalités
  initClickableFeatureImages();
});

// Fonction pour initialiser les galeries de projets
function initProjectGalleries() {
  // Chercher toutes les galeries de projets
  const galleries = document.querySelectorAll('.project-gallery');
  
  galleries.forEach(gallery => {
    const items = gallery.querySelectorAll('.gallery-item');
    
    items.forEach((item, index) => {
      item.addEventListener('click', () => {
        const images = Array.from(items).map(img => ({
          src: img.querySelector('img').src,
          alt: img.querySelector('img').alt,
          title: img.querySelector('.gallery-item-title')?.textContent || ''
        }));
        
        projectGallery.open(images, index);
      });
    });
  });
}

// Fonction pour initialiser les images cliquables des fonctionnalités
function initClickableFeatureImages() {
  const clickableImages = document.querySelectorAll('.clickable-image');
  
  clickableImages.forEach((img, index) => {
    img.addEventListener('click', () => {
      const imageData = {
        src: img.src,
        alt: img.alt,
        title: img.getAttribute('data-title') || img.alt
      };
      
      // Ouvrir le lightbox avec une seule image
      projectGallery.open([imageData], 0);
    });
  });
}

// Fonction utilitaire pour créer une galerie
function createProjectGallery(containerId, images) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  container.innerHTML = '';
  
  images.forEach((image, index) => {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.innerHTML = `
      <img src="${image.src}" alt="${image.alt}" loading="lazy">
      <div class="gallery-item-overlay">
        <div class="gallery-item-title">${image.title}</div>
        <div class="gallery-item-desc">${image.description || ''}</div>
      </div>
    `;
    
    item.addEventListener('click', () => {
      projectGallery.open(images, index);
    });
    
    container.appendChild(item);
  });
}

// ========== GOOGLE ANALYTICS EVENTS TRACKING ==========
document.addEventListener('DOMContentLoaded', function() {
  // Fonction pour envoyer des événements à Google Analytics
  function trackEvent(eventName, eventCategory, eventAction, eventLabel, eventValue) {
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, {
        event_category: eventCategory,
        event_action: eventAction,
        event_label: eventLabel,
        value: eventValue
      });
    }
    
    // Alternative pour Google Tag Manager
    if (typeof dataLayer !== 'undefined') {
      dataLayer.push({
        'event': eventName,
        'event_category': eventCategory,
        'event_action': eventAction,
        'event_label': eventLabel,
        'value': eventValue
      });
    }
  }

  // Suivi des téléchargements de CV
  const cvDownloadLinks = document.querySelectorAll('a[href*="Eliesse.pdf"]');
  cvDownloadLinks.forEach(link => {
    link.addEventListener('click', function() {
      trackEvent('cv_download', 'engagement', 'download', 'CV_Eliesse_Laslah', 1);
    });
  });

  // Suivi des clics sur les projets
  const projectLinks = document.querySelectorAll('.project-link, .project-card a');
  projectLinks.forEach(link => {
    link.addEventListener('click', function() {
      const projectName = this.closest('.project-card')?.querySelector('h3')?.textContent || 
                         this.textContent.trim();
      trackEvent('project_view', 'engagement', 'click', projectName, 1);
    });
  });

  // Suivi des clics sur les liens sociaux
  const socialLinks = document.querySelectorAll('.social-icons a, .footer-links a');
  socialLinks.forEach(link => {
    link.addEventListener('click', function() {
      const platform = this.getAttribute('aria-label') || 
                      this.querySelector('i').className.split('fa-')[1] || 
                      'unknown';
      trackEvent('social_click', 'engagement', 'click', platform, 1);
    });
  });

  // Suivi des soumissions de formulaire de contact
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function() {
      trackEvent('contact_form_submit', 'engagement', 'submit', 'contact_form', 1);
    });
  }

  // Suivi des changements de langue
  const languageSelect = document.getElementById('languageSelect');
  if (languageSelect) {
    languageSelect.addEventListener('change', function() {
      trackEvent('language_change', 'engagement', 'change', this.value, 1);
    });
  }

  // Suivi des clics sur les liens de navigation
  const navLinks = document.querySelectorAll('.nav-links a, .nav-btn');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      const linkText = this.textContent.trim();
      const linkHref = this.getAttribute('href');
      trackEvent('navigation_click', 'engagement', 'click', `${linkText} (${linkHref})`, 1);
    });
  });

  // Suivi des interactions avec les compétences
  const skillCards = document.querySelectorAll('.skill-card');
  skillCards.forEach(card => {
    card.addEventListener('click', function() {
      const skillName = this.querySelector('span')?.textContent || 'unknown_skill';
      trackEvent('skill_interaction', 'engagement', 'click', skillName, 1);
    });
  });

  // Suivi des clics sur les images de galerie
  const galleryItems = document.querySelectorAll('.gallery-item');
  galleryItems.forEach((item, index) => {
    item.addEventListener('click', function() {
      const imageTitle = this.querySelector('.gallery-item-title')?.textContent || `Image_${index + 1}`;
      trackEvent('gallery_view', 'engagement', 'click', imageTitle, 1);
    });
  });

  // Suivi du scroll (événement de scroll significatif)
  let scrollTimeout;
  window.addEventListener('scroll', function() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(function() {
      const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
      
      // Envoyer un événement tous les 25% de scroll
      if (scrollPercent >= 25 && scrollPercent < 50) {
        trackEvent('scroll_depth', 'engagement', 'scroll', '25%', 25);
      } else if (scrollPercent >= 50 && scrollPercent < 75) {
        trackEvent('scroll_depth', 'engagement', 'scroll', '50%', 50);
      } else if (scrollPercent >= 75 && scrollPercent < 100) {
        trackEvent('scroll_depth', 'engagement', 'scroll', '75%', 75);
      } else if (scrollPercent >= 100) {
        trackEvent('scroll_depth', 'engagement', 'scroll', '100%', 100);
      }
    }, 1000);
  });

  // Suivi du temps passé sur la page
  let startTime = Date.now();
  let timeOnPage = 0;
  
  setInterval(function() {
    timeOnPage = Math.round((Date.now() - startTime) / 1000);
    
    // Envoyer un événement toutes les 30 secondes
    if (timeOnPage > 0 && timeOnPage % 30 === 0) {
      trackEvent('time_on_page', 'engagement', 'time', `${timeOnPage}s`, timeOnPage);
    }
  }, 1000);

  // Suivi de la sortie de page
  window.addEventListener('beforeunload', function() {
    const finalTime = Math.round((Date.now() - startTime) / 1000);
    trackEvent('page_exit', 'engagement', 'exit', `${finalTime}s`, finalTime);
  });
});

// ========== COOKIE BANNER MANAGEMENT ==========
document.addEventListener('DOMContentLoaded', function() {
  const cookieBanner = document.getElementById('cookieBanner');
  const acceptBtn = document.getElementById('acceptCookies');
  const declineBtn = document.getElementById('declineCookies');
  
  // Vérifier si l'utilisateur a déjà fait un choix
  const cookieChoice = localStorage.getItem('cookieConsent');
  
  if (!cookieChoice) {
    // Afficher la bannière après 2 secondes
    setTimeout(() => {
      cookieBanner.style.display = 'block';
      setTimeout(() => {
        cookieBanner.classList.add('show');
      }, 100);
    }, 2000);
  }
  
  // Gérer l'acceptation des cookies
  if (acceptBtn) {
    acceptBtn.addEventListener('click', function() {
      localStorage.setItem('cookieConsent', 'accepted');
      cookieBanner.classList.remove('show');
      
      // Activer Google Analytics
      if (typeof gtag !== 'undefined') {
        gtag('consent', 'update', {
          'analytics_storage': 'granted'
        });
      }
      
      // Masquer la bannière
      setTimeout(() => {
        cookieBanner.style.display = 'none';
      }, 300);
      
      // Envoyer un événement de consentement
      if (typeof gtag !== 'undefined') {
        gtag('event', 'cookie_consent', {
          'event_category': 'privacy',
          'event_action': 'accept',
          'event_label': 'cookies_accepted'
        });
      }
    });
  }
  
  // Gérer le refus des cookies
  if (declineBtn) {
    declineBtn.addEventListener('click', function() {
      localStorage.setItem('cookieConsent', 'declined');
      cookieBanner.classList.remove('show');
      
      // Désactiver Google Analytics
      if (typeof gtag !== 'undefined') {
        gtag('consent', 'update', {
          'analytics_storage': 'denied'
        });
      }
      
      // Masquer la bannière
      setTimeout(() => {
        cookieBanner.style.display = 'none';
      }, 300);
      
      // Envoyer un événement de refus
      if (typeof gtag !== 'undefined') {
        gtag('event', 'cookie_consent', {
          'event_category': 'privacy',
          'event_action': 'decline',
          'event_label': 'cookies_declined'
        });
      }
    });
  }
  
  // Gérer le consentement initial
  if (cookieChoice === 'accepted') {
    // L'utilisateur a accepté, activer le suivi
    if (typeof gtag !== 'undefined') {
      gtag('consent', 'update', {
        'analytics_storage': 'granted'
      });
    }
  } else if (cookieChoice === 'declined') {
    // L'utilisateur a refusé, désactiver le suivi
    if (typeof gtag !== 'undefined') {
      gtag('consent', 'update', {
        'analytics_storage': 'denied'
      });
    }
  }
});

