import React from 'react';
import { Camera, X, RotateCcw } from 'lucide-react';
import { Button } from './Button';

interface CameraCaptureProps {
    isOpen: boolean;
    isCapturing: boolean;
    error: string | null;
    photoDataUrl: string | null;
    videoRef: React.RefObject<HTMLVideoElement>;
    onOpenCamera: () => void;
    onCapturePhoto: () => void;
    onCloseCamera: () => void;
    onResetPhoto: () => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({
    isOpen,
    isCapturing,
    error,
    photoDataUrl,
    videoRef,
    onOpenCamera,
    onCapturePhoto,
    onCloseCamera,
    onResetPhoto,
}) => {
    if (photoDataUrl) {
        return (
            <div className="space-y-4">
                <div className="relative">
                    <img 
                        src={photoDataUrl} 
                        alt="Captured verification photo" 
                        className="w-full max-w-sm mx-auto rounded-lg border-2 border-green-200"
                    />
                    <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                        ✓ Photo Captured
                    </div>
                </div>
                <div className="flex justify-center">
                    <Button 
                        variant="secondary" 
                        size="sm" 
                        onClick={onResetPhoto}
                        className="flex items-center"
                    >
                        <RotateCcw size={16} className="mr-2" />
                        Retake Photo
                    </Button>
                </div>
            </div>
        );
    }

    if (isOpen) {
        return (
            <div className="space-y-4">
                <div className="relative bg-black rounded-lg overflow-hidden">
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full max-w-sm mx-auto"
                    />
                    <button
                        onClick={onCloseCamera}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    >
                        <X size={16} />
                    </button>
                </div>
                <div className="flex justify-center space-x-3">
                    <Button 
                        onClick={onCapturePhoto} 
                        disabled={isCapturing}
                        className="flex items-center"
                    >
                        <Camera size={16} className="mr-2" />
                        {isCapturing ? 'Capturing...' : 'Take Photo'}
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {error && (
                <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded-md text-sm">
                    {error}
                </div>
            )}
            <div className="text-center">
                <div className="w-32 h-32 mx-auto bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center mb-4">
                    <Camera size={32} className="text-gray-400" />
                </div>
                <Button onClick={onOpenCamera} variant="secondary" className="flex items-center mx-auto">
                    <Camera size={16} className="mr-2" />
                    Take Verification Photo
                </Button>
                <p className="text-xs text-gray-500 mt-2">
                    Photo required for identity verification
                </p>
            </div>
        </div>
    );
};