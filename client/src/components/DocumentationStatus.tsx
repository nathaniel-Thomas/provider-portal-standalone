import { Star } from 'lucide-react';

interface DocumentationStatusProps {
  photoCompletion?: number;
  qualityScore?: number;
  maxScore?: number;
}

export default function DocumentationStatus({
  photoCompletion = 94,
  qualityScore = 4.8,
  maxScore = 5
}: DocumentationStatusProps) {
  return (
    <section className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Documentation Status</h2>
        <a 
          href="#" 
          className="text-sm font-medium text-primary hover-elevate cursor-pointer"
          data-testid="link-metrics"
          onClick={() => console.log('View metrics clicked')}
        >
          View metrics
        </a>
      </div>
      <div className="gradient-purple rounded-20px p-5" data-testid="card-documentation">
        <div className="flex items-center justify-between text-sm">
          <p>Photo Completion</p>
          <p className="font-semibold" data-testid="text-photo-completion">{photoCompletion}%</p>
        </div>
        <div className="w-full bg-black/20 rounded-full h-1.5 mt-2">
          <div 
            className="bg-white rounded-full h-1.5 transition-all duration-500" 
            style={{ width: `${photoCompletion}%` }}
            data-testid="progress-photo"
          ></div>
        </div>
        <div className="flex items-center justify-between text-sm mt-3">
          <p>Quality Score</p>
          <div className="flex items-center gap-1">
            <span className="font-semibold" data-testid="text-quality-score">{qualityScore}/{maxScore}</span>
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
          </div>
        </div>
      </div>
    </section>
  );
}