
import { useState, useEffect, RefObject } from 'react';

function useOnScreen<T extends Element>(ref: RefObject<T>, options: IntersectionObserverInit = { threshold: 0.1 }): boolean {
    const [isIntersecting, setIntersecting] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIntersecting(true);
                // Disconnect after it becomes visible to avoid re-triggering
                observer.disconnect();
            }
        }, options);

        const currentRef = ref.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if(currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [ref, options]);

    return isIntersecting;
}

export default useOnScreen;
