'use client'

import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Github, Copy, Download, Eye, Code, BookOpen, Linkedin, Instagram } from 'lucide-react'
import { motion } from 'framer-motion'

// Remove this line
// import { TypeAnimation } from 'react-type-animation'

// Add this custom hook for typing animation
function useTypingEffect(texts: string[], typingSpeed: number = 150, deletingSpeed: number = 100, pauseDuration: number = 1000) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (isComplete) return;

    let timeout: NodeJS.Timeout;

    if (isTyping) {
      if (currentText.length < texts[currentTextIndex].length) {
        timeout = setTimeout(() => {
          setCurrentText(texts[currentTextIndex].slice(0, currentText.length + 1));
        }, typingSpeed);
      } else {
        if (currentTextIndex === texts.length - 1) {
          setIsComplete(true);
        } else {
          timeout = setTimeout(() => setIsTyping(false), pauseDuration);
        }
      }
    } else {
      if (currentText.length > 0) {
        timeout = setTimeout(() => {
          setCurrentText(currentText.slice(0, -1));
        }, deletingSpeed);
      } else {
        setCurrentTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
        setIsTyping(true);
      }
    }

    return () => clearTimeout(timeout);
  }, [currentText, currentTextIndex, isTyping, texts, typingSpeed, deletingSpeed, pauseDuration, isComplete]);

  return currentText;
}

interface RepoInfo {
  name: string
  description: string
  stars: number
  language: string
  forks: number
  issues: number
}

// Define the animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 }
};

export default function Home() {
  const [repoUrl, setRepoUrl] = useState('')
  const [repoInfo, setRepoInfo] = useState<RepoInfo | null>(null)
  const [readme, setReadme] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mode, setMode] = useState<'preview' | 'raw'>('preview')
  const [copySuccess, setCopySuccess] = useState(false)

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

  const handleCopy = () => {
    if (readme) {
      navigator.clipboard.writeText(readme)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    }
  }

  const handleDownload = () => {
    if (readme) {
      const blob = new Blob([readme], { type: 'text/markdown' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'README.md'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  const typedText = useTypingEffect([
    'README Generator',
    'Documentation Helper',
    'Craft Clarity For Your Code!',
  ], 100, 50, 2000);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-100 to-rose-100 dark:from-teal-900 dark:to-rose-900 flex flex-col items-center justify-start font-sans">
      <header className="w-full bg-white dark:bg-gray-800 shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-8 h-8 text-teal-500" />
            <span className="text-2xl font-bold text-gray-800 dark:text-white">ReadMe Genie</span>
          </div>
          <div className="flex items-center space-x-2 md:space-x-4">
            <a href="https://github.com/vamshichintu002/vamshichintu002" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-300 hover:text-teal-500 dark:hover:text-teal-400">
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </a>
            <a href="https://www.linkedin.com/in/sudulavamshi/" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-300 hover:text-teal-500 dark:hover:text-teal-400">
              <Linkedin className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </a>
            <a href="https://www.instagram.com/vamshichintu02/" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-300 hover:text-teal-500 dark:hover:text-teal-400">
              <Instagram className="h-5 w-5" />
              <span className="sr-only">Instagram</span>
            </a>
          </div>
        </div>
      </header>

     
      <main className="w-full max-w-6xl mx-auto mt-8 p-8">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <motion.h1
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-6xl font-bold mb-8"
            >
              ReadMe Genie: <br/>
              <span className="text-blue-600">
                {typedText}
              </span>
            </motion.h1>
            
            <motion.p
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-600 dark:text-gray-300 mb-6"
            >
              The easiest way to create a README using AI is through our user-friendly AI-powered editor. <br/>This tool lets you quickly add and customize all the necessary sections for your project's README, making the process easy and efficient.
            </motion.p>
            
            <motion.button
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              transition={{ duration: 0.6, delay: 0.4 }}
              onClick={() => document.getElementById('repo-url-input')?.focus()}
              className="bg-teal-500 text-white py-3 px-6 rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition duration-150 ease-in-out"
            >
              Get Started
            </motion.button>
          </div>
          <div className="md:w-1/2 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="w-64 h-64 bg-teal-200 dark:bg-teal-700 rounded-full absolute top-0 right-0 z-0"
            />
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="relative z-10"
            >
              <BookOpen className="w-48 h-48 text-teal-500 mx-auto" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="w-32 h-32 bg-rose-200 dark:bg-rose-700 rounded-full absolute bottom-0 left-0 z-0"
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Generate Your README</h2>
            <form onSubmit={handleSubmit} className="mb-8">
              <div className="mb-4">
                <label htmlFor="repoUrl" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  GitHub Repository URL
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="repo-url-input"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-white"
                    placeholder="https://github.com/username/repo"
                    required
                  />
                  <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-teal-500 text-white py-2 px-4 rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition duration-150 ease-in-out"
                disabled={isLoading}
              >
                {isLoading ? 'Generating...' : 'Generate README'}
              </button>
            </form>

            {error && (
              <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-100 rounded-lg">
                {error}
              </div>
            )}

            {repoInfo && (
              <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow">
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
                <div className="flex flex-wrap gap-2 mb-4">
                  <button
                    onClick={handleCopy}
                    className="flex items-center bg-teal-500 text-white py-2 px-4 rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition duration-150 ease-in-out"
                  >
                    <Copy size={16} className="mr-2" />
                    {copySuccess ? 'Copied!' : 'Copy README'}
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex items-center bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
                  >
                    <Download size={16} className="mr-2" />
                    Download README
                  </button>
                </div>
                <div className="flex flex-col md:flex-row md:space-x-4">
                  <div className="w-full md:w-1/2 mb-4 md:mb-0">
                    <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Editor</h3>
                    <textarea
                      value={readme}
                      onChange={(e) => setReadme(e.target.value)}
                      className="w-full h-[300px] md:h-[500px] p-4 bg-gray-900 text-gray-100 font-mono text-sm border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                    />
                  </div>
                  <div className="w-full md:w-1/2">
                    <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
                      <button
                        onClick={() => setMode('preview')}
                        className={`flex items-center py-2 px-4 font-medium text-sm focus:outline-none ${
                          mode === 'preview'
                            ? 'text-teal-500 border-b-2 border-teal-500'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                        }`}
                      >
                        <Eye size={16} className="mr-2" />
                        Preview
                      </button>
                      <button
                        onClick={() => setMode('raw')}
                        className={`flex items-center py-2 px-4 font-medium text-sm focus:outline-none ${
                          mode === 'raw'
                            ? 'text-gray-700 dark:text-gray-200 border-b-2 border-gray-700 dark:border-gray-200'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                        }`}
                      >
                        <Code size={16} className="mr-2" />
                        Raw
                      </button>
                    </div>
                    {mode === 'preview' ? (
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg overflow-x-auto prose dark:prose-invert max-w-none h-[300px] md:h-[500px] overflow-y-auto border border-gray-200 dark:border-gray-700">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{readme}</ReactMarkdown>
                      </div>
                    ) : (
                      <pre className="bg-white dark:bg-gray-800 p-4 rounded-lg overflow-x-auto whitespace-pre-wrap h-[300px] md:h-[500px] overflow-y-auto text-sm text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700">
                        {readme}
                      </pre>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
