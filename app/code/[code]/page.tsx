// app/code/[code]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Link } from '../../../types/link';

export default function StatsPage() {
  const params = useParams();
  const router = useRouter();
  const code = params.code as string;
  
  const [link, setLink] = useState<Link | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLinkStats = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/links/${code}`);
        const data = await response.json();
        
        if (data.success) {
          setLink(data.link);
        } else {
          setError(data.error || 'Link not found');
        }
      } catch (err) {
        setError('Failed to fetch link statistics');
      } finally {
        setLoading(false);
      }
    };

    if (code) {
      fetchLinkStats();
    }
  }, [code]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading statistics...</p>
        </div>
      </div>
    );
  }

  if (error || !link) {
    return (
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-6 text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const shortUrl = `${window.location.origin}/${link.code}`;

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.push('/')}
          className="mb-4 text-blue-600 hover:text-blue-800 flex items-center"
        >
          ← Back to Dashboard
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Link Statistics</h1>
        <p className="text-gray-600">Detailed analytics for your short URL</p>
      </div>

      {/* URL Card */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">URL Information</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Short URL</label>
            <div className="flex items-center space-x-2">
              <code className="flex-1 px-3 py-2 bg-gray-100 rounded-md text-gray-900 font-mono text-sm">
                {shortUrl}
              </code>
              <button
                onClick={() => copyToClipboard(shortUrl)}
                className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
              >
                Copy
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Destination URL</label>
            <div className="px-3 py-2 bg-gray-100 rounded-md">
              <a 
                href={link.original_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 break-all"
              >
                {link.original_url}
              </a>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Short Code</label>
            <div className="px-3 py-2 bg-gray-100 rounded-md">
              <code className="text-gray-900 font-mono">{link.code}</code>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Card */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{link.clicks}</div>
            <div className="text-sm text-gray-600">Total Clicks</div>
          </div>

          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900 mb-2">
              {formatDate(link.last_clicked)}
            </div>
            <div className="text-sm text-gray-600">Last Clicked</div>
          </div>

          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900 mb-2">
              {formatDate(link.created_at)}
            </div>
            <div className="text-sm text-gray-600">Created At</div>
          </div>
        </div>

        {/* Click History (placeholder for future enhancement) */}
        <div className="mt-6 pt-6 border-t">
          <h3 className="text-md font-medium text-gray-900 mb-3">Recent Activity</h3>
          {link.clicks === 0 ? (
            <p className="text-gray-500 text-center py-4">No clicks yet. Share your link to get started!</p>
          ) : (
            <p className="text-gray-500 text-center py-4">
              Click tracking history would be displayed here in a future version.
            </p>
          )}
        </div>
      </div>

      {/* Test Redirect Button */}
      <div className="mt-6 text-center">
        <a
          href={shortUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Test Redirect ↗
        </a>
      </div>
    </div>
  );
}