import React from 'react';
import { Loader } from 'lucide-react';

interface SpinnerProps {
    size?: number;
    className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 24, className = '' }) => {
    return <Loader size={size} className={`animate-spin text-primary ${className}`} />;
};
