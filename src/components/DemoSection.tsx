import { Camera, Square, Smile, Frown, Angry, AlertCircle, Zap, Meh, AlertTriangle, VideoOff } from 'lucide-react';
import { useEffect, useCallback } from 'react';
import { Button } from './ui/button';
import EmotionCard from './EmotionCard';
import LoadingSpinner from './LoadingSpinner';
import { useCamera } from '@/hooks/useCamera';
import { useEmotionDetection } from '@/hooks/useEmotionDetection';

const emotions = [
  { 
    name: 'Happy', 
    key: 'happy',
    icon: Smile, 
    color: 'bg-emotion-happy/20 text-emotion-happy',
    barColor: 'bg-emotion-happy',
    description: 'Positive emotional state showing joy and contentment' 
  },
  { 
    name: 'Sad', 
    key: 'sad',
    icon: Frown, 
    color: 'bg-emotion-sad/20 text-emotion-sad',
    barColor: 'bg-emotion-sad',
    description: 'Feelings of sorrow, unhappiness, or disappointment' 
  },
  { 
    name: 'Angry', 
    key: 'angry',
    icon: Angry, 
    color: 'bg-emotion-angry/20 text-emotion-angry',
    barColor: 'bg-emotion-angry',
    description: 'Strong feeling of displeasure or hostility' 
  },
  { 
    name: 'Fear', 
    key: 'fearful',
    icon: AlertCircle, 
    color: 'bg-emotion-fear/20 text-emotion-fear',
    barColor: 'bg-emotion-fear',
    description: 'Response to perceived threat or danger' 
  },
  { 
    name: 'Surprise', 
    key: 'surprised',
    icon: Zap, 
    color: 'bg-emotion-surprise/20 text-emotion-surprise',
    barColor: 'bg-emotion-surprise',
    description: 'Brief emotional state from unexpected events' 
  },
  { 
    name: 'Neutral', 
    key: 'neutral',
    icon: Meh, 
    color: 'bg-emotion-neutral/20 text-emotion-neutral',
    barColor: 'bg-emotion-neutral',
    description: 'Baseline state without strong emotional expression' 
  },
];

