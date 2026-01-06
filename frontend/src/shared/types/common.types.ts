export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;

export type AsyncFunction<T = void> = () => Promise<T>;

export const LoadingState = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
} as const;

export type LoadingState = (typeof LoadingState)[keyof typeof LoadingState];

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}
