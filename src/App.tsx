import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Platform, UploadedPost, PostType } from './types';
import { PlatformCard } from './components/PlatformCard';
import { UploadModal } from './components/UploadModal';
import { HistoryPanel } from './components/HistoryPanel';
import { Toast } from './components/Toast';

function App() {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
  const [posts, setPosts] = useState<UploadedPost[]>([]);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const handleOpenModal = (platform: Platform) => {
    setSelectedPlatform(platform);
  };

  const handleCloseModal = () => {
    setSelectedPlatform(null);
  };

  const handleSuccess = (message: string) => {
    setToast({ message, type: 'success' });

    const newPost: UploadedPost = {
      id: Date.now().toString(),
      platform: selectedPlatform!,
      type: 'image' as PostType,
      caption: 'Successfully posted',
      createdAt: new Date(),
      status: 'success',
    };
    setPosts([newPost, ...posts]);
  };

  const handleError = (message: string) => {
    setToast({ message, type: 'error' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-4 shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Social Media Uploader
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Effortlessly publish your content to Instagram and Facebook with our streamlined POC interface
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <PlatformCard
            platform="instagram"
            onClick={() => handleOpenModal('instagram')}
          />
          <PlatformCard
            platform="facebook"
            onClick={() => handleOpenModal('facebook')}
          />
        </div>

        <HistoryPanel posts={posts} />

        {selectedPlatform && (
          <UploadModal
            platform={selectedPlatform}
            onClose={handleCloseModal}
            onSuccess={handleSuccess}
            onError={handleError}
          />
        )}

        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>

      <footer className="text-center py-8 mt-12">
        <p className="text-sm text-gray-500">
          POC for Instagram & Facebook API Integration
        </p>
      </footer>
    </div>
  );
}

export default App;
