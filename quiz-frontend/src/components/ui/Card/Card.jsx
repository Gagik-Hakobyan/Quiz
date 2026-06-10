import {cn} from "@/utils/cn.js";
import styles from "./Card.module.css";

export function Card({interactive = false, padding = "md", className, children, ...rest}) {
    return (
        <div
            className={cn(
                styles.card,
                styles[`pad-${padding}`],
                interactive && styles.interactive,
                className,
            )}
            {...rest}
        >
            {children}
        </div>
    );
}

Card.Header = function CardHeader({className, children, ...rest}) {
    return (
        <div className={cn(styles.header, className)} {...rest}>
            {children}
        </div>
    );
};

Card.Title = function CardTitle({className, children, ...rest}) {
    return (
        <h3 className={cn(styles.title, className)} {...rest}>
            {children}
        </h3>
    );
};

Card.Body = function CardBody({className, children, ...rest}) {
    return (
        <div className={cn(styles.body, className)} {...rest}>
            {children}
        </div>
    );
};

Card.Footer = function CardFooter({className, children, ...rest}) {
    return (
        <div className={cn(styles.footer, className)} {...rest}>
            {children}
        </div>
    );
};
