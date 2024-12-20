import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Received request:', req.method, JSON.stringify(req.body));

  if (req.method !== 'POST') {
    console.log('Method not allowed:', req.method);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { repoUrl } = req.body;

  if (!repoUrl) {
    console.log('Missing repoUrl in request body');
    return res.status(400).json({ message: 'Repository URL is required' });
  }

  console.log('Received repoUrl:', repoUrl);

  const repoUrlPattern = /https:\/\/github\.com\/([^\/]+)\/([^\/]+)/;
  const match = repoUrl.match(repoUrlPattern);
  
  if (!match) {
    console.log('Invalid repository URL format:', repoUrl);
    return res.status(400).json({ message: 'Invalid repository URL format' });
  }

  const [_, owner, repo] = match;
  console.log('Extracted owner and repo:', owner, repo);

  try {
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;
    console.log('GitHub API URL:', apiUrl);

    console.log('GitHub API Token:', process.env.GITHUB_API_TOKEN ? 'Present' : 'Missing');

    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `token ${process.env.GITHUB_API_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'readme-writer-app'
      }
    });

    console.log('GitHub API response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('GitHub API Error:', response.status, JSON.stringify(errorData));
      throw new Error(`GitHub API Error: ${response.status} ${errorData.message}`);
    }

    const data = await response.json();
    console.log('GitHub API response data:', JSON.stringify(data));

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

    console.log('Processed repoInfo:', JSON.stringify(repoInfo));
    res.status(200).json(repoInfo);
  } catch (error) {
    console.error('Error in gitfetch handler:', error);
    res.status(500).json({ message: error instanceof Error ? error.message : 'Error fetching repository information' });
  }
}
