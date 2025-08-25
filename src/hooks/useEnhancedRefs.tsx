import { useRef, useImperativeHandle, forwardRef, useCallback, useEffect } from 'react';

/**
 * React 19 Enhanced Ref Features
 * 
 * React 19 Ref Improvements:
 * 1. Automatic ref forwarding for all components
 * 2. Enhanced useImperativeHandle with better performance
 * 3. Improved ref callback handling
 * 4. Better integration with TypeScript
 * 5. Automatic cleanup and lifecycle management
 */

// Define types for our enhanced input component
export interface EnhancedInputRef {
  focus: () => void;
  blur: () => void;
  clear: () => void;
  getValue: () => string;
  setValue: (value: string) => void;
  scrollIntoView: () => void;
  validate: () => boolean;
}

interface EnhancedInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onValidate?: (value: string) => boolean;
  className?: string;
  required?: boolean;
  type?: 'text' | 'email' | 'password' | 'number';
}

// React 19 Feature: Enhanced forwardRef with automatic ref forwarding
// React 19 provides better ref forwarding capabilities and TypeScript integration
export const EnhancedInput = forwardRef<EnhancedInputRef, EnhancedInputProps>(
  ({ placeholder, value, onChange, onValidate, className, required, type = 'text' }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const validationRef = useRef<boolean>(true);

    // React 19 Feature: Enhanced useImperativeHandle with better performance
    // React 19 optimizes imperative handle updates and provides better cleanup
    useImperativeHandle(ref, () => ({
      focus: () => {
        inputRef.current?.focus();
      },
      blur: () => {
        inputRef.current?.blur();
      },
      clear: () => {
        if (inputRef.current) {
          inputRef.current.value = '';
          onChange?.('');
        }
      },
      getValue: () => {
        return inputRef.current?.value || '';
      },
      setValue: (newValue: string) => {
        if (inputRef.current) {
          inputRef.current.value = newValue;
          onChange?.(newValue);
        }
      },
      scrollIntoView: () => {
        inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      },
      validate: () => {
        const currentValue = inputRef.current?.value || '';
        const isValid = onValidate ? onValidate(currentValue) : true;
        validationRef.current = isValid;
        
        // Visual feedback for validation
        if (inputRef.current) {
          inputRef.current.style.borderColor = isValid ? '#4caf50' : '#f44336';
        }
        
        return isValid;
      },
    }), [onChange, onValidate]); // React 19 automatically optimizes these dependencies

    // React 19 Feature: Enhanced event handling with automatic optimization
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      onChange?.(newValue);
      
      // Auto-validate on change if validator is provided
      if (onValidate) {
        const isValid = onValidate(newValue);
        validationRef.current = isValid;
        e.target.style.borderColor = isValid ? '#4caf50' : '#f44336';
      }
    }, [onChange, onValidate]);

    // React 19 Feature: Enhanced useEffect with better cleanup
    useEffect(() => {
      const input = inputRef.current;
      if (!input) return;

      // Enhanced focus management
      const handleFocus = () => {
        input.style.outline = '2px solid #1976d2';
      };

      const handleBlur = () => {
        input.style.outline = 'none';
        if (required && !input.value) {
          input.style.borderColor = '#f44336';
        }
      };

      input.addEventListener('focus', handleFocus);
      input.addEventListener('blur', handleBlur);

      // React 19 Feature: Automatic cleanup optimization
      return () => {
        input.removeEventListener('focus', handleFocus);
        input.removeEventListener('blur', handleBlur);
      };
    }, [required]);

    return (
      <input
        ref={inputRef}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        className={className}
        style={{
          padding: '12px',
          border: '2px solid #ddd',
          borderRadius: '8px',
          fontSize: '16px',
          transition: 'all 0.3s ease',
          width: '100%',
        }}
      />
    );
  }
);

EnhancedInput.displayName = 'EnhancedInput';

// React 19 Feature: Custom hook for managing multiple refs
export const useMultipleRefs = <T extends HTMLElement>() => {
  const refs = useRef<Map<string, T | null>>(new Map());

  const setRef = useCallback((key: string) => (element: T | null) => {
    refs.current.set(key, element);
  }, []);

  const getRef = useCallback((key: string): T | null => {
    return refs.current.get(key) || null;
  }, []);

  const focusRef = useCallback((key: string) => {
    const element = refs.current.get(key);
    if (element && 'focus' in element) {
      (element as any).focus();
    }
  }, []);

  const clearRefs = useCallback(() => {
    refs.current.clear();
  }, []);

  return { setRef, getRef, focusRef, clearRefs };
};

// React 19 Feature: Enhanced ref callback with performance optimization
export const useRefCallback = <T extends HTMLElement>(
  callback: (element: T | null) => void | (() => void)
) => {
  const cleanupRef = useRef<(() => void) | void>(undefined);

  return useCallback((element: T | null) => {
    // Clean up previous callback
    if (cleanupRef.current) {
      cleanupRef.current();
    }

    // Execute new callback and store cleanup function
    cleanupRef.current = callback(element);
  }, [callback]);
};

// React 19 Feature: Hook for managing focus within a component tree
export const useFocusManagement = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const focusableElements = useRef<HTMLElement[]>([]);

  const updateFocusableElements = useCallback(() => {
    if (!containerRef.current) return;

    const elements = containerRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;

    focusableElements.current = Array.from(elements);
  }, []);

  const focusFirst = useCallback(() => {
    updateFocusableElements();
    focusableElements.current[0]?.focus();
  }, [updateFocusableElements]);

  const focusLast = useCallback(() => {
    updateFocusableElements();
    const elements = focusableElements.current;
    elements[elements.length - 1]?.focus();
  }, [updateFocusableElements]);

  const focusNext = useCallback(() => {
    updateFocusableElements();
    const currentIndex = focusableElements.current.findIndex(
      el => el === document.activeElement
    );
    const nextIndex = (currentIndex + 1) % focusableElements.current.length;
    focusableElements.current[nextIndex]?.focus();
  }, [updateFocusableElements]);

  const focusPrevious = useCallback(() => {
    updateFocusableElements();
    const currentIndex = focusableElements.current.findIndex(
      el => el === document.activeElement
    );
    const prevIndex = currentIndex <= 0 
      ? focusableElements.current.length - 1 
      : currentIndex - 1;
    focusableElements.current[prevIndex]?.focus();
  }, [updateFocusableElements]);

  useEffect(() => {
    updateFocusableElements();
  }, [updateFocusableElements]);

  return {
    containerRef,
    focusFirst,
    focusLast,
    focusNext,
    focusPrevious,
    updateFocusableElements,
  };
};
