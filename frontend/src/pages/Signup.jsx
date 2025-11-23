import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authAPI } from '../services/api'
import toast from 'react-hot-toast'
import { useAuth } from '../hooks/useAuth'
import { useDarkMode } from '../contexts/DarkModeContext'

export default function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()
  const { darkMode } = useDarkMode()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const generatePassword = () => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const lowercase = 'abcdefghijklmnopqrstuvwxyz'
    const numbers = '0123456789'
    const special = '!@#$%^&*'
    
    let password = ''
    // Ensure at least one of each required type
    password += uppercase[Math.floor(Math.random() * uppercase.length)]
    password += lowercase[Math.floor(Math.random() * lowercase.length)]
    password += numbers[Math.floor(Math.random() * numbers.length)]
    password += special[Math.floor(Math.random() * special.length)]
    
    // Fill the rest randomly
    const allChars = uppercase + lowercase + numbers + special
    for (let i = password.length; i < 12; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)]
    }
    
    // Shuffle the password
    password = password.split('').sort(() => Math.random() - 0.5).join('')
    
    setFormData({
      ...formData,
      password: password,
      confirmPassword: password
    })
    toast.success('Password generated!')
  }

  const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumber = /[0-9]/.test(password)
    const hasMinLength = password.length >= 8
    
    return {
      valid: hasUpperCase && hasLowerCase && hasNumber && hasMinLength,
      hasUpperCase,
      hasLowerCase,
      hasNumber,
      hasMinLength
    }
  }

  const getPasswordStrength = (password) => {
    const validation = validatePassword(password)
    if (!password) return { strength: 0, label: '', color: '' }
    
    let strength = 0
    if (validation.hasMinLength) strength++
    if (validation.hasUpperCase) strength++
    if (validation.hasLowerCase) strength++
    if (validation.hasNumber) strength++
    if (password.length >= 12) strength++
    
    if (strength <= 2) return { strength, label: 'Weak', color: 'text-red-400' }
    if (strength === 3) return { strength, label: 'Medium', color: 'text-yellow-400' }
    if (strength === 4) return { strength, label: 'Strong', color: 'text-green-400' }
    return { strength, label: 'Very Strong', color: 'text-[#00D4FF]' }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    const validation = validatePassword(formData.password)
    if (!validation.valid) {
      const errors = []
      if (!validation.hasMinLength) errors.push('at least 8 characters')
      if (!validation.hasUpperCase) errors.push('one uppercase letter')
      if (!validation.hasLowerCase) errors.push('one lowercase letter')
      if (!validation.hasNumber) errors.push('one number')
      toast.error(`Password must contain: ${errors.join(', ')}`)
      return
    }

    setLoading(true)
    try {
      const response = await authAPI.signup({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      })
      
      login(response.data.access_token, response.data.user)
      toast.success('Account created successfully!')
      navigate('/dashboard')
    } catch (error) {
      console.error('Signup error:', error)
      const errorMessage = error.response?.data?.detail || error.message || 'Failed to create account'
      console.error('Error details:', errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background */}
      <div className="animated-bg"></div>
      
      {/* Floating Particles */}
      <div className="particles">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              width: `${Math.random() * 80 + 40}px`,
              height: `${Math.random() * 80 + 40}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 15}s`,
              animationDuration: `${Math.random() * 8 + 12}s`,
            }}
          />
        ))}
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10 animate-fadeIn">
        <div>
          <h2 className="mt-6 text-center text-4xl font-extrabold bg-gradient-to-r from-[#9B4DE0] via-[#D946EF] to-[#00D4FF] bg-clip-text text-transparent">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-[#B8A8D8]">
            Or{' '}
            <Link
              to="/login"
              className="font-medium text-[#D8B4FF] hover:text-[#9B4DE0] transition-colors"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>
        <div className="bg-[#120A1F]/90 backdrop-blur-md rounded-2xl shadow-2xl border border-[#9B4DE0]/30 p-8 glass hover-lift">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[#9B4DE0]/30 bg-[#1A0B2E] placeholder-[#B8A8D8] text-[#F8F5FF] rounded-t-md focus:outline-none focus:ring-2 focus:ring-[#9B4DE0] focus:border-[#9B4DE0] focus:z-10 sm:text-sm"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[#9B4DE0]/30 bg-[#1A0B2E] placeholder-[#B8A8D8] text-[#F8F5FF] focus:outline-none focus:ring-2 focus:ring-[#9B4DE0] focus:border-[#9B4DE0] focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <button
                  type="button"
                  onClick={generatePassword}
                  className="text-xs text-[#D8B4FF] hover:text-[#9B4DE0] transition-colors flex items-center gap-1"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Suggest Password
                </button>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 pr-10 border border-[#9B4DE0]/30 bg-[#1A0B2E] placeholder-[#B8A8D8] text-[#F8F5FF] focus:outline-none focus:ring-2 focus:ring-[#9B4DE0] focus:border-[#9B4DE0] focus:z-10 sm:text-sm"
                  placeholder="Password (min 8 chars, uppercase, lowercase, number)"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#B8A8D8] hover:text-[#D8B4FF] transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {formData.password && (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center gap-2 text-xs flex-wrap">
                    <span className={`${validatePassword(formData.password).hasMinLength ? 'text-[#00D4FF]' : 'text-[#B8A8D8]'}`}>
                      {validatePassword(formData.password).hasMinLength ? '✓' : '○'} At least 8 characters
                    </span>
                    <span className={`${validatePassword(formData.password).hasUpperCase ? 'text-[#00D4FF]' : 'text-[#B8A8D8]'}`}>
                      {validatePassword(formData.password).hasUpperCase ? '✓' : '○'} Uppercase letter
                    </span>
                    <span className={`${validatePassword(formData.password).hasLowerCase ? 'text-[#00D4FF]' : 'text-[#B8A8D8]'}`}>
                      {validatePassword(formData.password).hasLowerCase ? '✓' : '○'} Lowercase letter
                    </span>
                    <span className={`${validatePassword(formData.password).hasNumber ? 'text-[#00D4FF]' : 'text-[#B8A8D8]'}`}>
                      {validatePassword(formData.password).hasNumber ? '✓' : '○'} Number
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1 bg-[#1A0B2E] rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all ${
                          getPasswordStrength(formData.password).strength <= 2 ? 'bg-red-500' :
                          getPasswordStrength(formData.password).strength === 3 ? 'bg-yellow-500' :
                          getPasswordStrength(formData.password).strength === 4 ? 'bg-green-500' :
                          'bg-[#00D4FF]'
                        }`}
                        style={{ width: `${(getPasswordStrength(formData.password).strength / 5) * 100}%` }}
                      />
                    </div>
                    <span className={`text-xs font-medium ${getPasswordStrength(formData.password).color}`}>
                      {getPasswordStrength(formData.password).label}
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 pr-10 border border-[#9B4DE0]/30 bg-[#1A0B2E] placeholder-[#B8A8D8] text-[#F8F5FF] rounded-b-md focus:outline-none focus:ring-2 focus:ring-[#9B4DE0] focus:border-[#9B4DE0] focus:z-10 sm:text-sm"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#B8A8D8] hover:text-[#D8B4FF] transition-colors"
                >
                  {showConfirmPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-[#9B4DE0] to-[#D946EF] hover:from-[#A559E8] hover:to-[#E945E9] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#9B4DE0] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#9B4DE0]/50 hover:shadow-xl hover:shadow-[#D946EF]/50 transition-all transform hover:scale-105 disabled:transform-none"
            >
              {loading ? 'Creating account...' : 'Sign up'}
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  )
}

