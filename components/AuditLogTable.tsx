import React, { useState, useEffect, useMemo } from 'react';
import { 
  History, 
  Filter, 
  Download, 
  Search,
  Bot,
  User,
  Shield,
  FileText,
  Activity,
  ArrowUp,
  ArrowDown,
  ArrowUpDown
} from 'lucide-react';
import { AuditLogRecord } from '../types';

const INITIAL_LOGS: AuditLogRecord[] = [
  { id: 'LOG-9921', timestamp: 'Oct 24, 10:42:15', type: 'Validation', action: 'Confidence Score Update', details: 'Score calculated at 98% based on vendor history.', documentId: 'INV-2024-001', user: 'AI Agent' },
  { id: 'LOG-9920', timestamp: 'Oct 24, 10:42:02', type: 'System', action: 'Ingestion', details: 'Document received via SMTP Gateway.', documentId: 'INV-2024-001', user: 'System' },
  { id: 'LOG-9918', timestamp: 'Oct 24, 10:35:00', type: 'Manual', action: 'Risk Override', details: 'User cleared "Unusual Port" flag after review.', documentId: 'BOL-8821-X', user: 'Sarah Jenkins' },
  { id: 'LOG-9915', timestamp: 'Oct 24, 10:30:45', type: 'Security', action: 'Access Log', details: 'Document viewed by compliance officer.', documentId: 'BOL-8821-X', user: 'Michael Ross' },
  { id: 'LOG-9912', timestamp: 'Oct 24, 10:15:22', type: 'Validation', action: 'Field Extraction', details: 'Extracted Total Amount: $12,500.00', documentId: 'PO-9920-A', user: 'AI Agent' },
  { id: 'LOG-9910', timestamp: 'Oct 24, 10:15:20', type: 'System', action: 'OCR Processing', details: 'Completed with 99.9% character accuracy.', documentId: 'PO-9920-A', user: 'AI Agent' },
  { id: 'LOG-9908', timestamp: 'Oct 24, 09:55:10', type: 'Manual', action: 'Edit Field', details: 'Updated Invoice Date from 10/22 to 10/23', documentId: 'CUST-2210', user: 'David Chen' },
  { id: 'LOG-9905', timestamp: 'Oct 24, 09:42:05', type: 'Validation', action: 'Sanction Check', details: 'Vendor cross-referenced against OFAC list.', documentId: 'INV-2024-002', user: 'AI Agent' },
  { id: 'LOG-9901', timestamp: 'Oct 24, 09:30:00', type: 'Security', action: 'Flag Raised', details: 'Unknown sender domain detected.', documentId: 'UNK-DOC-11', user: 'System' },
  { id: 'LOG-9899', timestamp: 'Oct 24, 09:12:30', type: 'Validation', action: 'Logic Check', details: 'Line items sum matches total amount.', documentId: 'QUO-5521', user: 'AI Agent' },
];

