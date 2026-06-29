import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Mail, Lock, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabase/config';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signInWithGoogle, resetPassword } = useAuth();
  
  const [isLogin, setIsLogin] = useState(location.pathname !== '/register');
  const [isResetting, setIsResetting] = useState(location.pathname === '/forgot-password');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Default redirect path after login
  const from = location.state?.from?.pathname || '/dashboard';

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      if (isResetting) {
        await resetPassword(email);
        setMessage('E-mail de redefinição enviado! Verifique sua caixa de entrada.');
        setIsResetting(false);
      } else if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate(from, { replace: true });
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      // Traduzir mensagens de erro do Supabase
      const msg = err.message || '';
      if (msg.includes('Invalid login credentials')) setError('E-mail ou senha incorretos.');
      else if (msg.includes('already registered')) setError('Este e-mail já está em uso.');
      else if (msg.includes('Password should be')) setError('A senha deve ter pelo menos 6 caracteres.');
      else setError('Ocorreu um erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError('');
      setLoading(true);
      await signInWithGoogle();
      navigate(from, { replace: true });
    } catch (err) {
      setError('Falha ao autenticar com o Google.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full glass rounded-3xl p-8 shadow-2xl shadow-primary/10 relative overflow-hidden"
      >
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center">
            <Heart className="h-8 w-8 text-primary" fill="currentColor" />
          </div>
        </div>
        
        <h2 className="text-3xl font-extrabold text-center mb-2">
          {isResetting ? 'Recuperar Senha' : isLogin ? 'Bem-vindo de volta' : 'Criar Conta'}
        </h2>
        <p className="text-slate-500 text-center mb-8">
          {isResetting 
            ? 'Enviaremos um link para redefinir sua senha.' 
            : isLogin 
              ? 'Entre para continuar criando presentes inesquecíveis.' 
              : 'Cadastre-se e comece a emocionar quem você ama.'}
        </p>

        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-rose-50 text-rose-500 p-3 rounded-xl mb-4 flex items-center gap-2 text-sm border border-rose-100"
            >
              <AlertCircle size={16} /> {error}
            </motion.div>
          )}
          {message && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-emerald-50 text-emerald-600 p-3 rounded-xl mb-4 text-sm border border-emerald-100"
            >
              {message}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleAuth} className="space-y-4 relative z-10">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                disabled={loading}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder="seu@email.com"
              />
            </div>
          </div>

          {!isResetting && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium">Senha</label>
                {isLogin && (
                  <button type="button" onClick={() => setIsResetting(true)} className="text-xs text-primary hover:underline">
                    Esqueceu a senha?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input 
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  minLength={6}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white rounded-xl py-3 font-bold shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all flex justify-center items-center gap-2 disabled:opacity-70"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : (
              <>
                {isResetting ? 'Enviar Link de Recuperação' : isLogin ? 'Entrar' : 'Cadastrar'}
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          {isResetting ? (
            <button onClick={() => {setIsResetting(false); setError('');}} className="text-sm text-slate-500 hover:text-slate-800 transition">
              Voltar para o Login
            </button>
          ) : (
            <button onClick={() => {setIsLogin(!isLogin); setError('');}} className="text-sm text-slate-500 hover:text-slate-800 transition">
              {isLogin ? "Ainda não tem conta? " : "Já possui uma conta? "}
              <span className="text-primary font-bold">{isLogin ? "Cadastre-se" : "Entre agora"}</span>
            </button>
          )}
        </div>

        {!isResetting && (
          <>
            <div className="mt-6 flex items-center gap-4">
              <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1"></div>
              <span className="text-sm text-slate-400">ou</span>
              <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1"></div>
            </div>

            <button 
              onClick={handleGoogleLogin}
              type="button"
              disabled={loading}
              className="mt-6 w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-3 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex justify-center items-center gap-2 disabled:opacity-70"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Entrar com Google
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
}
