"use client";
import React, { useEffect, useRef } from "react";
const MAP_API_KEY = "AIzaSyDM7GPIrnTdYQ0Oy0o-XjG-D-rViPsLE_I";
declare global {
  interface Window {
    google: any;
  }
}
type Props = {
  children?: React.ReactNode;
  onChange?: any;
  clickable?: boolean;
  location?: { lat: number; lng: number };
  style?: {};
  className?: string;
};
const Map: React.FC<Props> = ({
  children,
  onChange,
  clickable = false,
  location = { lat: 0, lng: 0 },
  style,
  className = "",
}) => {
  const mapRef = useRef(null);
  useEffect(() => {
    const initMap = () => {
      const map = new window.google.maps.Map(mapRef.current, {
        center: location,
        zoom: 12,
      });
      if (navigator.geolocation && clickable) {
        navigator.geolocation.getCurrentPosition((position) => {
          map.setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        });
      }
      // Add click event listener to the map
      const marker = new window.google.maps.Marker();
      if (clickable) {
        window.google.maps.event.addListener(map, "click", (event: any) => {
          marker.setPosition(event.latLng);
          marker.setMap(map);
          onChange(event.latLng);
        });
      } else {
        marker.setPosition(location);
        marker.setMap(map);
      }
    };

    if (window.google) {
      initMap();
    } else {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${MAP_API_KEY}`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      document.body.appendChild(script);
    }
  }, []);
  return (
    <div className={`relative w-full ${className}`} style={style}>
      {children}
      <div id="map" className="absolute w-full h-full" ref={mapRef}></div>
    </div>
  );
};

export default Map;
