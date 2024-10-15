import "./globals.css";
import Header from './components/header';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: {
    default: "Curated Finds Boutique",
    template: "%s | Curated Finds Boutique"
  },
  description: "A one-stop shop for all your needs. We've got you covered",
  keywords: ["e-commerce", "boutique", "online shopping", "curated finds"],
  authors: [{ name: "Otlotleng Majuja" }],
  creator: "Curated Finds Boutique",
  publisher: "Curated Finds Boutique",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

/**
 * RootLayout component that provides the layout structure for the entire application.
 * It includes the <html> and <body> tags, loads external fonts, and renders the page's header and children.
 *
 * @param {Object} props - The properties passed to the RootLayout component.
 * @param {React.ReactNode} props.children - The child components or pages that will be rendered inside the layout.
 * @returns {JSX.Element} A JSX element that sets up the main layout for the app, including fonts, header, and body.
 */
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Preconnects to Google Fonts to improve font loading performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="manifest" href="/manifest.json" />
        {/* Loads custom fonts from Google Fonts */}
        <link href="https://fonts.googleapis.com/css2?family=Anek+Devanagari:wght@100..800&family=Handjet:wght@100..900&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Curated Finds Boutique",
              "url": "https://www.yourwebsite.com",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://www.yourwebsite.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </head>
      <body className={inter.className}>
        {/* Renders the header component for navigation */}
        <Header />
        {/* Renders the child components or pages passed into the layout */}
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
