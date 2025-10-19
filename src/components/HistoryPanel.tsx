import { Instagram, Facebook, Image, Video, Grid, Film, MessageSquare } from 'lucide-react';
import { UploadedPost } from '../types';

interface HistoryPanelProps {
  posts: UploadedPost[];
}

export const HistoryPanel = ({ posts }: HistoryPanelProps) => {
  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image className="w-4 h-4" />;
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'carousel':
        return <Grid className="w-4 h-4" />;
      case 'reel':
        return <Film className="w-4 h-4" />;
      case 'story':
        return <MessageSquare className="w-4 h-4" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (posts.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-8 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <MessageSquare className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          No posts yet
        </h3>
        <p className="text-sm text-gray-600">
          Your upload history will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <MessageSquare className="w-5 h-5" />
        Upload History
      </h3>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {posts.map((post) => (
          <div
            key={post.id}
            className="flex items-start gap-4 p-4 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
          >
            <div className="flex-shrink-0">
              {post.thumbnailUrl ? (
                <img
                  src={post.thumbnailUrl}
                  alt="Post thumbnail"
                  className="w-16 h-16 rounded-lg object-cover"
                />
              ) : (
                <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                  {getPostTypeIcon(post.type)}
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center ${
                    post.platform === 'instagram'
                      ? 'bg-gradient-to-br from-pink-500 to-orange-400'
                      : 'bg-blue-500'
                  } text-white`}
                >
                  {post.platform === 'instagram' ? (
                    <Instagram className="w-3 h-3" />
                  ) : (
                    <Facebook className="w-3 h-3" />
                  )}
                </div>
                <span className="text-xs font-medium text-gray-600 uppercase">
                  {post.type}
                </span>
                <span
                  className={`ml-auto text-xs px-2 py-0.5 rounded-full ${
                    post.status === 'success'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-rose-100 text-rose-700'
                  }`}
                >
                  {post.status}
                </span>
              </div>

              <p className="text-sm text-gray-800 mb-1 line-clamp-2">
                {post.caption}
              </p>

              <p className="text-xs text-gray-500">{formatDate(post.createdAt)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
