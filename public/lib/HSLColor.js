
import { Color } from "./Color.js";

export class HSLColor extends Color {
    constructor(color, s, l) {
        super();
        this.colorNames = { "black": [0, 0, 0],
            "blue": [240, 100, 50],
            "green": [120, 100, 50],
            "red": [0, 100, 50],
            "white": [0, 0, 100],
        };
        this.channels = ['H','S','L'];
        this.hueOperations = {
            "add": (x, y) => (x + y) - Math.floor(x + y),
            "div": (x, y) => y === 0 ? x : x / y,
            "mul": (x, y) => x * y,
            "sub": (x, y) => (x - y + 1) - Math.floor(x - y + 1),
        };
        let H, S, L;
        if (arguments.length === 1 && typeof color === "object") {
            H = color.H;
            S = color.S;
            L = color.L;
        }
        else if (typeof color === "number") {
            H = color;
            S = arguments.length >= 2 ? s : 1;
            L = arguments.length >= 3 ? l : 0.5;
        }
        let crop = (c) => c > 100 ? 1 : c > 1 ? c / 100 : c < 0 ? 0 : c;
        this.H = H > 360 ? (H % 360 / 360) : H < 0 ? (H + 360) / 360 : H > 1 ? H / 360 : H;
        this.S = crop(S);
        this.L = crop(L);
        if (this.L === 0 || this.L === 1) {
            this.S = 0;
        }
        if (this.S === 0) {
            this.H = 0;
        }
        this.alpha = 0;
        HSLColor.operations.add = (x, y) => (x + y) > 1 ? 1 : x + y;
        HSLColor.operations.sub = (x, y) => (x - y) < 0 ? 0 : x - y;
        HSLColor.operations.mul = (x, y) => x * y;
        HSLColor.operations.div = (x, y) => y === 0 ? x : x / y;
    }
    colorByName(name) {
        throw new HSLColor(...(this.colorNames[name]));
    }
    getRaw(){
        return {H:this.H, S:this.S, L:this.L};
    }
    getHSL() {
        return {
            H: Color.fixed(this.H * 360),
            L: Color.fixed(this.L * 100),
            S: Color.fixed(this.S * 100),
        };
    }
    getHSV() {
        let H = Color.fixed(this.H * 360);
        let sat = this.S * (this.L < 0.5 ? this.L : 1 - this.L);
        let V = Color.fixed((this.L + sat) * 100);
        let S = V === 0 ? 0 : Color.fixed(2 * sat * 100 / (this.L + sat));
        return { H, S, V };
    }
    getRGB() {
        let R, G, B;
        let c = (1 - Math.abs(2 * this.L - 1)) * this.S;
        let x = c * (1 - Math.abs((this.H * 6) % 2 - 1));
        let m = this.L - c / 2;
        let color = { R, G, B };
        let H = this.H * 360;
        if (H >= 0 && H < 60) {
            color = { R: c, G: x, B: 0 };
        }
        else if (H >= 60 && H < 120) {
            color = { R: x, G: c, B: 0 };
        }
        else if (H >= 120 && H < 180) {
            color = { R: 0, G: c, B: x };
        }
        else if (H >= 180 && H < 240) {
            color = { R: 0, G: x, B: c };
        }
        else if (H >= 240 && H < 300) {
            color = { R: x, G: 0, B: c };
        }
        else if (H >= 300 && H <= 360) {
            color = { R: c, G: 0, B: x };
        }
        let to255 = (col) => Math.round((col + m) * 255);
        color.R = to255(color.R);
        color.G = to255(color.G);
        color.B = to255(color.B);
        return color;
    }
    getHEX() {
        let color = this.getRGB();
        let hex = (c) => {
            let h = c.toString(16);
            return h.length === 1 ? "0" + h : h;
        };
        return { hex: "#" + hex(color.R) + hex(color.G) + hex(color.B) };
    }
    operands(value) {
        let H, S, L, alpha;
        if (typeof value === "number") {
            H = value;
            S = value;
            L = value;
            alpha = 1;
        }
        else {
            let bHSV = value.getHSL();
            H = bHSV.H;
            S = bHSV.S;
            L = bHSV.L;
            alpha = value.alpha;
        }
        return { H, S, L, alpha };
    }
    operate(b, type) {
        let color = new HSLColor(0, 0, 0);
        let { H, S, L, alpha } = this.operands(b);
        color.H = this.hueOperations[type](this.H, H);
        color.S = HSLColor.operations[type](this.S, S);
        color.L = HSLColor.operations[type](this.L, L);
        color.alpha = Color.operations[type](this.alpha, alpha);
        return color;
    }
}
