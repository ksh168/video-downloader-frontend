'use client';
import { useState } from 'react';

export default function Home() {
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleDownload = async () => {
    if (!videoUrl) {
      setMessage('Please enter a valid URL');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const sanitizedUrl = videoUrl.trim();
      if (!sanitizedUrl.startsWith('http://') && !sanitizedUrl.startsWith('https://')) {
        throw new Error('Invalid URL format - must start with http:// or https://');
      }

      const response = await fetch('/api/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: sanitizedUrl }),
      });

      if (response.ok) {
        setMessage('Video download request sent successfully!');
      } else {
        throw new Error('Failed to send request');
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Video Downloader
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Download your favorite videos by simply pasting the URL
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col space-y-4">
            <input
              type="text"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="Paste video URL here..."
              className="w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all"
              disabled={loading}
            />
            <button
              onClick={handleDownload}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                'Download Video'
              )}
            </button>
          </div>

          {message && (
            <div className={`mt-4 p-4 rounded-md ${
              message.includes('success') 
                ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
            }`}>
              {message}
            </div>
          )}
        </div>

        <div className="mt-12 text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>Supported platforms: YouTube, Vimeo, and more</p>
          <p className="mt-2">Your download will be processed in the background</p>
        </div>
      </div>
    </main>
  );
}
