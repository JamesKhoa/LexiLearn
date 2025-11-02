import React, { useMemo, useState } from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import ProjectWizard from '../components/ProjectWizard.jsx';
import ProgressTimeline from '../components/ProgressTimeline.jsx';
import SettingsPanel from '../components/SettingsPanel.jsx';
import UploadPanel from '../components/UploadPanel.jsx';

const defaultSteps = [
  { label: 'Analysis', value: 10 },
  { label: 'Script', value: 30 },
  { label: 'Scenes', value: 40 },
  { label: 'Bibles', value: 50 },
  { label: 'Prompts', value: 60 },
  { label: 'Automation', value: 80 },
  { label: 'Assembly', value: 90 },
  { label: 'Complete', value: 100 }
];

export default function DashboardPage() {
  const [progress, setProgress] = useState({ percentage: 0, message: 'Idle' });

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        Automated Filmmaking Studio
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <ProjectWizard onProgressUpdate={setProgress} />
        </Grid>
        <Grid item xs={12} md={4}>
          <SettingsPanel />
          <Box mt={3}>
            <UploadPanel />
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <ProgressTimeline progress={progress} steps={defaultSteps} />
        </Grid>
      </Grid>
    </Box>
  );
}
