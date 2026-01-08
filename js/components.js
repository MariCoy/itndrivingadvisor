// Language configuration
const LANGUAGES = {
  en: { code: 'EN', flag: '🇬🇧', name: 'English', path: '' },
  es: { code: 'ES', flag: '🇪🇸', name: 'Español', path: '/es' },
  fr: { code: 'FR', flag: '🇫🇷', name: 'Français', path: '/fr' },
  it: { code: 'IT', flag: '🇮🇹', name: 'Italiano', path: '/it' }
};

// Translations for header and footer
const TRANSLATIONS = {
  en: {
    nav: {
      howItWorks: 'How it works',
      pricing: 'Pricing',
      faq: 'FAQ',
      contact: 'Contact Us',
      getYourIdp: 'Get Your IDP'
    },
    footer: {
      tagline: 'Your trusted partner for international driving translations.',
      support: 'Support',
      company: 'Company',
      legal: 'Legal',
      aboutUs: 'About Us',
      contact: 'Contact',
      faq: 'FAQ',
      privacyPolicy: 'Privacy Policy',
      cookiePolicy: 'Cookie Policy',
      termsConditions: 'Terms & Conditions',
      legalDisclaimer: 'Legal Disclaimer',
      refundPolicy: 'Refund Policy',
      shippingDelivery: 'Shipping & Delivery',
      copyright: '© 2025 International Driving Advisor. All rights reserved.',
      disclaimer: 'Legal Disclaimer: The document from International Driving Advisor is a private translation of your national driver\'s license — not a government-issued IDP and does not grant legal driving rights. It is also not affiliated with or endorsed by American Automobile Association (AAA) or any official licensing authority. When driving abroad, always carry your original license.'
    }
  },
  es: {
    nav: {
      howItWorks: 'Cómo funciona',
      pricing: 'Precios',
      faq: 'Preguntas Frecuentes',
      contact: 'Contáctenos',
      getYourIdp: 'Obtenga su PCI'
    },
    footer: {
      tagline: 'Su socio de confianza para traducciones de licencias de conducir internacionales.',
      support: 'Soporte',
      company: 'Empresa',
      legal: 'Legal',
      aboutUs: 'Sobre Nosotros',
      contact: 'Contacto',
      faq: 'Preguntas Frecuentes',
      privacyPolicy: 'Política de Privacidad',
      cookiePolicy: 'Política de Cookies',
      termsConditions: 'Términos y Condiciones',
      legalDisclaimer: 'Aviso Legal',
      refundPolicy: 'Política de Reembolso',
      shippingDelivery: 'Envío y Entrega',
      copyright: '© 2025 International Driving Advisor. Todos los derechos reservados.',
      disclaimer: 'Aviso Legal: El documento de International Driving Advisor es una traducción privada de su licencia de conducir nacional — no es un PCI emitido por el gobierno y no otorga derechos legales de conducción. Tampoco está afiliado ni respaldado por la American Automobile Association (AAA) ni ninguna autoridad oficial de licencias. Al conducir en el extranjero, siempre lleve su licencia original.'
    }
  },
  fr: {
    nav: {
      howItWorks: 'Comment ça marche',
      pricing: 'Tarifs',
      faq: 'FAQ',
      contact: 'Contactez-nous',
      getYourIdp: 'Obtenez votre PCI'
    },
    footer: {
      tagline: 'Votre partenaire de confiance pour les traductions de permis de conduire internationaux.',
      support: 'Support',
      company: 'Entreprise',
      legal: 'Mentions Légales',
      aboutUs: 'À Propos',
      contact: 'Contact',
      faq: 'FAQ',
      privacyPolicy: 'Politique de Confidentialité',
      cookiePolicy: 'Politique des Cookies',
      termsConditions: 'Conditions Générales',
      legalDisclaimer: 'Avertissement Juridique',
      refundPolicy: 'Politique de Remboursement',
      shippingDelivery: 'Expédition et Livraison',
      copyright: '© 2025 International Driving Advisor. Tous droits réservés.',
      disclaimer: 'Avertissement Juridique : Le document d\'International Driving Advisor est une traduction privée de votre permis de conduire national — ce n\'est pas un PCI délivré par le gouvernement et n\'accorde pas de droits de conduite légaux. Il n\'est pas non plus affilié ni approuvé par l\'American Automobile Association (AAA) ou toute autorité officielle de délivrance de permis. Lorsque vous conduisez à l\'étranger, gardez toujours votre permis original.'
    }
  },
  it: {
    nav: {
      howItWorks: 'Come funziona',
      pricing: 'Prezzi',
      faq: 'FAQ',
      contact: 'Contattaci',
      getYourIdp: 'Ottieni la tua PCI'
    },
    footer: {
      tagline: 'Il tuo partner di fiducia per le traduzioni di patenti di guida internazionali.',
      support: 'Supporto',
      company: 'Azienda',
      legal: 'Legale',
      aboutUs: 'Chi Siamo',
      contact: 'Contatti',
      faq: 'FAQ',
      privacyPolicy: 'Informativa sulla Privacy',
      cookiePolicy: 'Politica sui Cookie',
      termsConditions: 'Termini e Condizioni',
      legalDisclaimer: 'Disclaimer Legale',
      refundPolicy: 'Politica Rimborsi',
      shippingDelivery: 'Spedizione e Consegna',
      copyright: '© 2025 International Driving Advisor. Tutti i diritti riservati.',
      disclaimer: 'Disclaimer Legale: Il documento di International Driving Advisor è una traduzione privata della Sua patente di guida nazionale — non è una PCI rilasciata dal governo e non concede diritti legali di guida. Non è inoltre affiliato né approvato dall\'American Automobile Association (AAA) o da qualsiasi autorità ufficiale di rilascio patenti. Quando guida all\'estero, porti sempre la Sua patente originale.'
    }
  }
};

