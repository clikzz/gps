import * as milestoneController from '@/server/controllers/milestoneController';

export async function GET() {
  return milestoneController.getAll();
}