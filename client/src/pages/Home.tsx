import { useSchedule } from '@/contexts/ScheduleContext';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { ProgressBar } from '@/components/ProgressBar';
import { ActivityManager } from '@/components/ActivityManager';
import { ExportButtons } from '@/components/ExportButtons';
import { WeeklySchedule } from '@/components/WeeklySchedule';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { IconArrowsShuffle } from '@tabler/icons-react';

export default function Home() {
  const { generateRandomSchedule, language, weekSchedule } = useSchedule();
  const [showConfirm, setShowConfirm] = useState(false);

  const hasScheduledActivities = weekSchedule.days.some(day =>
    day.timeSlots.some(slot => slot.activityId !== null)
  );

  const handleGenerateRandom = () => {
    if (hasScheduledActivities) {
      setShowConfirm(true);
    } else {
      generateRandomSchedule();
      const msg = language === 'en' 
        ? 'Random schedule generated!' 
        : 'បានបង្កើតកាលវិភាគដោយចៃដន្យ!';
      toast.success(msg);
    }
  };

  const confirmGenerateRandom = () => {
    setShowConfirm(false);
    generateRandomSchedule();
    const msg = language === 'en' 
      ? 'Random schedule generated!' 
      : 'បានបង្កើតកាលវិភាគដោយចៃដន្យ!';
    toast.success(msg);
  };

  const labels = {
    en: {
      title: 'Weekly Schedule',
      subtitle: 'Organize your week with style',
      generateRandom: 'Generate Random',
      confirmTitle: 'Overwrite Schedule?',
      confirmMsg: 'Your current schedule will be replaced with a random one.',
      confirmBtn: 'Yes, Generate',
      cancelBtn: 'Cancel',
    },
    kh: {
      title: 'កាលវិភាគប្រចាំសប្តាហ៍',
      subtitle: 'រៀបចំសប្តាហ៍របស់អ្នក',
      generateRandom: 'បង្កើតដោយចៃដន្យ',
      confirmTitle: 'ឆ្លងកាត់កាលវិភាគ?',
      confirmMsg: 'កាលវិភាគបច្ចុប្បន្នរបស់អ្នកនឹងត្រូវដាក់ជំនួសដោយលេខសាលអករ័ន្ដ។',
      confirmBtn: 'បាទ, បង្កើត',
      cancelBtn: 'បោះបង់',
    },
  };

  const t = labels[language];

  return (
    <div className="min-h-screen bg-background">
      <main className="w-full px-4 py-8 space-y-6">
        {/* Language Switcher in top right */}
        <div className="flex justify-end mb-4">
          <LanguageSwitcher />
        </div>

        {/* Progress and Controls */}
        <div className="space-y-4">
          <ProgressBar />
          <div className="flex flex-wrap items-center gap-3">
            <ActivityManager />
            <Button
              variant="default"
              onClick={handleGenerateRandom}
              className={`bg-cyan-500 hover:bg-cyan-600 text-white glow-cyan ${language === 'kh' ? 'font-khmer' : 'font-outfit'}`}
              data-testid="button-generate-random"
            >
              <IconArrowsShuffle className="w-4 h-4 mr-2" />
              {t.generateRandom}
            </Button>
            <ExportButtons />
          </div>
        </div>

        {/* Schedule Container */}
        <div className="animate-in fade-in duration-500 w-full" id="schedule-container">
          <WeeklySchedule />
        </div>

        {/* Confirmation Dialog */}
        {showConfirm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className={`glass-effect-strong rounded-2xl shadow-2xl max-w-md w-full p-8 animate-slide-in ${language === 'kh' ? 'font-khmer' : 'font-outfit'}`}>
              <h2 className="text-2xl font-bold mb-3">{t.confirmTitle}</h2>
              <p className="text-muted-foreground mb-6">{t.confirmMsg}</p>
              <div className="flex gap-3">
                <Button
                  onClick={confirmGenerateRandom}
                  className={`flex-1 bg-cyan-500 hover:bg-cyan-600 text-white glow-cyan ${language === 'kh' ? 'font-khmer' : 'font-outfit'}`}
                >
                  {t.confirmBtn}
                </Button>
                <Button
                  onClick={() => setShowConfirm(false)}
                  variant="outline"
                  className={`flex-1 ${language === 'kh' ? 'font-khmer' : 'font-outfit'}`}
                >
                  {t.cancelBtn}
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
