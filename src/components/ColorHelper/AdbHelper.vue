<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { adbHelper } from './tools';
import { onUnmounted } from 'vue';
import { ElNotification } from 'element-plus';
import { Plus, Loading } from '@element-plus/icons-vue';
import { watch } from 'vue';

const deviceIdOptions = ref<{ value: string, label: string, disabled?: boolean }[]>([]);
const deviceId = ref<string>(null);
const shown = ref<boolean>(false);
const loadingScreenCap = ref<boolean>(false);
const loadingDevices = ref<boolean>(false);
const loadingConnect = ref<boolean>(false);
const remoteDeviceId = ref<string>(null);
let callbackId: number = null;

const $props = defineProps({
    onScreencap: {
        type: Function,
        required: false,
    }
});

watch(deviceId, (newVal, oldVal) => {
    adbHelper.setCurrentDeviceId(newVal);
});

const screencap = async () => {
    if (!deviceId.value) {
        ElNotification({
            message: '请选择一个设备',
            type: 'error',
        });
        return;
    }
    if ($props.onScreencap) {
        loadingScreenCap.value = true;
        try {
            const dataUrl = await adbHelper.screencap(deviceId.value);
            $props.onScreencap(dataUrl);
        } catch (e) {
            console.error(e);
        }
        loadingScreenCap.value = false;
    }
}

const connect = async () => {
    loadingConnect.value = true;
    try {
        const msg = await adbHelper.connect(remoteDeviceId.value);
        ElNotification({
            message: msg,
            type: 'info'
        })
    } catch (e) {
        console.log(e);
    }
    loadingConnect.value = false;
}

const refreshDevices = async (visible: boolean) => {
    if (!visible) return;
    loadingDevices.value = true;
    try {
        deviceIdOptions.value = (await adbHelper.devices()).map(deviceId => ({ value: deviceId, label: deviceId, disabled: / offline$/.test(deviceId) }));
    } catch (e) {
        console.log(e);
    }
    loadingDevices.value = false;
}

onMounted(async () => {
    callbackId = adbHelper.setCallback(function () {
        shown.value = true;
        // refreshDevices();
    }, function () {
        shown.value = false;
    });
});

onUnmounted(() => {
    adbHelper.removeCallback(callbackId);
});

// TODO 连接设备、截图

</script>

<template>
    <div v-if="shown">
        <el-form :inline="true">
            <el-form-item label="adb">
                <el-select v-model="deviceId" @visible-change="refreshDevices" :loading="loadingDevices" placeholder="选择设备"
                    style="width: 200px; margin-right: 10px;">
                    <el-option v-for="item in deviceIdOptions" :key="item.value" :label="item.label" :value="item.value"
                        :disabled="item.disabled" />
                </el-select>
                <el-popover placement="bottom" trigger="click" :width="400">
                    <template #reference>
                        <el-button>
                            <el-icon>
                                <Plus />
                            </el-icon>
                        </el-button>
                    </template>
                    <div>
                        <el-input v-model="remoteDeviceId" placeholder="IP[:PORT]" style="width:303px; margin-right: 10px;"
                            :readonly="loadingConnect">
                            <template #suffix></template>
                        </el-input>
                        <el-button @click="connect" style="width: 60px">
                            <el-icon v-if="loadingConnect" class="is-loading">
                                <Loading />
                            </el-icon>
                            <template v-if="!loadingConnect">连接</template>
                        </el-button>
                    </div>
                </el-popover>
                <el-button @click="screencap" :disabled="loadingScreenCap" style="width: 60px">
                    <el-icon v-if="loadingScreenCap" class="is-loading">
                        <Loading />
                    </el-icon>
                    <template v-if="!loadingScreenCap">截图</template>
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<style>
.el-form--inline .el-form-item {
    margin-right: 0;
}
</style>