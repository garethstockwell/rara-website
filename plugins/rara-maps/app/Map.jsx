import { useEffect, useRef, useState } from 'react';
import styles from './Map.module.css';
import { getAppData } from '../lib/appdata';
import createMap from '../lib/map.ts';
import flyRouteRadius from '../lib/fly_radius';
import { Route, flyRouteTangent } from '../lib/fly_tangent';

export default function Map({
  panelEnabled,
  panelOpen,
  data,
  activeObjectId,
  setActiveObjectId,
  setActiveObjectTitle,
  setActiveObjectIndex,
}) {
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef();
  const mapElemRef = useRef();
  const oldActiveLocation = useRef();
  const oldActiveOverlay = useRef();
  const oldActivePopup = useRef();
  const routeRef = useRef();

  function locationOnClick(id) {
    setActiveObjectId(id);
  }

  function onLocationChange() {
    if (mapRef.current) {
      const popups = getAppData(mapRef.current).popups;

      if (oldActivePopup.current) {
        oldActivePopup.current.visibleStatic = false;
      }

      if (activeObjectId) {
        const popup = popups.getPopup(activeObjectId);
        if (popup) {
          popup.visibleStatic = true;
        }

        oldActivePopup.current = popup;

        const loc = data.locations.features.find(
          (el) => (el?.properties?.id ?? null) === activeObjectId
        );
        if (loc) {
          if (data.view.fly === 'direct') {
            mapRef.current.flyTo({
              center: loc.geometry.coordinates,
            });
          }
          setActiveObjectTitle(loc ? loc.properties.title : '');

          if (data.view.fly === 'route' && oldActiveLocation.current) {
            const fromCoord = oldActiveLocation.current.geometry.coordinates;
            const toCoord = loc.geometry.coordinates;
            console.debug(
              `Fly from ${oldActiveLocation} ${fromCoord} to ${activeObjectId} ${toCoord}`
            );
            routeRef.current.fly(fromCoord, toCoord, 2000);
          }

          setActiveObjectTitle(loc ? loc.properties.title : '');
        }

        oldActiveLocation.current = loc;
      }
    }
  }

  function onOverlayChange() {
    if (mapRef.current) {
      const layers = getAppData(mapRef.current).layers;

      if (oldActiveOverlay.current) {
        layers.getLayer(oldActiveOverlay.current).visible = false;
      }

      layers.getLayer(activeObjectId).visible = true;

      oldActiveOverlay.current = activeObjectId;
    }
  }

  function onActiveObjectChange() {
    if (mapLoaded) {
      if (data.view.mode === 'location') {
        onLocationChange();
      }

      if (data.view.mode === 'overlay') {
        onOverlayChange();
      }
    }
  }

  useEffect(() => {
    onActiveObjectChange();
  }, [activeObjectId]);

  useEffect(() => {
    onActiveObjectChange();
  }, [mapLoaded]);

  function loadMap() {
    mapRef.current = createMap({
      container: 'map',
      data,
      overlay_opacity: 0.75,
      locationOnClick,
      locationVisible: true,
    });

    mapRef.current.on('load', () => {
      setMapLoaded(true);

      const line = data.lines.find((line) => (line?.properties?.id ?? null) === data.view.route);

      if (data.view.mode === 'fly_radius') {
        flyRouteRadius({
          center: data.view.config.center,
          coordinates: line.geometry.coordinates,
          map: mapRef.current,
        });
      }

      if (data.view.mode === 'fly_tangent') {
        flyRouteTangent({
          coordinates: line.geometry.coordinates,
          map: mapRef.current,
        });
      }

      if (data.view.fly === 'route') {
        routeRef.current = new Route({
          coordinates: line.geometry.coordinates,
          map: mapRef.current,
        });

        setActiveObjectIndex(0);
      }
    });
  }

  // After initial render, load the map
  useEffect(() => {
    loadMap();
  }, []); // empty dependency array = runs once after mount

  return (
    <div
      ref={mapElemRef}
      id="map"
      className={`
			${styles.map}
			${panelEnabled ? styles.panelEnabled : ''}
			${panelOpen ? styles.panelOpen : ''}
			`}
    ></div>
  );
}
