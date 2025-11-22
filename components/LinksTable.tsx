// components/LinksTable.tsx
'use client';

import { useState } from 'react';
import { Link } from '../types/link';

interface LinksTableProps {
  links: Link[];
  onLinkDeleted: (code: string) => void;
}

export default function LinksTable({ links, onLinkDeleted }: LinksTableProps) {
  const [deletingCode, setDeletingCode] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleDelete = async (code: string) => {
    if (!confirm('Are you sure you want to delete this link?')) {
      return;
    }

    setDeletingCode(code);
    try {
      const response = await fetch(`/api/links/${code}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        onLinkDeleted(code);
      } else {
        alert(data.error || 'Failed to delete link');
      }
    } catch (err) {
      alert('Failed to delete link');
    } finally {
      setDeletingCode(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const filteredLinks = links.filter(link =>
    link.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    link.original_url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="p-6">
      <div className="mb-4">
        <input
  type="text"
  placeholder="Search by code or URL..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-400"
/>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Short Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Target URL
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Clicks
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Clicked
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredLinks.map((link) => (
              <tr key={link.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">
                      {link.code}
                    </span>
                    <button
                      onClick={() => copyToClipboard(`${window.location.origin}/${link.code}`)}
                      className="text-gray-400 hover:text-gray-600"
                      title="Copy short URL"
                    >
                      📋
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 max-w-xs truncate" title={link.original_url}>
                    {link.original_url}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {link.clicks}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(link.last_clicked)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <a
                    href={`/code/${link.code}`}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Stats
                  </a>
                  <button
                    onClick={() => handleDelete(link.code)}
                    disabled={deletingCode === link.code}
                    className="text-red-600 hover:text-red-900 disabled:opacity-50"
                  >
                    {deletingCode === link.code ? 'Deleting...' : 'Delete'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredLinks.length === 0 && links.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          No links match your search.
        </div>
      )}
    </div>
  );
}