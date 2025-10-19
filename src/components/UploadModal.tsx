import { useState } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';
import { Platform, PostType } from '../types';
import { uploadPost } from '../services/api';

interface UploadModalProps {
  platform: Platform;
  onClose: () => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export const UploadModal = ({
  platform,
  onClose,
  onSuccess,
  onError,
}: UploadModalProps) => {
  const [caption, setCaption] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [mediaUrls, setMediaUrls] = useState('');
  const [postType, setPostType] = useState<PostType>('image');
  const [isLoading, setIsLoading] = useState(false);

  const postTypeOptions: PostType[] =
    platform === 'instagram'
      ? ['image', 'carousel', 'reel', 'story']
      : ['text', 'image', 'video'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const urls = mediaUrls
        .split('\n')
        .map((url) => url.trim())
        .filter(Boolean);

      const result = await uploadPost(platform, {
        caption,
        hashtags,
        mediaUrls: urls,
        postType,
      });

      if (result.id || result.post_id) {
        onSuccess(
          `Successfully posted to ${
            platform.charAt(0).toUpperCase() + platform.slice(1)
          }!`
        );
        onClose();
      } else {
        throw new Error(result.error?.message || 'Upload failed');
      }
    } catch (error: any) {
      onError(error.message || 'Failed to upload post');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-xl font-semibold text-gray-800">
            Upload to {platform.charAt(0).toUpperCase() + platform.slice(1)}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Post Type
            </label>
            <select
              value={postType}
              onChange={(e) => setPostType(e.target.value as PostType)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              {postTypeOptions.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {postType !== 'text' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Media URL(s)
                {postType === 'carousel' && ' (one per line)'}
              </label>
              <textarea
                value={mediaUrls}
                onChange={(e) => setMediaUrls(e.target.value)}
                placeholder={
                  postType === 'carousel'
                    ? 'https://example.com/image1.jpg\nhttps://example.com/image2.jpg'
                    : 'https://example.com/image.jpg'
                }
                rows={postType === 'carousel' ? 4 : 2}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              />
              <p className="mt-1 text-xs text-gray-500">
                Must be publicly accessible HTTPS URLs
              </p>
            </div>
          )}

          {postType !== 'story' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Caption
                </label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Write your caption here..."
                  rows={4}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hashtags (optional)
                </label>
                <input
                  type="text"
                  value={hashtags}
                  onChange={(e) => setHashtags(e.target.value)}
                  placeholder="#socialmedia #api #test"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Post to {platform.charAt(0).toUpperCase() + platform.slice(1)}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
