import { useState, useRef, useCallback } from 'react';

interface CameraState {
    isOpen: boolean;
    isCapturing: boolean;
    error: string | null;
    photoDataUrl: string | null;
}

export const useCamera = () => {
    const [state, setState] = useState<CameraState>({
        isOpen: false,
        isCapturing: false,
        error: null,
        photoDataUrl: null,
    });
    
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const openCamera = useCallback(async () => {
        setState(prev => ({ ...prev, isOpen: true, error: null }));
        
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { 
                    width: { ideal: 640 },
                    height: { ideal: 480 },
                    facingMode: 'user'
                }
            });
            
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (error) {
            setState(prev => ({ 
                ...prev, 
                error: 'Camera access denied. Please allow camera permissions and try again.',
                isOpen: false 
            }));
        }
    }, []);

    const capturePhoto = useCallback(() => {
        if (!videoRef.current || !streamRef.current) return;

        setState(prev => ({ ...prev, isCapturing: true }));

        const canvas = document.createElement('canvas');
        const video = videoRef.current;
        
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.drawImage(video, 0, 0);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
            
            setState(prev => ({ 
                ...prev, 
                photoDataUrl: dataUrl,
                isCapturing: false,
                isOpen: false 
            }));
            
            closeCamera();
        }
    }, []);

    const closeCamera = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        
        setState(prev => ({ ...prev, isOpen: false, isCapturing: false }));
    }, []);

    const resetPhoto = useCallback(() => {
        setState(prev => ({ ...prev, photoDataUrl: null, error: null }));
    }, []);

    return {
        ...state,
        videoRef,
        openCamera,
        capturePhoto,
        closeCamera,
        resetPhoto,
    };
};