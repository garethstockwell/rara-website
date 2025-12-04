import { useEffect, useRef } from 'react';
import common from './common.module.css';
import styles from './Panel.module.css';
import Dashboard from './Dashboard.jsx';

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
  const panelRef = useRef(null);
  const panelBodyRef = useRef(null);
  const activeTabElem = useRef();

  // After initial render, move content and footer elements to the end of the panel
  useEffect(() => {
    if (panelBodyRef.current && contentElem) {
      panelBodyRef.current.appendChild(contentElem);
    }

    if (panelRef.current && footer) {
      panelRef.current.appendChild(footer);
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
    if (activeTabElem.current) {
      activeTabElem.current.classList.add('hidden');
    }

    activeTabElem.current = document.querySelector('#' + activeTabId);

    if (activeTabElem.current) {
      activeTabElem.current.classList.remove('hidden');

      const title = activeTabElem.current.getAttribute('title');
      if (title) {
        setActiveTabTitle(title);
      }
    }

    const index = Array.prototype.indexOf.call(tabElems, activeTabElem.current);
    setActiveTabIndex(index >= 0 ? index : null);
  }, [activeTabId]);

  useEffect(() => {
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
      ref={panelRef}
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

      <div ref={panelBodyRef} className={`${styles.panelBody}`}></div>
    </div>
  );
}
