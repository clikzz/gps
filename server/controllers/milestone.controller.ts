import { NextResponse } from 'next/server';
import * as milestoneService from '@/server/services/milestone.service';

export async function getAll() {
  const list = await milestoneService.getAllMilestones();
  return NextResponse.json(list);
}