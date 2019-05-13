import { useState, useEffect } from "react";

const useScrollPosition = (element = false) => {
    if (element === false) element = window;

    const [scrollPosition, setScrollPosition] = useState(element.scrollY);

    const getScrollPosition = () => {
        setScrollPosition(element.scrollY);
    };

    useEffect(() => {
        element.addEventListener("scroll", getScrollPosition);
        return () => {
            element.removeEventListener("scroll", getScrollPosition);
        };
    }, [0]);

    return scrollPosition;
};

export default useScrollPosition;
