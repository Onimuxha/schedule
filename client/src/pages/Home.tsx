import { useSchedule } from '@/contexts/ScheduleContext';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { ProgressBar } from '@/components/ProgressBar';
import { ActivityManager } from '@/components/ActivityManager';
import { ExportButtons } from '@/components/ExportButtons';
import { WeeklySchedule } from '@/components/WeeklySchedule';
import { Button } from '@/components/ui/button';
import { Shuffle, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Home() {
  const { generateRandomSchedule, language } = useSchedule();

  const handleGenerateRandom = () => {
    generateRandomSchedule();
    const msg = language === 'en' 
      ? 'Random schedule generated!' 
      : 'បានបង្កើតកាលវិភាគដោយចៃដន្យ!';
    toast.success(msg);
  };

  const labels = {
    en: {
      title: 'Weekly Schedule Planner',
      subtitle: 'Organize your week with style and efficiency',
      generateRandom: 'Generate Random Schedule',
    },
    kh: {
      title: 'កម្មវិធីរៀបចំតារាងពេលប្រចាំសប្តាហ៍',
      subtitle: 'រៀបចំសប្តាហ៍របស់អ្នកឱ្យបានស្រស់ស្អាតនិងមានប្រសិទ្ធភាព',
      generateRandom: 'បង្កើតកាលវិភាគដោយចៃដន្យ',
    },
  };

  const t = labels[language];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-purple-600 shadow-glow">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className={`text-xl md:text-2xl font-bold ${language === 'kh' ? 'font-khmer' : 'font-outfit'}`}>
                  {t.title}
                </h1>
                <p className={`text-xs md:text-sm text-muted-foreground ${language === 'kh' ? 'font-khmer' : 'font-outfit'}`}>
                  {t.subtitle}
                </p>
              </div>
            </div>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 md:py-8 space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex-1 max-w-md">
            <ProgressBar />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <ActivityManager />
            <Button
              variant="default"
              onClick={handleGenerateRandom}
              className={`shadow-glow-sm ${language === 'kh' ? 'font-khmer' : 'font-outfit'}`}
              data-testid="button-generate-random"
            >
              <Shuffle className="w-4 h-4 mr-2" />
              {t.generateRandom}
            </Button>
            <ExportButtons />
          </div>
        </div>

        <div className="animate-in fade-in duration-500" id="schedule-container">
          <WeeklySchedule />
        </div>
      </main>

      <footer className="border-t border-border mt-12">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground font-outfit">
            © 2025 Weekly Schedule Planner. Built with modern technology.
          </p>
        </div>
      </footer>
    </div>
  );
}
