<template>
  <div class="main-container">
    <el-tag effect="dark" class="admin-title-tag">
      <img class="admin-title-tag-img" src="../../assets/svg/edit.svg" />
      统计信息
    </el-tag>
    <!-- 总览 -->
    <div class="main-container-item">
      <div class="main-container-item-content">
        <div class="main-container-item-content-item">
          <div class="history-name">总访问量:</div>
          <div class="history-value">
            {{ total_sum }}
          </div>
        </div>
        <div class="history-info">
          <div class="history-info-item">
            <div class="history-name">省份访问TOP10</div>
            <div>
              <el-table
                empty-text="暂无数据"
                :data="historyInfo.province_all_top"
              >
                <el-table-column type="index" width="60" />
                <el-table-column prop="province" label="省份" width="140" />
                <el-table-column prop="count" label="数量" width="100" />
              </el-table>
            </div>
          </div>
          <div class="history-info-item">
            <div class="history-name">IP访问TOP10</div>
            <div>
              <el-table empty-text="暂无数据" :data="historyInfo.ip_all_top">
                <el-table-column type="index" width="60" />
                <el-table-column prop="ip" label="IP" width="150" />
                <el-table-column prop="count" label="数量" width="100" />
              </el-table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 今日访问 -->
    <div class="main-container-item">
      <div class="main-container-item-content">
        <div class="main-container-item-content-item">
          <div class="history-name">今日访问量：</div>
          <div class="history-value">
            {{ today_sum }}
          </div>
        </div>
        <div class="history-info">
          <div class="history-info-item">
            <div class="history-name">今日访问IP统计</div>
            <div>
              <el-table empty-text="暂无数据" :data="historyInfo.today.ip">
                <el-table-column type="index" width="60" />
                <el-table-column prop="ip" label="IP" width="150" />
                <el-table-column prop="count" label="数量" width="100" />
              </el-table>
            </div>
          </div>
          <div class="history-info-item">
            <div class="history-name">今日访问省份统计</div>
            <div>
              <el-table
                empty-text="暂无数据"
                :data="historyInfo.today.province"
              >
                <el-table-column type="index" width="60" />
                <el-table-column prop="province" label="省份" width="140" />
                <el-table-column prop="count" label="数量" width="100" />
              </el-table>
            </div>
          </div>
          <div class="history-info-item">
            <div class="history-name">今日访问用户</div>
            <div class="history-avatar">
              <el-table empty-text="暂无数据" :data="historyInfo.today.users">
                <el-table-column label="头像" width="100">
                  <template v-slot="scope">
                    <el-avatar
                      class="user-avatar"
                      :size="30"
                      :src="scope.row.avatar || webInfo.avatar"
                    />
                  </template>
                </el-table-column>
                <el-table-column prop="userName" label="用户" width="200" />
              </el-table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 昨日访问 -->
    <div class="main-container-item">
      <div class="main-container-item-content">
        <div class="main-container-item-content-item">
          <div class="history-name">昨日访问量：</div>
          <div class="history-value">
            {{ yesterday_sum }}
          </div>
        </div>
        <div class="history-info">
          <div class="history-info-item">
            <div class="history-name">昨日访问IP统计</div>
            <div>
              <el-table empty-text="暂无数据" :data="historyInfo.yesterday.ip">
                <el-table-column type="index" width="60" />
                <el-table-column prop="ip" label="IP" width="150" />
                <el-table-column prop="count" label="数量" width="100" />
              </el-table>
            </div>
          </div>
          <div class="history-info-item">
            <div class="history-name">昨日访问省份统计</div>
            <div>
              <el-table
                empty-text="暂无数据"
                :data="historyInfo.yesterday.province"
              >
                <el-table-column type="index" width="60" />
                <el-table-column prop="province" label="省份" width="140" />
                <el-table-column prop="count" label="数量" width="100" />
              </el-table>
            </div>
          </div>
          <div class="history-info-item">
            <div class="history-name">昨日访问用户</div>
            <div class="history-avatar">
              <el-table
                empty-text="暂无数据"
                :data="historyInfo.yesterday.users"
              >
                <el-table-column label="头像" width="100">
                  <template v-slot="scope">
                    <el-avatar
                      class="user-avatar"
                      :size="30"
                      :src="scope.row.avatar || webInfo.avatar"
                    />
                  </template>
                </el-table-column>
                <el-table-column prop="userName" label="用户" width="200" />
              </el-table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import api from "@/api";
import { ref, onMounted, computed } from "vue";
import { useStore } from "@/stores";
import { useGlobalProperties } from "@/composables/useGlobalProperties";

const store = useStore();
const { $common } = useGlobalProperties();

const webInfo = computed(() => store.webInfo);
const currentAdmin = computed(() => store.currentAdmin);

const historyInfo = ref({
  yesterday: {
    ip: [],
    province: [],
    users: [],
  },
  today: {
    ip: [],
    province: [],
    users: [],
  },
});
const yesterday_sum = ref(0);
const today_sum = ref(0);
const total_sum = ref(0);

onMounted(() => {
  postProvinceAndCity();
  getHistoryInfo();
});

const getHistoryInfo = async () => {
  try {
    const res = await api.getIpInfo();
    if (!$common.isEmpty(res.result[0])) {
      historyInfo.value = res.result[0].data;
      yesterday_sum.value = res.result[0].yesterday_sum;
      today_sum.value = res.result[0].today_sum;
      total_sum.value = res.result[0].total_sum;
    }
  } catch (error) {
    console.log(error);
  }
};

const postProvinceAndCity = async () => {
  const res = await $common.getIpAndCity();

  try {
    await api.submitLocation({
      province: res.address,
      city: res.city,
      userId: currentAdmin.value.id,
    });
  } catch (error) {
    console.log(error);
  }
};
</script>
<style lang="scss" scoped>
.main-container {
  .admin-title-tag {
    img {
      vertical-align: -3px;
    }
  }

  .main-container-item {
    .main-container-item-content {
      .main-container-item-content-item {
        width: 400px;
        margin: 10px auto 0;
        display: flex;
        justify-content: center;

        .history-name {
          font-size: 18px;
          font-weight: bold;
          text-align: center;
          line-height: 35px;
        }

        .history-value {
          color: var(--maxLightRed);
          font-weight: bold;
          font-size: 30px;
          line-height: 35px;
        }
      }

      .history-info {
        display: flex;
        justify-content: space-between;
        margin-top: 20px;

        .history-info-item {
          display: flex;
          flex-direction: column;
          align-items: center;

          .history-name {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 10px;
            text-align: center;
          }

          :deep(.el-table) {
            max-height: 450px;
            overflow-y: auto;
          }
        }

        .history-avatar {
          :deep(.el-table .el-table__row .el-table__cell) {
            .cell {
              display: flex;
              align-items: center;
            }
          }
        }
      }
    }
  }
}
</style>
