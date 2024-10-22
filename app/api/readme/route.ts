import { NextResponse } from 'next/server';

async function generateReadme(repoInfo: any, model: string) {
  const groqApiUrl = 'https://api.groq.com/openai/v1/chat/completions';
  
  const groqResponse = await fetch(groqApiUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: model,
      messages: [
        {
          "role": "system",
          "content": "You are an expert in creating comprehensive and user-friendly README files for GitHub repositories. Your task is to generate a well-structured README that effectively communicates the project's purpose, setup, and usage to potential users and contributors."
        },
        {
          "role": "user",
          "content": `Please create a README.md file for a GitHub repository with the following information:

            Repository Name: ${repoInfo.name}
            Description: ${repoInfo.description}
            Primary Language: ${repoInfo.language}
            Stars: ${repoInfo.stars}
            Forks: ${repoInfo.forks}
            Open Issues: ${repoInfo.issues}
            Created On: ${repoInfo.created_at}
            Last Updated: ${repoInfo.updated_at}

            The README should include the following sections:

            1. Title: A clear and concise title that describes the project.
            2. Introduction: A brief explanation of what the project is about and what problem it solves.
            3. Features: A list of key features or functionalities of the project.
            4. Installation: Step-by-step instructions on how to set up and run the project.
            5. Usage: Clear instructions on how to use the project, including any command-line interfaces or API endpoints.
            6. Contributing: Guidelines for how others can contribute to the project, including coding standards and pull request processes.
            7. License: Information about the project's license and any usage restrictions.

            Please ensure that the content is clear, concise, and user-friendly. Use appropriate Markdown formatting to enhance readability, including headers, lists, code blocks, and links where necessary.`
        }
      ],
      max_tokens: 1500,
      temperature: 0.7,
    }),
  });

  if (!groqResponse.ok) {
    const errorData = await groqResponse.json();
    console.error('Groq API Error:', groqResponse.status, JSON.stringify(errorData));
    throw new Error(`Groq API Error: ${groqResponse.status} ${errorData.error?.message || 'Unknown error'}`);
  }

  const data = await groqResponse.json();
  return data.choices[0].message.content.trim();
}

export async function POST(request: Request) {
  console.log('Received request to generate README');

  try {
    const repoInfo = await request.json();
    console.log('Received repo info:', JSON.stringify(repoInfo));

    const model = "mixtral-8x7b-32768";

    const readme = await generateReadme(repoInfo, model);

    return NextResponse.json({ readme });
  } catch (error) {
    console.error('Error in readme generation:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Error generating README' },
      { status: 500 }
    );
  }
}
