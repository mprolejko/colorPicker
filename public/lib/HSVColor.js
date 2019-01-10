
import { Color } from "./Color.js";

export class HSVColor extends Color {
    constructor(color, s, v) {
        super();
        this.colorNames = { "black": [0, 0, 0],
            "blue": [240, 100, 100],
            "green": [120, 100, 100],
            "red": [0, 100, 100],
            "white": [0, 0, 100],
        };
        this.channels = ['H','S','V'];
        this.hueOperations = {
            "add": (x, y) => (x + y) - Math.floor(x + y),
            "div": (x, y) => y === 0 ? x : x / y,
            "mul": (x, y) => x * y,
            "sub": (x, y) => (x - y + 1) - Math.floor(x - y + 1),
        };
        let H, S, V;
        if (arguments.length === 1 && typeof color === "object") {
            H = color.H;
            S = color.S;
            V = color.V;
        }
        else if (typeof color === "number") {
            H = color;
            S = arguments.length >= 2 ? s : 1;
            V = arguments.length >= 3 ? v : 1;
        }
        let crop = (c) => c > 100 ? 1 : c > 1 ? c / 100 : c < 0 ? 0 : c;
        this.H = H > 360 ? (H % 360 / 360) : H < 0 ? (H + 360) / 360 : H > 1 ? H / 360 : H;
        this.S = crop(S);
        this.V = crop(V);
        if (this.V === 0) {
            this.S = 0;
        }
        if (this.S === 0) {
            this.H = 0;
        }
        this.alpha = 0;
        HSVColor.operations.add = (x, y) => (x + y) > 1 ? 1 : x + y;
        HSVColor.operations.sub = (x, y) => (x - y) < 0 ? 0 : x - y;
        HSVColor.operations.mul = (x, y) => x * y;
        HSVColor.operations.div = (x, y) => y === 0 ? x : x / y;
    }
    colorByName(name) {
        return new HSVColor(...(this.colorNames[name]));
    }
    getRaw(){
        return {H:this.H,S:this.S, V:this.V};
    }
    getHSL() {
        let H = Color.fixed(this.H * 360);
        let L = (2 - this.S) * this.V / 2;
        let S = L && L < 1 ? this.S * this.V / (L < 0.5 ? L * 2 : 2 - L * 2) : this.S;
        L = Color.fixed(L * 100);
        S = Color.fixed(S * 100);
        return { H, S, L };
    }
    getHSV() {
        return {
            H: Color.fixed(this.H * 360),
            S: Color.fixed(this.S * 100),
            V: Color.fixed(this.V * 100),
        };
    }
    getRGB() {
        let R, G, B;
        let c = this.V * this.S;
        let x = c * (1 - Math.abs((this.H * 6) % 2 - 1));
        let m = this.V - c;
        let color = { R, G, B };
        let H = Color.fixed(this.H * 360);
        if ((H >= 0 && H < 60) || H == 360) {
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
        else if (H >= 300 && H < 360) {
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
        let H, S, V, alpha;
        if (typeof value === "number") {
            V = value;
            S = value;
            V = value;
            alpha = 1;
        }
        else {
            let bRGB = value.getHSV();
            H = bRGB.H;
            S = bRGB.S;
            V = bRGB.V;
            alpha = value.alpha;
        }
        return { H, S, V, alpha };
    }
    operate(b, type) {
        let color = new HSVColor(0, 0, 0);
        let { H, S, V, alpha } = this.operands(b);
        color.H = this.hueOperations[type](this.H, H);
        color.S = HSVColor.operations[type](this.S, S);
        color.V = HSVColor.operations[type](this.V, V);
        color.alpha = Color.operations[type](this.alpha, alpha);
        return color;
    }
}

