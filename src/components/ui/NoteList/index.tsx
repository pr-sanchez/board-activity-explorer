import { ReactNode } from "react";
import styles from "./styles.module.css";

const NoteList = ({ children }: { children: ReactNode }) => {
  return (
    <section className={styles.board} aria-label="Board notes">
      <div className={styles.boardCard}>
        <div className={styles.notesGrid}>{children}</div>
      </div>
    </section>
  );
};

export { NoteList };
