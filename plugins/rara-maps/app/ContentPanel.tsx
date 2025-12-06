import React, { useCallback, useEffect, useRef, useState } from 'react';

import Dashboard from './Dashboard';

import common from './styles/common.module.css';
import styles from './styles/ContentPanel.module.css';

export default function ContentPanel({
  panelOpen,
  setPanelOpen,
  tabId,
  setTabId,
  tabTitle,
  setTabTitle,
  tabIndex,
  setTabIndex,
  footer,
  onLoad,
}) {
  const contentElem = document.querySelector('.rara-maps-content');
  const tabElems = contentElem.querySelectorAll('.rara-maps-content-tab');

  const panelElemRef = useRef(null);
  const panelBodyElemRefRef = useRef(null);
  const tabElemRef = useRef();

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
    const target = panelOpen ? MIN_TRANSLATE : MID_TRANSLATE;
    setTranslateY(target);
    setPanelOpen(!panelOpen);
  }

  useEffect(() => {
    console.debug(`Panel tabId=${tabId}`);

    if (tabElemRef.current) {
      tabElemRef.current.classList.add('hidden');
    }

    tabElemRef.current = document.querySelector('#' + tabId);

    if (tabElemRef.current) {
      tabElemRef.current.classList.remove('hidden');

      const title = tabElemRef.current.getAttribute('title');
      if (title) {
        setTabTitle(title);
      }
    }

    const index = Array.prototype.indexOf.call(tabElems, tabElemRef.current);
    setTabIndex(index >= 0 ? index : null);
  }, [tabId]);

  useEffect(() => {
    console.debug(`Panel tabIndex=${tabIndex}`);

    if (tabIndex !== null) {
      setTabId(tabElems[tabIndex].id);
    }
  }, [tabIndex]);

  function onPrev() {
    setTabIndex(tabIndex - 1);
  }

  function onNext() {
    setTabIndex(tabIndex + 1);
  }

  const MIN_TRANSLATE = 0; // closed position
  const MID_TRANSLATE = -75; // panelOpen default
  const MAX_TRANSLATE = -90; // fully dragged up

  const [translateY, setTranslateY] = useState<number>(MIN_TRANSLATE);
  const draggingRef = useRef(false);

  const onPointerMove = useCallback((ev: PointerEvent) => {
    if (!draggingRef.current) return;
    const vh = window.innerHeight;
    // convert pointerY to translateY in vh
    let y = (ev.clientY / vh) * 100;
    y = Math.min(Math.max(y, 10), 100); // clamp
    setTranslateY(y - 100); // negative transform
  }, []);

  const onPointerUp = useCallback(() => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    // snap to nearest position
    let snapped = [MIN_TRANSLATE, MID_TRANSLATE, MAX_TRANSLATE].reduce((a, b) =>
      Math.abs(b - translateY) < Math.abs(a - translateY) ? b : a
    );
    setTranslateY(snapped);

    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
  }, [translateY, onPointerMove]);

  const onHandlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      draggingRef.current = true;
      e.currentTarget.setPointerCapture?.(e.pointerId);
      window.addEventListener('pointermove', onPointerMove, { passive: false });
      window.addEventListener('pointerup', onPointerUp);
    },
    [onPointerMove, onPointerUp]
  );

  return (
    <div
      ref={panelElemRef}
      className={`${common.card} ${styles.panel} ${panelOpen ? styles.panelOpen : ''}`}
      style={{
        transform: `translateY(${translateY}vh)`,
        transition: draggingRef.current ? 'none' : 'transform 0.3s ease',
      }}
    >
      <div className={styles.panelHandle} onPointerDown={onHandlePointerDown}>
        <div className={styles.handleDot}></div>
      </div>

      <Dashboard
        title={tabTitle}
        showPrev={tabIndex > 0}
        onPrev={onPrev}
        onToggle={togglePanel}
        showNext={tabIndex + 1 < tabElems.length}
        onNext={onNext}
      />

      <div ref={panelBodyElemRefRef} className={`${styles.panelBodyElemRef}`}></div>
    </div>
  );
}
