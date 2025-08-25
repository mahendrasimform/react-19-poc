import React, { Suspense } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  LinearProgress,
  Alert,
  AlertTitle,
} from '@mui/material';
import {
  NewReleases,
  Speed,
  Security,
  Code,
  TrendingUp,
  CheckCircle,
  AutoAwesome,
  DataObject,
  TouchApp,
  Refresh,
  Science,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

/**
 * React 19 Home Page Component
 * 
 * This page demonstrates:
 * 1. React 19's automatic component optimization
 * 2. Enhanced Suspense boundaries with better error handling
 * 3. Improved performance with automatic memoization
 * 4. Better accessibility and user experience
 */

// React 19 Feature: Enhanced feature showcase component with automatic optimization
const FeatureCard: React.FC<{
  title: string;
  description: string;
  icon: React.ReactNode;
  status: 'new' | 'improved' | 'enhanced';
  onClick: () => void;
}> = ({ title, description, icon, status, onClick }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'success';
      case 'improved': return 'primary';
      case 'enhanced': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
        cursor: 'pointer',
      }}
      onClick={onClick}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{ mr: 2, color: 'primary.main' }}>
            {icon}
          </Box>
          <Chip
            label={status.toUpperCase()}
            size="small"
            color={getStatusColor(status) as any}
            variant="outlined"
          />
        </Box>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" startIcon={<Code />}>
          Explore
        </Button>
      </CardActions>
    </Card>
  );
};

// React 19 Feature: Async component for demonstration
const StatsDisplay: React.FC = () => {
  const { state } = useAppContext();

  // Simulate loading state for demonstration
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Loading React 19 Features...
        </Typography>
        <LinearProgress />
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        React 19 Feature Status
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ textAlign: 'center', flex: 1, minWidth: '150px' }}>
          <Typography variant="h3" color="primary.main">
            5+
          </Typography>
          <Typography variant="body2">
            New Features
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'center', flex: 1, minWidth: '150px' }}>
          <Typography variant="h3" color="success.main">
            100%
          </Typography>
          <Typography variant="body2">
            Performance Boost
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'center', flex: 1, minWidth: '150px' }}>
          <Typography variant="h3" color="secondary.main">
            {Object.values(state.features).filter(Boolean).length}
          </Typography>
          <Typography variant="body2">
            Features Active
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useAppContext();

  // React 19 Feature: Automatic event handler optimization
  const handleFeatureExplore = (path: string) => {
    navigate(path);
  };

  const features = [
    {
      title: 'use Hook',
      description: 'Revolutionary hook for consuming Promises and Context with better performance and cleaner code.',
      icon: <DataObject fontSize="large" />,
      status: 'new' as const,
      path: '/features',
    },
    {
      title: 'Enhanced Refs',
      description: 'Automatic ref forwarding, improved useImperativeHandle, and better TypeScript integration.',
      icon: <TouchApp fontSize="large" />,
      status: 'improved' as const,
      path: '/features',
    },
    {
      title: 'Form Actions',
      description: 'Built-in form handling with useActionState, optimistic updates, and automatic pending states.',
      icon: <AutoAwesome fontSize="large" />,
      status: 'new' as const,
      path: '/demo',
    },
    {
      title: 'Context Improvements',
      description: 'Better performance, automatic optimization, and improved developer experience.',
      icon: <TrendingUp fontSize="large" />,
      status: 'enhanced' as const,
      path: '/features',
    },
    {
      title: 'Auto Memoization',
      description: 'Automatic optimization of components, hooks, and event handlers for better performance.',
      icon: <Speed fontSize="large" />,
      status: 'new' as const,
      path: '/features',
    },
    {
      title: 'Suspense Enhancements',
      description: 'Improved error boundaries, better loading states, and enhanced user experience.',
      icon: <Security fontSize="large" />,
      status: 'improved' as const,
      path: '/features',
    },
  ];

  const benefits = [
    'Simplified async data fetching with the use hook',
    'Automatic performance optimizations',
    'Enhanced developer experience',
    'Better TypeScript integration',
    'Improved form handling and validation',
    'Optimistic UI updates for better UX',
    'Automatic memoization and optimization',
    'Enhanced accessibility features',
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          React 19 NextGen POC
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Exploring Modern Features with Material UI
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap', mb: 4 }}>
          <Chip icon={<NewReleases />} label="React 19" color="primary" />
          <Chip icon={<Code />} label="TypeScript" color="secondary" />
          <Chip icon={<AutoAwesome />} label="Material UI" color="success" />
        </Box>
        
        <Alert severity="info" sx={{ mb: 4 }}>
          <AlertTitle>Welcome to React 19!</AlertTitle>
          This application demonstrates the latest features and improvements in React 19,
          including the new `use` hook, enhanced refs, form actions, and automatic optimizations.
        </Alert>
      </Box>

      {/* Stats Section with Suspense */}
      <Box sx={{ mb: 6 }}>
        <Suspense
          fallback={
            <Paper sx={{ p: 3 }}>
              <Typography>Loading statistics...</Typography>
              <LinearProgress sx={{ mt: 2 }} />
            </Paper>
          }
        >
          <StatsDisplay />
        </Suspense>
      </Box>

      {/* Features Grid */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom textAlign="center">
          React 19 Features Showcase
        </Typography>
        <Typography variant="body1" color="text.secondary" textAlign="center" paragraph>
          Explore the cutting-edge features that make React 19 the most advanced version yet.
        </Typography>
        
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
          gap: 3 
        }}>
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              status={feature.status}
              onClick={() => handleFeatureExplore(feature.path)}
            />
          ))}
        </Box>
      </Box>

      {/* Benefits Section */}
      <Box sx={{ mb: 6 }}>
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 4 
        }}>
          <Box>
            <Typography variant="h5" component="h3" gutterBottom>
              Why React 19?
            </Typography>
            <Typography variant="body1" paragraph>
              React 19 represents a significant leap forward in React development,
              offering unprecedented performance improvements, developer experience enhancements,
              and new capabilities that make building modern web applications more efficient and enjoyable.
            </Typography>
            <Typography variant="body1" paragraph>
              From the revolutionary `use` hook to automatic optimizations,
              React 19 reduces boilerplate code while increasing performance and maintainability.
            </Typography>
          </Box>
          <Box>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Key Benefits
              </Typography>
              <List dense>
                {benefits.map((benefit, index) => (
                  <ListItem key={index} disablePadding>
                    <ListItemIcon>
                      <CheckCircle color="success" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={benefit} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Box>
        </Box>
      </Box>

      {/* Call to Action */}
      <Box sx={{ textAlign: 'center', mt: 6 }}>
        <Paper sx={{ p: 4, background: 'linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)' }}>
          <Typography variant="h5" color="white" gutterBottom>
            Ready to Explore React 19?
          </Typography>
          <Typography variant="body1" color="white" paragraph>
            Dive into the features page to see React 19 in action, or try the interactive demo
            to experience the new capabilities firsthand.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              startIcon={<Science />}
              onClick={() => navigate('/features')}
            >
              Explore Features
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              size="large"
              startIcon={<Refresh />}
              onClick={() => navigate('/demo')}
              sx={{ color: 'white', borderColor: 'white' }}
            >
              Try Demo
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default HomePage;
