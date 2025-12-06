import { useEffect, useRef, useState } from 'react';

import HeaderHandle from './HeaderHandle';
import ContentPanel from './ContentPanel';
import Map from './Map';
import styles from './styles/App.module.css';

import { absUrl } from '../lib/url';

export default function App({ footer, viewName }) {
  const [data, setData] = useState(null);
  
  const [routeCoords, setRouteCoords] = useState(null);
  const [activeLocation, setActiveLocation] = useState(null);
  const [activeOverlayId, setActiveOverlayId] = useState(null);

  const contentPanelEnabled = document.querySelector('.rara-maps-content') !== null;
  const [contentPanelOpen, setContentPanelOpen] = useState(false);
  const [contentPanelLoaded, setContentPanelLoaded] = useState(false);

  const [contentTabId, setContentTabId] = useState(null);
  const [contentTabIndex, setContentTabIndex] = useState(null);
  const [contentTitle, setContentTitle] = useState(null);

  useEffect(() => {
    let cancelled = false;

    fetch(absUrl('%{RARA_MAPS}/build/data.json'))
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network error');
        }
        return res.json();
      })
      .then((json) => {
        if (!cancelled) {
          const theData = {
            ...json,
            view: json.views.find((view) => view.id === viewName),
          };

          setData(theData);
        }
      });

    // Cleanup to avoid setting state after unmount
    return () => {
      cancelled = true;
    };
  }, []); // Empty deps array → run once on mount

  useEffect(() => {
    if (data) {
      if (data.view.app.binding === 'overlay') {
        setContentTabIndex(0);
      }

      if (data.view.app.route) {
        const line = data.lines.find(
          (line) => (line?.properties?.id ?? null) === data.view.app.route
        );
        setRouteCoords(line?.geometry?.coordinates ?? null);
        setContentTabIndex(0);
      }
    }
  }, [data]);

  useEffect(() => {
    console.debug(`App contentTabId=${contentTabId}`);

    if (contentTabId) {
      if (data.view.app.binding === 'location') {
        const loc = data.locations.features.find(
          (el) => (el?.properties?.id ?? null) === contentTabId
        );
        setActiveLocation(loc);
      }

      if (data.view.app.binding === 'overlay') {
        setActiveOverlayId(contentTabId);
      }
    }
  }, [contentTabId]);

  function onLocationClick(id) {
    setContentTabId(id);
  }

  useEffect(() => {
    console.debug(`App activeLocation=${activeLocation}`);

    setContentTitle(activeLocation?.properties?.title ?? '');
  }, [activeLocation]);

  return (
    <div className={styles.app}>
      <HeaderHandle />

      {data && (!contentPanelEnabled || contentPanelLoaded) && (
        <Map
          contentPanelEnabled={contentPanelEnabled}
          contentPanelOpen={contentPanelOpen}
          data={data}
          routeCoords={routeCoords}
          onLocationClick={onLocationClick}
          activeLocation={activeLocation}
          activeOverlayId={activeOverlayId}
          flyRadiusEnabled={(data.view.app.auto ?? null) === 'fly_radius'}
          flyTangentEnabled={(data.view.app.auto ?? null) === 'fly_tangent'}
        />
      )}

      {contentPanelEnabled && (
        <ContentPanel
          panelOpen={contentPanelOpen}
          setPanelOpen={setContentPanelOpen}
          tabId={contentTabId}
          setTabId={setContentTabId}
          tabIndex={contentTabIndex}
          setTabIndex={setContentTabIndex}
          tabTitle={contentTitle}
          setTabTitle={setContentTitle}
          footer={footer}
          onLoad={() => {
            setContentPanelLoaded(true);
          }}
        />
      )}
    </div>
  );
}
