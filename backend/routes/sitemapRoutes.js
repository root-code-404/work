const express = require('express');
const { generateSitemap } = require('../controllers/SitemapController');

const router = express.Router();

router.get('/sitemap.xml', generateSitemap);
router.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send(`User-agent: *
Allow: /

Sitemap: https://your-website.com/sitemap.xml`);
});

module.exports = router;
