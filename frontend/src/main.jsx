import React from 'react';
import ReactDOM from 'react-dom/client';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';
import App from './pages/App.jsx';
import { lightTheme, darkTheme } from './theme/theme.js';
import { SettingsProvider, useSettings } from './contexts/SettingsContext.jsx';

function ThemedApp() {
  const { settings } = useSettings();
  const theme = settings.theme === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SettingsProvider>
      <ThemedApp />
    </SettingsProvider>
  </React.StrictMode>
);
