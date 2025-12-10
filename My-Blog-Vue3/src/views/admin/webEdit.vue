<template>
  <div class="web-edit-container">
    <!-- 基础信息 -->
    <div class="web-edit-container-item">
      <el-tag effect="dark" class="admin-title-tag">
        <img class="admin-title-tag-img" src="../../assets/svg/edit.svg" />
        基础信息
      </el-tag>
      <el-form
        :model="webInfo"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="网站名称" prop="webName">
          <el-input v-model="webInfo.webName" />
        </el-form-item>
        <el-form-item label="网站标题" prop="webTitle">
          <el-input v-model="webInfo.webTitle" />
        </el-form-item>
        <el-form-item label="页脚" prop="footer">
          <el-input v-model="webInfo.footer" />
        </el-form-item>
        <el-form-item
          v-hasPermi="['user:visit:read']"
          label="状态"
          prop="status"
        >
          <el-switch
            @click="changeWebStatus(webInfo)"
            v-model="webInfo.status"
          />
        </el-form-item>
        <el-form-item label="背景" prop="backgroundImage">
          <div class="web-edit">
            <el-input v-model="webInfo.backgroundImage" />
            <el-image
              v-if="webInfo.avatar"
              lazy
              class="admin-image-thumb"
              :preview-src-list="[webInfo.backgroundImage]"
              :src="webInfo.backgroundImage"
              fit="cover"
            />
          </div>
          <uploadPicture
            v-hasPermi="['user:visit:read']"
            :ResourceType="'webBackgroundImage'"
            class="web-edit-container-item-upload-picture"
            @addPicture="addBackgroundImage"
            :maxSize="5"
            :maxNumber="1"
          />
        </el-form-item>
        <el-form-item label="默认头像" prop="avatar">
          <div class="web-edit">
            <el-input v-model="webInfo.avatar" />
            <el-image
              v-if="webInfo.avatar"
              lazy
              class="admin-image-thumb"
              :preview-src-list="[webInfo.avatar]"
              :src="webInfo.avatar"
              fit="cover"
            />
          </div>
          <uploadPicture
            v-hasPermi="['user:visit:read']"
            :ResourceType="'userAvatar'"
            class="web-edit-container-item-upload-picture"
            @addPicture="addAvatar"
            :maxSize="5"
            :maxNumber="1"
          />
        </el-form-item>
        <el-form-item label="提示" prop="waifuJson">
          <div class="web-edit">
            <el-input
              :disabled="disabled"
              :rows="6"
              type="textarea"
              v-model="webInfo.waifuJson"
            />
            <el-icon class="edit-icon" @click="disabled = !disabled"
              ><EditPen
            /></el-icon>
          </div>
        </el-form-item>
      </el-form>
      <div class="web-edit-container-item-button-wrap myCenter">
        <el-button
          v-hasPermi="['user:visit:read']"
          type="primary"
          @click="submitForm('ruleForm')"
          >保存</el-button
        >
      </div>
    </div>
    <!-- 公告 -->
    <div class="web-edit-container-item">
      <el-tag effect="dark" class="admin-title-tag">
        <img class="admin-title-tag-img" src="../../assets/svg/edit.svg" />
        公告
      </el-tag>
      <el-tag
        :key="i"
        v-for="(notice, i) in notices"
        closable
        :disable-transitions="false"
        @close="handleClose(notices, notice)"
      >
        {{ notice }}
      </el-tag>
      <el-input
        class="input-new-tag"
        v-if="inputNoticeVisible"
        v-model="inputNoticeValue"
        ref="saveNoticeInput"
        size="small"
        @keyup.enter="handleInputNoticeConfirm"
        @blur="handleInputNoticeConfirm"
      />
      <el-button
        v-else
        class="button-new-tag"
        size="small"
        @click="showNoticeInput()"
        >+ 公告</el-button
      >
      <div class="web-edit-container-item-button-wrap myCenter">
        <el-button
          v-hasPermi="['user:visit:read']"
          type="primary"
          @click="saveNotice()"
          >保存</el-button
        >
      </div>
    </div>
    <!-- 随机名称 -->
    <div class="web-edit-container-item">
      <el-tag effect="dark" class="admin-title-tag">
        <img class="admin-title-tag-img" src="../../assets/svg/edit.svg" />
        随机名称
      </el-tag>
      <el-tag
        :key="i"
        effect="dark"
        v-for="(name, i) in randomName"
        closable
        :disable-transitions="false"
        :type="types[Math.floor(Math.random() * 5)]"
        @close="handleClose(randomName, name)"
      >
        {{ name }}
      </el-tag>
      <el-input
        class="input-new-tag"
        v-if="inputRandomNameVisible"
        v-model="inputRandomNameValue"
        ref="saveRandomNameInput"
        size="small"
        @keyup.enter="handleInputRandomNameConfirm"
        @blur="handleInputRandomNameConfirm"
      />
      <el-button
        v-else
        class="button-new-tag"
        size="small"
        @click="showRandomNameInput"
        >+ 随机名称</el-button
      >
      <div class="web-edit-container-item-button-wrap myCenter">
        <el-button
          v-hasPermi="['user:visit:read']"
          type="primary"
          @click="saveRandomName()"
          >保存</el-button
        >
      </div>
    </div>
    <!-- 随机头像 -->
    <div class="web-edit-container-item">
      <el-tag effect="dark" class="admin-title-tag">
        <img class="admin-title-tag-img" src="../../assets/svg/edit.svg" />
        随机头像
      </el-tag>
      <div :key="i" class="web-edit" v-for="(avatar, i) in randomAvatar">
        <el-tag
          class="web-edit-item"
          closable
          :disable-transitions="false"
          @close="handleClose(randomAvatar, avatar)"
        >
          {{ avatar }}
        </el-tag>
        <div class="web-edit-item-image">
          <el-image
            lazy
            class="admin-image-thumb"
            :preview-src-list="[avatar]"
            :src="avatar"
            fit="cover"
          />
        </div>
      </div>
      <el-input
        class="input-new-tag"
        v-if="inputRandomAvatarVisible"
        v-model="inputRandomAvatarValue"
        ref="saveRandomAvatarInput"
        size="small"
        @keyup.enter="handleInputRandomAvatarConfirm"
        @blur="handleInputRandomAvatarConfirm"
      />
      <el-button
        v-else
        class="button-new-tag"
        size="small"
        @click="showRandomAvatarInput"
        >+ 随机头像</el-button
      >
      <uploadPicture
        v-hasPermi="['user:visit:read']"
        :ResourceType="'randomAvatar'"
        class="web-edit-container-item-upload-picture"
        @addPicture="addRandomAvatar"
        :maxSize="1"
        :maxNumber="5"
      />
      <div class="web-edit-container-item-button-wrap myCenter">
        <el-button
          v-hasPermi="['user:visit:read']"
          type="primary"
          @click="saveRandomAvatar()"
          >保存</el-button
        >
      </div>
    </div>
    <!-- 其他图片 -->
    <div class="web-edit-container-item">
      <el-tag effect="dark" class="admin-title-tag">
        <img class="admin-title-tag-img" src="../../assets/svg/edit.svg" />
        其他图片（随机封面等）
      </el-tag>
      <div
        class="web-edit web-edit-cover"
        :key="i"
        v-for="(cover, i) in otherPhoto"
      >
        <el-tag
          class="web-edit-item"
          closable
          :disable-transitions="false"
          @close="handleClose(otherPhoto, cover)"
        >
          {{ cover }}
        </el-tag>
        <div class="web-edit-item-image">
          <el-image
            lazy
            class="admin-image-thumb"
            :preview-src-list="[cover]"
            :src="cover"
            fit="cover"
          />
        </div>
      </div>
      <el-input
        class="input-new-tag"
        v-if="inputOtherPhotoVisible"
        v-model="inputOtherPhotoValue"
        ref="saveOtherPhotoInput"
        size="small"
        @keyup.enter="handleInputOtherPhotoConfirm"
        @blur="handleInputOtherPhotoConfirm"
      />
      <el-button
        v-else
        class="button-new-tag"
        size="small"
        @click="showOtherPhotoInput"
        >+ 其他图片</el-button
      >
      <uploadPicture
        v-hasPermi="['user:visit:read']"
        :ResourceType="'otherPhoto'"
        class="web-edit-container-item-upload-picture"
        @addPicture="addOtherPhoto"
        :maxSize="5"
        :maxNumber="5"
      />
      <div
        class="web-edit-container-item-button-wrap web-edit-container-item-button-wrap-last myCenter"
      >
        <el-button
          v-hasPermi="['user:visit:read']"
          type="primary"
          @click="saveOtherPhoto()"
          >保存</el-button
        >
      </div>
    </div>
    <!-- 重置所有修改 -->
    <div>
      <el-button
        v-hasPermi="['user:visit:read']"
        type="danger"
        @click="resetForm('ruleForm')"
        >重置所有修改</el-button
      >
    </div>
  </div>
