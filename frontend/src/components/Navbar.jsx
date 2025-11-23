import { useAuth } from '../hooks/useAuth'
import { useDarkMode } from '../contexts/DarkModeContext'

export default function Navbar({ user, onLogout, darkMode, onToggleDarkMode, onToggleHistory, showHistory }) {
  return (
    <nav className="bg-cosmic-panel/90 backdrop-blur-lg shadow-lg border-b border-purple-vibrant/30 sticky top-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-purple rounded-lg flex items-center justify-center neon-glow">
                <span className="text-white font-bold text-sm">RS</span>
              </div>
              <h1 className="text-xl font-bold bg-gradient-vibrant bg-clip-text text-transparent">
                Requirements → Spec Copilot
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleHistory}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${
                showHistory
                  ? 'bg-purple-vibrant/30 text-purple-light border border-purple-vibrant/50'
                  : 'text-text-secondary hover:bg-cosmic-panel border border-transparent hover:border-purple-vibrant/30'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {showHistory ? 'Hide' : 'Show'} History
            </button>
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-lg text-[#B8A8D8] hover:text-[#D8B4FF] hover:bg-[#1A0B2E] transition-all"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            <div className="flex items-center gap-3 pl-3 border-l border-purple-vibrant/30">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-purple rounded-full flex items-center justify-center text-white font-semibold text-sm neon-glow">
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-text-light">
                  {user?.username}
                </span>
              </div>
              <button
                onClick={onLogout}
                className="px-4 py-2 text-sm font-medium text-magenta-bright hover:text-magenta-bright-alt hover:bg-magenta-bright/10 rounded-lg transition-all border border-transparent hover:border-magenta-bright/30"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

