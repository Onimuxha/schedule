import { z } from 'zod';

export const activitySchema = z.object({
  id: z.string(),
  name: z.string(),
  nameKh: z.string().optional(),
});

export const timeSlotSchema = z.object({
  id: z.string(),
  dayOfWeek: z.number().min(0).max(6),
  time: z.string(),
  activityId: z.string().nullable(),
  completed: z.boolean(),
});

export const dayScheduleSchema = z.object({
  dayOfWeek: z.number().min(0).max(6),
  isDayOff: z.boolean(),
  timeSlots: z.array(timeSlotSchema),
});

export const weekScheduleSchema = z.object({
  days: z.array(dayScheduleSchema),
});

export const languageSchema = z.enum(['en', 'kh']);

export function validateActivities(data: unknown): boolean {
  try {
    z.array(activitySchema).parse(data);
    return true;
  } catch {
    return false;
  }
}

export function validateWeekSchedule(data: unknown): boolean {
  try {
    weekScheduleSchema.parse(data);
    return true;
  } catch {
    return false;
  }
}

export function validateLanguage(data: unknown): boolean {
  try {
    languageSchema.parse(data);
    return true;
  } catch {
    return false;
  }
}
