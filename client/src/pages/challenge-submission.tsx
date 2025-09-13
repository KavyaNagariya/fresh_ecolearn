import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { useLocation } from 'wouter';
import { ArrowLeft, Camera, Upload, CheckCircle } from 'lucide-react';

interface ChallengeSubmissionPageProps {
  params: { challengeId: string };
}

export default function ChallengeSubmissionPage({ params }: ChallengeSubmissionPageProps) {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [challenge, setChallenge] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      setLocation('/signin');
      return;
    }
    loadChallenge();
  }, [user, params.challengeId]);

  const loadChallenge = async () => {
    try {
      const response = await fetch(`/api/challenges/${params.challengeId}`);
      if (response.ok) {
        const data = await response.json();
        setChallenge(data.challenge);
      }
    } catch (error) {
      console.error('Failed to load challenge:', error);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be less than 10MB');
      return;
    }

    setSelectedFile(file);
    setError('');
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !user || !challenge) return;

    setSubmitting(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('photo', selectedFile);
      formData.append('userId', user.uid);
      formData.append('caption', caption);

      const response = await fetch(`/api/challenges/${challenge.id}/submit`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => setLocation('/dashboard'), 2000);
      } else {
        setError(data.error || 'Failed to submit photo');
      }
    } catch (error) {
      setError('Failed to submit photo. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!challenge) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent mx-auto"></div>
          <p className="mt-4">Loading challenge...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
        <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm border-green-200">
          <CardContent className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-700 mb-2">Success! 🎉</h2>
            <p className="text-gray-600 mb-4">
              Your photo is under review. You'll earn <strong>{challenge.points} EcoPoints</strong> once approved!
            </p>
            <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <header className="bg-white/90 backdrop-blur-xl shadow-sm border-b border-orange-100">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <Button 
            variant="ghost" 
            onClick={() => setLocation('/dashboard')}
            className="text-orange-600 hover:bg-orange-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-xl font-bold text-orange-700 flex items-center space-x-2">
            <Camera className="w-6 h-6" />
            <span>Submit Photo Challenge</span>
          </h1>
          <div className="w-32"></div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Challenge Info */}
          <Card className="bg-white/80 backdrop-blur-sm border-orange-100 mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl text-orange-700">{challenge.title}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">{challenge.category} • Week {challenge.week}</p>
                </div>
                <div className="text-orange-600 font-bold text-lg">{challenge.points} Points</div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{challenge.description}</p>
            </CardContent>
          </Card>

          {/* Submission Form */}
          <Card className="bg-white/80 backdrop-blur-sm border-orange-100">
            <CardHeader>
              <CardTitle className="text-lg text-orange-700">Upload Your Photo</CardTitle>
              <p className="text-sm text-gray-600">Take a photo demonstrating this eco-friendly action</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Photo *</label>
                  <div className="border-2 border-dashed border-orange-200 rounded-lg p-6 text-center">
                    {preview ? (
                      <div className="space-y-4">
                        <img src={preview} alt="Preview" className="max-w-full max-h-64 mx-auto rounded-lg" />
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => {
                            setSelectedFile(null);
                            setPreview(null);
                          }}
                        >
                          Choose Different Photo
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <Camera className="w-12 h-12 text-orange-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-2">Click to select a photo</p>
                        <p className="text-xs text-gray-500">JPG, PNG up to 10MB</p>
                      </div>
                    )}
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="photo-upload"
                    />
                    {!preview && (
                      <label 
                        htmlFor="photo-upload" 
                        className="inline-block mt-4 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 cursor-pointer"
                      >
                        Select Photo
                      </label>
                    )}
                  </div>
                </div>

                {/* Caption */}
                <div>
                  <label htmlFor="caption" className="block text-sm font-medium text-gray-700 mb-2">
                    Caption (Optional)
                  </label>
                  <Textarea
                    id="caption"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Describe your eco-friendly action..."
                    maxLength={200}
                  />
                  <p className="text-xs text-gray-500 mt-1">{caption.length}/200 characters</p>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}

                {/* Submit Buttons */}
                <div className="flex space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setLocation('/dashboard')}
                    className="flex-1"
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={!selectedFile || submitting}
                    className="flex-1 bg-orange-600 hover:bg-orange-700"
                  >
                    {submitting ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Submit Photo
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}