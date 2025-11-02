import React from 'react';
import { Box, Card, CardContent, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { useSettings } from '../contexts/SettingsContext.jsx';

const aspectRatios = ['16:9', '9:16', '1:1'];
const artStyles = ['photorealistic', 'anime', 'studio-specific'];
const languages = ['English', 'Spanish', 'French', 'Mandarin'];
const themeOptions = [
  { value: 'light', label: 'Light Theme' },
  { value: 'dark', label: 'Dark Theme' }
];

export default function SettingsPanel() {
  const { settings, setSettings } = useSettings();

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Settings
        </Typography>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Film Duration (seconds)"
            type="number"
            value={settings.duration}
            onChange={event => updateSetting('duration', Number(event.target.value))}
            helperText={`Scenes auto-calculated: ${Math.ceil(settings.duration / 8)}`}
          />
          <FormControl fullWidth>
            <InputLabel id="aspect-ratio-label">Aspect Ratio</InputLabel>
            <Select
              labelId="aspect-ratio-label"
              label="Aspect Ratio"
              value={settings.aspectRatio}
              onChange={event => updateSetting('aspectRatio', event.target.value)}
            >
              {aspectRatios.map(ratio => (
                <MenuItem key={ratio} value={ratio}>
                  {ratio}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="language-label">Language</InputLabel>
            <Select labelId="language-label" label="Language" value={settings.language} onChange={event => updateSetting('language', event.target.value)}>
              {languages.map(language => (
                <MenuItem key={language} value={language}>
                  {language}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="art-style-label">Art Style</InputLabel>
            <Select labelId="art-style-label" label="Art Style" value={settings.artStyle} onChange={event => updateSetting('artStyle', event.target.value)}>
              {artStyles.map(style => (
                <MenuItem key={style} value={style}>
                  {style}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="theme-label">Theme</InputLabel>
            <Select labelId="theme-label" label="Theme" value={settings.theme} onChange={event => updateSetting('theme', event.target.value)}>
              {themeOptions.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField label="OpenAI API Key" type="password" value={settings.apiKey} onChange={event => updateSetting('apiKey', event.target.value)} />
        </Box>
      </CardContent>
    </Card>
  );
}
