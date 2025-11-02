import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography
} from '@mui/material';
import { createFilm, fetchProgress } from '../api/client.js';
import { useSettings } from '../contexts/SettingsContext.jsx';

const genres = ['Action', 'Horror', 'Documentary', 'Comedy', 'Adult'];

export default function ProjectWizard({ onProgressUpdate }) {
  const [activeStep, setActiveStep] = useState(0);
  const [projectName, setProjectName] = useState('');
  const [genre, setGenre] = useState(genres[0]);
  const [duration, setDuration] = useState(120);
  const [documentFile, setDocumentFile] = useState(null);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { settings } = useSettings();

  const steps = ['Project Details', 'Upload Script', 'Review'];

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        name: projectName,
        genre,
        duration,
        language: settings.language,
        artStyle: settings.artStyle,
        aspectRatio: settings.aspectRatio,
        apiKey: settings.apiKey,
        content
      };
      const response = await createFilm(payload, documentFile);
      onProgressUpdate({ percentage: 10, message: 'Started production' });
      const { progressId } = response.data;
      pollProgress(progressId);
    } catch (error) {
      onProgressUpdate({ percentage: 0, message: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const pollProgress = async progressId => {
    const interval = setInterval(async () => {
      try {
        const { data } = await fetchProgress(progressId);
        onProgressUpdate(data);
        if (data.percentage >= 100) {
          clearInterval(interval);
        }
      } catch (error) {
        onProgressUpdate({ percentage: 0, message: error.message });
        clearInterval(interval);
      }
    }, 2000);
  };

  const renderStepContent = step => {
    switch (step) {
      case 0:
        return (
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField label="Project Name" value={projectName} onChange={event => setProjectName(event.target.value)} fullWidth />
            <FormControl fullWidth>
              <InputLabel id="genre-label">Genre</InputLabel>
              <Select labelId="genre-label" label="Genre" value={genre} onChange={event => setGenre(event.target.value)}>
                {genres.map(option => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Duration (seconds)"
              type="number"
              value={duration}
              onChange={event => setDuration(Number(event.target.value))}
              helperText={`Estimated scenes: ${Math.ceil(duration / 8)}`}
            />
          </Box>
        );
      case 1:
        return (
          <Box display="flex" flexDirection="column" gap={2}>
            <Button variant="outlined" component="label">
              Upload Document
              <input type="file" hidden onChange={event => setDocumentFile(event.target.files?.[0])} />
            </Button>
            <TextField
              label="Or paste script"
              multiline
              minRows={6}
              value={content}
              onChange={event => setContent(event.target.value)}
            />
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography variant="subtitle1">Review Settings</Typography>
            <Typography variant="body2">Language: {settings.language}</Typography>
            <Typography variant="body2">Aspect Ratio: {settings.aspectRatio}</Typography>
            <Typography variant="body2">Art Style: {settings.artStyle}</Typography>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Project Creation Wizard
        </Typography>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map(label => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Box mt={3}>{renderStepContent(activeStep)}</Box>
        <Box mt={3} display="flex" justifyContent="space-between">
          <Button disabled={activeStep === 0} onClick={() => setActiveStep(step => step - 1)}>
            Back
          </Button>
          {activeStep < steps.length - 1 ? (
            <Button variant="contained" onClick={() => setActiveStep(step => step + 1)}>
              Next
            </Button>
          ) : (
            <Button variant="contained" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Processing...' : 'Create Film'}
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
