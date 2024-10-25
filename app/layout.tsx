import { Analytics } from "@vercel/analytics/react"
import { Inter } from 'next/font/google'
import './globals.css'
import BuyMeCoffeeWidget from './components/BuyMeCoffeeWidget'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "GitHub README Generator",
  "url": "https://www.githubreadme.site/",
  "description": "Generate professional READMEs for your GitHub projects using AI. Improve your code documentation easily.",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://www.githubreadme.site/?s={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

export const metadata = {
  title: 'GitHub README Generator - Craft Clear and Professional READMEs',
  description: 'Generate README files for your GitHub repositories using AI. Enhance your code documentation effortlessly.',
  keywords: 'GitHub, README, generator, AI, documentation, code, project, GitHub readme generator, GitHub README template, Github readme example, GitHub readme profile, Github readme file, GitHub README editor, GitHub readme Generator AI',

  openGraph: {
    title: 'GitHub README - Crafting Clarity for Your Code',
    description: 'Generate professional READMEs for your GitHub projects using AI. Improve your code documentation easily.',
    url: 'https://www.githubreadme.site/',
    siteName: 'GitHub README Generator',
    images: [
      {
        url: 'https://www.githubreadme.site/og-image.jpg', // Make sure to create and add this image
        width: 1200,
        height: 630,
        alt: 'GitHub README Generator',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GitHub README - AI-Powered README Generator',
    description: 'Create clear and professional READMEs for your GitHub projects with our AI-powered tool.',
    images: ['https://www.githubreadme.site/twitter-image.jpg'], // Make sure to create and add this image
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-site-verification-code', // Add your Google verification code
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="author" content="Vamshi Sudula" />
        <link rel="canonical" href="https://www.githubreadme.site/" />
        <meta name="theme-color" content="#4285f4" />

        {/* Structured Data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        
        <style>{`
          @media (max-width: 768px) {
            .bmc-iframe { display: none; }
          }
          @media (min-width: 769px) {
            .bmc-react { display: none; }
          }
        `}</style>

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-Z0290L5LD3"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-Z0290L5LD3');
          `}
        </Script>
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
        <div className="bmc-react">
          <BuyMeCoffeeWidget />
        </div>
        <iframe 
          className="bmc-iframe"
          src="/bmc-widget.html" 
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            border: 'none',
            height: '300px',
            width: '300px',
            zIndex: 9999,
            overflow: 'hidden'
          }}
        />
      </body>
    </html>
  )
}
