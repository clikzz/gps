'use client';

import FindMap from '@/components/find/FindMap';

export default function FindMyPetPage() {
  return (
    <div className="relative w-screen left-1/2 -translate-x-1/2 h-screen flex flex-col max-w-7xl">
      <h1 className="text-2xl font-bold text-white">
        FindMyPet
      </h1>
      <div className="flex-1 w-full">
        <FindMap />
      </div>
    </div>
  );
}