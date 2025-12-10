<template>
  <div class="user-container-warp">
    <!-- 登录和注册 -->
    <div
      v-if="$common.isEmpty(currentUser)"
      class="myCenter in-up-container my-animation-hideToShow"
    >
      <!-- 背景图片 -->
      <div
        style="animation: header-effect 2s"
        :style="{ background: `${changeBgState}` }"
        class="background-image background-image-changeBg"
      ></div>
      <div
        class="in-up"
        id="loginAndRegister"
        :class="{ 'right-panel-active': active }"
      >
        <div class="form-container sign-up-container">
          <div class="myCenter">
            <h1>注册</h1>
            <el-input
              v-model="username"
              type="text"
              maxlength="30"
              placeholder="用户名"
            />
            <el-input
              v-model="password"
              type="password"
              maxlength="30"
              placeholder="密码"
            />
            <el-input v-model="email" type="email" placeholder="邮箱" />
            <el-input
              v-model="code"
              type="text"
              placeholder="验证码"
              disabled
            />
            <a
              class="get-code-link"
              href="javascript:;"
              @click="changeDialog('邮箱验证码')"
              >获取验证码</a
            >
            <button @click="register()">注册</button>
          </div>
        </div>
        <div class="form-container sign-in-container">
          <div class="sign-in-content myCenter">
            <h1>登录</h1>
            <el-input v-model="account" type="text" placeholder="用户名/邮箱" />
            <el-input
              v-model="password"
              @keyup.enter="login()"
              type="password"
              placeholder="密码"
            />
            <a href="javascript:;" @click="changeDialog('找回密码')"
              >忘记密码？</a
            >
            <button @click="login()">登录</button>
          </div>
        </div>
        <div class="overlay-container">
          <div class="overlay">
            <div class="overlay-panel myCenter overlay-left">
              <h1>已有帐号？</h1>
              <p>请登录🚀</p>
              <button class="ghost" @click="signIn()">登录</button>
            </div>
            <div class="overlay-panel myCenter overlay-right">
              <h1>没有帐号？</h1>
              <p>立即注册吧😃</p>
              <button class="ghost" @click="signUp()">注册</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 已登录 用户信息 -->
    <div v-else class="user-container myCenter my-animation-hideToShow">
      <!-- 背景图片 -->
      <div
        style="animation: header-effect 2s"
        :style="{ background: `${changeBgState}` }"
        class="background-image background-image-changeBg"
      ></div>
      <div class="shadow-box-mini user-info">
        <div class="user-left">
          <div class="user-left-avatar">
            <p class="user-left-avatar-text">撮我替换头像 👉</p>
            <el-avatar
              class="user-avatar"
              @click="changeDialog('修改头像')"
              :size="60"
              :src="currentUser.avatar || webInfo.avatar"
            />
          </div>
          <div class="user-left-content myCenter">
            <div class="user-title">
              <div>用户名：</div>
              <div>手机号：</div>
              <div>邮箱：</div>
              <div>性别：</div>
              <div>简介：</div>
              <div v-if="storeCurrentUser.userType !== 2">七牛云域名：</div>
              <div v-if="storeCurrentUser.userType !== 2">七牛云访问密钥：</div>
              <div v-if="storeCurrentUser.userType !== 2">七牛云秘密秘钥：</div>
              <div v-if="storeCurrentUser.userType !== 2">七牛云文件夹：</div>
            </div>
            <div class="user-content">
              <div class="user-content-item">
                <el-input maxlength="30" v-model="currentUser.username" />
              </div>
              <div class="user-content-item">
                <div class="user-content-item-input">
                  <el-input maxlength="11" v-model="currentUser.phoneNumber" />
                </div>
                <div v-if="$common.isEmpty(currentUser.phoneNumber)">
                  <span class="changeInfo">输入手机号</span>
                </div>
              </div>
              <div class="user-content-item">
                <div v-if="!$common.isEmpty(currentUser.email)">
                  <span class="user-content-item-email">{{
                    currentUser.email
                  }}</span>
                  <span class="changeInfo" @click="changeDialog('修改邮箱')"
                    >修改</span
                  >
                </div>
              </div>
              <div class="user-content-item">
                <el-radio-group
                  class="mk-radio__group"
                  v-model="currentUser.gender"
                >
                  <el-radio class="user-content-item-radio" :label="0"
                    >薛定谔的猫</el-radio
                  >
                  <el-radio class="user-content-item-radio" :label="1"
                    >男</el-radio
                  >
                  <el-radio :label="2">女</el-radio>
                </el-radio-group>
              </div>
              <div class="user-content-item">
                <el-input
                  v-model="currentUser.introduction"
                  maxlength="60"
                  type="textarea"
                  show-word-limit
                />
              </div>
              <div v-if="storeCurrentUser.userType !== 2">
                <el-input v-model="currentUser.qiniuDomain" maxlength="128" />
              </div>
              <div v-if="storeCurrentUser.userType !== 2">
                <el-input
                  v-model="currentUser.qiniuAccessKey"
                  maxlength="128"
                />
              </div>
              <div v-if="storeCurrentUser.userType !== 2">
                <el-input
                  v-model="currentUser.qiniuSecretKey"
                  maxlength="128"
                />
              </div>
              <div v-if="storeCurrentUser.userType !== 2">
                <el-input
                  v-model="currentUser.qiniuBucketName"
                  maxlength="128"
                />
              </div>
            </div>
          </div>
          <div class="submit-button">
            <proButton
              :info="'提交'"
              @click="submitUserInfo()"
              :before="$constant.before_color_1"
              :after="$constant.after_color_1"
            />
          </div>
        </div>
        <div class="user-right"></div>
      </div>
    </div>

    <el-dialog
      :title="dialogTitle"
      v-model="showDialog"
      width="30%"
      :before-close="clearDialog"
      :append-to-body="true"
      :close-on-click-modal="false"
      center
      class="user-dialog custom-my-dialog"
    >
      <div class="dialog-content myCenter">
        <div class="dialog-content-item">
          <div v-if="dialogTitle === '修改邮箱'">
            <div class="dialog-content-item-email">邮箱：</div>
            <el-input v-model="email" />
            <div class="dialog-content-item-code">验证码：</div>
            <el-input v-model="code" />
          </div>
          <div v-else-if="dialogTitle === '修改头像'">
            <uploadPicture
              :ResourceType="'userAvatar'"
              @addPicture="addPicture"
              :maxSize="1"
              :maxNumber="1"
            />
          </div>
          <div v-else-if="dialogTitle === '找回密码'">
            <div class="dialog-content-item-input">
              <div class="dialog-content-item-input-username">用户名：</div>
              <el-input v-model="username" />
              <div class="dialog-content-item-input-email">邮箱：</div>
              <el-input v-model="email" />
              <div class="dialog-content-item-input-code">验证码：</div>
              <el-input v-model="code" />
              <div class="dialog-content-item-input-password">新密码：</div>
              <el-input maxlength="30" v-model="password" />
            </div>
          </div>
          <div v-else-if="dialogTitle === '邮箱验证码'">
            <div class="dialog-content-item-input">
              <div class="dialog-content-item-input-email">邮箱：</div>
              <el-input v-model="email" />
              <div class="dialog-content-item-input-code">验证码：</div>
              <el-input v-model="code" />
              <span class="dialog-content-item-input-code-tip"
                >验证码不区分大小写</span
              >
            </div>
          </div>
        </div>
        <div
          class="dialog-content-item-button"
          v-show="dialogTitle !== '修改头像'"
        >
          <proButton
            class="dialog-content-item-button-code"
            :info="codeString"
            v-show="
              dialogTitle === '修改邮箱' ||
              dialogTitle === '找回密码' ||
              dialogTitle === '邮箱验证码'
            "
            @click="getCode()"
            :before="$constant.before_color_1"
            :after="$constant.after_color_1"
          />
          <proButton
            :info="'提交'"
            @click="submitDialog()"
            :before="$constant.before_color_1"
            :after="$constant.after_color_1"
          />
        </div>
      </div>
    </el-dialog>
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
import { useStore } from "@/stores";
import { useGlobalProperties } from "@/composables/useGlobalProperties";
import { useFormValidation } from "@/composables/useFormValidation";
import { notifySuccess, notifyError, notifyWarning } from "@/utils/notify";
import api from "@/api";

