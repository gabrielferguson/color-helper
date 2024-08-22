import GraphicHelper from './GraphicHelper';
import Point from './Point';

export default class AnchorGraphicHelper {
    private _NONE = -1;
    private _LEFT = 0;
    private _CENTER = 1;
    private _RIGHT = 2;

    private BaseGraphicHelper: GraphicHelper;
    private Multiple: number;
    private Left: number;
    private Top: number;
    private Right: number;
    private Bottom: number;
    private Center: number;
    private DevWidth: number;
    private DevHeight: number;

    /**
     * 静态构造函数
     *
     * @param obj:       aj_runtime
     * @param devWidth:  开发分辨率_宽
     * @param devHeight: 开发分辨率_高
     * @param left:      运行设备布局 startX
     * @param top:       运行设备布局 startY
     * @param right      运行设备布局 endX
     * @param bottom:    运行设备布局 endY
     */
    // public static AnchorGraphicHelper Create(Object obj, int devWidth, int devHeight, int left, int top, int right, int bottom) {
    //     AnchorGraphicHelper helper = new AnchorGraphicHelper(obj, devWidth, devHeight, left, top, right, bottom);
    //     if (helper.BaseGraphicHelper != null) {
    //         return helper;
    //     }
    //     return null;
    // }

    /**
     * 构造函数
     *
     * @param obj:         aj_runtime
     * @param description: 开发及运行参数
     */
    public constructor(description: number[]) {
        const [devWidth, devHeight, left, top, right, bottom] = description;
        this.BaseGraphicHelper = new GraphicHelper();
        this.DevWidth = devWidth;
        this.DevHeight = devHeight;
        this.Left = left;
        this.Top = top;
        this.Right = right;
        this.Bottom = bottom;
        this.Center = this.Round((this.Right - this.Left + 1.0) / 2) + this.Left - 1;
        this.Multiple = (this.Bottom - this.Top + 1.0) / this.DevHeight;
    }


    // public boolean KeepScreen(boolean sign) {
    //     return BaseGraphicHelper.KeepScreen(sign);
    // }

    public KeepScreen(image: ImageData, sign: boolean): boolean {
        return this.BaseGraphicHelper.KeepScreen(image, sign);
    }

    public ReleaseScreen(): void {
        this.BaseGraphicHelper.ReleaseScreen();
    }

    public GetRedList(): void {
        this.BaseGraphicHelper.GetRedList();
    }

