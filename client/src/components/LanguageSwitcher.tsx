import { useSchedule } from '@/contexts/ScheduleContext';
import { Button } from '@/components/ui/button';
import { Globe, Languages } from 'lucide-react';

export function LanguageSwitcher() {
  const { language, setLanguage } = useSchedule();

  return (
    <div className="flex items-center gap-2">
      <Globe className="w-4 h-4 text-muted-foreground" />
      <Button
        variant={language === 'en' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setLanguage('en')}
        data-testid="button-language-en"
        className="font-outfit"
      >
        EN
      </Button>
      <Button
        variant={language === 'kh' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setLanguage('kh')}
        data-testid="button-language-kh"
        className="font-khmer"
      >
        KH
      </Button>
    </div>
  );
}