const store = useStore();
const { $common, $constant, $confirm, $router, $route } = useGlobalProperties();
const { validateRequired, validateNoSpaces, validateEmail } =
  useFormValidation();

const changeBgState = computed(() => store.changeBg);
const webInfo = computed(() => store.webInfo);
const storeCurrentUser = computed(() => store.currentUser);

const loadCurrentUser = (value) => store.loadCurrentUser(value);

const proButton = defineAsyncComponent(() => import("./common/proButton.vue"));
const uploadPicture = defineAsyncComponent(() =>
  import("./common/uploadPicture.vue")
);

const username = ref("");
const account = ref("");
const password = ref("");
const email = ref("");
const avatar = ref("");
const showDialog = ref(false);
const code = ref("");
const dialogTitle = ref("");
const codeString = ref("验证码");
// 定时器
let intervalCode = null;
const currentUser = ref({});
const active = ref(false);
const province = ref("");

onMounted(() => {
  postProvinceAndCity();
  currentUser.value = storeCurrentUser.value;
  if (!$common.isEmpty(currentUser.value)) {
    username.value = currentUser.value.username;
    email.value = currentUser.value.email;
    avatar.value = currentUser.value.avatar;
    province.value = currentUser.value.province;
  }
});

onBeforeUnmount(() => {
  if (intervalCode) {
    clearInterval(intervalCode);
    intervalCode = null;
  }
});

