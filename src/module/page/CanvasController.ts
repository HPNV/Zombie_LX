export default class CanvasController {
    private canvas: HTMLCanvasElement;
    private reactiveListener: Function;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.reactiveListener = null;
    }

    /**
     * @description maximize canvas width and height
     */
    setMaximize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

    }

    resizeCanvas() {
        this.setMaximize();
        if (this.reactiveListener != null) {
            this.reactiveListener(this.getWidthCanvas(), this.getHeightCanvas());
        }
    }

    makeWindowReactive() {
        window.addEventListener('resize', () => this.resizeCanvas(), false);
    }

    setReactiveListener(reactiveListener: Function) {
        this.reactiveListener = reactiveListener;
    }

    getContext2d() {
        return this.canvas.getContext("2d");
    }

    getWidthCanvas() {
        return this.canvas.width;
    }

    getHeightCanvas() {
        return this.canvas.height;
    }
}

