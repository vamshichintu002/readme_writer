import { Analytics } from "@vercel/analytics/react"
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "GitHub README Generator",
  "url": "https://www.githubreadme.site/",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://www.githubreadme.site/?s={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

export const metadata = {
  title: 'Github README Generator',
  description: 'Generate README files for your GitHub repositories',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Basic Meta Tags */}
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="GitHub README Generator - Craft clear and professional READMEs for your projects using AI. Enhance your code documentation effortlessly." />
        <meta name="keywords" content="GitHub, README, generator, AI, documentation, code, project, GitHub readme generator, GitHub README template, Github readme example, GitHub readme profile, Github readme file, GitHub README editor, GitHub readme Generator AI, Github-readme-stats" />
        <meta name="author" content="Vamshi Sudula" />

        {/* Open Graph Tags */}
        <meta property="og:title" content="GitHub README - Crafting Clarity for Your Code" />
        <meta property="og:description" content="Generate professional READMEs for your GitHub projects using AI. Improve your code documentation easily." />
        <meta property="og:image" content="https://www.githubreadme.site/" />
        <meta property="og:url" content="https://www.githubreadme.site/" />
        <meta property="og:type" content="website" />

        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="GitHub README - AI-Powered README Generator" />
        <meta name="twitter:description" content="Create clear and professional READMEs for your GitHub projects with our AI-powered tool." />
        <meta name="twitter:image" content="https://www.githubreadme.site/" />

        <title>GitHub README - Crafting Clarity for Your Code</title>

        {/* Structured Data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      </head>
      <body className={`${inter.className} flex flex-col min-h-screen bg-gradient-to-br from-teal-100 to-rose-100 dark:from-teal-900 dark:to-rose-900`}>
        <main className="flex-grow">
          {children}
        </main>
        <footer className="w-full py-4 bg-gradient-to-r from-teal-500 to-rose-500 dark:from-teal-700 dark:to-rose-700">
          <div className="container mx-auto px-4">
            <p className="text-center text-white text-sm font-medium">
              Made with <span className="text-red-300 dark:text-red-400">❤️</span> by <a href="https://www.linkedin.com/in/sudulavamshi/" className="font-bold" target="_blank" rel="noopener noreferrer">Vamshi Sudula</a>
            </p>
          </div>
        </footer>
        <Analytics />
        
        {/* Buy Me a Coffee Widget iframe */}
        <iframe 
          src="/bmc-widget.html" 
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            border: 'none',
            height: '300px',  // Increased height
            width: '300px',   // Increased width
            zIndex: 9999,
            overflow: 'hidden'  // Hide any overflow
          }}
        />
      </body>
    </html>
  )
}
