import { useSchedule } from '@/contexts/ScheduleContext';
import { DaySchedule } from '@shared/data';
import { DAYS_OF_WEEK_EN, DAYS_OF_WEEK_KH } from '@shared/data';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableTimeSlot } from './SortableTimeSlot';
import { IconCalendarEvent, IconCalendarOff } from '@tabler/icons-react';
import toast from 'react-hot-toast';

interface DayColumnProps {
  day: DaySchedule;
}

export function DayColumn({ day }: DayColumnProps) {
  const { language, toggleDayOff } = useSchedule();
  const { setNodeRef } = useDroppable({
    id: `day-${day.dayOfWeek}`,
  });

  const isToday = new Date().getDay() === ((day.dayOfWeek + 1) % 7);
  const dayName = language === 'en' ? DAYS_OF_WEEK_EN[day.dayOfWeek] : DAYS_OF_WEEK_KH[day.dayOfWeek];

  const handleToggleDayOff = () => {
    toggleDayOff(day.dayOfWeek);
    const msg = language === 'en' 
      ? (day.isDayOff ? 'Workday mode activated' : 'Day off mode activated')
      : (day.isDayOff ? 'បានដាក់ថ្ងៃធ្វើការ' : 'បានដាក់ថ្ងៃឈប់សម្រាក');
    toast.success(msg);
  };

  const slotIds = day.timeSlots.map(slot => slot.id);

  return (
    <Card
      ref={setNodeRef}
      className={`flex flex-col overflow-hidden transition-all duration-300 bg-card border border-card-border ${
        isToday ? 'border-cyan-500 glow-cyan shadow-lg' : ''
      }`}
      data-testid={`card-day-${day.dayOfWeek}`}
    >
      <div className="p-4 border-b border-card-border bg-card/50 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className={`text-lg font-semibold ${language === 'kh' ? 'font-khmer' : 'font-outfit'}`}>
            {dayName}
          </h3>
          {isToday && (
            <Badge variant="default" className="bg-cyan-500 text-white">
              {language === 'en' ? 'Today' : 'ថ្ងៃនេះ'}
            </Badge>
          )}
        </div>
        
        <Button
          variant={day.isDayOff ? 'default' : 'outline'}
          size="sm"
          onClick={handleToggleDayOff}
          className={`w-full ${language === 'kh' ? 'font-khmer' : 'font-outfit'}`}
          data-testid={`button-toggle-dayoff-${day.dayOfWeek}`}
        >
          {day.isDayOff ? <IconCalendarOff className="w-4 h-4 mr-2" /> : <IconCalendarEvent className="w-4 h-4 mr-2" />}
          {day.isDayOff 
            ? (language === 'en' ? 'Day Off' : 'ថ្ងៃឈប់សម្រាក')
            : (language === 'en' ? 'Work Day' : 'ថ្ងៃធ្វើការ')
          }
        </Button>
      </div>

      <div className="flex-1 p-3 space-y-2 overflow-y-auto min-h-[400px]">
        <SortableContext items={slotIds} strategy={verticalListSortingStrategy}>
          {day.timeSlots.map((slot) => (
            <SortableTimeSlot key={slot.id} slot={slot} />
          ))}
        </SortableContext>
      </div>
    </Card>
  );
}
