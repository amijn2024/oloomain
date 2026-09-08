# ProTools / oloo.fyi

Static HTML/CSS/JavaScript tools website.

## Ad switches

Edit `config.json`:

- `ads.googleAds.enabled`: `true` / `false` — controls whether the Google AdSense script is loaded. If Auto Ads is enabled in AdSense, no slot ID is required.
- `ads.googleAds.slot`: optional numeric ad-unit slot ID. Leave it empty for Auto Ads; set it to render the existing fixed ad positions as real responsive AdSense units.
- `ads.sponsoredAds.enabled`: `true` / `false` — controls the sponsored banner loaded from `data.json`.
- `site.blogEnabled`: `true` / `false` — controls whether Blog appears in the generated navigation.

When an ad switch is `false`, its containers are removed by `main.js`; ad containers are hidden by default in CSS to prevent empty placeholders or layout flash.

## SEO additions

Tool pages include visible usage guidance, FAQs, canonical descriptions, and JSON-LD. The home page contains the full tool directory and combined FAQ content. `blog.html`, `robots.txt`, and the expanded `sitemap.xml` provide additional crawlable internal links.

## Important

AdSense approval and search rankings are not guaranteed by markup alone. Keep the content original and useful, maintain working navigation, follow Google Publisher Policies, and configure any required consent/CMP settings for your visitors and regions.
