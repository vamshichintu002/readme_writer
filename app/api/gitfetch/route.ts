import { NextResponse } from 'next/server';

async function fetchWithAuth(url: string) {
  const response = await fetch(url, {
    headers: {
      'Authorization': `token ${process.env.GITHUB_API_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'readme-writer-app'
    }
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('GitHub API Error:', response.status, JSON.stringify(errorData));
    throw new Error(`GitHub API Error: ${response.status} ${errorData.message}`);
  }

  return response.json();
}

export async function POST(request: Request) {
  console.log('Received request to /api/gitfetch');

  try {
    const { repoUrl } = await request.json();

    if (!repoUrl) {
      console.log('Missing repoUrl in request body');
      return NextResponse.json({ message: 'Repository URL is required' }, { status: 400 });
    }

    console.log('Received repoUrl:', repoUrl);

    const repoUrlPattern = /https:\/\/github\.com\/([^\/]+)\/([^\/]+)/;
    const match = repoUrl.match(repoUrlPattern);
    
    if (!match) {
      console.log('Invalid repository URL format:', repoUrl);
      return NextResponse.json({ message: 'Invalid repository URL format' }, { status: 400 });
    }

    const [_, owner, repo] = match;
    console.log('Extracted owner and repo:', owner, repo);

    const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;
    console.log('GitHub API URL:', apiUrl);

    console.log('GitHub API Token:', process.env.GITHUB_API_TOKEN ? 'Present' : 'Missing');

    const data = await fetchWithAuth(apiUrl);

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
    return NextResponse.json(repoInfo);
  } catch (error) {
    console.error('Error in gitfetch handler:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Error fetching repository information' },
      { status: 500 }
    );
  }
}
