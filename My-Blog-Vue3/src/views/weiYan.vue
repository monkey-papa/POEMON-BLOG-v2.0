<template>
  <div class="weiYan-container">
    <div
      style="animation: header-effect 2s"
      :style="{ background: `${changeBgState}` }"
      class="background-image background-image-changeBg"
    ></div>
    <!-- 两句诗 -->
    <div class="my-animation-slide-top">
      <twoPoem :isHitokoto="false" />
    </div>
    <div class="weiYan-content">
      <div>
        <treeHole
          :treeHoleList="treeHoleList"
          :avatar="
            !$common.isEmpty(currentUser) ? currentUser.avatar : webInfo.avatar
          "
          @launch="launch"
          @deleteTreeHole="deleteTreeHole"
        />
        <proPage
          :current="pagination.current"
          :size="pagination.size"
          :total="pagination.total"
          :buttonSize="3"
          :color="$constant?.commentPageColor"
          @toPage="toPage"
        />
      </div>
    </div>
    <el-dialog
      title="微言"
      v-model="weiYanDialogVisible"
      width="40%"
      :before-close="handleClose"
      :append-to-body="true"
      destroy-on-close
      center
      class="weiYan-dialog custom-my-dialog"
    >
      <div>
        <div class="weiYan-dialog-content myCenter">
          <el-radio-group v-model="isPublic">
            <el-radio-button :label="true">公开</el-radio-button>
            <el-radio-button :label="false">私密</el-radio-button>
          </el-radio-group>
        </div>
        <commentBox :disableGraffiti="true" @submitComment="submitWeiYan" />
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { notifySuccess } from "@/utils/notify";
import api from "@/api";
import { ref, onMounted, nextTick, computed } from "vue";
import { defineAsyncComponent } from "vue";
import { useGlobalProperties } from "@/composables/useGlobalProperties";
import { useFormValidation } from "@/composables/useFormValidation";

const twoPoem = defineAsyncComponent(() => import("./common/twoPoem.vue"));
const treeHole = defineAsyncComponent(() => import("./common/treeHole.vue"));
const proPage = defineAsyncComponent(() => import("./common/proPage.vue"));
const commentBox = defineAsyncComponent(() =>
  import("./common/commentBox.vue")
);

import { useStore } from "@/stores";

const store = useStore();
const { $constant, $common, $confirm } = useGlobalProperties();
const { validateLogin } = useFormValidation();

const currentUser = computed(() => store.currentUser);
const changeBgState = computed(() => store.changeBg);
const webInfo = computed(() => store.webInfo);

const treeHoleList = ref([]);
const pagination = ref({
  current: 1,
  size: 10,
  total: 0,
  userId: currentUser.value.id || null,
});
const weiYanDialogVisible = ref(false);
const isPublic = ref(true);
const showFooter = ref(false);

onMounted(() => {
  getWeiYan();
});

const toPage = (page) => {
  pagination.value.current = page;
  window.scrollTo({
    top: 240,
    behavior: "smooth",
  });
  getWeiYan();
};

const launch = () => {
  if (!validateLogin(currentUser.value, $common.isEmpty)) return;
  weiYanDialogVisible.value = true;
};

const handleClose = () => {
  weiYanDialogVisible.value = false;
};

const submitWeiYan = async (content) => {
  const weiYan = {
    content,
    isPublic: isPublic.value,
    userId: currentUser.value.id,
  };

  try {
    await api.saveWeiYan(weiYan);
    getWeiYan();
  } catch (error) {
    console.log(error);
  }
  handleClose();
};

const deleteTreeHole = async (id) => {
  if (!validateLogin(currentUser.value, $common.isEmpty)) return;

  try {
    await $confirm("确认删除？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
      center: true,
    });

    await api.deleteWeiYan(id);
    notifySuccess("删除成功！");
    pagination.value.current = 1;
    getWeiYan();
  } catch (error) {
    if (error === "cancel") {
      notifySuccess("已取消删除！");
    }
    console.log(error);
  }
};

const getWeiYan = async () => {
  try {
    const res = await api.getWeiYanList(pagination.value);
    showFooter.value = false;
    if (!$common.isEmpty(res.result[0])) {
      res.result[0].records.forEach((c) => {
        c.content = c.content.replace(
          /\n{2,}/g,
          '<div style="height: 12px"></div>'
        );
        c.content = c.content.replace(/\n/g, "<br/>");
        c.content = $common.faceReg(c.content);
        c.content = $common.pictureReg(c.content);
      });
      treeHoleList.value = res.result[0].records;
      pagination.value.total = res.result[0].total;
    }
    nextTick(() => {
      showFooter.value = true;
    });
  } catch (error) {
    console.log(error);
  }
};
</script>

<style lang="scss">
.weiYan-dialog {
  .weiYan-dialog-content {
    padding-bottom: 20px;
  }
}
</style>
<style lang="scss" scoped>
.weiYan-container {
  .weiYan-content {
    background: var(--background);
    animation: hideToShow 2.5s;
  }
}
</style>
