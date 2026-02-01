import { ReactNode } from "react";

export interface WindowProps {
    id?: string;
    title: string;
    children?: ReactNode;
    onClose?: () => void;
    isMinimized?: boolean;
    isMaximized?: boolean;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
}

export interface WindowState {
    id: string;
    component: ReactNode;
    zIndex: number;
    isVisible: boolean;
}

// TODO: Add more window types and interfaces
