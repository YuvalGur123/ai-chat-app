import { useState, useEffect, useRef } from "react";

export function useTypewriter(target: string, speed = 18) {
    const [displayed, setDisplayed] = useState(target);
    const prevTarget = useRef(target);

    useEffect(() => {
        // If text was cleared/reset, snap immediately
        if (target.length < prevTarget.current.length) {
            setDisplayed(target);
            prevTarget.current = target;
            return;
        }

        // Only animate the new characters added since last render
        const newChars = target.slice(displayed.length);
        if (!newChars) return;

        let i = 0;
        const interval = setInterval(() => {
            i++;
            setDisplayed(target.slice(0, displayed.length + i));
            if (i >= newChars.length) clearInterval(interval);
        }, speed);

        prevTarget.current = target;
        return () => clearInterval(interval);
    }, [target]);

    return displayed;
}