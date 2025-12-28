import React from 'react';

export interface DocumentAnalysisResult {
  type: 'extraction' | 'audit' | 'intelligence';
  summary: string;
  confidenceScore: number;
  risks?: string[];
  entities?: { label: string; value: string }[];
  marketContext?: string[];
}

export enum AnalysisType {
  QUICK_EXTRACTION = 'QUICK_EXTRACTION',
  DEEP_AUDIT = 'DEEP_AUDIT',
  MARKET_CONTEXT = 'MARKET_CONTEXT'
}

export interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  active?: boolean;
}

export interface DashboardStat {
  label: string;
  value: string;
  change?: string;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ElementType;
}

export interface ActivityLog {
  id: string;
  document: string;
  status: 'Verified' | 'Flagged' | 'Processing';
  timestamp: string;
  riskLevel: 'Low' | 'Medium' | 'High';
}

export interface DocumentRecord {
  id: string;
  type: string;
  supplier: string;
  confidence: number;
  issues: number;
  received: string;
  status: 'Processed' | 'Review Required' | 'Rejected' | 'Analyzing';
}

export interface AuditLogRecord {
  id: string;
  timestamp: string;
  type: 'System' | 'Manual' | 'Security' | 'Validation';
  action: string;
  details: string;
  documentId: string;
  user: 'AI Agent' | 'System' | string;
}

export interface WorkbenchDocument {
  id: string;
  title: string;
  content: string;
  status: 'draft' | 'analyzing' | 'analyzed' | 'verified';
  lastModified: string;
  analysisResult?: DocumentAnalysisResult;
  analysisType?: AnalysisType;
  history: { action: string; timestamp: string; user: string }[];
}