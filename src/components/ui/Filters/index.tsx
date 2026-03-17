import styles from "./styles.module.css";

const Filters = () => {
  return (
    <aside className={styles.sidebar} aria-label="Filters">
      <div className={styles.sidebarCard}>
        <p className={styles.sidebarPlaceholder}>Filters will go here</p>
      </div>
    </aside>
  );
};

export { Filters };
