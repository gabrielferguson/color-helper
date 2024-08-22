import Point from './Point';

export default class GraphicHelper {
    private Width: number = -1;
    private Height: number = -1;
    private RowStride: number = -1;
    private PxFormat: number = -1;
    private ScreenData: Uint8ClampedArray; // or Uint8Array;

    private RedList: Int16Array;
    private Starts: number[] = new Array(256).fill(0);
    private Steps: number[] = new Array(256).fill(0);

    // private final AJFunc AjFunc;

    public constructor() {
        // Image image = AjFunc.AcquireLatestImage();
        // if (image == null) {
        //     return false;
        // }
        // ByteBuffer byteBuf = image.getPlanes()[0].getBuffer();
        // Width = image.getWidth();
        // Height = image.getHeight();
        // RowStride = image.getPlanes()[0].getRowStride();
        // PxFormat = RowStride / Width;
        // ScreenData = new byte[RowStride * Height];
        // byteBuf.position(0);
        // byteBuf.get(ScreenData, 0, RowStride * Height);
        // RedList = new short[Width * Height * 2];
        // image.close();
        // return true;
    }


    /**
     * 获取截图数据到数组
     *
     * @param sign 是否使用多点找色相关
     */
    // public boolean KeepScreen(boolean sign) {
    //     if (GetLastFrame()) {
    //         if (sign) {
    //             GetRedList();
    //         }
    //         return true;
    //     } else {
    //         return false;
    //     }
    // }

    public KeepScreen(image: ImageData, sign: boolean): boolean {
        if (this.GetDataFromImageData(image)) {
            if (sign) {
                this.GetRedList();
            }
            return true;
        } else {
            return false;
        }
    }

    public ReleaseScreen(): void {
        this.ScreenData = null;
        this.RedList = null;
    }

    /**
     * 获取最新帧到数组
     */
    // private boolean GetLastFrame() {
    //     Image image = AjFunc.AcquireLatestImage();
    //     if (image == null) {
    //         return false;
    //     }
    //     ByteBuffer byteBuf = image.getPlanes()[0].getBuffer();
    //     byteBuf.position(0);
    //     byteBuf.get(ScreenData, 0, RowStride * Height);
    //     image.close();
    //     return true;
    // }

    /**
     * 从图片获取数据到数组
     */
    private GetDataFromImageData(imageData: ImageData): boolean {
        this.Width = imageData.width;
        this.Height = imageData.height;
        const len: number = imageData.data.length;
        this.RowStride = len / this.Height;
        this.PxFormat = this.RowStride / this.Width;
        this.ScreenData = new Uint8ClampedArray(len);
        this.ScreenData.set(imageData.data);
        return true;
    }

    /**
     * 获取所有r值对应的坐标,找色效率更快
     */
    public GetRedList(): void {
        const lens: number[] = new Array(256).fill(0);
        this.RedList = new Int16Array(this.Width * this.Height * 2).fill(0);
        for (let i = 0; i < this.Height; i++) {
            let location = this.RowStride * i;
            for (let j = 0; j < this.Width; j++, location += this.PxFormat) {
                const k = this.ScreenData[location] & 0xff;
                lens[k]++;
            }
        }

        let start = 0;
        for (let i = 0; i < 256; i++) {
            this.Starts[i] = start;
            this.Steps[i] = start;
            start += lens[i] * 2;
        }

        for (let i = 0; i < this.Height; i++) {
            let location = this.RowStride * i;
            for (let j = 0; j < this.Width; j++, location += this.PxFormat) {
                const k = this.ScreenData[location] & 0xff;
                this.RedList[this.Steps[k]] = j;
                this.RedList[this.Steps[k] + 1] = i;
                this.Steps[k] += 2;
            }
        }
    }

    /**
     * 四舍六入五成双
     */
    public Round(num: number): number {
        // 检查是否需要特殊处理
        const fractionalPart = num % 1;
        const integerPart = Math.floor(num);
        const isHalfway = Math.abs(fractionalPart) === 0.5;

        if (isHalfway) {
            // 如果是偶数，则向下取整；如果是奇数，则向上取整
            return integerPart % 2 === 0 ? integerPart : integerPart + 1;
        } else {
            // 否则使用标准的 Math.round()
            return Math.round(num);
        }
    }

    public Abs(num: number): number {
        return Math.abs(num);
    }

    /**
     * 暴露图像数据
     */
    public GetScreenData(): Uint8ClampedArray {
        return this.ScreenData;
    }

    /**
     * 获取bitmap
     */
    // public Bitmap GetBitmap() {
    //     return GetBitmap(0, 0, Width - 1, Height - 1);
    // }

