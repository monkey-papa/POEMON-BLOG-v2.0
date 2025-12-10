<template>
  <div>
    <div class="header-search">
      <el-select
        @blur="closeOptions('recommendStatus')"
        @clear="handleClear('recommendStatus')"
        ref="fuzzyRecommendStatus"
        v-model="pagination.recommendStatus"
        placeholder="是否推荐"
        class="mr10"
        clearable
      >
        <el-option key="1" label="是" :value="true" />
        <el-option key="2" label="否" :value="false" />
      </el-select>
      <el-select
        @blur="closeOptions('recommendSort')"
        @clear="handleClear('sortId')"
        ref="fuzzySort"
        class="mr10"
        v-model="pagination.sortId"
        placeholder="请选择分类"
        clearable
      >
        <el-option
          v-for="item in sorts"
          :key="item.id"
          :label="item.sortName"
          :value="item.id"
        />
      </el-select>
      <el-select
        @blur="closeOptions('recommendLabel')"
        @clear="handleClear('labelId')"
        ref="fuzzyLabel"
        class="mr10"
        v-model="pagination.labelId"
        placeholder="请选择标签"
        clearable
      >
        <el-option
          v-for="item in labelsTemp"
          :key="item.id"
          :label="item.labelName"
          :value="item.id"
        />
      </el-select>
      <el-input
        v-model="pagination.searchKey"
        placeholder="文章标题"
        class="mr10"
        clearable
      />
      <el-button type="primary" @click="searchArticles()"
        ><el-icon color="white"><Search /></el-icon>搜索</el-button
      >
      <el-button type="danger" @click="clearSearch()">清除参数</el-button>
      <el-button type="primary" @click="handleToAddArticle">新增文章</el-button>
    </div>
    <el-table
      :data="articles"
      border
      class="admin-table"
      header-cell-class-name="table-header"
    >
      <el-table-column prop="id" label="ID" width="55" align="center" />
      <el-table-column prop="updateBy" label="作者" align="center" />
      <el-table-column prop="articleTitle" label="文章标题" align="center" />
      <el-table-column prop="sort[0].sortName" label="分类" align="center" />
      <el-table-column prop="label[0].labelName" label="标签" align="center" />
      <el-table-column prop="viewCount" label="浏览量" align="center" />
      <el-table-column prop="likeCount" label="点赞数" align="center" />
      <el-table-column label="是否可见" align="center">
        <template v-slot="scope">
          <el-tag
            :type="scope.row.viewStatus === false ? 'danger' : 'success'"
            disable-transitions
          >
            {{ scope.row.viewStatus === false ? "不可见" : "可见" }}
          </el-tag>
          <el-switch
            class="admin-switch"
            v-hasPermi="['user:visit:read']"
            @click="changeStatus(scope.row, 1)"
            v-model="scope.row.viewStatus"
          />
        </template>
      </el-table-column>
      <el-table-column label="封面" align="center">
        <template v-slot="scope">
          <el-image
            :preview-src-list="[scope.row.articleCover]"
            lazy
            class="admin-image-thumb"
            :src="scope.row.articleCover"
            fit="cover"
          />
        </template>
      </el-table-column>
      <el-table-column label="是否启用评论" align="center">
        <template v-slot="scope">
          <el-tag
            :type="scope.row.commentStatus === false ? 'danger' : 'success'"
            disable-transitions
          >
            {{ scope.row.commentStatus === false ? "否" : "是" }}
          </el-tag>
          <el-switch
            class="admin-switch"
            v-hasPermi="['user:visit:read']"
            @click="changeStatus(scope.row, 2)"
            v-model="scope.row.commentStatus"
          />
        </template>
      </el-table-column>
      <el-table-column label="是否推荐" align="center">
        <template v-slot="scope">
          <el-tag
            :type="scope.row.recommendStatus === false ? 'danger' : 'success'"
            disable-transitions
          >
            {{ scope.row.recommendStatus === false ? "否" : "是" }}
          </el-tag>
          <el-switch
            class="admin-switch"
            v-hasPermi="['user:visit:read']"
            @click="changeStatus(scope.row, 3)"
            v-model="scope.row.recommendStatus"
          />
        </template>
      </el-table-column>
      <el-table-column prop="commentCount" label="评论数" align="center" />
      <el-table-column
        :formatter="$common?.formatter"
        prop="createTime"
        label="创建时间"
        align="center"
      />
      <el-table-column
        :formatter="$common?.formatter"
        prop="updateTime"
        label="最终修改时间"
        align="center"
      />
      <el-table-column label="操作" width="135" align="center">
        <template v-slot="scope">
          <el-button
            v-if="
              scope.row.userId === currentAdmin.id ||
              currentAdmin.userType === 0
            "
            type="text"
            @click="handleEdit(scope.row)"
          >
            <el-icon color="#409eff"><EditPen /></el-icon>编辑</el-button
          >
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
import { ref, watch, onMounted, computed } from "vue";
import { useStore } from "@/stores";
import { useGlobalProperties } from "@/composables/useGlobalProperties";

