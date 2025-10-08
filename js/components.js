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
});