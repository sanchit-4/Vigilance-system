
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

