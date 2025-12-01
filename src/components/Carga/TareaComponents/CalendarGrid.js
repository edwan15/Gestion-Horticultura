import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { colors, spacing, borderRadius, shadows } from '../../../styles/designSystem';

/**
 * CalendarGrid - Calendario modernizado con diseño empresarial
 * Muestra la cuadrícula del mes con eventos y datos diarios
 */
const CalendarGrid = ({
  currentDate,
  navigateMonth,
  handleDayClick,
  selectedCalendarId,
  calendars,
  events,
  dailyData,
}) => {
  const DAYS_OF_WEEK = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const MONTHS = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
  ];

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  // Generar días del calendario
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = [];
  const prevMonthDaysTotal = new Date(year, month, 0).getDate();
  const startDay = prevMonthDaysTotal - firstDayOfMonth + 1;

  // Días del mes anterior
  for (let i = startDay; i <= prevMonthDaysTotal; i++) {
    if (i > prevMonthDaysTotal - firstDayOfMonth) {
      const fullDate = new Date(year, month - 1, i);
      days.push({
        key: `prev-${i}`,
        day: i,
        isCurrentMonth: false,
        fullDate,
        dateKey: formatDate(fullDate),
        events: [],
      });
    }
  }

  // Días del mes actual
  for (let i = 1; i <= daysInMonth; i++) {
    const fullDate = new Date(year, month, i);
    const dateKey = formatDate(fullDate);
    days.push({
      key: `curr-${i}`,
      day: i,
      isCurrentMonth: true,
      fullDate,
      dateKey,
      events: events[dateKey] || [],
    });
  }

  // Días del mes siguiente
  let nextDay = 1;
  while (days.length < 42) {
    const fullDate = new Date(year, month + 1, nextDay);
    days.push({
      key: `next-${nextDay}`,
      day: nextDay,
      isCurrentMonth: false,
      fullDate,
      dateKey: formatDate(fullDate),
      events: [],
    });
    nextDay++;
  }

  const today = formatDate(new Date());
  const selectedCalendarColor =
    calendars.find((c) => c.id === selectedCalendarId)?.color || colors.primary[600];

  if (!selectedCalendarId) {
    return (
      <div
        style={{
          background: 'white',
          padding: spacing.xl,
          borderRadius: borderRadius.xl,
          boxShadow: shadows.lg,
          textAlign: 'center',
        }}
      >
        <p style={{ color: colors.neutral[600], fontSize: '1.125rem' }}>
          Selecciona o crea un registro para ver el calendario
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        background: 'white',
        padding: spacing.lg,
        borderRadius: borderRadius.xl,
        boxShadow: shadows.lg,
        border: `1px solid ${colors.neutral[200]}`,
      }}
    >
      {/* Navegación del mes */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: spacing.lg,
          padding: spacing.md,
          background: `linear-gradient(135deg, ${colors.primary[50]} 0%, ${colors.secondary[50]} 100%)`,
          borderRadius: borderRadius.lg,
        }}
      >
        <button
          onClick={() => navigateMonth(-1)}
          style={{
            padding: spacing.sm,
            background: 'white',
            border: 'none',
            borderRadius: borderRadius.full,
            cursor: 'pointer',
            boxShadow: shadows.sm,
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = colors.primary[100];
            e.currentTarget.style.boxShadow = shadows.md;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'white';
            e.currentTarget.style.boxShadow = shadows.sm;
          }}
        >
          <ChevronLeft size={24} color={colors.primary[700]} />
        </button>

        <h2
          style={{
            fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
            fontWeight: '800',
            color: colors.neutral[900],
            textAlign: 'center',
          }}
        >
          {MONTHS[month]} {year}
        </h2>

        <button
          onClick={() => navigateMonth(1)}
          style={{
            padding: spacing.sm,
            background: 'white',
            border: 'none',
            borderRadius: borderRadius.full,
            cursor: 'pointer',
            boxShadow: shadows.sm,
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = colors.primary[100];
            e.currentTarget.style.boxShadow = shadows.md;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'white';
            e.currentTarget.style.boxShadow = shadows.sm;
          }}
        >
          <ChevronRight size={24} color={colors.primary[700]} />
        </button>
      </div>

      {/* Cabecera de días de la semana */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: spacing.xs,
          marginBottom: spacing.md,
        }}
      >
        {DAYS_OF_WEEK.map((day) => (
          <div
            key={day}
            style={{
              padding: spacing.sm,
              textAlign: 'center',
              fontWeight: '700',
              fontSize: '0.875rem',
              color: colors.neutral[700],
              background: colors.neutral[100],
              borderRadius: borderRadius.md,
            }}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Cuadrícula de días */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: spacing.xs,
        }}
      >
        {days.map((dayObj) => {
          const isToday = dayObj.dateKey === today;
          const dayEvents = dayObj.events || [];
          const eventCount = dayEvents.length;
          
          // Calcular total del día
          const dailyTotal = dayEvents.reduce((sum, event) => sum + (event.result || 0), 0);
          
          // Obtener costo por unidad del día
          const dayCosts = dailyData?.[dayObj.dateKey];
          const costPerUnit = dayCosts?.costPerUnit || 0;

          return (
            <div
              key={dayObj.key}
              onClick={() => dayObj.isCurrentMonth && handleDayClick(dayObj.fullDate)}
              style={{
                minHeight: '100px',
                padding: spacing.sm,
                background: dayObj.isCurrentMonth
                  ? isToday
                    ? colors.primary[50]
                    : 'white'
                  : colors.neutral[50],
                border: `2px solid ${
                  isToday ? colors.primary[400] : colors.neutral[200]
                }`,
                borderRadius: borderRadius.lg,
                cursor: dayObj.isCurrentMonth ? 'pointer' : 'default',
                transition: 'all 0.2s',
                opacity: dayObj.isCurrentMonth ? 1 : 0.5,
                display: 'flex',
                flexDirection: 'column',
                gap: spacing.xs,
              }}
              onMouseEnter={(e) => {
                if (dayObj.isCurrentMonth) {
                  e.currentTarget.style.boxShadow = shadows.md;
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.borderColor = colors.primary[400];
                }
              }}
              onMouseLeave={(e) => {
                if (dayObj.isCurrentMonth) {
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = isToday
                    ? colors.primary[400]
                    : colors.neutral[200];
                }
              }}
            >
              {/* Número del día */}
              <div
                style={{
                  fontSize: '1rem',
                  fontWeight: '700',
                  color: dayObj.isCurrentMonth
                    ? isToday
                      ? colors.primary[700]
                      : colors.neutral[900]
                    : colors.neutral[400],
                }}
              >
                {dayObj.day}
              </div>

              {/* Indicador de eventos */}
              {eventCount > 0 && (
                <div
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    color: 'white',
                    background: selectedCalendarColor,
                    padding: `${spacing.xs} ${spacing.sm}`,
                    borderRadius: borderRadius.full,
                    textAlign: 'center',
                  }}
                >
                  {eventCount} {eventCount === 1 ? 'evento' : 'eventos'}
                </div>
              )}

              {/* Total del día */}
              {dailyTotal > 0 && (
                <div
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    color: colors.success[700],
                    background: colors.success[50],
                    padding: spacing.xs,
                    borderRadius: borderRadius.md,
                    textAlign: 'center',
                  }}
                >
                  Total: {dailyTotal.toFixed(2)}
                </div>
              )}

              {/* Costo por unidad */}
              {costPerUnit > 0 && (
                <div
                  style={{
                    fontSize: '0.7rem',
                    color: colors.neutral[600],
                    background: colors.neutral[100],
                    padding: spacing.xs,
                    borderRadius: borderRadius.sm,
                    textAlign: 'center',
                  }}
                >
                  ${costPerUnit.toFixed(2)}/u
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarGrid;
