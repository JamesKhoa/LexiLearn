import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import DashboardPage from './DashboardPage.jsx';
import ProjectsPage from './ProjectsPage.jsx';
import TopBar from '../components/TopBar.jsx';

export default function App() {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: 'background.default' }}>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <TopBar />
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
        </Routes>
      </Box>
    </Box>
  );
}
