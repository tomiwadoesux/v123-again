// pages/api/meme.js
import getRandomMeme from '../../lib/reddit';

export default async function handler(req, res) {
  const meme = await getRandomMeme();
  res.status(200).json(meme);
}