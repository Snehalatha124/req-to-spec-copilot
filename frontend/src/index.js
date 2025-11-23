import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

console.log('=== Starting React App ===')
console.log('React version:', React.version)

const rootElement = document.getElementById('root')

if (!rootElement) {
  document.body.innerHTML = '<h1 style="color: red; padding: 20px;">ERROR: Root element not found!</h1>'
} else {
  console.log('Root element found')
  
  try {
    const root = ReactDOM.createRoot(rootElement)
    
    // First render a simple test
    const TestComponent = () => {
      console.log('TestComponent rendering')
      return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f0f0f0' }}>
          <h1 style={{ color: '#333' }}>✅ React is Working!</h1>
          <p>If you see this, React is rendering correctly.</p>
          <p>Now loading full application...</p>
        </div>
      )
    }
    
    root.render(<TestComponent />)
    console.log('Test component rendered')
    
    // Load full app after a short delay
    setTimeout(() => {
      console.log('Loading App component...')
      import('./App.jsx')
        .then((module) => {
          console.log('App module loaded successfully')
          const App = module.default
          if (!App) {
            throw new Error('App component is not exported as default')
          }
          root.render(
            <React.StrictMode>
              <App />
            </React.StrictMode>
          )
          console.log('Full app rendered successfully')
        })
        .catch((error) => {
          console.error('Error loading App component:', error)
          root.render(
            <div style={{ padding: '20px', color: 'red', fontFamily: 'Arial' }}>
              <h1>❌ Error Loading App</h1>
              <p><strong>Error:</strong> {error.message}</p>
              <details style={{ marginTop: '10px' }}>
                <summary style={{ cursor: 'pointer' }}>Stack Trace (click to expand)</summary>
                <pre style={{ background: '#f0f0f0', padding: '10px', overflow: 'auto', fontSize: '12px' }}>
                  {error.stack}
                </pre>
              </details>
            </div>
          )
        })
    }, 500)
    
  } catch (error) {
    console.error('Error in initial render:', error)
    rootElement.innerHTML = `
      <div style="padding: 20px; color: red; font-family: Arial;">
        <h1>Fatal Error</h1>
        <p>${error.message}</p>
        <pre style="background: #f0f0f0; padding: 10px; overflow: auto;">${error.stack}</pre>
      </div>
    `
  }
}