    // public Bitmap GetBitmap(int sx, int sy, int ex, int ey) {
    //     sx = Math.max(sx, 0);
    //     sy = Math.max(sy, 0);
    //     ex = Math.min(ex, Width - 1);
    //     ey = Math.min(ey, Height - 1);
    //     int width = ex - sx + 1;
    //     int height = ey - sy + 1;
    //     byte[] data = new byte[width * height * 4];
    //     int site = 0;
    //     for (int i = sy; i <= ey; i++) {
    //         int location = sx * PxFormat + i * RowStride;
    //         for (int j = sx; j <= ex; j++) {
    //             data[site] = ScreenData[location];
    //             data[site + 1] = ScreenData[location + 1];
    //             data[site + 2] = ScreenData[location + 2];
    //             data[site + 3] = -1;
    //             location += PxFormat;
    //             site += 4;
    //         }
    //     }
    //     Bitmap result = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888);
    //     result.copyPixelsFromBuffer(ByteBuffer.wrap(data));
    //     return result;
    // }

    /**
     * 获取指定像素数据_数组
     */
    public GetPixel(x: number, y: number): number[] {
        if (x >= 0 && x < this.Width && y >= 0 && y < this.Height) {
            const location = x * this.PxFormat + y * this.RowStride;
            return [
                this.ScreenData[location + 1] & 0xff,
                this.ScreenData[location + 2] & 0xff,
                this.ScreenData[location + 3] & 0xff
            ];
        } else {
            return [0, 0, 0];
        }
    }

    /**
     * 获取指定像素数据_string
     */
    public GetPixelStr(x: number, y: number): string {
        return '0x' + this.GetPixel(x, y).map(num => num.toString(16).padStart(2, '0'));
    }

    /**
     * 获取指定像素数据_hex
     */
    public GetPixelHex(x: number, y: number): number {
        const result = this.GetPixel(x, y);
        return (result[0] & 0xff) << 16 | (result[1] & 0xff) << 8 | (result[2] & 0xff);
    }

    // 返回两个颜色的相似度，[0, 1]
    // 基于最大分量差值法的相似度
    public Similarity(color1: number[], color2: number[]): number {
        const rDiff = Math.abs(color1[0] - color2[0]);
        const gDiff = Math.abs(color1[1] - color2[1]);
        const bDiff = Math.abs(color1[2] - color2[2]);

        const maxDiff = Math.max(rDiff, gDiff, bDiff);

        // 计算相似度
        return this.Round((255 - maxDiff) / 255 * 100);
    }

    private CompareColorInner(description: number[], offsetX: number, offsetY: number, offsetLength: number): boolean {
        const x = description[0] + offsetX;
        const y = description[1] + offsetY;
        let _x;
        let _y;

        const offsetPoint: Point[] = [
            new Point(x, y),
            new Point(x - 1, y - 1),
            new Point(x - 1, y),
            new Point(x - 1, y + 1),
            new Point(x, y - 1),
            new Point(x, y + 1),
            new Point(x + 1, y - 1),
            new Point(x + 1, y),
            new Point(x + 1, y + 1),
        ];


        for (let i = 0; i < offsetLength; i++) {
            _x = offsetPoint[i].x;
            _y = offsetPoint[i].y;
            if (_x >= 0 && _x < this.Width && _y >= 0 && _y < this.Height) {
                const location = _x * this.PxFormat + _y * this.RowStride;
                if (this.Abs((this.ScreenData[location] & 0xff) - description[2]) <= description[5]) {
                    if (this.Abs((this.ScreenData[location + 1] & 0xff) - description[3]) <= description[6]) {
                        if (this.Abs((this.ScreenData[location + 2] & 0xff) - description[4]) <= description[7]) {
                            return description[8] == 0;
                        }
                    }
                }
            }
        }
        return description[8] == 1;
    }

    /**
     * 基于最大分量差值法的似度比色：取rgb三个通道的分量分别计算差值，(255-差值的最大值)/255表示两个颜色的相似度，
     * 根据以上的逻辑做单点比色，offset为true时表示目标及周围的9点中有一个点比色成功就算成功
     * 
     * @param description
        [0]: X坐标
        [1]: Y坐标
        [2]: R分量目标值
        [3]: G分量目标值
        [4]: B分量目标值
        [5]: R分量容差
        [6]: G分量容差
        [7]: B分量容差
        [8]: 结果标志位
     * @param sim 
     * @param offset 
     * @returns 
     */
    public CompareColor(description: number[], sim: number, offset: boolean): boolean {
        const offsetLength = !offset ? 1 : 9;
        const x = description[0];
        const y = description[1];

        const similarity: number = this.Round(255 - 255 * (sim / 100.0));
        const similarity_R: number = (similarity + description[5]) & 0xff;
        const similarity_G: number = (similarity + description[6]) & 0xff;
        const similarity_B: number = (similarity + description[7]) & 0xff;

        const temp: number[] = [
            description[0],
            description[1],
            description[2],
            description[3],
            description[4],
            similarity_R,
            similarity_G,
            similarity_B,
            description[8]
        ];

        return this.CompareColorInner(temp, 0, 0, offsetLength);
    }