export const AuditLogTable: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogRecord[]>(INITIAL_LOGS);
  const [sortConfig, setSortConfig] = useState<{ key: keyof AuditLogRecord; direction: 'asc' | 'desc' } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Simulate real-time stream
    const interval = setInterval(() => {
      const newLog = generateRandomLog();
      setLogs(prev => [newLog, ...prev].slice(0, 50)); // Keep most recent 50
    }, 3500); // New log every 3.5 seconds

    return () => clearInterval(interval);
  }, []);

  const handleSort = (key: keyof AuditLogRecord) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const displayedLogs = useMemo(() => {
    let data = [...logs];

    // Filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      data = data.filter(log => 
        log.details.toLowerCase().includes(query) ||
        log.documentId.toLowerCase().includes(query) ||
        log.user.toLowerCase().includes(query)
      );
    }

    // Sort
    if (sortConfig) {
      data.sort((a, b) => {
        const { key, direction } = sortConfig;
        
        let aValue = a[key];
        let bValue = b[key];

        if (key === 'timestamp') {
          const dateA = new Date(aValue).getTime();
          const dateB = new Date(bValue).getTime();
          return direction === 'asc' ? dateA - dateB : dateB - dateA;
        }

        if (aValue < bValue) {
          return direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return data;
  }, [logs, sortConfig, searchQuery]);

  const getSortIcon = (key: keyof AuditLogRecord) => {
    if (sortConfig?.key === key) {
      return sortConfig.direction === 'asc' ? <ArrowUp size={14} className="text-corporate-accentLight" /> : <ArrowDown size={14} className="text-corporate-accentLight" />;
    }
    return <ArrowUpDown size={14} className="text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />;
  };

  const HeaderCell = ({ 
    label, 
    sortKey, 
    sortable = true 
  }: { 
    label: string, 
    sortKey?: keyof AuditLogRecord, 
    sortable?: boolean 
  }) => {
    if (!sortable || !sortKey) {
      return (
        <th className="px-6 py-4 font-medium tracking-wider">
          {label}
        </th>
      );
    }

    return (
      <th 
        className="px-6 py-4 font-medium tracking-wider cursor-pointer hover:bg-corporate-800 transition-colors group select-none"
        onClick={() => handleSort(sortKey)}
      >
        <div className="flex items-center gap-2">
          {label}
          {getSortIcon(sortKey)}
        </div>
      </th>
    );
  };

  return (
    <div className="w-full flex flex-col h-full">
      {/* Toolbar */}
      <div className="px-6 py-4 border-b border-corporate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-corporate-800 rounded-t-lg">
        <h3 className="text-white font-semibold flex items-center gap-3">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-corporate-accentLight opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-corporate-accentLight"></span>
          </div>
          <span className="flex items-center gap-2">
            System Audit Log
            <span className="text-[10px] bg-corporate-900 border border-corporate-700 px-2 py-0.5 rounded text-gray-400 font-mono">LIVE</span>
          </span>
        </h3>
        <div className="flex gap-2">
          <div className="relative">
             <Search className="w-3 h-3 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
             <input 
               type="text" 
               placeholder="Search logs..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="pl-8 pr-3 py-1.5 text-xs bg-corporate-900 border border-corporate-700 text-gray-200 rounded focus:outline-none focus:border-corporate-accentLight w-40 placeholder-gray-600 transition-all focus:w-48"
             />
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-300 bg-corporate-900 border border-corporate-700 rounded hover:bg-corporate-700 transition-colors">
            <Filter size={14} /> Filter
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-300 bg-corporate-900 border border-corporate-700 rounded hover:bg-corporate-700 transition-colors">
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="flex-1 overflow-x-auto bg-corporate-800 custom-scrollbar">
        <table className="w-full text-left text-sm text-gray-400">
          <thead className="bg-corporate-900/90 text-xs uppercase font-semibold text-gray-500 sticky top-0 z-10 backdrop-blur-sm shadow-sm">
            <tr>
              <HeaderCell label="Timestamp" sortKey="timestamp" />
              <HeaderCell label="Type" sortKey="type" />
              <HeaderCell label="Action" sortKey="action" />
              <HeaderCell label="Details" sortable={false} />
              <HeaderCell label="Document" sortKey="documentId" />
              <HeaderCell label="User" sortKey="user" />
            </tr>
          </thead>
          <tbody className="divide-y divide-corporate-700">
            {displayedLogs.map((log, index) => (
              <tr key={log.id} className={`group hover:bg-corporate-700/30 transition-all duration-500 ${!sortConfig && !searchQuery && index === 0 ? 'animate-in fade-in slide-in-from-left-2 bg-corporate-700/10' : ''}`}>
                {/* Timestamp */}
                <td className="px-6 py-3 whitespace-nowrap font-mono text-xs text-gray-500">
                  {log.timestamp}
                </td>

                {/* Type */}
                <td className="px-6 py-3 whitespace-nowrap">
                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wide ${
                    log.type === 'Validation' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                    log.type === 'Security' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                    log.type === 'Manual' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                    'bg-gray-700 text-gray-400 border border-gray-600'
                  }`}>
                    {log.type}
                  </span>
                </td>

                {/* Action */}
                <td className="px-6 py-3 text-gray-200 font-medium text-xs">
                  {log.action}
                </td>

                {/* Details */}
                <td className="px-6 py-3 text-gray-400 text-xs max-w-xs truncate" title={log.details}>
                  {log.details}
                </td>

                {/* Document */}
                <td className="px-6 py-3">
                  <div className="flex items-center gap-2 text-corporate-accentLight text-xs font-mono hover:underline cursor-pointer">
                    <FileText size={12} />
                    {log.documentId}
                  </div>
                </td>

                {/* User */}
                <td className="px-6 py-3">
                  <div className="flex items-center gap-2">
                    {log.user === 'AI Agent' || log.user === 'System' ? (
                      <div className="w-6 h-6 rounded-full bg-corporate-700 flex items-center justify-center text-corporate-400">
                        <Bot size={14} />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-indigo-900/50 flex items-center justify-center text-indigo-400 border border-indigo-500/30">
                        <User size={14} />
                      </div>
                    )}
                    <span className={`text-xs ${log.user === 'AI Agent' || log.user === 'System' ? 'text-corporate-400 italic' : 'text-gray-300'}`}>
                      {log.user}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {displayedLogs.length === 0 && (
          <div className="w-full py-10 flex flex-col items-center justify-center text-gray-500 text-sm">
            <Search className="w-6 h-6 mb-2 text-corporate-600" />
            <p>No logs found matching "{searchQuery}"</p>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="px-6 py-3 border-t border-corporate-700 bg-corporate-900/30 flex items-center justify-end text-xs text-gray-500">
         <span className="flex items-center gap-2">
           <Shield size={12} className="text-corporate-accentLight" />
           Immutable Ledger Active • {displayedLogs.length} Records Found
         </span>
      </div>
    </div>
  );
};

// Helper for generating random logs
function generateRandomLog(): AuditLogRecord {
  const types: AuditLogRecord['type'][] = ['System', 'Manual', 'Security', 'Validation'];
  const type = types[Math.floor(Math.random() * types.length)];
  
  let action = '';
  let details = '';
  let user = '';
  
  const docPrefixes = ['INV', 'BOL', 'PO', 'QUO', 'CER'];
  const docId = `${docPrefixes[Math.floor(Math.random() * docPrefixes.length)]}-${Math.floor(Math.random() * 10000) + 2024}`;

  const users = ['Sarah Jenkins', 'Michael Ross', 'David Chen', 'Elena Rodriguez', 'Marcus Thorne'];

  switch (type) {
    case 'System':
      const sysActions = [
        { a: 'Ingestion', d: 'Received via secure gateway.' },
        { a: 'OCR Processing', d: 'Text layer extraction complete.' },
        { a: 'Archival', d: 'Document moved to cold storage.' },
        { a: 'Indexing', d: 'Search index updated.' }
      ];
      const sa = sysActions[Math.floor(Math.random() * sysActions.length)];
      action = sa.a;
      details = sa.d;
      user = 'System';
      break;
    case 'Validation':
      const valActions = [
        { a: 'Logic Check', d: 'Cross-referenced with ERP data.' },
        { a: 'Confidence Score', d: 'Confidence updated to 99%.' },
        { a: 'Field Extraction', d: 'Vendor tax ID verified.' },
        { a: 'Sanction Check', d: 'Passed OFAC screening.' }
      ];
      const va = valActions[Math.floor(Math.random() * valActions.length)];
      action = va.a;
      details = va.d;
      user = 'AI Agent';
      break;
    case 'Security':
      const secActions = [
        { a: 'Access Log', d: 'Encrypted view session started.' },
        { a: 'Flag Raised', d: 'Unusual access pattern detected.' },
        { a: 'Export', d: 'User exported document metadata.' }
      ];
      const sc = secActions[Math.floor(Math.random() * secActions.length)];
      action = sc.a;
      details = sc.d;
      user = users[Math.floor(Math.random() * users.length)];
      break;
    case 'Manual':
      const manActions = [
        { a: 'Risk Override', d: 'Manual clearance of flagged item.' },
        { a: 'Edit Field', d: 'Correction applied to invoice date.' },
        { a: 'Comment', d: 'Added internal note: "Pending approval".' }
      ];
      const ma = manActions[Math.floor(Math.random() * manActions.length)];
      action = ma.a;
      details = ma.d;
      user = users[Math.floor(Math.random() * users.length)];
      break;
  }

  const now = new Date();
  const timestamp = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ', ' + now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return {
    id: `LOG-${Math.floor(Math.random() * 1000000)}`,
    timestamp,
    type,
    action,
    details,
    documentId: docId,
    user
  };
}