'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

interface ReportButtonProps {
  onClick: () => void;
}

export default function ReportButton({ onClick }: ReportButtonProps) {
  return (
    <Button
      variant="destructive"
      size="default"
      onClick={onClick}
      className="absolute top-4 right-4 z-20"
    >
      Reportar Mascota Perdida
    </Button>
  );
}