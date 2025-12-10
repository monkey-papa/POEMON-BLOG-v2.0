<template>
  <div>
    <div class="header-search">
      <el-select
        @blur="closeOptions"
        @clear="handleClear('commentType')"
        ref="fuzzyCommentType"
        v-model="pagination.commentType"
        placeholder="评论来源类型"
        class="mr10"
        clearable
      >
        <el-option key="1" label="文章评论" value="article" />
        <el-option key="2" label="树洞评论" value="message" />
        <el-option key="3" label="恋爱留言" value="love" />
      </el-select>
      <el-input
        type="number"
        class="mr10"
        v-model="pagination.source"
        placeholder="评论来源标识"
        clearable
      />
      <el-button type="primary" @click="searchComments()"
        ><el-icon color="white"><Search /></el-icon>搜索
      </el-button>
      <el-button type="danger" @click="clearSearch()">清除参数</el-button>
    </div>
    <el-table
      :data="comments"
      border
      class="admin-table"
      header-cell-class-name="table-header"
    >
      <el-table-column prop="id" label="ID" width="55" align="center" />
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
      <el-table-column prop="source" label="评论来源标识" align="center" />
      <el-table-column prop="type" label="评论来源类型" align="center" />
      <el-table-column prop="likeCount" label="点赞数" align="center" />
      <el-table-column
        width="200"
        prop="commentContent"
        label="评论内容"
        align="center"
        show-overflow-tooltip
      >
        <template v-slot="scope">
          <span v-html="scope.row.commentContent"></span>
        </template>
      </el-table-column>
      <el-table-column prop="commentInfo" label="评论额外信息" align="center" />
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
  source: null,
  commentType: "",
});

const comments = ref([]);
const fuzzyCommentType = ref(null);

onMounted(() => {
  getComments();
});

const handleSizeChange = (val) => {
  pagination.value.size = val;
  getComments();
};

const handleClear = (field) => {
  pagination.value[field] = "";
  getComments();
};

const emoji = (commentsData) => {
  commentsData.forEach((c) => {
    c.commentContent = c.commentContent.replace(/\n/g, "<br/>");
    // 表情包转换
    c.commentContent = $common.faceReg(c.commentContent);
    // 图片转换
    c.commentContent = $common.pictureReg(c.commentContent);
  });
};

const clearSearch = () => {
  pagination.value = {
    current: 1,
    size: 10,
    total: 0,
    source: null,
    commentType: "",
  };
  getComments();
};

const getComments = async () => {
  try {
    const res = await api.getBossCommentList(pagination.value);
    if (!$common.isEmpty(res.result[0])) {
      comments.value = res.result[0].data;
      emoji(comments.value);
      pagination.value.total = res.result[0].total;
    }
  } catch (error) {
    console.log(error);
  }
};

const handlePageChange = (val) => {
  pagination.value.current = val;
  getComments();
};

const searchComments = () => {
  pagination.value.total = 0;
  pagination.value.current = 1;
  getComments();
};

const doDelete = async (item) => {
  try {
    await api.bossDeleteComment(item.id);
    pagination.value.current = 1;
    await getComments();
    notifySuccess("删除成功！");
  } catch (error) {
    console.log(error);
  }
};

const handleDelete = (item) => {
  $confirm("删除评论后，所有该评论的回复均不可见。确认删除？", "提示", {
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

const addProWords = (item) => {
  $confirm("确定要添加为违禁词吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
    center: true,
  }).then(async () => {
    try {
      const res = await api.addProhibitedWord({
        message: item.commentContent,
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

const closeOptions = () => {
  fuzzyCommentType.value?.blur();
};
</script>
