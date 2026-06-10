import {cn} from "@/utils/cn.js";
import styles from "./Table.module.css";

export function Table({className, children, ...rest}) {
    return (
        <div className={styles.scroll}>
            <table className={cn(styles.table, className)} {...rest}>
                {children}
            </table>
        </div>
    );
}

Table.Head = function Head({children}) {
    return <thead className={styles.head}>{children}</thead>;
};
Table.Body = function Body({children}) {
    return <tbody>{children}</tbody>;
};
Table.Row = function Row({className, children, onClick, ...rest}) {
    return (
        <tr onClick={onClick} className={cn(styles.row, className)} {...rest}>
            {children}
        </tr>
    );
};
Table.Th = function Th({className, children, ...rest}) {
    return (
        <th className={cn(styles.th, className)} {...rest}>
            {children}
        </th>
    );
};
Table.Td = function Td({className, children, ...rest}) {
    return (
        <td className={cn(styles.td, className)} {...rest}>
            {children}
        </td>
    );
};
