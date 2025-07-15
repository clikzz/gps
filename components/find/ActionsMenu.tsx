"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface FindActionsMenuProps {
  onReportClick: () => void;
  onMyReportsClick: () => void;
  onOthersReportsClick: () => void;
  onFoundReportsClick: () => void;
}

export default function FindActionsMenu({
  onReportClick,
  onMyReportsClick,
  onOthersReportsClick,
  onFoundReportsClick,
}: FindActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          size="sm"
          className="flex items-center gap-1"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent sideOffset={4} align="end">
        <DropdownMenuItem onSelect={onReportClick}>
          Reportar Mascota
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={onMyReportsClick}>
          Mis Reportes
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={onOthersReportsClick}>
          Otros Reportes
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={onFoundReportsClick}>
          Reportes Encontrados
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
