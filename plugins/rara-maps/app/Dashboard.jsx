import common from "./common.module.css";
import styles from "./Dashboard.module.css";

export default function Dashboard({
  title,
  showPrev,
  onPrev,
  onToggle,
  showNext,
  onNext,
}) {
  function handleClick() {
    if (onToggle) {
      onToggle();
    }
  }

  function handleClickPrev(event) {
    if (onPrev) {
      onPrev();
    }
    event.stopPropagation();
  }

  function handleClickNext(event) {
    if (onNext) {
      onNext();
    }
    event.stopPropagation();
  }

  return (
    <div className={`${common.card} ${styles.dashboard}`} onClick={handleClick}>
      {showPrev && (
        <div
          className={`${common.card} ${styles.dashboard_button}`}
          onClick={handleClickPrev}
        ></div>
      )}
      <div className={`${common.card} ${styles.dashboard_container}`}>
        <p>{title}</p>
      </div>
      {showNext && (
        <div
          className={`${common.card} ${styles.dashboard_button}`}
          onClick={handleClickNext}
        ></div>
      )}
    </div>
  );
}
