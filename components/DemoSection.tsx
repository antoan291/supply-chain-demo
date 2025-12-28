import React, { useState } from 'react';
import { performQuickExtraction, performDeepAudit, performMarketContextCheck } from '../services/geminiService';
import { DocumentAnalysisResult, AnalysisType, WorkbenchDocument } from '../types';
import { Button } from './Button';
import { 
  Zap, 
  ShieldCheck, 
  Search, 
  ArrowRight, 
  Copy, 
  Maximize2,
  AlertTriangle,
  CheckCircle2,
  Terminal,
  RefreshCw,
  FileText,
  Plus,
  History,
  Save,
  Lock,
  Unlock,
  ChevronRight,
  BrainCircuit,
  PenLine
} from 'lucide-react';

const MOCK_DOCS: WorkbenchDocument[] = [
  {
    id: 'DOC-001',
    title: 'Invoice #INV-2024-001',
    content: "Invoice #INV-2024-001 issued by Global Logistics Partners Ltd for $45,200.00 USD regarding shipment of semiconductor components via air freight. Payment terms: Net 60. Note: Fuel surcharge adjustment pending per Q3 index.",
    status: 'draft',
    lastModified: 'Just now',
    history: [{ action: 'Created', timestamp: '10:42 AM', user: 'System' }]
  },
  {
    id: 'DOC-002',
    title: 'Email Quote: Maersk',
    content: "From: sales@maersk.com\nSubject: Rate Quote Q4\n\nDear team,\nFollowing our call, we can offer a spot rate of $2,400 per 40HC for the Shanghai -> Rotterdam route. Valid until Nov 15th. Subject to GRI.",
    status: 'draft',
    lastModified: '10 min ago',
    history: [{ action: 'Ingested', timestamp: '10:30 AM', user: 'Email Gateway' }]
  },
  {
    id: 'DOC-003',
    title: 'Customs Declaration',
    content: "HS Code: 8542.31.0000\nDescription: Processors and controllers, whether or not combined with memories, converters, logic circuits, amplifiers, clock and timing circuits, or other circuits.\nOrigin: Taiwan\nValue: $125,000",
    status: 'draft',
    lastModified: '1 hour ago',
    history: [{ action: 'Uploaded', timestamp: '09:15 AM', user: 'User Upload' }]
  }
];

