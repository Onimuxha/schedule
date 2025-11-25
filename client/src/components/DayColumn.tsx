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
  const { setNodeRef, isOver } = useDroppable({
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
      className={`group flex flex-col overflow-hidden transition-all duration-300 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl ${
        isToday 
          ? 'ring-2 ring-blue-500 shadow-lg' 
          : 'hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600'
      } ${
        isOver ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700' : ''
      }`}
      data-testid={`card-day-${day.dayOfWeek}`}
    >
      {/* Clean Header */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-1.5 h-1.5 rounded-full ${
              isToday ? 'bg-blue-500' : 'bg-gray-400'
            }`} />
            <h3 className={`text-lg ${
              language === 'kh' ? 'font-khmer' : 'font-sans'
            } ${isToday ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-gray-100'}`}>
              {dayName}
            </h3>
          </div>
          
          {isToday && (
            <Badge variant="secondary" className="bg-blue-500 hover:bg-blue-600 text-white border-0 px-2 py-1 text-xs">
              {language === 'en' ? 'Today' : 'ថ្ងៃនេះ'}
            </Badge>
          )}
        </div>
        
        {/* Minimal Toggle Button */}
        <Button
          variant={day.isDayOff ? "default" : "outline"}
          size="sm"
          onClick={handleToggleDayOff}
          className={`w-full transition-all ${
            day.isDayOff 
              ? 'bg-green-600 hover:bg-green-700 text-white border-green-600' 
              : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
          } ${language === 'kh' ? 'font-khmer' : 'font-sans'} font-medium`}
          data-testid={`button-toggle-dayoff-${day.dayOfWeek}`}
        >
          <div className="flex items-center justify-center gap-2">
            {day.isDayOff ? (
              <IconCalendarOff className="w-4 h-4" />
            ) : (
              <IconCalendarEvent className="w-4 h-4" />
            )}
            <span>
              {day.isDayOff 
                ? (language === 'en' ? 'Day Off' : 'ថ្ងៃឈប់សម្រាក')
                : (language === 'en' ? 'Work Day' : 'ថ្ងៃធ្វើការ')
              }
            </span>
          </div>
        </Button>
      </div>

      {/* Clean Time Slots Area */}
      <div className="flex-1 p-3 space-y-2 overflow-y-auto min-h-[400px] bg-white dark:bg-gray-900">
        <SortableContext items={slotIds} strategy={verticalListSortingStrategy}>
          {day.timeSlots.map((slot) => (
            <SortableTimeSlot key={slot.id} slot={slot} />
          ))}
        </SortableContext>
        
        {/* Minimal Empty State */}
        {day.timeSlots.length === 0 && (
          <div className="flex flex-col items-center justify-center h-32 text-gray-400 dark:text-gray-600">
            <IconCalendarEvent className="w-8 h-8 mb-2" />
            <p className={`text-sm ${language === 'kh' ? 'font-khmer' : 'font-sans'}`}>
              {language === 'en' ? 'No activities' : 'គ្មានសកម្មភាព'}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}