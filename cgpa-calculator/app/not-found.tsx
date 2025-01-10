import Link from 'next/link';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="h-screen flex flex-col items-center justify-center px-4">
        <div
          className="text-center space-y-6 animate-fadeIn"
        >
          <h1 className="text-6xl font-bold text-gray-900 dark:text-gray-100">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Page Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-md">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link 
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 
                     text-white rounded-lg transition-colors duration-200 shadow-lg 
                     shadow-blue-600/20 dark:shadow-blue-900/30"
          >
            <Home className="w-5 h-5" />
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}