    public GetScreenData(): Uint8ClampedArray {
        return this.BaseGraphicHelper.GetScreenData();
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

    /**
     * 获取与运行设备相关的范围
     *
     * @param sx:    开发分辨率的startX
     * @param sy:    开发分辨率的startY
     * @param smode: sx和sy的坐标对齐方式
     * @param ex:    开发分辨率的endX
     * @param ey:    开发分辨率的endY
     * @param emode: ex和ey的坐标对齐方式
     */
    public GetRange1(sx: number, sy: number, smode: number, ex: number, ey: number, emode: number): number[] {
        const startPoint = this.GetPoint(sx, sy, smode);
        const endPoint = this.GetPoint(ex, ey, emode);
        return [startPoint.x, startPoint.y, endPoint.x, endPoint.y];
    }

    /**
     * 获取与运行设备相关的范围
     *
     * @param sx:   开发分辨率的startX
     * @param sy:   开发分辨率的startY
     * @param ex:   开发分辨率的endX
     * @param ey:   开发分辨率的endY
     * @param mode: 坐标对齐方式
     */
    public GetRange2(sx: number, sy: number, ex: number, ey: number, mode: number): number[] {
        return this.GetRange1(sx, sy, mode, ex, ey, mode);
    }

    /**
     * 获取与运行设备相关的坐标
     *
     * @param x:    开发分辨率的x
     * @param y:    开发分辨率的y
     * @param mode: 坐标对齐方式
     */
    public GetPoint(x: number, y: number, mode: number): Point {
        const result = new Point(-1, -1);
        if (mode == this._LEFT || mode == this._NONE) {
            result.x = this.Round(x * this.Multiple) + this.Left;
        } else if (mode == this._CENTER) {
            result.x = this.Round(this.Center - (this.DevWidth / 2.0 - x - 1) * this.Multiple);
        } else if (mode == this._RIGHT) {
            result.x = this.Round(this.Right - (this.DevWidth - x - 1) * this.Multiple);
        }
        result.y = this.Round(y * this.Multiple) + this.Top;
        return result;
    }

    // public Bitmap GetBitmap() {
    //     return BaseGraphicHelper.GetBitmap();
    // }

    // public Bitmap GetBitmap(int sx, int sy, int ex, int ey) {
    //     return BaseGraphicHelper.GetBitmap(sx, sy, ex, ey);
    // }

    public GetPixel(x: number, y: number, mode: number): number[] {
        const point = this.GetPoint(x, y, mode);
        return this.BaseGraphicHelper.GetPixel(point.x, point.y);
    }

    public GetPixelStr(x: number, y: number, mode: number): string {
        const point = this.GetPoint(x, y, mode);
        return this.BaseGraphicHelper.GetPixelStr(point.x, point.y);
    }

    public GetPixelHex(x: number, y: number, mode: number): number {
        const point = this.GetPoint(x, y, mode);
        return this.BaseGraphicHelper.GetPixelHex(point.x, point.y);
    }

    public GetCmpColorArray1(devWidth: number, devHeight: number, description: number[][]): number[][] {
        const multiple = (this.Bottom - this.Top + 1.0) / devHeight;
        const result: number[][] = Array.from({ length: description.length }, () => Array(9).fill(0));
        for (let i = 0; i < description.length; i++) {
            if (description[i][0] == this._LEFT || description[i][0] == this._NONE) {
                result[i][0] = this.Round(description[i][1] * multiple) + this.Left;
            } else if (description[i][0] == this._CENTER) {
                result[i][0] = this.Round(this.Center - (devWidth / 2.0 - description[i][1] - 1) * multiple);
            } else if (description[i][0] == this._RIGHT) {
                result[i][0] = this.Round(this.Right - (devWidth - description[i][1] - 1) * multiple);
            }
            result[i][1] = this.Round(description[i][2] * multiple) + this.Top;
            result[i][2] = (description[i][3] & 0xff0000) >> 16;
            result[i][3] = (description[i][3] & 0xff00) >> 8;
            result[i][4] = description[i][3] & 0xff;
            result[i][5] = result[i][6] = result[i][7] = result[i][8] = 0;

            if (description[i].length >= 5) {
                if (description[i].length == 6) {
                    result[i][8] = description[i][5];
                } else if (description[i][4] == 1) {
                    result[i][8] = description[i][4];
                } else {
                    result[i][5] = (description[i][4] & 0xff0000) >> 16;
                    result[i][6] = (description[i][4] & 0xff00) >> 8;
                    result[i][7] = description[i][4] & 0xff;
                }
            }
        }
        return result;
    }

    public GetCmpColorArray2(description: string): number[][] {
        const desc = description.split(',');
        const devWidth = parseInt(desc[0].trim());
        const devHeight = parseInt(desc[1].trim());
        const multiple = (this.Bottom - this.Top + 1.0) / devHeight;

        const result: number[][] = Array.from({ length: description.length - 2 }, () => Array(9).fill(0));
        for (let i = 2, j = 0; i < desc.length; i++, j++) {
            const currentDesc = desc[i].trim().split('|');
            switch (currentDesc[0]) {
                case 'left':
                case 'none':
                    result[j][0] = this.Round(parseInt(currentDesc[1]) * multiple) + this.Left;
                    break;
                case 'center':
                    result[j][0] = this.Round(this.Center - (devWidth / 2.0 - parseInt(currentDesc[1]) - 1) * multiple);
                    break;
                case 'right':
                    result[j][0] = this.Round(this.Right - (devWidth - parseInt(currentDesc[1]) - 1) * multiple);
                    break;
            }
            result[j][1] = this.Round(parseInt(currentDesc[2]) * multiple) + this.Top;
            const color = parseInt(currentDesc[3].replace('0x', ''), 16);
            result[j][2] = (color & 0xff0000) >> 16;
            result[j][3] = (color & 0xff00) >> 8;
            result[j][4] = color & 0xff;
            result[j][5] = result[j][6] = result[j][7] = result[j][8] = 0;
            if (currentDesc.length >= 5) {
                if (currentDesc[4].startsWith('0x')) {
                    const offsetColor = parseInt(currentDesc[4].replace('0x', ''), 16);
                    result[j][5] = (offsetColor & 0xff0000) >> 16;
                    result[j][6] = (offsetColor & 0xff00) >> 8;
                    result[j][7] = offsetColor & 0xff;
                } else {
                    result[j][8] = parseInt(currentDesc[4]);
                }

                if (currentDesc.length == 6) {
                    result[j][8] = parseInt(currentDesc[5]);
                }
            }
        }
        return result;
    }

    public GetFindColorArray1(devWidth: number, devHeight: number, description: number[][]): number[][] {
        const result: number[][] = Array.from({ length: description.length }, () => Array(9).fill(0));
        const multiple = (this.Bottom - this.Top + 1.0) / devHeight;
        if (description[0][0] == this._LEFT || description[0][0] == this._NONE) {
            result[0][0] = this.Round(description[0][1] * multiple) + this.Left;
        } else if (description[0][0] == this._CENTER) {
            result[0][0] = this.Round(this.Center - (devWidth / 2.0 - description[0][1] - 1) * multiple);
        } else if (description[0][0] == this._RIGHT) {
            result[0][0] = this.Round(this.Right - (devWidth - description[0][1] - 1) * multiple);
        }
        result[0][1] = this.Round(description[0][2] * multiple);
        result[0][2] = (description[0][3] & 0xff0000) >> 16;
        result[0][3] = (description[0][3] & 0xff00) >> 8;
        result[0][4] = description[0][3] & 0xff;
        result[0][5] = result[0][6] = result[0][7] = 0;
        if (description[0].length == 5) {
            result[0][5] = (description[0][4] & 0xff0000) >> 16;
            result[0][6] = (description[0][4] & 0xff00) >> 8;
            result[0][7] = description[0][4] & 0xff;
        }

        for (let i = 1; i < description.length; i++) {
            if (description[i][0] == this._LEFT || description[i][0] == this._NONE) {
                result[i][0] = this.Round(description[i][1] * multiple) + this.Left - result[0][0];
            } else if (description[i][0] == this._CENTER) {
                result[i][0] = this.Round(this.Center - (devWidth / 2.0 - description[i][1] - 1) * multiple) - result[0][0];
            } else if (description[i][0] == this._RIGHT) {
                result[i][0] = this.Round(this.Right - (devWidth - description[i][1] - 1) * multiple) - result[0][0];
            }
            result[i][1] = this.Round(description[i][2] * multiple) + this.Top - result[0][1];
            result[i][2] = (description[i][3] & 0xff0000) >> 16;
            result[i][3] = (description[i][3] & 0xff00) >> 8;
            result[i][4] = description[i][3] & 0xff;
            result[i][5] = result[i][6] = result[i][7] = result[i][8] = 0;
            if (description[i].length >= 5) {
                if (description[i].length == 6) {
                    result[i][8] = description[i][5];
                } else if (description[i][4] == 1) {
                    result[i][8] = description[i][4];
                } else {
                    result[i][5] = (description[i][4] & 0xff0000) >> 16;
                    result[i][6] = (description[i][4] & 0xff00) >> 8;
                    result[i][7] = description[i][4] & 0xff;
                }
            }
        }
        return result;
    }

    public GetFindColorArray2(description: string): number[][] {
        try {
            const desc = description.split(',');
            const devWidth = parseInt(desc[0].trim());
            const devHeight = parseInt(desc[1].trim());
            const multiple = (this.Bottom - this.Top + 1.0) / devHeight;

            const result: number[][] = Array.from({ length: description.length - 2 }, () => Array(9).fill(0));

            {
                const currentDesc = desc[2].trim().split('|');
                switch (currentDesc[0]) {
                    case 'left':
                    case 'none':
                        result[0][0] = this.Round(parseInt(currentDesc[1]) * multiple) + this.Left;
                        break;
                    case 'center':
                        result[0][0] = this.Round(this.Center - (devWidth / 2.0 - parseInt(currentDesc[1]) - 1) * multiple);
                        break;
                    case 'right':
                        result[0][0] = this.Round(this.Right - (devWidth - parseInt(currentDesc[1]) - 1) * multiple);
                        break;
                }
                result[0][1] = this.Round(parseInt(currentDesc[2]) * multiple) + this.Top;
                const color = parseInt(currentDesc[3].replace('0x', ''), 16);
                result[0][2] = (color & 0xff0000) >> 16;
                result[0][3] = (color & 0xff00) >> 8;
                result[0][4] = color & 0xff;
                result[0][5] = result[0][6] = result[0][7] = result[0][8] = 0;
                if (currentDesc.length >= 5) {
                    const offsetColor = parseInt(currentDesc[4].replace('0x', ''), 16);
                    result[0][5] = (offsetColor & 0xff0000) >> 16;
                    result[0][6] = (offsetColor & 0xff00) >> 8;
                    result[0][7] = offsetColor & 0xff;
                }
            }

            for (let i = 3, j = 1; i < desc.length; i++, j++) {
                const currentDesc = desc[i].trim().split('|');
                switch (currentDesc[0]) {
                    case 'left':
                    case 'none':
                        result[j][0] = this.Round(parseInt(currentDesc[1]) * multiple) + this.Left - result[0][0];
                        break;
                    case 'center':
                        result[j][0] = this.Round(this.Center - (devWidth / 2.0 - parseInt(currentDesc[1]) - 1) * multiple) - result[0][0];
                        break;
                    case 'right':
                        result[j][0] = this.Round(this.Right - (devWidth - parseInt(currentDesc[1]) - 1) * multiple) - result[0][0];
                        break;
                }
                result[j][1] = this.Round(parseInt(currentDesc[2]) * multiple) + this.Top - result[0][1];
                const color = parseInt(currentDesc[3].replace('0x', ''), 16);
                result[j][2] = (color & 0xff0000) >> 16;
                result[j][3] = (color & 0xff00) >> 8;
                result[j][4] = color & 0xff;
                result[j][5] = result[j][6] = result[j][7] = result[j][8] = 0;
                if (currentDesc.length >= 5) {
                    if (currentDesc[4].startsWith('0x')) {
                        const offsetColor = parseInt(currentDesc[4].replace('0x', ''), 16);
                        result[j][5] = (offsetColor & 0xff0000) >> 16;
                        result[j][6] = (offsetColor & 0xff00) >> 8;
                        result[j][7] = offsetColor & 0xff;
                    } else {
                        result[j][8] = parseInt(currentDesc[4]);
                    }

                    if (currentDesc.length == 6) {
                        result[j][8] = parseInt(currentDesc[5]);
                    }
                }
            }
            return result;
        }
        catch (e) {
            console.error(e)
            return null;
        }
    }

    public Similarity(color1: number[], color2: number[]): number {
        return this.BaseGraphicHelper.Similarity(color1, color2);
    }
    public CompareColor(description: number[], sim: number, offset: boolean): boolean {
        return this.BaseGraphicHelper.CompareColor(description, sim, offset);
    }

    public CompareColorEx(description: number[][], sim: number, offset: boolean): boolean {
        return this.BaseGraphicHelper.CompareColorEx(description, sim, offset);
    }


    public FindMultiColor1(startX: number, startY: number, endX: number, endY: number, description: number[][], sim: number, offset: boolean): Point {
        return this.BaseGraphicHelper.FindMultiColor1(startX, startY, endX, endY, description, sim, offset);
    }

    public FindMultiColor2(range: number[], description: number[][], sim: number, offset: boolean): Point {
        return this.BaseGraphicHelper.FindMultiColor1(range[0], range[1], range[2], range[3], description, sim, offset);
    }

    public FindMultiColorEx1(startX: number, startY: number, endX: number, endY: number, description: number[][], sim: number, filterNum: number, offset: boolean): Point[] {
        return this.BaseGraphicHelper.FindMultiColorEx1(startX, startY, endX, endY, description, sim, filterNum, offset);
    }

    public FindMultiColorEx2(startX: number, startY: number, endX: number, endY: number, description: number[][], sim: number, filterNum: number): Point[] {
        return this.BaseGraphicHelper.FindMultiColorEx2(startX, startY, endX, endY, description, sim, filterNum);
    }

    public FindMultiColorEx3(startX: number, startY: number, endX: number, endY: number, description: number[][], sim: number): Point[] {
        return this.BaseGraphicHelper.FindMultiColorEx3(startX, startY, endX, endY, description, sim);
    }

    public FindMultiColorEx4(range: number[], description: number[][], sim: number, filterNum: number): Point[] {
        return this.BaseGraphicHelper.FindMultiColorEx4(range, description, sim, filterNum);
    }

    public FindMultiColorEx5(range: number[], description: number[][], sim: number): Point[] {
        return this.BaseGraphicHelper.FindMultiColorEx5(range, description, sim);
    }

    public FindMultiColorEx6(startX: number, startY: number, endX: number, endY: number, description: number[][], sim: number, offset: boolean): Point[] {
        return this.BaseGraphicHelper.FindMultiColorEx6(startX, startY, endX, endY, description, sim, offset);
    }

    public FindMultiColorEx7(range: number[], description: number[][], sim: number, filterNum: number, offset: boolean): Point[] {
        return this.BaseGraphicHelper.FindMultiColorEx7(range, description, sim, filterNum, offset);
    }

    public FindMultiColorEx8(range: number[], description: number[][], sim: number, offset: boolean): Point[] {
        return this.BaseGraphicHelper.FindMultiColorEx8(range, description, sim, offset);
    }
    // </editor-fold>
}