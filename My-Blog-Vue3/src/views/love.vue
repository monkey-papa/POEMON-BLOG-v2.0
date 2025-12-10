<template>
  <div class="love-container">
    <!-- 顶部封面 -->
    <div class="bg-wrap my-animation-slide-top">
      <!-- 背景图片 -->
      <el-image
        class="love-image custom-el-image"
        lazy
        :src="love.bgCover"
        fit="cover"
      >
        <template v-slot:error>
          <div class="image-slot"></div>
        </template>
      </el-image>
      <!-- 对象 -->
      <div class="love-wrap transformCenter mySpaceAround">
        <div>
          <el-avatar class="love-avatar" :src="love.manCover" />
          <div class="love-title">
            {{ love.manName }}
          </div>
        </div>
        <div>
          <img class="love-img" src="../assets/file/heart.png" alt="心心" />
        </div>
        <div>
          <el-avatar class="love-avatar" :src="love.womanCover" />
          <div class="love-title">
            {{ love.womanName }}
          </div>
        </div>
      </div>
    </div>
    <!-- 内容 -->
    <div>
      <div class="myCenter love-content">
        <!-- 时间 -->
        <div>
          <!-- 计时 -->
          <div>
            <div class="love-time-title">这是我们一起走过的</div>
            <div class="love-time">
              第
              <span class="love-time-item">{{ timing.year }}</span>
              年
              <span class="love-time-item">{{ timing.month }}</span>
              月
              <span class="love-time-item">{{ timing.day }}</span>
              日
              <span class="love-time-item">{{ timing.hour }}</span>
              时
              <span class="love-time-item">{{ timing.minute }}</span>
              分
              <span class="love-time-item">{{ timing.second }}</span>
              秒
            </div>
          </div>
          <!-- 倒计时 -->
          <div
            class="love-time-countdown"
            v-if="
              !$common.isEmpty(love.countdownTitle) ||
              !$common.isEmpty(love.countdownTime)
            "
          >
            下个{{ love.countdownTitle }}: 还有{{ countdownChange }}
          </div>
        </div>
      </div>
      <div class="family-button-wrap">
        <div class="family-button shadow-box-mini" @click="changeCard(4)">
          <span class="family-button-title">{{
            card === 4 ? "回到主人家" : "开往表白墙"
          }}</span>
          <span class="family-button-car">
            <img src="../assets/svg/car.svg" />
          </span>
        </div>
      </div>
      <div class="card-wrap-wrap">
        <!-- 卡片 -->
        <div class="card-wrap" v-show="card !== 4">
          <div
            :class="{ Active: card === 2 }"
            class="card-content shadow-box-mini"
            @click="changeCard(2)"
          >
            <div>
              <el-avatar :size="100" :src="love1" />
            </div>
            <div class="card-right">
              <div class="card-title">时光相册</div>
              <div class="card-desc">📸记录美好瞬间</div>
            </div>
          </div>
          <div
            :class="{ Active: card === 1 }"
            class="card-content shadow-box-mini"
            @click="changeCard(1)"
          >
            <div>
              <el-avatar :size="100" :src="love2" />
            </div>
            <div class="card-right">
              <div class="card-title">点点滴滴</div>
              <div class="card-desc">☀️今朝有酒今朝醉</div>
            </div>
          </div>
          <div
            :class="{ Active: card === 3 }"
            class="card-content shadow-box-mini"
            @click="changeCard(3)"
          >
            <div>
              <el-avatar :size="100" :src="love3" />
            </div>
            <div class="card-right">
              <div class="card-title">祝福板</div>
              <div class="card-desc">📋写下对我们的祝福</div>
            </div>
          </div>
        </div>
        <div class="card-container">
          <div v-show="card === 1 && !$common.isEmpty(treeHoleList)">
            <treeHole
              :treeHoleList="treeHoleList"
              :avatar="webInfo.avatar"
              @launch="launch"
              @deleteTreeHole="deleteTreeHole"
            />
          </div>
          <div v-show="card === 2 && !$common.isEmpty(photoTitleList)">
            <!-- 标签 -->
            <div
              class="photo-title-warp"
              v-if="!$common.isEmpty(photoTitleList)"
            >
              <div
                v-for="(item, index) in photoTitleList"
                :key="index"
                :class="{
                  isActive: photoPagination.classify === item.classify,
                }"
                @click="changePhotoTitle(item.classify)"
              >
                <proTag
                  :info="item.classify + ' ' + item.count"
                  :color="$constant.tree_hole_color[item.colorIndex || 0]"
                />
              </div>
              <div
                class="article-info-news"
                @click="addPhoto"
                v-if="
                  !$common.isEmpty(currentUser) &&
                  (currentUser.userType === 0 || currentUser.userType === 1)
                "
              >
                <img src="../assets/svg/plus.svg" />
              </div>
            </div>
            <div class="photo-title">
              {{ photoPagination.classify }}
            </div>
            <photo :resourcePathList="photoList" />
            <div class="pagination-wrap">
              <div
                @click="pagePhotos()"
                class="pagination"
                v-if="photoPagination.total > photoList.length"
              >
                下一页
              </div>
              <div class="pagination-end" v-else>~~( •̀ ω •́ )y 到底啦~~</div>
            </div>
          </div>
          <div v-show="card === 3" class="comment-content">
            <comment :source="1" :type="'love'" />
          </div>
        </div>
        <div v-show="card === 4">
          <div class="family-container" v-show="!$common.isEmpty(randomFamily)">
            <div
              v-for="(item, index) in randomFamily"
              :key="index"
              @click="changeFamily(item)"
            >
              <div
                class="family-wrap"
                :style="{
                  background:
                    'url(' + item.bgCover + ') center center / cover no-repeat',
                }"
              >
                <div class="family-avatar-wrap">
                  <el-avatar class="family-avatar" :src="item.manCover" />
                  <div class="family-title">
                    {{ item.manName }}
                  </div>
                </div>
                <div>
                  <img
                    class="family-img"
                    src="../assets/file/heart.png"
                    alt="心心"
                  />
                </div>
                <div class="family-avatar-wrap">
                  <el-avatar class="family-avatar" :src="item.womanCover" />
                  <div class="family-title">
                    {{ item.womanName }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="family-bottom-wrap">
            <div
              v-show="!$common.isEmpty(randomFamily) && randomFamily.length > 5"
              class="family-bottom"
              @click="getRandomFamily()"
            >
              <span class="family-bottom-title"> 换一换 </span>
              <span class="family-bottom-icon">
                <img src="../assets/svg/change.svg" />
              </span>
            </div>
            <div class="family-bottom shadow-box" @click="loveDialog()">
              <span class="family-bottom-title"> 申请入住 </span>
              <span class="family-bottom-icon">
                <img src="../assets/svg/loves.svg" />
              </span>
            </div>
          </div>
        </div>
      </div>
      <!-- 入住 -->
      <el-dialog
        class="custom-my-dialog love-dialog"
        title="入住表白墙"
        v-model="loveDialogVisible"
        width="50%"
        :append-to-body="true"
        destroy-on-close
        center
      >
        <div>
          <div class="form-main">
            <img
              class="love-dialog-img"
              src="../assets/file/friend_chain_bg.jpg"
            />
            <div class="love-dialog-content">
              <div class="love-dialog-form">
                <div class="myCenter form-friend">
                  <div class="user-content">
                    <div class="love-dialog-form-item">
                      <div class="form-title">背景封面&nbsp;</div>
                      <div class="form-input-wrap">
                        <el-input maxlength="120" v-model="userLove.bgCover" />
                        <div class="form-button-wrap">
                          <proButton
                            :info="'上传背景'"
                            @click="openPicture('bgCover')"
                            :before="$constant.before_color_1"
                            :after="$constant.after_color_1"
                          />
                        </div>
                      </div>
                    </div>
                    <div class="love-dialog-form-item">
                      <div class="form-title">男生头像&nbsp;</div>
                      <div class="form-input-wrap">
                        <el-input maxlength="120" v-model="userLove.manCover" />
                        <div class="form-button-wrap">
                          <proButton
                            :info="'上传头像'"
                            @click="openPicture('manCover')"
                            :before="$constant.before_color_1"
                            :after="$constant.after_color_1"
                          />
                        </div>
                      </div>
                    </div>
                    <div class="love-dialog-form-item">
                      <div class="form-title">女生头像&nbsp;</div>
                      <div class="form-input-wrap">
                        <el-input
                          maxlength="120"
                          v-model="userLove.womanCover"
                        />
                        <div class="form-button-wrap">
                          <proButton
                            :info="'上传头像'"
                            @click="openPicture('womanCover')"
                            :before="$constant.before_color_1"
                            :after="$constant.after_color_1"
                          />
                        </div>
                      </div>
                    </div>
                    <div class="love-dialog-form-item">
                      <div class="form-title">男生昵称&nbsp;</div>
                      <div>
                        <el-input maxlength="10" v-model="userLove.manName" />
                      </div>
                    </div>
                    <div class="love-dialog-form-item">
                      <div class="form-title">女生昵称&nbsp;</div>
                      <div>
                        <el-input maxlength="10" v-model="userLove.womanName" />
                      </div>
                    </div>
                    <div class="love-dialog-form-item">
                      <div class="form-title">计时时间&nbsp;</div>
                      <div>
                        <el-date-picker
                          v-model="userLove.timing"
                          value-format="YYYY-MM-DD HH:mm:ss"
                          format="YYYY-MM-DD HH:mm:ss"
                          type="datetime"
                          placeholder="选择计时时间"
                        />
                      </div>
                    </div>
                    <div class="love-dialog-form-item">
                      <div class="form-title">倒计时标题</div>
                      <div>
                        <el-input
                          maxlength="20"
                          v-model="userLove.countdownTitle"
                        />
                      </div>
                    </div>
                    <div class="love-dialog-form-item">
                      <div class="form-title">倒计时时间</div>
                      <div>
                        <el-date-picker
                          v-model="userLove.countdownTime"
                          value-format="YYYY-MM-DD HH:mm:ss"
                          format="YYYY-MM-DD HH:mm:ss"
                          type="datetime"
                          placeholder="选择倒计时时间"
                        />
                      </div>
                    </div>
                    <div class="love-dialog-form-item">
                      <div class="form-title">告白信&nbsp;&nbsp;</div>
                      <div>
                        <el-input
                          type="textarea"
                          show-word-limit
                          maxlength="1000"
                          v-model="userLove.familyInfo"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="myCenter submit-button-wrap">
                  <proButton
                    :info="'提交'"
                    @click.stop="submitLove()"
                    :before="$constant.before_color_1"
                    :after="$constant.after_color_1"
                  />
                </div>
              </div>
              <div class="love-dialog-footer">
                <img src="../assets/file/letter-3.jpg" />
              </div>
              <p class="love-dialog-footer-text">欢迎入住表白墙</p>
            </div>
          </div>
        </div>
      </el-dialog>
      <el-dialog
        class="custom-my-dialog"
        title="图片"
        v-model="addPictureDialog"
        width="25%"
        :append-to-body="true"
        destroy-on-close
        center
      >
        <div>
          <uploadPicture
            :ResourceType="ResourceType"
            @addPicture="addPicture"
            :maxSize="10"
            :maxNumber="1"
          />
        </div>
      </el-dialog>
      <el-dialog
        class="custom-my-dialog add-resource-path-dialog"
        title="添加图片"
        v-model="addResourcePathDialog"
        width="50%"
        :before-close="clearDialog"
        :append-to-body="true"
        center
      >
        <div class="add-resource-path-content">
          <div class="add-resource-path-form">
            <div class="add-resource-path-form-title">标题：</div>
            <el-input maxlength="60" v-model="resourcePath.title" />
            <div class="add-resource-path-form-classify">分类：</div>
            <el-select
              @blur="closeOptions"
              ref="fuzzyCommentType"
              v-model="resourcePath.classify"
              filterable
              allow-create
              default-first-option
              placeholder="请选择分类"
            >
              <el-option
                v-for="item in photoTitleList"
                :key="item.classify"
                :label="item.classify"
                :value="item.classify"
              />
            </el-select>
            <div class="add-resource-path-form-cover">封面：</div>
            <div class="add-resource-path-form-cover-input">
              <el-input v-model="resourcePath.cover" />
              <div class="add-resource-path-form-cover-button-wrap">
                <proButton
                  :info="'上传封面'"
                  @click="addResourcePathCover()"
                  :before="$constant.before_color_1"
                  :after="$constant.after_color_1"
                />
              </div>
            </div>
          </div>
          <div class="add-resource-path-button-wrap myCenter">
            <proButton
              :info="'提交'"
              @click="addResourcePath()"
              :before="$constant.before_color_1"
              :after="$constant.after_color_1"
            />
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script setup>
import {
  ref,
  onMounted,
  onBeforeUnmount,
  defineAsyncComponent,
  computed,
} from "vue";
import { onBeforeRouteLeave } from "vue-router";
import { useGlobalProperties } from "@/composables/useGlobalProperties";
import love1 from "../assets/file/love1.jpg";
import love2 from "../assets/file/love2.jpg";
import love3 from "../assets/file/love3.png";

const treeHole = defineAsyncComponent(() => import("./common/treeHole.vue"));
const comment = defineAsyncComponent(() => import("./common/comment.vue"));
const photo = defineAsyncComponent(() => import("./common/photo.vue"));
const proTag = defineAsyncComponent(() => import("./common/proTag.vue"));
const proButton = defineAsyncComponent(() => import("./common/proButton.vue"));
const uploadPicture = defineAsyncComponent(() =>
  import("./common/uploadPicture.vue")
);

import { useStore } from "@/stores";
import { notifySuccess, notifyError, notifyWarning } from "@/utils/notify";
import { useFormValidation } from "@/composables/useFormValidation";
import api from "@/api";

const store = useStore();
const { $common, $constant, $confirm } = useGlobalProperties();
const { validateRequiredWarn, validateLogin } = useFormValidation();

const webInfo = computed(() => store.webInfo);
const currentUser = computed(() => store.currentUser);
const ResourceType = computed(() => {
  if (pictureType.value === "bgCover") {
    return "love/bgCover";
  } else if (pictureType.value === "manCover") {
    return "love/manCover";
  } else if (pictureType.value === "womanCover") {
    return "love/womanCover";
  } else if (pictureType.value === "lovePhoto") {
    return "lovePhoto";
  }
  return "";
});

const fuzzyCommentType = ref(null);

const userLove = ref({
  bgCover: "",
  manCover: "",
  womanCover: "",
  manName: "",
  womanName: "",
  countdownTitle: "",
  countdownTime: "",
  timing: "",
  familyInfo: "",
  userId: currentUser.value.id,
});
const loveDialogVisible = ref(false);
const addPictureDialog = ref(false);
const pictureType = ref("");
const adminLove = ref({});
const love = ref({
  bgCover: "",
  manCover: "",
  womanCover: "",
  manName: "",
  womanName: "",
  countdownTitle: "",
  countdownTime: "",
  timing: "",
});
const weiYanPagination = ref({
  current: 1,
  size: 10,
  total: 0,
  userId: null,
});
const photoPagination = ref({
  current: 1,
  size: 10,
  total: 0,
  resourceType: "lovePhoto",
  classify: "",
});
const treeHoleList = ref([]);
const photoTitleList = ref([]);
const photoList = ref([]);
const randomFamily = ref([]);
const card = ref(null);
const countdownChange = ref("");
const timing = ref({
  year: 0,
  month: 0,
  day: 0,
  hour: 0,
  minute: 0,
  second: 0,
});
const addResourcePathDialog = ref(false);
const resourcePath = ref({
  title: "",
  classify: "",
  cover: "",
  type: "lovePhoto", // 固定值
});
let loveTimer = null;

onMounted(() => {
  getAdminFamily();
  card.value = 2;
  getPhotoTitles();
});

onBeforeUnmount(() => {
  if (loveTimer) {
    clearInterval(loveTimer);
    loveTimer = null;
  }
});

onBeforeRouteLeave(() => {
  const root = document.querySelector(":root");
  if (root) {
    root.style.setProperty("--background", "var(--background1)");
  }
});

const closeOptions = () => {
  fuzzyCommentType.value?.blur();
};

const addResourcePath = async () => {
  if (
    $common.isEmpty(resourcePath.value.title) ||
    $common.isEmpty(resourcePath.value.classify) ||
    $common.isEmpty(resourcePath.value.cover)
  ) {
    notifyError("标题、分类、封面不能为空！");
    return;
  }

  try {
    await api.saveResourcePath(resourcePath.value, false);
    notifySuccess("保存成功！");
    clearDialog();
    getPhotoTitles("1");
  } catch (error) {
    console.log(error);
  }
};

const addResourcePathCover = () => {
  addPictureDialog.value = true;
};

const clearDialog = () => {
  resourcePath.value = {
    title: "",
    classify: "",
    cover: "",
    type: "lovePhoto", // 固定值
  };
  pictureType.value = "";
  addResourcePathDialog.value = false;
};

const addPhoto = () => {
  pictureType.value = "lovePhoto";
  addResourcePathDialog.value = true;
};

const openPicture = (type) => {
  pictureType.value = type;
  addPictureDialog.value = true;
};

const addPicture = (res) => {
  if (pictureType.value === "bgCover") {
    userLove.value.bgCover = res;
  } else if (pictureType.value === "manCover") {
    userLove.value.manCover = res;
  } else if (pictureType.value === "womanCover") {
    userLove.value.womanCover = res;
  } else if (pictureType.value === "lovePhoto") {
    resourcePath.value.cover = res;
  }
  pictureType.value = "";
  addPictureDialog.value = false;
};
const submitLove = async () => {
  if (
    !validateRequiredWarn({
      [userLove.value.bgCover]: "设置背景封面",
      [userLove.value.manCover]: "设置男生头像",
      [userLove.value.womanCover]: "设置女生头像",
      [userLove.value.manName]: "写男生昵称",
      [userLove.value.womanName]: "写女生昵称",
      [userLove.value.timing]: "设置计时时间",
    })
  ) {
    return;
  }

  try {
    await api.addFamily(userLove.value);
    notifySuccess("提交成功，待管理员审核！");
    userLove.value = {
      bgCover: "",
      manCover: "",
      womanCover: "",
      manName: "",
      womanName: "",
      countdownTitle: "",
      countdownTime: "",
      timing: "",
      familyInfo: "",
      userId: currentUser.value.id,
    };
    loveDialogVisible.value = false;
  } catch (error) {
    console.log(error);
  }
};

const loveDialog = () => {
  if (!validateLogin(currentUser.value, $common.isEmpty)) return;
  loveDialogVisible.value = true;
};

const changeFamily = (family) => {
  love.value = family;
};
const getPhotoTitles = async (val) => {
  try {
    const res = await api.getClassifyList({ type: "lovePhoto" });
    if (!$common.isEmpty(res.result[0])) {
      // 为每个 item 分配固定的随机颜色索引
      photoTitleList.value = res.result[0].data.map((item) => ({
        ...item,
        colorIndex: Math.floor(Math.random() * 6),
      }));
      photoPagination.value = {
        current: 1,
        size: 10,
        total: 0,
        resourceType: "lovePhoto",
        classify: photoTitleList.value[0]?.classify,
      };
      changePhoto(val);
    }
  } catch (error) {
    console.log(error);
  }
};

const getAdminFamily = async () => {
  try {
    const res = await api.getAdminFamily();
    if (!$common.isEmpty(res.result[0]?.data)) {
      love.value = res.result[0].data[0];
      adminLove.value = res.result[0].data[0];
      getLove();
      countdown();
      // 清理之前的定时器
      if (loveTimer) {
        clearInterval(loveTimer);
      }
      loveTimer = setInterval(() => {
        getLove();
        countdown();
      }, 1000);
    }
  } catch (error) {
    console.log(error);
  }
};

const getRandomFamily = async () => {
  try {
    const res = await api.getRandomFamilyList();
    if (!$common.isEmpty(res.result[0])) {
      randomFamily.value = res.result[0].data;
    }
  } catch (error) {
    console.log(error);
  }
};

const changePhotoTitle = (classify) => {
  if (classify !== photoPagination.value.classify) {
    photoPagination.value = {
      current: 1,
      size: 10,
      total: 0,
      resourceType: "lovePhoto",
      classify,
    };
    photoList.value = [];
    changePhoto();
  }
};

const pagePhotos = () => {
  photoPagination.value.current = photoPagination.value.current + 1;
  changePhoto();
};

const changePhoto = async (val) => {
  try {
    const res = await api.getClientResourcePathList(photoPagination.value);
    if (!$common.isEmpty(res.result[0])) {
      photoList.value =
        val === "1"
          ? res.result[0].records
          : photoList.value.concat(res.result[0].records);
      photoPagination.value.total = res.result[0].total;
    }
  } catch (error) {
    console.log(error);
  }
};

const changeCard = (cardValue) => {
  if (cardValue !== 4 || card.value !== cardValue) {
    card.value = cardValue;
  } else {
    card.value = 1;
    love.value = adminLove.value;
  }
  if (cardValue === 1) {
    if ($common.isEmpty(treeHoleList.value)) {
      getWeiYan();
    }
  } else if (cardValue === 2) {
    if ($common.isEmpty(photoTitleList.value)) {
      getPhotoTitles();
    }
  } else if (cardValue === 4) {
    if ($common.isEmpty(randomFamily.value)) {
      getRandomFamily();
    }
  }
};

const getLove = () => {
  if ($common.isEmpty(love.value.timing)) {
    return;
  }
  const diff = $common.timeDiff(love.value.timing);
  timing.value.year = diff.diffYear;
  timing.value.month = diff.diffMonth;
  timing.value.day = diff.diffDay;
  timing.value.hour = diff.diffHour;
  timing.value.minute = diff.diffMinute;
  timing.value.second = diff.diffSecond;
};

// 倒计时
const countdown = () => {
  if ($common.isEmpty(love.value.countdownTime)) {
    return;
  }
  const countdownResult = $common.countdown(love.value.countdownTime);
  countdownChange.value =
    countdownResult.d +
    "天" +
    countdownResult.h +
    "时" +
    countdownResult.m +
    "分" +
    countdownResult.s +
    "秒";
};

const launch = () => {
  if (weiYanPagination.value.total !== treeHoleList.value.length) {
    weiYanPagination.value.current = weiYanPagination.value.current + 1;
    getWeiYan();
  } else {
    notifyWarning("~~到底啦~~");
  }
};

const getWeiYan = async () => {
  try {
    const res = await api.getWeiYanList(weiYanPagination.value);
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
      weiYanPagination.value.total = res.result[0].total;
    }
  } catch (error) {
    console.log(error);
  }
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
    notifySuccess("删除成功!");
    weiYanPagination.value.current = 1;
    getWeiYan();
  } catch (error) {
    if (error === "cancel") {
      notifySuccess("已取消删除!");
    }
    console.log(error);
  }
};
</script>
<style lang="scss">
.love-dialog {
  .form-main {
    animation: hideToShow 2s;
    border-radius: 12px;
    overflow: hidden;

    .love-dialog-img {
      width: 100%;
    }

    .love-dialog-content {
      .love-dialog-form {
        .form-friend {
          background-color: var(--favoriteBg);
          padding: 20px 0;

          .user-content {
            .love-dialog-form-item {
              height: 65px;
              display: flex;
              align-items: center;

              .form-title {
                margin: 10px;
                text-align: center;
                color: var(--fontColor);
              }

              .form-input-wrap {
                display: flex;
              }

              .form-button-wrap {
                margin: 3px 0 0 10px;
              }
            }
          }
        }

        .submit-button-wrap {
          margin-top: 20px;
        }
      }

      .love-dialog-footer {
        img {
          width: 100%;
          margin: 5px auto;
        }
      }

      .love-dialog-footer-text {
        text-align: center;
        font-size: 12px;
        color: var(--black5);
      }
    }
  }
}

