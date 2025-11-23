import { useState } from 'react'
import toast from 'react-hot-toast'

const TEMPLATES = [
  {
    name: 'E-commerce Platform',
    text: 'Build an e-commerce platform with user authentication, product catalog, shopping cart, and checkout functionality. Users should be able to search products, add items to cart, and complete purchases with payment integration.'
  },
  {
    name: 'Social Media App',
    text: 'Create a social media application where users can create profiles, post content, follow other users, like and comment on posts, and receive notifications for interactions.'
  },
  {
    name: 'Task Management',
    text: 'Develop a task management system with project creation, task assignment, due dates, priority levels, status tracking, and team collaboration features.'
  },
  {
    name: 'Blog Platform',
    text: 'Build a blogging platform with user registration, post creation and editing, categories and tags, comments system, and admin dashboard for content management.'
  },
  {
    name: 'Food Delivery App',
    text: 'Create a food delivery application with restaurant listings, menu browsing, order placement, real-time tracking, payment processing, and delivery management. Include features for customers, restaurants, and delivery drivers.'
  },
  {
    name: 'Learning Management System',
    text: 'Build an LMS platform with course creation, student enrollment, video lessons, quizzes and assessments, progress tracking, certificates, and instructor dashboards.'
  },
  {
    name: 'Hotel Booking System',
    text: 'Develop a hotel booking platform with room search and filtering, availability calendar, reservation management, payment processing, guest reviews, and admin panel for hotel management.'
  },
  {
    name: 'Healthcare Appointment System',
    text: 'Create a healthcare appointment booking system with doctor profiles, appointment scheduling, patient records, prescription management, video consultations, and notifications.'
  },
  {
    name: 'Real Estate Platform',
    text: 'Build a real estate platform with property listings, advanced search filters, virtual tours, agent profiles, mortgage calculator, saved searches, and inquiry management.'
  },
  {
    name: 'Fitness Tracking App',
    text: 'Develop a fitness tracking application with workout logging, exercise library, progress charts, goal setting, social features, nutrition tracking, and wearable device integration.'
  },
  {
    name: 'Event Management System',
    text: 'Create an event management platform with event creation, ticket sales, attendee management, check-in system, event analytics, and marketing tools.'
  },
  {
    name: 'Job Portal',
    text: 'Build a job portal with job postings, resume uploads, application tracking, candidate search for employers, job recommendations, and interview scheduling.'
  }
]

export default function RequirementInput({ value, onChange, onGenerate, loading }) {
  const [showTemplates, setShowTemplates] = useState(false)
  const [charCount, setCharCount] = useState(0)

  const handleChange = (e) => {
    const newValue = e.target.value
    onChange(newValue)
    setCharCount(newValue.length)
  }

  const loadTemplate = (template) => {
    onChange(template.text)
    setCharCount(template.text.length)
    setShowTemplates(false)
    toast.success(`Template "${template.name}" loaded`)
  }

  return (
    <div className="bg-cosmic-panel/90 backdrop-blur-md rounded-xl shadow-xl border border-purple-vibrant/30 p-6 animate-fadeIn hover-lift glass neon-glow">
      <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold bg-gradient-vibrant bg-clip-text text-transparent">
            Enter Requirements
          </h2>
        <div className="flex gap-2">
            <button
              onClick={() => setShowTemplates(!showTemplates)}
              className="px-4 py-2 text-sm font-medium text-purple-light bg-purple-vibrant/20 rounded-lg hover:bg-purple-vibrant/30 border border-purple-vibrant/40 transition-all flex items-center gap-2"
            >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            Templates
          </button>
          {value && (
            <button
              onClick={() => {
                onChange('')
                setCharCount(0)
              }}
              className="px-4 py-2 text-sm font-medium text-text-secondary bg-cosmic-panel rounded-lg hover:bg-purple-vibrant/20 border border-purple-vibrant/30 transition-all"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {showTemplates && (
        <div className="mb-4 p-4 bg-gradient-to-r from-[#9B4DE0]/10 to-[#D946EF]/10 rounded-lg border border-[#9B4DE0]/30 animate-fadeIn">
          <h3 className="text-sm font-semibold text-[#D8B4FF] mb-3 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            Quick Templates ({TEMPLATES.length} available):
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
            {TEMPLATES.map((template, idx) => (
              <button
                key={idx}
                onClick={() => loadTemplate(template)}
                className="text-left px-3 py-2 text-sm bg-[#1A0B2E] text-[#F8F5FF] rounded-md hover:bg-[#9B4DE0]/20 transition-all border border-[#9B4DE0]/20 hover:border-[#9B4DE0]/40 hover:shadow-md hover:shadow-[#9B4DE0]/30 transform hover:scale-105 group"
              >
                <span className="group-hover:text-[#D8B4FF] transition-colors">{template.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="relative">
        <textarea
          value={value}
          onChange={handleChange}
          placeholder="Paste your raw requirement text here...&#10;&#10;Example:&#10;Build an e-commerce platform with user authentication, product catalog, shopping cart, and checkout functionality. Users should be able to search products, add items to cart, and complete purchases with payment integration."
          className="w-full h-64 px-4 py-3 border-2 border-purple-vibrant/30 rounded-lg focus:ring-2 focus:ring-purple-vibrant focus:border-purple-vibrant bg-cosmic-panel/50 text-text-light placeholder-text-secondary resize-none transition-all"
        />
        <div className="absolute bottom-3 right-3 text-xs text-text-secondary">
          {charCount} characters
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={onGenerate}
          disabled={loading || !value.trim()}
          className="px-8 py-3 bg-gradient-purple text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all flex items-center gap-2 font-semibold transform hover:scale-105 disabled:transform-none neon-glow"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Generate Specification
            </>
          )}
        </button>
      </div>
    </div>
  )
}

