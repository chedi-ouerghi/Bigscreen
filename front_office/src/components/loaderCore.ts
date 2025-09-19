// components/loaderCore.tsx
import { createContext, useContext } from "react";

export type LoaderContextType = {
  isLoading: boolean;
  progress: number;
  showLoader: (start?: number) => void;
  updateLoader: (value: number) => void;
  hideLoader: () => void;
  startLoadingAndNavigate: (path: string, navigate: (path: string) => void) => void;
};

export const LoaderContext = createContext<LoaderContextType>({
  isLoading: false,
  progress: 0,
  showLoader: () => {},
  updateLoader: () => {},
  hideLoader: () => {},
  startLoadingAndNavigate: () => {},
});

export const useLoader = () => useContext(LoaderContext);