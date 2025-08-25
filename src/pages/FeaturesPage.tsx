import React, { Suspense, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Tab,
  Tabs,
  Paper,
  Alert,
  AlertTitle,
  CircularProgress,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Code,
  DataObject,
  TouchApp,
  AutoAwesome,
  TrendingUp,
  Speed,
  CheckCircle,
  PlayArrow,
  Pause,
} from '@mui/icons-material';
import { useAsyncData, fetchUserData, useRealTimeData } from '../hooks/useAsyncData';
import { EnhancedInput, useMultipleRefs, useFocusManagement } from '../hooks/useEnhancedRefs';
import { useAppContext } from '../context/AppContext';

/**
 * React 19 Features Demonstration Page
 * 
 * This page showcases all the major React 19 features:
 * 1. `use` hook for async data fetching
 * 2. Enhanced ref capabilities
 * 3. Context improvements
 * 4. Automatic memoization
 * 5. Suspense enhancements
 */

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`feature-tabpanel-${index}`}
      aria-labelledby={`feature-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

// React 19 Feature: Component demonstrating the `use` hook
const UseHookDemo: React.FC = () => {
  const [userId, setUserId] = useState('123');
  const [loading, setLoading] = useState(false);

  // React 19 Feature: Using the `use` hook to consume promises
  // This component will suspend until the promise resolves
  const userData = useAsyncData(fetchUserData(userId));

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setUserId(prev => (parseInt(prev) + 1).toString());
      setLoading(false);
    }, 500);
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">use Hook Demo</Typography>
          <Button 
            variant="outlined" 
            startIcon={loading ? <CircularProgress size={16} /> : <PlayArrow />}
            onClick={handleRefresh}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Fetch New User'}
          </Button>
        </Box>
        
        <Alert severity="info" sx={{ mb: 3 }}>
          <AlertTitle>React 19 `use` Hook</AlertTitle>
          The `use` hook allows components to consume Promises directly. This component suspends
          while the async data is being fetched, providing a seamless loading experience.
        </Alert>

        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>User Data (ID: {userId})</Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="Name" secondary={userData.name} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Email" secondary={userData.email} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Posts" secondary={userData.stats.posts} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Followers" secondary={userData.stats.followers} />
            </ListItem>
          </List>
        </Paper>

        <Typography variant="body2" color="text.secondary">
          💡 This data is fetched using React 19's `use` hook, which automatically handles
          loading states and provides better error boundaries.
        </Typography>
      </CardContent>
    </Card>
  );
};

// React 19 Feature: Real-time data component using `use` hook
const RealTimeDemo: React.FC = () => {
  const [isActive, setIsActive] = useState(true);
  
  // This will automatically refresh every 3 seconds when active
  const realTimeData = useRealTimeData('/api/metrics', isActive ? 3000 : 0);

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Real-time Data with `use`</Typography>
          <FormControlLabel
            control={
              <Switch
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                color="primary"
              />
            }
            label={isActive ? "Live" : "Paused"}
          />
        </Box>

        <Paper sx={{ p: 2, background: 'linear-gradient(45deg, #f3f4f6 30%, #e5e7eb 90%)' }}>
          <Typography variant="subtitle2" gutterBottom>
            Live Metrics
          </Typography>
          <Typography variant="h4" color="primary.main" gutterBottom>
            {realTimeData.value}%
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Updated: {new Date(realTimeData.timestamp).toLocaleTimeString()}
          </Typography>
          <Chip 
            label={isActive ? "LIVE" : "PAUSED"} 
            color={isActive ? "success" : "default"} 
            size="small" 
            sx={{ mt: 1 }}
          />
        </Paper>
      </CardContent>
    </Card>
  );
};

// React 19 Feature: Enhanced refs demonstration
const RefImprovementsDemo: React.FC = () => {
  const inputRef = React.useRef<any>(null);
  const { containerRef, focusFirst, focusNext, focusPrevious } = useFocusManagement();
  const { setRef, getRef, focusRef } = useMultipleRefs<HTMLInputElement>();

  const handleFocusInput = () => {
    inputRef.current?.focus();
  };

  const handleClearInput = () => {
    inputRef.current?.clear();
  };

  const handleValidateInput = () => {
    const isValid = inputRef.current?.validate();
    alert(isValid ? 'Input is valid!' : 'Input is invalid!');
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>Enhanced Refs Demo</Typography>
        
        <Alert severity="info" sx={{ mb: 3 }}>
          <AlertTitle>React 19 Ref Improvements</AlertTitle>
          React 19 provides automatic ref forwarding, enhanced useImperativeHandle,
          and better integration with TypeScript for all components.
        </Alert>

        <Box ref={containerRef} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <EnhancedInput
            ref={inputRef}
            placeholder="Enhanced input with React 19 ref improvements"
            onValidate={(value) => value.length >= 3}
            required
          />

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button variant="outlined" size="small" onClick={handleFocusInput}>
              Focus Input
            </Button>
            <Button variant="outlined" size="small" onClick={handleClearInput}>
              Clear Input
            </Button>
            <Button variant="outlined" size="small" onClick={handleValidateInput}>
              Validate
            </Button>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle2" gutterBottom>
            Focus Management Demo
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button onClick={focusFirst}>Focus First</Button>
            <Button onClick={focusNext}>Focus Next</Button>
            <Button onClick={focusPrevious}>Focus Previous</Button>
          </Box>

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <input ref={setRef('input1')} placeholder="Input 1" style={{ padding: '8px' }} />
            <input ref={setRef('input2')} placeholder="Input 2" style={{ padding: '8px' }} />
            <Button onClick={() => focusRef('input1')}>Focus Input 1</Button>
            <Button onClick={() => focusRef('input2')}>Focus Input 2</Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

// React 19 Feature: Context improvements demonstration
const ContextDemo: React.FC = () => {
  const { state, updateUser, toggleFeature, updatePreferences } = useAppContext();

  const handleUpdateUser = () => {
    updateUser({
      name: 'Updated React 19 User',
      email: 'updated@react19.com',
    });
  };

  const handleToggleFeature = () => {
    toggleFeature('newHooksDemo');
  };

  const handleUpdatePreferences = () => {
    updatePreferences({
      theme: state.user.preferences.theme === 'light' ? 'dark' : 'light',
      notifications: !state.user.preferences.notifications,
    });
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>Enhanced Context Demo</Typography>
        
        <Alert severity="info" sx={{ mb: 3 }}>
          <AlertTitle>React 19 Context Improvements</AlertTitle>
          Enhanced Context API with automatic optimization, better performance,
          and improved developer experience with the `use` hook integration.
        </Alert>

        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>Current Context State</Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="User Name" secondary={state.user.name} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Email" secondary={state.user.email} />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Theme" 
                secondary={state.user.preferences.theme} 
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Notifications" 
                secondary={state.user.preferences.notifications ? 'Enabled' : 'Disabled'} 
              />
            </ListItem>
          </List>
        </Paper>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button variant="outlined" onClick={handleUpdateUser}>
            Update User
          </Button>
          <Button variant="outlined" onClick={handleToggleFeature}>
            Toggle Feature
          </Button>
          <Button variant="outlined" onClick={handleUpdatePreferences}>
            Switch Theme
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

// React 19 Feature: Performance optimizations demonstration
const PerformanceDemo: React.FC = () => {
  const [counter, setCounter] = useState(0);

  // React 19 Feature: Automatic memoization - these functions are automatically optimized
  const increment = () => setCounter(prev => prev + 1);
  const decrement = () => setCounter(prev => prev - 1);
  const reset = () => setCounter(0);

  const performanceFeatures = [
    'Automatic component memoization',
    'Optimized event handler creation',
    'Enhanced render performance',
    'Improved memory management',
    'Better tree reconciliation',
    'Automatic state optimization',
  ];

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>Performance Optimizations</Typography>
        
        <Alert severity="info" sx={{ mb: 3 }}>
          <AlertTitle>React 19 Auto-Optimization</AlertTitle>
          React 19 automatically optimizes components, event handlers, and state updates
          for better performance without manual memoization.
        </Alert>

        <Paper sx={{ p: 3, textAlign: 'center', mb: 3 }}>
          <Typography variant="h3" color="primary.main" gutterBottom>
            {counter}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button variant="contained" onClick={decrement}>-</Button>
            <Button variant="outlined" onClick={reset}>Reset</Button>
            <Button variant="contained" onClick={increment}>+</Button>
          </Box>
        </Paper>

        <Typography variant="subtitle2" gutterBottom>
          Automatic Performance Features:
        </Typography>
        <List dense>
          {performanceFeatures.map((feature, index) => (
            <ListItem key={index}>
              <ListItemIcon>
                <CheckCircle color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={feature} />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

const FeaturesPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const features = [
    { label: 'use Hook', icon: <DataObject /> },
    { label: 'Enhanced Refs', icon: <TouchApp /> },
    { label: 'Context API', icon: <TrendingUp /> },
    { label: 'Performance', icon: <Speed /> },
  ];

  return (
    <Box>
      <Typography variant="h2" component="h1" gutterBottom textAlign="center">
        React 19 Features
      </Typography>
      <Typography variant="h6" color="text.secondary" textAlign="center" paragraph>
        Interactive demonstrations of React 19's revolutionary new capabilities
      </Typography>

      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          {features.map((feature, index) => (
            <Tab
              key={index}
              label={feature.label}
              icon={feature.icon}
              iconPosition="start"
            />
          ))}
        </Tabs>
      </Paper>

      <Suspense
        fallback={
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <CircularProgress />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Loading React 19 Features...
            </Typography>
          </Paper>
        }
      >
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <UseHookDemo />
            <RealTimeDemo />
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <RefImprovementsDemo />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <ContextDemo />
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <PerformanceDemo />
        </TabPanel>
      </Suspense>

      <Paper sx={{ p: 3, mt: 4, background: 'linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)' }}>
        <Typography variant="h5" color="white" gutterBottom textAlign="center">
          Experience the Future of React
        </Typography>
        <Typography variant="body1" color="white" textAlign="center">
          React 19 brings unprecedented improvements to developer experience and application performance.
          Each feature demonstrated above represents a significant advancement in modern web development.
        </Typography>
      </Paper>
    </Box>
  );
};

export default FeaturesPage;