const addPicture = (res) => {
  avatar.value = res;
  submitDialog();
};

const signUp = () => {
  active.value = true;
};

const signIn = () => {
  active.value = false;
};

const postProvinceAndCity = async () => {
  province.value = "";
  const res = await $common.getIpAndCity();
  province.value = res.address;
};

const login = async () => {
  // 表单验证
  if (
    !validateRequired({
      [account.value]: "账号",
      [password.value]: "密码",
    })
  ) {
    return;
  }

  const user = {
    province: province.value || "",
    account: account.value.trim(),
    password: $common.encrypt(password.value.trim()),
  };

  try {
    const res = await api.login(user);

    if (res.result === "The account is disabled or deleted") {
      notifyError("您的账号已被管理员禁用！");
      return;
    }

    if (!$common.isEmpty(res.result[0])) {
      notifySuccess("登录成功！欢迎光临小舍~~~🥰🥰🥰");
      loadCurrentUser(res.result[0].data[0]);
      account.value = "";
      password.value = "";

      // 登录后重定向到原来想访问的页面
      const redirectPath = $route.query.redirect || "/";
      $router.push(redirectPath);
    }
  } catch (error) {
    if (error.response?.data?.error === "Username or password is incorrect.") {
      notifyError("密码错误！请输入正确密码~~");
    }
    console.log(error);
  }
};
const register = async () => {
  // 表单验证
  if (
    !validateRequired({
      [username.value]: "用户名",
      [password.value]: "密码",
      [code.value]: "验证码",
    })
  ) {
    return;
  }

  if (
    dialogTitle.value === "邮箱验证码" &&
    !validateRequired({ [email.value]: "邮箱" })
  ) {
    return false;
  }

  if (
    !validateNoSpaces({
      [username.value]: "用户名",
      [password.value]: "密码",
    })
  ) {
    return;
  }

  if (username.value === "monkey-papa") {
    notifyError("用户名不可以跟店长昵称一样喔~~~😊");
    return;
  }

  const user = {
    province: province.value || "",
    username: username.value.trim(),
    code: code.value.trim().toUpperCase(),
    password: $common.encrypt(password.value.trim()),
  };
  if (dialogTitle.value === "邮箱验证码") {
    user.email = email.value;
  }

  try {
    const res = await api.register(user);

    if (res.result === "验证码错误") {
      notifyError("验证码错误！");
      return;
    }
    if (res.result === "验证码已过期") {
      notifyError("验证码已过期！");
      return;
    }

    if (!$common.isEmpty(res.result[0].data)) {
      notifySuccess("注册成功！");
      loadCurrentUser(res.result[0].data[0]);
      username.value = "";
      password.value = "";
      $router.push({ path: "/" });
    }
  } catch (error) {
    if (error.response?.data?.error === "Username already exists.") {
      notifyError("账号已被注册，请重新注册~~");
    } else {
      notifyError("用户名或者邮箱已存在！");
    }
  }
};
// 资料信息修改
const submitUserInfo = async () => {
  if (!checkParameters()) {
    return;
  }
  const user = {
    gender: currentUser.value.gender,
    phoneNumber: currentUser.value.phoneNumber,
    email: currentUser.value.email,
    introduction: currentUser.value.introduction,
    userId: storeCurrentUser.value.id,
  };
  if (!$common.isEmpty(currentUser.value.introduction)) {
    user.introduction = currentUser.value.introduction.trim();
  }
  const allQiniuFieldsEmpty =
    $common.isEmpty(currentUser.value.qiniuDomain) &&
    $common.isEmpty(currentUser.value.qiniuAccessKey) &&
    $common.isEmpty(currentUser.value.qiniuSecretKey) &&
    $common.isEmpty(currentUser.value.qiniuBucketName);
  const allQiniuFieldsFilled =
    !$common.isEmpty(currentUser.value.qiniuDomain) &&
    !$common.isEmpty(currentUser.value.qiniuAccessKey) &&
    !$common.isEmpty(currentUser.value.qiniuSecretKey) &&
    !$common.isEmpty(currentUser.value.qiniuBucketName);
  if (allQiniuFieldsEmpty || allQiniuFieldsFilled) {
    if (allQiniuFieldsFilled) {
      user.qiniuDomain = currentUser.value.qiniuDomain.trim();
      user.qiniuAccessKey = currentUser.value.qiniuAccessKey.trim();
      user.qiniuSecretKey = currentUser.value.qiniuSecretKey.trim();
      user.qiniuBucketName = currentUser.value.qiniuBucketName.trim();
    }
  } else {
    notifyWarning("请将四项七牛云信息填写完整，或者四项全部留空！");
    return;
  }

  try {
    await $confirm("确认保存？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
      center: true,
    });

    const res = await api.updateUserInfo(user);
    if (!$common.isEmpty(res.result[0])) {
      loadCurrentUser(res.result[0].data[0]);
      currentUser.value = storeCurrentUser.value;
      notifySuccess("修改成功！");
    }
  } catch (error) {
    if (error === "cancel") {
      notifySuccess("已取消保存！");
    }
    console.log(error);
  }
};

