import { useEffect, useMemo, useRef } from 'react';
import Map, { Marker, Source, Layer, NavigationControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin } from 'lucide-react';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

interface Stop {
  id: string;
  city_name: string;
  latitude: number;
  longitude: number;
  order_index: number;
}

interface ItineraryMapProps {
  stops: Stop[];
  interactive?: boolean;
}

export function ItineraryMap({ stops, interactive = true }: ItineraryMapProps) {
  const mapRef = useRef<any>(null);

  // Sort stops by order_index
  const sortedStops = useMemo(() => 
    [...stops].sort((a, b) => a.order_index - b.order_index),
  [stops]);

  // Create GeoJSON for the route line
  const routeData = useMemo(() => ({
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: sortedStops.map(stop => [stop.longitude, stop.latitude])
    }
  }), [sortedStops]);

  // Auto-fit bounds when stops change
  useEffect(() => {
    if (sortedStops.length > 0 && mapRef.current) {
      const lngs = sortedStops.map(s => s.longitude);
      const lats = sortedStops.map(s => s.latitude);
      
      const minLng = Math.min(...lngs);
      const maxLng = Math.max(...lngs);
      const minLat = Math.min(...lats);
      const maxLat = Math.max(...lats);

      mapRef.current.fitBounds(
        [[minLng, minLat], [maxLng, maxLat]],
        { padding: 100, duration: 1000 }
      );
    }
  }, [sortedStops]);

  if (!MAPBOX_TOKEN) {
    return (
      <div className="w-full h-[400px] bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700">
        <p className="text-slate-500 text-center px-6">
          Mapbox token missing. <br/>
          Please add <code className="bg-slate-200 dark:bg-slate-700 px-1 rounded">VITE_MAPBOX_TOKEN</code> to your .env file.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-[500px] rounded-3xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative">
      <Map
        ref={mapRef}
        mapboxAccessToken={MAPBOX_TOKEN}
        initialViewState={{
          longitude: sortedStops[0]?.longitude || 0,
          latitude: sortedStops[0]?.latitude || 0,
          zoom: 3
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        interactive={interactive}
      >
        <NavigationControl position="top-right" />

        {/* Route Line */}
        {sortedStops.length > 1 && (
          <Source id="route" type="geojson" data={routeData as any}>
            <Layer
              id="route-line"
              type="line"
              paint={{
                'line-color': '#3b82f6',
                'line-width': 4,
                'line-dasharray': [1, 2],
                'line-opacity': 0.8
              }}
            />
          </Source>
        )}

        {/* City Markers */}
        {sortedStops.map((stop) => (
          <Marker
            key={stop.id}
            longitude={stop.longitude}
            latitude={stop.latitude}
            anchor="bottom"
          >
            <div className="group relative">
              <div className="bg-white dark:bg-slate-900 p-1.5 rounded-full shadow-lg border-2 border-blue-500 transform group-hover:scale-110 transition-transform">
                <MapPin className="w-5 h-5 text-blue-500" fill="currentColor" fillOpacity={0.2} />
              </div>
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-slate-900 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {stop.city_name}
              </div>
            </div>
          </Marker>
        ))}
      </Map>
    </div>
  );
}
