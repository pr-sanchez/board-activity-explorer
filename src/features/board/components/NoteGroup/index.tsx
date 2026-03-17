import { ReactNode } from "react";
import styles from "./styles.module.css";

interface NoteGroupProps {
  label: string;
  count: number;
  children: ReactNode;
}

const NoteGroup = ({ label, count, children }: NoteGroupProps) => {
  return (
    <div className={styles.groupSection}>
      <h3 className={styles.groupTitle}>
        {label}
        <span className={styles.groupCount}>({count})</span>
      </h3>
      <div className={styles.groupGrid}>{children}</div>
    </div>
  );
};

export { NoteGroup };