const checkParams = (params) => {
  if (
    dialogTitle.value === "修改邮箱" ||
    dialogTitle.value === "邮箱验证码" ||
    dialogTitle.value === "找回密码"
  ) {
    if (!validateRequired({ [email.value]: "邮箱" })) {
      return false;
    }
    if (!validateEmail(email.value)) {
      return false;
    }
    params.email = email.value;
    return true;
  }
  return false;
};

const checkParameters = () => {
  if (!validateRequired({ [currentUser.value.username]: "用户名" })) {
    return false;
  }

  if (
    !/^1[345789]\d{9}$/.test(currentUser.value.phoneNumber) &&
    currentUser.value.phoneNumber
  ) {
    notifyError("手机号格式有误！");
    return false;
  }

  if (!validateNoSpaces({ [currentUser.value.username]: "用户名" })) {
    return false;
  }

  return true;
};

const changeDialog = (value) => {
  if (value === "邮箱验证码") {
    if (!validateRequired({ [email.value]: "邮箱" })) {
      return false;
    }
    if (!validateEmail(email.value)) {
      return false;
    }
    // 一进入弹窗就获取验证码，前提得赋值弹窗标题
    dialogTitle.value = value;
    getCode();
  }
  dialogTitle.value = value;
  showDialog.value = true;
};

// 头像修改
const submitDialog = async () => {
  if (dialogTitle.value === "修改头像") {
    if (!validateRequired({ [avatar.value]: "头像" })) {
      return;
    }

    const user = {
      avatar: avatar.value.trim(),
      userId: storeCurrentUser.value.id,
    };

    try {
      const res = await api.updateUserInfo(user);
      if (!$common.isEmpty(res.result[0])) {
        loadCurrentUser(res.result[0].data[0]);
        currentUser.value = storeCurrentUser.value;
        clearDialog();
        notifySuccess("修改成功！");
      }
    } catch (error) {
      console.log(error);
    }
  } else if (dialogTitle.value === "修改邮箱") {
    updateSecretInfo();
  } else if (dialogTitle.value === "找回密码") {
    updateSecretInfo();
  } else if (dialogTitle.value === "邮箱验证码") {
    showDialog.value = false;
  }
};

