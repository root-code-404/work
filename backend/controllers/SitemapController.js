const { SitemapStream, streamToPromise } = require('sitemap');
const { Readable } = require('stream');

const generateSitemap = async (req, res) => {
  try {
    const links = [
      { url: '/', changefreq: 'daily', priority: 1.0 },
      { url: '/cars', changefreq: 'daily', priority: 0.9 },
      { url: '/car/:id', changefreq: 'weekly', priority: 0.8 },
    ];

    const stream = new SitemapStream({ hostname: 'https://your-website.com' });
    res.header('Content-Type', 'application/xml');
    const xml = await streamToPromise(Readable.from(links).pipe(stream));
    res.send(xml.toString());
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).send('Error generating sitemap');
  }
};

module.exports = { generateSitemap };
