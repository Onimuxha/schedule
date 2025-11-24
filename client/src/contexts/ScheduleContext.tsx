import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Activity,
  WeekSchedule,
  DEFAULT_ACTIVITIES,
  generateDefaultWeekSchedule,
  generateTimeSlots,
  shuffleArray,
} from '@shared/data';
import { validateActivities, validateWeekSchedule, validateLanguage } from '@shared/validators';

interface ScheduleContextType {
  activities: Activity[];
  weekSchedule: WeekSchedule;
  language: 'en' | 'kh';
  addActivity: (activity: Omit<Activity, 'id'>) => void;
  updateActivity: (id: string, activity: Partial<Activity>) => void;
  deleteActivity: (id: string) => void;
  toggleDayOff: (dayOfWeek: number) => void;
  toggleTaskCompletion: (slotId: string) => void;
  assignActivityToSlot: (slotId: string, activityId: string | null) => void;
  swapActivitySlots: (slotId1: string, slotId2: string) => void;
  generateRandomSchedule: () => void;
  setLanguage: (lang: 'en' | 'kh') => void;
  getCompletionPercentage: () => number;
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

const STORAGE_KEYS = {
  ACTIVITIES: 'schedule_activities',
  WEEK_SCHEDULE: 'week_schedule',
  LANGUAGE: 'schedule_language',
};

const isBrowser = typeof window !== 'undefined';

export function ScheduleProvider({ children }: { children: ReactNode }) {
  const [activities, setActivities] = useState<Activity[]>(() => {
    if (!isBrowser) return DEFAULT_ACTIVITIES;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
      if (!stored) return DEFAULT_ACTIVITIES;
      const parsed = JSON.parse(stored);
      if (!validateActivities(parsed)) {
        console.warn('Invalid activities in localStorage, using defaults');
        return DEFAULT_ACTIVITIES;
      }
      return parsed;
    } catch (error) {
      console.error('Failed to load activities:', error);
      return DEFAULT_ACTIVITIES;
    }
  });

