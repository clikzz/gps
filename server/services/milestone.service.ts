import prisma from '@/lib/db';

export async function getAllMilestones() {

  return prisma.milestones.findMany({ orderBy: { name: 'asc' } });
}