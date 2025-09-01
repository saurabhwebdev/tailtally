'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';

export default function EmailSettingsForm() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [testingEmail, setTestingEmail] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [formData, setFormData] = useState({
    email: '',
    appPassword: '',
    displayName: '',
    isEnabled: true
  });
  
  const [testEmail, setTestEmail] = useState('');
  const [emailSettings, setEmailSettings] = useState(null);

  // Load existing email settings
  useEffect(() => {
    loadEmailSettings();
  }, []);

  const loadEmailSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/settings/email');
      const data = await response.json();
      
      if (response.ok && data.emailSettings) {
        setEmailSettings(data.emailSettings);
        setFormData({
          email: data.emailSettings.gmail.email || '',
          appPassword: '', // Don't populate password for security
          displayName: data.emailSettings.gmail.displayName || '',
          isEnabled: data.emailSettings.settings.isEnabled
        });
      }
    } catch (error) {
      console.error('Error loading email settings:', error);
      setMessage({ type: 'error', text: 'Failed to load email settings' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.appPassword) {
      setMessage({ type: 'error', text: 'Email and app password are required' });
      return;
    }

    try {
      setSaving(true);
      setMessage({ type: '', text: '' });

      const response = await fetch('/api/settings/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gmail: {
            email: formData.email,
            appPassword: formData.appPassword,
            displayName: formData.displayName
          },
          settings: {
            isEnabled: formData.isEnabled
          }
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setEmailSettings(data.emailSettings);
        setMessage({ type: 'success', text: 'Email settings saved successfully!' });
        // Clear password field after successful save
        setFormData(prev => ({ ...prev, appPassword: '' }));
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to save email settings' });
      }
    } catch (error) {
      console.error('Error saving email settings:', error);
      setMessage({ type: 'error', text: 'Failed to save email settings' });
    } finally {
      setSaving(false);
    }
  };

  const handleTestEmail = async () => {
    if (!testEmail) {
      setMessage({ type: 'error', text: 'Please enter a test email address' });
      return;
    }

    try {
      setTestingEmail(true);
      setMessage({ type: '', text: '' });

      const response = await fetch('/api/settings/email/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipientEmail: testEmail
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ 
          type: 'success', 
          text: `Test email sent successfully to ${testEmail}!` 
        });
        // Reload settings to get updated test status
        loadEmailSettings();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to send test email' });
      }
    } catch (error) {
      console.error('Error sending test email:', error);
      setMessage({ type: 'error', text: 'Failed to send test email' });
    } finally {
      setTestingEmail(false);
    }
  };

  const handleDeleteSettings = async () => {
    if (!confirm('Are you sure you want to delete your email settings? This action cannot be undone.')) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/settings/email', {
        method: 'DELETE',
      });

      if (response.ok) {
        setEmailSettings(null);
        setFormData({
          email: '',
          appPassword: '',
          displayName: '',
          isEnabled: true
        });
        setMessage({ type: 'success', text: 'Email settings deleted successfully' });
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.error || 'Failed to delete email settings' });
      }
    } catch (error) {
      console.error('Error deleting email settings:', error);
      setMessage({ type: 'error', text: 'Failed to delete email settings' });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Gmail Integration</h2>
        <p className="text-gray-600">
          Configure your Gmail account to send emails from the system. You'll need to generate an app password from your Google Account settings.
        </p>
      </div>

      {/* Status Card */}
      {emailSettings && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Current Configuration</h3>
              <p className="text-sm text-gray-600">Email: {emailSettings.gmail.email}</p>
              <p className="text-sm text-gray-600">
                Status: 
                <span className={`ml-1 ${emailSettings.settings.isEnabled ? 'text-green-600' : 'text-red-600'}`}>
                  {emailSettings.settings.isEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </p>
              {emailSettings.settings.lastTestDate && (
                <p className="text-sm text-gray-600">
                  Last Test: {new Date(emailSettings.settings.lastTestDate).toLocaleString()}
                  <span className={`ml-2 ${
                    emailSettings.settings.testEmailStatus === 'success' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    ({emailSettings.settings.testEmailStatus})
                  </span>
                </p>
              )}
            </div>
            <button
              onClick={handleDeleteSettings}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Delete Settings
            </button>
          </div>
        </div>
      )}

      {/* Message Display */}
      {message.text && (
        <div className={`mb-4 p-4 rounded-md ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* Configuration Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Gmail Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="your-email@gmail.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            Must be a valid Gmail address
          </p>
        </div>

        <div>
          <label htmlFor="appPassword" className="block text-sm font-medium text-gray-700 mb-2">
            Gmail App Password *
          </label>
          <input
            type="password"
            id="appPassword"
            name="appPassword"
            value={formData.appPassword}
            onChange={handleInputChange}
            placeholder="16-character app password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            maxLength={16}
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            Generate an app password from your Google Account settings. 
            <a 
              href="https://support.google.com/accounts/answer/185833" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 ml-1"
            >
              Learn how →
            </a>
          </p>
        </div>

        <div>
          <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-2">
            Display Name (Optional)
          </label>
          <input
            type="text"
            id="displayName"
            name="displayName"
            value={formData.displayName}
            onChange={handleInputChange}
            placeholder="Pet Management System"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="mt-1 text-sm text-gray-500">
            Name that will appear in the "From" field of sent emails
          </p>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isEnabled"
            name="isEnabled"
            checked={formData.isEnabled}
            onChange={handleInputChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="isEnabled" className="ml-2 block text-sm text-gray-700">
            Enable email sending
          </label>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>

      {/* Test Email Section */}
      {emailSettings && emailSettings.settings.isEnabled && (
        <div className="mt-8 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Test Email Configuration</h3>
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="Enter email to send test message"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleTestEmail}
              disabled={testingEmail || !testEmail}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {testingEmail ? 'Sending...' : 'Send Test Email'}
            </button>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Send a test email to verify your configuration is working correctly
          </p>
        </div>
      )}
    </div>
  );
}