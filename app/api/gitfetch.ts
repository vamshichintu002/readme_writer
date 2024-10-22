import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { repoUrl } = req.body;

  if (!repoUrl) {
    return res.status(400).json({ message: 'Repository URL is required' });
  }

  try {
    const [owner, repo] = repoUrl.split('/').slice(-2);
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;

    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error('Failed to fetch repository information');
    }

    const data = await response.json();

    const repoInfo = {
      name: data.name,
      description: data.description,
      stars: data.stargazers_count,
      language: data.language,
      forks: data.forks_count,
      issues: data.open_issues_count,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };

    res.status(200).json(repoInfo);
  } catch (error) {
    console.error('Error fetching repository information:', error);
    res.status(500).json({ message: 'Error fetching repository information' });
  }
}
