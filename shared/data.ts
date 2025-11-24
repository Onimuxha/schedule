export interface Activity {
  id: string;
  name: string;
  nameKh?: string;
}

export interface TimeSlot {
  id: string;
  dayOfWeek: number;
  time: string;
  activityId: string | null;
  completed: boolean;
}

export interface DaySchedule {
  dayOfWeek: number;
  isDayOff: boolean;
  timeSlots: TimeSlot[];
}

export interface WeekSchedule {
  days: DaySchedule[];
}

export const DEFAULT_ACTIVITIES: Activity[] = [
  { id: 'act-1', name: 'Learn C Programming', nameKh: 'រៀន C Programming' },
  { id: 'act-2', name: 'Exercise', nameKh: 'លំហាត់ប្រាណ' },
  { id: 'act-3', name: 'Relax', nameKh: 'សម្រាក' },
  { id: 'act-4', name: 'Post a Video', nameKh: 'ផុសវីដេអូ' },
  { id: 'act-5', name: 'Wash Dishes', nameKh: 'លាងចាន' },
  { id: 'act-6', name: 'Mop the Floor', nameKh: 'ជូតផ្ទះ' },
  { id: 'act-7', name: 'Do Laundry', nameKh: 'បោកខោអាវ' },
  { id: 'act-8', name: 'Learn from Udemy', nameKh: 'រៀនពី Udemy' }
];

export const DAYS_OF_WEEK_EN = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
export const DAYS_OF_WEEK_KH = ['ចន្ទ', 'អង្គារ', 'ពុធ', 'ព្រហស្បតិ៍', 'សុក្រ', 'សៅរ៍', 'អាទិត្យ'];

// Generate time slots for a day
export function generateTimeSlots(dayOfWeek: number, isDayOff: boolean, startHour: number = 18): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const numSlots = 8; // Number of activity slots per day
  const actualStartHour = isDayOff ? (Math.random() > 0.5 ? 9 : 10) : (startHour === 18 ? (Math.random() > 0.5 ? 18 : 19) : startHour);
  const timestamp = Date.now();
  
  for (let i = 0; i < numSlots; i++) {
    const hour = actualStartHour + i;
    const timeString = `${hour.toString().padStart(2, '0')}:00`;
    slots.push({
      id: `slot-${dayOfWeek}-${i}-${timestamp}`,
      dayOfWeek,
      time: timeString,
      activityId: null,
      completed: false,
    });
  }
  
  return slots;
}

// Generate default week schedule
export function generateDefaultWeekSchedule(): WeekSchedule {
  const days: DaySchedule[] = [];
  
  for (let i = 0; i < 7; i++) {
    days.push({
      dayOfWeek: i,
      isDayOff: false,
      timeSlots: generateTimeSlots(i, false),
    });
  }
  
  return { days };
}

// Shuffle array helper
export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}
