import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Navigate, useLocation, Link, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Logo } from '@/components/ui';
import { useStore } from '@/hooks';
import { Button, Input, Label } from '@/components/ui';
import { useAuth } from '@/hooks';
import { toast } from 'sonner';
import { ErrorMapper, ErrorDomain } from '@/services/ErrorMapper';
import { loginSchema, type LoginFormData } from '@/schemas';

/** Abstract SVG background with organic strokes for the right panel */
const AbstractBackground: React.FC = () => (
  <svg
    className='absolute inset-0 w-full h-full'
    viewBox='0 0 600 900'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    preserveAspectRatio='xMidYMid slice'
  >
    {/* Large organic curves */}
    <path
      d='M-50 200 C100 150, 250 350, 400 250 S650 100, 700 300'
      stroke='rgba(255,255,255,0.10)'
      strokeWidth='2'
      fill='none'
    />
    <path
      d='M-80 400 C50 350, 200 500, 350 400 S600 250, 700 450'
      stroke='rgba(255,255,255,0.08)'
      strokeWidth='1.5'
      fill='none'
    />
    <path
      d='M-30 600 C120 550, 280 700, 420 600 S620 500, 700 650'
      stroke='rgba(255,255,255,0.10)'
      strokeWidth='2'
      fill='none'
    />
    {/* Circular arcs */}
    <circle
      cx='450'
      cy='180'
      r='120'
      stroke='rgba(255,255,255,0.07)'
      strokeWidth='1.5'
      fill='none'
    />
    <circle
      cx='150'
      cy='700'
      r='180'
      stroke='rgba(255,255,255,0.06)'
      strokeWidth='1.5'
      fill='none'
    />
    <circle cx='500' cy='600' r='90' stroke='rgba(255,255,255,0.08)' strokeWidth='1' fill='none' />
    {/* Flowing diagonal strokes */}
    <path
      d='M100 0 C150 200, 300 300, 200 500 S350 700, 300 900'
      stroke='rgba(255,255,255,0.06)'
      strokeWidth='2.5'
      fill='none'
    />
    <path
      d='M400 0 C450 150, 350 350, 500 500 S400 700, 500 900'
      stroke='rgba(255,255,255,0.07)'
      strokeWidth='2'
      fill='none'
    />
    <path
      d='M550 0 C500 200, 600 400, 450 600 S550 750, 600 900'
      stroke='rgba(255,255,255,0.05)'
      strokeWidth='3'
      fill='none'
    />
    {/* Small accent curves */}
    <path
      d='M50 100 Q200 50, 300 150'
      stroke='rgba(255,255,255,0.12)'
      strokeWidth='1'
      fill='none'
    />
    <path
      d='M250 800 Q400 750, 500 830'
      stroke='rgba(255,255,255,0.09)'
      strokeWidth='1'
      fill='none'
    />
    {/* Dotted circle */}
    <circle
      cx='300'
      cy='400'
      r='200'
      stroke='rgba(255,255,255,0.04)'
      strokeWidth='1'
      strokeDasharray='8 12'
      fill='none'
    />
  </svg>
);

