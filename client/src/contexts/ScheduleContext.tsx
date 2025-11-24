import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Activity,
  WeekSchedule,
  DEFAULT_ACTIVITIES,
  generateDefaultWeekSchedule,
  generateTimeSlots,
  shuffleArray,
} from '@shared/data';
import { validateActivities, validateWeekSchedule } from '@shared/validators';

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
  resetToDefaults: () => void;
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

const STORAGE_KEYS = {
  ACTIVITIES: 'schedule_activities',
  WEEK_SCHEDULE: 'week_schedule',
  LANGUAGE: 'schedule_language',
  DATA_VERSION: 'schedule_data_version',
};

// Generate a hash of DEFAULT_ACTIVITIES to detect changes
function generateDataHash(): string {
  return JSON.stringify(DEFAULT_ACTIVITIES.map(a => ({ id: a.id, name: a.name, nameKh: a.nameKh })));
}

const isBrowser = typeof window !== 'undefined';

function loadActivities(): Activity[] {
  if (!isBrowser) return DEFAULT_ACTIVITIES;
  
  try {
    console.log('Loading activities...');
    console.log('DEFAULT_ACTIVITIES:', DEFAULT_ACTIVITIES);
    
    const stored = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
    const storedHash = localStorage.getItem(STORAGE_KEYS.DATA_VERSION);
    const currentHash = generateDataHash();
    
    console.log('Stored hash:', storedHash);
    console.log('Current hash:', currentHash);
    console.log('Hash match:', storedHash === currentHash);
    
    // If no stored data or hash changed, use defaults
    if (!stored || storedHash !== currentHash) {
      console.log('✅ Data changed or first load - using defaults');
      localStorage.setItem(STORAGE_KEYS.DATA_VERSION, currentHash);
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(DEFAULT_ACTIVITIES));
      return DEFAULT_ACTIVITIES;
    }
    
    const parsed = JSON.parse(stored);
    if (!validateActivities(parsed)) {
      console.warn('⚠️ Invalid activities, using defaults');
      return DEFAULT_ACTIVITIES;
    }
    
    console.log('📦 Using stored activities:', parsed);
    return parsed;
  } catch (error) {
    console.error('❌ Failed to load activities:', error);
    return DEFAULT_ACTIVITIES;
  }
}

function loadWeekSchedule(): WeekSchedule {
  if (!isBrowser) return generateDefaultWeekSchedule();
  
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.WEEK_SCHEDULE);
    if (!stored) return generateDefaultWeekSchedule();
    
    const parsed = JSON.parse(stored);
    if (!validateWeekSchedule(parsed)) {
      console.warn('Invalid schedule, using defaults');
      return generateDefaultWeekSchedule();
    }
    
    return parsed;
  } catch (error) {
    console.error('Failed to load schedule:', error);
    return generateDefaultWeekSchedule();
  }
}

function loadLanguage(): 'en' | 'kh' {
  if (!isBrowser) return 'en';
  
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
    if (stored === 'en' || stored === 'kh') return stored;
    return 'en';
  } catch {
    return 'en';
  }
}

