const BOT_USER_AGENTS = [
  'facebookexternalhit',
  'whatsapp',
  'twitterbot',
  'linkedinbot',
  'telegrambot',
  'discordbot',
  'slackbot',
  'pinterest',
  'skypeuripreview',
];

function isBot(userAgent = '') {
  const ua = userAgent.toLowerCase();
  return BOT_USER_AGENTS.some((bot) => ua.includes(bot));
}

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export default async function handler(req, res) {
  const { id } = req.query;
  const userAgent = req.headers['user-agent'] || '';

  const API_URL = 'https://financiadigital-backend-production.up.railway.app/api';

  try {
    let article = null;

    const rRes = await fetch(`${API_URL}/region-articles/${id}`);
    if (rRes.ok) article = await rRes.json();

    if (!article) {
      const sRes = await fetch(`${API_URL}/section-articles/${id}`);
      if (sRes.ok) article = await sRes.json();
    }

    if (!article) {
      res.status(404).send('Not found');
      return;
    }

    const title = escapeHtml(article.title || 'Financia Digital News');
    const description = escapeHtml(
      article.subtitle ||
      (article.content ? article.content.replace(/<[^>]*>/g, '').slice(0, 160) : '') ||
      'Latest news from Financia Digital News'
    );
    const image = article.imageUrl || 'https://www.financiadigitalnews.com/default-share-image.jpg';
    const url = `https://www.financiadigitalnews.com/article/${id}`;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${title}</title>
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="${image}" />
  <meta property="og:url" content="${url}" />
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="Financia Digital News" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${image}" />
  ${!isBot(userAgent) ? `<meta http-equiv="refresh" content="0;url=${url}" />` : ''}
</head>
<body>
  <p>${title}</p>
</body>
</html>`.trim();

  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(html);
  } catch (e) {
    res.status(500).send('Error generating preview: ' + e.message);
  }
}
