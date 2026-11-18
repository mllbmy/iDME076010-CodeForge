import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import { ErrorBoundary } from '@/components/common';

const SciFiDashboard = React.lazy(() => import('@/components/SciFiDashboard'));
const EquipmentManagement = React.lazy(() => import('@/components/equipment'));
const MaterialManagement = React.lazy(() => import('@/components/material'));
const ProcessManagement = React.lazy(() => import('@/components/process'));
const AIRealTimeMonitoring = React.lazy(() => import('@/components/AIRealTimeMonitoring'));
const ReportsAnalysis = React.lazy(() => import('@/components/ReportsAnalysis'));

const LazyLoad = ({ children }: { children: React.ReactNode }) => (
  <Suspense
    fallback={
      <Spin
        size="large"
        style={{ display: 'flex', justifyContent: 'center', marginTop: 100 }}
      />
    }
  >
    {children}
  </Suspense>
);

export const menuRouteMap: Record<string, string> = {
  dashboard: '/dashboard',
  'ai-monitoring': '/ai-monitoring',
  equipment: '/equipment',
  material: '/material',
  process: '/process',
  reports: '/reports',
};

export const routeMenuMap: Record<string, string> = {
  '/dashboard': 'dashboard',
  '/ai-monitoring': 'ai-monitoring',
  '/equipment': 'equipment',
  '/material': 'material',
  '/process': 'process',
  '/reports': 'reports',
};

const AppRoutes: React.FC<{ onEnterSystem: () => void }> = ({ onEnterSystem }) => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route
        path="/dashboard"
        element={
          <ErrorBoundary>
          <LazyLoad>
            <SciFiDashboard onEnterSystem={onEnterSystem} />
          </LazyLoad>
          </ErrorBoundary>
        }
      />
      <Route
        path="/ai-monitoring"
        element={
          <ErrorBoundary>
          <LazyLoad>
            <AIRealTimeMonitoring />
          </LazyLoad>
          </ErrorBoundary>
        }
      />
      <Route
        path="/equipment"
        element={
          <ErrorBoundary>
          <LazyLoad>
            <EquipmentManagement activeTab="equipment-ledger" />
          </LazyLoad>
          </ErrorBoundary>
        }
      />
      <Route
        path="/material"
        element={
          <ErrorBoundary>
          <LazyLoad>
            <MaterialManagement />
          </LazyLoad>
          </ErrorBoundary>
        }
      />
      <Route
        path="/process"
        element={
          <ErrorBoundary>
          <LazyLoad>
            <ProcessManagement activeTab="process-configuration" />
          </LazyLoad>
          </ErrorBoundary>
        }
      />
      <Route
        path="/reports"
        element={
          <ErrorBoundary>
          <LazyLoad>
            <ReportsAnalysis />
          </LazyLoad>
          </ErrorBoundary>
        }
      />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
