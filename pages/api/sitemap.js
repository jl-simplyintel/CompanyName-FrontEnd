// pages/api/sitemap.js
export default async function handler(req, res) {
    // Fetch all dynamic paths (e.g., businesses) from your Keystone API
    const query = `
      {
        businesses {
          id
          name
        }
      }
    `;
  
    const response = await fetch('https://lightslategray-mink-295930.hostingersite.com/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });
  
    const result = await response.json();
  
    // Build the list of URLs to include in the sitemap
    const baseUrl = 'http://localhost:3000';
    const staticPages = ['/', '/about', '/contact', '/services'];
    const dynamicPaths = result.data.businesses.map((business) => `/business/${business.id}`);
    const allPaths = [...staticPages, ...dynamicPaths];
  
    // Generate the XML sitemap
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${allPaths
          .map((url) => {
            return `
              <url>
                <loc>${baseUrl}${url}</loc>
                <lastmod>${new Date().toISOString()}</lastmod>
                <changefreq>weekly</changefreq>
                <priority>0.8</priority>
              </url>
            `;
          })
          .join('')}
      </urlset>`;
  
    // Set response headers and serve the sitemap
    res.setHeader('Content-Type', 'text/xml');
    res.write(sitemap);
    res.end();
  }
  