import { useEffect, useRef, useState } from 'react';

import styles from './styles/Map.module.css';

import { getAppData } from '../lib/appdata';
import flyRouteRadius from '../lib/fly_radius';
import { Route, flyRouteTangent } from '../lib/fly_tangent';
import createMap from '../lib/map';

export default function Map({
  contentPanelEnabled,
  contentPanelOpen,
  data,
  routeCoords,
  onLocationClick,
  activeLocation,
  activeOverlayId,
  flyRadiusEnabled,
  flyTangentEnabled,
}) {
  const [mapLoaded, setMapLoaded] = useState(false);

  const mapRef = useRef();
  const mapElemRef = useRef();

  const oldActiveLocationRef = useRef();
  const oldActiveOverlayIdRef = useRef();
  const oldActivePopupRef = useRef();
  
  const routeRef = useRef();

  function loadMap() {
    mapRef.current = createMap({
      container: 'map',
      data,
      overlay_opacity: 0.75,
      onLocationClick: onLocationClick,
      locationVisible: true,
    });

    mapRef.current.on('load', () => {
      setMapLoaded(true);
    });
  }

  // After initial render, load the map
  useEffect(() => {
    loadMap();
  }, []); // empty dependency array = runs once after mount

  useEffect(() => {
    if (routeCoords && mapRef) {
      routeRef.current = new Route({
        coordinates: routeCoords,
        map: mapRef.current,
      });
    }
  }, [routeCoords, mapRef]);

  useEffect(() => {
    console.debug(`Map activeLocation=${activeLocation} routeRef=${routeRef.current}`);

    if (oldActivePopupRef.current) {
      oldActivePopupRef.current.visibleStatic = false;
      oldActivePopupRef.current = null;
    }

    if (activeLocation) {
      const id = activeLocation?.properties?.id ?? null;
      const popup = getAppData(mapRef.current).popups.getPopup(id);
      if (popup) {
        popup.visibleStatic = true;
        oldActivePopupRef.current = popup;
      }

      const coordinates = activeLocation.geometry.coordinates;

      if (routeRef.current && oldActiveLocationRef.current) {
        const fromCoord = oldActiveLocationRef.current.geometry.coordinates;
        const toCoord = activeLocation.geometry.coordinates;
        console.debug(
          `Fly from ${oldActiveLocationRef} ${fromCoord} to ${activeLocation.properties.id} ${toCoord}`
        );
        routeRef.current.fly(fromCoord, toCoord, 2000);
      } else {
        mapRef.current.flyTo({
          center: coordinates,
        });
      }

      if (mapRef.current) {
        const point = mapRef.current.getSource('point');
        if (point) {
          point.setData({ type: 'Point', coordinates });
        }
      }
    }

    oldActiveLocationRef.current = activeLocation;
  }, [activeLocation, mapRef, mapLoaded]);

  useEffect(() => {
    console.debug(`Map activeOverlayId=${activeOverlayId}`);

    if (mapRef.current && mapLoaded) {
      const layers = getAppData(mapRef.current).layers;

      if (oldActiveOverlayIdRef.current) {
        layers.getLayer(oldActiveOverlayIdRef.current).visible = false;
      }

      if (activeOverlayId) {
        layers.getLayer(activeOverlayId).visible = true;
      }

      oldActiveOverlayIdRef.current = activeOverlayId;
    }
  }, [activeOverlayId, mapLoaded]);

  useEffect(() => {
    console.debug(`Map flyRadiusEnabled=${flyRadiusEnabled}`);
    if (flyRadiusEnabled && routeCoords) {
      flyRouteRadius({
        center: data.view.config.center,
        coordinates: routeCoords,
        map: mapRef.current,
      });
    }
  }, [flyRadiusEnabled, routeCoords]);

  useEffect(() => {
    console.debug(`flyTangentEnabled=${flyTangentEnabled}`);
    if (flyTangentEnabled && routeCoords) {
      flyRouteTangent({
        coordinates: routeCoords,
        map: mapRef.current,
      });
    }
  }, [flyTangentEnabled, routeCoords]);

  return (
    <div
      ref={mapElemRef}
      id="map"
      className={`
			${styles.map}
			${contentPanelEnabled ? styles.contentPanelEnabled : ''}
			${contentPanelOpen ? styles.contentPanelOpen : ''}
			`}
    ></div>
  );
}