const DemoSection = () => {
  const { videoRef, status: cameraStatus, error: cameraError, startCamera, stopCamera } = useCamera();
  const { 
    isModelLoading, 
    isModelLoaded, 
    modelLoadError, 
    detection, 
    startDetection, 
    stopDetection 
  } = useEmotionDetection();

  const isActive = cameraStatus === 'active';
  const isLoading = cameraStatus === 'requesting' || isModelLoading;

  const handleStart = useCallback(async () => {
    await startCamera();
  }, [startCamera]);

  const handleStop = useCallback(() => {
    stopCamera();
    stopDetection();
  }, [stopCamera, stopDetection]);

  // Start detection when camera is active
  useEffect(() => {
    if (isActive && videoRef.current) {
      startDetection(videoRef.current);
    }
  }, [isActive, videoRef, startDetection]);

  // Get emotion data for cards
  const getEmotionPercentage = (key: string): number => {
    if (!detection || !detection.faceDetected) return 0;
    return detection.emotions[key as keyof typeof detection.emotions] || 0;
  };

  const getDominantEmotionIndex = (): number => {
    if (!detection || !detection.faceDetected) return -1;
    return emotions.findIndex(e => e.key === detection.dominantEmotion);
  };

  const dominantIndex = getDominantEmotionIndex();
  const dominantEmotion = dominantIndex >= 0 ? emotions[dominantIndex] : null;

  return (
    <section id="demo" className="py-24 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
            Live <span className="text-gradient">Emotion Detection</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Experience real-time facial emotion recognition powered by our 
            advanced CNN-based deep learning model.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Camera View */}
          <div className="glass-card rounded-3xl p-6 border border-border/50">
            <div className="relative aspect-video bg-secondary/50 rounded-2xl overflow-hidden">
              {/* Video Element - Always rendered but hidden when not active */}
              <video
                ref={videoRef}
                className={`absolute inset-0 w-full h-full object-cover scale-x-[-1] ${isActive ? 'block' : 'hidden'}`}
                playsInline
                muted
              />

              {/* Idle State */}
              {cameraStatus === 'idle' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Camera className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Click "Start Camera" to begin detection</p>
                  </div>
                </div>
              )}

              {/* Loading State */}
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                  <LoadingSpinner 
                    size="lg" 
                    text={cameraStatus === 'requesting' ? 'Requesting camera access...' : 'Loading AI models...'} 
                  />
                </div>
              )}

              {/* Error State */}
              {(cameraStatus === 'error' || cameraStatus === 'denied') && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center px-4">
                    <AlertTriangle className="w-16 h-16 text-destructive mx-auto mb-4" />
                    <p className="text-destructive font-medium mb-2">Camera Access Error</p>
                    <p className="text-muted-foreground text-sm max-w-xs">{cameraError}</p>
                  </div>
                </div>
              )}

              {/* Model Load Error */}
              {modelLoadError && isActive && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                  <div className="text-center px-4">
                    <AlertTriangle className="w-16 h-16 text-destructive mx-auto mb-4" />
                    <p className="text-destructive font-medium mb-2">Model Loading Error</p>
                    <p className="text-muted-foreground text-sm max-w-xs">{modelLoadError}</p>
                  </div>
                </div>
              )}

              {/* Active State Overlays */}
              {isActive && !modelLoadError && (
                <>
                  {/* Loading models overlay */}
                  {isModelLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm">
                      <LoadingSpinner size="lg" text="Loading AI models..." />
                    </div>
                  )}

                  {/* No face detected warning */}
                  {isModelLoaded && detection && !detection.faceDetected && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-destructive/80 text-destructive-foreground rounded-full text-sm font-medium flex items-center gap-2">
                      <VideoOff className="w-4 h-4" />
                      No face detected
                    </div>
                  )}

                  {/* Face Detection Box - Only show when face is detected */}
                  {isModelLoaded && detection?.faceDetected && (
                    <>
                      <div className="absolute inset-12 border-2 border-primary rounded-lg animate-pulse-glow pointer-events-none">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                          Face Detected
                        </div>
                      </div>

                      {/* Scan Line */}
                      <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-scan-line" />
                      </div>
                    </>
                  )}

                  {/* Dominant Emotion Badge */}
                  {isModelLoaded && detection?.faceDetected && dominantEmotion && (
                    <div className="absolute bottom-4 left-4 right-4 glass-card rounded-xl p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <dominantEmotion.icon className={`w-8 h-8 ${dominantEmotion.color.split(' ')[1]}`} />
                        <div>
                          <p className="text-xs text-muted-foreground">Detected Emotion</p>
                          <p className="font-display font-bold text-lg">{dominantEmotion.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Confidence</p>
                        <p className="font-display font-bold text-lg text-primary">{detection.confidence}%</p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Controls */}
            <div className="flex gap-4 mt-6">
              {!isActive ? (
                <Button 
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 glow-box font-semibold"
                  onClick={handleStart}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Camera className="w-5 h-5 mr-2" />
                      Start Camera
                    </>
                  )}
                </Button>
              ) : (
                <Button 
                  className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90 font-semibold"
                  onClick={handleStop}
                >
                  <Square className="w-5 h-5 mr-2" />
                  Stop Detection
                </Button>
              )}
            </div>

            {/* Status indicator */}
            <div className="mt-4 flex items-center justify-center gap-2 text-sm">
              <div className={`w-2 h-2 rounded-full ${isActive && isModelLoaded ? 'bg-green-500 animate-pulse' : 'bg-muted'}`} />
              <span className="text-muted-foreground">
                {!isActive && 'Camera inactive'}
                {isActive && isModelLoading && 'Loading AI models...'}
                {isActive && isModelLoaded && detection?.faceDetected && 'Detecting emotions in real-time'}
                {isActive && isModelLoaded && !detection?.faceDetected && 'Waiting for face...'}
              </span>
            </div>
          </div>

          {/* Emotion Cards Grid */}
          <div className="grid grid-cols-2 gap-4">
            {emotions.map((emotion, index) => (
              <EmotionCard
                key={emotion.name}
                name={emotion.name}
                icon={emotion.icon}
                percentage={getEmotionPercentage(emotion.key)}
                color={emotion.color}
                description={emotion.description}
                isActive={isActive && isModelLoaded && index === dominantIndex}
                delay={index * 100}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemoSection;
