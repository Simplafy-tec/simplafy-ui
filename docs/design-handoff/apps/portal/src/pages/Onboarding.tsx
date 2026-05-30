/**
 * Onboarding Page - Wizard for new subscribers to configure their clinic
 *
 * Story 29.2 - Epic 29: Onboarding via Agente IA (Wizard Step-by-Step)
 *
 * Steps (8 steps + resumo):
 *   Step 1: Dados Clínica
 *   Step 2: Profissionais
 *   Step 3: Horários
 *   Step 4: Convênios (opcional)
 *   Step 5: Serviços (opcional)
 *   Step 6: Agente IA
 *   Step 7: Conhecimento (opcional)
 *   Step 8: WhatsApp (ÚLTIMO step antes do resumo)
 *   Step 9: Resumo (antes de finalizar)
 *
 * Features:
 * - AC-001: Wizard 9 steps sequenciais
 * - AC-003: Progress bar visual
 * - AC-004: Agente IA guia via chat lateral
 * - AC-006: Resumo completo antes de finalizar
 *
 * @see docs/sprint-artifacts/29-2-onboarding-via-agente-ia-wizard-step-by-step.md
 */

import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks';
import {
  WizardContainer,
  ClinicStep,
  DoctorStep,
  ScheduleStep,
  InsuranceStep,
  AgentStep,
  WhatsAppStep,
  OnboardingChat,
  OnboardingWelcomeStep,
} from '@/components/signup/OnboardingWizard';
import type { OnboardingChatHandle } from '@/components/signup/OnboardingWizard/OnboardingChat';
import {
  ClinicResponse,
  DoctorResponse,
  CreateClinicDto,
  CreateDoctorDto,
  CreateAgentResponse,
  onboardingService,
} from '@/services/onboardingService';
import { useOnboardingStatus, useGetClinic } from '@/hooks/useOnboarding';
import { Loader2 } from 'lucide-react';
import { analytics } from '@/lib/analytics';

// Step names for analytics (7 visible steps — Services and Knowledge are auto-skipped)
const STEP_NAMES = [
  '', // Index 0 unused
  'clinic',
  'doctor',
  'schedule',
  'insurance',
  'agent',
  'whatsapp',
  'welcome', // Step 7 - Welcome + Trial Activation
];
const TOTAL_STEPS = 7;

