import { useState, useEffect, useMemo } from 'react';

/**
 * React 19 `use` Hook Demonstrations
 * 
 * Note: This implementation provides fallbacks for React 19 features
 * that may not be available in the current React version.
 * In a real React 19 environment, these would use the native `use` hook.
 */

// Sample API functions to simulate server data
const mockApiDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Cache implementation for resource optimization
const cache = <T extends (...args: any[]) => any>(fn: T): T => {
  const cacheMap = new Map();
  return ((...args: any[]) => {
    const key = JSON.stringify(args);
    if (cacheMap.has(key)) {
      return cacheMap.get(key);
    }
    const result = fn(...args);
    cacheMap.set(key, result);
    return result;
  }) as T;
};

export const fetchUserData = cache(async (userId: string) => {
  await mockApiDelay(1000); // Simulate network delay
  return {
    id: userId,
    name: `User ${userId}`,
    email: `user${userId}@example.com`,
    avatar: `https://i.pravatar.cc/150?u=${userId}`,
    joinDate: new Date().toISOString(),
    stats: {
      posts: Math.floor(Math.random() * 100),
      followers: Math.floor(Math.random() * 1000),
      following: Math.floor(Math.random() * 500),
    },
  };
});

export const fetchPostsData = cache(async (userId: string) => {
  await mockApiDelay(800);
  return Array.from({ length: 5 }, (_, i) => ({
    id: `post-${i + 1}`,
    title: `Post ${i + 1} by User ${userId}`,
    content: `This is the content of post ${i + 1}. It demonstrates React 19's use hook for async data fetching.`,
    likes: Math.floor(Math.random() * 50),
    comments: Math.floor(Math.random() * 20),
    timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
  }));
});

export const fetchNotifications = cache(async () => {
  await mockApiDelay(600);
  return [
    {
      id: '1',
      type: 'like',
      message: 'Someone liked your post',
      timestamp: new Date().toISOString(),
      read: false,
    },
    {
      id: '2',
      type: 'comment',
      message: 'New comment on your post',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      read: false,
    },
    {
      id: '3',
      type: 'follow',
      message: 'You have a new follower',
      timestamp: new Date(Date.now() - 600000).toISOString(),
      read: true,
    },
  ];
});

// Fallback implementation for the `use` hook
const usePromise = <T,>(promise: Promise<T>): T => {
  const [state, setState] = useState<{
    status: 'pending' | 'resolved' | 'rejected';
    data?: T;
    error?: Error;
  }>({ status: 'pending' });

  useEffect(() => {
    promise
      .then(data => setState({ status: 'resolved', data }))
      .catch(error => setState({ status: 'rejected', error }));
  }, [promise]);

  if (state.status === 'pending') {
    throw promise; // This will be caught by Suspense
  }
  
  if (state.status === 'rejected') {
    throw state.error;
  }
  
  return state.data as T;
};

// React 19 Feature: Custom hook using the `use` hook for data fetching
export const useAsyncData = <T,>(promise: Promise<T>) => {
  // In React 19, this would use: return use(promise);
  return usePromise(promise);
};

// React 19 Feature: Enhanced hook for managing multiple async resources
export const useMultipleResources = (userId: string) => {
  // Create promises for multiple resources
  const userPromise = useMemo(() => fetchUserData(userId), [userId]);
  const postsPromise = useMemo(() => fetchPostsData(userId), [userId]);
  const notificationsPromise = useMemo(() => fetchNotifications(), []);

  // In React 19, these would use the `use` hook directly
  const user = usePromise(userPromise);
  const posts = usePromise(postsPromise);
  const notifications = usePromise(notificationsPromise);

  return { user, posts, notifications };
};

// React 19 Feature: Hook for managing real-time data
export const useRealTimeData = (endpoint: string, interval: number = 5000) => {
  const [timestamp, setTimestamp] = useState(() => Date.now());
  const [data, setData] = useState({
    endpoint,
    data: `Real-time data from ${endpoint}`,
    timestamp: new Date().toISOString(),
    value: Math.floor(Math.random() * 100),
  });

  useEffect(() => {
    if (interval === 0) return;
    
    const timer = setInterval(async () => {
      await mockApiDelay(300);
      setData({
        endpoint,
        data: `Real-time data from ${endpoint}`,
        timestamp: new Date().toISOString(),
        value: Math.floor(Math.random() * 100),
      });
    }, interval);

    return () => clearInterval(timer);
  }, [endpoint, interval]);

  return data;
};