// Detect current language from URL path
function detectLanguage() {
  const path = window.location.pathname;
  if (path.startsWith('/es/') || path === '/es') return 'es';
  if (path.startsWith('/fr/') || path === '/fr') return 'fr';
  if (path.startsWith('/it/') || path === '/it') return 'it';
  return 'en';
}

// Get the base path for assets (handles subdirectory structure)
function getBasePath() {
  const lang = detectLanguage();
  return lang === 'en' ? '' : '..';
}

// Get current page filename
function getCurrentPage() {
  const path = window.location.pathname;
  const filename = path.split('/').pop() || 'index.html';
  return filename || 'index.html';
}

// Component loader for header and footer
document.addEventListener('DOMContentLoaded', function() {
  const currentLang = detectLanguage();
  const basePath = getBasePath();
  const componentsPath = basePath ? `${basePath}/components` : 'components';

  // Load header component
  const headerElements = document.querySelectorAll('[data-component="header"]');
  headerElements.forEach(element => {
    fetch(`${componentsPath}/header.html`)
      .then(response => response.text())
      .then(html => {
        // Fix asset paths in HTML before inserting
        if (basePath) {
          html = html.replace(/src="images\//g, `src="${basePath}/images/`);
        }
        // Translate header content before inserting
        html = translateHeaderHtml(html, currentLang);
        element.outerHTML = html;
        // After header loads, initialize language features
        setTimeout(() => {
          initLanguageSelector(currentLang, basePath);
          updateNavigationLinks(currentLang, basePath);
        }, 0);
      })
      .catch(error => {
        console.error('Error loading header component:', error);
      });
  });

  // Load footer component
  const footerElements = document.querySelectorAll('[data-component="footer"]');
  footerElements.forEach(element => {
    fetch(`${componentsPath}/footer.html`)
      .then(response => response.text())
      .then(html => {
        // Fix asset paths in HTML before inserting
        if (basePath) {
          html = html.replace(/src="images\//g, `src="${basePath}/images/`);
        }
        // Translate footer content before inserting
        html = translateFooterHtml(html, currentLang);
        element.outerHTML = html;
      })
      .catch(error => {
        console.error('Error loading footer component:', error);
      });
  });

  // Smooth scroll with offset for fixed header
  function initSmoothScroll() {
    // Handle anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#' || href === '') return;

        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          e.preventDefault();
          const header = document.querySelector('header');
          const headerHeight = header ? header.offsetHeight : 80;
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });

    // Handle hash in URL on page load
    if (window.location.hash) {
      setTimeout(() => {
        const targetId = window.location.hash.substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          const header = document.querySelector('header');
          const headerHeight = header ? header.offsetHeight : 80;
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }, 300);
    }
  }

  // Initialize smooth scroll after components are loaded
  setTimeout(initSmoothScroll, 500);

  // Add CSS for smooth scroll offset
  if (!document.getElementById('smooth-scroll-styles')) {
    const style = document.createElement('style');
    style.id = 'smooth-scroll-styles';
    style.textContent = `
      html {
        scroll-padding-top: 100px;
      }
      #works, #pricing {
        scroll-margin-top: 100px;
      }
    `;
    document.head.appendChild(style);
  }
});

