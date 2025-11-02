import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Chip, Grid, Typography } from '@mui/material';
import { fetchProjects } from '../api/client.js';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchProjects().then(response => setProjects(response.data));
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Projects
      </Typography>
      <Grid container spacing={3}>
        {projects.map(project => (
          <Grid item key={project._id} xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">{project.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Genre: {project.genre}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Duration: {project.duration}s
                </Typography>
                <Box mt={1}>
                  <Chip label={project.status} color="primary" size="small" />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
