import React from 'react';
import './App.css';
import Home from './components/Home';
import { createTheme, ThemeProvider } from '@mui/material/styles';

function App() {
  const theme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#c1839f',
        dark: '#a76a85',
        light: '#d89eb3',
        contrastText: '#f5f5f5',
      },
      secondary: {
        main: '#a6c8d3',
        dark: '#83a1aa',
        light: '#c7e1e8',
        contrastText: '#0e6682',
      },
      success: {
        main: '#087e8b',
        dark: '#065e68',
        light: '#3ba3af',
        contrastText: '#f5f5f5'
      },
      error: {
        main: '#ff5a5f',
        dark: '#cc474b',
        light: '#ff8589',
        contrastText: '#f5f5f5'
      },
      warning: {
        main: '#ffb84d',
        dark: '#cc943e',
        light: '#ffd280',
        contrastText: '#1e1e1e'
      },
      info: {
        main: '#4d9cff',
        dark: '#3a7fcc',
        light: '#80b8ff',
        contrastText: '#1e1e1e'
      },
      text: {
        primary: '#f5f5f5',
        secondary: '#b8b8b8',
        disabled: '#383838'
      },
      background: {
        default: '#121212',
        paper: '#1e1e1e',
      },
      divider: '#3a3a3a'
    }
  });  

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Home />
      </ThemeProvider>
    </div>
  );
}

export default App;
