document.addEventListener("DOMContentLoaded", () => {
    // Fetch Data from JSON
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            // 1. Populate Navbar
            const navLinksContainer = document.getElementById('nav-links');
            const currentPage = window.location.pathname.split('/').pop() || 'index.html';

            data.navbar.forEach(item => {
                const a = document.createElement('a');
                a.href = item.link;
                a.textContent = item.name;
                // Add active class if current page matches
                if (currentPage === item.link) {
                    a.classList.add('active');
                }
                navLinksContainer.appendChild(a);
            });

            // Load Manual Ad
    const adSlot = document.getElementById('manual-ad-slot');
    if (adSlot && data.manual_ad) {
      adSlot.innerHTML = `
        <a href="${data.manual_ad.targetUrl}" target="_blank" rel="noopener noreferrer">
            <img src="${data.manual_ad.imageUrl}" alt="Sponsored">
        </a>
      `;
    }
  })
  .catch(error => console.error('Error loading config:', error));
});
