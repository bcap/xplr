import { Assets, Graphics } from 'pixi.js';

export async function loadSVGAsset(url: string): Promise<Graphics> {
    const asset = await Assets.load({
        src: url,
        data: { parseAsGraphicsContext: true },
    });
    const graphics = new Graphics(asset);

    const svgText = await fetch(url).then(res => res.text());
    const parser = new DOMParser();
    const parsedSvg = parser.parseFromString(svgText, "image/svg+xml");
    const pivot = parsedSvg.getElementById('pivot');
    if (!pivot) {
        console.log("WARN: pivot element not found in SVG. Loaded asset will not have a pivot set. Path: " + url);
        return graphics;
    }

    const x = pivot.getAttribute("cx");
    const y = pivot.getAttribute("cy");
    if (!x || !y) {
        throw new Error("WARN: pivot element found but it does not have cx and/or cy attributes. URL: " + url);
    }
    graphics.pivot.x = parseFloat(x);
    graphics.pivot.y = parseFloat(y);
    return graphics;
}