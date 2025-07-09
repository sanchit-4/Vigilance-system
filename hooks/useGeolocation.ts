
import { useState, useEffect } from 'react';

interface GeolocationState {
    loading: boolean;
    error: GeolocationPositionError | Error | null;
    data: GeolocationPosition | null;
}

export const useGeolocation = () => {
    const [state, setState] = useState<GeolocationState>({
        loading: true,
        error: null,
        data: null,
    });

    const refresh = () => {
        setState({ loading: true, error: null, data: null });
        if (!navigator.geolocation) {
            setState({
                loading: false,
                error: new Error('Geolocation is not supported by your browser'),
                data: null,
            });
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setState({
                    loading: false,
                    error: null,
                    data: position,
                });
            },
            (error) => {
                setState({
                    loading: false,
                    error: error,
                    data: null,
                });
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };
    
    // Initial fetch
    useEffect(() => {
        refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return { ...state, refresh };
};

// Haversine formula to calculate distance between two points on Earth
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // in metres
};
