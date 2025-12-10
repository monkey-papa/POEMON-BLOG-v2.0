<template>
  <div class="upload-picture-container">
    <el-upload
      class="upload-picture"
      ref="upload"
      multiple
      drag
      name="image"
      :action="$constant.qiniuUploadImages"
      :on-change="handleChange"
      :on-success="handleSuccess"
      :on-error="handleError"
      :list-type="listType"
      :accept="accept"
      :limit="maxNumber"
      :data="{
        userId: $route?.meta?.requiresAuth ? currentAdmin.id : currentUser.id,
        folder: props.ResourceType || 'images',
      }"
      :auto-upload="false"
    >
      <div class="el-upload__text">
        <img src="../../assets/svg/upload.svg" />
        <div>拖拽上传 / 点击上传</div>
      </div>
      <template v-if="listType === 'picture'" #tip>
        <div class="el-upload__tip">
          一次最多上传{{ maxNumber }}张图片，且每张图片不超过{{ maxSize }}M！
        </div>
      </template>
      <template v-else #tip>
        <div class="el-upload__tip">
          一次最多上传{{ maxNumber }}个文件，且每个文件不超过{{ maxSize }}M！
        </div>
      </template>
    </el-upload>
    <div class="upload-picture-button">
      <el-button type="success" @click="submitUpload"> 上传 </el-button>
    </div>
  </div>
</template>
<script setup>
import { notifySuccess, notifyWarning } from "@/utils/notify";
import api from "@/api";
import { ref, computed } from "vue";
import { useStore } from "@/stores";
import { useGlobalProperties } from "@/composables/useGlobalProperties";

const store = useStore();
const { $route } = useGlobalProperties();

const props = defineProps({
  listType: {
    type: String,
    default: "picture",
  },
  // 接受上传的文件类型
  accept: {
    type: String,
    default: "image/*",
  },
  maxSize: {
    type: Number,
    default: 5,
  },
  maxNumber: {
    type: Number,
    default: 5,
  },
  ResourceType: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["addPicture"]);

const currentUser = computed(() => store.currentUser);
const currentAdmin = computed(() => store.currentAdmin);

const upload = ref(null);

// 上传点击事件
const submitUpload = () => {
  upload.value.submit();
};

// 文件上传成功时的钩子
const handleSuccess = async (response, file) => {
  const id = $route?.meta?.requiresAuth
    ? currentAdmin.value.id
    : currentUser.value.id;
  // 存取资源接口
  const resource = {
    type: file.raw.type,
    path: response.url,
    size: file.size,
    mimeType: props.ResourceType,
    id,
  };

  try {
    await api.saveResource(resource);
  } catch (error) {
    console.log(error);
  }

  if (response.url) {
    emit("addPicture", response.url);
  }
  notifySuccess("上传成功！");
};

// 文件上传失败时的钩子
const handleError = () => {
  notifyWarning("上传出错！");
};

// 添加文件、上传成功和上传失败时都会被调用
const handleChange = (file, fileList) => {
  let flag = false;
  if (file.size > props.maxSize * 1024 * 1024) {
    notifyWarning("图片最大为" + props.maxSize + "M！");
    flag = true;
  }
  if (flag) {
    fileList.splice(fileList.length - 1, 1);
  }
};
</script>

<style lang="scss" scoped>
.upload-picture-container {
  .upload-picture {
    .el-upload__text {
      img {
        margin-top: 10px;
      }
    }
  }

  .upload-picture-button {
    text-align: center;
    margin-top: 10px;
  }
}
</style>