export function ScheduleProvider({ children }: { children: ReactNode }) {
  const [activities, setActivities] = useState<Activity[]>(loadActivities);
  const [weekSchedule, setWeekSchedule] = useState<WeekSchedule>(loadWeekSchedule);
  const [language, setLanguage] = useState<'en' | 'kh'>(loadLanguage);

  // Save activities to localStorage
  useEffect(() => {
    if (!isBrowser) return;
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
      
      // Clean up schedule - remove references to deleted activities
      setWeekSchedule(prev => {
        const validIds = new Set(activities.map(a => a.id));
        const needsUpdate = prev.days.some(day => 
          day.timeSlots.some(slot => slot.activityId && !validIds.has(slot.activityId))
        );
        
        if (!needsUpdate) return prev;
        
        return {
          days: prev.days.map(day => ({
            ...day,
            timeSlots: day.timeSlots.map(slot => ({
              ...slot,
              activityId: slot.activityId && validIds.has(slot.activityId) ? slot.activityId : null,
            })),
          })),
        };
      });
    } catch (error) {
      console.error('Failed to save activities:', error);
    }
  }, [activities]);

  // Save schedule to localStorage
  useEffect(() => {
    if (!isBrowser) return;
    try {
      localStorage.setItem(STORAGE_KEYS.WEEK_SCHEDULE, JSON.stringify(weekSchedule));
    } catch (error) {
      console.error('Failed to save schedule:', error);
    }
  }, [weekSchedule]);

  // Save language to localStorage
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
      id: `custom-${Date.now()}`,
    };
    setActivities(prev => [...prev, newActivity]);
  };

  const updateActivity = (id: string, updates: Partial<Activity>) => {
    setActivities(prev => prev.map(act => act.id === id ? { ...act, ...updates } : act));
  };

  const deleteActivity = (id: string) => {
    setActivities(prev => prev.filter(act => act.id !== id));
  };

  const toggleDayOff = (dayOfWeek: number) => {
    setWeekSchedule(prev => ({
      days: prev.days.map(day => {
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
    }));
  };

  const toggleTaskCompletion = (slotId: string) => {
    setWeekSchedule(prev => ({
      days: prev.days.map(day => ({
        ...day,
        timeSlots: day.timeSlots.map(slot =>
          slot.id === slotId ? { ...slot, completed: !slot.completed } : slot
        ),
      })),
    }));
  };

  const assignActivityToSlot = (slotId: string, activityId: string | null) => {
    setWeekSchedule(prev => ({
      days: prev.days.map(day => ({
        ...day,
        timeSlots: day.timeSlots.map(slot =>
          slot.id === slotId ? { ...slot, activityId } : slot
        ),
      })),
    }));
  };

  const swapActivitySlots = (slotId1: string, slotId2: string) => {
    setWeekSchedule(prev => {
      const allSlots = prev.days.flatMap(day => day.timeSlots);
      const slot1 = allSlots.find(slot => slot.id === slotId1);
      const slot2 = allSlots.find(slot => slot.id === slotId2);
      
      if (!slot1 || !slot2) return prev;
      
      const activity1 = slot1.activityId;
      const activity2 = slot2.activityId;
      
      return {
        days: prev.days.map(day => ({
          ...day,
          timeSlots: day.timeSlots.map(slot => {
            if (slot.id === slotId1) return { ...slot, activityId: activity2 };
            if (slot.id === slotId2) return { ...slot, activityId: activity1 };
            return slot;
          }),
        })),
      };
    });
  };

  const generateRandomSchedule = () => {
    if (activities.length === 0) return;
    
    setWeekSchedule(prev => ({
      days: prev.days.map(day => {
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
    }));
  };

  const getCompletionPercentage = () => {
    const allSlots = weekSchedule.days.flatMap(day => day.timeSlots);
    const slotsWithActivities = allSlots.filter(slot => slot.activityId !== null);
    const completedSlots = slotsWithActivities.filter(slot => slot.completed);
    
    if (slotsWithActivities.length === 0) return 0;
    return Math.round((completedSlots.length / slotsWithActivities.length) * 100);
  };

  const resetToDefaults = () => {
    if (!isBrowser) return;
    
    const confirmed = window.confirm('Reset all data to defaults? This cannot be undone.');
    if (!confirmed) return;
    
    localStorage.removeItem(STORAGE_KEYS.ACTIVITIES);
    localStorage.removeItem(STORAGE_KEYS.WEEK_SCHEDULE);
    localStorage.removeItem(STORAGE_KEYS.DATA_VERSION);
    
    setActivities(DEFAULT_ACTIVITIES);
    setWeekSchedule(generateDefaultWeekSchedule());
    
    const currentHash = generateDataHash();
    localStorage.setItem(STORAGE_KEYS.DATA_VERSION, currentHash);
    
    console.log('Reset to defaults');
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
        resetToDefaults,
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