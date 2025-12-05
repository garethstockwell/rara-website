import { useEffect, useRef } from 'react';
import common from './common.module.css';
import styles from './Panel.module.css';
import Dashboard from './Dashboard';

export default function Panel({
  panelOpen,
  setPanelOpen,
  activeTabId,
  setActiveTabId,
  activeTabTitle,
  setActiveTabTitle,
  activeTabIndex,
  setActiveTabIndex,
  footer,
  onLoad,
}) {
  const contentElem = document.querySelector('.rara-maps-content');
  const tabElems = contentElem.querySelectorAll('.rara-maps-content-tab');

  const panelElemRef = useRef(null);
  const panelBodyElemRefRef = useRef(null);
  const activeTabElemRef = useRef();

  // After initial render, move content and footer elements to the end of the panel
  useEffect(() => {
    if (panelBodyElemRefRef.current && contentElem) {
      panelBodyElemRefRef.current.appendChild(contentElem);
    }

    if (panelElemRef.current && footer) {
      panelElemRef.current.appendChild(footer);
      footer.classList.remove('hidden');
    }

    if (onLoad) {
      onLoad();
    }
  }, []); // empty dependency array = runs once after mount

  function togglePanel() {
    setPanelOpen((v) => !v);
  }

  useEffect(() => {
    console.debug(`Panel activeTabId=${activeTabId}`);

    if (activeTabElemRef.current) {
      activeTabElemRef.current.classList.add('hidden');
    }

    activeTabElemRef.current = document.querySelector('#' + activeTabId);

    if (activeTabElemRef.current) {
      activeTabElemRef.current.classList.remove('hidden');

      const title = activeTabElemRef.current.getAttribute('title');
      if (title) {
        setActiveTabTitle(title);
      }
    }

    const index = Array.prototype.indexOf.call(tabElems, activeTabElemRef.current);
    setActiveTabIndex(index >= 0 ? index : null);
  }, [activeTabId]);

  useEffect(() => {
    console.debug(`Panel activeTabIndex=${activeTabIndex}`);

    if (activeTabIndex !== null) {
      setActiveTabId(tabElems[activeTabIndex].id);
    }
  }, [activeTabIndex]);

  function onPrev() {
    setActiveTabIndex(activeTabIndex - 1);
  }

  function onNext() {
    setActiveTabIndex(activeTabIndex + 1);
  }

  return (
    <div
      ref={panelElemRef}
      className={`${common.card} ${styles.panel} ${panelOpen ? styles.panelOpen : ''}`}
    >
      <Dashboard
        title={activeTabTitle}
        showPrev={activeTabIndex > 0}
        onPrev={onPrev}
        onToggle={togglePanel}
        showNext={activeTabIndex + 1 < tabElems.length}
        onNext={onNext}
      />

      <div ref={panelBodyElemRefRef} className={`${styles.panelBodyElemRef}`}></div>
    </div>
  );
}