const updateSecretInfo = async () => {
  if (
    !validateRequired({
      [code.value]: "验证码",
    })
  ) {
    return;
  }

  if (
    dialogTitle.value !== "修改邮箱" &&
    !validateRequired({
      [password.value]: "密码",
    })
  ) {
    return;
  }

  const params = {
    email: email.value,
    code: code.value.trim(),
    password: $common.encrypt(password.value.trim()),
    username: username.value,
    userId: storeCurrentUser.value.id,
  };

  if (!checkParams(params)) {
    return;
  }

  if (dialogTitle.value === "找回密码") {
    try {
      const res = await api.updateForForgetPassword(params);
      clearDialog();

      if (res.result === "验证码错误") {
        notifyError("验证码错误！");
        return;
      }
      if (res.result === "验证码已过期") {
        notifyError("验证码已过期！");
        return;
      }

      notifySuccess("修改成功，请重新登录！");
    } catch (error) {
      console.log(error);
    }
  } else {
    try {
      const res = await api.updateUserInfo(params, false);
      if (!$common.isEmpty(res.result[0])) {
        loadCurrentUser(res.result[0].data[0]);
        currentUser.value = storeCurrentUser.value;
        clearDialog();
        notifySuccess("修改成功！");
      }
    } catch (error) {
      console.log(error);
    }
  }
};

const getCode = async () => {
  if (codeString.value === "验证码") {
    // 获取验证码
    const params = {};
    if (!checkParams(params)) {
      return;
    }

    try {
      await api.sendVerificationCode(params);
      notifySuccess("验证码已发送，请注意查收！");

      codeString.value = "30";
      intervalCode = setInterval(() => {
        if (codeString.value === "0") {
          clearInterval(intervalCode);
          intervalCode = null;
          codeString.value = "验证码";
        } else {
          codeString.value = parseInt(codeString.value) - 1 + "";
        }
      }, 1000);
    } catch (error) {
      console.log(error);
    }
  } else {
    notifyWarning("请稍后再试！");
  }
};

const clearDialog = () => {
  password.value = "";
  email.value = "";
  avatar.value = "";
  showDialog.value = false;
  code.value = "";
  dialogTitle.value = "";
};
</script>

