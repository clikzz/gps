import { TimelineEntries, TimelineEntryPhotos, Milestones as Milestone } from '@prisma/client';

export type TimelineEntryWithPhotos = TimelineEntries & {
  TimelineEntryPhotos: TimelineEntryPhotos[];
  Milestones: Milestone[]; 
};

export interface NewTimelineEntryPayload {
  title?: string;
  description?: string;
  eventDate: string;
  photoUrls?: string[];
  milestoneIds?: string[];       
}