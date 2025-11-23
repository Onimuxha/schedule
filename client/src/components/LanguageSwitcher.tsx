import { useSchedule } from '@/contexts/ScheduleContext';
import { Button } from '@/components/ui/button';

export function LanguageSwitcher() {
  const { language, setLanguage } = useSchedule();

  return (
    <div className="flex items-center gap-2 glass-effect rounded-xl p-3">
      <Button
        size="sm"
        onClick={() => setLanguage('en')}
        className={`text-sm font-semibold transition-all ${
          language === 'en'
            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white glow-cyan'
            : 'bg-card text-foreground hover:bg-card/80'
        }`}
        data-testid="button-language-en"
      >
        English
      </Button>
      <Button
        size="sm"
        onClick={() => setLanguage('kh')}
        className={`text-sm font-semibold transition-all ${
          language === 'kh'
            ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white glow-purple'
            : 'bg-card text-foreground hover:bg-card/80'
        }`}
        data-testid="button-language-kh"
      >
        ខ្មែរ
      </Button>
    </div>
  );
}
