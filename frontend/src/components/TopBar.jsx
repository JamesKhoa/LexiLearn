import React from 'react';
import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function TopBar() {
  return (
    <AppBar position="static" color="transparent" elevation={0} sx={{ mb: 3 }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6">LexiLearn Studio</Typography>
        <Box>
          <Button component={RouterLink} to="/" color="primary">
            Dashboard
          </Button>
          <Button component={RouterLink} to="/projects" color="primary">
            Projects
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
