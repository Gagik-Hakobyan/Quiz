import {useState} from "react";
import {VALIDATION} from "@/constants/validation.js";

export function usePagination(initialSize = VALIDATION.paging.size.default) {
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(initialSize);

    return {
        page,
        size,
        setPage,
        setSize,
        next: () => setPage((p) => p + 1),
        prev: () => setPage((p) => Math.max(0, p - 1)),
        reset: () => setPage(0),
    };
}
