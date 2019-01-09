import { Color } from "./Color.js";
import { RGBColor } from "./RGBColor.js";
export class Frame {
    constructor(rgba, width, height, delay, type) {
        this.delay = 0;
        this.toPixels = (rgba, type) => {
            for (let row = 0; row < this.height; row++) {
                this.data[row] = [];
                for (let col = 0; col < this.width; col++) {
                    let index = (col + (row * this.width)) * 4;
                    let rgb = new RGBColor(rgba[index], rgba[index + 1], rgba[index + 2]);
                    this.data[row][col] = rgb.transform(type);
                    this.data[row][col].alpha = rgba[index + 3] / 255;
                }
            }
        };
        this.fromPixels = () => {
            let row = 0, col = 0;
            const arr = new Uint8ClampedArray(this.width * this.height * 4);
            for (let i = 0; i < arr.length; i += 4) {
                col = Math.floor((i % (4 * this.width)) / 4);
                row = Math.floor(i / (4 * this.width));
                let c = this.data[row][col].getRGB();
                arr[i] = c.R;
                arr[i + 1] = c.G;
                arr[i + 2] = c.B;
                arr[i + 3] = this.data[row][col].alpha * 255;
            }
            return arr;
        };
        if (arguments.length < 5) {
            type = RGBColor;
        }
        this.width = width;
        this.height = height;
        this.delay = delay;
        this.data = [];
        if (rgba !== null) {
            if (rgba instanceof Uint8ClampedArray || rgba instanceof Buffer) {
                this.toPixels(rgba, type);
            }
            else {
                this.data = rgba;
            }
        }
        else {
            for (let row = 0; row < this.height; row++) {
                this.data[row] = [];
                for (let col = 0; col < this.width; col++) {
                    this.data[row][col] = Color.getColorByName("black", type);
                }
            }
        }
    }
}
