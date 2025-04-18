import React, { useState, useEffect } from 'react';
import { runDiagnostics, testConnection, testCORS, testEndpoint } from '../debugTools/apiDebug';

// Simple styling for the debug component
const styles = {
  container: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
    fontFamily: 'monospace',
    backgroundColor: '#f5f5f5',
    border: '1px solid #ddd',
    borderRadius: '4px'
  },
  header: {
    marginTop: 0,
    marginBottom: '20px',
    color: '#333'
  },
  section: {
    marginBottom: '20px',
    padding: '15px',
    backgroundColor: 'white',
    border: '1px solid #ddd',
    borderRadius: '4px'
  },
  button: {
    padding: '8px 16px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '10px',
    marginBottom: '10px'
  },
  errorButton: {
    backgroundColor: '#f44336'
  },
  infoButton: {
    backgroundColor: '#2196F3'
  },
  pre: {
    backgroundColor: '#f9f9f9',
    padding: '10px',
    overflow: 'auto',
    borderRadius: '4px',
    border: '1px solid #eee',
    maxHeight: '300px'
  },
  input: {
    padding: '8px',
    margin: '5px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    width: '100%',
    boxSizing: 'border-box'
  },
  formGroup: {
    marginBottom: '15px'
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold'
  },
  success: {
    color: '#4CAF50',
    fontWeight: 'bold'
  },
  error: {
    color: '#f44336',
    fontWeight: 'bold'
  }
};

function APIDebugger() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [endpoint, setEndpoint] = useState('/debug/routes');
  const [method, setMethod] = useState('GET');
  const [requestData, setRequestData] = useState('');
  const [activeTab, setActiveTab] = useState('diagnostics');
  
  useEffect(() => {
    // Optionally run diagnostics on component mount
    // runApiDiagnostics();
  }, []);
  
  const runApiDiagnostics = async () => {
    setLoading(true);
    try {
      const diagnosticResults = await runDiagnostics();
      setResults(diagnosticResults);
    } catch (error) {
      console.error('Failed to run diagnostics:', error);
      setResults({ error: error.message });
    } finally {
      setLoading(false);
    }
  };
  
  const testConnectionOnly = async () => {
    setLoading(true);
    try {
      const connectionResults = await testConnection();
      setResults({ connection: connectionResults });
    } catch (error) {
      console.error('Failed to test connection:', error);
      setResults({ error: error.message });
    } finally {
      setLoading(false);
    }
  };
  
  const testCorsOnly = async () => {
    setLoading(true);
    try {
      const corsResults = await testCORS();
      setResults({ cors: corsResults });
    } catch (error) {
      console.error('Failed to test CORS:', error);
      setResults({ error: error.message });
    } finally {
      setLoading(false);
    }
  };
  
  const testCustomEndpoint = async () => {
    setLoading(true);
    try {
      let parsedData = null;
      if (requestData && method !== 'GET') {
        try {
          parsedData = JSON.parse(requestData);
        } catch (e) {
          console.warn('Request data is not valid JSON, sending as string');
          parsedData = requestData;
        }
      }
      
      const endpointResults = await testEndpoint(endpoint, method, parsedData);
      setResults({ customEndpoint: endpointResults });
    } catch (error) {
      console.error('Failed to test endpoint:', error);
      setResults({ error: error.message });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div style={styles.container}>
      <h1 style={styles.header}>API Connection Debugger</h1>
      
      <div style={styles.section}>
        <div>
          <button 
            style={styles.button} 
            onClick={() => setActiveTab('diagnostics')}
            disabled={activeTab === 'diagnostics'}
          >
            Full Diagnostics
          </button>
          <button 
            style={{...styles.button, ...(activeTab === 'connection' ? styles.infoButton : {})}} 
            onClick={() => setActiveTab('connection')}
            disabled={activeTab === 'connection'}
          >
            Connection Test
          </button>
          <button 
            style={{...styles.button, ...(activeTab === 'cors' ? styles.infoButton : {})}} 
            onClick={() => setActiveTab('cors')}
            disabled={activeTab === 'cors'}
          >
            CORS Test
          </button>
          <button 
            style={{...styles.button, ...(activeTab === 'custom' ? styles.infoButton : {})}} 
            onClick={() => setActiveTab('custom')}
            disabled={activeTab === 'custom'}
          >
            Custom Endpoint
          </button>
        </div>
        
        {activeTab === 'diagnostics' && (
          <div>
            <p>Run a comprehensive set of diagnostics to check API connectivity:</p>
            <button 
              style={styles.button} 
              onClick={runApiDiagnostics} 
              disabled={loading}
            >
              {loading ? 'Running...' : 'Run Diagnostics'}
            </button>
          </div>
        )}
        
        {activeTab === 'connection' && (
          <div>
            <p>Test basic connection to the backend server:</p>
            <button 
              style={styles.button} 
              onClick={testConnectionOnly} 
              disabled={loading}
            >
              {loading ? 'Testing...' : 'Test Connection'}
            </button>
          </div>
        )}
        
        {activeTab === 'cors' && (
          <div>
            <p>Test CORS configuration with the backend:</p>
            <button 
              style={styles.button} 
              onClick={testCorsOnly} 
              disabled={loading}
            >
              {loading ? 'Testing...' : 'Test CORS'}
            </button>
          </div>
        )}
        
        {activeTab === 'custom' && (
          <div>
            <p>Test a custom endpoint:</p>
            <div style={styles.formGroup}>
              <label style={styles.label}>Endpoint (e.g., /api/users):</label>
              <input 
                type="text" 
                style={styles.input} 
                value={endpoint} 
                onChange={(e) => setEndpoint(e.target.value)} 
                placeholder="/api/endpoint"
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>HTTP Method:</label>
              <select 
                style={styles.input} 
                value={method} 
                onChange={(e) => setMethod(e.target.value)}
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>
            {(method === 'POST' || method === 'PUT') && (
              <div style={styles.formGroup}>
                <label style={styles.label}>Request Body (JSON):</label>
                <textarea 
                  style={{...styles.input, height: '100px'}} 
                  value={requestData} 
                  onChange={(e) => setRequestData(e.target.value)} 
                  placeholder='{"key": "value"}'
                />
              </div>
            )}
            <button 
              style={styles.button} 
              onClick={testCustomEndpoint} 
              disabled={loading}
            >
              {loading ? 'Testing...' : 'Test Endpoint'}
            </button>
          </div>
        )}
      </div>
      
      {results && (
        <div style={styles.section}>
          <h3>Results:</h3>
          {results.error ? (
            <div style={styles.error}>Error: {results.error}</div>
          ) : (
            <pre style={styles.pre}>
              {JSON.stringify(results, null, 2)}
            </pre>
          )}
        </div>
      )}
      
      <div style={styles.section}>
        <h3>Environment Info:</h3>
        <pre style={styles.pre}>
          {JSON.stringify({
            nodeEnv: process.env.NODE_ENV,
            backendUrl: process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000 (default)',
            frontendUrl: window.location.origin,
            browser: navigator.userAgent
          }, null, 2)}
        </pre>
      </div>
    </div>
  );
}

export default APIDebugger; 