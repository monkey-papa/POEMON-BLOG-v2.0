<template>
  <div class="tree-hole-list-container">
    <el-tag effect="dark" class="admin-title-tag">
      <img src="../../assets/svg/message.svg" />
      留言列表
    </el-tag>
    <el-table
      :data="treeHoles"
      border
      class="admin-table"
      header-cell-class-name="table-header"
    >
      <el-table-column prop="id" label="ID" width="55" align="center" />
      <el-table-column prop="username" label="用户" align="center" />
      <el-table-column label="头像" align="center">
        <template v-slot="scope">
          <el-image
            :preview-src-list="[scope.row.avatar]"
            lazy
            class="admin-image-thumb"
            :src="scope.row.avatar || webInfo.avatar"
            fit="cover"
          />
        </template>
      </el-table-column>
      <el-table-column prop="message" label="留言内容" align="center" />
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
            style="color: green"
            @click="addProWords(scope.row)"
          >
            <el-icon color="green"><CirclePlusFilled /></el-icon>
            添加违禁词
          </el-button>
          <el-button
            v-hasPermi="['user:visit:read']"
            type="text"
            style="color: var(--red)"
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
        layout="total, prev, pager, next"
        :current-page="pagination.current"
        :page-size="pagination.size"
        :total="pagination.total"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup>
import { notifySuccess, notifyError } from "@/utils/notify";
import api from "@/api";
import { ref, onMounted, computed } from "vue";
import { useGlobalProperties } from "@/composables/useGlobalProperties";

import { useStore } from "@/stores";

const store = useStore();
const { $common, $confirm } = useGlobalProperties();

const webInfo = computed(() => store.webInfo);

const pagination = ref({
  current: 1,
  size: 10,
  total: 0,
});

const treeHoles = ref([]);

onMounted(() => {
  getTreeHoles();
});

const getTreeHoles = async () => {
  try {
    const res = await api.getBossTreeHoleList(pagination.value);
    if (!$common.isEmpty(res.result[0])) {
      treeHoles.value = res.result[0].records;
      pagination.value.total = res.result[0].total;
    }
  } catch (error) {
    console.log(error);
  }
};

const handlePageChange = (val) => {
  pagination.value.current = val;
  getTreeHoles();
};

const handleDelete = (item) => {
  $confirm("确定要删除这条留言吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
    center: true,
  })
    .then(() => {
      doDelete(item);
    })
    .catch(() => {
      notifySuccess("已取消删除！");
    });
};

const doDelete = async (item) => {
  try {
    await api.deleteTreeHole(item.id);
    pagination.value.current = 1;
    await getTreeHoles();
    notifySuccess("删除成功！");
  } catch (error) {
    console.log(error);
  }
};

const addProWords = (item) => {
  $confirm("确定要添加为违禁词吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
    center: true,
  }).then(async () => {
    try {
      const res = await api.addProhibitedWord({
        message: item.message,
        username: item.username,
        avatar: item.avatar,
      });
      if (res.failure !== "exists null or error") {
        await doDelete(item);
      } else {
        notifyError("违禁词已存在！添加失败,请删除！");
      }
    } catch (error) {
      notifyError("违禁词已存在！添加失败！");
    }
  });
};
</script>

<style lang="scss" scoped>
.tree-hole-list-container {
  .admin-title-tag {
    img {
      vertical-align: -6px;
    }
  }
}
</style>
