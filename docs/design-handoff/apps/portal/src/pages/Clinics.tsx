import { useState, lazy, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/ui';
import { Plus, Hospital, Loader2 } from 'lucide-react';
import { usePermissions } from '@/hooks/usePermissions';
import { useClinics, useCreateClinic, useUpdateClinic, useDeleteClinic } from '@/hooks/useClinics';
import { useTenantLabels } from '@/hooks/useTenantLabels';
import { ClinicCard } from '@/components/clinics/ClinicCard';
import { SkeletonGrid, ErrorState, EmptyState } from '@/components/ui/page-loading-states';
import type {
  Clinic,
  ClinicFilters,
  CreateClinicRequest,
  UpdateClinicRequest,
} from '@/services/clinicsService';

// Lazy load modals for better performance
const CreateClinicModal = lazy(() =>
  import('@/components/clinics/CreateClinicModal').then(m => ({ default: m.CreateClinicModal }))
);
const EditClinicModal = lazy(() =>
  import('@/components/clinics/EditClinicModal').then(m => ({ default: m.EditClinicModal }))
);
const LinkInstancesModal = lazy(() =>
  import('@/components/clinics/LinkInstancesModal').then(m => ({ default: m.LinkInstancesModal }))
);
const LinkDoctorsModal = lazy(() =>
  import('@/components/clinics/LinkDoctorsModal').then(m => ({ default: m.LinkDoctorsModal }))
);
export default function Clinics() {
  const { canCreate, canDelete, hasPermission } = usePermissions();
  const canEdit = hasPermission('manage_clinic_settings');
  const { labels, isPF } = useTenantLabels();

  // Estados dos modais
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLinkInstancesModalOpen, setIsLinkInstancesModalOpen] = useState(false);
  const [isLinkDoctorsModalOpen, setIsLinkDoctorsModalOpen] = useState(false);

  // Estados dos filtros
  const [filters, setFilters] = useState<ClinicFilters>({
    page: 1,
    limit: 10,
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Hooks de dados
  const { data: clinicsResponse, isLoading, error, refetch } = useClinics(filters);
  const createClinicMutation = useCreateClinic();
  const updateClinicMutation = useUpdateClinic();
  const deleteClinicMutation = useDeleteClinic();

  const clinics = clinicsResponse?.data || [];

  const handleCreateClinic = async (data: CreateClinicRequest) => {
    try {
      await createClinicMutation.mutateAsync(data);
      setIsCreateModalOpen(false);
    } catch (_error) {
      // Error handling is done in the mutation
    }
  };

  const handleEditClinic = async (id: string, updates: UpdateClinicRequest) => {
    try {
      await updateClinicMutation.mutateAsync({ id, updates });
      setIsEditModalOpen(false);
      setSelectedClinic(null);
    } catch (_error) {
      // Error handling is done in the mutation
    }
  };

  const handleDeleteClinic = async (clinicId: string) => {
    if (
      window.confirm(
        `Tem certeza que deseja excluir ${labels.placeArticle}? Esta ação não pode ser desfeita.`
      )
    ) {
      try {
        await deleteClinicMutation.mutateAsync({ id: clinicId });
      } catch (_error) {
        // Error handling is done in the mutation
      }
    }
  };

  const handleLinkInstances = (clinic: Clinic) => {
    setSelectedClinic(clinic);
    setIsLinkInstancesModalOpen(true);
  };

  const handleLinkDoctors = (clinic: Clinic) => {
    setSelectedClinic(clinic);
    setIsLinkDoctorsModalOpen(true);
  };

  const handleEdit = (clinic: Clinic) => {
    setSelectedClinic(clinic);
    setIsEditModalOpen(true);
  };

  // Estados de carregamento e erro
  if (isLoading) {
    return (
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-xl font-bold flex items-center gap-2'>
              <Hospital className='w-5 h-5' />
              {labels.Places}
            </h1>
            <p className='text-muted-foreground'>
              {`Gerencie ${labels.places}, vincule profissionais e canais WhatsApp`}
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
        message={`Erro ao carregar ${labels.places}. Verifique sua conexão.`}
        onRetry={refetch}
      />
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-xl font-bold flex items-center gap-2'>
            <Hospital className='w-5 h-5' />
            {labels.Places}
          </h1>
          <p className='text-muted-foreground'>
            {`Gerencie ${labels.places}, vincule profissionais e canais WhatsApp`}
          </p>
        </div>
        {canCreate && (
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            disabled={createClinicMutation.isPending}
          >
            {createClinicMutation.isPending ? (
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            ) : (
              <Plus className='mr-2 h-4 w-4' />
            )}
            {isPF ? `Novo ${labels.Place}` : `Nova ${labels.Place}`}
          </Button>
        )}
      </div>

      {/* Filtros */}
      <div className='w-full md:w-96'>
        <SearchInput
          value={searchTerm}
          onChange={value => {
            setSearchTerm(value);
            setFilters(prev => ({ ...prev, search: value || undefined, page: 1 }));
          }}
          placeholder={`Buscar ${labels.places} por nome...`}
        />
      </div>

      {/* Lista de Clínicas ou Estado Vazio */}
      {clinics.length === 0 ? (
        <EmptyState
          icon={Hospital}
          title={`Nenhum${isPF ? '' : 'a'} ${labels.place} encontrad${isPF ? 'o' : 'a'}`}
          description={
            searchTerm || filters.search
              ? 'Tente ajustar a busca'
              : `Comece criando ${isPF ? 'seu primeiro' : 'sua primeira'} ${labels.place}`
          }
          action={
            canCreate && !searchTerm && !filters.search ? (
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                disabled={createClinicMutation.isPending}
              >
                {createClinicMutation.isPending ? (
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                ) : (
                  <Plus className='mr-2 h-4 w-4' />
                )}
                {isPF ? `Novo ${labels.Place}` : `Nova ${labels.Place}`}
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {clinics.map(clinic => (
            <ClinicCard
              key={clinic.id}
              clinic={clinic}
              onEdit={canEdit ? () => handleEdit(clinic) : undefined}
              onDelete={canDelete ? () => handleDeleteClinic(clinic.id) : undefined}
              onLinkInstances={() => handleLinkInstances(clinic)}
              onLinkDoctors={() => handleLinkDoctors(clinic)}
              isDeleting={deleteClinicMutation.isPending}
            />
          ))}
        </div>
      )}

      {/* Modals com Suspense para lazy loading */}
      {isCreateModalOpen && (
        <Suspense fallback={null}>
          <CreateClinicModal
            open={isCreateModalOpen}
            onOpenChange={setIsCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onSubmit={handleCreateClinic}
          />
        </Suspense>
      )}

      {isEditModalOpen && (
        <Suspense fallback={null}>
          <EditClinicModal
            clinic={selectedClinic}
            open={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedClinic(null);
            }}
            onSubmit={handleEditClinic}
          />
        </Suspense>
      )}

      {isLinkInstancesModalOpen && (
        <Suspense fallback={null}>
          <LinkInstancesModal
            clinic={selectedClinic}
            open={isLinkInstancesModalOpen}
            onClose={() => {
              setIsLinkInstancesModalOpen(false);
              setSelectedClinic(null);
            }}
          />
        </Suspense>
      )}

      {isLinkDoctorsModalOpen && (
        <Suspense fallback={null}>
          <LinkDoctorsModal
            clinic={selectedClinic}
            open={isLinkDoctorsModalOpen}
            onClose={() => {
              setIsLinkDoctorsModalOpen(false);
              setSelectedClinic(null);
            }}
          />
        </Suspense>
      )}
    </div>
  );
}
