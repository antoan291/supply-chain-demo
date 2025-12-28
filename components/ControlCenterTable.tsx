import React from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  MoreHorizontal, 
  Filter, 
  Download,
  ExternalLink
} from 'lucide-react';
import { DocumentRecord } from '../types';

const MOCK_DATA: DocumentRecord[] = [
  { id: 'INV-2024-001', type: 'Invoice', supplier: 'Global Logistics Partners', confidence: 98, issues: 0, received: '10:42 AM', status: 'Processed' },
  { id: 'BOL-8821-X', type: 'Bill of Lading', supplier: 'Maersk Line', confidence: 92, issues: 0, received: '10:38 AM', status: 'Processed' },
  { id: 'PO-9920-A', type: 'Purchase Order', supplier: 'TechTronix Components', confidence: 65, issues: 2, received: '10:15 AM', status: 'Review Required' },
  { id: 'CUST-2210', type: 'Customs Decl.', supplier: 'FedEx Trade Networks', confidence: 88, issues: 1, received: '09:55 AM', status: 'Review Required' },
  { id: 'INV-2024-002', type: 'Invoice', supplier: 'FastTrack Shipping', confidence: 99, issues: 0, received: '09:42 AM', status: 'Processed' },
  { id: 'UNK-DOC-11', type: 'Unclassified', supplier: 'Unknown Sender', confidence: 24, issues: 5, received: '09:30 AM', status: 'Rejected' },
  { id: 'QUO-5521', type: 'Rate Quote', supplier: 'DHL Global', confidence: 94, issues: 0, received: '09:12 AM', status: 'Processed' },
  { id: 'INV-2024-003', type: 'Invoice', supplier: 'Global Logistics Partners', confidence: 97, issues: 0, received: '08:50 AM', status: 'Processed' },
  { id: 'CER-ISO-99', type: 'Certificate', supplier: 'SGS Inspection', confidence: 45, issues: 0, received: '08:45 AM', status: 'Analyzing' },
  { id: 'BOL-8822-Y', type: 'Bill of Lading', supplier: 'Hapag-Lloyd', confidence: 91, issues: 0, received: '08:30 AM', status: 'Processed' },
];

export const ControlCenterTable: React.FC = () => {
  return (
    <div className="w-full">
      {/* Table Toolbar */}
      <div className="px-6 py-4 border-b border-corporate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-corporate-800">
        <h3 className="text-white font-semibold flex items-center gap-2">
          Incoming Stream
          <span className="bg-corporate-700 text-gray-300 text-xs px-2 py-0.5 rounded-full">Live</span>
        </h3>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-300 bg-corporate-900 border border-corporate-700 rounded hover:bg-corporate-700 transition-colors">
            <Filter size={14} /> Filter
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-300 bg-corporate-900 border border-corporate-700 rounded hover:bg-corporate-700 transition-colors">
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-400">
          <thead className="bg-corporate-900/50 text-xs uppercase font-semibold text-gray-500">
            <tr>
              <th className="px-6 py-4 font-medium tracking-wider">Status</th>
              <th className="px-6 py-4 font-medium tracking-wider">Document ID</th>
              <th className="px-6 py-4 font-medium tracking-wider">Type</th>
              <th className="px-6 py-4 font-medium tracking-wider">Supplier</th>
              <th className="px-6 py-4 font-medium tracking-wider">Confidence</th>
              <th className="px-6 py-4 font-medium tracking-wider">Issues</th>
              <th className="px-6 py-4 font-medium tracking-wider">Received</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-corporate-700">
            {MOCK_DATA.map((row) => (
              <tr key={row.id} className="group hover:bg-corporate-700/30 transition-colors">
                {/* Status Column */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={row.status} />
                </td>
                
                {/* ID Column */}
                <td className="px-6 py-4 font-mono text-white text-xs">
                  {row.id}
                </td>

                {/* Type Column */}
                <td className="px-6 py-4 text-gray-300">
                  {row.type}
                </td>

                {/* Supplier Column */}
                <td className="px-6 py-4 text-gray-300">
                  {row.supplier}
                </td>

                {/* Confidence Column */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-1.5 bg-corporate-900 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          row.confidence > 90 ? 'bg-green-500' : 
                          row.confidence > 70 ? 'bg-yellow-500' : 'bg-red-500'
                        }`} 
                        style={{ width: `${row.confidence}%` }}
                      ></div>
                    </div>
                    <span className={`text-xs font-medium ${
                       row.confidence > 90 ? 'text-green-400' : 
                       row.confidence > 70 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {row.confidence}%
                    </span>
                  </div>
                </td>

                {/* Issues Column */}
                <td className="px-6 py-4">
                  {row.issues > 0 ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                      <AlertTriangle size={12} /> {row.issues}
                    </span>
                  ) : (
                    <span className="text-gray-600 text-xs">-</span>
                  )}
                </td>

                {/* Received Column */}
                <td className="px-6 py-4 text-gray-500 text-xs">
                  {row.received}
                </td>

                {/* Actions Column */}
                <td className="px-6 py-4 text-right">
                  <button className="text-gray-500 hover:text-white transition-colors">
                    <MoreHorizontal size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination / Footer */}
      <div className="px-6 py-4 border-t border-corporate-700 bg-corporate-900/30 flex items-center justify-between text-xs text-gray-500">
        <div>Showing 1-10 of 1,420 records</div>
        <div className="flex gap-2">
          <button className="px-3 py-1 rounded bg-corporate-800 border border-corporate-700 hover:bg-corporate-700 hover:text-gray-300 disabled:opacity-50" disabled>Previous</button>
          <button className="px-3 py-1 rounded bg-corporate-800 border border-corporate-700 hover:bg-corporate-700 hover:text-gray-300">Next</button>
        </div>
      </div>
    </div>
  );
};

const StatusBadge: React.FC<{ status: DocumentRecord['status'] }> = ({ status }) => {
  switch (status) {
    case 'Processed':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
          <CheckCircle2 size={12} /> Processed
        </span>
      );
    case 'Review Required':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
          <Clock size={12} /> Review
        </span>
      );
    case 'Rejected':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
          <AlertTriangle size={12} /> Rejected
        </span>
      );
    case 'Analyzing':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 animate-pulse">
          <Clock size={12} /> Analyzing
        </span>
      );
    default:
      return null;
  }
};