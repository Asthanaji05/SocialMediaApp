import React, { useState, useEffect } from 'react';
import { Check, X, RefreshCw, Database, Cloud } from 'lucide-react';
import API from '../utils/api';

const Health = () => {
  const [checks, setChecks] = useState({
    mongodb: { status: 'loading', message: 'Checking...' },
    supabase: { status: 'loading', message: 'Checking...' }
  });
  const [loading, setLoading] = useState(false);

  const checkMongoDB = async () => {
    try {
      const response = await API.get('/health');
      setChecks(prev => ({
        ...prev,
        mongodb: { 
          status: 'connected', 
          message: 'MongoDB connection successful',
          details: response.data 
        }
      }));
    } catch (error) {
      setChecks(prev => ({
        ...prev,
        mongodb: { 
          status: 'error', 
          message: 'MongoDB connection failed',
          error: error.message 
        }
      }));
    }
  };

  const checkSupabase = async () => {
    try {
      const response = await API.get('/supabase-health');
      setChecks(prev => ({
        ...prev,
        supabase: { 
          status: 'connected', 
          message: 'Supabase connection successful',
          details: response.data 
        }
      }));
    } catch (error) {
      setChecks(prev => ({
        ...prev,
        supabase: { 
          status: 'error', 
          message: 'Supabase connection failed',
          error: error.message 
        }
      }));
    }
  };

  const runAllChecks = async () => {
    setLoading(true);
    await Promise.all([checkMongoDB(), checkSupabase()]);
    setLoading(false);
  };

  useEffect(() => {
    runAllChecks();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected':
        return <Check className="w-5 h-5 text-green-500" />;
      case 'error':
        return <X className="w-5 h-5 text-red-500" />;
      default:
        return <RefreshCw className="w-5 h-5 text-yellow-500 animate-spin" />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-28 px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">System Status</h1>
          <p className="text-gray-400">Check if all systems are operational</p>
        </div>

        {/* Refresh Button */}
        <div className="mb-6">
          <button
            onClick={runAllChecks}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-primary/20 hover:bg-primary/30 rounded-lg transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Checking...' : 'Refresh'}
          </button>
        </div>

        {/* System Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Data Storage */}
          <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Database className="w-8 h-8 text-green-500" />
              <h2 className="text-xl font-semibold">Data Storage</h2>
            </div>
            <div className="flex items-center gap-2 mb-2">
              {getStatusIcon(checks.mongodb.status)}
              <span className={`font-medium ${
                checks.mongodb.status === 'connected' ? 'text-green-400' : 
                checks.mongodb.status === 'error' ? 'text-red-400' : 
                'text-yellow-400'
              }`}>
                {checks.mongodb.status === 'connected' ? 'Operational' : 
                 checks.mongodb.status === 'error' ? 'Issues Detected' : 'Checking...'}
              </span>
            </div>
            <p className="text-sm text-gray-400">
              {checks.mongodb.status === 'connected' ? 'All systems working normally' : 'Please try again later'}
            </p>
          </div>

          {/* Authentication */}
          <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Cloud className="w-8 h-8 text-blue-500" />
              <h2 className="text-xl font-semibold">Authentication</h2>
            </div>
            <div className="flex items-center gap-2 mb-2">
              {getStatusIcon(checks.supabase.status)}
              <span className={`font-medium ${
                checks.supabase.status === 'connected' ? 'text-green-400' : 
                checks.supabase.status === 'error' ? 'text-red-400' : 
                'text-yellow-400'
              }`}>
                {checks.supabase.status === 'connected' ? 'Operational' : 
                 checks.supabase.status === 'error' ? 'Issues Detected' : 'Checking...'}
              </span>
            </div>
            <p className="text-sm text-gray-400">
              {checks.supabase.status === 'connected' ? 'Login and signup working normally' : 'Please try again later'}
            </p>
          </div>
        </div>

 {/* Status Message */}
        <div className="mt-8 text-center">
          {checks.mongodb.status === 'connected' && checks.supabase.status === 'connected' ? (
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6">
              <Check className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-green-400 mb-2">All Systems Operational</h2>
              <p className="text-gray-400">Everything is working as expected</p>
            </div>
          ) : (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6">
              <RefreshCw className="w-12 h-12 text-yellow-500 mx-auto mb-4 animate-spin" />
              <h2 className="text-2xl font-semibold text-yellow-400 mb-2">Checking Systems</h2>
              <p className="text-gray-400">Verifying all services...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Health;