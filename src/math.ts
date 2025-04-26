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

export function angleRad(x: number, y: number): number {
    return  Math.atan2(y, x) + Math.PI / 2;
}

export function angleDeg(x: number, y: number): number {
    return radToDeg(angleRad(x, y));
}

export function radToDeg(radians: number): number {
    return radians * 180 / Math.PI;
}

export function degToRad(degrees: number): number {
    return degrees * Math.PI / 180;
}

export function normalizeDeg(deg: number): number {
    deg = deg % 360;
    if (deg < 0) {
        return 360 + deg;
    }
    return deg;
}

export function degArrow(angleDeg: number): string {
    angleDeg = normalizeDeg(angleDeg);
    const directions = ['↑', '↗', '→', '↘', '↓', '↙', '←', '↖'];
    const index = Math.round((angleDeg) / 45) % 8;
    return directions[index];
}
