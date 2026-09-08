document.addEventListener("DOMContentLoaded", async () => {
  const iconSvg = (name) => {
    const icons = {
      home: '<path d="M3 11.5 12 4l9 7.5"></path><path d="M5.5 10.5V20h13v-9.5"></path><path d="M9.5 20v-6h5v6"></path>',
      image: '<rect x="3" y="4" width="18" height="16" rx="2"></rect><circle cx="8.5" cy="9" r="1.5"></circle><path d="m21 15-5-5L5 20"></path>',
      grid: '<rect x="3" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="3" width="7" height="7" rx="1"></rect><rect x="3" y="14" width="7" height="7" rx="1"></rect><rect x="14" y="14" width="7" height="7" rx="1"></rect>',
      refresh: '<path d="M20 7h-5V2"></path><path d="M20 7a8 8 0 1 0 1.5 8"></path>',
      tag: '<path d="M20 13 12 21l-9-9V4h8z"></path><circle cx="7.5" cy="8.5" r="1.5"></circle>',
      type: '<path d="M4 5V3h16v2"></path><path d="M9 21h6"></path><path d="M12 3v18"></path>',
      crop: '<path d="M6 2v16a2 2 0 0 0 2 2h14"></path><path d="M2 6h14a2 2 0 0 1 2 2v14"></path>',
      case: '<path d="M4 19 9 5l5 14"></path><path d="M6 14h6"></path><path d="M15 11h5v8h-5a4 4 0 0 1 0-8Z"></path>',
      align: '<path d="M4 6h16"></path><path d="M4 10h12"></path><path d="M4 14h16"></path><path d="M4 18h9"></path>',
      clock: '<circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 2"></path>',
      edit: '<path d="M4 20h4l11-11-4-4L4 16z"></path><path d="m13.5 6.5 4 4"></path>',
      book: '<path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H11v17H7.5A3.5 3.5 0 0 0 4 22z"></path><path d="M20 5.5A3.5 3.5 0 0 0 16.5 2H13v17h3.5A3.5 3.5 0 0 1 20 22z"></path>',
      menu: '<path d="M4 7h16"></path><path d="M4 12h16"></path><path d="M4 17h16"></path>',
      close: '<path d="m6 6 12 12"></path><path d="M18 6 6 18"></path>',
      tool: '<circle cx="12" cy="12" r="9"></circle><path d="M12 8v8"></path><path d="M8 12h8"></path>'
    };
    return `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || icons.tool}</svg>`;
  };

  const normalizePath = (value) => {
    if (!value || value === '/') return 'index';
    return value.replace(/^\//, '').replace(/\.html$/, '').replace(/\/$/, '') || 'index';
  };

  try {
    const [dataResponse, configResponse] = await Promise.all([
      fetch('data.json', { cache: 'no-cache' }),
      fetch('config.json', { cache: 'no-cache' })
    ]);
    if (!dataResponse.ok) throw new Error(`data.json: ${dataResponse.status}`);
    if (!configResponse.ok) throw new Error(`config.json: ${configResponse.status}`);

    const data = await dataResponse.json();
    const config = await configResponse.json();

    // Responsive navigation. Existing header/logo/nav remain; only progressive controls are added.
    const navLinksContainer = document.getElementById('nav-links');
    const navContainer = navLinksContainer?.closest('.nav-container');
    if (navLinksContainer && navContainer) {
      const currentPage = normalizePath(window.location.pathname);
      navLinksContainer.innerHTML = '';

      data.navbar
        .filter(item => config.site?.blogEnabled !== false || item.link !== 'blog')
        .forEach(item => {
          const a = document.createElement('a');
          a.href = item.link === '/' ? '/' : `/${item.link.replace(/^\//, '')}`;
          a.className = 'nav-link';
          a.innerHTML = `<span class="nav-icon">${iconSvg(item.icon)}</span><span>${item.name}</span>`;
          if (currentPage === normalizePath(item.link)) {
            a.classList.add('active');
            a.setAttribute('aria-current', 'page');
          }
          navLinksContainer.appendChild(a);
        });

      let toggle = navContainer.querySelector('.nav-toggle');
      if (!toggle) {
        toggle = document.createElement('button');
        toggle.type = 'button';
        toggle.className = 'nav-toggle';
        toggle.setAttribute('aria-controls', 'nav-links');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open navigation menu');
        toggle.innerHTML = iconSvg('menu');
        navContainer.insertBefore(toggle, navLinksContainer);
      }

      const closeMenu = () => {
        navLinksContainer.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open navigation menu');
        toggle.innerHTML = iconSvg('menu');
      };

      toggle.addEventListener('click', () => {
        const open = navLinksContainer.classList.toggle('open');
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
        toggle.innerHTML = iconSvg(open ? 'close' : 'menu');
      });
      navLinksContainer.addEventListener('click', (event) => {
        if (event.target.closest('a')) closeMenu();
      });
      window.addEventListener('resize', () => {
        if (window.innerWidth > 900) closeMenu();
      });
    }

    // Sponsored ad switch. Disabled means the entire container stays hidden and empty.
    const sponsoredEnabled = config.ads?.sponsoredAds?.enabled === true;
    document.querySelectorAll('.sponsored-ad').forEach(container => {
      if (!sponsoredEnabled) {
        container.remove();
        return;
      }
      const adSlot = container.querySelector('#manual-ad-slot');
      if (adSlot && data.manual_ad?.imageUrl && data.manual_ad?.targetUrl) {
        adSlot.innerHTML = '';
        const link = document.createElement('a');
        link.href = data.manual_ad.targetUrl;
        link.target = '_blank';
        link.rel = 'sponsored noopener noreferrer';
        link.setAttribute('aria-label', 'Open sponsored link');
        const img = document.createElement('img');
        img.src = data.manual_ad.imageUrl;
        img.alt = 'Sponsored content';
        img.loading = 'lazy';
        img.decoding = 'async';
        link.appendChild(img);
        adSlot.appendChild(link);
        container.hidden = false;
        container.classList.add('ad-visible');
      } else {
        container.remove();
      }
    });

    // Google AdSense switch. The network script is only requested when enabled.
    const googleConfig = config.ads?.googleAds || {};
    const googleEnabled = googleConfig.enabled === true && /^ca-pub-\d+$/.test(googleConfig.client || '');
    const fixedSlot = /^\d+$/.test(googleConfig.slot || '') ? googleConfig.slot : '';
    const googleContainers = [...document.querySelectorAll('.google-ad')];
    googleContainers.forEach(container => {
      if (!googleEnabled || !fixedSlot) {
        // With Auto Ads, Google chooses placements; no fake fixed placeholder is shown.
        container.remove();
        return;
      }
      const label = container.querySelector('.ad-label');
      container.innerHTML = '';
      if (label) container.appendChild(label);
      const ad = document.createElement('ins');
      ad.className = 'adsbygoogle';
      ad.style.display = 'block';
      ad.dataset.adClient = googleConfig.client;
      ad.dataset.adSlot = fixedSlot;
      ad.dataset.adFormat = googleConfig.format || 'auto';
      ad.dataset.fullWidthResponsive = String(googleConfig.fullWidthResponsive !== false);
      container.appendChild(ad);
      container.hidden = false;
      container.classList.add('ad-visible');
    });

    if (googleEnabled && !document.querySelector('script[data-protools-adsense]')) {
      const script = document.createElement('script');
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.dataset.protoolsAdsense = 'true';
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(googleConfig.client)}`;
      script.addEventListener('load', () => {
        if (!fixedSlot) return;
        document.querySelectorAll('.google-ad .adsbygoogle').forEach(() => {
          try { (window.adsbygoogle = window.adsbygoogle || []).push({}); }
          catch (error) { console.error('AdSense slot initialization failed:', error); }
        });
      });
      document.head.appendChild(script);
    }
  } catch (error) {
    console.error('Error loading ProTools configuration:', error);
    // Fail closed for ads if configuration cannot be loaded.
    document.querySelectorAll('.sponsored-ad, .google-ad').forEach(container => container.remove());
  }
});
