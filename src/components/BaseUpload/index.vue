<script setup>
import { message } from 'ant-design-vue'
import axios from 'axios'

const props = defineProps({
    // 是否显示进度条
    showProgress: {
        type: Boolean,
        default: true,
    },
    // 响应式文件列表
    modelValue: {
        type: Array,
        default: () => [],
    },
    // 进度条颜色
    progressColor: {
        type: [String, Array],
        default: '#1890ff',
    },
    // 进度条粗细
    progressStrokeWidth: {
        type: Number,
        default: 2,
    },
    // 自定义上传方法
    customRequest: {
        type: Function,
        default: null,
    },
    // 默认上传地址
    action: {
        type: String,
        default: '',
    },
    // 自动上传（当使用自定义上传时建议关闭）
    autoUpload: {
        type: Boolean,
        default: true,
    },
})

const emit = defineEmits(['update:modelValue', 'progress', 'uploadSuccess', 'uploadError', 'change'])

const attrs = useAttrs()
const uploadProgress = ref({})
const fileList = ref([...props.modelValue])

// 合并a-upload组件自带的属性和用户自定义传入的属性，保留用户传入的所有配置
const mergedAttrs = computed(() => ({
    ...attrs,
    action: props.action,
    listType: attrs.listType || 'text',
    showUploadList: attrs.showUploadList ?? true,
}))

// 处理自定义上传
async function handleCustomRequest({ file, onProgress, onSuccess, onError }) {
    if (typeof props.customRequest === 'function') {
        // 使用自定义上传逻辑
        return props.customRequest({
            file,
            onProgress,

            onSuccess,
            onError,
        })
    }

    // 默认上传实现（示例使用 FormData）
    const formData = new FormData()
    formData.append('file', file)
    for (const formDataKey in mergedAttrs.value.data) {
        formData.append(formDataKey, mergedAttrs.value.data[formDataKey])
    }

    try {
        const response = await axios.post(props.action || attrs.action, formData, {
            onUploadProgress: (progressEvent) => {
                const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                updateProgress(file, percent)
                onProgress({ percent })
            },
            headers: mergedAttrs.value.headers,
        })

        onSuccess(response.data, file)
        emit('uploadSuccess', response.data, file)
    }
    catch (error) {
        onError(error)
        emit('uploadError', error, file)
    }
}

// 更新上传进度
function updateProgress(file, percent) {
    emit('progress', { file, percent })
}

// 处理上传状态变化
function handleChange({ file, fileList: updatedFiles }) {
    emit('change', { file, fileList: updatedFiles })
    emit('update:modelValue', updatedFiles)
    if (file.status === 'done') {
        message.success(`${file.name}  上传成功`)
    }
    else if (file.status === 'error') {
        message.error(`${file.name}  上传失败`)
    }
}

watch(
    () => props.modelValue,
    (newVal) => {
        if (JSON.stringify(newVal) !== JSON.stringify(fileList.value)) {
            fileList.value = [...newVal]
        }
    },
)
</script>

<template>
    <a-upload v-bind="mergedAttrs" :custom-request="handleCustomRequest" @change="handleChange">
        <!-- 暴露插槽用于自定义渲染 -->
        <template v-if="$slots.default" #default>
            <slot />
        </template>

        <!-- 自定义上传列表 -->
        <template v-if="$slots.itemRender" #itemRender="{ file }">
            <slot name="itemRender" :file="file" />
        </template>

        <!-- 进度条模板 -->
        <template v-if="showProgress" #progress="{ file }">
            <div class="custom-progress">
                <a-progress
                    :percent="uploadProgress[file.uid]"
                    :stroke-width="progressStrokeWidth"
                    :stroke-color="progressColor"
                    :show-info="false"
                />
                <span class="progress-text"> {{ uploadProgress[file.uid] }}% </span>
            </div>
        </template>
    </a-upload>
</template>