.add-resource-path-dialog {
  .add-resource-path-content {
    .add-resource-path-form {
      .add-resource-path-form-title {
        margin-bottom: 5px;
      }

      .add-resource-path-form-classify,
      .add-resource-path-form-cover {
        margin-top: 10px;
        margin-bottom: 5px;
      }

      .add-resource-path-form-cover-input {
        display: flex;
        .add-resource-path-form-cover-button-wrap {
          width: 66px;
          margin: 3.5px 0 0 10px;
        }
      }
    }

    .add-resource-path-button-wrap {
      display: flex;
      margin-top: 30px;
    }
  }
}
</style>
<style lang="scss" scoped>
.love-container {
  background-image: linear-gradient(
      to right,
      var(--black12) 1px,
      var(--background) 1px
    ),
    linear-gradient(to bottom, var(--black12) 1px, var(--background) 1px);
  background-size: 3rem 3rem;

  // 背景包装
  .bg-wrap {
    height: 55vh;
    position: relative;
    overflow: hidden;

    .love-image {
      &::before {
        content: "";
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: var(--miniMask);
      }
    }

    .love-wrap {
      width: 90%;
      backdrop-filter: blur(10px);
      background: var(--whiteMask);
      max-width: 950px;
      border-radius: 3em;
      padding: 50px 70px 30px 70px;

      .love-avatar {
        border: var(--whiteMask) 4px solid;
        width: 180px;
        height: 180px;
        transition: all 0.3s ease;

        &:hover {
          border-color: var(--whiteMask1);
        }
      }

      .love-title {
        margin-top: 15px;
        text-align: center;
        font-size: 25px;
        font-weight: 700;
        color: var(--red1);
        transition: all 0.3s ease;

        &:hover {
          color: var(--red);
        }
      }

      .love-img {
        animation: imgScale 1.5s linear infinite;
        width: 120px;
        height: 120px;
      }
    }
  }

  .love-content {
    max-width: 1200px;
    overflow: hidden;
    margin: 0 auto;
    user-select: none;

    .love-time-title {
      font-size: 2rem;
      font-weight: 600;
      letter-spacing: 0.2rem;
      line-height: 4rem;
      text-align: center;
      background-image: linear-gradient(
        270deg,
        var(--orange6),
        var(--orange),
        var(--red4),
        var(--green5),
        var(--blue2),
        var(--blue1),
        var(--purple5),
        var(--red4),
        var(--orange6)
      );
      -webkit-background-clip: text;
      background-clip: text;
      animation: jianBian 60s linear infinite;
      width: 3000px;
      color: var(--transparent);
    }

    .love-time-countdown {
      color: var(--bigRed1);
      text-align: center;
      font-size: 1.5rem;
      line-height: 4rem;
      font-weight: 400;
      letter-spacing: 2px;
      transition: all 0.3s ease;

      &:hover {
        color: var(--bigRed);
      }
    }

    .love-time {
      color: var(--red1);
      text-align: center;
      font-size: 2rem;
      font-weight: 700;
      transition: all 0.3s ease;

      &:hover {
        color: var(--red);
      }

      &-item {
        font-size: 4rem;
        font-weight: 700;
      }
    }
  }

  .family-button-wrap {
    padding: 0 20px;
    .family-button {
      position: relative;
      overflow: hidden;
      height: 150px;
      margin: 50px auto 15px;
      border-radius: 20px;
      max-width: 350px;
      transition: all 0.3s;
      background: var(--rural) center center / cover no-repeat;
      user-select: none;
      border: 1px solid var(--gray1);

      &:hover {
        border-color: var(--gray4);
        transform: translateY(-6px);
      }

      &::before {
        content: "";
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: var(--miniMask);
      }

      &-title {
        position: absolute;
        line-height: 150px;
        margin-left: 20px;
        font-size: 25px;
        font-weight: 700;
        color: var(--red3);
        transition: all 0.3s ease;

        &:hover {
          color: var(--red);
        }
      }

      &-car {
        position: absolute;
        margin-left: 220px;
        margin-top: 55px;
        animation: passing 4s linear infinite;
      }
    }
  }

  .card-wrap-wrap {
    padding: 0 20px;
    .card-wrap {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: center;
      padding: 20px 0;

      .card-content {
        display: flex;
        padding: 25px;
        margin: 25px auto;
        border-radius: 20px;
        max-width: 780px;
        transition: all 0.3s;
        background: var(--background);
        transition: all 0.3s ease;
        border: 1px solid var(--gray1);

        &:hover {
          border-color: var(--gray4);
          transform: translateY(-6px);
        }

        &.Active {
          background-color: var(--pink);
          animation: loveScale 4s ease-in-out infinite;
        }

        .card-right {
          margin-left: 20px;

          .card-title {
            font-size: 1.6rem;
            letter-spacing: 0.2rem;
            line-height: 3.5rem;
            font-weight: 700;

            &:hover {
              color: var(--black8);
            }
          }

          .card-desc {
            font-size: 1.1rem;
            letter-spacing: 0.2rem;
            color: var(--black6);

            &:hover {
              color: var(--black8);
            }
          }
        }
      }
    }

    .card-container {
      max-width: 1500px;

      .pagination-wrap {
        display: flex;
        justify-content: center;
        margin-top: 40px;

        .pagination {
          padding: 13px 15px;
          border: 1px solid var(--red);
          border-radius: 3rem;
          color: var(--red);
          width: 100px;
          user-select: none;
          text-align: center;

          &:hover {
            border: 1px solid var(--blue);
            color: var(--orange);
            box-shadow: 0 0 5px var(--blue);
          }
        }

        .pagination-end {
          user-select: none;
          color: var(--red);
        }
      }

      .comment-content {
        max-width: 1000px;
        margin: 0 auto;
      }

      .photo-title {
        text-align: center;
        font-size: 30px;
        font-weight: 700;
        line-height: 80px;
        letter-spacing: 2px;
        color: var(--red);

        &-warp {
          max-width: 1150px;
          margin: 50px auto;
          padding: 20px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          flex-wrap: wrap;

          .article-info-news {
            height: 30px;
            animation: scale 1s ease-in-out infinite;
          }

          .isActive {
            animation: scale 2.5s ease-in-out infinite;
          }
        }
      }
    }

    .family-container {
      display: flex;
      justify-content: space-around;
      flex-wrap: wrap;
      margin-bottom: 40px;

      .family-wrap {
        border-radius: 20px;
        display: flex;
        align-items: flex-start;
        justify-content: space-around;
        padding: 15px 25px 5px 25px;
        margin: 20px 0;
        transition: all 0.3s;
        user-select: none;
        border: 1px solid var(--gray1);

        &:hover {
          border-color: var(--gray4);
          transform: translateY(-6px);
        }

        .family-avatar-wrap {
          width: 90px;

          .family-avatar {
            border: var(--whiteMask) 4px solid;
            width: 90px;
            height: 90px;
          }

          .family-title {
            margin-top: 15px;
            text-align: center;
            font-size: 15px;
            font-weight: 400;
            color: var(--red);
            display: -webkit-box;
            -webkit-box-orient: vertical;
            white-space: wrap;
            -webkit-line-clamp: 2;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }

        .family-img {
          animation: imgScale 2s linear infinite;
          width: 60px;
          height: 60px;
        }
      }
    }

    .family-bottom-wrap {
      padding-bottom: 40px;
      display: flex;
      justify-content: space-around;

      .family-bottom {
        color: var(--white1);
        border-radius: 3rem;
        width: 150px;
        text-align: center;
        height: 50px;
        user-select: none;
        background-color: var(--maxLightRed);

        &.shadow-box {
          background-color: var(--blue);
        }

        &-title {
          line-height: 50px;
        }

        &-icon {
          vertical-align: middle;
        }
      }
    }
  }
}

@keyframes loveScale {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.05);
  }

  100% {
    transform: scale(1);
  }
}