    private CompareColorExInner(description: number[][], x: number, y: number, offsetLength: number): boolean {
        for (let temp of description) {
            if (!this.CompareColorInner(temp, x, y, offsetLength)) {
                return false;
            }
        }
        return true;
    }

    public CompareColorEx(description: number[][], sim: number, offset: boolean): boolean {
        for (let temp of description) {
            if (!this.CompareColor(temp, sim, offset)) {
                return false;
            }
        }
        return true;
    }

    private FindMultiColorInner(startX: number, startY: number, endX: number, endY: number, firstDescription: number[], offsetDescription: number[][], offsetLength: number): Point {
        const red = firstDescription[2];
        for (let i = this.Starts[red], end = this.Steps[red]; i < end; i += 2) {
            const x = this.RedList[i];
            const y = this.RedList[i + 1];
            if (x >= startX && x <= endX && y >= startY && y <= endY) {
                const location = x * this.PxFormat + y * this.RowStride;
                if (this.Abs((this.ScreenData[location + 1] & 0xff) - firstDescription[3]) <= firstDescription[6]) {
                    if (this.Abs((this.ScreenData[location + 2] & 0xff) - firstDescription[4]) <= firstDescription[7]) {
                        if (this.CompareColorExInner(offsetDescription, x, y, offsetLength)) {
                            return new Point(x, y);
                        }
                    }
                }
            } else if (x > endX && y > endY) {
                break;
            }
        }
        return new Point(-1, -1);
    }

    public FindMultiColor1(startX: number, startY: number, endX: number, endY: number, description: number[][], sim: number, offset: boolean): Point {
        startX = Math.max(startX, 0);
        startY = Math.max(startY, 0);
        endX = Math.min(endX, this.Width - 1);
        endY = Math.min(endY, this.Height - 1);
        const firstDescription: number[] = [...description[0].slice(0, 9)];
        const offsetDescription: number[][] = new Array(description.length - 1).fill(null).map(() => new Array(9).fill(0));

        const similarity = this.Round(255 - 255 * (sim / 100.0));
        firstDescription[5] = similarity + description[0][5];
        firstDescription[6] = similarity + description[0][6];
        firstDescription[7] = similarity + description[0][7];

        for (let j = 0; j < offsetDescription.length; j++) {
            offsetDescription[j] = [...description[j + 1].slice(0, 9)]; // Arrays.copyOf(description[j + 1], 9);
            offsetDescription[j][5] = similarity + description[j + 1][5];
            offsetDescription[j][6] = similarity + description[j + 1][6];
            offsetDescription[j][7] = similarity + description[j + 1][7];
        }

        const offsetLength = !offset ? 1 : 9;
        let step = true;
        for (let i = 0; i < firstDescription[5]; i++) {
            let num;
            if (step) {
                num = description[0][2] + i;
                if (i != 0) {
                    i--;
                    step = false;
                }
            } else {
                num = description[0][2] - i;
                step = true;
            }
            if (num < 256 && num > -1) {
                firstDescription[2] = num & 0xff;
                const point: Point = this.FindMultiColorInner(startX, startY, endX, endY, firstDescription, offsetDescription, offsetLength);
                if (point.x != -1) {
                    return point;
                }
            }

        }
        return new Point(-1, -1);
    }

    public FindMultiColor2(range: number[], description: number[][], sim: number, offset: boolean): Point {
        return this.FindMultiColor1(range[0], range[1], range[2], range[3], description, sim, offset);
    }

    private FindMultiColorExInner(startX: number, startY: number, endX: number, endY: number, firstDescription: number[], offsetDescription: number[][], offsetLength: number): Point[] {
        const red = firstDescription[2];
        const result: Point[] = [];

        for (let i = this.Starts[red], end = this.Steps[red]; i < end; i += 2) {
            const x = this.RedList[i];
            const y = this.RedList[i + 1];
            if (x >= startX && x <= endX && y >= startY && y <= endY) {
                const location = x * this.PxFormat + y * this.RowStride;
                if (this.Abs((this.ScreenData[location + 1] & 0xff) - firstDescription[3]) <= firstDescription[6]) {
                    if (this.Abs((this.ScreenData[location + 2] & 0xff) - firstDescription[4]) <= firstDescription[7]) {
                        if (this.CompareColorExInner(offsetDescription, x, y, offsetLength)) {
                            result.push(new Point(x, y));
                        }
                    }
                }
            } else if (x > endX && y > endY) {
                break;
            }
        }
        return result;
    }

