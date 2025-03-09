import React, { useState, useEffect } from 'react';
import PasswordStrengthBar from 'react-password-strength-bar';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [formTouched, setFormTouched] = useState({
    username: false,
    password: false,
    confirmPassword: false
  });

  const navigate = useNavigate();

  // Add validation on data change
  useEffect(() => {
    if (Object.values(formTouched).some(field => field)) {
      validateForm(false);
    }
  }, [formData, isLogin]);

  const validateForm = (isSubmission: boolean = true): boolean => {
    const newErrors: FormErrors = {};

    // Only validate fields that have been touched or if this is a form submission
    if ((formTouched.username || isSubmission) && !formData.username) {
      newErrors.username = 'Username is required';
    } else if ((formTouched.username || isSubmission) && formData.username.length < 8) {
      newErrors.username = 'Username must be at least 8 characters long';
    }

    if ((formTouched.password || isSubmission) && !formData.password) {
      newErrors.password = 'Password is required';
    }

    if (!isLogin) {
      if ((formTouched.password || isSubmission) && formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters long';
      }
      
      // Validate password complexity
      const passwordRegex = {
        lowercase: /[a-z]/,
        uppercase: /[A-Z]/,
        special: /[!@#$%^&*(),.?":{}|<>]/,
      };
      
      if ((formTouched.password || isSubmission) && 
          (!passwordRegex.lowercase.test(formData.password) || 
          !passwordRegex.uppercase.test(formData.password) || 
          !passwordRegex.special.test(formData.password))) {
        newErrors.password = 'Password must include lowercase, uppercase, and special characters';
      }
      
      if ((formTouched.confirmPassword || isSubmission) && !formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if ((formTouched.confirmPassword || isSubmission) && formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Mark field as touched when user enters something
    if (!formTouched[name as keyof typeof formTouched]) {
      setFormTouched(prev => ({ ...prev, [name]: true }));
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBlur = (name: string) => {
    setFormTouched(prev => ({ ...prev, [name]: true }));
    validateForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setFormTouched({
      username: true,
      password: true,
      confirmPassword: true
    });

    if (!validateForm(true)) return;

    setIsSubmitting(true);
    setErrors({});
    setSignupSuccess(false);

    const url = isLogin ? 'http://localhost:5000/api/auth/login' : 'http://localhost:5000/api/auth/signup';
    const payload = isLogin
      ? { username: formData.username, password: formData.password }
      : { username: formData.username, password: formData.password };

    try {
      console.log(`Submitting to ${url} with payload:`, { ...payload, password: '[REDACTED]' });
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        credentials: 'include', // Important for cookies
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        setErrors({ general: errorData.message || 'An error occurred. Please try again later.' });
        return;
      }

      const data = await response.json();
      console.log('Response data:', data);

      if (isLogin) {
        // Store auth data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({
          id: data.id,
          username: data.username
        }));
        
        // Navigate to dashboard
        navigate('/landing');
      } else {
        // Show success message
        setSignupSuccess(true);
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          setSignupSuccess(false);
          setIsLogin(true);
          setFormData({
            username: formData.username, // Keep the username for convenience
            password: '',
            confirmPassword: ''
          });
          setFormTouched({
            username: false,
            password: false,
            confirmPassword: false
          });
        }, 2000);
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setErrors({ general: 'An error occurred. Please check your connection and try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const passwordsMatch = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;
  const usernameValid = formData.username.length >= 8;

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

            {signupSuccess && (
              <div className="p-3 text-sm text-green-500 rounded-lg bg-green-50">
                Account created successfully! Redirecting to login...
              </div>
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
                onBlur={() => handleBlur('username')}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black/5 focus:border-black ${
                  errors.username ? 'border-red-500' : formTouched.username && usernameValid ? 'border-green-500' : 'border-gray-300'
                }`}
                placeholder="Enter your username (min 8 characters)"
                disabled={isSubmitting}
              />
              {errors.username && <p className="mt-1 text-sm text-red-500">{errors.username}</p>}
              {!errors.username && formTouched.username && (
                <div className="mt-2 space-y-2 text-sm">
                  <p className={`flex items-center ${usernameValid ? 'text-green-500' : 'text-gray-500'}`}>
                    <span className="mr-2">{usernameValid ? '✓' : '○'}</span>
                    At least 8 characters long
                  </p>
                </div>
              )}
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
                  onBlur={() => handleBlur('password')}
                  className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-black/5 focus:border-black ${
                    errors.password ? 'border-red-500' : formTouched.password && formData.password && (!isLogin || formData.password.length >= 8) ? 'border-green-500' : 'border-gray-300'
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
                    onBlur={() => handleBlur('confirmPassword')}
                    className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-black/5 focus:border-black ${
                      errors.confirmPassword ? 'border-red-500' : passwordsMatch ? 'border-green-500' : 'border-gray-300'
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
                  setFormTouched({
                    username: false,
                    password: false,
                    confirmPassword: false
                  });
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
          alt="Cricket match"
          className="h-auto max-w-full shadow-2xl rounded-3xl"
        />
      </div>

      {/* Success Modal for Signup */}
      {signupSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <div className="text-center">
              <svg 
                className="mx-auto h-12 w-12 text-green-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <h3 className="mt-2 text-xl font-medium text-gray-900">Account created successfully!</h3>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;