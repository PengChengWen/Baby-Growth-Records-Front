<template>
  <div class="vaccine-plan">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-screen">
      <div class="loading-spinner"></div>
      <p>加载疫苗接种数据...</p>
    </div>

    <!-- 顶部标题区域 -->
    <header class="header" v-show="!loading">
      <div class="header-content">
        <div class="baby-icon">💉</div>
        <h1 class="title">宝宝疫苗接种规划表</h1>
        <p class="subtitle">2026.4.19 出生 · 全周期免疫规划</p>
        <div class="stats-bar">
          <div class="stat-item" @click="filterStatus = 'all'" :class="{ active: filterStatus === 'all' }">
            <span class="stat-num">{{ vaccineList.length }}</span>
            <span class="stat-label">总规划</span>
          </div>
          <div class="stat-item" @click="filterStatus = '已完成'" :class="{ active: filterStatus === '已完成' }">
            <span class="stat-num completed-num">{{ completedCount }}</span>
            <span class="stat-label">已完成</span>
          </div>
          <div class="stat-item" @click="filterStatus = '待接种'" :class="{ active: filterStatus === '待接种' }">
            <span class="stat-num pending-num">{{ pendingCount }}</span>
            <span class="stat-label">待接种</span>
          </div>
          <div class="stat-item" @click="filterStatus = '已预约'" :class="{ active: filterStatus === '已预约' }">
            <span class="stat-num scheduled-num">{{ scheduledCount }}</span>
            <span class="stat-label">已预约</span>
          </div>
        </div>
      </div>
    </header>

    <!-- 时间线主体 -->
    <main class="timeline-container" v-show="!loading">
      <div class="timeline-line"></div>
      <div class="timeline-list">
        <div
          v-for="(item, index) in filteredList"
          :key="item.id"
          class="timeline-item"
          :class="[
            index % 2 === 0 ? 'left' : 'right',
            { completed: item.status === '已完成' },
            { 'animate-in': true }
          ]"
          :style="{ animationDelay: `${index * 0.08}s` }"
        >
          <div class="timeline-dot" :class="dotClass(item.status)">
            <span v-if="item.status === '已完成'">✓</span>
            <span v-else-if="item.status === '已预约'">📅</span>
            <span v-else-if="item.status === '已跳过'">⏭</span>
            <span v-else>💉</span>
          </div>
          <div class="card">
            <div class="card-header">
              <div class="age-badge">{{ item.age }}</div>
              <div class="date">{{ item.date }}</div>
              <!-- 状态下拉选择 -->
              <div class="status-selector" @click.stop>
                <select
                  :value="item.status"
                  :class="['status-select', statusSelectClass(item.status)]"
                  :disabled="updatingId === item.id"
                  @change="onStatusChange(item, $event.target.value)"
                >
                  <option value="待接种">待接种</option>
                  <option value="已预约">已预约</option>
                  <option value="已完成">已完成</option>
                  <option value="已跳过">已跳过</option>
                </select>
                <div v-if="updatingId === item.id" class="updating-overlay">
                  <div class="mini-spinner"></div>
                </div>
              </div>
            </div>
            <div class="card-body">
              <!-- 必打疫苗 -->
              <div class="vaccine-section" v-if="item.required_vaccines && item.required_vaccines !== '—'">
                <div class="section-label">
                  <span class="label-icon free-icon">免费</span>
                  国家免疫规划
                </div>
                <div class="vaccine-list">
                  <span
                    v-for="(v, i) in splitVaccines(item.required_vaccines)"
                    :key="i"
                    class="vaccine-tag required"
                  >{{ v }}</span>
                </div>
              </div>

              <!-- 自费疫苗 -->
              <div class="vaccine-section" v-if="item.optional_vaccines && item.optional_vaccines !== '—'">
                <div class="section-label">
                  <span class="label-icon paid-icon">自费</span>
                  强烈建议接种
                </div>
                <div class="vaccine-list">
                  <span
                    v-for="(v, i) in splitVaccines(item.optional_vaccines)"
                    :key="i"
                    class="vaccine-tag optional"
                  >{{ v }}</span>
                </div>
              </div>

              <!-- 费用信息 -->
              <div class="cost-section" v-if="item.cost && item.cost !== '—'">
                <span class="cost-icon">💰</span>
                <span class="cost-text">参考费用：{{ item.cost }} 元/针</span>
              </div>

              <!-- 备注 -->
              <div class="note-section" v-if="item.note">
                <span class="note-icon">📌</span>
                <span class="note-text">{{ item.note }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 底部说明 -->
    <footer class="footer" v-show="!loading">
      <div class="footer-content">
        <div class="legend">
          <div class="legend-item">
            <span class="legend-dot required-dot"></span>
            <span>国家免疫规划（免费）</span>
          </div>
          <div class="legend-item">
            <span class="legend-dot optional-dot"></span>
            <span>自费疫苗（强烈建议）</span>
          </div>
        </div>
        <p class="disclaimer">
          * 本规划表仅供参考，具体接种时间请以当地社区卫生服务中心/接种门诊安排为准。
        </p>
      </div>
    </footer>

    <!-- Toast 提示 -->
    <transition name="toast">
      <div v-if="toastMsg" class="toast" :class="toastType">
        {{ toastMsg }}
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { fetchVaccineRecords, updateVaccineRecord } from '../api/vaccine.js'

const vaccineList = ref([])
const loading = ref(true)
const filterStatus = ref('all')
const updatingId = ref(null)
const toastMsg = ref('')
const toastType = ref('success')

onMounted(async () => {
  try {
    vaccineList.value = await fetchVaccineRecords()
  } catch (e) {
    showToast('加载数据失败，请确认后端服务已启动', 'error')
  } finally {
    loading.value = false
  }
})

const filteredList = computed(() => {
  if (filterStatus.value === 'all') return vaccineList.value
  return vaccineList.value.filter(item => item.status === filterStatus.value)
})

const completedCount = computed(() =>
  vaccineList.value.filter(item => item.status === '已完成').length
)

const pendingCount = computed(() =>
  vaccineList.value.filter(item => item.status === '待接种').length
)

const scheduledCount = computed(() =>
  vaccineList.value.filter(item => item.status === '已预约').length
)

function splitVaccines(str) {
  if (!str || str === '—') return []
  return str.split('、').map(s => s.trim()).filter(Boolean)
}

function dotClass(status) {
  return {
    completed: status === '已完成',
    scheduled: status === '已预约',
    skipped: status === '已跳过'
  }
}

function statusSelectClass(status) {
  return {
    'status-done': status === '已完成',
    'status-pending': status === '待接种',
    'status-scheduled': status === '已预约',
    'status-skipped': status === '已跳过'
  }
}

async function onStatusChange(item, newStatus) {
  if (item.status === newStatus) return
  const oldStatus = item.status
  updatingId.value = item.id
  item.status = newStatus

  try {
    await updateVaccineRecord(item.id, { status: newStatus })
    showToast(`状态已更新为「${newStatus}」`, 'success')
  } catch (e) {
    item.status = oldStatus
    showToast('更新失败，请重试', 'error')
  } finally {
    updatingId.value = null
  }
}

function showToast(msg, type = 'success') {
  toastMsg.value = msg
  toastType.value = type
  setTimeout(() => { toastMsg.value = '' }, 2500)
}
</script>

<style scoped>
.vaccine-plan {
  max-width: 1200px;
  margin: 0 auto;
  padding-bottom: 60px;
}

/* ===== 加载状态 ===== */
.loading-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
  gap: 20px;
  color: #64748b;
  font-size: 15px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e2e8f0;
  border-top-color: #a78bfa;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ===== 顶部 Header ===== */
.header {
  text-align: center;
  padding: 48px 20px 32px;
  position: relative;
}

.header::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 3px;
  background: linear-gradient(90deg, #f472b6, #a78bfa, #60a5fa);
  border-radius: 2px;
}

.baby-icon {
  font-size: 48px;
  margin-bottom: 12px;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
}

.title {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px;
  letter-spacing: 1px;
}

.subtitle {
  font-size: 15px;
  color: #64748b;
  margin: 0 0 28px;
}

.stats-bar {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 24px;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  padding: 12px 24px;
  border-radius: 16px;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.8);
}

