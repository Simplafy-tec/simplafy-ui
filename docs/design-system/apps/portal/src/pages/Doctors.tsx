import { useState, lazy, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/ui';
import { Plus, Stethoscope, Loader2 } from 'lucide-react';
import { usePermissions } from '@/hooks/usePermissions';
import { useMobileLayout } from '@/hooks';
import { DesktopOnlyBanner } from '@/components/layout/DesktopOnlyBanner';
import { DoctorsTable } from '@/components/doctors/DoctorsTable';
import { useDoctors } from '@/hooks/useDoctors';
import { SkeletonGrid, ErrorState, EmptyState } from '@/components/ui/page-loading-states';
import type { Doctor, DoctorFilters } from '@/services/doctorsService';

// Lazy load modals for better performance
const CreateDoctorModal = lazy(() =>
  import('@/components/doctors/CreateDoctorModal').then(m => ({ default: m.CreateDoctorModal }))
);
const EditDoctorModal = lazy(() =>
  import('@/components/doctors/EditDoctorModal').then(m => ({ default: m.EditDoctorModal }))
);
const ManageEntityScheduleModal = lazy(() =>
  import('@/components/shared').then(m => ({ default: m.ManageEntityScheduleModal }))
);
const DoctorDetailsModal = lazy(() =>
  import('@/components/doctors/DoctorDetailsModal').then(m => ({ default: m.DoctorDetailsModal }))
);

export default function Doctors() {
  const { isMobile } = useMobileLayout();
  const { canCreate, canDelete: _canDelete, hasPermission } = usePermissions();
  const canEdit = hasPermission('view_doctors');

  // All hooks must be called before any conditional return
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isManageScheduleModalOpen, setIsManageScheduleModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const [filters, setFilters] = useState<DoctorFilters>({
    page: 1,
    limit: 10,
    includeRelations: true,
    isActive: true,
  });

  const { data: doctorsResponse, isLoading, error, refetch } = useDoctors(filters);

  if (isMobile) {
    return (
      <DesktopOnlyBanner
        featureName='Gestão de Profissionais'
        description='A gestão completa de profissionais requer uma tela maior.'
      />
    );
  }
  const doctors = doctorsResponse?.data || [];
  const totalDoctors = doctorsResponse?.total || 0;
  const pagination = {
    page: doctorsResponse?.page || 1,
    limit: doctorsResponse?.limit || 10,
    totalPages: doctorsResponse?.totalPages || 1,
  };

  // Handlers para ações
  const handleCreateDoctor = () => {
    setIsCreateModalOpen(true);
  };

  const handleEditDoctor = (doctor: Doctor) => {
    setIsDetailsModalOpen(false);
    setSelectedDoctor(doctor);
    setIsEditModalOpen(true);
  };

  const handleViewDetails = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsDetailsModalOpen(true);
  };

  const handleManageSchedule = (doctor: Doctor) => {
    setIsDetailsModalOpen(false);
    setSelectedDoctor(doctor);
    setIsManageScheduleModalOpen(true);
  };

  const handlePaginationChange = (page: number, limit: number) => {
    setFilters(prev => ({ ...prev, page, limit }));
  };

  // Estados de carregamento e erro
  if (isLoading && !doctors.length) {
    return (
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-xl font-bold flex items-center gap-2'>
              <Stethoscope className='w-5 h-5' />
              Profissionais
            </h1>
            <p className='text-muted-foreground'>
              Profissionais, especialidades e configuração de agendas
            </p>
          </div>
        </div>
        <SkeletonGrid count={6} cols={3} />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        message='Erro ao carregar profissionais. Verifique sua conexão.'
        onRetry={refetch}
      />
    );
  }

  if (isMobile) {
    return (
      <DesktopOnlyBanner
        featureName='Profissionais'
        description='Gestão de profissionais e agendas disponível apenas no desktop.'
      />
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-xl font-bold flex items-center gap-2'>
            <Stethoscope className='w-5 h-5' />
            Profissionais
          </h1>
          <p className='text-muted-foreground'>
            Profissionais, especialidades e configuração de agendas
          </p>
        </div>
        {canCreate && (
          <Button variant='success' onClick={handleCreateDoctor} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            ) : (
              <Plus className='mr-2 h-4 w-4' />
            )}
            Novo Profissional
          </Button>
        )}
      </div>

      {/* Filtros */}
      <div className='w-full md:w-96'>
        <SearchInput
          value={filters.search || ''}
          onChange={value => {
            setFilters(prev => ({ ...prev, search: value || undefined, page: 1 }));
          }}
          placeholder='Buscar por nome ou registro profissional...'
        />
      </div>

      {/* Resumo dos resultados */}
      {!isLoading && totalDoctors > 0 && (
        <div className='text-sm text-muted-foreground'>
          Mostrando {doctors.length} de {totalDoctors} profissionais
        </div>
      )}

      {/* Tabela de profissionais */}
      {!isLoading && doctors.length === 0 ? (
        <EmptyState
          icon={Stethoscope}
          title='Nenhum profissional encontrado'
          description={
            filters.search
              ? 'Tente ajustar a busca'
              : 'Comece cadastrando seu primeiro profissional'
          }
          action={
            canCreate && !filters.search ? (
              <Button variant='success' onClick={handleCreateDoctor}>
                <Plus className='mr-2 h-4 w-4' />
                Novo Profissional
              </Button>
            ) : undefined
          }
        />
      ) : (
        <DoctorsTable
          data={doctors}
          total={totalDoctors}
          isLoading={isLoading}
          error={error}
          pagination={pagination}
          onPaginationChange={handlePaginationChange}
          onEdit={canEdit ? handleEditDoctor : undefined}
          onViewDetails={handleViewDetails}
          onManageSchedule={hasPermission('view_doctors') ? handleManageSchedule : undefined}
        />
      )}

      {/* Modais com Suspense para lazy loading */}
      {isCreateModalOpen && (
        <Suspense fallback={null}>
          <CreateDoctorModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onSuccess={() => {
              setIsCreateModalOpen(false);
            }}
          />
        </Suspense>
      )}

      {isEditModalOpen && (
        <Suspense fallback={null}>
          <EditDoctorModal
            isOpen={isEditModalOpen}
            doctor={selectedDoctor}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedDoctor(null);
            }}
            onSuccess={() => {
              setIsEditModalOpen(false);
              setSelectedDoctor(null);
            }}
          />
        </Suspense>
      )}

      {isManageScheduleModalOpen && (
        <Suspense fallback={null}>
          <ManageEntityScheduleModal
            entity={selectedDoctor}
            entityType='doctor'
            isOpen={isManageScheduleModalOpen}
            onClose={() => {
              setIsManageScheduleModalOpen(false);
              setSelectedDoctor(null);
            }}
            onSuccess={() => {
              setIsManageScheduleModalOpen(false);
              setSelectedDoctor(null);
            }}
          />
        </Suspense>
      )}

      {isDetailsModalOpen && (
        <Suspense fallback={null}>
          <DoctorDetailsModal
            open={isDetailsModalOpen}
            onOpenChange={setIsDetailsModalOpen}
            doctorId={selectedDoctor?.id}
            onEdit={canEdit ? handleEditDoctor : undefined}
            onManageSchedule={hasPermission('view_doctors') ? handleManageSchedule : undefined}
          />
        </Suspense>
      )}
    </div>
  );
}
