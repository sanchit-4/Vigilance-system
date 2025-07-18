// Re-export all types from the main types file
export * from '../types';

// Additional type definitions for better type safety
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  hasMore: boolean;
  page: number;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface GeolocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

export interface CameraState {
  isOpen: boolean;
  isCapturing: boolean;
  error: string | null;
  photoDataUrl: string | null;
}

export interface FormState<T> {
  data: T;
  errors: Record<string, string>;
  isSubmitting: boolean;
}