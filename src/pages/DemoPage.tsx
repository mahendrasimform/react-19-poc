import React, { useState, Suspense } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Paper,
  Alert,
  AlertTitle,
  CircularProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Divider,
  Switch,
  FormControlLabel,
  Grid,
  Snackbar,
} from '@mui/material';
import {
  Send,
  CheckCircle,
  Error,
  Delete,
  Edit,
  Person,
  Settings,
  Notifications,
  Save,
  Refresh,
} from '@mui/icons-material';
import {
  useFormAction,
  useOptimisticForm,
  useValidatedFormAction,
  updateUserProfileAction,
  createPostAction,
  updatePreferencesAction,
  validateFormData,
  type FormData as FormDataType,
  ValidationSchema,
} from '../utils/formActions';
import { useAppContext } from '../context/AppContext';

/**
 * React 19 Demo Page - Form Actions & Optimistic Updates
 * 
 * This page demonstrates:
 * 1. useActionState for form handling
 * 2. useOptimistic for optimistic UI updates
 * 3. Form actions with pending states
 * 4. Enhanced form validation
 * 5. Server action simulation
 */

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
}

// React 19 Feature: User Profile Form with Actions
const UserProfileForm: React.FC = () => {
  const { state: appState } = useAppContext();
  const [showSuccess, setShowSuccess] = useState(false);

  // React 19 Feature: Form validation schema
  const validationSchema: ValidationSchema = {
    name: {
      required: true,
      minLength: 2,
      maxLength: 50,
    },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    bio: {
      maxLength: 200,
    },
  };

  // React 19 Feature: Using useValidatedFormAction for form handling
  const { state, submitValidatedForm, isPending } = useValidatedFormAction(
    updateUserProfileAction,
    validationSchema
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data: FormDataType = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      bio: formData.get('bio') as string,
    };

    const result = submitValidatedForm(data);
    if (result.success) {
      setShowSuccess(true);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          User Profile Form (with Actions)
        </Typography>
        
        <Alert severity="info" sx={{ mb: 3 }}>
          <AlertTitle>React 19 Form Actions</AlertTitle>
          This form uses useActionState and form actions for handling submissions,
          with automatic pending states and enhanced error handling.
        </Alert>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            name="name"
            label="Full Name"
            defaultValue={appState.user.name}
            required
            fullWidth
            disabled={isPending}
          />
          
          <TextField
            name="email"
            label="Email"
            type="email"
            defaultValue={appState.user.email}
            required
            fullWidth
            disabled={isPending}
          />
          
          <TextField
            name="bio"
            label="Bio"
            multiline
            rows={3}
            placeholder="Tell us about yourself..."
            fullWidth
            disabled={isPending}
          />

          <Button
            type="submit"
            variant="contained"
            disabled={isPending}
            startIcon={isPending ? <CircularProgress size={16} /> : <Save />}
            sx={{ alignSelf: 'flex-start' }}
          >
            {isPending ? 'Saving...' : 'Save Profile'}
          </Button>
        </Box>

        {/* Display form state */}
        {state.error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {state.error}
          </Alert>
        )}

        {state.data && (
          <Alert severity="success" sx={{ mt: 2 }}>
            Profile updated successfully! ID: {state.data.id}
          </Alert>
        )}

        <Snackbar
          open={showSuccess}
          autoHideDuration={3000}
          onClose={() => setShowSuccess(false)}
          message="Profile updated successfully!"
        />
      </CardContent>
    </Card>
  );
};

