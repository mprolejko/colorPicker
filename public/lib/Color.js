export class Color {
    add(b) {
        return this.operate(b, "add");
    }
    sub(b) {
        return this.operate(b, "sub");
    }
    mul(b) {
        return this.operate(b, "mul");
    }
    div(b) {
        return this.operate(b, "div");
    }
    static getColorByName(name, type) {
        return (new type()).colorByName(name);
    }
}
Color.precision = 2;
Color.fixed = function (n) {
    return Number(n.toFixed(Color.precision));
};
Color.operations = {
    "add": (x, y) => x + y,
    "div": (x, y) => y === 0 ? x : x / y,
    "mul": (x, y) => x * y,
    "sub": (x, y) => x - y,
};
