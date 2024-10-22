import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  console.log('Received request to generate README');

  try {
    const repoInfo = await request.json();
    console.log('Received repo info:', JSON.stringify(repoInfo));

    // Groq API endpoint
    const groqApiUrl = 'https://api.groq.com/openai/v1/chat/completions';
    
    const groqResponse = await fetch(groqApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "mixtral-8x7b-32768", // Specify the Groq model
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that generates README files for GitHub repositories."
          },
          {
            role: "user",
            content: `Generate a README.md file for a GitHub repository with the following information:
              Name: ${repoInfo.name}
              Description: ${repoInfo.description}
              Stars: ${repoInfo.stars}
              Language: ${repoInfo.language}
              Forks: ${repoInfo.forks}
              Open Issues: ${repoInfo.issues}
              Created At: ${repoInfo.created_at}
              Updated At: ${repoInfo.updated_at}
              
              Please include sections for Installation, Usage, Contributing, and License.`
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!groqResponse.ok) {
      const errorData = await groqResponse.json();
      console.error('Groq API Error:', groqResponse.status, JSON.stringify(errorData));
      throw new Error(`Groq API Error: ${groqResponse.status} ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await groqResponse.json();
    console.log('Groq API response:', JSON.stringify(data));

    // Extract the generated README content from the Groq API response
    const readme = data.choices[0].message.content.trim();

    return NextResponse.json({ readme });
  } catch (error) {
    console.error('Error in readme generation:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Error generating README' },
      { status: 500 }
    );
  }
}
