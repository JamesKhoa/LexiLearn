import React from 'react';
import { Box, Card, CardContent, LinearProgress, List, ListItem, ListItemText, Typography } from '@mui/material';

export default function ProgressTimeline({ progress, steps }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Production Progress
        </Typography>
        <LinearProgress variant="determinate" value={progress.percentage} sx={{ height: 10, borderRadius: 5 }} />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {progress.message}
        </Typography>
        <Box mt={2}>
          <List dense>
            {steps.map(step => (
              <ListItem key={step.label} disablePadding>
                <ListItemText primary={step.label} secondary={`${step.value}%`} />
              </ListItem>
            ))}
          </List>
        </Box>
      </CardContent>
    </Card>
  );
}
