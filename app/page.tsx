'use client'

import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface RepoInfo {
  name: string
  description: string
  stars: number
  language: string
  forks: number
  issues: number
}

export default function Home() {
  const [repoUrl, setRepoUrl] = useState('')
  const [repoInfo, setRepoInfo] = useState<RepoInfo | null>(null)
  const [readme, setReadme] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mode, setMode] = useState<'preview' | 'raw'>('preview')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setRepoInfo(null)
    setReadme(null)

    try {
      // Fetch repository information
      const repoResponse = await fetch('/api/gitfetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoUrl }),
      })

      if (!repoResponse.ok) {
        throw new Error('Failed to fetch repository information')
      }

      const repoData = await repoResponse.json()
      setRepoInfo(repoData)

      // Generate README
      const readmeResponse = await fetch('/api/readme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(repoData),
      })

      if (!readmeResponse.ok) {
        throw new Error('Failed to generate README')
      }

      const readmeData = await readmeResponse.json()
      setReadme(readmeData.readme)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center p-4 font-sans">
      <main className="w-full max-w-6xl bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">GitHub README Writer</h1>
          <form onSubmit={handleSubmit} className="mb-8">
            <div className="mb-4">
              <label htmlFor="repoUrl" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                GitHub Repository URL
              </label>
              <input
                type="text"
                id="repoUrl"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="https://github.com/username/repo"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
              disabled={isLoading}
            >
              {isLoading ? 'Generating...' : 'Generate README'}
            </button>
          </form>

          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-100 rounded">
              {error}
            </div>
          )}

          {repoInfo && (
            <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-md">
              <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">{repoInfo.name}</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-2">{repoInfo.description}</p>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-300">
                <div>Stars: {repoInfo.stars}</div>
                <div>Language: {repoInfo.language}</div>
                <div>Forks: {repoInfo.forks}</div>
                <div>Open Issues: {repoInfo.issues}</div>
              </div>
            </div>
          )}

          {readme && (
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Generated README</h2>
              <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
                <button
                  onClick={() => setMode('preview')}
                  className={`py-2 px-4 font-medium text-sm focus:outline-none ${
                    mode === 'preview'
                      ? 'text-green-500 border-b-2 border-green-500'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                >
                  Preview
                </button>
                <button
                  onClick={() => setMode('raw')}
                  className={`py-2 px-4 font-medium text-sm focus:outline-none ${
                    mode === 'raw'
                      ? 'text-gray-700 dark:text-gray-200 border-b-2 border-gray-700 dark:border-gray-200'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                >
                  Raw
                </button>
              </div>
              <div className="flex space-x-4">
                <div className="w-1/2">
                  <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Editor</h3>
                  <textarea
                    value={readme}
                    onChange={(e) => setReadme(e.target.value)}
                    className="w-full h-[500px] p-4 bg-gray-900 text-gray-100 font-mono text-sm border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
                <div className="w-1/2">
                  <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
                    {mode === 'preview' ? 'Preview' : 'Raw'}
                  </h3>
                  {mode === 'preview' ? (
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-md overflow-x-auto prose dark:prose-invert max-w-none h-[500px] overflow-y-auto border border-gray-200 dark:border-gray-700">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{readme}</ReactMarkdown>
                    </div>
                  ) : (
                    <pre className="bg-white dark:bg-gray-800 p-4 rounded-md overflow-x-auto whitespace-pre-wrap h-[500px] overflow-y-auto text-sm text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700">
                      {readme}
                    </pre>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}