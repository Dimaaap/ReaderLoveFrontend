import { useEffect, useRef } from "react";


export const useClickOutside = (ref, callback) => {

    const callbackRef = useRef(callback);

    useEffect(() => {
        callbackRef.current = callback;
    }, [callback])

    useEffect(() => {
        const handleClickOutside = event => {
            if (ref.current && !ref.current.contains(event.target)) {
                callbackRef.current();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [ref])
}