import * as milestoneController from '@/server/controllers/milestone.controller';

export async function GET() {
  return milestoneController.getAll();
}