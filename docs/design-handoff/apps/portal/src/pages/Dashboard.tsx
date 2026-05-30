import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Users, Star } from 'lucide-react';
import { AppointmentStatus } from '@simplafy/shared';
import type { Appointment } from '@simplafy/shared';
import { Badge, StatsCard, Avatar, AvatarFallback } from '@/components/ui';
import { cn } from '@/lib/utils';
import {
  usePermissions,
  useAppointments,
  useDashboardKPIs,
  useDashboardGestora,
  useRealtimeUpdates,
  useMobileLayout,
} from '@/hooks';
import { useChats } from '@/hooks/useChat';
import { AttendanceStatusCard, AlertsCard, DoctorOccupancyChart } from '@/components/dashboard';

/** API pode incluir relações e campos extras (ex.: service_name) */
type DashboardAppointment = Appointment & {
  patient?: { name?: string | null };
  doctor?: { name?: string | null };
  service_name?: string | null;
};

const TodaySchedule: React.FC = () => {
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();
  const canViewPatients = hasPermission('view_patients');

  const today = new Date().toISOString().split('T')[0];
  const { data: appts = [], isLoading } = useAppointments({ date: today });

  const openPatient = (appointment: DashboardAppointment) => {
    if (!canViewPatients || !appointment.patient_id) return;
    navigate(`/pacientes?id=${encodeURIComponent(appointment.patient_id)}`);
  };

  const getStatusBadge = (status: 'confirmed' | 'pending' | 'cancelled') => {
    switch (status) {
      case 'confirmed':
        return <Badge variant='success'>Confirmada</Badge>;
      case 'pending':
        return <Badge variant='secondary'>Pendente</Badge>;
      case 'cancelled':
        return <Badge variant='destructive'>Cancelada</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className='bg-card border border-border rounded-xl p-3.5'>
      <div className='text-[13px] font-semibold mb-2.5'>Próximas consultas — hoje</div>
      {isLoading && <p className='text-xs text-muted-foreground'>Carregando...</p>}
      {!isLoading && appts.length === 0 && (
        <p className='text-xs text-muted-foreground'>Nenhuma consulta para hoje.</p>
      )}
      {!isLoading &&
        appts.slice(0, 5).map((appointment: DashboardAppointment) => {
          const clickable = canViewPatients && Boolean(appointment.patient_id);
          return (
            <div
              key={appointment.id}
              role={clickable ? 'button' : undefined}
              tabIndex={clickable ? 0 : undefined}
              onClick={() => clickable && openPatient(appointment)}
              onKeyDown={e => {
                if (!clickable) return;
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  openPatient(appointment);
                }
              }}
              className={cn(
                'flex gap-2 p-2.5 px-3 bg-background border border-border rounded-xl transition-colors mb-1.5',
                clickable
                  ? 'cursor-pointer hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                  : 'cursor-default'
              )}
              aria-label={
                clickable
                  ? `Abrir paciente ${appointment.patient?.name || 'paciente'} em Pacientes`
                  : undefined
              }
            >
              <div className='text-[11px] text-muted-foreground w-9 flex-shrink-0 pt-0.5 text-right'>
                {appointment.start_time
                  ? new Date(appointment.start_time).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : ''}
              </div>
              <div className='w-[3px] rounded-sm flex-shrink-0 self-stretch bg-primary' />
              <div className='flex-1 min-w-0'>
                <div className='text-[13px] font-medium'>{appointment.patient?.name || '-'}</div>
                <div className='text-[11px] text-muted-foreground mt-0.5'>
                  {appointment.service_name || 'Consulta'} ·{' '}
                  {appointment.doctor?.name || 'Profissional'}
                </div>
              </div>
              {getStatusBadge(
                appointment.status === AppointmentStatus.CONFIRMED
                  ? 'confirmed'
                  : appointment.status === AppointmentStatus.CANCELLED
                    ? 'cancelled'
                    : 'pending'
              )}
            </div>
          );
        })}
    </div>
  );
};

