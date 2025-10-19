import { Instagram, Facebook } from 'lucide-react';
import { Platform } from '../types';

interface PlatformCardProps {
  platform: Platform;
  onClick: () => void;
}

export const PlatformCard = ({ platform, onClick }: PlatformCardProps) => {
  const isInstagram = platform === 'instagram';

  return (
    <button
      onClick={onClick}
      className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-8 text-left overflow-hidden transform hover:scale-105"
    >
      <div
        className={`absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full opacity-10 ${
          isInstagram ? 'bg-pink-500' : 'bg-blue-500'
        }`}
      />

      <div
        className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${
          isInstagram
            ? 'bg-gradient-to-br from-pink-500 via-purple-500 to-orange-400'
            : 'bg-blue-500'
        } text-white`}
      >
        {isInstagram ? (
          <Instagram className="w-7 h-7" />
        ) : (
          <Facebook className="w-7 h-7" />
        )}
      </div>

      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        Upload to {isInstagram ? 'Instagram' : 'Facebook'}
      </h3>

      <p className="text-sm text-gray-600 mb-4">
        {isInstagram
          ? 'Post images, carousels, reels, and stories'
          : 'Share text, images, and videos'}
      </p>

      <div className="flex items-center text-sm font-medium text-blue-600 group-hover:text-blue-700">
        <span>Open uploader</span>
        <svg
          className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </button>
  );
};