const store = useStore();
const { $router, $common, $confirm } = useGlobalProperties();

const currentAdmin = computed(() => store.currentAdmin);

const fuzzyRecommendStatus = ref(null);
const fuzzySort = ref(null);
const fuzzyLabel = ref(null);

const pagination = ref({
  current: 1,
  size: 20,
  total: 0,
  searchKey: "",
  recommendStatus: null,
  sortId: null,
  labelId: null,
});
const articles = ref([]);
const sorts = ref([]);
const labels = ref([]);
const labelsTemp = ref([]);
const recommendCount = ref(0);

watch(
  () => pagination.value.sortId,
  (newVal) => {
    pagination.value.labelId = null;
    if (!$common.isEmpty(newVal) && !$common.isEmpty(labels.value)) {
      labelsTemp.value = labels.value.filter((l) => l.sortId === newVal);
    } else {
      labelsTemp.value = [];
    }
  }
);

onMounted(() => {
  getArticles();
  getSortAndLabel();
});

const handleToAddArticle = () => {
  if (
    currentAdmin.value.qiniuAccessKey &&
    currentAdmin.value.qiniuBucketName &&
    currentAdmin.value.qiniuDomain &&
    currentAdmin.value.qiniuSecretKey
  ) {
    $router.push({ path: "/postEdit" });
  } else {
    notifyError("请去前台个人中心完善七牛云配置！");
  }
};

const getSortAndLabel = async () => {
  try {
    const res = await api.getSortAndLabelList();
    if (!$common.isEmpty(res.result[0])) {
      sorts.value = res.result[0].data[0].sorts;
      labels.value = res.result[0].data[0].labels;
    }
  } catch (error) {
    console.log(error);
  }
};

const clearSearch = () => {
  pagination.value = {
    current: 1,
    size: 20,
    total: 0,
    searchKey: "",
    recommendStatus: null,
    sortId: null,
    labelId: null,
  };
  getArticles();
};

const getArticles = async () => {
  try {
    const res = await api.getAdminArticleList(pagination.value);
    if (!$common.isEmpty(res.result[0])) {
      articles.value = res.result[0].records;
      pagination.value.total = res.result[0].total;
      recommendCount.value = 0;
      articles.value.forEach((item) => {
        if (item.recommendStatus) {
          recommendCount.value += 1;
        }
      });
    } else if (res.result.length === 0) {
      articles.value = [];
    }
  } catch (error) {
    console.log(error);
  }
};

const handlePageChange = (val) => {
  pagination.value.current = val;
  getArticles();
};

const searchArticles = () => {
  pagination.value.total = 0;
  pagination.value.current = 1;
  getArticles();
};

const changeStatus = async (article, flag) => {
  let param;
  if (flag === 1) {
    param = {
      articleId: article.id,
      viewStatus: article.viewStatus,
    };
  } else if (flag === 2) {
    param = {
      articleId: article.id,
      commentStatus: article.commentStatus,
    };
  } else if (flag === 3) {
    if (article.recommendStatus) {
      recommendCount.value++;
      if (recommendCount.value === 11) {
        notifyError("已到推荐文章数量上限！最多推荐10篇文章！");
        recommendCount.value = 10;
        article.recommendStatus = false;
        return;
      }
    } else {
      recommendCount.value--;
    }
    param = {
      articleId: article.id,
      recommendStatus: article.recommendStatus,
    };
  }
  try {
    await api.changeArticleStatus(param);
    notifySuccess("修改成功！");
  } catch (error) {
    console.log(error);
  }
};

const handleDelete = (item) => {
  $confirm("确认要删除这篇文章吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
    center: true,
  })
    .then(async () => {
      try {
        await api.deleteArticle(item.id);
        pagination.value.current = 1;
        await getArticles();
        notifySuccess("删除成功！");
      } catch (error) {
        console.log(error);
      }
    })
    .catch(() => {
      notifySuccess("已取消删除！");
    });
};

const handleEdit = (item) => {
  $router.push({ path: "/postEdit", query: { id: item.id } });
};

const closeOptions = (item) => {
  if (item === "recommendStatus") {
    fuzzyRecommendStatus.value?.blur();
  } else if (item === "recommendSort") {
    fuzzySort.value?.blur();
  } else {
    fuzzyLabel.value?.blur();
  }
};

const handleClear = (field) => {
  pagination.value[field] = null;
  getArticles();
};
</script>
