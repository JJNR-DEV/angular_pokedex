import { shareReplay } from 'rxjs/operators';

export const memoize = fn => {
    const cache = {};
    const memoizedFunction = (...args) => {
        const cacheKey = JSON.stringify(args);

        if (typeof cache[cacheKey] === 'undefined') {
            const result = fn(...args).pipe(shareReplay());
            cache[cacheKey] = result;
            return result;
        }
        else {
            return cache[cacheKey];
        }
    }
    return memoizedFunction;
};