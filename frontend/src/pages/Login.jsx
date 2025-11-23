import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authAPI } from '../services/api'
import toast from 'react-hot-toast'
import { useAuth } from '../hooks/useAuth'

export default function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await authAPI.login(formData)
      login(response.data.access_token, response.data.user)
      toast.success('Logged in successfully!')
      navigate('/dashboard')
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Invalid credentials')
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
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-[#B8A8D8]">
            Or{' '}
            <Link
              to="/signup"
              className="font-medium text-[#D8B4FF] hover:text-[#9B4DE0] transition-colors"
            >
              create a new account
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
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 pr-10 border border-[#9B4DE0]/30 bg-[#1A0B2E] placeholder-[#B8A8D8] text-[#F8F5FF] rounded-b-md focus:outline-none focus:ring-2 focus:ring-[#9B4DE0] focus:border-[#9B4DE0] focus:z-10 sm:text-sm"
                  placeholder="Password"
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
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-[#9B4DE0] to-[#D946EF] hover:from-[#A559E8] hover:to-[#E945E9] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#9B4DE0] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#9B4DE0]/50 hover:shadow-xl hover:shadow-[#D946EF]/50 transition-all transform hover:scale-105 disabled:transform-none"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  )
}