/** Wireframe v1 D3: Enriched bottom cards — unread chats + reminders with progress */
const DashboardBottomCards: React.FC<{ kpis: any }> = ({ kpis }) => {
  const { data: chatsData } = useChats(undefined, undefined, 1, 5);
  const chats: any[] = Array.isArray(chatsData) ? chatsData : ((chatsData as any)?.data ?? []);
  const unreadChats = chats.filter((c: any) => c.unread_count > 0);

  const getInitials = (name?: string) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((w: string) => w.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const totalReminders = kpis?.confirmed_appointments || 0;
  const confirmedPct =
    totalReminders > 0
      ? Math.min(
          100,
          Math.round(
            (totalReminders / Math.max(totalReminders + (kpis?.pending_appointments || 0), 1)) * 100
          )
        )
      : 0;

  return (
    <div className='grid gap-3 md:grid-cols-2'>
      <div className='bg-card border border-border rounded-xl p-3.5'>
        <div className='text-[13px] font-semibold mb-2.5'>Mensagens não lidas</div>
        {unreadChats.length === 0 ? (
          <p className='text-xs text-muted-foreground'>Nenhuma mensagem não lida.</p>
        ) : (
          unreadChats.slice(0, 4).map((chat: any) => (
            <div
              key={chat.id}
              className='flex items-center gap-2.5 p-2 rounded-lg hover:bg-accent/50 cursor-pointer mb-1'
            >
              <Avatar className='h-[34px] w-[34px] flex-shrink-0'>
                <AvatarFallback className='bg-primary/15 text-primary text-[11px] font-bold'>
                  {getInitials(chat.contact_name)}
                </AvatarFallback>
              </Avatar>
              <div className='flex-1 min-w-0'>
                <div className='text-[13px] font-medium truncate'>
                  {chat.contact_name || chat.contact_phone}
                </div>
                <div className='text-[11px] text-muted-foreground truncate mt-0.5'>
                  {typeof chat.last_message === 'string'
                    ? chat.last_message
                    : chat.last_message?.body || ''}
                </div>
              </div>
              {chat.unread_count > 0 && (
                <span className='w-[18px] h-[18px] rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center flex-shrink-0'>
                  {chat.unread_count}
                </span>
              )}
            </div>
          ))
        )}
      </div>
      <div className='bg-card border border-border rounded-xl p-3.5'>
        <div className='text-[13px] font-semibold mb-2.5'>Lembretes disparados hoje</div>
        <div className='text-[22px] font-bold text-primary'>
          {totalReminders + (kpis?.pending_appointments || 0)}
        </div>
        <div className='text-[11px] text-muted-foreground'>
          enviados · {totalReminders} confirmados ({confirmedPct}%)
        </div>
        <div className='mt-2.5 h-1.5 rounded-full bg-border overflow-hidden'>
          <div
            className='h-full rounded-full bg-primary transition-all'
            style={{ width: `${confirmedPct}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export const Dashboard: React.FC = () => {
  const { hasPermission } = usePermissions();
  const { isMobile } = useMobileLayout();
  const { data: kpis } = useDashboardKPIs();
  const { data: gestora, isLoading: gestoraLoading } = useDashboardGestora();

  // Ativar atualizações em tempo real
  useRealtimeUpdates();

  const canViewMetrics = hasPermission('view_dashboard');
  const canViewPatients = hasPermission('view_patients');
  const canViewAppointments = hasPermission('view_appointments');

  return (
    <div className='space-y-4'>
      {/* Alertas */}
      {canViewMetrics && gestora?.alerts && gestora.alerts.length > 0 && (
        <AlertsCard alerts={gestora.alerts} loading={gestoraLoading} />
      )}

      {/* KPIs — Wireframe v1: 4 stat boxes, 2×2 mobile, 4 cols desktop */}
      {canViewMetrics && (
        <div className={cn('grid grid-cols-2 lg:grid-cols-4', isMobile ? 'gap-2' : 'gap-3')}>
          <StatsCard
            title='Consultas hoje'
            value={kpis?.appointments_today?.toString() || '0'}
            description={`${kpis?.total_appointments || 0} total este mês`}
            icon={<Calendar className='h-5 w-5' />}
            valueClassName='text-primary'
            compact={isMobile}
          />
          {canViewPatients && (
            <StatsCard
              title='Pacientes ativos'
              value={kpis?.total_patients?.toString() || '0'}
              description='cadastrados'
              icon={<Users className='h-5 w-5' />}
              compact={isMobile}
            />
          )}
          <StatsCard
            title='Aguardando confirmação'
            value={kpis?.pending_appointments?.toString() || '0'}
            description='pendentes hoje'
            icon={<Clock className='h-5 w-5' />}
            valueClassName='text-warning'
            compact={isMobile}
          />
          <StatsCard
            title='NPS médio'
            value={(kpis as any)?.nps_average?.toFixed(1) ?? '—'}
            description='este mês'
            icon={<Star className='h-5 w-5' />}
            valueClassName='text-secondary'
            compact={isMobile}
          />
        </div>
      )}

      {/* Próximas consultas — Wireframe v1 */}
      {canViewAppointments && <TodaySchedule />}

      {/* Desktop 2-col: Mensagens + Lembretes (Wireframe v1 D3) */}
      {!isMobile && <DashboardBottomCards kpis={kpis} />}

      {/* Métricas avançadas — abaixo do fold */}
      {canViewMetrics && (
        <div className={cn(isMobile ? 'space-y-4' : 'grid gap-3 md:grid-cols-2')}>
          {gestora?.attendance_status && (
            <AttendanceStatusCard data={gestora.attendance_status} loading={gestoraLoading} />
          )}
          {/* Ocupação da Agenda por Profissional — movido para cá (antes ficava isolado abaixo) */}
          {!isMobile && gestora?.doctor_occupancy && (
            <DoctorOccupancyChart data={gestora.doctor_occupancy} loading={gestoraLoading} />
          )}
          {/* Faturamento do Mês — oculto até liberação da frente financeira (Saude#10.1) */}
        </div>
      )}
    </div>
  );
};
