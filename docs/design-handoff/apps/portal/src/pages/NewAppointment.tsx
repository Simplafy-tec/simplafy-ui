import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown, X, CheckCircle, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PatientAutocomplete, type Patient } from '@/components/calendar/PatientAutocomplete';
import { useDoctors, useAvailableSlots } from '@/hooks/useDoctors';
import { useClinicServices } from '@/hooks/useClinicServices';
import { useCreateAppointment } from '@/hooks/useAppointments';
import { AppointmentSource } from '@simplafy/shared';
import { useMobileLayout } from '@/hooks';

/** Generate next 7 weekdays from today */
function getDateChips(): { label: string; day: number; date: string; full: Date }[] {
  const days: { label: string; day: number; date: string; full: Date }[] = [];
  const weekLabels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const d = new Date();
  for (let i = 0; i < 7; i++) {
    const curr = new Date(d);
    curr.setDate(d.getDate() + i);
    days.push({
      label: weekLabels[curr.getDay()],
      day: curr.getDate(),
      date: curr.toISOString().split('T')[0],
      full: curr,
    });
  }
  return days;
}

export const NewAppointment: React.FC = () => {
  const navigate = useNavigate();
  const { isMobile } = useMobileLayout();

  // Form state
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('');
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [doctorDropdownOpen, setDoctorDropdownOpen] = useState(false);

  // Data hooks
  const { data: doctorsData } = useDoctors();
  const doctors = useMemo(
    () => (doctorsData as any)?.data ?? (Array.isArray(doctorsData) ? doctorsData : []),
    [doctorsData]
  );
  const { data: services = [] } = useClinicServices();
  const { data: slots = [] } = useAvailableSlots(selectedDoctorId, selectedDate);
  const createAppointment = useCreateAppointment();

  const dateChips = useMemo(() => getDateChips(), []);

  // Selected doctor & service objects
  const selectedDoctor = doctors.find((d: any) => d.id === selectedDoctorId);
  const selectedService = (services as any[]).find((s: any) => s.id === selectedServiceId);
  const serviceDuration =
    selectedService?.default_duration || selectedService?.defaultDuration || 30;

  // Auto-select first doctor
  React.useEffect(() => {
    if (doctors.length > 0 && !selectedDoctorId) {
      setSelectedDoctorId((doctors[0] as any).id);
    }
  }, [doctors, selectedDoctorId]);

  // Build occupied set from slots
  const availableTimes = useMemo(() => {
    if (!slots || slots.length === 0) return [];
    // API returns slots as { start: "HH:mm", end: "HH:mm" } — use directly
    return (slots as any[]).map((s: any) => s.start as string);
  }, [slots]);

  const handleConfirm = () => {
    if (!selectedPatient || !selectedDoctorId || !selectedTime) return;

    // Build start/end from date + time
    const [h, m] = selectedTime.split(':').map(Number);
    const start = new Date(selectedDate);
    start.setHours(h, m, 0, 0);
    const end = new Date(start);
    end.setMinutes(end.getMinutes() + serviceDuration);

    createAppointment.mutate(
      {
        patient_id: selectedPatient.id,
        doctor_id: selectedDoctorId,
        start_time: start.toISOString(),
        end_time: end.toISOString(),
        source: AppointmentSource.PORTAL,
        notes: notes || undefined,
        send_confirmation: true,
      },
      {
        onSuccess: () => {
          navigate('/agenda');
        },
      }
    );
  };

  const canConfirm = selectedPatient && selectedDoctorId && selectedServiceId && selectedTime;

  return (
    <div className={cn('pb-6', isMobile ? '' : 'max-w-2xl')}>
      {/* Header */}
      {isMobile ? (
        <div className='flex items-center gap-2 h-[52px] px-3.5 border-b border-border mb-3'>
          <button onClick={() => navigate('/agenda')} className='p-1 text-foreground'>
            <ArrowLeft className='h-[18px] w-[18px]' />
          </button>
          <span className='text-[15px] font-semibold'>Novo Agendamento</span>
        </div>
      ) : (
        <div className='flex items-center gap-2.5 mb-4'>
          <Button variant='outline' size='sm' onClick={() => navigate('/agenda')}>
            <ArrowLeft className='h-3.5 w-3.5 mr-1' /> Voltar à agenda
          </Button>
          <span className='text-base font-bold'>Novo Agendamento</span>
        </div>
      )}

      <div className={cn(isMobile ? 'px-3.5' : '')}>
        {/* Paciente — autocomplete */}
        <div className='mb-3.5'>
          <div className='text-[13px] font-medium mb-1.5'>Paciente *</div>
          {selectedPatient ? (
            <div className='flex items-center gap-2 px-3 py-2.5 border border-primary rounded-lg bg-primary/5'>
              <div className='w-7 h-7 rounded-full bg-primary/20 text-primary text-[10px] font-bold flex items-center justify-center flex-shrink-0'>
                {selectedPatient.name
                  .split(' ')
                  .map(w => w.charAt(0))
                  .join('')
                  .toUpperCase()
                  .slice(0, 2)}
              </div>
              <div className='flex-1 min-w-0'>
                <span className='text-[13px] font-semibold'>{selectedPatient.name}</span>
                {selectedPatient.phone && (
                  <span className='text-[11px] text-muted-foreground ml-1.5'>
                    {selectedPatient.phone}
                  </span>
                )}
              </div>
              <button
                onClick={() => setSelectedPatient(null)}
                className='text-muted-foreground hover:text-foreground'
                title='Trocar paciente'
              >
                <X className='h-3.5 w-3.5' />
              </button>
            </div>
          ) : (
            <PatientAutocomplete
              value={null}
              onSelect={p => setSelectedPatient(p)}
              placeholder='Buscar paciente pelo nome...'
            />
          )}
        </div>

        {/* Profissional + Serviço — 2-col on desktop (Wireframe v1 renderNovaConsulta) */}
        <div className={cn('mb-3.5', !isMobile && 'grid grid-cols-2 gap-4')}>
          <div>
            <div className='text-[13px] font-medium mb-1.5'>Profissional *</div>
            <div className='relative'>
              <button
                onClick={() => setDoctorDropdownOpen(!doctorDropdownOpen)}
                className='w-full flex items-center gap-2 px-3 py-2.5 border border-border rounded-lg bg-card text-left'
              >
                {selectedDoctor && (
                  <div className='w-2 h-2 rounded-full flex-shrink-0 bg-primary' />
                )}
                <span className='text-[13px] flex-1'>
                  {selectedDoctor ? (selectedDoctor as any).name : 'Selecionar profissional'}
                </span>
                <ChevronDown className='h-3.5 w-3.5 text-muted-foreground' />
              </button>
              {doctorDropdownOpen && (
                <div className='absolute z-50 w-full mt-1 bg-card border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto'>
                  {doctors.map((doc: any) => (
                    <button
                      key={doc.id}
                      onClick={() => {
                        setSelectedDoctorId(doc.id);
                        setDoctorDropdownOpen(false);
                        setSelectedTime(''); // reset time on doctor change
                      }}
                      className={cn(
                        'w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-accent/50 text-[13px]',
                        doc.id === selectedDoctorId && 'bg-primary/10 font-medium'
                      )}
                    >
                      <div className='w-2 h-2 rounded-full bg-primary flex-shrink-0' />
                      {doc.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Serviço — pills inline */}
          <div className={isMobile ? 'mb-3.5' : ''}>
            <div className='text-[13px] font-medium mb-1.5'>Serviço *</div>
            <div className='flex gap-1.5 flex-wrap'>
              {(services as any[]).map((svc: any) => {
                const isSelected = svc.id === selectedServiceId;
                const dur = svc.default_duration || svc.defaultDuration || 30;
                return (
                  <button
                    key={svc.id}
                    onClick={() => setSelectedServiceId(svc.id)}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-[7px] rounded-full border text-[12px] whitespace-nowrap transition-colors',
                      isSelected
                        ? 'border-primary bg-primary/10 font-semibold text-primary'
                        : 'border-border bg-card hover:bg-accent/50'
                    )}
                  >
                    <span>{svc.name}</span>
                    <span className='text-[10px] text-muted-foreground opacity-70'>{dur}m</span>
                  </button>
                );
              })}
              {(services as any[]).length === 0 && (
                <p className='text-xs text-muted-foreground'>Nenhum serviço cadastrado.</p>
              )}
            </div>
          </div>
        </div>

        {/* Data e horário */}
        <div className='mb-3.5'>
          <div className='text-[13px] font-medium mb-2'>Data e horário *</div>

          {/* Date chips */}
          <div className='flex gap-2 mb-2.5 overflow-x-auto pb-1'>
            {dateChips.map(dc => {
              const isSelected = dc.date === selectedDate;
              return (
                <button
                  key={dc.date}
                  onClick={() => {
                    setSelectedDate(dc.date);
                    setSelectedTime('');
                  }}
                  className={cn(
                    'flex flex-col items-center px-3 py-1.5 rounded-lg border min-w-[48px] transition-colors',
                    isSelected
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-card hover:bg-accent/50'
                  )}
                >
                  <span
                    className={cn(
                      'text-[10px]',
                      isSelected ? 'text-primary' : 'text-muted-foreground'
                    )}
                  >
                    {dc.label}
                  </span>
                  <span
                    className={cn(
                      'text-sm font-bold',
                      isSelected ? 'text-primary' : 'text-foreground'
                    )}
                  >
                    {dc.day}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Time slots */}
          {selectedDoctorId ? (
            <>
              <div className='flex flex-wrap gap-1.5 mb-1'>
                {availableTimes.length === 0 && (
                  <p className='text-xs text-muted-foreground'>
                    Nenhum horário disponível para esta data.
                  </p>
                )}
                {availableTimes.map(time => {
                  const isSelected = time === selectedTime;
                  return (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={cn(
                        'px-2.5 py-1.5 rounded-md border text-[12px] font-medium transition-colors',
                        isSelected
                          ? 'border-primary bg-primary/10 text-primary font-semibold'
                          : 'border-border bg-card hover:bg-accent/50'
                      )}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <p className='text-xs text-muted-foreground'>
              Selecione um profissional para ver os horários.
            </p>
          )}
        </div>

        {/* Observações */}
        <div className='mb-3.5'>
          <div className='text-[13px] font-medium mb-1'>Observações (opcional)</div>
          <textarea
            placeholder='Anotações sobre esta consulta...'
            value={notes}
            onChange={e => setNotes(e.target.value)}
            className='w-full min-h-[60px] border border-border rounded-lg px-3 py-2.5 text-[13px] bg-background text-foreground resize-y outline-none focus:border-primary transition-colors'
          />
        </div>

        {/* WhatsApp info banner */}
        <div className='flex gap-2 items-start p-2.5 px-3 rounded-lg border border-success/20 bg-success/5 mb-4'>
          <Smartphone className='h-[13px] w-[13px] text-success flex-shrink-0 mt-0.5' />
          <div className='text-[11px] text-muted-foreground leading-relaxed'>
            O paciente receberá uma <strong>confirmação automática via WhatsApp</strong> após o
            agendamento. Se o agente estiver ativo, ele gerenciará o lembrete e a confirmação.
          </div>
        </div>

        {/* Actions */}
        <div className='flex gap-2'>
          <Button
            size='sm'
            disabled={!canConfirm || createAppointment.isPending}
            onClick={handleConfirm}
            className='gap-1.5'
          >
            <CheckCircle className='h-[13px] w-[13px]' />
            {createAppointment.isPending ? 'Agendando...' : 'Confirmar agendamento'}
          </Button>
          <Button variant='outline' size='sm' onClick={() => navigate('/agenda')}>
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewAppointment;