export const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading, refreshUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [initialStepLoaded, setInitialStepLoaded] = useState(false);
  const onboardingTracked = useRef(false);

  // Fetch onboarding status to determine which step to start from
  const { data: onboardingStatus, isLoading: isLoadingStatus } = useOnboardingStatus();

  // State to store form data for summary
  const [formData, setFormData] = useState<{
    clinic?: CreateClinicDto & { document_type?: string; document?: string };
    doctor?: CreateDoctorDto;
    schedule?: { weekdays: number[]; start_time: string; end_time: string };
    insurances?: { count: number; names: string[] };
    agent?: { name: string; persona: string };
    whatsapp?: { instanceId: string; connected: boolean };
  }>({});

  // Document type from clinic step — passed to DoctorStep for conditional CRM
  const [documentType, setDocumentType] = useState<'PF' | 'PJ' | undefined>();

  // Restore documentType from existing clinic on page refresh (Fix: prevents PF users
  // from being incorrectly required to enter CRM when refreshing on step 2+)
  const { data: existingClinicData } = useGetClinic(onboardingStatus?.hasClinic === true);
  useEffect(() => {
    if (existingClinicData?.document_type && !documentType) {
      setDocumentType(existingClinicData.document_type as 'PF' | 'PJ');
    }
  }, [existingClinicData, documentType]);

  // Track whether current step was skipped (for optional steps 4, 5, 7)
  const wasSkippedRef = useRef(false);

  // Ref to OnboardingChat (desktop FAB only)
  const chatRef = useRef<OnboardingChatHandle>(null);

  // State to store agentId for linking WhatsApp with Agent
  const [agentId, setAgentId] = useState<string | null>(null);

  // Handler for agent creation/update success
  const handleAgentCreated = (data: CreateAgentResponse) => {
    setAgentId(data.agentId);
    // Store in formData for summary
    setFormData(prev => ({
      ...prev,
      agent: { name: data.name, persona: data.persona },
    }));
  };

  // Track onboarding started (only once)
  useEffect(() => {
    if (!onboardingTracked.current && initialStepLoaded) {
      analytics.trackOnboarding('started', {
        step_name: STEP_NAMES[currentStep],
        step_number: currentStep,
        total_steps: TOTAL_STEPS,
      });
      onboardingTracked.current = true;
    }
  }, [initialStepLoaded, currentStep]);

  // Redirect logic
  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigate('/login');
      return;
    }
  }, [user, loading, navigate]);

  // Initialize step from onboarding status (handles page refresh)
  useEffect(() => {
    if (isLoadingStatus || !onboardingStatus || initialStepLoaded) return;

    // If onboarding is completed, refresh authUser first to sync onboarding_completed flag,
    // then redirect to dashboard. This prevents a redirect loop where OnboardingProtectedRoute
    // keeps redirecting back here because authUser.onboarding_completed is still false.
    if (onboardingStatus.completed) {
      refreshUser().then(() => {
        navigate('/', { replace: true });
      });
      return;
    }

    // Set initial step based on saved stage
    const startStep = onboardingStatus.nextStep ?? 1;
    setCurrentStep(startStep);
    setWizardStep(startStep);

    // If agent already exists, store the ID
    if (onboardingStatus.hasAgent && onboardingStatus.agentId) {
      setAgentId(onboardingStatus.agentId);
    }

    setInitialStepLoaded(true);
  }, [isLoadingStatus, onboardingStatus, initialStepLoaded, navigate]);

  const handleClinicCreated = (clinic: ClinicResponse) => {
    // Store clinic data for summary
    // ClinicResponse uses nested contact/address; document fields come from (clinic as any)
    setFormData(prev => ({
      ...prev,
      clinic: {
        document_type: (clinic as any).document_type || 'PJ',
        document: (clinic as any).document || '',
        name: clinic.name,
        address: clinic.address?.address || '',
        phone: clinic.contact?.phone || '',
        email: clinic.contact?.email || '',
      },
    }));
  };

  const handleDoctorCreated = (doctor: DoctorResponse) => {
    // Store doctor data for summary
    setFormData(prev => ({
      ...prev,
      doctor: {
        name: doctor.name,
        crm: doctor.crm || undefined,
        specialty: doctor.specialty,
        document_type: documentType,
      },
    }));
  };

  const handleScheduleCreated = (schedule: {
    weekdays: number[];
    start_time: string;
    end_time: string;
  }) => {
    // Store schedule data for summary
    setFormData(prev => ({
      ...prev,
      schedule,
    }));
  };

  const handleInsurancesCreated = (data: { count: number; names: string[] }) => {
    setFormData(prev => ({ ...prev, insurances: data }));
  };

  const [wizardStep, setWizardStep] = useState(1);

  const handleWizardComplete = () => {
    analytics.trackOnboarding('completed', {
      step_name: 'welcome',
      step_number: TOTAL_STEPS,
      total_steps: TOTAL_STEPS,
    });
    // Refresh authUser after marking onboarding complete so OnboardingProtectedRoute
    // won't redirect back here (authUser.onboarding_completed must be true before navigate)
    onboardingService.trackStep(7);
    refreshUser().then(() => {
      navigate('/');
    });
  };

  if (loading || isLoadingStatus || !initialStepLoaded) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <Loader2 className='h-8 w-8 animate-spin text-primary mx-auto mb-4' />
          <p className='text-muted-foreground'>Carregando...</p>
        </div>
      </div>
    );
  }

  // Only render OnboardingChat after onboardingStatus is confirmed available
  // This prevents "data is undefined" errors when navigating from PaymentSuccess
  const isDataReady = onboardingStatus !== undefined;

  return (
    <div
      className='min-h-screen flex flex-col items-center justify-start sm:justify-center bg-background px-3 py-4 sm:p-6 relative'
      data-testid='onboarding-page'
    >
      {/* AC-004: Chat com agente IA - only render when data is ready */}
      {isDataReady && (
        <OnboardingChat
          ref={chatRef}
          currentStep={currentStep}
          formData={formData}
          documentType={documentType}
        />
      )}

      <WizardContainer
        totalSteps={TOTAL_STEPS}
        onComplete={handleWizardComplete}
        onStepChange={step => {
          // Track step completion (when moving forward)
          if (step > currentStep) {
            analytics.trackOnboarding('step_completed', {
              step_name: STEP_NAMES[currentStep],
              step_number: currentStep,
              total_steps: TOTAL_STEPS,
            });
            // Fire-and-forget: track completed step with skip flag
            const wasSkipped = wasSkippedRef.current;
            onboardingService.trackStep(currentStep, wasSkipped);
          }
          wasSkippedRef.current = false; // reset for next step
          setCurrentStep(step);
          setWizardStep(step);
        }}
        controlledStep={wizardStep}
        className='w-full max-w-2xl'
      >
        {(step, goToNext, goToPrevious) => {
          const handleSkipAndAdvance = () => {
            wasSkippedRef.current = true;
            goToNext();
          };
          switch (step) {
            case 1:
              // Primeiro step - sem botão voltar
              return (
                <ClinicStep
                  onNext={docType => {
                    if (docType) setDocumentType(docType as 'PF' | 'PJ');
                    goToNext();
                  }}
                  onSuccess={handleClinicCreated}
                />
              );
            case 2:
              return (
                <DoctorStep
                  onNext={goToNext}
                  onBack={goToPrevious}
                  onSuccess={handleDoctorCreated}
                  documentType={documentType}
                />
              );
            case 3:
              return (
                <ScheduleStep
                  onNext={goToNext}
                  onBack={goToPrevious}
                  onSuccess={handleScheduleCreated}
                />
              );
            case 4:
              return (
                <InsuranceStep
                  clinicId={onboardingStatus?.clinicId}
                  onNext={goToNext}
                  onBack={goToPrevious}
                  onSkip={handleSkipAndAdvance}
                  onSuccess={handleInsurancesCreated}
                />
              );
            case 5:
              return (
                <AgentStep
                  clinicName={formData.clinic?.name}
                  documentType={documentType}
                  onNext={goToNext}
                  onBack={goToPrevious}
                  onSuccess={handleAgentCreated}
                />
              );
            case 6:
              return (
                <WhatsAppStep
                  agentId={agentId || ''}
                  onBack={goToPrevious}
                  onComplete={() => {
                    goToNext();
                  }}
                />
              );
            case 7:
              // Welcome + Trial Activation
              return <OnboardingWelcomeStep onBack={goToPrevious} />;
            default:
              return null;
          }
        }}
      </WizardContainer>

      {/* Chat only available on desktop (FAB bottom-right via OnboardingChat) */}
    </div>
  );
};
