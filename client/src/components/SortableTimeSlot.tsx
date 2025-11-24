import { useState } from 'react';
import { useSchedule } from '@/contexts/ScheduleContext';
import { TimeSlot } from '@shared/data';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { EditSlotDialog } from './EditSlotDialog';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { IconAlarm, IconGripVertical, IconEdit } from '@tabler/icons-react';

interface SortableTimeSlotProps {
  slot: TimeSlot;
}

export function SortableTimeSlot({ slot }: SortableTimeSlotProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const { activities, language, toggleTaskCompletion } = useSchedule();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: slot.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const activity = activities.find(a => a.id === slot.activityId);
  const activityName = activity 
    ? (language === 'kh' && activity.nameKh ? activity.nameKh : activity.name)
    : (language === 'en' ? 'Empty slot' : 'ទំនេរ');

  // Function to convert 24-hour format to 12-hour format with AM/PM
  const formatTime = (time24: string) => {
    const [hours, minutes] = time24.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12; // Convert 0, 12, 13, etc. to 12, 1, etc.
    return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  return (
    <>
      <Card
        ref={setNodeRef}
        style={style}
        className={`p-3 transition-all duration-200 ${
          isDragging ? 'opacity-50 shadow-glow-lg scale-105' : 'hover-elevate active-elevate-2'
        } ${slot.completed ? 'bg-primary/10 border-primary/30' : ''}`}
        data-testid={`card-timeslot-${slot.id}`}
      >
        <div className="flex items-center gap-3">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors"
            data-testid={`drag-handle-${slot.id}`}
          >
            <IconGripVertical size={20} />
          </div>

          <Checkbox
            checked={slot.completed}
            onCheckedChange={() => toggleTaskCompletion(slot.id)}
            disabled={!slot.activityId}
            data-testid={`checkbox-task-${slot.id}`}
            className="border-2"
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 mb-1">
              <IconAlarm size={14} className="text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {formatTime(slot.time)}
              </span>
            </div>
            <p
              className={`text-sm font-medium truncate cursor-pointer hover:text-cyan-400 transition-colors ${
                !slot.activityId ? 'text-muted-foreground italic' : ''
              } ${slot.completed ? 'line-through opacity-60' : ''} ${
                language === 'kh' ? 'font-khmer' : 'font-outfit'
              }`}
              data-testid={`text-activity-${slot.id}`}
              onClick={() => setShowEditDialog(true)}
            >
              {activityName}
            </p>
          </div>

          <button
            onClick={() => setShowEditDialog(true)}
            className="text-muted-foreground hover:text-cyan-400 transition-colors flex-shrink-0"
            title="Edit activity"
            data-testid={`button-edit-slot-${slot.id}`}
          >
            <IconEdit size={20} />
          </button>
        </div>
      </Card>

      <EditSlotDialog
        isOpen={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        slot={slot}
      />
    </>
  );
}
