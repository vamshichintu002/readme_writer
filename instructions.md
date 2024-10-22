# Product Requirement Document (PRD): README Writer App

## Overview
The README Writer App enables users to generate a structured `README.md` file for their GitHub projects by simply providing the GitHub repository URL. The app fetches the repository information using the GitHub API, passes this information to the Groq API for README generation, and displays the resulting README file to the user.

## Core Functionalities
1. **GitHub Repository Input**:
   - Users will input their GitHub repository URL into a designated field on the frontend.
   
2. **Fetch Repository Information**:
   - The backend will take the provided URL and use the GitHub API to fetch relevant repository details (e.g., description, languages, stars).
   
3. **Generate README via Groq API**:
   - The fetched repository details will be passed to the Groq API, which will generate a `README.md` file.
   
4. **Display Generated README**:
   - The generated README file will be displayed to the user, who can then download or copy the content.

## Technology Stack
- **Frontend**: NextJS 14, Shadcn, Tailwind CSS, Lucid Icon
- **Backend**: NextJS (API routes), GitHub API, Groq API
- **Hosting**: Vercel

## File Structure
```
readme-writer/
│
├── .next/               # Next.js build folder (auto-generated)
├── app/                 # Main application files
│   ├── layout.tsx       # Layout for the application
│   ├── page.tsx         # Main page for input and result display
│   ├── readme.tsx       # Component to display the generated README
│   └── api/
│       ├── gitfetch.ts  # API route for fetching GitHub repo info
│       └── readme.ts    # API route to process data and call Groq API
├── node_modules/        # Dependencies folder (auto-generated)
├── public/             # Public assets
│
├── .eslintrc.json      # ESLint configuration
├── .gitignore          # Ignore unnecessary files
├── next-env.d.ts       # TypeScript environment file
├── next.config.ts      # Next.js configuration
├── package-lock.json   # Package-lock for NPM
├── package.json        # Project dependencies and scripts
├── postcss.config.mjs  # Tailwind CSS config
├── tailwind.config.ts  # Tailwind configuration
├── tsconfig.json       # TypeScript configuration
└── README.md           # Main project README
```

## Flow of Operations
1. **User Input**: The user provides the GitHub repository URL.
2. **API Call to GitHub**: The backend calls the GitHub API to retrieve repo details.
3. **API Call to Groq**: Repo details are passed to Groq API to generate a README file.
4. **Display README**: The generated README is displayed on the frontend.

## GitHub API Documentation

### Endpoint Details
- **URL**: `https://api.github.com/repos/{owner}/{repo}`
- **Method**: `GET`

### Example Request
```
GET https://api.github.com/repos/facebook/react
```

### Example Response
```json
{
  "id": 10270250,
  "name": "react",
  "full_name": "facebook/react",
  "owner": {
    "login": "facebook",
    "id": 69631,
    ...
  },
  "description": "A declarative, efficient, and flexible JavaScript library for building user interfaces.",
  "forks": 43000,
  "stargazers_count": 198000,
  "language": "JavaScript",
  "created_at": "2013-05-24T16:15:54Z",
  "updated_at": "2024-10-22T10:10:10Z"
}
```

### Key Data Extracted
- `description`: A brief about the project.
- `stargazers_count`: Number of stars.
- `language`: Primary programming language.
- Other data (e.g., forks, watchers, issues) can also be retrieved based on requirements.

## Groq API Documentation

### Endpoint Details
- **URL**: `https://api.groq.io/v1/generate/readme`
- **Method**: `POST`

### Example Request
```json
{
  "name": "react",
  "description": "A JavaScript library for building user interfaces",
  "stars": 198000,
  "language": "JavaScript"
}
```

### Example Response
```json
{
  "readme": "# React\n\n## Overview\n\nReact is a JavaScript library for building user interfaces...\n"
}
```

### Key Data Sent
- `name`: The name of the repository.
- `description`: Short description of the repository.
- `stars`: Star count of the repository.
- `language`: Primary language used in the repository.

## Functional Requirements

### 1. Input Validation
- Ensure the input URL is a valid GitHub repository.
- Provide user feedback for invalid URLs.

### 2. API Integration
- Connect with the GitHub API to fetch repository details.
- Integrate with the Groq API to generate the README using fetched data.

### 3. UI Components
- Input field for the repository URL.
- Display area for the generated README.
- Buttons for downloading or copying the generated README content.

### 4. Error Handling
- Handle cases where the GitHub repository is not found or invalid.
- Manage any potential failures from the Groq API.

## Non-functional Requirements

### 1. Performance
- Minimize API call latency to ensure smooth user experience.

### 2. Scalability
- Design the API integration to handle a high number of requests.

### 3. Security
- Ensure that API tokens or credentials are securely stored and not exposed on the frontend.

### 4. User Experience
- Provide feedback during loading (e.g., spinners) and clear messages for errors.

## Development Timeline
1. **Week 1**: Setup the Next.js app structure and configure Tailwind CSS and Shadcn UI.
2. **Week 2**: Implement GitHub API integration.
3. **Week 3**: Implement Groq API integration and display the README output.
4. **Week 4**: Finalize UI/UX, error handling, and optimizations.

---

This PRD provides a detailed roadmap for the development team to align on core functionalities, tech stack, API integration, file structure, and timeline. All documentation with example requests and responses is provided for clear reference during implementation.