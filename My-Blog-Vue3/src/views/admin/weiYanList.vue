<template>
  <div>
    <div class="header-search">
      <el-button type="primary" @click="getWeiYan()"
        ><el-icon color="white"><Refresh /></el-icon
      ></el-button>
    </div>
    <el-table
      :data="weiYan"
      border
      class="admin-table"
      header-cell-class-name="table-header"
    >
      <el-table-column prop="id" label="ID" width="55" align="center" />
      <el-table-column prop="userId" label="用户ID" align="center" />
      <el-table-column prop="username" label="用户名称" align="center" />
      <el-table-column label="头像" align="center">
        <template v-slot="scope">
          <el-image
            lazy
            class="admin-image-thumb"
            :src="scope.row.avatar || webInfo.avatar"
            fit="cover"
          />
        </template>
      </el-table-column>
      <el-table-column prop="likeCount" label="点赞数" align="center" />
      <el-table-column label="是否可见" align="center" width="100">
        <template v-slot="scope">
          <el-tag
            :type="scope.row.isPublic === false ? 'danger' : 'success'"
            disable-transitions
          >
            {{ scope.row.isPublic === false ? "不可见" : "可见" }}
          </el-tag>
          <el-switch
            class="admin-switch"
            v-hasPermi="['user:visit:read']"
            @click="changeIsPublic(scope.row)"
            v-model="scope.row.isPublic"
          />
        </template>
      </el-table-column>
      <el-table-column
        width="200"
        prop="content"
        label="微言内容"
        align="center"
        show-overflow-tooltip
      >
        <template v-slot="scope">
          <span v-html="scope.row.content"></span>
        </template>
      </el-table-column>
      <el-table-column
        :formatter="$common?.formatter"
        prop="createTime"
        label="创建时间"
        align="center"
      />
      <el-table-column label="操作" width="180" align="center">
        <template v-slot="scope">
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
        layout="total,sizes, prev, pager, next"
        :current-page="pagination.current"
        :page-size="pagination.size"
        :total="pagination.total"
        :page-sizes="[10, 20, 50, 100]"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
      />
    </div>
  </div>
</template>

<script setup>
import { notifySuccess } from "@/utils/notify";
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
  source: null,
  all: true,
});

const weiYan = ref([]);

onMounted(() => {
  getWeiYan();
});

const changeIsPublic = async (item) => {
  try {
    await api.changeWeiYanIsPublic(item.id, item.isPublic);
    notifySuccess("修改成功！");
    getWeiYan();
  } catch (error) {
    console.log(error);
  }
};

const emoji = (WeiYanData) => {
  WeiYanData.forEach((c) => {
    c.content = c.content.replace(/\n/g, "<br/>");
    // 表情包转换
    c.content = $common.faceReg(c.content);
    // 图片转换
    c.content = $common.pictureReg(c.content);
  });
};

const getWeiYan = async () => {
  try {
    const res = await api.getWeiYanList(pagination.value);
    if (!$common.isEmpty(res.result[0])) {
      weiYan.value = res.result[0].records;
      emoji(weiYan.value);
      pagination.value.total = res.result[0].total;
    }
  } catch (error) {
    console.log(error);
  }
};

const handlePageChange = (val) => {
  pagination.value.current = val;
  getWeiYan();
};

const handleSizeChange = (val) => {
  pagination.value.size = val;
  getWeiYan();
};

const doDelete = async (item) => {
  try {
    await api.deleteWeiYan(item.id);
    pagination.value.current = 1;
    await getWeiYan();
    notifySuccess("删除成功！");
  } catch (error) {
    console.log(error);
  }
};

const handleDelete = (item) => {
  $confirm("确认删除？", "提示", {
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
</script>
