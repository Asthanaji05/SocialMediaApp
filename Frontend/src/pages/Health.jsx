import React, { useState, useEffect } from 'react';
import { Check, X, AlertCircle, RefreshCw } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../utils/supabase';
import API from '../utils/api';

const Health = () => {
  const [checks, setChecks] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState(null);

  const envChecks = [
    {
      key: 'VITE_REALM_SUPABASE_URL',
      name: 'Moscownpur Supabase URL',
      required: true,
      category: 'Supabase (Moscownpur ID)'
    },
    {
      key: 'VITE_REALM_SUPABASE_ANON_KEY',
      name: 'Moscownpur Supabase Anon Key',
      required: true,
      category: 'Supabase (Moscownpur ID)'
    },
    {
      key: 'VITE_SUPABASE_URL',
      name: 'Supabase URL (Fallback)',
      required: false,
      category: 'Supabase (Moscownpur ID)'
    },
    {
      key: 'VITE_SUPABASE_ANON_KEY',
      name: 'Supabase Anon Key (Fallback)',
      required: false,
      category: 'Supabase (Moscownpur ID)'
    },
    {
      key: 'GOOGLE_CLIENT_ID',
      name: 'Google Client ID',
      required: false,
      category: 'Google OAuth'
    },
    {
      key: 'VITE_FIREBASE_API_KEY',
      name: 'Firebase API Key',
      required: false,
      category: 'Firebase (Optional)'
    },
    {
      key: 'VITE_API_URL',
      name: 'Backend API URL',
      required: false,
      category: 'API Configuration'
    }
  ];

  const checkEnvironmentVariables = () => {
    const results = {};
    
    envChecks.forEach(check => {
      const value = import.meta.env[check.key];
      results[check.key] = {
        ...check,
        present: !!value,
        value: value ? (value.length > 50 ? value.substring(0, 50) + '...' : value) : null,
        isPlaceholder: value && (value.includes('placeholder') || value.includes('your_') || value.includes('none'))
      };
    });

    setChecks(results);
  };

  const testAPIConnection = async () => {
    try {
      const response = await API.get('/health');
      setApiStatus({
        status: 'connected',
        message: 'Backend API is reachable',
        details: response.data
      });
    } catch (error) {
      setApiStatus({
        status: 'error',
        message: 'Backend API connection failed',
        error: error.message
      });
    }
  };

  const testSupabaseConnection = async () => {
    try {
      const { data, error } = await supabase.from('_health_check').select('*').limit(1);
      return {
        status: error ? 'error' : 'connected',
        message: error ? error.message : 'Supabase connection successful'
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'Supabase connection failed',
        error: error.message
      };
    }
  };

  const runAllChecks = async () => {
    setLoading(true);
    checkEnvironmentVariables();
    await testAPIConnection();
    setLoading(false);
  };

  useEffect(() => {
    runAllChecks();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected':
      case true:
        return <Check className="w-5 h-5 text-green-500" />;
      case 'error':
      case false:
        return <X className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const groupedChecks = Object.values(checks).reduce((acc, check) => {
    if (!acc[check.category]) {
      acc[check.category] = [];
    }
    acc[check.category].push(check);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">System Health Check</h1>
          <p className="text-gray-400">Verify environment configuration and service connections</p>
        </div>

        {/* Refresh Button */}
        <div className="mb-6">
          <button
            onClick={runAllChecks}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-primary/20 hover:bg-primary/30 rounded-lg transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Running Checks...' : 'Refresh Checks'}
          </button>
        </div>

        {/* Overall Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              {getStatusIcon(isSupabaseConfigured)}
              <span className="font-semibold">Moscownpur ID</span>
            </div>
            <p className="text-sm text-gray-400">
              {isSupabaseConfigured ? 'Configured' : 'Not Configured'}
            </p>
          </div>

          <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              {getStatusIcon(apiStatus?.status === 'connected')}
              <span className="font-semibold">Backend API</span>
            </div>
            <p className="text-sm text-gray-400">
              {apiStatus ? apiStatus.message : 'Not tested'}
            </p>
          </div>

          <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              {getStatusIcon(Object.values(checks).filter(c => c.required && c.present && !c.isPlaceholder).length === 
                           Object.values(checks).filter(c => c.required).length)}
              <span className="font-semibold">Required Config</span>
            </div>
            <p className="text-sm text-gray-400">
              {Object.values(checks).filter(c => c.required && c.present && !c.isPlaceholder).length}/
              {Object.values(checks).filter(c => c.required).length} Complete
            </p>
          </div>
        </div>

        {/* Environment Variables */}
        <div className="space-y-6">
          {Object.entries(groupedChecks).map(([category, categoryChecks]) => (
            <div key={category} className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">{category}</h2>
              <div className="space-y-3">
                {categoryChecks.map(check => (
                  <div key={check.key} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(check.present && !check.isPlaceholder)}
                        <div>
                          <p className="font-medium">{check.name}</p>
                          <p className="text-xs text-gray-400">{check.key}</p>
                        </div>
                      </div>
                      {check.value && (
                        <p className="text-xs text-gray-500 mt-1 font-mono">
                          {check.isPlaceholder ? '⚠️ Placeholder value detected' : check.value}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      {check.required && (
                        <span className="text-xs px-2 py-1 bg-red-500/20 text-red-400 rounded">
                          Required
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* API Status Details */}
        {apiStatus && (
          <div className="mt-6 bg-[#0a0a0a] border border-white/10 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">API Connection Details</h2>
            <div className={`p-3 rounded-lg ${
              apiStatus.status === 'connected' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
            }`}>
              <p>{apiStatus.message}</p>
              {apiStatus.error && <p className="text-sm mt-1">Error: {apiStatus.error}</p>}
              {apiStatus.details && (
                <pre className="text-xs mt-2 font-mono">
                  {JSON.stringify(apiStatus.details, null, 2)}
                </pre>
              )}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 bg-[#0a0a0a] border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Configuration Instructions</h2>
          <div className="space-y-3 text-sm text-gray-400">
            <p>• Update your <code className="bg-white/10 px-2 py-1 rounded">Frontend/.env</code> file with missing values</p>
            <p>• Get Supabase credentials from your project dashboard → Settings → API</p>
            <p>• Restart the development server after updating environment variables</p>
            <p>• Required variables must be set for Moscownpur ID login to appear</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Health;