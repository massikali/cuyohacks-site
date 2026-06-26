const fs = require('fs');
let content = fs.readFileSync('sitemap.xml', 'utf8');

// Replace domain
content = content.replace(/cuyohacks\.site/g, 'cuyohacks.com.ar');

// Add new service
const newUrl =   <url>
    <loc>https://www.cuyohacks.com.ar/servicios/pentesting-llm</loc>
    <lastmod>2026-06-25</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>;
content = content.replace('</urlset>', newUrl);

fs.writeFileSync('sitemap.xml', content);
console.log('Sitemap updated.');
