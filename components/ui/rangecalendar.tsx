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
  const todayLocal = new Date()
  const localMaxDate = new Date(todayLocal.getFullYear(), todayLocal.getMonth(), todayLocal.getDate())
  const [endDate, setEndDate] = useState<Date | null>(initialEndDate)
  const [hoverDate, setHoverDate] = useState<Date | null>(null)

  const initialStartMs = initialStartDate?.getTime() ?? null
  const initialEndMs = initialEndDate?.getTime() ?? null
  const currentStartMs = startDate?.getTime() ?? null
  const currentEndMs = endDate?.getTime() ?? null
  const hasChanges = currentStartMs !== initialStartMs || currentEndMs !== initialEndMs

  const today = new Date()
  const currentMonth = new Date(today.getFullYear(), today.getMonth())
  const [rightCalendarDate, setRightCalendarDate] = useState<Date>(currentMonth)
  const [leftCalendarDate, setLeftCalendarDate] = useState<Date>(new Date(today.getFullYear(), today.getMonth() - 1))
  const [mobileActiveCalendar, setMobileActiveCalendar] = useState<"left" | "right">("right")

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

  const navigateMobileCalendar = (dir: "prev" | "next") => {
    if (mobileActiveCalendar === "left") {
      navigateLeftMonth(dir)
    } else {
      navigateRightMonth(dir)
    }
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

  const renderCalendar = (currentDate: Date, isRight = false, isMobileTablet = false) => {
    const cells = generateCalendarCells(currentDate)
    return (
      <div className={`${isMobileTablet ? "p-4 md:p-5" : "flex-1 p-6 lg:p-8"}`}>
        <div className={`flex items-center justify-between ${isMobileTablet ? "mb-4 md:mb-5" : "mb-6 lg:mb-8"}`}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              isMobileTablet
                ? navigateMobileCalendar("prev")
                : isRight
                  ? navigateRightMonth("prev")
                  : navigateLeftMonth("prev")
            }
            className={`${isMobileTablet ? "h-8 w-8 p-0 md:h-9 md:w-9" : "h-10 w-10 p-0"} hover:bg-muted`}
          >
            <ChevronLeft className={`${isMobileTablet ? "h-4 w-4" : "h-5 w-5"}`} />
          </Button>
          <h2 className={`${isMobileTablet ? "text-base md:text-lg" : "text-xl"} font-semibold text-foreground`}>
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              isMobileTablet
                ? navigateMobileCalendar("next")
                : isRight
                  ? navigateRightMonth("next")
                  : navigateLeftMonth("next")
            }
            className={`${isMobileTablet ? "h-8 w-8 p-0 md:h-9 md:w-9" : "h-10 w-10 p-0"} hover:bg-muted`}
            disabled={
              isRight || (isMobileTablet && mobileActiveCalendar === "right")
                ? currentDate.getFullYear() >= currentMonth.getFullYear() &&
                  currentDate.getMonth() >= currentMonth.getMonth()
                : currentDate.getFullYear() >= currentMonth.getFullYear() &&
                  currentDate.getMonth() >= currentMonth.getMonth() - 1
            }
          >
            <ChevronRight className={`${isMobileTablet ? "h-4 w-4" : "h-5 w-5"}`} />
          </Button>
        </div>
        <div className={`grid grid-cols-7 gap-1 ${isMobileTablet ? "mb-3 md:mb-4" : "mb-4"}`}>
          {dayNames.map((dn) => (
            <div key={dn} className={`${isMobileTablet ? "h-8 md:h-10" : "h-12"} flex items-center justify-center`}>
              <span className={`${isMobileTablet ? "text-sm" : "text-base"} font-medium text-muted-foreground`}>
                {dn}
              </span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {cells.map(({ date, isCurrent }, idx) => {
            const isStart = isCurrent && isStartDate(date)
            const isEnd = isCurrent && isEndDate(date)
            const inRange = isCurrent && isInRange(date)
            const inHover = isCurrent && isInHoverRange(date)
            const isDisabled = localMaxDate ? date > localMaxDate : false
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
                  ${isMobileTablet ? "h-8 w-8 md:h-10 md:w-10 p-0 text-sm" : "h-12 w-12 p-0 text-base"}
                   font-normal transition-all duration-200 relative
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
                  ${isToday && !isStart && !isEnd && isCurrent ? "ring-1 ring-primary ring-offset-1" : ""}
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

  const currentMobileDate = mobileActiveCalendar === "left" ? leftCalendarDate : rightCalendarDate

  return (
    <Card className="w-full max-w-5xl mx-auto shadow-lg">
      <CardHeader className="pb-3 lg:pb-4">
        <p className="text-sm lg:text-base text-muted-foreground">{formatDateRange()}</p>
      </CardHeader>
      <CardContent className="p-0">

        <div className="lg:hidden border-t">
          <div className="flex border-b bg-muted/20">
            <button
              onClick={() => setMobileActiveCalendar("left")}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                mobileActiveCalendar === "left"
                  ? "bg-background text-foreground border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {monthNames[leftCalendarDate.getMonth()]} {leftCalendarDate.getFullYear()}
            </button>
            <button
              onClick={() => setMobileActiveCalendar("right")}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                mobileActiveCalendar === "right"
                  ? "bg-background text-foreground border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {monthNames[rightCalendarDate.getMonth()]} {rightCalendarDate.getFullYear()}
            </button>
          </div>
          {renderCalendar(currentMobileDate, mobileActiveCalendar === "right", true)}
        </div>

        <div className="hidden lg:flex border-t">
          {renderCalendar(leftCalendarDate, false)}
          <div className="w-px bg-border"></div>
          {renderCalendar(rightCalendarDate, true)}
        </div>

        <div className="border-t bg-muted/30 p-4 lg:p-6">
          <div className="flex flex-col gap-4 lg:gap-5">
            <div className="flex flex-wrap gap-2">
              {quickRangeOptions.map((option) => (
                <Badge
                  key={option.key}
                  variant="outline"
                  className="cursor-pointer hover:bg-primary/10 hover:text-primary hover:border-primary/50 transition-colors text-sm px-3 py-1.5 border-muted-foreground/20"
                  onClick={() => setQuickRange(option.key as any)}
                >
                  {option.label}
                </Badge>
              ))}
            </div>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={handleClear}
                disabled={!startDate && !endDate}
                className="min-w-[100px] lg:min-w-[120px] text-sm h-9 lg:h-10 bg-transparent"
              >
                Limpiar
              </Button>
              <Button
                onClick={handleApply}
                disabled={!hasChanges}
                size="sm"
                className="min-w-[100px] lg:min-w-[120px] text-sm h-9 lg:h-10"
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
