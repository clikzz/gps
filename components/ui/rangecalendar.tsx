"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface RangeCalendarProps {
  initialStartDate?: Date | null
  initialEndDate?: Date | null
  onDateRangeSelect?: (startDate: Date | null, endDate: Date | null) => void
  selectedBgColorClass?: string
  maxDate?: Date
}

const monthNames = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
]

const dayNames = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"]

const quickRangeOptions = [
  { key: "lastWeek", label: "Última semana" },
  { key: "lastMonth", label: "Último mes" },
  { key: "last6Months", label: "Últimos 6 meses" },
  { key: "lastYear", label: "Último año" },
]

export default function RangeCalendar({
  initialStartDate = null,
  initialEndDate = null,
  onDateRangeSelect,
  selectedBgColorClass = "bg-primary",
  maxDate,
}: RangeCalendarProps) {
const [startDate, setStartDate] = useState<Date | null>(initialStartDate)
const todayLocal = new Date();
const localMaxDate = new Date(
  todayLocal.getFullYear(),
  todayLocal.getMonth(),
  todayLocal.getDate()
);
const [endDate, setEndDate] = useState<Date | null>(initialEndDate)
const [hoverDate, setHoverDate] = useState<Date | null>(null)


const initialStartMs = initialStartDate?.getTime() ?? null
const initialEndMs   = initialEndDate?.getTime()   ?? null
const currentStartMs = startDate?.getTime()       ?? null
const currentEndMs   = endDate?.getTime()         ?? null
const hasChanges     = currentStartMs !== initialStartMs || currentEndMs !== initialEndMs

  const today = new Date()
  const currentMonth = new Date(today.getFullYear(), today.getMonth())
  

  const [rightCalendarDate, setRightCalendarDate] = useState<Date>(currentMonth)
  const [leftCalendarDate, setLeftCalendarDate] = useState<Date>(new Date(today.getFullYear(), today.getMonth() - 1))

  const daysInMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()

  const firstDayIndex = (d: Date) => {
    const dow = new Date(d.getFullYear(), d.getMonth(), 1).getDay()
    return dow === 0 ? 6 : dow - 1
  }


  const navigateRightMonth = (dir: "prev" | "next") => {
    setRightCalendarDate((prev) => {
      const nd = new Date(prev)
      nd.setMonth(prev.getMonth() + (dir === "prev" ? -1 : 1))


      if (
        dir === "next" &&
        (nd.getFullYear() > currentMonth.getFullYear() ||
          (nd.getFullYear() === currentMonth.getFullYear() && nd.getMonth() > currentMonth.getMonth()))
      ) {
        return prev
      }

      if (
        nd.getFullYear() < leftCalendarDate.getFullYear() ||
        (nd.getFullYear() === leftCalendarDate.getFullYear() && nd.getMonth() <= leftCalendarDate.getMonth())
      ) {
        const newLeftDate = new Date(nd.getFullYear(), nd.getMonth() - 1)
        setLeftCalendarDate(newLeftDate)
      }

      return nd
    })
  }

  const navigateLeftMonth = (dir: "prev" | "next") => {
    setLeftCalendarDate((prev) => {
      const nd = new Date(prev)
      nd.setMonth(prev.getMonth() + (dir === "prev" ? -1 : 1))

      const maxLeftMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
      if (
        dir === "next" &&
        (nd.getFullYear() > maxLeftMonth.getFullYear() ||
          (nd.getFullYear() === maxLeftMonth.getFullYear() && nd.getMonth() > maxLeftMonth.getMonth()))
      ) {
        return prev
      }

      if (
        nd.getFullYear() > rightCalendarDate.getFullYear() ||
        (nd.getFullYear() === rightCalendarDate.getFullYear() && nd.getMonth() >= rightCalendarDate.getMonth())
      ) {
        const newRightDate = new Date(nd.getFullYear(), nd.getMonth() + 1)
        if (
          newRightDate.getFullYear() <= currentMonth.getFullYear() &&
          (newRightDate.getFullYear() < currentMonth.getFullYear() ||
            newRightDate.getMonth() <= currentMonth.getMonth())
        ) {
          setRightCalendarDate(newRightDate)
        } else {
          return prev
        }
      }

      return nd
    })
  }

  const generateCalendarCells = (currentDate: Date) => {
    const cells: { date: Date; isCurrent: boolean }[] = []
    const dim = daysInMonth(currentDate)
    const fdi = firstDayIndex(currentDate)
    const prevDim = daysInMonth(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))

    for (let i = fdi - 1; i >= 0; i--) {
      cells.push({
        date: new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, prevDim - i),
        isCurrent: false,
      })
    }

    for (let d = 1; d <= dim; d++) {
      cells.push({
        date: new Date(currentDate.getFullYear(), currentDate.getMonth(), d),
        isCurrent: true,
      })
    }

    while (cells.length < 42) {
      const nextDay = cells.length - dim - fdi + 1
      cells.push({
        date: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, nextDay),
        isCurrent: false,
      })
    }

    return cells
  }

  const isInRange = (date: Date) => {
    if (!startDate || !endDate) return false
    return date.getTime() >= startDate.getTime() && date.getTime() <= endDate.getTime()
  }

  const isInHoverRange = (date: Date) => {
    if (!startDate || !hoverDate || endDate) return false
    const startMs = startDate.getTime()
    const hoverMs = hoverDate.getTime()
    const dateMs = date.getTime()
    return dateMs >= Math.min(startMs, hoverMs) && dateMs <= Math.max(startMs, hoverMs)
  }

  const isStartDate = (date: Date) => startDate?.toDateString() === date.toDateString()
  const isEndDate = (date: Date) => endDate?.toDateString() === date.toDateString()

  const pickDay = (date: Date) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(date)
      setEndDate(null)
    } else if (startDate && !endDate) {
      if (date >= startDate) setEndDate(date)
      else {
        setStartDate(date)
        setEndDate(startDate)
      }
    }
  }

  const getLastWeekStart = (date: Date) => {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1) - 7 
    return new Date(d.setDate(diff))
  }

  const getLastWeekEnd = (date: Date) => {
    return new Date(date) 
  }

  const setQuickRange = (type: "lastWeek" | "lastMonth" | "last6Months" | "lastYear") => {
    const today = new Date()
    let start: Date,
      end: Date = new Date(today)

    switch (type) {
      case "lastWeek":
        start = getLastWeekStart(today)
        end = getLastWeekEnd(today)
        break
      case "lastMonth":
        start = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate())
        end = new Date(today)
        break
      case "last6Months":
        start = new Date(today.getFullYear(), today.getMonth() - 6, today.getDate())
        break
      case "lastYear":
        start = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate())
        break
    }

    setStartDate(start)
    setEndDate(end)
  }

  const handleApply = () => {
  onDateRangeSelect?.(startDate, endDate)
}

  const formatDateRange = () => {
    if (!startDate && !endDate) return "Selecciona un rango de fechas"
    if (startDate && !endDate) return `Desde: ${startDate.toLocaleDateString("es-ES")}`
    return `${startDate!.toLocaleDateString("es-ES")} - ${endDate!.toLocaleDateString("es-ES")}`
  }

  const renderCalendar = (currentDate: Date, isRight = false) => {
    const cells = generateCalendarCells(currentDate)

    return (
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => (isRight ? navigateRightMonth("prev") : navigateLeftMonth("prev"))}
            className="h-8 w-8 p-0 hover:bg-muted"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-semibold text-foreground">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => (isRight ? navigateRightMonth("next") : navigateLeftMonth("next"))}
            className="h-8 w-8 p-0 hover:bg-muted"
            disabled={
              isRight
                ? 
                  currentDate.getFullYear() >= currentMonth.getFullYear() &&
                  currentDate.getMonth() >= currentMonth.getMonth()
                : 
                  currentDate.getFullYear() >= currentMonth.getFullYear() &&
                  currentDate.getMonth() >= currentMonth.getMonth() - 1
            }
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-3">
          {dayNames.map((dn) => (
            <div key={dn} className="h-10 flex items-center justify-center">
              <span className="text-sm font-medium text-muted-foreground">{dn}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {cells.map(({ date, isCurrent }, idx) => {
            const isStart = isCurrent && isStartDate(date)
            const isEnd = isCurrent && isEndDate(date)
            const inRange = isCurrent && isInRange(date)
            const inHover = isCurrent && isInHoverRange(date)
            const isDisabled = localMaxDate
  ? date > localMaxDate
  : false
            const isToday = date.toDateString() === new Date().toDateString()

            return (
              <Button
                key={idx}
                variant="ghost"
                size="sm"
                disabled={isDisabled}
                onClick={() => !isDisabled && pickDay(date)}
                onMouseEnter={() => setHoverDate(date)}
                onMouseLeave={() => setHoverDate(null)}
                className={`
                  h-10 w-10 p-0 font-normal transition-all duration-200 relative
                  ${
                    isStart || isEnd
                      ? "bg-primary text-primary-foreground hover:bg-primary/90 rounded-full"
                      : inRange || inHover
                        ? "bg-primary/10 text-primary hover:bg-primary/20"
                        : !isDisabled
                          ? "hover:bg-muted text-foreground"
                          : ""
                  }
                  ${isDisabled ? "opacity-40 cursor-not-allowed" : ""}
                  ${!isCurrent ? "text-muted-foreground/50" : ""}
                  ${isToday && !isStart && !isEnd && isCurrent ? "ring-2 ring-primary ring-offset-2" : ""}
                `}
              >
                {date.getDate()}
              </Button>
            )
          })}
        </div>
      </div>
    )
  }

  const handleClear = () => {
    setStartDate(null)
    setEndDate(null)
    const currentMonth = new Date(today.getFullYear(), today.getMonth())
    const previousMonth = new Date(today.getFullYear(), today.getMonth() - 1)
    setRightCalendarDate(currentMonth)
    setLeftCalendarDate(previousMonth)
  }

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg">
      <CardHeader className="pb-4">
        <p className="text-sm text-muted-foreground">{formatDateRange()}</p>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex border-t">
          {renderCalendar(leftCalendarDate, false)}
          <div className="w-px bg-border"></div>
          {renderCalendar(rightCalendarDate, true)}
        </div>
        <div className="border-t bg-muted/30 p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {quickRangeOptions.map((option) => (
                <Badge
                  key={option.key}
                  variant="secondary"
                  className="cursor-pointer hover:bg-secondary/80 transition-colors"
                  onClick={() => setQuickRange(option.key as any)}
                >
                  {option.label}
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleClear}
                disabled={!startDate && !endDate}
                className="min-w-[100px] bg-transparent"
              >
                Limpiar
              </Button>
              <Button
  onClick={handleApply}
  disabled={!hasChanges}
  className="min-w-[100px]"
>
  Aplicar
</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
