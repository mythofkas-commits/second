/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: 'https://rollout-radar.example.com',
  generateRobotsTxt: true,
  sitemapSize: 5000,
  exclude: ['/auth/*', '/admin/*'],
};

module.exports = config;