    public FindMultiColorEx1(startX: number, startY: number, endX: number, endY: number, description: number[][], sim: number, filterNum: number, offset: boolean): Point[] {
        startX = Math.max(startX, 0);
        startY = Math.max(startY, 0);
        endX = Math.min(endX, this.Width - 1);
        endY = Math.min(endY, this.Height - 1);
        const firstDescription: number[] = [...description[0].slice(0, 9)];
        const offsetDescription: number[][] = new Array(description.length - 1).fill(null).map(() => new Array(9).fill(0));;

        const similarity = this.Round(255 - 255 * (sim / 100.0));
        firstDescription[5] = similarity + description[0][5];
        firstDescription[6] = similarity + description[0][6];
        firstDescription[7] = similarity + description[0][7];

        for (let j = 0; j < offsetDescription.length; j++) {
            offsetDescription[j] = [...description[j + 1].slice(0, 9)];
            offsetDescription[j][5] = similarity + description[j + 1][5];
            offsetDescription[j][6] = similarity + description[j + 1][6];
            offsetDescription[j][7] = similarity + description[j + 1][7];
        }

        const points: Point[] = [];

        let step = true;
        const offsetLength = !offset ? 1 : 9;
        for (let i = 0; i < firstDescription[5]; i++) {
            let num;
            if (step) {
                num = description[0][2] + i;
                if (i != 0) {
                    i--;
                    step = false;
                }
            } else {
                num = description[0][2] - i;
                step = true;
            }
            if (num < 256 && num > -1) {
                firstDescription[2] = num & 0xff;
                const temp = this.FindMultiColorExInner(startX, startY, endX, endY, firstDescription, offsetDescription, offsetLength);
                points.push(...temp);
            }
        }

        const result: Point[] = [];

        let filterX = filterNum;
        let filterY = filterNum;
        if (filterNum == -1) {
            let left = 0;
            let top = 0;
            let right = filterNum;
            let bottom = filterNum;
            for (let i = 1; i < description.length; i++) {
                left = Math.min(left, description[i][0]);
                top = Math.min(top, description[i][1]);
                right = Math.max(right, description[i][0]);
                bottom = Math.max(bottom, description[i][1]);
            }
            filterX = right - left;
            filterY = bottom - top;
        }

        for (let i = 0; i < points.length; i++) {
            const point: Point = points[i];
            let isOverlap: boolean = false;
            for (let j = 0; j < result.length; j++) {
                const temp: Point = result[j];
                if (this.Abs(point.x - temp.x) <= filterX && this.Abs(point.y - temp.y) <= filterY) {
                    isOverlap = true;
                    break;
                }
            }
            if (!isOverlap) {
                result.push(point);
            }
        }
        return result;
    }

    public FindMultiColorEx2(startX: number, startY: number, endX: number, endY: number, description: number[][], sim: number, filterNum: number): Point[] {
        return this.FindMultiColorEx1(startX, startY, endX, endY, description, sim, filterNum, false);
    }

    public FindMultiColorEx3(startX: number, startY: number, endX: number, endY: number, description: number[][], sim: number): Point[] {
        return this.FindMultiColorEx1(startX, startY, endX, endY, description, sim, -1, false);
    }

    public FindMultiColorEx4(range: number[], description: number[][], sim: number, filterNum: number): Point[] {
        return this.FindMultiColorEx1(range[0], range[1], range[2], range[3], description, sim, filterNum, false);
    }

    public FindMultiColorEx5(range: number[], description: number[][], sim: number): Point[] {
        return this.FindMultiColorEx1(range[0], range[1], range[2], range[3], description, sim, -1, false);
    }

    public FindMultiColorEx6(startX: number, startY: number, endX: number, endY: number, description: number[][], sim: number, offset: boolean): Point[] {
        return this.FindMultiColorEx1(startX, startY, endX, endY, description, sim, -1, offset);
    }

    public FindMultiColorEx7(range: number[], description: number[][], sim: number, filterNum: number, offset: boolean): Point[] {
        return this.FindMultiColorEx1(range[0], range[1], range[2], range[3], description, sim, filterNum, offset);
    }

    public FindMultiColorEx8(range: number[], description: number[][], sim: number, offset: boolean): Point[] {
        return this.FindMultiColorEx1(range[0], range[1], range[2], range[3], description, sim, -1, offset);
    }
}