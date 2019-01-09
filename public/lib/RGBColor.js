import { Color } from "./Color.js";
export class RGBColor extends Color {
    constructor(color, g, b) {
        super();
        this.colorNames = { "black": [0, 0, 0],
            "blue": [0, 255, 0],
            "green": [0, 0, 255],
            "red": [255, 0, 0],
            "white": [255, 255, 255],
        };
        let R, G, B;
        if (arguments.length === 1 && typeof color === "object") {
            R = color.R;
            G = color.G;
            B = color.B;
        }
        else if (typeof color === "number") {
            R = color;
            G = arguments.length >= 2 ? g : 0;
            B = arguments.length >= 3 ? b : 0;
        }
        let crop = (c) => c > 255 ? 1 : c >= 1 ? c / 255 : c < 0 ? 0 : c;
        this.R = crop(R);
        this.G = crop(G);
        this.B = crop(B);
        RGBColor.operations.add = (x, y) => (x + y) > 1 ? 1 : x + y;
        RGBColor.operations.sub = (x, y) => (x - y); // < 0 ? 0 : x - y;
        RGBColor.operations.mul = (x, y) => x * y;
        RGBColor.operations.div = (x, y) => y === 0 ? x : x / y;
    }
    colorByName(name) {
        return new RGBColor(...(this.colorNames[name]));
    }
    getHSL() {
        let r = this.R;
        let g = this.G;
        let b = this.B;
        let cmax = Math.max(r, g, b);
        let cmin = Math.min(r, g, b);
        let delta = cmax - cmin;
        let L = (cmax + cmin) / 2;
        let S = L === 0 ? 0 : L === 1 ? 0 : Color.fixed(100 * (cmax - cmin) / (1 - Math.abs(2 * L - 1)));
        L = Color.fixed(L * 100);
        let H = 0;
        if (cmax !== 0 && delta !== 0) {
            if (cmax === r) {
                H = ((g - b) / delta) % 6;
            }
            else if (cmax === g) {
                H = (b - r) / delta + 2;
            }
            else if (cmax === b) {
                H = (r - g) / delta + 4;
            }
        }
        H = Color.fixed((H * 60 + 360) % 360);
        return { H, S, L };
    }
    getHSV() {
        let r = this.R;
        let g = this.G;
        let b = this.B;
        let cmax = Math.max(r, g, b);
        let cmin = Math.min(r, g, b);
        let delta = cmax - cmin;
        let V = Color.fixed(cmax * 100);
        let S = cmax === 0 ? 0 : Color.fixed(100 * delta / cmax);
        let H = 0;
        if (cmax !== 0 && delta !== 0) {
            if (cmax === r) {
                H = ((g - b) / delta) % 6;
            }
            else if (cmax === g) {
                H = (b - r) / delta + 2;
            }
            else if (cmax === b) {
                H = (r - g) / delta + 4;
            }
        }
        return { H: Color.fixed((H * 60 + 360) % 360), S, V };
    }
    getRGB() {
        let to255 = (c) => Math.round(c * 255);
        return { R: to255(this.R), G: to255(this.G), B: to255(this.B) };
    }
    getHEX() {
        let hex = (c) => {
            let h = Math.round(c * 255).toString(16);
            return h.length === 1 ? "0" + h : h;
        };
        return { hex: "#" + hex(this.R) + hex(this.G) + hex(this.B) };
    }
    operands(value) {
        let R, G, B, alpha;
        if (typeof value === "number") {
            R = value;
            G = value;
            B = value;
            alpha = 1;
        }
        else {
            let bRGB = value.getRGB();
            R = bRGB.R / 255;
            G = bRGB.G / 255;
            B = bRGB.B / 255;
            alpha = value.alpha;
        }
        return { R, G, B, alpha };
    }
    operate(b, type) {
        let color = new RGBColor(0, 0, 0);
        let { R, G, B, alpha } = this.operands(b);
        color.R = RGBColor.operations[type](this.R, R);
        color.G = RGBColor.operations[type](this.G, G);
        color.B = RGBColor.operations[type](this.B, B);
        return color;
    }
    transform(type) {
        if (type instanceof RGBColor) {
            return new RGBColor(this.getRGB());
        }
        return new RGBColor(this.getRGB());
    }
}
