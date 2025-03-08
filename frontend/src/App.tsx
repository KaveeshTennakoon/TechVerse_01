import React, { useState } from 'react';
import PasswordStrengthBar from 'react-password-strength-bar';
import { Eye, EyeOff } from 'lucide-react';

interface FormData {
  username: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  username?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const mockCredentials = {
    username: 'testuser',
    password: 'Test123!',
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.username) {
      newErrors.username = 'Username is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    if (isLogin) {
      if (formData.username !== mockCredentials.username || formData.password !== mockCredentials.password) {
        newErrors.general = 'Username or password is incorrect';
      }
    } else {
      if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters long';
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    const url = isLogin ? 'http://localhost:5000/api/auth/login' : 'http://localhost:5000/api/auth/signup';
    const payload = isLogin
      ? { username: formData.username, password: formData.password }
      : { username: formData.username, password: formData.password, confirmPassword: formData.confirmPassword };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrors({ general: errorData.message || 'An error occurred. Please try again later.' });
        return;
      }

      const data = await response.json();
      alert(isLogin ? 'Login successful!' : 'Account created successfully!');
    } catch (error) {
      setErrors({ general: 'An error occurred. Please try again later.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const passwordsMatch = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;

  return (
    <div className="flex min-h-screen">
      <div className="flex items-center justify-center w-1/2 p-8">
        <div className="w-full max-w-md">
          <div className="mb-12">
            <h1 className="flex items-center gap-2 text-xl font-semibold">
              <div className="flex items-center justify-center w-8 h-8 bg-black rounded">
                <span className="text-white">Cv</span>
              </div>
              CricketVerse
            </h1>
          </div>

          <div className="mb-8">
            <h2 className="mb-2 text-3xl font-semibold">
              {isLogin ? 'Welcome back!' : 'Welcome!'}
            </h2>
            <p className="text-gray-600">
              {isLogin ? 'Login to your account' : 'Create your account'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.general && (
              <div className="p-3 text-sm text-red-500 rounded-lg bg-red-50">{errors.general}</div>
            )}

            <div>
              <label htmlFor="username" className="block mb-1 text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black/5 focus:border-black ${errors.username ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="Enter your username"
                disabled={isSubmitting}
              />
              {errors.username && <p className="mt-1 text-sm text-red-500">{errors.username}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-black/5 focus:border-black ${errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="••••••••"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute text-gray-500 -translate-y-1/2 right-3 top-1/2 hover:text-gray-700"
                >
                  {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}

              {!isLogin && (
                <div className="mt-4">
                  <PasswordStrengthBar
                    password={formData.password}
                    minLength={8}
                    scoreWords={['Weak', 'Weak', 'Fair', 'Good', 'Strong']}
                    shortScoreWord="Too short"
                  />
                  <div className="mt-2 space-y-2 text-sm">
                    <p className={`flex items-center ${/[a-z]/.test(formData.password) ? 'text-green-500' : 'text-gray-500'}`}>
                      <span className="mr-2">{/[a-z]/.test(formData.password) ? '✓' : '○'}</span>
                      At least one lowercase letter
                    </p>
                    <p className={`flex items-center ${/[A-Z]/.test(formData.password) ? 'text-green-500' : 'text-gray-500'}`}>
                      <span className="mr-2">{/[A-Z]/.test(formData.password) ? '✓' : '○'}</span>
                      At least one uppercase letter
                    </p>
                    <p className={`flex items-center ${/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? 'text-green-500' : 'text-gray-500'}`}>
                      <span className="mr-2">{/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? '✓' : '○'}</span>
                      At least one special character
                    </p>
                    <p className={`flex items-center ${formData.password.length >= 8 ? 'text-green-500' : 'text-gray-500'}`}>
                      <span className="mr-2">{formData.password.length >= 8 ? '✓' : '○'}</span>
                      At least 8 characters long
                    </p>
                  </div>
                </div>
              )}
            </div>

            {!isLogin && (
              <div className="relative">
                <label htmlFor="confirmPassword" className="block mb-1 text-sm font-medium text-gray-700">
                  Confirm password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-black/5 focus:border-black ${errors.confirmPassword ? 'border-red-500' : passwordsMatch ? 'border-green-500' : 'border-gray-300'
                      }`}
                    placeholder="••••••••"
                    disabled={isSubmitting}
                  />
                  <div className="absolute flex items-center gap-2 -translate-y-1/2 right-3 top-1/2">
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                    </button>
                    {passwordsMatch && (
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 text-white transition-colors bg-black rounded-lg hover:bg-black/90 disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : isLogin ? 'Sign in' : 'Create account'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setFormData({ username: '', password: '', confirmPassword: '' });
                  setErrors({});
                }}
                className="font-semibold text-black hover:underline"
                disabled={isSubmitting}
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>

      <div className="w-1/2 bg-[#F4F7FE] flex items-center justify-center p-8">
        <img
          src="https://img.freepik.com/free-photo/cricket-match-with-player_23-2151702173.jpg?t=st=1741422174~exp=1741425774~hmac=3d9db810c636c4d49e58114f0dcd8ab23f47865f71822e3b5d1c56eb4a7f118e&w=650"
          alt="3D character illustration"
          className="h-auto max-w-full shadow-2xl rounded-3xl"
        />
      </div>
    </div>
  );
}

export default App;