.stat-item:hover,
.stat-item.active {
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  transform: translateY(-2px);
}

.stat-num {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
}

.completed-num { color: #10b981; }
.pending-num { color: #f59e0b; }
.scheduled-num { color: #3b82f6; }

.stat-label {
  font-size: 13px;
  color: #94a3b8;
  margin-top: 4px;
}

/* ===== 时间线 ===== */
.timeline-container {
  position: relative;
  padding: 40px 20px;
}

.timeline-line {
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(to bottom, #e2e8f0, #c4b5fd, #f9a8d4, #e2e8f0);
  transform: translateX(-50%);
  border-radius: 2px;
}

.timeline-list {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.timeline-item {
  position: relative;
  display: flex;
  align-items: flex-start;
  animation: slideIn 0.5s ease forwards;
  opacity: 0;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.timeline-item.left {
  flex-direction: row;
  padding-right: calc(50% + 30px);
}

.timeline-item.right {
  flex-direction: row-reverse;
  padding-left: calc(50% + 30px);
}

.timeline-dot {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f9a8d4, #c4b5fd);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  z-index: 2;
  box-shadow: 0 0 0 4px rgba(196, 181, 253, 0.2);
  transition: all 0.3s ease;
}

.timeline-dot.completed {
  background: linear-gradient(135deg, #34d399, #10b981);
  box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.2);
}

.timeline-dot.scheduled {
  background: linear-gradient(135deg, #93c5fd, #3b82f6);
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2);
}

.timeline-dot.skipped {
  background: linear-gradient(135deg, #d1d5db, #9ca3af);
  box-shadow: 0 0 0 4px rgba(156, 163, 175, 0.2);
}

.card {
  flex: 1;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border-radius: 20px;
  padding: 20px 24px;
  border: 1px solid rgba(255, 255, 255, 0.9);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
  position: relative;
}

.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
}

.timeline-item.completed .card {
  border-color: rgba(16, 185, 129, 0.2);
  background: rgba(236, 253, 245, 0.85);
}

.timeline-item.left .card::after {
  content: '';
  position: absolute;
  top: 18px;
  right: -8px;
  width: 16px;
  height: 16px;
  background: rgba(255, 255, 255, 0.85);
  transform: rotate(45deg);
  border-right: 1px solid rgba(255, 255, 255, 0.9);
  border-top: 1px solid rgba(255, 255, 255, 0.9);
}

.timeline-item.right .card::after {
  content: '';
  position: absolute;
  top: 18px;
  left: -8px;
  width: 16px;
  height: 16px;
  background: rgba(255, 255, 255, 0.85);
  transform: rotate(45deg);
  border-left: 1px solid rgba(255, 255, 255, 0.9);
  border-bottom: 1px solid rgba(255, 255, 255, 0.9);
}

.timeline-item.completed .card::after {
  background: rgba(236, 253, 245, 0.85);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
  flex-wrap: wrap;
}

.age-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 14px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  background: linear-gradient(135deg, #fdf2f8, #ede9fe);
  color: #7c3aed;
}

.date {
  font-size: 13px;
  color: #94a3b8;
  font-weight: 500;
}

/* ===== 状态选择器 ===== */
.status-selector {
  margin-left: auto;
  position: relative;
}

.status-select {
  appearance: none;
  -webkit-appearance: none;
  padding: 4px 28px 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%2364748b' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
}

.status-select:hover {
  transform: scale(1.02);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.status-select:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(167, 139, 250, 0.3);
}

.status-select.status-done {
  background-color: #d1fae5;
  color: #065f46;
  border-color: #a7f3d0;
}

.status-select.status-pending {
  background-color: #fef3c7;
  color: #92400e;
  border-color: #fde68a;
}

.status-select.status-scheduled {
  background-color: #dbeafe;
  color: #1e40af;
  border-color: #bfdbfe;
}

.status-select.status-skipped {
  background-color: #f3f4f6;
  color: #4b5563;
  border-color: #d1d5db;
}

.updating-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 12px;
}

.mini-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid #e2e8f0;
  border-top-color: #a78bfa;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

/* ===== 卡片内容 ===== */
.card-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.vaccine-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.section-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
}

.label-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px 8px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 600;
}

.free-icon {
  background: #dbeafe;
  color: #1d4ed8;
}

.paid-icon {
  background: #fce7f3;
  color: #be185d;
}

.vaccine-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.vaccine-tag {
  display: inline-block;
  padding: 5px 12px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 500;
  line-height: 1.4;
}

.vaccine-tag.required {
  background: linear-gradient(135deg, #eff6ff, #dbeafe);
  color: #1e40af;
  border: 1px solid #bfdbfe;
}

.vaccine-tag.optional {
  background: linear-gradient(135deg, #fdf2f8, #fce7f3);
  color: #9d174d;
  border: 1px solid #fbcfe8;
}

.cost-section,
.note-section {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  font-size: 13px;
  color: #64748b;
  padding: 8px 12px;
  border-radius: 10px;
  background: rgba(248, 250, 252, 0.8);
}

.cost-icon,
.note-icon {
  flex-shrink: 0;
  font-size: 14px;
}

/* ===== Toast 提示 ===== */
.toast {
  position: fixed;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 28px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  z-index: 999;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

.toast.success {
  background: #ecfdf5;
  color: #065f46;
  border: 1px solid #a7f3d0;
}

.toast.error {
  background: #fef2f2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(-16px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-16px);
}

/* ===== 底部 Footer ===== */
.footer {
  padding: 40px 20px;
  text-align: center;
}

.footer-content {
  max-width: 600px;
  margin: 0 auto;
}

.legend {
  display: flex;
  justify-content: center;
  gap: 32px;
  margin-bottom: 20px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #64748b;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.required-dot {
  background: linear-gradient(135deg, #93c5fd, #3b82f6);
}

.optional-dot {
  background: linear-gradient(135deg, #f9a8d4, #ec4899);
}

.disclaimer {
  font-size: 12px;
  color: #94a3b8;
  line-height: 1.8;
  margin: 0;
}

/* ===== 响应式 ===== */
@media (max-width: 768px) {
  .timeline-line {
    left: 20px;
  }

  .timeline-item.left,
  .timeline-item.right {
    flex-direction: row;
    padding-left: 50px;
    padding-right: 0;
  }

  .timeline-dot {
    left: 20px;
    width: 30px;
    height: 30px;
    font-size: 12px;
  }

  .timeline-item.left .card::after,
  .timeline-item.right .card::after {
    left: -7px;
    right: auto;
  }

  .title {
    font-size: 22px;
  }

  .stats-bar {
    gap: 12px;
  }

  .stat-item {
    padding: 10px 18px;
  }

  .stat-num {
    font-size: 22px;
  }

  .card {
    padding: 16px;
    border-radius: 16px;
  }

  .card-header {
    gap: 8px;
  }

  .legend {
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }
}

@media (max-width: 480px) {
  .header {
    padding: 32px 16px 24px;
  }

  .baby-icon {
    font-size: 36px;
  }

  .title {
    font-size: 20px;
  }

  .stats-bar {
    gap: 10px;
  }

  .stat-item {
    padding: 8px 14px;
    border-radius: 12px;
  }

  .stat-num {
    font-size: 20px;
  }

  .timeline-container {
    padding: 24px 12px;
  }

  .timeline-list {
    gap: 20px;
  }

  .vaccine-tag {
    font-size: 12px;
    padding: 4px 10px;
  }
}
</style>
