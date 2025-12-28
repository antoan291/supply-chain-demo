import React, { useState } from 'react';
import { DashboardLayout } from './components/DashboardLayout';
import { DocumentWorkbench } from './components/DemoSection';
import { ControlCenterTable } from './components/ControlCenterTable';
import { AuditLogTable } from './components/AuditLogTable';
import { ConfigurationSettings } from './components/ConfigurationSettings';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState('control-center');

  return (
    <DashboardLayout activeView={activeView} onViewChange={setActiveView}>
      {activeView === 'control-center' && <ControlCenterTable />}
      {activeView === 'workbench' && <DocumentWorkbench />}
      {activeView === 'audit-log' && <AuditLogTable />}
      {activeView === 'configuration' && <ConfigurationSettings />}
    </DashboardLayout>
  );
};

export default App;