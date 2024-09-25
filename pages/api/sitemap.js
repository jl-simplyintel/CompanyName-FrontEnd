// pages/api/sitemap.js
export default async function handler(req, res) {
  // GraphQL query to fetch businesses
  const query = `
    {
      businesses {
        id
        name
      }
    }
  `;

  try {
    // Fetch data from your Keystone API
    const response = await fetch('https://companynameadmin-008a72cce60a.herokuapp.com/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    const result = await response.json();

    // Handle case where GraphQL request fails
    if (!result.data || !result.data.businesses) {
      throw new Error('Failed to fetch businesses');
    }

    // List of URLs for the sitemap
    const baseUrl = 'https://simply-intel-vjuz.vercel.app/';
    const staticPages = ['/', '/about', '/contact', '/services'];
    const dynamicPaths = result.data.businesses.map((business) => `/business/${business.id}`);
    const allPaths = [...staticPages, ...dynamicPaths];

    // Generate XML for the sitemap
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

    // Serve the sitemap
    res.setHeader('Content-Type', 'text/xml');
    res.write(sitemap);
    res.end();
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).end('Error generating sitemap');
  }
}
