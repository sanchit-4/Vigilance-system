/**
 * Enhanced geofencing utilities with precise distance calculation
 */

// Haversine formula to calculate distance between two points on Earth with high precision
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
};

/**
 * Check if a guard is within the geofence of a location
 */
export const isWithinGeofence = (
    guardLat: number,
    guardLon: number,
    locationLat: number,
    locationLon: number,
    radiusMeters: number
): boolean => {
    const distance = calculateDistance(guardLat, guardLon, locationLat, locationLon);
    return distance <= radiusMeters;
};

/**
 * Get geofence status with detailed information
 */
export const getGeofenceStatus = (
    guardLat: number,
    guardLon: number,
    locationLat: number,
    locationLon: number,
    radiusMeters: number
) => {
    const distance = calculateDistance(guardLat, guardLon, locationLat, locationLon);
    const isWithin = distance <= radiusMeters;
    
    return {
        distance: Math.round(distance),
        isWithin,
        radiusMeters,
        message: isWithin 
            ? `✓ Within geofence (${Math.round(distance)}m from site)`
            : `✗ Outside geofence (${Math.round(distance)}m from site, max ${radiusMeters}m allowed)`
    };
};

/**
 * Format distance for display
 */
export const formatDistance = (meters: number): string => {
    if (meters < 1000) {
        return `${Math.round(meters)}m`;
    }
    return `${(meters / 1000).toFixed(1)}km`;
};