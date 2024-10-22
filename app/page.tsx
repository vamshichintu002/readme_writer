'use client'

import { useState } from 'react'
import Image from "next/image"

interface RepoInfo {
  name: string
  description: string
  stars: number
  language: string
  forks: number
  issues: number
}

interface ReadmeVersions {
  mixtral: string
  llama32: string
}

export default function Home() {
  const [repoUrl, setRepoUrl] = useState('')
  const [repoInfo, setRepoInfo] = useState<RepoInfo | null>(null)
  const [readmeVersions, setReadmeVersions] = useState<ReadmeVersions | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('mixtral')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setRepoInfo(null)
    setReadmeVersions(null)

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

      // Generate READMEs
      const readmeResponse = await fetch('/api/readme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(repoData),
      })

      if (!readmeResponse.ok) {
        throw new Error('Failed to generate READMEs')
      }

      const readmeData = await readmeResponse.json()
      setReadmeVersions(readmeData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content)
    // Optionally, you can add a state to show a "Copied!" message
  }

  const handleDownload = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center p-4 sm:p-8 font-sans">
      <main className="w-full max-w-3xl bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden">
        <div className="p-6 sm:p-10">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">README Writer</h1>
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

          {readmeVersions && (
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Generated READMEs</h2>
              <p className="mb-4 text-gray-600 dark:text-gray-300">
                Each generated README includes a comprehensive structure with sections for project introduction, 
                features, installation, usage, contributing guidelines, and license information.
              </p>
              <div className="mb-4">
                <div className="flex border-b border-gray-200 dark:border-gray-700">
                  {['mixtral', 'llama32'].map((model) => (
                    <button
                      key={model}
                      className={`py-2 px-4 font-medium text-sm focus:outline-none ${
                        activeTab === model
                          ? 'border-b-2 border-blue-500 text-blue-500'
                          : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                      }`}
                      onClick={() => setActiveTab(model)}
                    >
                      {model === 'mixtral' ? 'Mixtral 8x7B' : 'LLaMA 3.2 90B'}
                    </button>
                  ))}
                </div>
              </div>
              {Object.entries(readmeVersions).map(([model, content]) => (
                <div key={model} className={`mb-6 ${activeTab === model ? '' : 'hidden'}`}>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                    {model === 'mixtral' ? 'Mixtral 8x7B' : 'LLaMA 3.2 90B'} Model
                  </h3>
                  <div className="mb-4 flex space-x-2">
                    <button
                      onClick={() => handleCopy(content)}
                      className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-150 ease-in-out"
                    >
                      Copy README
                    </button>
                    <button
                      onClick={() => handleDownload(content, `README_${model}.md`)}
                      className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
                    >
                      Download README
                    </button>
                  </div>
                  <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md overflow-x-auto whitespace-pre-wrap h-[500px] overflow-y-auto text-sm text-gray-800 dark:text-gray-200">
                    {content}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}