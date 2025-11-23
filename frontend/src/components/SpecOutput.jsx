import { useState } from 'react'
import toast from 'react-hot-toast'

export default function SpecOutput({ data, viewMode, onViewModeChange, onRefine, refinementMode }) {
  const [expandedSections, setExpandedSections] = useState({
    modules: true,
    user_stories: true,
    api_endpoints: true,
    db_schema: true,
    edge_cases: true,
  })

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const [copied, setCopied] = useState(false)

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const exportJSON = () => {
    const jsonStr = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'specification.json'
    a.click()
    URL.revokeObjectURL(url)
    toast.success('JSON exported successfully!')
  }

  const exportMarkdown = () => {
    let markdown = '# Specification\n\n'
    
    // Modules
    markdown += '## 📦 Modules/Features\n\n'
    data.modules?.forEach(module => {
      markdown += `### ${module.name}\n${module.description}\n\n`
    })
    
    // User Stories
    markdown += '## 👥 User Stories\n\n'
    data.user_stories?.forEach(story => {
      markdown += `### ${story.story}\n`
      markdown += `**Module:** ${story.module}\n`
      if (story.acceptance_criteria) {
        markdown += '**Acceptance Criteria:**\n'
        story.acceptance_criteria.forEach(criteria => {
          markdown += `- ${criteria}\n`
        })
      }
      markdown += '\n'
    })
    
    // API Endpoints
    markdown += '## 🔌 API Endpoints\n\n'
    data.api_endpoints?.forEach(endpoint => {
      markdown += `### ${endpoint.method} ${endpoint.endpoint}\n`
      markdown += `${endpoint.description}\n\n`
    })
    
    // DB Schema
    markdown += '## 🗄️ Database Schema\n\n'
    data.db_schema?.forEach(table => {
      markdown += `### ${table.table_name}\n\n`
      markdown += '| Column | Type | Constraints | Description |\n'
      markdown += '|--------|------|-------------|-------------|\n'
      table.columns?.forEach(col => {
        markdown += `| ${col.column_name} | ${col.data_type} | ${col.constraints || '-'} | ${col.description || '-'} |\n`
      })
      markdown += '\n'
    })
    
    // Edge Cases
    markdown += '## ⚠️ Edge Cases\n\n'
    data.edge_cases?.forEach(edgeCase => {
      markdown += `### ${edgeCase.scenario}\n`
      markdown += `**Module:** ${edgeCase.module}\n`
      markdown += `**Handling:** ${edgeCase.handling}\n\n`
    })
    
    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'specification.md'
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Markdown exported successfully!')
  }

  const renderPMView = () => {
    return (
      <div className="space-y-6">
        <div className="bg-[#9B4DE0]/10 border border-[#9B4DE0]/30 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-[#D8B4FF]">
            📋 Modules Overview
          </h3>
          <ul className="space-y-2">
            {data.modules?.map((module, idx) => (
              <li key={idx} className="text-[#F8F5FF]">
                <strong className="text-[#D8B4FF]">{module.name}:</strong> {module.description}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-[#00D4FF]/10 border border-[#00D4FF]/30 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-[#00D4FF]">
            👥 User Stories
          </h3>
          <ul className="space-y-3">
            {data.user_stories?.map((story, idx) => (
              <li key={idx} className="text-[#F8F5FF]">
                <p className="font-medium">{story.story}</p>
                {story.acceptance_criteria && (
                  <ul className="ml-4 mt-1 list-disc text-[#B8A8D8]">
                    {story.acceptance_criteria.map((criteria, cIdx) => (
                      <li key={cIdx} className="text-sm">{criteria}</li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  const renderDeveloperView = () => {
    return (
      <div className="space-y-6">
        {/* Modules */}
        <Section
          title="📦 Modules/Features"
          expanded={expandedSections.modules}
          onToggle={() => toggleSection('modules')}
        >
          <div className="grid gap-4">
            {data.modules?.map((module, idx) => (
              <div key={idx} className="bg-[#1A0B2E] border border-[#9B4DE0]/20 rounded-lg p-4 hover:border-[#9B4DE0]/40 transition-all">
                <h4 className="font-semibold text-[#D8B4FF]">{module.name}</h4>
                <p className="text-sm text-[#B8A8D8] mt-1">{module.description}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* User Stories */}
        <Section
          title="👥 User Stories"
          expanded={expandedSections.user_stories}
          onToggle={() => toggleSection('user_stories')}
        >
          <div className="space-y-4">
            {data.user_stories?.map((story, idx) => (
              <div key={idx} className="bg-[#1A0B2E] border border-[#9B4DE0]/20 rounded-lg p-4 hover:border-[#9B4DE0]/40 transition-all">
                <p className="font-medium text-[#F8F5FF]">{story.story}</p>
                <p className="text-sm text-[#00D4FF] mt-1">
                  Module: {story.module}
                </p>
                {story.acceptance_criteria && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-[#D8B4FF]">Acceptance Criteria:</p>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      {story.acceptance_criteria.map((criteria, cIdx) => (
                        <li key={cIdx} className="text-sm text-[#B8A8D8]">{criteria}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Section>

        {/* API Endpoints */}
        <Section
          title="🔌 API Endpoints"
          expanded={expandedSections.api_endpoints}
          onToggle={() => toggleSection('api_endpoints')}
        >
          <div className="space-y-4">
            {data.api_endpoints?.map((endpoint, idx) => (
              <div key={idx} className="bg-[#1A0B2E] border border-[#9B4DE0]/20 rounded-lg p-4 hover:border-[#9B4DE0]/40 transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 text-xs font-semibold rounded ${
                    endpoint.method === 'GET' ? 'bg-[#00D4FF]/20 text-[#00D4FF] border border-[#00D4FF]/40' :
                    endpoint.method === 'POST' ? 'bg-[#9B4DE0]/20 text-[#D8B4FF] border border-[#9B4DE0]/40' :
                    endpoint.method === 'PUT' ? 'bg-[#D946EF]/20 text-[#E945E9] border border-[#D946EF]/40' :
                    endpoint.method === 'DELETE' ? 'bg-[#E945E9]/20 text-[#E945E9] border border-[#E945E9]/40' :
                    'bg-[#1A0B2E] text-[#B8A8D8] border border-[#9B4DE0]/20'
                  }`}>
                    {endpoint.method}
                  </span>
                  <code className="text-sm font-mono text-[#F8F5FF] bg-[#120A1F] px-2 py-1 rounded">{endpoint.endpoint}</code>
                </div>
                <p className="text-sm text-[#B8A8D8] mb-2">{endpoint.description}</p>
                {endpoint.request_schema && (
                  <div className="mt-2">
                    <p className="text-xs font-medium text-[#D8B4FF]">Request Schema:</p>
                    <pre className="mt-1 p-2 bg-[#120A1F] border border-[#9B4DE0]/20 rounded text-xs overflow-x-auto text-[#B8A8D8]">
                      {JSON.stringify(endpoint.request_schema, null, 2)}
                    </pre>
                  </div>
                )}
                {endpoint.response_schema && (
                  <div className="mt-2">
                    <p className="text-xs font-medium text-[#D8B4FF]">Response Schema:</p>
                    <pre className="mt-1 p-2 bg-[#120A1F] border border-[#9B4DE0]/20 rounded text-xs overflow-x-auto text-[#B8A8D8]">
                      {JSON.stringify(endpoint.response_schema, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Section>

        {/* DB Schema */}
        <Section
          title="🗄️ Database Schema"
          expanded={expandedSections.db_schema}
          onToggle={() => toggleSection('db_schema')}
        >
          <div className="space-y-4">
            {data.db_schema?.map((table, idx) => (
              <div key={idx} className="bg-[#1A0B2E] border border-[#9B4DE0]/20 rounded-lg p-4 hover:border-[#9B4DE0]/40 transition-all">
                <h4 className="font-semibold text-[#D8B4FF] mb-2">{table.table_name}</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#9B4DE0]/30">
                        <th className="text-left py-2 px-3 text-[#D8B4FF]">Column</th>
                        <th className="text-left py-2 px-3 text-[#D8B4FF]">Type</th>
                        <th className="text-left py-2 px-3 text-[#D8B4FF]">Constraints</th>
                        <th className="text-left py-2 px-3 text-[#D8B4FF]">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {table.columns?.map((col, cIdx) => (
                        <tr key={cIdx} className="border-b border-[#9B4DE0]/10">
                          <td className="py-2 px-3 text-[#F8F5FF] font-mono">{col.column_name}</td>
                          <td className="py-2 px-3 text-[#00D4FF]">{col.data_type}</td>
                          <td className="py-2 px-3 text-[#B8A8D8]">{col.constraints || '-'}</td>
                          <td className="py-2 px-3 text-[#B8A8D8]">{col.description || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Edge Cases */}
        <Section
          title="⚠️ Edge Cases & Constraints"
          expanded={expandedSections.edge_cases}
          onToggle={() => toggleSection('edge_cases')}
        >
          <div className="space-y-4">
            {data.edge_cases?.map((edgeCase, idx) => (
              <div key={idx} className="bg-[#1A0B2E] border border-[#E945E9]/20 rounded-lg p-4 hover:border-[#E945E9]/40 transition-all">
                <p className="text-sm font-medium text-[#E945E9] mb-1">
                  Module: {edgeCase.module}
                </p>
                <p className="text-[#F8F5FF] mb-2">{edgeCase.scenario}</p>
                <p className="text-sm text-[#B8A8D8]">
                  <strong className="text-[#D8B4FF]">Handling:</strong> {edgeCase.handling}
                </p>
              </div>
            ))}
          </div>
        </Section>
      </div>
    )
  }

  return (
    <div className="bg-cosmic-panel/90 backdrop-blur-md rounded-xl shadow-xl border border-purple-vibrant/30 p-6 animate-fadeIn hover-lift glass neon-glow">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-vibrant bg-clip-text text-transparent">
            Generated Specification
          </h2>
          <p className="text-sm text-text-secondary mt-1">
            {data.modules?.length || 0} modules • {data.user_stories?.length || 0} user stories • {data.api_endpoints?.length || 0} endpoints
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="flex rounded-lg shadow-sm border border-purple-vibrant/40 overflow-hidden">
            <button
              onClick={() => onViewModeChange('pm')}
              className={`px-4 py-2 text-sm font-medium transition-all ${
                viewMode === 'pm'
                  ? 'bg-gradient-purple text-white shadow-md'
                  : 'bg-cosmic-panel text-text-secondary hover:bg-purple-vibrant/20 border-r border-purple-vibrant/30'
              }`}
            >
              📊 PM View
            </button>
            <button
              onClick={() => onViewModeChange('developer')}
              className={`px-4 py-2 text-sm font-medium transition-all ${
                viewMode === 'developer'
                  ? 'bg-gradient-purple text-white shadow-md'
                  : 'bg-cosmic-panel text-text-secondary hover:bg-purple-vibrant/20'
              }`}
            >
              💻 Dev View
            </button>
          </div>
          {!refinementMode && (
            <button
              onClick={onRefine}
              className="px-4 py-2 text-sm font-medium text-purple-light bg-purple-vibrant/20 rounded-lg hover:bg-purple-vibrant/30 border border-purple-vibrant/40 transition-all flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Refine
            </button>
          )}
          <div className="relative">
          <button
            onClick={exportJSON}
            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-cyan-neon to-purple-vibrant rounded-lg hover:opacity-90 shadow-md hover:shadow-lg transition-all flex items-center gap-2 neon-glow-cyan"
          >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export JSON
            </button>
          </div>
          <button
            onClick={exportMarkdown}
            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-vibrant to-magenta-bright rounded-lg hover:opacity-90 shadow-md hover:shadow-lg transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export MD
          </button>
          <button
            onClick={() => copyToClipboard(JSON.stringify(data, null, 2))}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 border ${
              copied 
                ? 'bg-cyan-neon/20 text-cyan-neon border-cyan-neon/50 neon-glow-cyan'
                : 'bg-cosmic-panel text-text-secondary hover:bg-purple-vibrant/20 border-purple-vibrant/30'
            }`}
          >
            {copied ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy
              </>
            )}
          </button>
        </div>
      </div>

      {viewMode === 'pm' ? renderPMView() : renderDeveloperView()}
    </div>
  )
}

function Section({ title, expanded, onToggle, children }) {
  return (
    <div className="border border-[#9B4DE0]/20 rounded-lg overflow-hidden bg-[#120A1F]">
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 bg-[#1A0B2E] hover:bg-[#1E0D2C] border-b border-[#9B4DE0]/10 flex justify-between items-center transition-all"
      >
        <span className="font-semibold text-[#D8B4FF]">{title}</span>
        <svg
          className={`w-5 h-5 text-[#9B4DE0] transform transition-transform ${
            expanded ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {expanded && (
        <div className="p-4 bg-[#120A1F]">
          {children}
        </div>
      )}
    </div>
  )
}

