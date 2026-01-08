// Language configuration
const LANGUAGES = {
  en: { code: 'EN', flag: '🇬🇧', name: 'English', path: '' },
  es: { code: 'ES', flag: '🇪🇸', name: 'Español', path: '/es' },
  fr: { code: 'FR', flag: '🇫🇷', name: 'Français', path: '/fr' },
  it: { code: 'IT', flag: '🇮🇹', name: 'Italiano', path: '/it' }
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
        element.outerHTML = html;
        // Update footer links for current language
        setTimeout(() => {
          updateFooterLinks(currentLang, basePath);
        }, 0);
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

// Update footer links for current language
function updateFooterLinks(currentLang, basePath) {
  const footer = document.querySelector('footer');
  if (!footer) return;

  // Update logo image path only (needs basePath for subdirectories)
  if (basePath) {
    const logo = footer.querySelector('img[src*="Advisor_Logo"]');
    if (logo) {
      logo.src = `${basePath}/images/Advisor_Logo.svg`;
    }
  }

  // Note: Footer page links (privacy.html, terms.html, etc.) should NOT be modified
  // They are relative links that work correctly within each language directory
}
