import React, { useState } from 'react';
import { X, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { signInWithGoogle, signUpWithEmail, signInWithEmail, loading } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      onClose();
    } catch (error) {
      setError('Google sign in failed.');
      console.error('Sign in failed:', error);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setError(null);
    try {
      if (mode === 'login') {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password, name);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{mode === 'login' ? 'Sign In' : 'Sign Up'}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="text-center">
          <p className="text-gray-600 mb-6">
            {mode === 'login'
              ? 'Sign in to your account to track orders and manage your library'
              : 'Create an account to start using the library'}
          </p>

          <form onSubmit={handleEmailAuth} className="space-y-4 mb-4">
            {mode === 'signup' && (
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            )}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <button
              type="submit"
              disabled={formLoading}
              className="w-full bg-amber-800 hover:bg-amber-900 disabled:bg-gray-300 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
            >
              {formLoading ? (mode === 'login' ? 'Signing in...' : 'Signing up...') : (mode === 'login' ? 'Sign In' : 'Sign Up')}
            </button>
          </form>

          <div className="mb-4">
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
            >
              <LogIn className="h-5 w-5" />
              <span>{loading ? 'Signing in...' : 'Continue with Google'}</span>
            </button>
          </div>

          <p className="text-sm text-gray-500 mt-4">
            {mode === 'login' ? (
              <>
                Don&apos;t have an account?{' '}
                <button className="text-blue-600 hover:underline" onClick={() => { setMode('signup'); setError(null); }} type="button">Sign Up</button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button className="text-blue-600 hover:underline" onClick={() => { setMode('login'); setError(null); }} type="button">Sign In</button>
              </>
            )}
          </p>
          <p className="text-xs text-gray-400 mt-2">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
