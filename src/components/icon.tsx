import type { CSSProperties } from "react";

const paths = {
    basket: "M3 9h18l-2 11H5L3 9Z M7 9l3-6 M17 9l-3-6 M9 13v3 M15 13v3",
    arrow: "M4 12h15m-6-6 6 6-6 6",
    back: "M20 12H5m6-6-6 6 6 6",
    check: "m5 12 4 4L19 6",
    shield: "M12 3 4 6v6c0 4 8 9 8 9s8-5 8-9V6l-8-3Z M8.5 12l2.5 2.5 4.5-5",
    lock: "M7 10V7a5 5 0 0 1 10 0v3 M6 10h12v11H6z M12 14v3",
    help: "M9.2 8a3 3 0 0 1 5.8 1c0 2-3 2-3 4 M12 17h.01 M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0",
    close: "m6 6 12 12M6 18 18 6",
    user: "M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0 M4 21v-2a8 8 0 0 1 16 0v2",
    mail: "M3 5h18v14H3z m0 1 9 7 9-7",
    edit: "m15 4 5 5 M4 20l5-1L21 7l-5-5L4 14v6Z",
    clock: "M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0 M12 6v6l4 2",
    info: "M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0 M12 11v6 M12 7h.01",
    chevron: "m9 5 7 7-7 7",
    spark: "m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Z",
    alert: "m12 3 10 18H2L12 3Z M12 9v5 M12 17h.01",
    leaf: "M20 4C9 2 2 10 7 17s17 1 13-13Z M5 21 16 10",
} as const;

export function Icon({ name, size = 20, className = "", style }: {
    name: keyof typeof paths;
    size?: number;
    className?: string;
    style?: CSSProperties;
}) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className} style={style}>
            <path d={paths[name]} />
        </svg>
    );
}
