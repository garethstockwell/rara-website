import React, { useCallback, useEffect, useRef, useState } from 'react';
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
  panelHeight,
  setPanelHeight,
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
    const target = panelOpen ? MIN_TRANSLATE : MID_TRANSLATE;
    setTranslateY(target);
    setPanelOpen(!panelOpen);
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

  function vhToPx(vh: string) {
    const n = parseFloat(vh.replace('vh', ''));
    return window.innerHeight * (n / 100);
  }

  return (
    <div
      ref={panelElemRef}
      className={`${common.card} ${styles.panel} ${panelOpen ? styles.panelOpen : ''}`}
      style={{
        transform: `translateY(-${panelHeight}px)`,
        transition: draggingRef.current ? 'none' : 'transform 0.s ease',
      }}
    >
      <div className={styles.panelHandle} onPointerDown={onHandlePointerDown}>
        <div className={styles.handleDot}></div>
      </div>

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
