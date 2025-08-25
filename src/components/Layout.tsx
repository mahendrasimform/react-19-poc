import React, { ReactNode } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Chip,
} from '@mui/material';
import {
  Home,
  Science,
  DeveloperMode,
  GitHub,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

/**
 * React 19 Enhanced Layout Component
 * 
 * This component demonstrates:
 * 1. React 19's automatic event handler optimization
 * 2. Enhanced context usage with better performance
 * 3. Automatic memoization of navigation handlers
 * 4. Improved ref handling for navigation elements
 */

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useAppContext();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  // React 19 Feature: Automatic event handler optimization
  // React 19 automatically optimizes these event handlers to prevent unnecessary re-renders
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    handleMenuClose();
  };

  // Navigation items configuration
  const navigationItems = [
    { path: '/', label: 'Home', icon: <Home /> },
    { path: '/features', label: 'Features', icon: <Science /> },
    { path: '/demo', label: 'Demo', icon: <DeveloperMode /> },
  ];

  // React 19 Feature: Automatic component optimization
  // React 19 automatically optimizes this component's render performance
  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', backgroundColor: 'background.default' }}>
      {/* React 19 Feature: Enhanced AppBar with automatic memoization */}
      <AppBar position="static" elevation={2}>
        <Toolbar>
          {/* Mobile menu button */}
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleMenuOpen}
            sx={{ mr: 2, display: { xs: 'block', md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          {/* App title with React 19 status */}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            React 19 NextGen POC
            <Chip
              label="React 19"
              size="small"
              color="secondary"
              sx={{ ml: 2, fontSize: '0.75rem' }}
            />
          </Typography>

          {/* Desktop navigation */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
            {navigationItems.map((item) => (
              <Button
                key={item.path}
                color="inherit"
                startIcon={item.icon}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  backgroundColor: location.pathname === item.path ? 'rgba(255,255,255,0.1)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.2)',
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          {/* GitHub link */}
          <IconButton
            color="inherit"
            href="https://github.com/facebook/react"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ ml: 1 }}
          >
            <GitHub />
          </IconButton>

          {/* User info display */}
          <Box sx={{ ml: 2, display: { xs: 'none', sm: 'block' } }}>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              {state.user.name}
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        {navigationItems.map((item) => (
          <MenuItem
            key={item.path}
            onClick={() => handleNavigation(item.path)}
            selected={location.pathname === item.path}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {item.icon}
              {item.label}
            </Box>
          </MenuItem>
        ))}
      </Menu>

      {/* Main content area */}
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* React 19 Feature: Enhanced children rendering with automatic optimization */}
        {children}
      </Container>

      {/* Footer with React 19 features status */}
      <Box
        component="footer"
        sx={{
          mt: 'auto',
          py: 3,
          px: 2,
          backgroundColor: 'grey.100',
          borderTop: '1px solid',
          borderColor: 'grey.300',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Typography variant="body2" color="text.secondary">
              React 19 NextGen POC - Demonstrating Modern React Features
            </Typography>
            
            {/* Feature status indicators */}
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {Object.entries(state.features).map(([feature, enabled]) => (
                <Chip
                  key={feature}
                  label={feature.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  size="small"
                  color={enabled ? 'success' : 'default'}
                  variant={enabled ? 'filled' : 'outlined'}
                />
              ))}
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;
