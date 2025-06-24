"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarProps {
  initialDate?: Date | null;
  onDateSelect?: (date: Date) => void;
  selectedBgColorClass?: string;
  maxDate?: Date;
}

const monthNames = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];
const dayNames = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"];

export default function Calendar({
  initialDate = null,
  onDateSelect,
  selectedBgColorClass = "bg-primary",
  maxDate,
}: CalendarProps) {
  const [currentDate, setCurrentDate] = useState<Date>(
    initialDate
      ? new Date(initialDate.getFullYear(), initialDate.getMonth())
      : new Date()
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    initialDate
  );

  const daysInMonth = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  const firstDayIndex = (d: Date) => {
    const dow = new Date(d.getFullYear(), d.getMonth(), 1).getDay();
    return dow === 0 ? 6 : dow - 1;
  };

  const navigate = (dir: "prev" | "next") => {
    setCurrentDate((d) => {
      const nd = new Date(d);
      nd.setMonth(dir === "prev" ? d.getMonth() - 1 : d.getMonth() + 1);
      return nd;
    });
  };


  const cells: { date: Date; isCurrent: boolean }[] = [];
  const dim = daysInMonth(currentDate);
  const fdi = firstDayIndex(currentDate);
  const prevDim = daysInMonth(
    new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
  );


  for (let i = fdi - 1; i >= 0; i--) {
    cells.push({
      date: new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 1,
        prevDim - i
      ),
      isCurrent: false,
    });
  }

  for (let d = 1; d <= dim; d++) {
    cells.push({
      date: new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        d
      ),
      isCurrent: true,
    });
  }

  while (cells.length < 42) {
    const nextDay = cells.length - dim - fdi + 1;
    cells.push({
      date: new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        nextDay
      ),
      isCurrent: false,
    });
  }

  const isSelected = (d: Date) =>
    selectedDate?.toDateString() === d.toDateString();

  const pickDay = (d: Date) => {
    setSelectedDate(d);
    onDateSelect?.(d);
  };

  return (
    <div className="w-80 bg-card border border-border rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={() => navigate("prev")}
          className="p-1 hover:bg-muted rounded transition"
        >
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <h2 className="text-lg font-medium text-foreground">
          {monthNames[currentDate.getMonth()]}{" "}
          {currentDate.getFullYear()}
        </h2>
        <button
          type="button"
          onClick={() => navigate("next")}
          className="p-1 hover:bg-muted rounded transition"
        >
          <ChevronRight className="w-5 h-5 text-foreground" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((dn) => (
          <div
            key={dn}
            className="h-8 flex items-center justify-center"
          >
            <span className="text-xs font-medium text-muted-foreground">
              {dn}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map(({ date, isCurrent }, idx) => {
          const sel = isSelected(date);
          const isDisabled = maxDate ? date > maxDate : false;
          return (
            <button
              key={idx}
              type="button"
              disabled={isDisabled}
              onClick={() => !isDisabled && pickDay(date)}
              className={`h-8 flex items-center justify-center rounded transition
                ${sel
                  ? `${selectedBgColorClass} text-white dark:text-black`
                  : !isDisabled
                  ? "hover:bg-muted"
                  : ""
                }
                ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}
              `}
            >
              <span
                className={`text-sm ${
                  sel
                    ? "font-medium"
                    : isCurrent
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {date.getDate()}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
