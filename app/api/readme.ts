import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { name, description, stars, language } = req.body;

  if (!name || !description || !stars || !language) {
    return res.status(400).json({ message: 'Missing required repository information' });
  }

  try {
    const response = await fetch('https://api.groq.io/v1/generate/readme', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({ name, description, stars, language }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate README');
    }

    const data = await response.json();
    res.status(200).json({ readme: data.readme });
  } catch (error) {
    console.error('Error generating README:', error);
    res.status(500).json({ message: 'Error generating README' });
  }
}
