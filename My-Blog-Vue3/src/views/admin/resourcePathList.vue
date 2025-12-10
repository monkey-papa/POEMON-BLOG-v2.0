<template>
  <div class="resource-path-list-container">
    <div class="resource-path-list-header">
      <div class="header-search">
        <el-select
          @clear="clear"
          clearable
          v-model="pagination.resourceType"
          placeholder="娱乐类型"
          class="mr10"
        >
          <el-option
            v-for="(item, i) in resourceTypes"
            :key="i"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-select
          @clear="clear"
          clearable
          v-model="pagination.status"
          placeholder="状态"
          class="mr10"
        >
          <el-option key="1" label="启用" :value="true" />
          <el-option key="2" label="禁用" :value="false" />
        </el-select>
        <el-button type="primary" @click="search()"
          ><el-icon color="white"><Search /></el-icon>搜索</el-button
        >
        <el-button
          v-hasPermi="['user:visit:read']"
          type="primary"
          @click="addResourcePathDialog = true"
          >新增娱乐资源</el-button
        >
      </div>
      <el-table
        :data="resourcePaths"
        border
        class="admin-table"
        header-cell-class-name="table-header"
      >
        <el-table-column prop="id" label="ID" width="55" align="center" />
        <el-table-column prop="title" label="标题" align="center" />
        <el-table-column
          width="130"
          prop="classify"
          label="分类"
          align="center"
        />
        <el-table-column
          width="130"
          prop="type"
          label="资源类型"
          align="center"
        />
        <el-table-column
          width="200"
          prop="introduction"
          label="简介"
          align="center"
        />
        <el-table-column label="封面" align="center">
          <template v-slot="scope">
            <el-image
              lazy
              :preview-src-list="[scope.row.cover]"
              class="admin-image-thumb"
              :src="scope.row.cover"
              fit="cover"
            />
          </template>
        </el-table-column>
        <el-table-column width="300" prop="url" label="链接" align="center" />
        <el-table-column label="状态" align="center">
          <template v-slot="scope">
            <el-tag
              :type="scope.row.status === false ? 'danger' : 'success'"
              disable-transitions
            >
              {{ scope.row.status === false ? "禁用" : "启用" }}
            </el-tag>
            <el-switch
              class="admin-switch"
              v-hasPermi="['user:visit:read']"
              @click="changeStatus(scope.row)"
              v-model="scope.row.status"
            />
          </template>
        </el-table-column>
        <el-table-column label="友人头像" align="center">
          <template v-slot="scope">
            <el-image
              v-if="scope.row.type === 'friendUrl'"
              lazy
              :preview-src-list="[scope.row.friendAvatar]"
              class="admin-image-thumb"
              :src="scope.row.friendAvatar"
              fit="cover"
            />
          </template>
        </el-table-column>
        <el-table-column
          :formatter="$common.formatter"
          prop="createTime"
          label="创建时间"
          align="center"
        />
        <el-table-column label="操作" width="180" align="center">
          <template v-slot="scope">
            <el-button
              v-hasPermi="['user:visit:read']"
              type="text"
              @click="handleEdit(scope.row)"
              ><el-icon color="#409eff"><EditPen /></el-icon>编辑</el-button
            >
            <el-button
              style="color: var(--red)"
              v-hasPermi="['user:visit:read']"
              type="text"
              @click="handleDelete(scope.row)"
            >
              <el-icon color="var(--red)"><Delete /></el-icon>
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="admin-pagination">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next"
          :current-page="pagination.current"
          :page-size="pagination.size"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </div>

    <!-- 统一上传弹窗 -->
    <el-dialog
      :title="uploadDialogTitle"
      v-model="uploadDialogVisible"
      width="25%"
      :append-to-body="true"
      destroy-on-close
      center
    >
      <div>
        <uploadPicture
          :ResourceType="uploadResourceType"
          @addPicture="handleUploadSuccess"
          :maxSize="10"
          :maxNumber="1"
          :listType="uploadListType"
          :accept="uploadAccept"
        />
      </div>
    </el-dialog>

    <el-dialog
      class="resource-path-dialog"
      title="娱乐资源"
      v-model="addResourcePathDialog"
      width="50%"
      :before-close="clearDialog"
      :append-to-body="true"
      center
    >
      <div class="content">
        <div class="form">
          <div class="form-title">标题：</div>
          <el-input maxlength="60" v-model="resourcePath.title" />
          <div class="form-classify">分类：</div>
          <el-input
            :disabled="
              !['lovePhoto', 'funny', 'favorites'].includes(resourcePath.type)
            "
            maxlength="30"
            v-model="resourcePath.classify"
          />
          <div class="form-introduction">简介：</div>
          <el-input
            :disabled="!['friendUrl', 'favorites'].includes(resourcePath.type)"
            maxlength="1000"
            v-model="resourcePath.introduction"
          />
          <div class="form-cover">封面：</div>
          <div class="form-cover-input">
            <el-input v-model="resourcePath.cover" />
            <div class="form-cover-button-wrap">
              <proButton
                :info="'上传封面'"
                @click="addResourcePathCover()"
                :before="$constant.before_color_1"
                :after="$constant.after_color_1"
              />
            </div>
          </div>
          <div class="form-url">链接：</div>
          <div class="form-url-input">
            <el-input
              :disabled="
                !['friendUrl', 'funny', 'favorites'].includes(resourcePath.type)
              "
              v-model="resourcePath.url"
            />
            <div
              v-if="!['friendUrl', 'favorites'].includes(resourcePath.type)"
              class="form-url-button-wrap"
            >
              <proButton
                :info="'上传文件'"
                @click="addResourcePathUrl()"
                :before="$constant.before_color_1"
                :after="$constant.after_color_1"
              />
            </div>
          </div>
          <div class="form-type">资源类型：</div>
          <el-select
            clearable
            v-model="resourcePath.type"
            placeholder="资源路径类型"
            class="mr10"
          >
            <el-option
              v-for="(item, i) in resourceTypes"
              :key="i"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <div class="form-friend-avatar">友人头像：</div>
          <div class="form-friend-avatar-input">
            <el-input
              :disabled="!['friendUrl'].includes(resourcePath.type)"
              v-model="resourcePath.friendAvatar"
            />
            <div class="form-friend-avatar-button-wrap">
              <proButton
                :info="'上传头像'"
                @click="addFriendAvatar()"
                :before="$constant.before_color_1"
                :after="$constant.after_color_1"
              />
            </div>
          </div>
        </div>
        <div class="button-wrap myCenter">
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
</template>

