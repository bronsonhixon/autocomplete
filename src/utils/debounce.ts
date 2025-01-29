export default function debounce<T extends (...args: any[]) => void>(func: T, delay: number) {
    let timeoutId: NodeJS.Timeout;

    return (...args: Parameters<T>) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            func(...args); // No `this` reference needed
        }, delay);
    };
}