// Initialize language selector dropdown
function initLanguageSelector(currentLang, basePath) {
  const langConfig = LANGUAGES[currentLang];

  // Update current language display
  const flagEl = document.getElementById('current-lang-flag');
  const codeEl = document.getElementById('current-lang-code');
  if (flagEl) flagEl.textContent = langConfig.flag;
  if (codeEl) codeEl.textContent = langConfig.code;

  // Toggle dropdown
  const toggleBtn = document.getElementById('language-toggle');
  const dropdown = document.getElementById('language-dropdown');
  const chevron = document.getElementById('language-chevron');

  if (toggleBtn && dropdown) {
    toggleBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      dropdown.classList.toggle('hidden');
      if (chevron) {
        chevron.classList.toggle('rotate-180');
      }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function() {
      dropdown.classList.add('hidden');
      if (chevron) {
        chevron.classList.remove('rotate-180');
      }
    });

    // Handle language selection
    const langLinks = dropdown.querySelectorAll('[data-lang]');
    langLinks.forEach(link => {
      const targetLang = link.getAttribute('data-lang');
      const currentPage = getCurrentPage();

      // Build the correct URL for this language
      let targetUrl;
      if (targetLang === 'en') {
        // English is at root
        targetUrl = basePath ? `${basePath}/${currentPage}` : currentPage;
      } else {
        // Other languages in subdirectories
        targetUrl = basePath ? `${basePath}/${targetLang}/${currentPage}` : `${targetLang}/${currentPage}`;
      }

      link.href = targetUrl;

      // Highlight current language
      if (targetLang === currentLang) {
        link.classList.add('bg-gray-100', 'font-medium');
      }
    });
  }
}

// Update navigation links based on current language
function updateNavigationLinks(currentLang, basePath) {
  const navLinks = document.querySelectorAll('[data-nav-link]');

  navLinks.forEach(link => {
    const linkType = link.getAttribute('data-nav-link');
    let href = link.getAttribute('href');

    // Update image src for logo
    if (linkType === 'home') {
      const img = link.querySelector('img');
      if (img && basePath) {
        img.src = `${basePath}/images/Advisor_Logo.svg`;
      }
    }

    // Update href for navigation links
    if (linkType !== 'cta' && href && !href.startsWith('http')) {
      if (basePath) {
        // We're in a language subdirectory, keep links within it
        // but internal page links should stay in same language folder
        if (href.includes('#')) {
          // Anchor links on same page - just use the anchor
          const [page, anchor] = href.split('#');
          if (page === 'index.html' || page === '') {
            link.href = `index.html#${anchor}`;
          }
        }
        // Other page links stay as-is (they're relative to current directory)
      }
    }
  });
}

// Translate header HTML string before insertion (more reliable than DOM manipulation)
function translateHeaderHtml(html, currentLang) {
  if (currentLang === 'en') return html; // No translation needed for English

  const t = TRANSLATIONS[currentLang].nav;

  // Navigation links
  html = html.replace('>How it works</a>', `>${t.howItWorks}</a>`);
  html = html.replace('>Pricing</a>', `>${t.pricing}</a>`);
  html = html.replace('>FAQ</a>', `>${t.faq}</a>`);
  html = html.replace('>Contact Us</a>', `>${t.contact}</a>`);

  // CTA button - need to preserve the icon
  html = html.replace(/Get Your IDP\s*<img/g, `${t.getYourIdp} <img`);

  return html;
}

// Translate footer HTML string before insertion (more reliable than DOM manipulation)
function translateFooterHtml(html, currentLang) {
  if (currentLang === 'en') return html; // No translation needed for English

  const t = TRANSLATIONS[currentLang].footer;

  // Section headers
  html = html.replace('>Support</p>', `>${t.support}</p>`);
  html = html.replace('>Company</p>', `>${t.company}</p>`);
  html = html.replace('>Legal</p>', `>${t.legal}</p>`);

  // Tagline
  html = html.replace('>Your trusted partner for international driving translations.</p>', `>${t.tagline}</p>`);

  // Company links
  html = html.replace('>About Us</a>', `>${t.aboutUs}</a>`);
  html = html.replace('>Contact</a>', `>${t.contact}</a>`);
  html = html.replace('>FAQ</a>', `>${t.faq}</a>`);

  // Legal links
  html = html.replace('>Privacy Policy</a>', `>${t.privacyPolicy}</a>`);
  html = html.replace('>Cookie Policy</a>', `>${t.cookiePolicy}</a>`);
  html = html.replace('>Terms & Conditions</a>', `>${t.termsConditions}</a>`);
  html = html.replace('>Legal Disclaimer</a>', `>${t.legalDisclaimer}</a>`);
  html = html.replace('>Refund Policy</a>', `>${t.refundPolicy}</a>`);
  html = html.replace('>Shipping & Delivery</a>', `>${t.shippingDelivery}</a>`);

  // Copyright
  html = html.replace('>© 2025 International Driving Advisor. All rights reserved.</p>', `>${t.copyright}</p>`);

  // Disclaimer (use a regex to handle the long text)
  html = html.replace(/Legal Disclaimer: The document from International Driving Advisor[^<]+/g, t.disclaimer);

  return html;
}
