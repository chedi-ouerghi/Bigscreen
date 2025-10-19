import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setError('');
    const success = await login(data.email, data.password);
    
    if (!success) {
      setError('Invalid email or password. Please try again.');
    } else {
      toast({
        title: 'Connexion réussie',
        description: 'Bienvenue sur le tableau de bord Bigscreen.',
      });
      navigate('/admin/dashboard');
    }
  };

return (
  <div className="h-screen flex items-center justify-center overflow-hidden 
    bg-gradient-to-br from-white via-blue-50 to-blue-100 
    dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 px-4 sm:px-6 lg:px-8">
    
    <motion.div 
      className="max-w-md w-full space-y-8"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Logo and branding */}
      <div className="text-center">
        <motion.div 
          className="flex justify-center"
          whileHover={{ rotate: 6, scale: 1.05 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
        </motion.div>
        <img src="images/bigscreen_logo.svg" alt="Bigscreen Logo" className="mx-auto mt-4 brightness-0" />
        <p className="mt-2 text-sm text-slate-600">
          Admin Panel Access
        </p>
      </div>

      {/* Login form */}
      <Card className="shadow-2xl border border-blue-100 
        bg-white/80 backdrop-blur-2xl rounded-2xl">
        <CardHeader className="space-y-1 pb-6">
          <CardTitle className="text-2xl text-center text-slate-800">
            Sign in to continue
          </CardTitle>
          <CardDescription className="text-center text-slate-500">
            Enter your credentials to access the dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <Alert variant="destructive" className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Email */}
            <div className="space-y-2 text-left ">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="admin@bigscreen.com"
                className="h-11 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-400/50"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2 text-left">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className="h-11 pr-10 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-400/50"
                  {...register('password')}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center justify-center bg-white border-blue-200 text-slate-400 hover:text-blue-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
              <div className="flex justify-end">
                <a href="#" className="text-xs text-blue-600 hover:underline">
                  Forgot password?
                </a>
              </div>
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-700 
              hover:from-blue-700 hover:to-indigo-800 text-white font-medium 
              shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting || isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                'Sign in'
              )}
            </Button>
          </form>

          {/* Divider + footer */}
          <div className="mt-8 text-center">
            <div className="flex items-center justify-center space-x-2 text-xs text-slate-400">
              <span className="h-px w-8 bg-blue-200"></span>
              <span>Protected area • Authorized personnel only</span>
              <span className="h-px w-8 bg-blue-200"></span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  </div>
);

}
