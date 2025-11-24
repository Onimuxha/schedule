import { useSchedule } from '@/contexts/ScheduleContext';
import { Button } from '@/components/ui/button';

export function LanguageSwitcher() {
  const { language, setLanguage } = useSchedule();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'kh' : 'en');
  };

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={toggleLanguage}
      className="bg-white/10 hover:bg-white/20 border-white/20 text-white rounded-lg px-4 py-2 h-auto text-sm font-medium backdrop-blur-sm transition-all duration-200"
      data-testid="language-switcher"
    >
      {language === 'en' ? 'Khmer' : 'English'}
    </Button>
  );
}