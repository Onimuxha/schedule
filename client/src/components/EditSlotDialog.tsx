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
      <DialogContent className={`max-w-md ${language === 'kh' ? 'font-khmer' : 'font-outfit'}`}>
        <DialogHeader>
          <DialogTitle>{t.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Activity Display */}
          {currentActivityName && (
            <div className="p-3 bg-card/50 rounded-lg border border-card-border">
              <p className="text-sm text-muted-foreground mb-1">{t.selectActivity}</p>
              <p className={`text-sm font-medium ${language === 'kh' ? 'font-khmer' : 'font-outfit'}`}>
                {currentActivityName}
              </p>
            </div>
          )}

          {/* Activity List */}
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {activities.map((activity) => (
              <Card
                key={activity.id}
                className={`p-3 cursor-pointer transition-all ${
                  selectedActivityId === activity.id
                    ? 'bg-cyan-500/20 border-cyan-500/50'
                    : 'hover-elevate'
                }`}
                onClick={() => setSelectedActivityId(activity.id)}
                data-testid={`card-activity-option-${activity.id}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate font-outfit">{activity.name}</p>
                    {activity.nameKh && (
                      <p className={`text-sm text-muted-foreground truncate ${language === 'kh' ? 'font-khmer' : ''}`}>
                        {activity.nameKh}
                      </p>
                    )}
                  </div>
                  {selectedActivityId === activity.id && (
                    <div className="w-2 h-2 rounded-full bg-cyan-500 mt-1.5 flex-shrink-0" />
                  )}
                </div>
              </Card>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              className={`flex-1 bg-cyan-500 hover:bg-cyan-600 text-white glow-cyan ${language === 'kh' ? 'font-khmer' : 'font-outfit'}`}
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
            >
              <IconX className="w-4 h-4" />
            </Button>
          </div>

          <Button
            onClick={onClose}
            variant="outline"
            className="w-full"
            data-testid="button-cancel-edit"
          >
            {t.cancel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
