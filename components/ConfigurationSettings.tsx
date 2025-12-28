import React, { useState } from 'react';
import { 
  Shield, 
  Bell, 
  Cpu, 
  Database, 
  Save, 
  RefreshCw,
  ToggleLeft,
  ToggleRight,
  Sliders
} from 'lucide-react';
import { Button } from './Button';

export const ConfigurationSettings: React.FC = () => {
  const [confidenceThreshold, setConfidenceThreshold] = useState(85);
  const [autoApproval, setAutoApproval] = useState(false);
  const [emailAlerts, setEmailAlerts] = useState(true);

  return (
    <div className="w-full h-full flex flex-col bg-corporate-900 text-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-corporate-700 bg-corporate-800 rounded-t-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-white font-semibold flex items-center gap-2">
            <Sliders size={18} className="text-corporate-accentLight" />
            System Configuration
          </h3>
          <p className="text-xs text-gray-400 mt-1">Manage global risk parameters and automation rules.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="bg-corporate-900 border-corporate-700 text-gray-300 hover:text-white">
            <RefreshCw size={14} className="mr-2" /> Reset
          </Button>
          <Button variant="secondary" size="sm">
            <Save size={14} className="mr-2" /> Save Changes
          </Button>
        </div>
      </div>

      {/* Settings Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          
          {/* Automation & Risk Card */}
          <div className="bg-corporate-800 border border-corporate-700 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-corporate-700">
              <div className="p-2 bg-blue-500/10 rounded-md">
                <Shield className="text-blue-400" size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-white text-sm">Automation & Risk Control</h4>
                <p className="text-xs text-gray-500">Define confidence boundaries for AI decision making.</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm text-gray-300 font-medium">Confidence Threshold</label>
                  <span className="text-sm font-mono text-corporate-accentLight">{confidenceThreshold}%</span>
                </div>
                <input 
                  type="range" 
                  min="50" 
                  max="99" 
                  value={confidenceThreshold} 
                  onChange={(e) => setConfidenceThreshold(parseInt(e.target.value))}
                  className="w-full h-2 bg-corporate-900 rounded-lg appearance-none cursor-pointer accent-corporate-accent"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Documents with a confidence score below {confidenceThreshold}% will automatically trigger a human review task.
                </p>
              </div>

              <div className="flex items-center justify-between p-3 bg-corporate-900/50 rounded-md border border-corporate-700">
                <div className="flex flex-col">
                   <span className="text-sm text-gray-200 font-medium">Auto-Approve High Confidence</span>
                   <span className="text-xs text-gray-500">Skip manual review for scores > 98%</span>
                </div>
                <button onClick={() => setAutoApproval(!autoApproval)} className="text-corporate-accentLight transition-colors hover:text-white">
                  {autoApproval ? <ToggleRight size={32} /> : <ToggleLeft size={32} className="text-gray-600" />}
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-corporate-900/50 rounded-md border border-corporate-700">
                <div className="flex flex-col">
                   <span className="text-sm text-gray-200 font-medium">Force Audit on New Vendors</span>
                   <span className="text-xs text-gray-500">Always flag documents from unknown entities</span>
                </div>
                <button className="text-corporate-accentLight transition-colors hover:text-white">
                  <ToggleRight size={32} />
                </button>
              </div>
            </div>
          </div>

          {/* Notifications Card */}
          <div className="bg-corporate-800 border border-corporate-700 rounded-lg p-6">
             <div className="flex items-center gap-3 mb-6 pb-4 border-b border-corporate-700">
              <div className="p-2 bg-yellow-500/10 rounded-md">
                <Bell className="text-yellow-400" size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-white text-sm">Alerts & Notifications</h4>
                <p className="text-xs text-gray-500">Configure how the system communicates exceptions.</p>
              </div>
            </div>

            <div className="space-y-4">
               <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Critical Risk Alerts (Email)</span>
                  <button onClick={() => setEmailAlerts(!emailAlerts)} className="text-corporate-accentLight">
                    {emailAlerts ? <ToggleRight size={32} /> : <ToggleLeft size={32} className="text-gray-600" />}
                  </button>
               </div>
               <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Daily Digest Summary</span>
                  <button className="text-corporate-accentLight">
                    <ToggleRight size={32} />
                  </button>
               </div>
               <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">System Health Notifications</span>
                  <button className="text-gray-600">
                    <ToggleLeft size={32} />
                  </button>
               </div>

               <div className="mt-6 pt-4 border-t border-corporate-700">
                  <label className="block text-xs uppercase text-gray-500 font-semibold mb-2">Notification Email</label>
                  <input type="email" value="security-ops@axiomchain.com" readOnly className="w-full bg-corporate-900 border border-corporate-700 rounded px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-corporate-accent" />
               </div>
            </div>
          </div>

          {/* Integrations Card */}
          <div className="bg-corporate-800 border border-corporate-700 rounded-lg p-6 lg:col-span-2">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-corporate-700">
              <div className="p-2 bg-purple-500/10 rounded-md">
                <Cpu className="text-purple-400" size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-white text-sm">System Integrations</h4>
                <p className="text-xs text-gray-500">Connection status for external data sources.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <IntegrationStatus label="SAP S/4HANA" status="Connected" type="ERP" />
              <IntegrationStatus label="Oracle TMS" status="Connected" type="Transport" />
              <IntegrationStatus label="SMTP Gateway" status="Active" type="Ingestion" />
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-gray-300 font-medium flex items-center gap-2">
                  <Database size={14} /> AI Model Configuration
                </label>
              </div>
              <div className="bg-corporate-900 border border-corporate-700 rounded-md p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                   <p className="text-sm text-white font-medium">Gemini 3.0 Series</p>
                   <p className="text-xs text-gray-500">Currently utilizing Flash for extraction and Pro for audit tasks.</p>
                </div>
                <div className="px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 text-xs rounded-full font-medium">
                  API Operational
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

const IntegrationStatus: React.FC<{ label: string; status: string; type: string }> = ({ label, status, type }) => (
  <div className="bg-corporate-900 border border-corporate-700 p-4 rounded-md flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-white">{label}</p>
      <p className="text-xs text-gray-500">{type}</p>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
      <span className="text-xs text-green-400 font-medium">{status}</span>
    </div>
  </div>
);