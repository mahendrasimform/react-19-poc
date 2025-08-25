import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import FeaturesPage from './pages/FeaturesPage';
import DemoPage from './pages/DemoPage';

/**
 * React 19 POC Application
 * 
 * This application demonstrates the key features of React 19:
 * 1. `use` hook for async data fetching and resource consumption
 * 2. Enhanced ref handling with automatic ref forwarding
 * 3. Actions for form handling (server actions simulation)
 * 4. Improved Context API usage with better performance
 * 5. Automatic memoization and optimized event handling
 * 
 * The app uses Material UI for styling and React Router for navigation.
 */

// React 19 Feature: Enhanced theme creation with automatic memoization
// React 19 automatically optimizes object creation and memoization
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
  },
});

function App() {
  return (
    // React 19 Feature: Improved Context Provider nesting and performance
    // The new Context API in React 19 provides better performance optimizations
    <AppProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/features" element={<FeaturesPage />} />
              <Route path="/demo" element={<DemoPage />} />
            </Routes>
          </Layout>
        </Router>
      </ThemeProvider>
    </AppProvider>
  );
}

export default App;
