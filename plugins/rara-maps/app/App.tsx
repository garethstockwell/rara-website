import { useEffect, useRef, useState } from 'react';

import styles from './App.module.css';
import HeaderHandle from './HeaderHandle';
import Map from './Map';
import Panel from './Panel';

import { absUrl } from '../lib/url';

export default function App({ footer, viewName }) {
  const [data, setData] = useState(null);
  const [routeCoords, setRouteCoords] = useState(null);

  const [panelOpen, setPanelOpen] = useState(false);
  const [panelLoaded, setPanelLoaded] = useState(false);

  const [activeLocation, setActiveLocation] = useState(null);
  const [activeOverlayId, setActiveOverlayId] = useState(null);

  const [activePanelTabId, setActivePanelTabId] = useState(null);
  const [activePanelTabIndex, setActivePanelTabIndex] = useState(null);
  const [activePanelTitle, setActivePanelTitle] = useState(null);

  const panelEnabled = document.querySelector('.rara-maps-content') !== null;

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
      if (data.view.mode === 'overlay') {
        setActivePanelTabIndex(0);
      }

      if (data.view.route) {
        const line = data.lines.find((line) => (line?.properties?.id ?? null) === data.view.route);
        setRouteCoords(line?.geometry?.coordinates ?? null);
        setActivePanelTabIndex(0);
      }
    }
  }, [data]);

  useEffect(() => {
    if (activePanelTabId && data) {
      if (data.view.mode === 'location') {
        const loc = data.locations.features.find(
          (el) => (el?.properties?.id ?? null) === activePanelTabId
        );
        setActiveLocation(loc);
      }

      if (data.view.mode === 'overlay') {
        setActiveOverlayId(activePanelTabId);
      }
    }
  }, [activePanelTabId]);

  function onLocationClick(id) {
    setActivePanelTabId(id);
  }

  useEffect(() => {
    let title = null;
    if (activeLocation) {
      title = activeLocation?.properties?.title;
    }
    setActivePanelTitle(title ?? '');
  }, [activeLocation]);

  return (
    <div className={styles.app}>
      <HeaderHandle />

      {data && (!panelEnabled || panelLoaded) && (
        <Map
          panelEnabled={panelEnabled}
          panelOpen={panelOpen}
          data={data}
          routeCoords={routeCoords}
          onLocationClick={onLocationClick}
          activeLocation={activeLocation}
          activeOverlayId={activeOverlayId}
          flyRadiusEnabled={(data?.view?.mode ?? null) === 'fly_radius'}
          flyTangentEnabled={(data?.view?.mode ?? null) === 'fly_tangent'}
        />
      )}

      {panelEnabled && (
        <Panel
          panelOpen={panelOpen}
          setPanelOpen={setPanelOpen}
          activeTabId={activePanelTabId}
          setActiveTabId={setActivePanelTabId}
          activeTabIndex={activePanelTabIndex}
          setActiveTabIndex={setActivePanelTabIndex}
          activeTabTitle={activePanelTitle}
          setActiveTabTitle={setActivePanelTitle}
          footer={footer}
          onLoad={() => {
            setPanelLoaded(true);
          }}
        />
      )}
    </div>
  );
}
