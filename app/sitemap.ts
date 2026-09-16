export default function sitemap() {
  const baseUrl = 'https://your-app.vercel.app';

  const routes = [
    '',
    '/tools/extract-invoice-data',
    '/tools/summarize-legal-contract',
    '/tools/pdf-table-extractor',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));
}