@media screen and (max-width: 1200px) {
  .love-dialog {
    .form-main {
      .love-dialog-content {
        .love-dialog-form {
          .form-friend {
            .user-content > div {
              display: unset;
              align-items: unset;
            }
          }
        }
      }
    }
  }
}

@media screen and (max-width: 1150px) {
  .love-container {
    .card-wrap-wrap {
      .card-wrap {
        display: unset;
      }

      .card-container {
        .photo-title-warp {
          max-width: 780px;
        }
      }
    }

    .family-button-wrap {
      .family-button {
        max-width: 780px;
      }
    }
  }
}

@media screen and (max-width: 800px) {
  .love-container {
    .bg-wrap {
      .love-wrap {
        border-radius: 1.5em;
        padding: 40px 30px 10px 30px;

        .love-avatar {
          width: 120px;
          height: 120px;
        }

        .love-img {
          width: 100px;
          height: 100px;
        }
      }
    }

    .love-content {
      .love-time {
        font-size: 1.4rem;

        &-item {
          font-size: 3rem;
        }
      }
    }
  }
}

@media screen and (max-width: 600px) {
  .love-container {
    .bg-wrap {
      .love-wrap {
        padding: 30px 20px 10px 20px;

        .love-avatar {
          width: 80px;
          height: 80px;
        }

        .love-img {
          width: 70px;
          height: 70px;
        }

        .love-title {
          font-size: 16px;
          white-space: wrap;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }

    .love-content {
      .love-time-item {
        font-size: 1rem;
      }

      .love-time-countdown {
        font-size: 0.8rem;
      }
    }

    .card-container {
      .tree-hole-container {
        padding: 0;
      }
    }
  }

  .love-dialog {
    .form-main {
      .love-dialog-content {
        .love-dialog-form {
          .form-friend {
            .user-content {
              :deep(.el-input__inner) {
                width: 190px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
