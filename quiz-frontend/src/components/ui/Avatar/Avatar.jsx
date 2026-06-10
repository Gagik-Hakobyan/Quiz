import {cn} from "@/utils/cn.js";
import styles from "./Avatar.module.css";

export function Avatar({name = "", src, size = "md", className}) {
    return (
        <span className={cn(styles.avatar, styles[size], className)} title={name}>
      {src ? (
          <img src={src} alt={name} className={styles.img}/>
      ) : (
          <span className={styles.initials}>?</span>
      )}
       </span>
    );
}
