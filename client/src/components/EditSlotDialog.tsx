import { useState, useEffect } from 'react';
import { useSchedule } from '@/contexts/ScheduleContext';
import { TimeSlot } from '@shared/data';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import toast from 'react-hot-toast';
import { IconX } from '@tabler/icons-react';

interface EditSlotDialogProps {
  isOpen: boolean;
  onClose: () => void;
  slot: TimeSlot;
}

export function EditSlotDialog({ isOpen, onClose, slot }: EditSlotDialogProps) {
  const { activities, assignActivityToSlot, language } = useSchedule();
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(slot.activityId);

  useEffect(() => {
    if (isOpen) {
      setSelectedActivityId(slot.activityId);
    }
  }, [isOpen, slot.activityId]);

  const labels = {
    en: {
      title: 'Edit Time Slot',
      selectActivity: 'Select Activity',
      clear: 'Clear Slot',
      save: 'Save',
      cancel: 'Cancel',
      saved: 'Time slot updated',
    },
    kh: {
      title: 'កែសម្រួលឆាកពេលវេលា',
      selectActivity: 'ជ្រើសរើសសកម្មភាព',
      clear: 'សម្អាតឆាក',
      save: 'រក្សាទុក',
      cancel: 'បោះបង់',
      saved: 'ឆាកពេលវេលាបានធ្វើបច្ចុប្បន្នភាព',
    },
  };

  const t = labels[language];

  const handleSave = () => {
    assignActivityToSlot(slot.id, selectedActivityId);
    toast.success(t.saved);
    onClose();
  };

  const handleClear = () => {
    setSelectedActivityId(null);
  };

  const currentActivity = activities.find(a => a.id === selectedActivityId);
  const currentActivityName = currentActivity 
    ? (language === 'kh' && currentActivity.nameKh ? currentActivity.nameKh : currentActivity.name)
    : null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`max-w-md ${language === 'kh' ? 'font-khmer' : 'font-sans'}`}>
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">{t.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Activity Display */}
          {currentActivityName && (
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t.selectActivity}</p>
              <p className={`text-sm font-medium ${language === 'kh' ? 'font-khmer' : 'font-sans'}`}>
                {currentActivityName}
              </p>
            </div>
          )}

          {/* Activity List with Modern Scrollbar */}
          <div className="activities-scroll-container space-y-2 max-h-[300px] overflow-y-auto">
            {activities.map((activity) => (
              <Card
                key={activity.id}
                className={`p-3 cursor-pointer transition-all ${
                  selectedActivityId === activity.id
                    ? 'bg-blue-900/20 border-blue-800'
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750'
                }`}
                onClick={() => setSelectedActivityId(activity.id)}
                data-testid={`card-activity-option-${activity.id}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium truncate ${language === 'kh' ? 'font-khmer' : 'font-sans'}`}>
                      {activity.name}
                    </p>
                    {activity.nameKh && (
                      <p className={`text-sm text-gray-600 dark:text-gray-400 truncate ${language === 'kh' ? 'font-khmer' : ''}`}>
                        {activity.nameKh}
                      </p>
                    )}
                  </div>
                  {selectedActivityId === activity.id && (
                    <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
                  )}
                </div>
              </Card>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              className={`flex-1 bg-blue-600 hover:bg-blue-700 text-white ${language === 'kh' ? 'font-khmer' : 'font-sans'}`}
              data-testid="button-save-slot"
            >
              {t.save}
            </Button>
            <Button
              onClick={handleClear}
              variant="outline"
              size="icon"
              title={t.clear}
              data-testid="button-clear-slot"
              className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <IconX className="w-4 h-4" />
            </Button>
          </div>

          <Button
            onClick={onClose}
            variant="outline"
            className="w-full border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            data-testid="button-cancel-edit"
          >
            {t.cancel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}