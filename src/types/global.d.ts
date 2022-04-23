/// <reference types="react-scripts" />

declare module '*.jpg';
declare module '*.png';

declare global {
  interface Window {
    openSnackbar: (message: string) => void;
  }
}

declare module 'react-chartjs-2' {
  interface LinearComponentProps {
    className?: string;
  }
}

export {};