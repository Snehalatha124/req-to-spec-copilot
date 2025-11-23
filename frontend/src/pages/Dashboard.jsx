import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useDarkMode } from '../contexts/DarkModeContext'
import { specAPI } from '../services/api'
import toast from 'react-hot-toast'
import Navbar from '../components/Navbar'
import RequirementInput from '../components/RequirementInput'
import SpecOutput from '../components/SpecOutput'
import HistoryPanel from '../components/HistoryPanel'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const { darkMode, toggleDarkMode } = useDarkMode()
  const [requirementText, setRequirementText] = useState('')
  const [specData, setSpecData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [viewMode, setViewMode] = useState('developer') // 'pm' or 'developer'
  const [showHistory, setShowHistory] = useState(false)
  const [history, setHistory] = useState([])
  const [refinementMode, setRefinementMode] = useState(false)
  const [refinementInstructions, setRefinementInstructions] = useState('')

  const loadHistory = async () => {
    try {
      const response = await specAPI.getHistory(20)
      setHistory(response.data.history)
    } catch (error) {
      console.error('Failed to load history:', error)
    }
  }

  useEffect(() => {
    loadHistory()
  }, [])

  const handleGenerate = async () => {
    if (!requirementText.trim()) {
      toast.error('Please enter requirement text')
      return
    }

    setLoading(true)
    try {
      const response = await specAPI.generate(requirementText)
      setSpecData(response.data)
      setRefinementMode(false)
      setRefinementInstructions('')
      toast.success('Specification generated successfully!')
      loadHistory()
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to generate specification')
    } finally {
      setLoading(false)
    }
  }

  const handleRefine = async () => {
    if (!refinementInstructions.trim()) {
      toast.error('Please enter refinement instructions')
      return
    }

    if (!specData) {
      toast.error('No specification to refine')
      return
    }

    setLoading(true)
    try {
      const response = await specAPI.refine(
        requirementText,
        refinementInstructions,
        specData
      )
      setSpecData(response.data)
      toast.success('Specification refined successfully!')
      loadHistory()
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to refine specification')
    } finally {
      setLoading(false)
    }
  }

  const handleLoadFromHistory = (historyItem) => {
    setRequirementText(historyItem.input_text)
    setSpecData(historyItem.output_json)
    setShowHistory(false)
    toast.success('Loaded from history')
  }

  return (
    <div className="min-h-screen bg-gradient-cosmic transition-colors relative overflow-hidden">
      {/* Animated Background */}
      <div className="animated-bg"></div>
      
      {/* Floating Particles */}
      <div className="particles">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              width: `${Math.random() * 120 + 40}px`,
              height: `${Math.random() * 120 + 40}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 20}s`,
              animationDuration: `${Math.random() * 10 + 15}s`,
              background: i % 3 === 0 
                ? 'rgba(155, 77, 224, 0.4)' 
                : i % 3 === 1 
                ? 'rgba(233, 69, 233, 0.3)' 
                : 'rgba(0, 212, 255, 0.2)',
            }}
          />
        ))}
      </div>

      <Navbar 
        user={user} 
        onLogout={logout}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
        onToggleHistory={() => setShowHistory(!showHistory)}
        showHistory={showHistory}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="animate-fadeIn">
              <RequirementInput
                value={requirementText}
                onChange={setRequirementText}
                onGenerate={handleGenerate}
                loading={loading}
              />
            </div>

            {refinementMode && specData && (
              <div className="bg-[#120A1F]/90 backdrop-blur-md rounded-xl shadow-xl border border-[#9B4DE0]/20 p-6 animate-slideIn glass hover-lift">
                <h3 className="text-lg font-semibold mb-4 text-[#F8F5FF]">
                  Refine Specification
                </h3>
                <textarea
                  value={refinementInstructions}
                  onChange={(e) => setRefinementInstructions(e.target.value)}
                  placeholder="Enter refinement instructions (e.g., 'Add authentication to all endpoints', 'Include pagination for list endpoints')"
                  className="w-full h-32 px-4 py-2 border border-[#9B4DE0]/30 rounded-lg focus:ring-2 focus:ring-[#9B4DE0] focus:border-[#9B4DE0] bg-[#1A0B2E] text-[#F8F5FF] placeholder-[#B8A8D8]"
                />
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={handleRefine}
                    disabled={loading}
                    className="px-4 py-2 bg-gradient-to-r from-[#9B4DE0] to-[#D946EF] text-white rounded-lg hover:from-[#A559E8] hover:to-[#E945E9] disabled:opacity-50 shadow-md shadow-[#9B4DE0]/50 transition-all"
                  >
                    {loading ? 'Refining...' : 'Apply Refinement'}
                  </button>
                  <button
                    onClick={() => {
                      setRefinementMode(false)
                      setRefinementInstructions('')
                    }}
                    className="px-4 py-2 bg-[#1A0B2E] text-[#B8A8D8] rounded-lg hover:bg-[#1E0D2C] border border-[#9B4DE0]/20 hover:border-[#9B4DE0]/40 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {specData && (
              <div className="animate-scaleIn">
                <SpecOutput
                  data={specData}
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                  onRefine={() => setRefinementMode(true)}
                  refinementMode={refinementMode}
                />
              </div>
            )}
          </div>

          {/* History Sidebar */}
          {showHistory && (
            <div className="lg:col-span-1 animate-slideIn">
              <HistoryPanel
                history={history}
                onLoad={handleLoadFromHistory}
                onClose={() => setShowHistory(false)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