</template>
<script setup>
import { notifySuccess, notifyError } from "@/utils/notify";
import api from "@/api";
import { ref, onMounted, nextTick, defineAsyncComponent } from "vue";
import { useGlobalProperties } from "@/composables/useGlobalProperties";

const uploadPicture = defineAsyncComponent(() =>
  import("../common/uploadPicture.vue")
);

const { $common, $confirm } = useGlobalProperties();

const ruleForm = ref(null);
const saveNoticeInput = ref(null);
const saveRandomNameInput = ref(null);
const saveRandomAvatarInput = ref(null);
const saveOtherPhotoInput = ref(null);

// 控制提示框是否能被选中
const disabled = ref(true);
// 控制随机名称的按钮背景色
const types = ref(["", "success", "info", "danger", "warning"]);
// 控制+公告按钮的出现或者隐藏
const inputNoticeVisible = ref(false);
const inputNoticeValue = ref("");
// 控制+随机名称按钮的出现或者隐藏
const inputRandomNameVisible = ref(false);
const inputRandomNameValue = ref("");
// 控制+随机头像按钮的出现或者隐藏
const inputRandomAvatarVisible = ref(false);
const inputRandomAvatarValue = ref("");
// 控制+其他图片按钮的出现或者隐藏
const inputOtherPhotoVisible = ref(false);
const inputOtherPhotoValue = ref("");
const webInfo = ref({
  id: null,
  webName: "",
  webTitle: "",
  footer: "",
  backgroundImage: "",
  avatar: "",
  // 提示
  waifuJson: "",
  status: false,
});
// 公告
const notices = ref([]);
const randomAvatar = ref([]);
const randomName = ref([]);
const otherPhoto = ref([]);
const rules = ref({
  webName: [
    { required: true, message: "请输入网站名称", trigger: "blur" },
    {
      min: 1,
      max: 12,
      message: "长度在 1 到 12 个字符",
      trigger: "change",
    },
  ],
  webTitle: [{ required: true, message: "请输入网站标题", trigger: "blur" }],
  footer: [{ required: true, message: "请输入页脚", trigger: "blur" }],
  backgroundImage: [
    { required: true, message: "请输入背景", trigger: "change" },
  ],
  status: [{ required: true, message: "请设置网站状态", trigger: "change" }],
  avatar: [{ required: true, message: "请上传头像", trigger: "change" }],
});

