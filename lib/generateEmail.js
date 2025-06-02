// lib/generateEmail.js
const generateEmailContent = (articles, meme) => {
    const articleHtml = articles
      .map(
        (article) => `
          <div style="margin-bottom: 20px;">
            <h3>${article.title}</h3>
            <p>${article.abstract}</p>
            <a href="${article.url}">Read more</a>
          </div>
        `
      )
      .join('');
  
    const memeHtml = meme.url
      ? `
        <div style="margin-top: 20px;">
          <h3>Today's Meme: ${meme.title}</h3>
          <img src="${meme.url}" alt="Meme" style="max-width: 100%; height: auto;" />
        </div>
      `
      : '';
  
    return `
      <html>
        <body style="font-family: Arial, sans-serif;">
          <h1>Daily News & Meme Digest</h1>
          ${articleHtml}
          ${memeHtml}
          <p style="margin-top: 20px;">
            <a href="https://your-app-url.com/unsubscribe">Unsubscribe</a>
          </p>
        </body>
      </html>
    `;
  };
  
  export default generateEmailContent;