export const DocumentWorkbench: React.FC = () => {
  const [documents, setDocuments] = useState<WorkbenchDocument[]>(MOCK_DOCS);
  const [selectedDocId, setSelectedDocId] = useState<string>(MOCK_DOCS[0].id);
  const [loading, setLoading] = useState(false);

  const selectedDoc = documents.find(d => d.id === selectedDocId);

  const updateDocument = (id: string, updates: Partial<WorkbenchDocument>) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === id ? { ...doc, ...updates } : doc
    ));
  };

  const handleAnalysis = async (type: AnalysisType) => {
    if (!selectedDoc) return;
    
    setLoading(true);
    updateDocument(selectedDocId, { status: 'analyzing' });

    try {
      let data: DocumentAnalysisResult;
      const contentToAnalyze = selectedDoc.content;

      switch (type) {
        case AnalysisType.QUICK_EXTRACTION:
          data = await performQuickExtraction(contentToAnalyze);
          break;
        case AnalysisType.DEEP_AUDIT:
          data = await performDeepAudit(contentToAnalyze);
          break;
        case AnalysisType.MARKET_CONTEXT:
          data = await performMarketContextCheck(contentToAnalyze);
          break;
        default:
          throw new Error("Invalid analysis type");
      }

      updateDocument(selectedDocId, {
        status: 'analyzed',
        analysisResult: data,
        analysisType: type,
        history: [
          { action: `Analyzed (${type})`, timestamp: new Date().toLocaleTimeString(), user: 'AI Agent' },
          ...selectedDoc.history
        ]
      });
    } catch (error) {
      console.error(error);
      alert("Analysis service is currently initializing. Please check API Key configuration.");
      updateDocument(selectedDocId, { status: 'draft' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = () => {
    if (!selectedDoc) return;
    updateDocument(selectedDocId, {
      status: 'verified',
      history: [
        { action: 'Verified & Trained', timestamp: new Date().toLocaleTimeString(), user: 'Operator' },
        ...selectedDoc.history
      ]
    });
  };

  const handleUnlock = () => {
    if (!selectedDoc) return;
    updateDocument(selectedDocId, {
      status: 'draft',
      history: [
        { action: 'Unlocked for Edit', timestamp: new Date().toLocaleTimeString(), user: 'Operator' },
        ...selectedDoc.history
      ]
    });
  };

  const handleContentChange = (newContent: string) => {
    if (!selectedDoc) return;
    // Strict guard: Do not allow edits if verified
    if (selectedDoc.status === 'verified') return;
    updateDocument(selectedDocId, { content: newContent });
  };

  return (
    <div className="flex flex-col md:flex-row h-auto md:h-[650px] bg-corporate-900 border border-corporate-700 rounded-lg overflow-hidden shadow-2xl">
      
      {/* Sidebar: Document List */}
      <div className="w-full md:w-64 bg-corporate-950 border-r border-corporate-800 flex flex-col shrink-0 h-48 md:h-auto border-b md:border-b-0">
        <div className="p-4 border-b border-corporate-800 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Work Queue</h3>
          <button className="text-gray-400 hover:text-white transition-colors">
            <Plus size={16} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
          {documents.map(doc => (
            <button
              key={doc.id}
              onClick={() => setSelectedDocId(doc.id)}
              className={`w-full text-left p-3 rounded-md transition-all group ${
                selectedDocId === doc.id 
                  ? 'bg-corporate-800 border-l-2 border-corporate-accentLight ring-1 ring-white/5' 
                  : 'hover:bg-corporate-800/50 border-l-2 border-transparent'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className={`text-xs font-medium truncate flex-1 ${selectedDocId === doc.id ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>
                  {doc.title}
                </span>
                {doc.status === 'verified' && <CheckCircle2 size={12} className="text-green-500 shrink-0 ml-2" />}
                {doc.status === 'analyzed' && <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0 ml-2 mt-1"></div>}
              </div>
              <p className="text-[10px] text-gray-500 truncate">{doc.content}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-[10px] text-gray-600">{doc.lastModified}</span>
                <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded ${
                  doc.status === 'verified' ? 'bg-green-500/10 text-green-500' :
                  doc.status === 'analyzed' ? 'bg-blue-500/10 text-blue-400' :
                  'bg-gray-800 text-gray-500'
                }`}>
                  {doc.status}
                </span>
              </div>
            </button>
          ))}
        </div>
        <div className="p-3 bg-corporate-950 border-t border-corporate-800 text-[10px] text-gray-500 text-center hidden md:block">
          {documents.length} documents in queue
        </div>
      </div>

      {/* Main Area */}
      {selectedDoc ? (
        <div className="flex-1 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-corporate-800 min-w-0 min-h-[500px]">
          
          {/* Input Panel (Left) */}
          <div className="w-full md:w-1/2 flex flex-col bg-white h-1/2 md:h-auto">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                <FileText size={14} />
                Source Content
              </h3>
              <div className="flex items-center gap-2">
                {selectedDoc.status === 'verified' ? (
                   <span className="flex items-center gap-1.5 text-xs text-corporate-600 font-medium bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200">
                     <Lock size={10} /> Read Only
                   </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-xs text-corporate-accentLight font-medium bg-teal-50 px-2 py-0.5 rounded-full border border-teal-100">
                    <PenLine size={10} /> Editable
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex-1 relative group bg-white min-h-[200px]">
              <textarea
                className={`w-full h-full p-4 resize-none border-0 focus:ring-0 text-sm font-mono leading-relaxed transition-colors ${
                  selectedDoc.status === 'verified' 
                    ? 'bg-gray-50 text-gray-400 cursor-not-allowed select-none' 
                    : 'bg-white text-corporate-900'
                }`}
                value={selectedDoc.content}
                onChange={(e) => handleContentChange(e.target.value)}
                placeholder="Content is empty..."
                disabled={selectedDoc.status === 'verified'}
                readOnly={selectedDoc.status === 'verified'}
              />
              
              {/* Lock Overlay */}
              {selectedDoc.status === 'verified' && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-gray-200 flex items-center gap-2 text-gray-500 text-xs font-medium">
                    <Lock size={12} className="text-gray-400" /> Content Verified & Locked
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50 flex gap-2 overflow-x-auto">
               <WorkbenchButton 
                 label="Extract" 
                 icon={Zap} 
                 active={selectedDoc.analysisType === AnalysisType.QUICK_EXTRACTION}
                 onClick={() => handleAnalysis(AnalysisType.QUICK_EXTRACTION)}
                 disabled={loading || selectedDoc.status === 'verified'}
               />
               <WorkbenchButton 
                 label="Audit" 
                 icon={ShieldCheck} 
                 active={selectedDoc.analysisType === AnalysisType.DEEP_AUDIT}
                 onClick={() => handleAnalysis(AnalysisType.DEEP_AUDIT)}
                 disabled={loading || selectedDoc.status === 'verified'}
               />
               <WorkbenchButton 
                 label="Market" 
                 icon={Search} 
                 active={selectedDoc.analysisType === AnalysisType.MARKET_CONTEXT}
                 onClick={() => handleAnalysis(AnalysisType.MARKET_CONTEXT)}
                 disabled={loading || selectedDoc.status === 'verified'}
               />
            </div>
          </div>

          {/* Output Panel (Right) */}
          <div className="w-full md:w-1/2 flex flex-col bg-corporate-900 text-white min-h-[400px] h-1/2 md:h-auto">
            <div className="px-4 py-3 border-b border-corporate-800 flex items-center justify-between bg-corporate-900">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <BrainCircuit size={14} />
                Intelligence Layer
              </h3>
              {selectedDoc.analysisResult && (
                <span className={`text-xs px-2 py-0.5 rounded font-bold ${selectedDoc.analysisResult.confidenceScore > 80 ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                  CONFIDENCE: {selectedDoc.analysisResult.confidenceScore}%
                </span>
              )}
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto custom-scrollbar relative">
              {loading ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 bg-corporate-900/80 backdrop-blur-sm z-10">
                  <div className="w-8 h-8 border-2 border-corporate-accent border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-xs text-corporate-accent animate-pulse">
                     System Thinking...
                  </p>
                </div>
              ) : null}

              <div className="min-h-full flex flex-col">
                <div className="flex-1">
                  {selectedDoc.analysisResult ? (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 mb-8">
                      
                      {/* Analysis Header */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 rounded-sm bg-corporate-800 border border-corporate-700 text-[10px] text-gray-300 font-mono">
                            TYPE: {selectedDoc.analysisResult.type.toUpperCase()}
                          </span>
                        </div>
                        {selectedDoc.status === 'verified' && (
                          <span className="flex items-center gap-1 text-xs text-green-400">
                            <CheckCircle2 size={12} /> Verified by Operator
                          </span>
                        )}
                      </div>

                      {/* Summary */}
                      <div className="bg-corporate-800/50 p-4 rounded border border-corporate-700/50">
                        <p className="text-sm leading-relaxed text-gray-200 font-light">{selectedDoc.analysisResult.summary}</p>
                      </div>

                      {/* Entities Grid */}
                      {selectedDoc.analysisResult.entities && (
                        <div>
                          <h4 className="text-xs text-gray-500 uppercase font-semibold mb-3">Extracted Fields</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {selectedDoc.analysisResult.entities.map((e, i) => (
                              <div key={i} className="bg-corporate-800 p-2.5 rounded border border-corporate-700 group hover:border-corporate-600 transition-colors">
                                <span className="block text-[10px] text-gray-500 mb-1">{e.label}</span>
                                <span className="block text-sm text-white font-mono truncate select-all">{e.value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Risks */}
                      {selectedDoc.analysisResult.risks && selectedDoc.analysisResult.risks.length > 0 && (
                        <div>
                          <h4 className="text-xs text-red-400 uppercase font-semibold mb-3 flex items-center gap-2">
                            <AlertTriangle size={12} /> Risk Anomalies
                          </h4>
                          <ul className="space-y-2">
                            {selectedDoc.analysisResult.risks.map((risk, i) => (
                              <li key={i} className="text-sm text-red-200 bg-red-900/10 border-l-2 border-red-500 pl-3 py-1">
                                {risk}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Market Context */}
                      {selectedDoc.analysisResult.marketContext && (
                        <div>
                          <h4 className="text-xs text-blue-400 uppercase font-semibold mb-3 flex items-center gap-2">
                            <Search size={12} /> Verification Sources
                          </h4>
                          <ul className="space-y-1">
                            {selectedDoc.analysisResult.marketContext.map((link, i) => (
                              <li key={i}>
                                <a href={link} target="_blank" rel="noreferrer" className="text-xs text-blue-300/80 hover:text-blue-200 underline truncate block">
                                  {link}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Action Area */}
                      <div className="pt-6 mt-6 border-t border-corporate-800">
                        {selectedDoc.status === 'verified' ? (
                          <div className="flex items-center justify-between bg-green-900/10 border border-green-900/30 p-3 rounded">
                            <div className="text-xs text-green-400 flex items-center gap-2">
                              <CheckCircle2 size={14} />
                              <span>Verified & Logged</span>
                            </div>
                            <button 
                              onClick={handleUnlock}
                              className="flex items-center gap-2 px-3 py-1.5 bg-corporate-800 hover:bg-corporate-700 text-gray-300 text-xs font-medium rounded border border-corporate-700 transition-colors"
                            >
                              <Unlock size={12} /> Edit
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="text-xs text-gray-500 italic">
                              * Confirming updates accuracy model.
                            </div>
                            <button 
                              onClick={handleVerify}
                              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-corporate-accent hover:bg-teal-700 text-white text-sm font-medium rounded shadow-lg shadow-teal-900/20 transition-all"
                            >
                              <Save size={16} /> Verify & Learn
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="h-64 flex items-center justify-center text-corporate-700">
                      <div className="text-center">
                        <div className="inline-flex p-3 rounded-full bg-corporate-800 mb-3">
                          <ArrowRight className="text-corporate-600" size={20} />
                        </div>
                        <p className="text-sm">Select an analysis mode</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Always Visible History Log */}
                <div className="pt-6 border-t border-corporate-800 mt-auto">
                  <h4 className="text-[10px] text-gray-500 uppercase font-bold mb-3 flex items-center gap-2">
                      <History size={12} /> Audit Trail
                  </h4>
                  <div className="space-y-3">
                    {selectedDoc.history.length > 0 ? (
                      selectedDoc.history.map((h, i) => (
                        <div key={i} className="flex items-start gap-3 text-xs group">
                          <div className="flex flex-col items-center">
                              <div className="w-1.5 h-1.5 rounded-full bg-corporate-700 group-hover:bg-corporate-500 transition-colors mt-1.5"></div>
                              {i < selectedDoc.history.length - 1 && <div className="w-px h-full bg-corporate-800 my-0.5"></div>}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                                <span className="text-gray-300 font-medium text-[11px]">{h.user}</span>
                                <span className="text-gray-600 text-[10px]">{h.timestamp}</span>
                            </div>
                            <p className="text-gray-500 text-[11px]">{h.action}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-[11px] text-gray-600 italic">No history recorded</div>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-corporate-900 text-gray-500">
          <p>Select a document from the queue to begin</p>
        </div>
      )}
    </div>
  );
};

// Helper internal component for buttons
const WorkbenchButton: React.FC<{ 
  label: string; 
  icon: React.ElementType; 
  active: boolean; 
  onClick: () => void;
  disabled: boolean;
}> = ({ label, icon: Icon, active, onClick, disabled }) => (
  <button 
    onClick={onClick}
    disabled={disabled}
    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium rounded-md transition-all border whitespace-nowrap ${
      active 
        ? 'bg-corporate-900 text-white border-corporate-900 shadow-sm' 
        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
  >
    <Icon size={14} className={active ? 'text-white' : 'text-gray-400'} />
    {label}
  </button>
);