onMounted(() => {
  getWebInfo();
});

// 接收传过来的url
const addBackgroundImage = (res) => {
  webInfo.value.backgroundImage = res;
};

const addAvatar = (res) => {
  webInfo.value.avatar = res;
};

const addRandomAvatar = (res) => {
  randomAvatar.value.push(res);
};

const addOtherPhoto = (res) => {
  otherPhoto.value.push(res);
};

const changeWebStatus = async (webInfoItem) => {
  try {
    await api.updateAdminWebInfo({
      id: webInfoItem.id,
      status: webInfoItem.status,
    });
    notifySuccess("保存成功！");
  } catch (error) {
    console.log(error);
  }
};

const getWebInfo = async () => {
  try {
    const response = await api.getAdminWebInfo();
    if (!$common.isEmpty(response.result[0].data[0])) {
      const res = response.result[0].data[0];
      webInfo.value.id = res.id;
      webInfo.value.webName = res.webName;
      webInfo.value.webTitle = res.webTitle;
      webInfo.value.footer = res.footer;
      webInfo.value.backgroundImage = res.backgroundImage;
      webInfo.value.avatar = res.avatar;
      webInfo.value.waifuJson = res.waifuJson;
      webInfo.value.status = res.status;
      notices.value = JSON.parse(res.notices);
      if (!res.randomAvatar) {
        randomAvatar.value = [];
      } else {
        randomAvatar.value = JSON.parse(res.randomAvatar);
      }
      if (!res.randomName) {
        randomName.value = [];
      } else {
        randomName.value = JSON.parse(res.randomName);
      }
      if (!res.randomCover) {
        otherPhoto.value = [];
      } else {
        otherPhoto.value = JSON.parse(res.randomCover);
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const submitForm = (formName) => {
  if (ruleForm.value) {
    ruleForm.value.validate((valid) => {
      if (valid) {
        updateWebInfo(webInfo.value);
      } else {
        notifyError("请完善必填项！");
      }
    });
  }
};

const resetForm = (formName) => {
  if (ruleForm.value) {
    ruleForm.value.resetFields();
  }
  getWebInfo();
};

const handleClose = (array, item) => {
  const index = array.indexOf(item);
  if (index > -1) {
    array.splice(index, 1);
  }
};

const handleInputNoticeConfirm = () => {
  if (inputNoticeValue.value) {
    notices.value.push(inputNoticeValue.value);
  }
  inputNoticeVisible.value = false;
  inputNoticeValue.value = "";
};

const showNoticeInput = () => {
  inputNoticeVisible.value = true;
  nextTick(() => {
    if (saveNoticeInput.value) {
      saveNoticeInput.value.focus();
    }
  });
};

const saveNotice = () => {
  const param = {
    id: webInfo.value.id,
    notices: JSON.stringify(notices.value),
  };
  updateWebInfo(param);
};

const handleInputRandomNameConfirm = () => {
  if (inputRandomNameValue.value) {
    randomName.value.push(inputRandomNameValue.value);
  }
  inputRandomNameVisible.value = false;
  inputRandomNameValue.value = "";
};

const showRandomNameInput = () => {
  inputRandomNameVisible.value = true;
  nextTick(() => {
    if (saveRandomNameInput.value) {
      saveRandomNameInput.value.focus();
    }
  });
};

const saveRandomName = () => {
  const param = {
    id: webInfo.value.id,
    randomName: JSON.stringify(randomName.value),
  };
  updateWebInfo(param);
};

const handleInputRandomAvatarConfirm = () => {
  if (inputRandomAvatarValue.value) {
    randomAvatar.value.push(inputRandomAvatarValue.value);
  }
  inputRandomAvatarVisible.value = false;
  inputRandomAvatarValue.value = "";
};

const showRandomAvatarInput = () => {
  inputRandomAvatarVisible.value = true;
  nextTick(() => {
    if (saveRandomAvatarInput.value) {
      saveRandomAvatarInput.value.focus();
    }
  });
};

const saveRandomAvatar = () => {
  const param = {
    id: webInfo.value.id,
    randomAvatar: JSON.stringify(randomAvatar.value),
  };
  updateWebInfo(param);
};

const handleInputOtherPhotoConfirm = () => {
  if (inputOtherPhotoValue.value) {
    otherPhoto.value.push(inputOtherPhotoValue.value);
  }
  inputOtherPhotoVisible.value = false;
  inputOtherPhotoValue.value = "";
};

const showOtherPhotoInput = () => {
  inputOtherPhotoVisible.value = true;
  nextTick(() => {
    if (saveOtherPhotoInput.value) {
      saveOtherPhotoInput.value.focus();
    }
  });
};

const saveOtherPhoto = () => {
  const param = {
    id: webInfo.value.id,
    randomCover: JSON.stringify(otherPhoto.value),
  };
  updateWebInfo(param);
};

const updateWebInfo = (value) => {
  $confirm("确认保存？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
    center: true,
  })
    .then(async () => {
      try {
        await api.updateAdminWebInfo(value);
        notifySuccess("保存成功！");
      } catch (error) {
        console.log(error);
      }
    })
    .catch(() => {
      notifySuccess("已取消保存！");
    });
};
</script>
<style lang="scss" scoped>
.web-edit-container {
  .admin-title-tag {
    .admin-title-tag-img {
      vertical-align: -3px;
    }
  }

  .web-edit-container-item {
    .web-edit {
      display: flex;

      &.web-edit-cover {
        margin-bottom: 10px;
      }

      .admin-image-thumb {
        margin-left: 10px;
      }

      .edit-icon {
        margin-left: 10px;
        font-size: 18px;
        font-weight: bold;
        color: var(--maxLightRed);
      }

      .web-edit-item {
        white-space: normal;
        height: unset;
      }

      .web-edit-item-image {
        .admin-image-thumb {
          margin: 10px;
        }
      }
    }

    .web-edit-container-item-upload-picture {
      margin-top: 10px;
    }

    .web-edit-container-item-button-wrap {
      margin-top: 10px;

      &.web-edit-container-item-button-wrap-last {
        margin-bottom: 40px;
      }
    }

    .button-new-tag {
      height: 32px;
      line-height: 32px;
      padding-top: 0;
      padding-bottom: 0;
      margin: 0 10px;

      &:hover {
        background-color: var(--green2);
        border-color: var(--green2);
        color: var(--white);
      }
    }

    .input-new-tag {
      width: 200px;
      margin: 0 10px;
      height: 32px;

      :deep(.el-input__wrapper.is-focus) {
        box-shadow: 0 0 0 1px var(--green2) inset;
      }
    }
  }
}
</style>