export const Login: React.FC = () => {
  const location = useLocation();
  const {
    signInWithPassword,
    isAuthenticated,
    loading: authLoading,
    isRefreshing,
    session,
    lastAuthError,
    clearAuthError,
  } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [postLoginAttempt, setPostLoginAttempt] = useState(false);
  const { theme } = useStore();
  const [searchParams] = useSearchParams();

  // Query params do redirect após verificação de email
  const verified = searchParams.get('verified') === 'true';
  const nextFromQuery = searchParams.get('next');

  // Path de origem: prioridade query param 'next' > location.state (pathname + search) > '/'
  // Importante: preservar ?tab= e outros query params (ex.: /configuracoes?tab=agent)
  const fromState = (
    location.state as { from?: { pathname: string; search?: string; hash?: string } }
  )?.from;
  const fromPathWithQuery = fromState
    ? `${fromState.pathname}${fromState.search ?? ''}${fromState.hash ?? ''}`
    : null;
  const from =
    (nextFromQuery && (nextFromQuery.startsWith('/') ? nextFromQuery : `/${nextFromQuery}`)) ||
    fromPathWithQuery ||
    '/';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await signInWithPassword(data);
      toast.success('Login realizado com sucesso!');
      setPostLoginAttempt(true);
    } catch (error: any) {
      console.error('Login error:', error);

      let errorMessage = 'Erro ao fazer login. Tente novamente.';

      if (error?.message) {
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Email ou senha incorretos.';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Email não confirmado. Verifique sua caixa de entrada.';
        } else if (error.message.includes('Too many requests')) {
          errorMessage = 'Muitas tentativas. Tente novamente em alguns minutos.';
        }
      }

      ErrorMapper.showErrorToast(error, ErrorDomain.AUTH, errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Efeitos para mensagens/estados pós-auth
  useEffect(() => {
    if (!authLoading && lastAuthError === '401') {
      toast.error('Sua sessão expirou. Faça login novamente.');
      clearAuthError();
    } else if (!authLoading && lastAuthError === '403') {
      toast.error('Acesso negado. Verifique suas permissões.');
      clearAuthError();
    } else if (!authLoading && lastAuthError === '408') {
      toast.error('Conexão expirou. Tente novamente.');
      clearAuthError();
    }
  }, [authLoading, lastAuthError, clearAuthError]);

  // Mostrar toast se email foi verificado com sucesso
  useEffect(() => {
    if (verified) {
      toast.success('Email verificado com sucesso! Faça login para continuar.');
    }
  }, [verified]);

  useEffect(() => {
    if (postLoginAttempt && !authLoading && !isRefreshing && session && !isAuthenticated) {
      toast.error('Conta sem empresa vinculada. Contate o suporte.');
      setPostLoginAttempt(false);
    }
  }, [postLoginAttempt, authLoading, isRefreshing, session, isAuthenticated]);

  // Redireciona quando autenticar de fato
  if (isAuthenticated && !authLoading) {
    return <Navigate to={from} replace />;
  }

  if (authLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-background'>
        <div className='flex items-center gap-2'>
          <Loader2 className='h-6 w-6 animate-spin' />
          <span>Carregando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen flex bg-background'>
      {/* Left: Login form */}
      <div className='flex-1 flex flex-col justify-between p-6 lg:p-12'>
        {/* Form area — centered vertically */}
        <div className='flex-1 flex flex-col justify-center w-full max-w-[420px] mx-auto'>
          {/* Logo */}
          <div className='mb-8'>
            <Logo variant={theme === 'light' ? 'dark' : 'light'} size='md' alt='Simplafy' />
          </div>

          {/* Heading */}
          <h1 className='text-2xl font-bold text-foreground'>Bem-vindo de volta</h1>
          <p className='text-sm text-muted-foreground mt-1.5 mb-8'>
            Insira suas credenciais para acessar seu painel.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-5' data-testid='login-form'>
            {/* Email */}
            <div className='space-y-1.5'>
              <Label htmlFor='email' className='text-xs font-semibold'>
                E-mail
              </Label>
              <Input
                id='email'
                type='email'
                placeholder='nome@seuespaco.com.br'
                {...register('email')}
                className={errors.email ? 'border-destructive' : ''}
                data-testid='email-input'
              />
              {errors.email && <p className='text-xs text-destructive'>{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className='space-y-1.5'>
              <div className='flex items-center justify-between'>
                <Label htmlFor='password' className='text-xs font-semibold'>
                  Senha
                </Label>
                <Link
                  to='/forgot-password'
                  className='text-xs text-primary hover:underline font-medium'
                  data-testid='forgot-password-link'
                >
                  Esqueceu a senha?
                </Link>
              </div>
              <div className='relative'>
                <Input
                  id='password'
                  type={showPassword ? 'text' : 'password'}
                  placeholder='••••••••'
                  {...register('password')}
                  className={errors.password ? 'border-destructive pr-10' : 'pr-10'}
                  data-testid='password-input'
                />
                <Button
                  type='button'
                  variant='ghost'
                  size='sm'
                  className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                  onClick={() => setShowPassword(!showPassword)}
                  data-testid='toggle-password-visibility'
                >
                  {showPassword ? (
                    <EyeOff className='h-4 w-4 text-muted-foreground' />
                  ) : (
                    <Eye className='h-4 w-4 text-muted-foreground' />
                  )}
                </Button>
              </div>
              {errors.password && (
                <p className='text-xs text-destructive'>{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button — gradient */}
            <Button
              type='submit'
              className='w-full bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold'
              disabled={isLoading}
              data-testid='login-button'
            >
              {isLoading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </Button>
          </form>

          {/* Signup link */}
          <p className='text-sm text-muted-foreground text-center mt-6'>
            Novo no Simplafy?{' '}
            <Link
              to='/signup'
              className='text-primary hover:underline font-semibold'
              data-testid='signup-link'
            >
              Cadastre-se agora
            </Link>
          </p>
        </div>

        {/* Footer */}
        <div className='pt-6 border-t border-border mt-8'>
          <div className='flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground'>
            <span>&copy; 2026 Simpla.fy &middot; Agentes digitais com IA</span>
            <a
              href='https://simplafy.com.br/politica-de-privacidade/'
              target='_blank'
              rel='noopener noreferrer'
              className='hover:underline hover:text-foreground transition-colors'
            >
              Privacidade
            </a>
            <a
              href='https://simplafy.com.br/termos-de-uso/'
              target='_blank'
              rel='noopener noreferrer'
              className='hover:underline hover:text-foreground transition-colors'
            >
              Termos de Uso
            </a>
            <a
              href='https://status.simplafy.com.br/status/default'
              target='_blank'
              rel='noopener noreferrer'
              className='hover:underline hover:text-foreground transition-colors'
            >
              Status
            </a>
          </div>
        </div>
      </div>

      {/* Right: Feature panel (desktop only) */}
      <div className='hidden lg:flex relative w-[520px] bg-primary overflow-hidden'>
        {/* Abstract background strokes */}
        <AbstractBackground />

        {/* Centered content card */}
        <div className='relative z-10 flex items-center justify-center w-full p-10'>
          <div className='w-full max-w-sm bg-background/95 backdrop-blur-sm rounded-xl p-6 shadow-lg'>
            {/* Badge */}
            <div className='inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-primary/10 text-primary text-xs font-semibold mb-4'>
              <svg
                className='w-3.5 h-3.5'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <path d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' />
              </svg>
              GESTÃO EM SAÚDE
            </div>

            {/* Heading */}
            <h2 className='text-xl font-bold text-foreground mb-2'>Seu espaço conectado.</h2>
            <p className='text-[13px] text-muted-foreground leading-relaxed mb-6'>
              Agilidade e precisão na gestão da saúde. O Simplafy transforma dados em decisões
              seguras e eficientes para você e seus pacientes.
            </p>

            {/* Stats */}
            <div className='flex gap-8'>
              <div>
                <p className='text-2xl font-bold text-primary'>100%</p>
                <p className='text-[10px] font-semibold text-muted-foreground uppercase tracking-wider'>
                  Nuvem e Segurança
                </p>
              </div>
              <div>
                <p className='text-2xl font-bold text-primary'>24/7</p>
                <p className='text-[10px] font-semibold text-muted-foreground uppercase tracking-wider'>
                  Agente de IA Online
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