  const [weekSchedule, setWeekSchedule] = useState<WeekSchedule>(() => {
    if (!isBrowser) return generateDefaultWeekSchedule();
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.WEEK_SCHEDULE);
      if (!stored) return generateDefaultWeekSchedule();
      const parsed = JSON.parse(stored);
      if (!validateWeekSchedule(parsed)) {
        console.warn('Invalid week schedule in localStorage, using defaults');
        return generateDefaultWeekSchedule();
      }
      return parsed;
    } catch (error) {
      console.error('Failed to load week schedule:', error);
      return generateDefaultWeekSchedule();
    }
  });

  const sanitizeScheduleActivities = () => {
    setWeekSchedule(prevSchedule => {
      const validActivityIds = new Set(activities.map(a => a.id));
      return {
        days: prevSchedule.days.map(day => ({
          ...day,
          timeSlots: day.timeSlots.map(slot => ({
            ...slot,
            activityId: slot.activityId && validActivityIds.has(slot.activityId) 
              ? slot.activityId 
              : null,
          })),
        })),
      };
    });
  };

  const [language, setLanguage] = useState<'en' | 'kh'>(() => {
    if (!isBrowser) return 'en';
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
      // Fix: Ensure we only return 'en' or 'kh'
      if (stored === 'en' || stored === 'kh') {
        return stored;
      }
      return 'en';
    } catch {
      return 'en';
    }
  });

  useEffect(() => {
    if (!isBrowser) return;
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
      sanitizeScheduleActivities();
    } catch (error) {
      console.error('Failed to save activities:', error);
    }
  }, [activities]);

  useEffect(() => {
    if (!isBrowser) return;
    try {
      localStorage.setItem(STORAGE_KEYS.WEEK_SCHEDULE, JSON.stringify(weekSchedule));
    } catch (error) {
      console.error('Failed to save schedule:', error);
    }
  }, [weekSchedule]);

  useEffect(() => {
    if (!isBrowser) return;
    try {
      localStorage.setItem(STORAGE_KEYS.LANGUAGE, language);
    } catch (error) {
      console.error('Failed to save language:', error);
    }
  }, [language]);

  const addActivity = (activity: Omit<Activity, 'id'>) => {
    const newActivity: Activity = {
      ...activity,
      id: `act-${Date.now()}`,
    };
    setActivities([...activities, newActivity]);
  };

  const updateActivity = (id: string, updates: Partial<Activity>) => {
    setActivities(activities.map(act => act.id === id ? { ...act, ...updates } : act));
  };

  const deleteActivity = (id: string) => {
    setActivities(activities.filter(act => act.id !== id));
    setWeekSchedule({
      days: weekSchedule.days.map(day => ({
        ...day,
        timeSlots: day.timeSlots.map(slot =>
          slot.activityId === id ? { ...slot, activityId: null } : slot
        ),
      })),
    });
  };

  const toggleDayOff = (dayOfWeek: number) => {
    setWeekSchedule({
      days: weekSchedule.days.map(day => {
        if (day.dayOfWeek !== dayOfWeek) return day;
        
        const newIsDayOff = !day.isDayOff;
        let newTimeSlots = generateTimeSlots(dayOfWeek, newIsDayOff);
        
        if (newIsDayOff && activities.length > 0) {
          const shuffledActivities = shuffleArray(activities);
          newTimeSlots = newTimeSlots.map((slot, index) => ({
            ...slot,
            activityId: shuffledActivities[index % shuffledActivities.length]?.id || null,
          }));
        }
        
        return {
          ...day,
          isDayOff: newIsDayOff,
          timeSlots: newTimeSlots,
        };
      }),
    });
  };

  const toggleTaskCompletion = (slotId: string) => {
    setWeekSchedule({
      days: weekSchedule.days.map(day => ({
        ...day,
        timeSlots: day.timeSlots.map(slot =>
          slot.id === slotId ? { ...slot, completed: !slot.completed } : slot
        ),
      })),
    });
  };

  const assignActivityToSlot = (slotId: string, activityId: string | null) => {
    setWeekSchedule(prevSchedule => ({
      days: prevSchedule.days.map(day => ({
        ...day,
        timeSlots: day.timeSlots.map(slot =>
          slot.id === slotId ? { ...slot, activityId } : slot
        ),
      })),
    }));
  };

  const swapActivitySlots = (slotId1: string, slotId2: string) => {
    setWeekSchedule(prevSchedule => {
      const allSlots = prevSchedule.days.flatMap(day => day.timeSlots);
      const slot1 = allSlots.find(slot => slot.id === slotId1);
      const slot2 = allSlots.find(slot => slot.id === slotId2);
      
      if (!slot1 || !slot2) return prevSchedule;
      
      const activity1 = slot1.activityId;
      const activity2 = slot2.activityId;
      
      return {
        days: prevSchedule.days.map(day => ({
          ...day,
          timeSlots: day.timeSlots.map(slot => {
            if (slot.id === slotId1) {
              return { ...slot, activityId: activity2 };
            }
            if (slot.id === slotId2) {
              return { ...slot, activityId: activity1 };
            }
            return slot;
          }),
        })),
      };
    });
  };

  const generateRandomSchedule = () => {
    if (activities.length === 0) return;
    
    setWeekSchedule({
      days: weekSchedule.days.map(day => {
        const shuffledActivities = shuffleArray(activities);
        return {
          ...day,
          timeSlots: day.timeSlots.map((slot, index) => ({
            ...slot,
            activityId: shuffledActivities[index % shuffledActivities.length]?.id || null,
            completed: false,
          })),
        };
      }),
    });
  };

  const getCompletionPercentage = () => {
    const allSlots = weekSchedule.days.flatMap(day => day.timeSlots);
    const slotsWithActivities = allSlots.filter(slot => slot.activityId !== null);
    const completedSlots = slotsWithActivities.filter(slot => slot.completed);
    
    if (slotsWithActivities.length === 0) return 0;
    return Math.round((completedSlots.length / slotsWithActivities.length) * 100);
  };

  return (
    <ScheduleContext.Provider
      value={{
        activities,
        weekSchedule,
        language,
        addActivity,
        updateActivity,
        deleteActivity,
        toggleDayOff,
        toggleTaskCompletion,
        assignActivityToSlot,
        swapActivitySlots,
        generateRandomSchedule,
        setLanguage,
        getCompletionPercentage,
      }}
    >
      {children}
    </ScheduleContext.Provider>
  );
}

export function useSchedule() {
  const context = useContext(ScheduleContext);
  if (!context) {
    throw new Error('useSchedule must be used within a ScheduleProvider');
  }
  return context;
}