<style lang="scss">
.user-dialog {
  .dialog-content {
    flex-direction: column;

    .dialog-content-item {
      .dialog-content-item-email {
        margin-bottom: 5px;
      }

      .dialog-content-item-code {
        margin-top: 10px;
        margin-bottom: 5px;
      }

      .dialog-content-item-input {
        .dialog-content-item-input-username {
          margin-bottom: 5px;
        }

        .dialog-content-item-input-email {
          margin-bottom: 5px;
        }

        .dialog-content-item-input-code {
          margin-top: 10px;
          margin-bottom: 5px;
        }

        .dialog-content-item-input-password {
          margin-top: 10px;
          margin-bottom: 5px;
        }

        .dialog-content-item-input-code-tip {
          font-size: 14px;
          color: var(--bigRed);
          margin-top: 6px;
          display: inline-block;
        }
      }
    }

    .dialog-content-item-button {
      display: flex;
      margin-top: 30px;

      .dialog-content-item-button-code {
        margin-right: 20px;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.user-container-warp {
  .in-up-container {
    height: 100vh;
    position: relative;

    .in-up {
      opacity: 0.9;
      border-radius: 10px;
      box-shadow: 0 15px 30px var(--miniMask), 0 10px 10px var(--miniMask);
      position: relative;
      overflow: hidden;
      width: 750px;
      max-width: 100%;
      min-height: 450px;
      margin: 10px;

      p {
        font-size: 14px;
        letter-spacing: 1px;
        margin: 20px 0 30px 0;
      }

      a {
        color: var(--black);
        font-size: 14px;
        text-decoration: none;
        margin: 15px 0;

        &.get-code-link {
          margin: 0;
        }
      }

      button {
        border-radius: 2rem;
        border: none;
        background: var(--lightRed);
        color: var(--white);
        font-size: 16px;
        font-weight: bold;
        padding: 12px 45px;
        letter-spacing: 2px;

        &:hover {
          animation: scale 0.8s ease-in-out;
        }

        &.ghost {
          background: transparent;
          border: 1px solid var(--white);
        }
      }

      &.right-panel-active {
        .sign-in-container {
          transform: translateY(100%);
        }

        .overlay-container {
          transform: translateX(-100%);
        }

        .sign-up-container {
          &.form-container {
            transform: translateX(100%);
            opacity: 1;
          }
        }

        .overlay {
          transform: translateX(50%);

          &-left {
            &.overlay-panel {
              transform: translateY(0);
            }
          }

          &-right {
            transform: translateY(20%);
          }
        }
      }

      .form-container {
        position: absolute;
        height: 100%;
        transition: all 0.5s ease-in-out;

        div:not(.el-input) {
          background: var(--white);
          flex-direction: column;
          padding: 0 20px;
          height: 100%;

          h1 {
            color: var(--black);
          }
        }

        .el-input {
          margin: 6px 0;
          width: 80%;
        }

        &.sign-in-container {
          left: 0;
          width: 50%;
        }

        &.sign-up-container {
          left: 0;
          width: 50%;
          opacity: 0;

          button {
            margin-top: 20px;
          }
        }
      }

      .overlay-container {
        position: absolute;
        left: 50%;
        width: 50%;
        height: 100%;
        overflow: hidden;
        transition: all 0.5s ease-in-out;

        .overlay {
          background: var(--gradualRed);
          color: var(--white);
          position: relative;
          left: -100%;
          height: 100%;
          width: 200%;

          &-panel {
            position: absolute;
            top: 0;
            flex-direction: column;
            height: 100%;
            width: 50%;
            transition: all 0.5s ease-in-out;
          }

          &-right {
            right: 0;
            transform: translateY(0);
          }

          &-left {
            transform: translateY(-20%);
          }
        }
      }
    }
  }

  .user-container {
    width: 100vw;
    height: 100vh;
    position: relative;

    .user-info {
      width: 80%;
      z-index: 10;
      margin-top: 70px;
      height: calc(100vh - 90px);
      margin-bottom: 20px;
      border-radius: 10px;
      overflow: hidden;
      display: flex;

      .user-left {
        width: 50%;
        background: var(--maxMaxWhiteMask);
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow-y: auto;
        padding: 20px;

        .submit-button {
          margin-top: 20px;
        }

        .user-left-avatar {
          display: flex;
          align-items: center;

          .user-left-avatar-text {
            margin-right: 10px;
            color: var(--red);
          }
        }

        .user-left-content {
          margin-top: 12px;

          .user-title {
            text-align: right;
            user-select: none;

            div {
              text-align: right;
              color: var(--black5);
              height: 55px;
              line-height: 55px;
            }
          }

          .user-content {
            text-align: left;

            > div {
              height: 55px;
              display: flex;
              align-items: center;
            }

            :deep(.el-input__inner),
            :deep(.el-textarea__inner) {
              border: none;
              background: var(--whiteMask);
            }

            :deep(.el-input__count) {
              background: var(--transparent);
              user-select: none;
            }

            .user-content-item {
              .user-content-item-input {
                width: 100%;
              }

              .user-content-item-email {
                color: var(--black5);
              }
            }

            .changeInfo {
              color: var(--white);
              font-size: 0.75rem;
              white-space: nowrap;
              background: var(--gradientAnimation);
              padding: 3px;
              border-radius: 0.2rem;
              user-select: none;
            }
          }

          .mk-radio__group {
            .user-content-item-radio {
              margin-right: 10px;
            }

            :deep(.el-radio__label) {
              color: var(--red);
            }

            :deep(.el-radio__input.is-checked .el-radio__inner) {
              border-color: var(--red);
              background: var(--red);
            }
          }
        }
      }

      .user-right {
        width: 50%;
        background: var(--whiteMask);
        padding: 20px;
      }
    }
  }
}

@media screen and (max-width: 940px) {
  .user-container-warp {
    .user-container {
      .user-info {
        width: 90%;

        .user-left {
          width: 100%;
        }

        .user-right {
          display: none;
        }
      }
    }
  }
}
</style>
