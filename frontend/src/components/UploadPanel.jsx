import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';

export default function UploadPanel() {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Supported Formats
        </Typography>
        <Box>
          <Typography variant="body2">• Text (.txt)</Typography>
          <Typography variant="body2">• Word Documents (.docx)</Typography>
          <Typography variant="body2">• PDF Documents (.pdf)</Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
