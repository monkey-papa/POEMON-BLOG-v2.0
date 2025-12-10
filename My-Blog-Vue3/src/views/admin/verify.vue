<template>
  <div class="content transformCenter">
    <div class="left">
      <img
        src="../../assets/file/verify2.png"
        class="people p-animtion"
        alt="people"
      />
      <img
        src="../../assets/file/verify1.png"
        class="sphere s-animtion"
        alt="sphere"
      />
    </div>
    <div class="right">
      <div class="top">
        <div class="top-item">
          <span class="top-text" @click="$router.push({ path: '/' })"
            >首页</span
          >
        </div>
        <div class="top-item">
          <span class="top-text" @click="$router.push({ path: '/user' })"
            >前台用户登录</span
          >
        </div>
      </div>
      <div class="form-wrappepr transformCenter">
        <h1>私生活后台</h1>
        <input
          type="text"
          class="inputs user"
          v-model="account"
          placeholder="请输入账号"
        />
        <input
          type="password"
          class="inputs pwd"
          v-model="password"
          @keyup.enter="login()"
          placeholder="请输入密码"
        />
        <proButton
          :info="'提交'"
          @click="login()"
          :before="$constant?.before_color_1"
          :after="$constant?.after_color_1"
        />
      </div>
    </div>
  </div>
</template>
<script setup>
import { notifyError } from "@/utils/notify";
import api from "@/api";
import { ref } from "vue";
import { defineAsyncComponent } from "vue";
import { useStore } from "@/stores";
import { useGlobalProperties } from "@/composables/useGlobalProperties";
import { useFormValidation } from "@/composables/useFormValidation";

const store = useStore();
const { $router, $route, $constant, $common } = useGlobalProperties();
const { validateRequired } = useFormValidation();

const loadCurrentAdmin = (value) => store.loadCurrentAdmin(value);

const proButton = defineAsyncComponent(() => import("../common/proButton.vue"));

const account = ref("");
const password = ref("");

const login = async () => {
  if (
    !validateRequired({
      [account.value]: "账号",
      [password.value]: "密码",
    })
  ) {
    return;
  }
  const user = {
    account: account.value.trim(),
    password: $common.encrypt(password.value.trim()),
    isAdmin: true,
  };

  try {
    const res = await api.adminLogin(user);
    if (!$common.isEmpty(res.data)) {
      loadCurrentAdmin(res.data);
      account.value = "";
      password.value = "";
      // 从路由参数获取 redirect，如果为空则默认跳转到后台首页
      const redirectPath = $route.query.redirect || "/backendMain";
      $router.push({ path: redirectPath });
    }
  } catch (error) {
    notifyError(
      "账号异常，可能由于您不是管理员或者是账号密码错误，请重新输入！"
    );
  }
};
</script>

<style lang="scss" scoped>
.content {
  width: 90vw;
  height: 90vh;
  z-index: 1;
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.18);
  display: flex;

  .left {
    flex: 1;
    position: relative;

    .sphere {
      position: absolute;
      left: 30%;
      width: 90%;
      z-index: 1;
      animation: sphereAnimation 2s;
      animation-fill-mode: forwards;
      animation-timing-function: ease;
    }

    .people {
      position: absolute;
      left: -50%;
      top: 20%;
      width: 70%;
      z-index: 2;
    }

    .p-animtion {
      animation: peopleAnimation 2s;
      animation-fill-mode: forwards;
      animation-timing-function: ease;
    }

    .s-animtion {
      animation: sphereAnimation 2s;
      animation-fill-mode: forwards;
      animation-timing-function: ease;
    }
  }

  .right {
    flex: 1;
    position: relative;
    z-index: 12;

    .top {
      width: 80%;
      margin-left: 38px;
      color: rgb(51, 52, 124);
      font-size: 20px;
      font-weight: 600;
      position: absolute;
      left: 50%;
      top: 5%;
      transform: translate(-50%, 0);

      .top-item {
        color: var(--blue2);
        float: left;
        width: 150px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        margin-right: 10px;
        transition: 0.1s;
        border-radius: 50px;
        border: 2px solid var(--red);

        &:hover {
          border: 0;
          background-color: #fff;
          box-shadow: -20px 10px 32px 1px rgba(182, 183, 185, 0.57);
        }
      }
    }

    .form-wrappepr {
      width: 60%;
      text-align: right;

      h1 {
        float: left;
        margin: 30px 0;
        color: var(--black5);
      }

      .inputs {
        display: block;
        width: 100%;
        height: 70px;
        margin: 30px 0;
        border-radius: 10px;
        border: 0;
        background-color: rgb(210, 223, 237);
        color: rgb(80, 82, 84);
        outline: none;
        padding: 20px;
        box-sizing: border-box;
        font-size: 20px;
      }
    }
  }
}

@keyframes sphereAnimation {
  0% {
    width: 10%;
  }
  100% {
    width: 90%;
    transform: translate(-30%, 5%);
  }
}

@keyframes peopleAnimation {
  0% {
    width: 40%;
  }
  100% {
    width: 70%;
    transform: translate(90%, -10%);
  }
}
</style>
