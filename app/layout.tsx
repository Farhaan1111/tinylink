// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TinyLink - URL Shortener',
  description: 'Shorten your URLs with ease',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center">
                  <h1 className="text-xl font-bold text-gray-900">TinyLink</h1>
                  <nav className="ml-8 flex space-x-4">
  <a href="/" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
    Dashboard
  </a>
  <a href="/health" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
    Health
  </a>
</nav>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main>{children}</main>

          {/* Footer */}
          <footer className="bg-white border-t mt-auto">
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
              <p className="text-center text-sm text-gray-500">
                TinyLink - URL Shortener
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}