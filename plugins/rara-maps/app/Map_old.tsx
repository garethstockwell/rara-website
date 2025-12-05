import { useEffect, useRef, useState } from 'react';
import styles from './Map.module.css';
import { getAppData } from '../lib/appdata';
import createMap from '../lib/map';
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

  activeOverlayId,
}) {
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef();
  const mapElemRef = useRef();

  const oldActiveLocationRef = useRef();
  const oldActiveOverlayIdRef = useRef();
  const oldActivePopupRef = useRef();
  const routeRef = useRef();

  function onLocationClick(id) {
    setActiveObjectId(id);
  }

  function onLocationChange() {
    if (mapRef.current) {
      const popups = getAppData(mapRef.current).popups;

      if (oldActivePopupRef.current) {
        oldActivePopupRef.current.visibleStatic = false;
      }

      if (activeObjectId) {
        const popup = popups.getPopup(activeObjectId);
        if (popup) {
          popup.visibleStatic = true;
        }

        oldActivePopupRef.current = popup;

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

          if (data.view.fly === 'route' && oldActiveLocationRef.current) {
            const fromCoord = oldActiveLocationRef.current.geometry.coordinates;
            const toCoord = loc.geometry.coordinates;
            console.debug(
              `Fly from ${oldActiveLocationRef} ${fromCoord} to ${activeObjectId} ${toCoord}`
            );
            routeRef.current.fly(fromCoord, toCoord, 2000);
          }

          setActiveObjectTitle(loc ? loc.properties.title : '');
        }

        oldActiveLocationRef.current = loc;
      }
    }
  }

  function onOverlayChange() {
    if (mapRef.current) {
      const layers = getAppData(mapRef.current).layers;

      if (oldActiveOverlayIdRef.current) {
        layers.getLayer(oldActiveOverlayIdRef.current).visible = false;
      }

      layers.getLayer(activeObjectId).visible = true;

      oldActiveOverlayIdRef.current = activeObjectId;
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

  useEffect(() => {
    onActiveObjectChange();
  }, [mapLoaded]);

  function loadMap() {
    mapRef.current = createMap({
      container: 'map',
      data,
      overlay_opacity: 0.75,
      onLocationClick,
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