// React 19 Feature: Post Creation with Optimistic Updates
const PostCreationForm: React.FC = () => {
  const { state: appState } = useAppContext();
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      title: 'Welcome to React 19',
      content: 'This is an example post showing optimistic updates.',
      author: appState.user.name,
      createdAt: new Date().toISOString(),
    },
  ]);

  // React 19 Feature: Using useOptimisticForm for immediate UI updates
  const { data: optimisticPosts, submitWithOptimistic, isPending } = useOptimisticForm(
    posts,
    createPostAction
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const postData: FormDataType = {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      author: appState.user.name,
    };

    // Create optimistic post for immediate UI update
    const optimisticPost: Post = {
      id: `temp-${Date.now()}`,
      title: postData.title as string,
      content: postData.content as string,
      author: postData.author as string,
      createdAt: new Date().toISOString(),
    };

    // React 19 Feature: Submit with optimistic update
    submitWithOptimistic(postData, optimisticPost);

    // Reset form
    (event.target as HTMLFormElement).reset();
  };

  const handleDeletePost = (postId: string) => {
    setPosts(prev => prev.filter(post => post.id !== postId));
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Create Post (with Optimistic Updates)
        </Typography>
        
        <Alert severity="info" sx={{ mb: 3 }}>
          <AlertTitle>React 19 Optimistic Updates</AlertTitle>
          This form uses useOptimistic to immediately show the new post in the UI
          while the actual submission happens in the background.
        </Alert>

        <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              name="title"
              label="Post Title"
              required
              fullWidth
              disabled={isPending}
            />
            
            <TextField
              name="content"
              label="Post Content"
              multiline
              rows={4}
              required
              fullWidth
              disabled={isPending}
            />

            <Button
              type="submit"
              variant="contained"
              disabled={isPending}
              startIcon={isPending ? <CircularProgress size={16} /> : <Send />}
              sx={{ alignSelf: 'flex-start' }}
            >
              {isPending ? 'Publishing...' : 'Publish Post'}
            </Button>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1" gutterBottom>
          Posts ({optimisticPosts.length})
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {optimisticPosts.map((post) => (
            <Paper
              key={post.id}
              sx={{
                p: 2,
                opacity: post.id.startsWith('temp-') ? 0.7 : 1,
                border: post.id.startsWith('temp-') ? '2px dashed #1976d2' : '1px solid #e0e0e0',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {post.title}
                    {post.id.startsWith('temp-') && (
                      <Chip label="Publishing..." size="small" color="primary" sx={{ ml: 1 }} />
                    )}
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {post.content}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    By {post.author} • {new Date(post.createdAt).toLocaleString()}
                  </Typography>
                </Box>
                <IconButton
                  onClick={() => handleDeletePost(post.id)}
                  disabled={post.id.startsWith('temp-')}
                  size="small"
                >
                  <Delete />
                </IconButton>
              </Box>
            </Paper>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

// React 19 Feature: Settings Form with Actions
const SettingsForm: React.FC = () => {
  const { state, updatePreferences } = useAppContext();
  const [localSettings, setLocalSettings] = useState(state.user.preferences);

  // React 19 Feature: Using useFormAction for settings updates
  const { state: actionState, submitForm, isPending } = useFormAction(updatePreferencesAction);

  const handleSettingChange = (setting: keyof typeof localSettings, value: any) => {
    const newSettings = { ...localSettings, [setting]: value };
    setLocalSettings(newSettings);
  };

  const handleSubmit = () => {
    const formData: FormDataType = {
      theme: localSettings.theme,
      notifications: localSettings.notifications,
    };
    
    submitForm(formData);
    updatePreferences(localSettings);
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          User Settings (with Actions)
        </Typography>
        
        <Alert severity="info" sx={{ mb: 3 }}>
          <AlertTitle>React 19 Settings Management</AlertTitle>
          These settings use form actions to persist changes with proper error handling
          and automatic pending states.
        </Alert>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={localSettings.theme === 'dark'}
                onChange={(e) => handleSettingChange('theme', e.target.checked ? 'dark' : 'light')}
                disabled={isPending}
              />
            }
            label="Dark Mode"
          />

          <FormControlLabel
            control={
              <Switch
                checked={localSettings.notifications}
                onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                disabled={isPending}
              />
            }
            label="Enable Notifications"
          />

          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isPending}
            startIcon={isPending ? <CircularProgress size={16} /> : <Settings />}
            sx={{ alignSelf: 'flex-start', mt: 1 }}
          >
            {isPending ? 'Saving...' : 'Save Settings'}
          </Button>
        </Box>

        {actionState.error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {actionState.error}
          </Alert>
        )}

        {actionState.data && (
          <Alert severity="success" sx={{ mt: 2 }}>
            Settings saved successfully!
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

// React 19 Feature: Loading component for Suspense
const FormLoading: React.FC = () => (
  <Paper sx={{ p: 4, textAlign: 'center' }}>
    <CircularProgress size={40} />
    <Typography variant="h6" sx={{ mt: 2 }}>
      Loading React 19 Forms...
    </Typography>
    <Typography variant="body2" color="text.secondary">
      Preparing form actions and optimistic updates
    </Typography>
  </Paper>
);

const DemoPage: React.FC = () => {
  const [selectedDemo, setSelectedDemo] = useState<'profile' | 'posts' | 'settings'>('profile');

  const demos = [
    { id: 'profile', label: 'Profile Form', icon: <Person />, description: 'Form actions with validation' },
    { id: 'posts', label: 'Post Creation', icon: <Edit />, description: 'Optimistic updates demo' },
    { id: 'settings', label: 'Settings', icon: <Settings />, description: 'Settings with actions' },
  ];

  return (
    <Box>
      <Typography variant="h2" component="h1" gutterBottom textAlign="center">
        React 19 Demo
      </Typography>
      <Typography variant="h6" color="text.secondary" textAlign="center" paragraph>
        Interactive demonstrations of React 19's form actions and optimistic updates
      </Typography>

      {/* Demo selector */}
      <Paper sx={{ p: 2, mb: 4 }}>
        <Typography variant="h6" gutterBottom>Select a Demo</Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {demos.map((demo) => (
            <Button
              key={demo.id}
              variant={selectedDemo === demo.id ? 'contained' : 'outlined'}
              startIcon={demo.icon}
              onClick={() => setSelectedDemo(demo.id as any)}
              sx={{ flex: 1, minWidth: '200px' }}
            >
              <Box sx={{ textAlign: 'left' }}>
                <Typography variant="button" display="block">
                  {demo.label}
                </Typography>
                <Typography variant="caption" display="block">
                  {demo.description}
                </Typography>
              </Box>
            </Button>
          ))}
        </Box>
      </Paper>

      {/* Demo content with Suspense */}
      <Suspense fallback={<FormLoading />}>
        {selectedDemo === 'profile' && <UserProfileForm />}
        {selectedDemo === 'posts' && <PostCreationForm />}
        {selectedDemo === 'settings' && <SettingsForm />}
      </Suspense>

      {/* Feature highlights */}
      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          React 19 Form Features Demonstrated
        </Typography>
        <List>
          <ListItem>
            <ListItemIcon>
              <CheckCircle color="success" />
            </ListItemIcon>
            <ListItemText
              primary="useActionState Hook"
              secondary="Manage form submissions with built-in pending states and error handling"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircle color="success" />
            </ListItemIcon>
            <ListItemText
              primary="useOptimistic Hook"
              secondary="Provide immediate UI feedback with optimistic updates that rollback on error"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircle color="success" />
            </ListItemIcon>
            <ListItemText
              primary="Form Actions"
              secondary="Server action simulation with proper TypeScript integration"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircle color="success" />
            </ListItemIcon>
            <ListItemText
              primary="Enhanced Validation"
              secondary="Built-in form validation with React 19's improved error boundaries"
            />
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
};

export default DemoPage;
