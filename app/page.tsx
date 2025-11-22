// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import LinkForm from '../components/LinkForm';
import LinksTable from '../components/LinksTable';
import { Link } from '../types/link';

export default function Dashboard() {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/links');
      const data = await response.json();
      
      if (data.success) {
        setLinks(data.links);
      } else {
        setError(data.error || 'Failed to fetch links');
      }
    } catch (err) {
      setError('Failed to fetch links');
    } finally {
      setLoading(false);
    }
  };

  const handleLinkCreated = () => {
    fetchLinks(); // Refresh the list
  };

  const handleLinkDeleted = (code: string) => {
    setLinks(links.filter(link => link.code !== code));
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Create and manage your short URLs</p>
      </div>

      {/* Add Link Form */}
      <div className="mb-8">
        <LinkForm onLinkCreated={handleLinkCreated} />
      </div>

      {/* Links Table */}
      <div className="bg-white shadow-sm rounded-lg border">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading links...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-red-600">Error: {error}</p>
            <button
              onClick={fetchLinks}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        ) : links.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-600">No links created yet. Create your first short URL above!</p>
          </div>
        ) : (
          <LinksTable links={links} onLinkDeleted={handleLinkDeleted} />
        )}
      </div>
    </div>
  );
}