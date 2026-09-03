(() => {
  const config = window.CONSCIOUSNESS_CARTOGRAPHY_ANALYTICS || {};
  const provider = String(config.provider || 'disabled').toLowerCase();
  if (!provider || provider === 'disabled' || provider === 'none') return;

  const appendScript = (attributes) => {
    const script = document.createElement('script');
    for (const [name, value] of Object.entries(attributes)) {
      if (value === undefined || value === null || value === '') continue;
      if (name === 'dataset') {
        for (const [dataName, dataValue] of Object.entries(value)) {
          script.dataset[dataName] = dataValue;
        }
        continue;
      }
      script.setAttribute(name, value);
    }
    document.head.appendChild(script);
  };

  if (provider === 'cloudflare' && config.cloudflareToken) {
    appendScript({
      type: 'module',
      defer: 'defer',
      src: 'https://static.cloudflareinsights.com/beacon.min.js',
      dataset: {
        cfBeacon: JSON.stringify({ token: config.cloudflareToken, spa: false }),
      },
    });
    return;
  }

  if ((provider === 'google-analytics' || provider === 'ga') && config.gaMeasurementId) {
    appendScript({
      async: 'async',
      src: 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(config.gaMeasurementId),
    });
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', config.gaMeasurementId, { anonymize_ip: true });
    return;
  }

  if (provider === 'plausible' && config.plausibleDomain) {
    appendScript({
      defer: 'defer',
      src: config.plausibleScriptSrc || 'https://plausible.io/js/script.js',
      'data-domain': config.plausibleDomain,
    });
    return;
  }

  if (provider === 'goatcounter' && config.goatCounterUrl) {
    appendScript({
      async: 'async',
      src: 'https://gc.zgo.at/count.js',
      'data-goatcounter': config.goatCounterUrl,
    });
  }
})();
