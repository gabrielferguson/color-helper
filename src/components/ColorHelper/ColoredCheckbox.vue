<template>
    <div class="colored-checkbox">
        <span class="colored-checkbox__inner" :style="getCheckboxStyle" @click="toggleCheckbox">
            <span v-if="isChecked" class="colored-checkbox__inner__after" :style="getCheckboxAfterStyle"></span>
        </span>
    </div>
</template>

<script setup lang="ts">
import { isColorLight } from './tools';
import { computed } from 'vue';

const isChecked = defineModel();
const $prop = defineProps({
    backgroundColor: {
        type: String,
        default: '#767676'
    }
});

const getCheckboxStyle = computed(() => {
    const bgColor = isChecked.value ? $prop.backgroundColor : '#ffffff';
    if (isColorLight(bgColor)) {
        return {
            backgroundColor: bgColor,
            borderColor: '#dcdfe6',
        };
    } else {
        return {
            backgroundColor: bgColor,
            ...(isChecked.value ? { borderColor: bgColor } : {})
        };
    }
});

const getCheckboxAfterStyle = computed(() => {
    if (isColorLight($prop.backgroundColor)) {
        return {
            borderColor: '#464646'
        }
    } else {
        return {
            borderColor: '#ffffff'
        }
    }
});

function toggleCheckbox() {
    isChecked.value = !isChecked.value;
}

</script>

<style>
.colored-checkbox {
    display: flex;
    align-items: center;
}

.colored-checkbox__inner__after {
    border: 1px solid #ffffff;
    border-left: 0;
    border-top: 0;
    box-sizing: content-box;
    content: "";
    height: 7px;
    left: 4px;
    position: absolute;
    top: 1px;
    transform: rotate(45deg) scaleY(1);
    transform-origin: center;
    transition: transform .15s ease-in .05s;
    width: 3px;
}

.colored-checkbox__inner {
    background-color: #ffffff;
    border: 0.8px solid #dcdfe6;
    border-radius: 2px;
    box-sizing: border-box;
    display: inline-block;
    height: 14px;
    position: relative;
    transition: border-color .25s cubic-bezier(.71, -.46, .29, 1.46), background-color .25s cubic-bezier(.71, -.46, .29, 1.46), outline .25s cubic-bezier(.71, -.46, .29, 1.46);
    width: 14px;
    cursor: pointer;
}
</style>