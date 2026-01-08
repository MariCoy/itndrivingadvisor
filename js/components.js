// Component loader for header and footer
document.addEventListener('DOMContentLoaded', function() {
  // Load header component
  const headerElements = document.querySelectorAll('[data-component="header"]');
  headerElements.forEach(element => {
    fetch('components/header.html')
      .then(response => response.text())
      .then(html => {
        element.outerHTML = html;
      })
      .catch(error => {
        console.error('Error loading header component:', error);
      });
  });

  // Load footer component
  const footerElements = document.querySelectorAll('[data-component="footer"]');
  footerElements.forEach(element => {
    fetch('components/footer.html')
      .then(response => response.text())
      .then(html => {
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