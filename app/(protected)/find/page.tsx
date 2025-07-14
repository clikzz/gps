'use client';

import FindMap from '@/components/find/FindMap';

export default function FindPage() {
  return (
    <div className="fixed left-0 right-0 z-30" style={{ top: '64px', bottom: '0' }}>
      <FindMap />
    </div>
  );
}