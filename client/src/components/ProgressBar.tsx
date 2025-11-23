import { useSchedule } from '@/contexts/ScheduleContext';
import { Progress } from '@/components/ui/progress';

export function ProgressBar() {
  const { getCompletionPercentage, language } = useSchedule();
  const percentage = getCompletionPercentage();

  const labels = {
    en: 'Weekly Progress',
    kh: 'វឌ្ឍនភាពប្រចាំសប្តាហ៍',
  };

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between">
        <span className={`text-sm font-medium ${language === 'kh' ? 'font-khmer' : 'font-outfit'}`}>
          {labels[language]}
        </span>
        <span className="text-sm font-bold text-primary" data-testid="text-progress-percentage">
          {percentage}%
        </span>
      </div>
      <div className="relative">
        <Progress value={percentage} className="h-3" data-testid="progress-bar" />
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: `linear-gradient(90deg, rgba(168, 85, 247, 0.3) 0%, rgba(168, 85, 247, 0) ${percentage}%)`,
            filter: 'blur(8px)',
          }}
        />
      </div>
    </div>
  );
}
