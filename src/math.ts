
// Round numbers to a certain number of decimals
export function round(value: number, decimals: number = 0): number {
    const factor = Math.pow(10, decimals);
    return Math.round(value * factor) / factor;
}

// Cutoff a value to 0 if it is below a certain threshold
export function cutoff(value: number, cutoff: number): number {
    if (Math.abs(value) < cutoff) {
        return 0;
    }
    return value;
}