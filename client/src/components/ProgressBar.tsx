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
        <span className="text-sm font-bold text-cyan-500" data-testid="text-progress-percentage">
          {percentage}%
        </span>
      </div>
      <Progress value={percentage} className="h-1.5" data-testid="progress-bar" />
    </div>
  );
}
