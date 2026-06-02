import { useState, lazy, Suspense } from 'react';
import { Instance } from '@simplafy/shared';
import { Button } from '@/components/ui/button';
import { Plus, Smartphone, Loader2 } from 'lucide-react';
import { usePermissions } from '@/hooks/usePermissions';
import {
  useChannels,
  useCreateChannel,
  useDeleteChannel,
  useChannelRealtime,
} from '@/hooks/useChannels';
import { ChannelCard, QRCodeDisplay } from '@/components/channels';
import type { CreateChannelData } from '@/services/channelService';
import { channelService } from '@/services/channelService';
import { SkeletonGrid, ErrorState, EmptyState } from '@/components/ui/page-loading-states';

// Lazy load modals for better performance
const CreateChannelModal = lazy(() =>
  import('@/components/channels').then(m => ({ default: m.CreateChannelModal }))
);

// Componente principal

export default function Channels() {
  const { canCreate, canDelete } = usePermissions();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<Instance | null>(null);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  // React Query hooks
  const { data: channels = [], isLoading, error, refetch } = useChannels();
  const createChannelMutation = useCreateChannel();
  const deleteChannelMutation = useDeleteChannel();

  // 🔥 GAP #1 FIX: Escutar atualizações em tempo real (QR Code via RabbitMQ)
  useChannelRealtime();

  const handleCreateChannel = async (data: CreateChannelData) => {
    try {
      const createdChannel = await createChannelMutation.mutateAsync(data);
      setIsCreateModalOpen(false);

      // Auto-abrir modal QR Code se for WhatsApp comum
      if (data.mode === 'common' && data.qrcode && createdChannel) {
        setSelectedChannel(createdChannel);
        setIsQRModalOpen(true);
      }
    } catch {
      // Error handling is done by useMutationWithErrorHandling hook
      // No additional action needed - toast already shown
    }
  };

  const handleDeleteChannel = async (channelId: string) => {
    try {
      await deleteChannelMutation.mutateAsync({ id: channelId });
    } catch {
      // Error handling is done by useMutationWithErrorHandling hook
      // No additional action needed - toast already shown
    }
  };

  const handleFetchQR = async (id: string, refresh?: boolean): Promise<string | null> => {
    try {
      const qr = refresh
        ? await channelService.refreshChannelQrCode(id)
        : await channelService.getChannelQrCode(id);
      return qr ?? null;
    } catch {
      // QR fetch errors are handled silently - component shows fallback UI
      return null;
    }
  };

  // Estados de carregamento e erro
  if (isLoading) {
    return (
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-xl font-bold'>Canais WhatsApp</h1>
            <p className='text-muted-foreground'>
              Conexões WhatsApp e configuração de avatares virtuais
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
        message='Erro ao carregar canais WhatsApp. Verifique sua conexão.'
        onRetry={refetch}
      />
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-xl font-bold'>Canais WhatsApp</h1>
          <p className='text-muted-foreground'>
            Conexões WhatsApp e configuração de avatares virtuais
          </p>
        </div>
        {canCreate && (
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            disabled={createChannelMutation.isPending}
          >
            {createChannelMutation.isPending ? (
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            ) : (
              <Plus className='mr-2 h-4 w-4' />
            )}
            Novo Canal
          </Button>
        )}
      </div>

      {/* Lista de Canais ou Estado Vazio */}
      {channels.length === 0 ? (
        <EmptyState
          icon={Smartphone}
          title='Nenhum canal encontrado'
          description='Comece criando seu primeiro canal WhatsApp'
          action={
            canCreate ? (
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                disabled={createChannelMutation.isPending}
              >
                {createChannelMutation.isPending ? (
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                ) : (
                  <Plus className='mr-2 h-4 w-4' />
                )}
                Novo Canal
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {channels.map(channel => (
            <ChannelCard
              key={channel.id}
              channel={channel}
              onDelete={canDelete ? handleDeleteChannel : undefined}
              onShowQR={channel => {
                setSelectedChannel(channel);
                setIsQRModalOpen(true);
              }}
            />
          ))}
        </div>
      )}

      {/* Modals com Suspense para lazy loading */}
      {isCreateModalOpen && (
        <Suspense fallback={null}>
          <CreateChannelModal
            open={isCreateModalOpen}
            onOpenChange={setIsCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onSubmit={handleCreateChannel}
            isPending={createChannelMutation.isPending}
          />
        </Suspense>
      )}

      <QRCodeDisplay
        open={isQRModalOpen}
        onOpenChange={setIsQRModalOpen}
        channel={selectedChannel}
        onFetchQR={handleFetchQR}
      />
    </div>
  );
}
