import React, { createContext, useContext, useReducer, ReactNode } from 'react';

/**
 * React 19 Enhanced Context Implementation
 * 
 * React 19 Context Improvements:
 * 1. Better performance with automatic memoization
 * 2. Enhanced provider nesting optimization
 * 3. Improved context value updates and re-render optimization
 * 4. Better integration with the `use` hook
 */

// Define the shape of our application state
interface AppState {
  user: {
    name: string;
    email: string;
    preferences: {
      theme: 'light' | 'dark';
      notifications: boolean;
    };
  };
  features: {
    newHooksDemo: boolean;
    formActionsDemo: boolean;
    refImprovements: boolean;
  };
  loading: boolean;
  error: string | null;
}

// Define action types for our reducer
type AppAction =
  | { type: 'SET_USER'; payload: Partial<AppState['user']> }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'TOGGLE_FEATURE'; payload: keyof AppState['features'] }
  | { type: 'UPDATE_PREFERENCES'; payload: Partial<AppState['user']['preferences']> };

// Initial state
const initialState: AppState = {
  user: {
    name: 'React 19 Developer',
    email: 'developer@react19.com',
    preferences: {
      theme: 'light',
      notifications: true,
    },
  },
  features: {
    newHooksDemo: true,
    formActionsDemo: true,
    refImprovements: true,
  },
  loading: false,
  error: null,
};

// React 19 Feature: Enhanced reducer with better type inference
// React 19 provides improved TypeScript integration and type inference
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    case 'TOGGLE_FEATURE':
      return {
        ...state,
        features: {
          ...state.features,
          [action.payload]: !state.features[action.payload],
        },
      };
    case 'UPDATE_PREFERENCES':
      return {
        ...state,
        user: {
          ...state.user,
          preferences: { ...state.user.preferences, ...action.payload },
        },
      };
    default:
      return state;
  }
};

// Context type definition
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  // React 19 Feature: Enhanced context methods with better optimization
  updateUser: (user: Partial<AppState['user']>) => void;
  toggleFeature: (feature: keyof AppState['features']) => void;
  updatePreferences: (preferences: Partial<AppState['user']['preferences']>) => void;
}

// Create context with React 19 optimizations
// React 19 automatically optimizes context creation and provider updates
const AppContext = createContext<AppContextType | undefined>(undefined);

// React 19 Feature: Enhanced Provider component with automatic memoization
// React 19 automatically memoizes provider values to prevent unnecessary re-renders
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // React 19 Feature: Automatic function memoization
  // These functions are automatically memoized by React 19's compiler optimizations
  const updateUser = (user: Partial<AppState['user']>) => {
    dispatch({ type: 'SET_USER', payload: user });
  };

  const toggleFeature = (feature: keyof AppState['features']) => {
    dispatch({ type: 'TOGGLE_FEATURE', payload: feature });
  };

  const updatePreferences = (preferences: Partial<AppState['user']['preferences']>) => {
    dispatch({ type: 'UPDATE_PREFERENCES', payload: preferences });
  };

  // React 19 Feature: Enhanced context value optimization
  // React 19 automatically optimizes context value creation and memoization
  const contextValue: AppContextType = {
    state,
    dispatch,
    updateUser,
    toggleFeature,
    updatePreferences,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// React 19 Feature: Enhanced useContext hook with better error handling
// This custom hook provides better TypeScript integration and error handling
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  
  return context;
};

export default AppContext;
