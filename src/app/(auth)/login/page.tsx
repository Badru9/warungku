'use client';

import {
  Button,
  Card,
  FieldError,
  Form,
  Input,
  Label,
  Spinner,
  TextField,
} from '@heroui/react';
import { LockIcon, LockOpenIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { authService } from '@/services/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await authService.login({ email, password });
      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      const message = err.response?.data?.error || err.message || 'Gagal login';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex min-h-screen items-center justify-center p-4 bg-gray-50'>
      <Card className='w-full max-w-md p-6'>
        <div className='flex flex-col gap-4 text-center mb-6'>
          <h1 className='text-2xl font-bold'>Warsija Stock</h1>
          <p className='text-gray-500'>Login untuk mengakses sistem</p>
        </div>

        <Form className='flex flex-col gap-4' onSubmit={handleLogin}>
          <TextField isRequired fullWidth isInvalid={!!error}>
            <Label>Email</Label>
            <Input
              type='email'
              placeholder='Masukkan email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </TextField>

          <TextField isRequired fullWidth isInvalid={!!error}>
            <Label>Password</Label>
            <div className='relative'>
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder='Masukkan password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {showPassword ? (
                <LockOpenIcon
                  className='absolute right-3 top-2 cursor-pointer'
                  size={20}
                  onClick={() => setShowPassword(false)}
                />
              ) : (
                <LockIcon
                  size={20}
                  className='absolute right-3 top-2 cursor-pointer'
                  onClick={() => setShowPassword(true)}
                />
              )}
            </div>
            {error && <FieldError>{error}</FieldError>}
          </TextField>

          <Button className='w-full' variant='primary' type='submit'>
            {loading ? <Spinner /> : 'Masuk'}
          </Button>
        </Form>
      </Card>
    </div>
  );
}
