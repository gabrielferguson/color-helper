import mitt from "mitt";

type Events = {
    'Event.ColorHelper.Settings.change': { key: string, value: string },
    'Event.ColorHelper.AdbHelper.canScreencapStatusChange': boolean,
};

const emitter = mitt<Events>();

export default emitter;
