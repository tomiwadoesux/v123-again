// lib/reddit.js
import snoowrap from 'snoowrap';

const getRandomMeme = async () => {
  try {
    const r = new snoowrap({
      userAgent: 'news-memes-newsletter/1.0',
      clientId: process.env.REDDIT_CLIENT_ID,
      clientSecret: process.env.REDDIT_CLIENT_SECRET,
      username: process.env.REDDIT_USERNAME,
      password: process.env.REDDIT_PASSWORD,
    });

    const subreddit = await r.getSubreddit('memes'); // Or 'gifs' for GIFs
    const posts = await subreddit.getHot({ limit: 50 });
    const mediaPosts = posts.filter(
      (post) => post.url.includes('.jpg') || post.url.includes('.png') || post.url.includes('.gif')
    );
    const randomPost = mediaPosts[Math.floor(Math.random() * mediaPosts.length)];
    return {
      title: randomPost.title,
      url: randomPost.url,
    };
  } catch (error) {
    console.error('Reddit API Error:', error.message);
    return { title: 'No meme available', url: '' };
  }
};

export default getRandomMeme;