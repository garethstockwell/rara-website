import { useEffect, useState } from 'react';
import styles from './App.module.css';
import HeaderHandle from './HeaderHandle.jsx';
import Map from './Map.jsx';
import Panel from './Panel.jsx';
import { absUrl } from '../lib/url';

export default function App({ footer, viewName }) {
  const [data, setData] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelLoaded, setPanelLoaded] = useState(false);
  const [activePanelTabId, setActivePanelTabId] = useState(null);
  const [activePanelTabIndex, setActivePanelTabIndex] = useState(null);
  const [activePanelTitle, setActivePanelTitle] = useState(null);

  const panelEnabled = document.querySelector('.rara-maps-content') !== null;

  function arrayToMap(arr) {
    return arr.reduce((acc, obj) => {
      acc[obj.id] = obj;
      return acc;
    }, {});
  }

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
            view: arrayToMap(json.views)[viewName],
          };

          setData(theData);

          if (theData.view.mode === 'overlay') {
            setActivePanelTabIndex(0);
          }
        }
      });

    // Cleanup to avoid setting state after unmount
    return () => {
      cancelled = true;
    };
  }, []); // Empty deps array → run once on mount

  return (
    <div className={styles.app}>
      <HeaderHandle />

      {data && (!panelEnabled || panelLoaded) && (
        <Map
          panelEnabled={panelEnabled}
          panelOpen={panelOpen}
          data={data}
          activeObjectId={activePanelTabId}
          setActiveObjectId={setActivePanelTabId}
          setActiveObjectTitle={setActivePanelTitle}
          setActiveObjectIndex={setActivePanelTabIndex}
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
