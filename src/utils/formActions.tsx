import { useState, useTransition, useCallback } from 'react';

/**
 * React 19 Form Actions and State Management
 * 
 * Note: This implementation provides fallbacks for React 19 features
 * that may not be available in the current React version.
 * In a real React 19 environment, these would use useActionState and useOptimistic.
 */

// Define types for our form actions
export interface FormData {
  [key: string]: string | number | boolean;
}

export interface ActionResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface ActionState<T = any> {
  data: T | null;
  error: string | null;
  pending: boolean;
  lastAction: string | null;
}

// Simulate server API calls
const simulateApiCall = async <T,>(
  endpoint: string,
  data: any,
  delay: number = 1000
): Promise<ActionResult<T>> => {
  await new Promise(resolve => setTimeout(resolve, delay));
  
  // Simulate occasional failures for demonstration
  if (Math.random() < 0.1) {
    throw new Error(`API Error: Failed to ${endpoint}`);
  }

  return {
    success: true,
    data: {
      id: Date.now().toString(),
      ...data,
      createdAt: new Date().toISOString(),
    } as T,
    timestamp: new Date().toISOString(),
  };
};

// React 19 Feature: Enhanced form action for user profile updates
export const updateUserProfileAction = async (
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> => {
  try {
    // Simulate server action with React 19's enhanced error handling
    const result = await simulateApiCall('updateProfile', formData, 1200);
    
    return {
      data: result.data,
      error: null,
      pending: false,
      lastAction: 'updateProfile',
    };
  } catch (error) {
    return {
      data: prevState.data,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      pending: false,
      lastAction: 'updateProfile',
    };
  }
};

// React 19 Feature: Action for creating new posts with optimistic updates
export const createPostAction = async (
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> => {
  try {
    const result = await simulateApiCall('createPost', formData, 800);
    
    return {
      data: result.data,
      error: null,
      pending: false,
      lastAction: 'createPost',
    };
  } catch (error) {
    return {
      data: prevState.data,
      error: error instanceof Error ? error.message : 'Failed to create post',
      pending: false,
      lastAction: 'createPost',
    };
  }
};

// React 19 Feature: Action for managing user preferences
export const updatePreferencesAction = async (
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> => {
  try {
    const result = await simulateApiCall('updatePreferences', formData, 600);
    
    return {
      data: result.data,
      error: null,
      pending: false,
      lastAction: 'updatePreferences',
    };
  } catch (error) {
    return {
      data: prevState.data,
      error: error instanceof Error ? error.message : 'Failed to update preferences',
      pending: false,
      lastAction: 'updatePreferences',
    };
  }
};

// Fallback implementation for useActionState
const useActionState = <T,>(
  action: (prevState: ActionState<T>, formData: FormData) => Promise<ActionState<T>>,
  initialState: ActionState<T>
): [ActionState<T>, (formData: FormData) => void, boolean] => {
  const [state, setState] = useState<ActionState<T>>(initialState);
  const [isPending, startTransition] = useTransition();

  const dispatch = useCallback((formData: FormData) => {
    startTransition(async () => {
      setState(prev => ({ ...prev, pending: true }));
      try {
        const newState = await action(state, formData);
        setState(newState);
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Unknown error',
          pending: false,
        }));
      }
    });
  }, [action, state]);

  return [{ ...state, pending: isPending }, dispatch, isPending];
};

// Fallback implementation for useOptimistic
const useOptimistic = <T,>(
  state: T[],
  updateFn: (state: T[], optimisticValue: T) => T[]
): [T[], (optimisticValue: T) => void] => {
  const [optimisticState, setOptimisticState] = useState<T[]>(state);
  const [isPending] = useTransition();

  const addOptimistic = useCallback((optimisticValue: T) => {
    setOptimisticState(prev => updateFn(prev, optimisticValue));
    
    // Reset to original state after a delay (simulating server response)
    setTimeout(() => {
      if (!isPending) {
        setOptimisticState(state);
      }
    }, 2000);
  }, [updateFn, state, isPending]);

  return [optimisticState, addOptimistic];
};

// React 19 Feature: Custom hook for handling form actions with useActionState
export const useFormAction = <T,>(
  action: (prevState: ActionState<T>, formData: FormData) => Promise<ActionState<T>>,
  initialState: ActionState<T> = {
    data: null,
    error: null,
    pending: false,
    lastAction: null,
  }
) => {
  // In React 19, this would use the native useActionState hook
  const [state, dispatch, isPending] = useActionState(action, initialState);

  const submitForm = (formData: FormData) => {
    dispatch(formData);
  };

  const reset = () => {
    dispatch({} as FormData); // Reset to initial state
  };

  return {
    state: { ...state, pending: isPending },
    submitForm,
    reset,
    isPending,
  };
};

// React 19 Feature: Hook for optimistic UI updates
export const useOptimisticForm = <T,>(
  initialData: T[],
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>
) => {
  // In React 19, this would use the native useOptimistic hook
  const [optimisticData, addOptimistic] = useOptimistic(
    initialData,
    (state: T[], newItem: T) => [...state, newItem]
  );

  const [actionState, dispatch, isPending] = useActionState(action, {
    data: null,
    error: null,
    pending: false,
    lastAction: null,
  });

  const submitWithOptimistic = (formData: FormData, optimisticItem: T) => {
    // Add optimistic update immediately
    addOptimistic(optimisticItem);

    // Then perform the actual action
    dispatch(formData);
  };

  return {
    data: optimisticData,
    actionState: { ...actionState, pending: isPending },
    submitWithOptimistic,
    isPending,
  };
};

// React 19 Feature: Enhanced form validation with actions
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

export interface ValidationSchema {
  [field: string]: ValidationRule;
}

export const validateFormData = (
  formData: FormData,
  schema: ValidationSchema
): { isValid: boolean; errors: { [field: string]: string } } => {
  const errors: { [field: string]: string } = {};

  for (const [field, rules] of Object.entries(schema)) {
    const value = formData[field];

    if (rules.required && (!value || value === '')) {
      errors[field] = `${field} is required`;
      continue;
    }

    if (value && typeof value === 'string') {
      if (rules.minLength && value.length < rules.minLength) {
        errors[field] = `${field} must be at least ${rules.minLength} characters`;
        continue;
      }

      if (rules.maxLength && value.length > rules.maxLength) {
        errors[field] = `${field} must be no more than ${rules.maxLength} characters`;
        continue;
      }

      if (rules.pattern && !rules.pattern.test(value)) {
        errors[field] = `${field} format is invalid`;
        continue;
      }
    }

    if (rules.custom) {
      const customError = rules.custom(value);
      if (customError) {
        errors[field] = customError;
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// React 19 Feature: Hook for form validation with actions
export const useValidatedFormAction = <T,>(
  action: (prevState: ActionState<T>, formData: FormData) => Promise<ActionState<T>>,
  validationSchema: ValidationSchema,
  initialState: ActionState<T> = {
    data: null,
    error: null,
    pending: false,
    lastAction: null,
  }
) => {
  const { state, submitForm, reset, isPending } = useFormAction(action, initialState);

  const submitValidatedForm = (formData: FormData) => {
    const validation = validateFormData(formData, validationSchema);
    
    if (!validation.isValid) {
      // Update state with validation errors
      const errorMessage = Object.values(validation.errors).join(', ');
      console.error('Validation errors:', validation.errors);
      return { success: false, errors: validation.errors };
    }

    submitForm(formData);
    return { success: true, errors: {} };
  };

  return {
    state,
    submitValidatedForm,
    reset,
    isPending,
  };
};
