<template>
  <div class="ipad-compare">
    <header class="header">
      <button class="back-btn" @click="$router.push('/')">← 返回</button>
      <div class="header-icon">📟</div>
      <h1 class="title">iPad 参数对比</h1>
      <p class="subtitle">iPad 10 起全系列 · 二手性价比分析</p>
    </header>

    <!-- 推荐卡片 -->
    <section class="recommend-section">
      <h2 class="section-title">🏆 二手性价比推荐</h2>
      <div class="recommend-cards">
        <div class="rec-card best">
          <div class="rec-badge">最佳性价比</div>
          <div class="rec-model">iPad Air 5 (M1)</div>
          <div class="rec-price">二手参考 ¥2200-2800</div>
          <div class="rec-reasons">
            <span>✓ M1 芯片，性能越级</span>
            <span>✓ 全贴合屏幕</span>
            <span>✓ 支持 Apple Pencil 2</span>
            <span>✓ USB-C 接口</span>
          </div>
        </div>
        <div class="rec-card">
          <div class="rec-badge">预算之选</div>
          <div class="rec-model">iPad 10</div>
          <div class="rec-price">二手参考 ¥1800-2300</div>
          <div class="rec-reasons">
            <span>✓ A14 芯片够用</span>
            <span>✓ 全面屏设计</span>
            <span>✓ USB-C 接口</span>
            <span>✓ 价格最低</span>
          </div>
        </div>
        <div class="rec-card">
          <div class="rec-badge">生产力之选</div>
          <div class="rec-model">iPad Pro M2 (11寸)</div>
          <div class="rec-price">二手参考 ¥3800-4800</div>
          <div class="rec-reasons">
            <span>✓ M2 芯片，桌面级性能</span>
            <span>✓ 120Hz ProMotion</span>
            <span>✓ 雷雳接口</span>
            <span>✓ 妙控键盘支持</span>
          </div>
        </div>
      </div>
      <p class="rec-tip">💡 以上价格为 2025 年中二手市场参考价，实际价格因成色、存储容量而异</p>
    </section>

    <!-- 筛选 -->
    <section class="filter-section">
      <div class="filter-row">
        <button
          v-for="tier in tiers"
          :key="tier"
          class="filter-btn"
          :class="{ active: selectedTier === tier }"
          @click="selectedTier = tier"
        >{{ tier }}</button>
      </div>
    </section>

    <!-- 指定设备对比 -->
    <section class="select-section">
      <div class="select-header" @click="showSelector = !showSelector">
        <span>🎯 指定设备对比 <span class="selected-count" v-if="selectedModels.length">（已选 {{ selectedModels.length }} 台）</span></span>
        <span class="toggle-arrow" :class="{ open: showSelector }">▼</span>
      </div>
      <div class="select-body" v-show="showSelector">
        <div class="select-actions">
          <button class="action-btn" @click="selectAllModels">全选</button>
          <button class="action-btn" @click="clearModels">清空</button>
          <button class="action-btn" @click="selectTierModels('Pro')">只选Pro</button>
          <button class="action-btn" @click="selectTierModels('Air')">只选Air</button>
        </div>
        <div class="model-checkboxes">
          <label
            v-for="ipad in ipads"
            :key="ipad.model"
            class="checkbox-item"
            :class="{ checked: selectedModels.includes(ipad.model) }"
          >
            <input type="checkbox" :value="ipad.model" v-model="selectedModels" />
            <span class="cb-model">{{ ipad.model }}</span>
            <span class="cb-price">{{ ipad.price }}</span>
          </label>
        </div>
      </div>
    </section>

    <!-- 对比表 -->
    <section class="table-section">
      <div class="table-wrapper">
        <table class="spec-table">
          <thead>
            <tr>
              <th class="sticky-col">参数</th>
              <th v-for="ipad in filteredIpads" :key="ipad.model" :class="{ highlight: ipad.highlight }">
                <div class="ipad-header">
                  <div class="ipad-model">{{ ipad.model }}</div>
                  <div class="ipad-year">{{ ipad.year }}</div>
                  <div class="ipad-price">{{ ipad.price }}</div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="spec in specKeys" :key="spec.key">
              <td class="sticky-col spec-label">{{ spec.label }}</td>
              <td v-for="ipad in filteredIpads" :key="ipad.model" :class="{ highlight: ipad.highlight }">
                {{ ipad.specs[spec.key] }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- 选购建议 -->
    <section class="advice-section">
      <h2 class="section-title">📋 选购建议</h2>
      <div class="advice-cards">
        <div class="advice-card">
          <h3>📝 学生笔记</h3>
          <p><strong>iPad Air 5</strong> 是最佳选择，M1 性能充足，全贴合屏写字手感好，支持 Pencil 2 磁吸充电。预算紧选 iPad 10。</p>
        </div>
        <div class="advice-card">
          <h3>🎨 绘画 / 设计</h3>
          <p>必选 <strong>iPad Pro</strong>，120Hz 高刷对笔触延迟感知差异巨大。M2 芯片处理大文件游刃有余。11 寸便携，12.9 寸大屏更爽。</p>
        </div>
        <div class="advice-card">
          <h3>💰 纯预算导向</h3>
          <p>iPad 10 是底线，A14 能保证 3 年流畅使用。不建议买 iPad 9 及更早的 Lightning 机型，生态已经向 USB-C 转移。</p>
        </div>
        <div class="advice-card">
          <h3>🎬 影音娱乐</h3>
          <p><strong>iPad mini 6</strong> 小巧便携，A15 芯片性能不弱。iPad 10 也够用，屏幕大看得舒服。不需要 Pro 的高刷。</p>
        </div>
      </div>
    </section>

    <footer class="footer">
      <p>* 参数来源于 Apple 官方数据，价格为二手市场参考</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const selectedTier = ref('全部')
const showSelector = ref(false)
const selectedModels = ref([])

const tiers = ['全部', '数字系列', 'Air', 'mini', 'Pro']

function selectAllModels() {
  selectedModels.value = ipads.map(p => p.model)
}
function clearModels() {
  selectedModels.value = []
}
function selectTierModels(tier) {
  selectedModels.value = ipads.filter(p => p.tier === tier).map(p => p.model)
}

const specKeys = [
  { key: 'chip', label: '芯片' },
  { key: 'screen', label: '屏幕' },
  { key: 'size', label: '屏幕尺寸' },
  { key: 'refresh', label: '刷新率' },
  { key: 'ram', label: '运行内存' },
  { key: 'camera', label: '后置摄像头' },
  { key: 'storage', label: '存储选项' },
  { key: 'pencil', label: 'Apple Pencil' },
  { key: 'keyboard', label: '键盘支持' },
  { key: 'port', label: '接口' },
  { key: 'weight', label: '重量 (WiFi版)' },
  { key: 'battery', label: '续航' },
  { key: 'launchPrice', label: '首发价' },
]

const ipads = [
  {
    model: 'iPad 10',
    year: '2022.10',
    price: '¥1800-2300',
    tier: '数字系列',
    highlight: true,
    specs: {
      chip: 'A14 Bionic',
      screen: 'Liquid Retina',
      size: '10.9"',
      refresh: '60Hz',
      ram: '4GB',
      camera: '1200万广角',
      storage: '64/256GB',
      pencil: 'Pencil 1 (需转接)',
      keyboard: '妙控键盘双面夹',
      port: 'USB-C',
      weight: '477g',
      battery: '约10小时',
      launchPrice: '¥3599起'
    }
  },
  {
    model: 'iPad Air 5',
    year: '2022.3',
    price: '¥2200-2800',
    tier: 'Air',
    highlight: true,
    specs: {
      chip: 'M1',
      screen: 'Liquid Retina 全贴合',
      size: '10.9"',
      refresh: '60Hz',
      ram: '8GB',
      camera: '1200万广角',
      storage: '64/256GB',
      pencil: 'Pencil 2 磁吸',
      keyboard: '妙控键盘',
      port: 'USB-C',
      weight: '461g',
      battery: '约10小时',
      launchPrice: '¥4399起'
    }
  },
  {
    model: 'iPad Air 6 (M2)',
    year: '2024.5',
    price: '¥3200-3800',
    tier: 'Air',
    highlight: false,
    specs: {
      chip: 'M2',
      screen: 'Liquid Retina 全贴合',
      size: '11" / 13"',
      refresh: '60Hz',
      ram: '8GB',
      camera: '1200万广角',
      storage: '128/256/512/1TB',
      pencil: 'Pencil Pro',
      keyboard: '妙控键盘',
      port: 'USB-C',
      weight: '462g (11寸)',
      battery: '约10小时',
      launchPrice: '¥4799起'
    }
  },
  {
    model: 'iPad mini 6',
    year: '2021.9',
    price: '¥2000-2500',
    tier: 'mini',
    highlight: false,
    specs: {
      chip: 'A15 Bionic',
      screen: 'Liquid Retina 全贴合',
      size: '8.3"',
      refresh: '60Hz',
      ram: '4GB',
      camera: '1200万广角',
      storage: '64/256GB',
      pencil: 'Pencil 2 磁吸',
      keyboard: '不支持',
      port: 'USB-C',
      weight: '293g',
      battery: '约10小时',
      launchPrice: '¥3799起'
    }
  },
  {
    model: 'iPad mini 7 (A17 Pro)',
    year: '2024.10',
    price: '¥3000-3500',
    tier: 'mini',
    highlight: false,
    specs: {
      chip: 'A17 Pro',
      screen: 'Liquid Retina 全贴合',
      size: '8.3"',
      refresh: '60Hz',
      ram: '8GB',
      camera: '1200万广角',
      storage: '128/256/512GB',
      pencil: 'Pencil Pro',
      keyboard: '不支持',
      port: 'USB-C',
      weight: '293g',
      battery: '约10小时',
      launchPrice: '¥3999起'
    }
  },
  {
    model: 'iPad Pro M2 (11寸)',
    year: '2022.10',
    price: '¥3800-4800',
    tier: 'Pro',
    highlight: true,
    specs: {
      chip: 'M2',
      screen: 'Liquid Retina XDR (mini-LED on 12.9")',
      size: '11" / 12.9"',
      refresh: '120Hz ProMotion',
      ram: '8/16GB',
      camera: '1200万广角+1000万超广角',
      storage: '128/256/512/1TB/2TB',
      pencil: 'Pencil 2 磁吸 + 悬停',
      keyboard: '妙控键盘',
      port: '雷雳 / USB 4',
      weight: '466g (11寸)',
      battery: '约10小时',
      launchPrice: '¥6799起'
    }
  },
  {
    model: 'iPad Pro M4 (11寸)',
    year: '2024.5',
    price: '¥5800-6800',
    tier: 'Pro',
    highlight: false,
    specs: {
      chip: 'M4',
      screen: 'Ultra Retina XDR (串联OLED)',
      size: '11" / 13"',
      refresh: '120Hz ProMotion',
      ram: '8/16GB',
      camera: '1200万广角',
      storage: '256/512/1TB/2TB',
      pencil: 'Pencil Pro',
      keyboard: '妙控键盘',
      port: '雷雳 / USB 4',
      weight: '444g (11寸)',
      battery: '约10小时',
      launchPrice: '¥8999起'
    }
  }
]

const filteredIpads = computed(() => {
  let list = ipads
  if (selectedModels.value.length) {
    list = list.filter(p => selectedModels.value.includes(p.model))
  } else if (selectedTier.value !== '全部') {
    list = list.filter(p => p.tier === selectedTier.value)
  }
  return list
})
</script>

<style scoped>
.ipad-compare {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px 60px;
}

.header {
  text-align: center;
  padding: 40px 0 32px;
  position: relative;
}

.back-btn {
  position: absolute;
  left: 0;
  top: 44px;
  background: rgba(255,255,255,0.7);
  border: 1px solid rgba(255,255,255,0.9);
  border-radius: 12px;
  padding: 8px 16px;
  font-size: 14px;
  color: #6366f1;
  cursor: pointer;
  transition: all 0.2s;
  backdrop-filter: blur(8px);
}

.back-btn:hover {
  background: rgba(255,255,255,0.95);
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
}

.header-icon { font-size: 48px; margin-bottom: 12px; }
.title { font-size: 28px; font-weight: 700; color: #1e293b; margin: 0 0 8px; }
.subtitle { font-size: 15px; color: #64748b; margin: 0; }

.section-title { font-size: 20px; font-weight: 700; color: #1e293b; margin: 0 0 20px; }

.recommend-section { margin-bottom: 36px; }

.recommend-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin-bottom: 12px;
}

.rec-card {
  background: rgba(255,255,255,0.85);
  backdrop-filter: blur(12px);
  border-radius: 20px;
  padding: 24px;
  border: 1px solid rgba(255,255,255,0.9);
  box-shadow: 0 4px 24px rgba(0,0,0,0.04);
  transition: all 0.3s;
}

.rec-card:hover { transform: translateY(-3px); box-shadow: 0 8px 32px rgba(0,0,0,0.1); }

.rec-card.best {
  border-color: rgba(99,102,241,0.3);
  background: linear-gradient(135deg, rgba(238,242,255,0.9), rgba(224,231,255,0.9));
}

.rec-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 600;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  margin-bottom: 12px;
}

.rec-model { font-size: 22px; font-weight: 700; color: #1e293b; margin-bottom: 4px; }
.rec-price { font-size: 14px; color: #6366f1; font-weight: 600; margin-bottom: 14px; }
.rec-reasons { display: flex; flex-direction: column; gap: 6px; font-size: 13px; color: #475569; }
.rec-tip { font-size: 12px; color: #94a3b8; text-align: center; }

.filter-section { margin-bottom: 24px; }
.filter-row { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }

.filter-btn {
  padding: 8px 20px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.9);
  background: rgba(255,255,255,0.6);
  backdrop-filter: blur(8px);
  font-size: 14px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn:hover { background: rgba(255,255,255,0.9); }

.filter-btn.active {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  border-color: transparent;
  box-shadow: 0 2px 12px rgba(99,102,241,0.3);
}

.table-section { margin-bottom: 40px; }

.table-wrapper {
  overflow-x: auto;
  border-radius: 20px;
  background: rgba(255,255,255,0.85);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.9);
  box-shadow: 0 4px 24px rgba(0,0,0,0.04);
}

.spec-table { width: 100%; border-collapse: collapse; font-size: 13px; min-width: 900px; }

.spec-table th,
.spec-table td {
  padding: 14px 16px;
  text-align: center;
  border-bottom: 1px solid rgba(226,232,240,0.6);
  white-space: nowrap;
}

.spec-table th {
  background: rgba(248,250,252,0.8);
  font-weight: 600;
  color: #475569;
  position: sticky;
  top: 0;
  z-index: 2;
}

.sticky-col {
  position: sticky;
  left: 0;
  background: rgba(255,255,255,0.95);
  backdrop-filter: blur(8px);
  z-index: 1;
  text-align: left !important;
  font-weight: 600;
  color: #475569;
  min-width: 100px;
}

th.sticky-col { z-index: 3; background: rgba(248,250,252,0.95); }
.spec-label { font-weight: 600; color: #475569; }
.highlight { background: rgba(238,242,255,0.5); }

.ipad-header { display: flex; flex-direction: column; align-items: center; gap: 2px; }
.ipad-model { font-size: 13px; font-weight: 700; color: #1e293b; }
.ipad-year { font-size: 11px; color: #94a3b8; }
.ipad-price { font-size: 11px; color: #6366f1; font-weight: 600; }

.spec-table tbody tr:hover { background: rgba(248,250,252,0.6); }

.advice-section { margin-bottom: 40px; }
.advice-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; }

.advice-card {
  background: rgba(255,255,255,0.85);
  backdrop-filter: blur(12px);
  border-radius: 20px;
  padding: 24px;
  border: 1px solid rgba(255,255,255,0.9);
  box-shadow: 0 4px 24px rgba(0,0,0,0.04);
  transition: all 0.3s;
}

.advice-card:hover { transform: translateY(-3px); box-shadow: 0 8px 32px rgba(0,0,0,0.08); }
.advice-card h3 { font-size: 16px; margin: 0 0 10px; color: #1e293b; }
.advice-card p { font-size: 14px; color: #64748b; line-height: 1.7; margin: 0; }
.advice-card strong { color: #6366f1; }

.footer { text-align: center; font-size: 12px; color: #94a3b8; }

/* 指定设备选择器 */
.select-section { margin-bottom: 24px; }

.select-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  background: rgba(255,255,255,0.85);
  backdrop-filter: blur(12px);
  border-radius: 16px;
  border: 1px solid rgba(255,255,255,0.9);
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
  transition: all 0.2s;
}

.select-header:hover { background: rgba(255,255,255,0.95); }
.selected-count { color: #6366f1; font-weight: 700; }
.toggle-arrow { font-size: 12px; color: #94a3b8; transition: transform 0.3s; }
.toggle-arrow.open { transform: rotate(180deg); }

.select-body {
  margin-top: 12px;
  padding: 20px;
  background: rgba(255,255,255,0.85);
  backdrop-filter: blur(12px);
  border-radius: 20px;
  border: 1px solid rgba(255,255,255,0.9);
  box-shadow: 0 4px 24px rgba(0,0,0,0.04);
}

.select-actions { display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap; }

.action-btn {
  padding: 6px 14px;
  border-radius: 10px;
  border: 1px solid rgba(99,102,241,0.2);
  background: rgba(99,102,241,0.06);
  color: #6366f1;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover { background: rgba(99,102,241,0.15); }

.model-checkboxes {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 8px;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 12px;
  border: 1px solid rgba(226,232,240,0.6);
  cursor: pointer;
  transition: all 0.2s;
  font-size: 13px;
}

.checkbox-item:hover { background: rgba(248,250,252,0.8); }
.checkbox-item.checked { background: rgba(238,242,255,0.8); border-color: rgba(99,102,241,0.3); }
.checkbox-item input[type="checkbox"] { accent-color: #6366f1; width: 16px; height: 16px; flex-shrink: 0; }
.cb-model { font-weight: 600; color: #1e293b; flex: 1; }
.cb-price { font-size: 11px; color: #6366f1; }

@media (max-width: 768px) {
  .header { padding: 32px 0 24px; }
  .back-btn { position: static; margin-bottom: 12px; }
  .title { font-size: 22px; }
  .recommend-cards { grid-template-columns: 1fr; }
  .advice-cards { grid-template-columns: 1fr; }
}
</style>
