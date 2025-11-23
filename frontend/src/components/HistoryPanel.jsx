import { useState } from 'react'

export default function HistoryPanel({ history, onLoad, onClose }) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredHistory = history.filter(item =>
    item.input_text.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="bg-[#120A1F]/90 backdrop-blur-md rounded-xl shadow-xl border border-[#9B4DE0]/20 p-6 h-[calc(100vh-8rem)] overflow-y-auto glass">
      <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold bg-gradient-to-r from-[#9B4DE0] via-[#D946EF] to-[#00D4FF] bg-clip-text text-transparent">
            📜 History
          </h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {history.length > 0 && (
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search history..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border-2 border-[#9B4DE0]/30 bg-[#1A0B2E] text-[#F8F5FF] rounded-lg focus:ring-2 focus:ring-[#9B4DE0] focus:border-[#9B4DE0] placeholder-[#B8A8D8] transition-all"
          />
        </div>
      )}
      
      {filteredHistory.length === 0 ? (
        <div className="text-center py-12">
          <svg className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-[#B8A8D8]">
            {searchQuery ? 'No results found' : 'No history yet'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredHistory.map((item) => (
            <div
              key={item.id}
              className="border-2 border-[#9B4DE0]/20 rounded-lg p-4 hover:border-[#9B4DE0]/50 hover:shadow-md hover:shadow-[#9B4DE0]/30 cursor-pointer transition-all bg-gradient-to-r from-[#120A1F] to-[#1A0B2E]"
              onClick={() => onLoad(item)}
            >
              <div className="flex justify-between items-start mb-2">
                <span className={`text-xs px-2 py-1 rounded font-semibold ${
                  item.request_type === 'generate'
                    ? 'bg-gradient-to-r from-[#00D4FF] to-[#00A8CC] text-white shadow-sm shadow-[#00D4FF]/50'
                    : 'bg-gradient-to-r from-[#9B4DE0] to-[#D946EF] text-white shadow-sm shadow-[#9B4DE0]/50'
                }`}>
                  {item.request_type === 'generate' ? '✨ Generate' : '🔧 Refine'}
                </span>
                <span className="text-xs text-[#B8A8D8]">
                  {new Date(item.created_at).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              <p className="text-sm text-[#F8F5FF] line-clamp-3 font-medium">
                {item.input_text.substring(0, 120)}
                {item.input_text.length > 120 && '...'}
              </p>
              <div className="mt-2 flex gap-2 text-xs text-[#B8A8D8]">
                <span>{item.output_json?.modules?.length || 0} modules</span>
                <span>•</span>
                <span>{item.output_json?.user_stories?.length || 0} stories</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
