import { useState } from 'react';
import { useSchedule } from '@/contexts/ScheduleContext';
import { DayColumn } from './DayColumn';
import { DndContext, DragEndEvent, DragStartEvent, DragOverlay, closestCenter } from '@dnd-kit/core';
import { SortableTimeSlot } from './SortableTimeSlot';
import toast from 'react-hot-toast';

export function WeeklySchedule() {
  const { weekSchedule, swapActivitySlots, language } = useSchedule();
  const [activeId, setActiveId] = useState<string | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) return;

    const activeSlotId = active.id as string;
    const overSlotId = over.id as string;

    const allSlots = weekSchedule.days.flatMap(day => day.timeSlots);
    const isActiveSlot = allSlots.some(slot => slot.id === activeSlotId);
    const isOverSlot = allSlots.some(slot => slot.id === overSlotId);

    if (!isActiveSlot || !isOverSlot) {
      return;
    }

    swapActivitySlots(activeSlotId, overSlotId);

    const msg = language === 'en' ? 'Activities swapped' : 'បានប្តូរសកម្មភាព';
    toast.success(msg);
  };

  const activeSlot = weekSchedule.days
    .flatMap(day => day.timeSlots)
    .find(slot => slot.id === activeId);

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-3" data-testid="schedule-grid">
          {weekSchedule.days.map((day) => (
            <DayColumn key={day.dayOfWeek} day={day} />
          ))}
        </div>

      <DragOverlay>
        {activeId && activeSlot ? (
          <div className="opacity-80 rotate-3">
            <SortableTimeSlot slot={activeSlot} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
