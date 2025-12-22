import { Camera, RefreshCw, Smile, Frown, Angry, AlertCircle, Zap, Meh } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import EmotionCard from './EmotionCard';

const emotions = [
  { 
    name: 'Happy', 
    icon: Smile, 
    color: 'bg-emotion-happy/20 text-emotion-happy',
    barColor: 'bg-emotion-happy',
    description: 'Positive emotional state showing joy and contentment' 
  },
  { 
    name: 'Sad', 
    icon: Frown, 
    color: 'bg-emotion-sad/20 text-emotion-sad',
    barColor: 'bg-emotion-sad',
    description: 'Feelings of sorrow, unhappiness, or disappointment' 
  },
  { 
    name: 'Angry', 
    icon: Angry, 
    color: 'bg-emotion-angry/20 text-emotion-angry',
    barColor: 'bg-emotion-angry',
    description: 'Strong feeling of displeasure or hostility' 
  },
  { 
    name: 'Fear', 
    icon: AlertCircle, 
    color: 'bg-emotion-fear/20 text-emotion-fear',
    barColor: 'bg-emotion-fear',
    description: 'Response to perceived threat or danger' 
  },
  { 
    name: 'Surprise', 
    icon: Zap, 
    color: 'bg-emotion-surprise/20 text-emotion-surprise',
    barColor: 'bg-emotion-surprise',
    description: 'Brief emotional state from unexpected events' 
  },
  { 
    name: 'Neutral', 
    icon: Meh, 
    color: 'bg-emotion-neutral/20 text-emotion-neutral',
    barColor: 'bg-emotion-neutral',
    description: 'Baseline state without strong emotional expression' 
  },
];

const DemoSection = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [emotionData, setEmotionData] = useState<number[]>([0, 0, 0, 0, 0, 0]);
  const [dominantEmotion, setDominantEmotion] = useState(0);

  const startAnalysis = () => {
    setIsAnalyzing(true);
    simulateDetection();
  };

  const simulateDetection = () => {
    // Simulate random emotion detection
    const newData = emotions.map(() => Math.floor(Math.random() * 60) + 10);
    const maxIndex = newData.indexOf(Math.max(...newData));
    newData[maxIndex] = Math.min(newData[maxIndex] + 30, 98);
    
    setEmotionData(newData);
    setDominantEmotion(maxIndex);
  };

  useEffect(() => {
    if (isAnalyzing) {
      const interval = setInterval(simulateDetection, 2000);
      return () => clearInterval(interval);
    }
  }, [isAnalyzing]);

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
              {/* Camera Feed Placeholder */}
              <div className="absolute inset-0 flex items-center justify-center">
                {!isAnalyzing ? (
                  <div className="text-center">
                    <Camera className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Camera feed will appear here</p>
                  </div>
                ) : (
                  <>
                    {/* Simulated Camera View */}
                    <div className="absolute inset-0 bg-gradient-to-br from-secondary via-muted to-secondary" />
                    
                    {/* Face Detection Box */}
                    <div className="absolute inset-12 border-2 border-primary rounded-lg animate-pulse-glow">
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                        Face Detected
                      </div>
                      
                      {/* Facial Landmark Points */}
                      <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-primary rounded-full animate-pulse" />
                      <div className="absolute top-1/4 right-1/3 w-2 h-2 bg-primary rounded-full animate-pulse" />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary rounded-full animate-pulse" />
                      <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary rounded-full" />
                    </div>

                    {/* Scan Line */}
                    <div className="absolute inset-0 overflow-hidden">
                      <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-scan-line" />
                    </div>

                    {/* Dominant Emotion Badge */}
                    <div className="absolute bottom-4 left-4 right-4 glass-card rounded-xl p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {(() => {
                          const Icon = emotions[dominantEmotion].icon;
                          return <Icon className={`w-8 h-8 ${emotions[dominantEmotion].color.split(' ')[1]}`} />;
                        })()}
                        <div>
                          <p className="text-xs text-muted-foreground">Detected Emotion</p>
                          <p className="font-display font-bold text-lg">{emotions[dominantEmotion].name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Confidence</p>
                        <p className="font-display font-bold text-lg text-primary">{emotionData[dominantEmotion]}%</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-4 mt-6">
              <Button 
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 glow-box font-semibold"
                onClick={startAnalysis}
                disabled={isAnalyzing}
              >
                <Camera className="w-5 h-5 mr-2" />
                {isAnalyzing ? 'Analyzing...' : 'Start Camera'}
              </Button>
              <Button 
                variant="outline" 
                className="border-border bg-transparent hover:bg-secondary"
                onClick={() => setIsAnalyzing(false)}
              >
                <RefreshCw className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Emotion Cards Grid */}
          <div className="grid grid-cols-2 gap-4">
            {emotions.map((emotion, index) => (
              <EmotionCard
                key={emotion.name}
                name={emotion.name}
                icon={emotion.icon}
                percentage={emotionData[index]}
                color={emotion.color}
                description={emotion.description}
                isActive={isAnalyzing && index === dominantEmotion}
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