<script setup>
import { ref, onMounted, defineAsyncComponent } from "vue";
import { useGlobalProperties } from "@/composables/useGlobalProperties";
import { notifySuccess, notifyError } from "@/utils/notify";
import api from "@/api";
const uploadPicture = defineAsyncComponent(() =>
  import("../common/uploadPicture.vue")
);
const proButton = defineAsyncComponent(() => import("../common/proButton.vue"));

const { $common, $constant, $confirm } = useGlobalProperties();

const resourceTypes = ref([
  { label: "友链", value: "friendUrl" },
  { label: "相册", value: "lovePhoto" },
  { label: "音乐", value: "funny" },
  { label: "收藏夹", value: "favorites" },
]);
const pagination = ref({
  current: 1,
  size: 10,
  total: 0,
  resourceType: "",
  status: null,
});
const resourcePaths = ref([]);
const uploadDialogVisible = ref(false);
const uploadDialogTitle = ref("");
const uploadType = ref(""); // 'cover', 'friendAvatar', 'file'
const uploadResourceType = ref(""); //'friendUrlUrl', 'friendUrl', 'friendAvatar', 'funny', 'funnyUrl', 'favorites', 'favoritesUrl', 'lovePhoto'
const uploadListType = ref("picture");
const uploadAccept = ref("image/*");
const addResourcePathDialog = ref(false);
const isUpdate = ref(false);
const resourcePath = ref({
  title: "",
  classify: "",
  introduction: "",
  cover: "",
  url: "",
  type: "",
  friendAvatar: "",
});

onMounted(() => {
  getResourcePaths();
});

// 统一处理上传成功
const handleUploadSuccess = (res) => {
  if (uploadType.value === "friendAvatar") {
    resourcePath.value.friendAvatar = res;
  } else if (uploadType.value === "cover") {
    resourcePath.value.cover = res;
  } else if (uploadType.value === "file") {
    resourcePath.value.url = res;
  }
  uploadDialogVisible.value = false;
  uploadType.value = "";
};

