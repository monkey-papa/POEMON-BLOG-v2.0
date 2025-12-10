<template>
  <div>
    <div class="header-search">
      <el-input
        v-model="pagination.searchKey"
        placeholder="违禁词"
        class="mr10"
        clearable
      />
      <el-button type="primary" @click="searchForbiddenWord()">
        <el-icon color="white"><Search /></el-icon>搜索</el-button
      >
      <el-button
        v-hasPermi="['user:visit:read']"
        type="success"
        @click="openDialog(null, 0)"
        >添加</el-button
      >
      <el-button type="danger" @click="clearSearch()">清除参数</el-button>
    </div>
    <el-table
      :data="prohibitedWordsList"
      border
      class="admin-table"
      header-cell-class-name="table-header"
    >
      <el-table-column prop="id" label="ID" align="center" />
      <el-table-column prop="username" label="用户" align="center" />
      <el-table-column label="头像" width="100" align="center">
        <template v-slot="scope">
          <el-image
            :preview-src-list="[scope.row.avatar]"
            lazy
            class="admin-image-thumb"
            :src="scope.row.avatar"
            fit="cover"
          />
        </template>
      </el-table-column>
      <el-table-column prop="message" label="违禁词" align="center" />
      <el-table-column header-align="center" align="center" label="操作">
        <template v-slot="scope">
          <el-button
            v-hasPermi="['user:visit:read']"
            type="text"
            @click="openDialog(scope.row, 1)"
            ><el-icon color="#409eff"><EditPen /></el-icon>编辑</el-button
          >
          <el-button
            v-hasPermi="['user:visit:read']"
            type="text"
            @click="deleteProWords(scope.row.id)"
            ><el-icon color="#409eff"><Delete /></el-icon>删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      class="custom-my-dialog"
      :before-close="handleClose"
      :title="type === 0 ? '添加违禁词' : '修改违禁词'"
      v-model="dialogVisible"
      width="40%"
    >
      <el-input
        class="prohibited-words-input"
        v-model="row.message"
        placeholder="请输入违禁词"
      >
        <template v-slot:prepend>违禁词</template>
      </el-input>
      <template v-slot:footer>
        <div class="dialog-footer">
          <el-button @click="handleClose()">取 消</el-button>
          <el-button type="primary" @click="addOrUpdateProWords(type, row)"
            >确 定</el-button
          >
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { notifySuccess, notifyError } from "@/utils/notify";
import api from "@/api";
import { ref, onMounted, computed } from "vue";
import { useStore } from "@/stores";
import { useGlobalProperties } from "@/composables/useGlobalProperties";

const store = useStore();
const { $confirm } = useGlobalProperties();

const currentAdmin = computed(() => store.currentAdmin);

const row = ref({
  id: null,
  message: "",
  username: currentAdmin.value.username || "",
  avatar: currentAdmin.value.avatar || "",
});

const type = ref(0);
const dialogVisible = ref(false);
const pagination = ref({
  current: 1,
  size: 100,
  total: 0,
  searchKey: "",
});

const prohibitedWordsList = ref([]);

onMounted(() => {
  getProhibitedWordsList();
});

const handleClose = () => {
  row.value = {
    id: null,
    message: "",
    username: currentAdmin.value.username || "",
    avatar: currentAdmin.value.avatar || "",
  };
  dialogVisible.value = false;
};

const clearSearch = () => {
  pagination.value = {
    current: 1,
    size: 100,
    total: 0,
    searchKey: "",
  };
  getProhibitedWordsList();
};

const openDialog = (rowData, typeValue) => {
  dialogVisible.value = true;
  type.value = typeValue;
  if (rowData !== null) {
    row.value = rowData;
  }
};

const addOrUpdateProWords = async (typeValue) => {
  // 添加违禁词
  if (typeValue === 0) {
    try {
      const res = await api.addProhibitedWord(row.value);
      if (res.failure !== "exists null or error") {
        handleClose();
        row.value.message = "";
        notifySuccess("添加成功！");
      } else {
        notifyError("违禁词已存在！添加失败,请删除！");
      }
      await getProhibitedWordsList();
    } catch (error) {
      console.log(error);
    }
  }
  // 编辑违禁词
  if (typeValue === 1) {
    try {
      const res = await api.updateProhibitedWord(row.value);
      if (res.result === "success") {
        notifySuccess("编辑成功！");
      } else if (res.failure === "exists or null") {
        notifyError("编辑失败！这个违禁词已存在");
      } else {
        notifyError("编辑失败！");
      }
      handleClose();
      await getProhibitedWordsList();
    } catch (error) {
      console.log(error);
    }
  }
};

const getProhibitedWordsList = async () => {
  try {
    const res = await api.getProhibitedWordsList(pagination.value);
    if (res.result[0]) {
      prohibitedWordsList.value = res.result[0].data;
      pagination.value.total = res.result[0].total;
    } else {
      notifyError(res.data.msg);
    }
  } catch (error) {
    console.log(error);
  }
};

const searchForbiddenWord = () => {
  getProhibitedWordsList();
};

const deleteProWords = (id) => {
  $confirm("确定要删除这个违禁词吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
    center: true,
  }).then(async () => {
    try {
      const res = await api.deleteProhibitedWord(id);
      if (res.result === "success") {
        notifySuccess("删除成功！");
        await getProhibitedWordsList();
      } else {
        notifyError(res.data.msg);
      }
    } catch (error) {
      console.log(error);
    }
  });
};
</script>

<style lang="scss">
.custom-my-dialog {
  .prohibited-words-input {
    width: 100%;
    height: 30px;
  }
}
</style>
