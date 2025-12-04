import { useEffect, useRef, useState } from "react";
import common from "./common.module.css";
import styles from "./HeaderHandle.module.css";

export default function HeaderHandle() {
  const headerElem = document.querySelector(".site-header");
  const observerRef = useRef(null);
  const [headerHidden, setHeaderHidden] = useState(false);

  useEffect(() => {
    // Create a MutationObserver to watch for changes to classList of headerElem
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class"
        ) {
          // Set local state, which triggers change in handle element's classList
          setHeaderHidden(headerElem.classList.contains("hidden"));
        }
      }
    });

    // Start observing
    observer.observe(headerElem, { attributes: true });

    // Cleanup on unmount
    observerRef.current = observer;
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  function handleClick() {
    headerElem.classList.toggle("hidden");
  }

  return (
    <div
      className={`${common.card} ${styles.handle} ${
        headerHidden ? styles.header_closed : ""
      }`}
      onClick={handleClick}
    ></div>
  );
}