// 上传文件（音乐等）
const addResourcePathUrl = () => {
  if (addResourcePathDialog.value === false) {
    return;
  }
  if (!["funny", "favorites", "friendUrl"].includes(resourcePath.value.type)) {
    notifyError("请选择资源类型！");
    return;
  }
  uploadType.value = "file";
  uploadDialogTitle.value = "上传文件";
  uploadResourceType.value = resourcePath.value.type + "Url";
  uploadListType.value = "text";
  uploadAccept.value = "image/*, video/*, audio/*";
  uploadDialogVisible.value = true;
};

// 上传封面
const addResourcePathCover = () => {
  if (addResourcePathDialog.value === false) {
    return;
  }
  if ($common.isEmpty(resourcePath.value.type)) {
    notifyError("请选择资源类型！");
    return;
  }
  uploadType.value = "cover";
  uploadDialogTitle.value = "上传封面";
  uploadResourceType.value = resourcePath.value.type;
  uploadListType.value = "picture";
  uploadAccept.value = "image/*";
  uploadDialogVisible.value = true;
};

// 上传友人头像
const addFriendAvatar = () => {
  if (addResourcePathDialog.value === false) {
    return;
  }
  if (!["friendUrl"].includes(resourcePath.value.type)) {
    notifyError("请选择资源类型！");
    return;
  }
  uploadType.value = "friendAvatar";
  uploadDialogTitle.value = "上传友人头像";
  uploadResourceType.value = "friendAvatar";
  uploadListType.value = "picture";
  uploadAccept.value = "image/*";
  uploadDialogVisible.value = true;
};

const addResourcePath = async () => {
  if (
    $common.isEmpty(resourcePath.value.title) ||
    $common.isEmpty(resourcePath.value.type)
  ) {
    notifyError("标题和资源类型不能为空！");
    return;
  }

  try {
    await api.saveResourcePath(resourcePath.value, isUpdate.value);
    notifySuccess("保存成功！");
    addResourcePathDialog.value = false;
    clearDialog();
    search(pagination.value.current);
  } catch (error) {
    console.log(error);
  }
};

const search = (cur) => {
  pagination.value.total = 0;
  pagination.value.current = cur || 1;
  getResourcePaths();
};

const getResourcePaths = async () => {
  try {
    const res = await api.getResourcePathList(pagination.value);
    if (!$common.isEmpty(res.result[0])) {
      resourcePaths.value = res.result[0].records;
      pagination.value.total = res.result[0].total;
    }
  } catch (error) {
    console.log(error);
  }
};

const changeStatus = async (item) => {
  try {
    await api.saveResourcePath(item, true);
    notifySuccess("修改成功！");
  } catch (error) {
    console.log(error);
  }
};

const handlePageChange = (val) => {
  pagination.value.current = val;
  getResourcePaths();
};

const handleSizeChange = (val) => {
  pagination.value.size = val;
  getResourcePaths();
};

const handleDelete = async (item) => {
  try {
    await $confirm("确认删除？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
      center: true,
    });

    await api.deleteResourcePath(item.id);
    search(pagination.value.current);
    notifySuccess("删除成功！");
  } catch (error) {
    if (error === "cancel") {
      notifySuccess("已取消删除！");
    }
    console.log(error);
  }
};

const handleEdit = (item) => {
  resourcePath.value = JSON.parse(JSON.stringify(item));
  addResourcePathDialog.value = true;
  isUpdate.value = true;
};

const clearDialog = () => {
  isUpdate.value = false;
  addResourcePathDialog.value = false;
  resourcePath.value = {
    title: "",
    classify: "",
    introduction: "",
    cover: "",
    url: "",
    type: "",
    friendAvatar: "",
  };
};

const clear = () => {
  pagination.value.status = null;
  getResourcePaths();
};
</script>

<style lang="scss">
.resource-path-dialog {
  .content {
    .form {
      .form-title {
        margin-bottom: 5px;
      }

      .form-classify,
      .form-introduction,
      .form-cover,
      .form-url,
      .form-type,
      .form-friend-avatar {
        margin-top: 10px;
        margin-bottom: 5px;
      }

      .form-cover-input,
      .form-url-input,
      .form-friend-avatar-input {
        display: flex;

        .form-cover-button-wrap,
        .form-url-button-wrap,
        .form-friend-avatar-button-wrap {
          width: 66px;
          margin: 3.5px 0 0 10px;
        }
      }
    }

    .button-wrap {
      display: flex;
      margin-top: 30px;
    }
  }
}
</style>
