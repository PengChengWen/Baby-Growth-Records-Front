<template>
  <div class="iphone-compare">
    <header class="header">
      <button class="back-btn" @click="$router.push('/')">← 返回</button>
      <div class="header-icon">📱</div>
      <h1 class="title">苹果手机参数对比</h1>
      <p class="subtitle">iPhone 13 - 17 全系列 · 二手性价比分析 · 更新于 2026.5</p>
    </header>

    <!-- 推荐卡片 -->
    <section class="recommend-section">
      <h2 class="section-title">🏆 二手性价比推荐</h2>
      <div class="recommend-cards">
        <div class="rec-card best">
          <div class="rec-badge">最佳性价比</div>
          <div class="rec-model">iPhone 15 Pro</div>
          <div class="rec-price">二手参考 ¥3800-4500</div>
          <div class="rec-reasons">
            <span>✓ A17 Pro 芯片，支持 Apple Intelligence</span>
            <span>✓ 120Hz ProMotion + 常亮显示</span>
            <span>✓ USB-C 3.0 高速传输</span>
            <span>✓ 8GB 内存，流畅用 3 年+</span>
          </div>
        </div>
        <div class="rec-card">
          <div class="rec-badge">预算之选</div>
          <div class="rec-model">iPhone 13</div>
          <div class="rec-price">二手参考 ¥1400-1900</div>
          <div class="rec-reasons">
            <span>✓ A15 芯片依然够用</span>
            <span>✓ 续航不错</span>
            <span>✓ 价格最低</span>
            <span>✓ iOS 生态完整</span>
          </div>
        </div>
        <div class="rec-card">
          <div class="rec-badge">新品尝鲜</div>
          <div class="rec-model">iPhone 17</div>
          <div class="rec-price">全新 ¥6999 起</div>
          <div class="rec-reasons">
            <span>✓ A19 芯片，20% 快于 A18</span>
            <span>✓ 首次 ProMotion 高刷</span>
            <span>✓ 48MP 双 Fusion 摄像头</span>
            <span>✓ 256GB 起步</span>
          </div>
        </div>
      </div>
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
          <button class="action-btn" @click="selectTierModels('Pro 版')">只选Pro</button>
          <button class="action-btn" @click="selectTierModels('标准版')">只选标准</button>
          <button class="action-btn" @click="selectTierModels('Air')">只选Air</button>
        </div>
        <div class="model-checkboxes">
          <label
            v-for="phone in phones"
            :key="phone.model"
            class="checkbox-item"
            :class="{ checked: selectedModels.includes(phone.model) }"
          >
            <input type="checkbox" :value="phone.model" v-model="selectedModels" />
            <span class="cb-model">{{ phone.model }}</span>
            <span class="cb-price">{{ phone.price }}</span>
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
              <th v-for="phone in filteredPhones" :key="phone.model" :class="{ highlight: phone.highlight }">
                <div class="phone-header">
                  <div class="phone-model">{{ phone.model }}</div>
                  <div class="phone-year">{{ phone.year }}</div>
                  <div class="phone-price">{{ phone.price }}</div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="spec in specKeys" :key="spec.key">
              <td class="sticky-col spec-label">{{ spec.label }}</td>
              <td v-for="phone in filteredPhones" :key="phone.model" :class="{ highlight: phone.highlight }">
                {{ phone.specs[spec.key] }}
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
          <h3>🎮 游戏用户</h3>
          <p>预算充足选 <strong>iPhone 17 Pro</strong>，A19 Pro + 均热板散热，持续性能提升 40%。二手市场选 15 Pro，A17 Pro 依然强劲。</p>
        </div>
        <div class="advice-card">
          <h3>📸 拍照需求</h3>
          <p><strong>iPhone 17 Pro</strong> 三颗 48MP 摄像头 + 8x Fusion 变焦，是目前最强拍照 iPhone。预算有限选 16 Pro，5x 光学变焦也够用。</p>
        </div>
        <div class="advice-card">
          <h3>💰 二手性价比</h3>
          <p><strong>iPhone 15 Pro</strong> 是当前最佳二手选择，A17 Pro 支持 Apple Intelligence，8GB 内存，USB-C 3.0，¥3800-4500 性价比极高。</p>
        </div>
        <div class="advice-card">
          <h3>🔋 续航优先</h3>
          <p><strong>iPhone 17 Pro Max</strong> 史上最大电池。二手选 16 Pro Max 或 13 Pro Max，续航都是顶级水平。</p>
        </div>
        <div class="advice-card">
          <h3>🆕 想要最新</h3>
          <p><strong>iPhone Air</strong> 是全新产品线，5.6mm 极致轻薄钛金属机身，A19 Pro 芯片，适合追求时尚与性能的用户。</p>
        </div>
        <div class="advice-card">
          <h3>⚠️ 不建议买</h3>
          <p>iPhone 13 mini 电池太小，iPhone 14 系列无灵动岛且 Lightning 接口逐渐淘汰。<strong>iPhone 15 起</strong>才是安全底线。</p>
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

const tiers = ['全部', '标准版', 'Air', 'Pro 版', '大屏']

function selectAllModels() {
  selectedModels.value = phones.map(p => p.model)
}
function clearModels() {
  selectedModels.value = []
}
function selectTierModels(tier) {
  selectedModels.value = phones.filter(p => p.tier === tier).map(p => p.model)
}

const specKeys = [
  { key: 'chip', label: '芯片' },
  { key: 'screen', label: '屏幕' },
  { key: 'refresh', label: '刷新率' },
  { key: 'ram', label: '运行内存' },
  { key: 'camera', label: '主摄' },
  { key: 'telephoto', label: '长焦' },
  { key: 'battery', label: '电池容量' },
  { key: 'weight', label: '重量' },
  { key: 'storage', label: '存储选项' },
  { key: 'dynamicIsland', label: '灵动岛' },
  { key: 'alwaysOn', label: '常亮显示' },
  { key: 'usbc', label: 'USB-C' },
  { key: 'launchPrice', label: '首发价' },
]

const phones = [
  {
    model: 'iPhone 13',
    year: '2021.9',
    price: '¥1600-2100',
    tier: '标准版',
    highlight: true,
    specs: {
      chip: 'A15 (4核GPU)',
      screen: '6.1" OLED',
      refresh: '60Hz',
      ram: '4GB',
      camera: '1200万',
      telephoto: '无',
      battery: '3227mAh',
      weight: '173g',
      storage: '128/256/512GB',
      dynamicIsland: '❌',
      alwaysOn: '❌',
      usbc: '❌ Lightning',
      launchPrice: '¥5999起'
    }
  },
  {
    model: 'iPhone 13 mini',
    year: '2021.9',
    price: '¥1300-1700',
    tier: '标准版',
    highlight: false,
    specs: {
      chip: 'A15 (4核GPU)',
      screen: '5.4" OLED',
      refresh: '60Hz',
      ram: '4GB',
      camera: '1200万',
      telephoto: '无',
      battery: '2406mAh',
      weight: '140g',
      storage: '128/256/512GB',
      dynamicIsland: '❌',
      alwaysOn: '❌',
      usbc: '❌ Lightning',
      launchPrice: '¥5199起'
    }
  },
  {
    model: 'iPhone 13 Pro',
    year: '2021.9',
    price: '¥2200-2800',
    tier: 'Pro 版',
    highlight: true,
    specs: {
      chip: 'A15 (5核GPU)',
      screen: '6.1" OLED ProMotion',
      refresh: '120Hz',
      ram: '6GB',
      camera: '1200万',
      telephoto: '3x 光学',
      battery: '3095mAh',
      weight: '203g',
      storage: '128/256/512/1TB',
      dynamicIsland: '❌',
      alwaysOn: '❌',
      usbc: '❌ Lightning',
      launchPrice: '¥7999起'
    }
  },
  {
    model: 'iPhone 13 Pro Max',
    year: '2021.9',
    price: '¥2500-3200',
    tier: '大屏',
    highlight: false,
    specs: {
      chip: 'A15 (5核GPU)',
      screen: '6.7" OLED ProMotion',
      refresh: '120Hz',
      ram: '6GB',
      camera: '1200万',
      telephoto: '3x 光学',
      battery: '4352mAh',
      weight: '238g',
      storage: '128/256/512/1TB',
      dynamicIsland: '❌',
      alwaysOn: '❌',
      usbc: '❌ Lightning',
      launchPrice: '¥8999起'
    }
  },
  {
    model: 'iPhone 14',
    year: '2022.9',
    price: '¥2300-2800',
    tier: '标准版',
    highlight: false,
    specs: {
      chip: 'A15 (5核GPU)',
      screen: '6.1" OLED',
      refresh: '60Hz',
      ram: '6GB',
      camera: '1200万',
      telephoto: '无',
      battery: '3279mAh',
      weight: '172g',
      storage: '128/256/512GB',
      dynamicIsland: '❌',
      alwaysOn: '❌',
      usbc: '❌ Lightning',
      launchPrice: '¥5999起'
    }
  },
  {
    model: 'iPhone 14 Plus',
    year: '2022.9',
    price: '¥2600-3200',
    tier: '大屏',
    highlight: false,
    specs: {
      chip: 'A15 (5核GPU)',
      screen: '6.7" OLED',
      refresh: '60Hz',
      ram: '6GB',
      camera: '1200万',
      telephoto: '无',
      battery: '4325mAh',
      weight: '203g',
      storage: '128/256/512GB',
      dynamicIsland: '❌',
      alwaysOn: '❌',
      usbc: '❌ Lightning',
      launchPrice: '¥6999起'
    }
  },
  {
    model: 'iPhone 14 Pro',
    year: '2022.9',
    price: '¥3200-3800',
    tier: 'Pro 版',
    highlight: true,
    specs: {
      chip: 'A16',
      screen: '6.1" OLED ProMotion',
      refresh: '120Hz',
      ram: '6GB',
      camera: '4800万',
      telephoto: '3x 光学',
      battery: '3200mAh',
      weight: '206g',
      storage: '128/256/512/1TB',
      dynamicIsland: '✓',
      alwaysOn: '✓',
      usbc: '❌ Lightning',
      launchPrice: '¥7999起'
    }
  },
  {
    model: 'iPhone 14 Pro Max',
    year: '2022.9',
    price: '¥3800-4500',
    tier: '大屏',
    highlight: false,
    specs: {
      chip: 'A16',
      screen: '6.7" OLED ProMotion',
      refresh: '120Hz',
      ram: '6GB',
      camera: '4800万',
      telephoto: '3x 光学',
      battery: '4323mAh',
      weight: '240g',
      storage: '128/256/512/1TB',
      dynamicIsland: '✓',
      alwaysOn: '✓',
      usbc: '❌ Lightning',
      launchPrice: '¥8999起'
    }
  },
  {
    model: 'iPhone 15',
    year: '2023.9',
    price: '¥3200-3800',
    tier: '标准版',
    highlight: false,
    specs: {
      chip: 'A16',
      screen: '6.1" OLED',
      refresh: '60Hz',
      ram: '6GB',
      camera: '4800万',
      telephoto: '无 (2x 裁切)',
      battery: '3349mAh',
      weight: '171g',
      storage: '128/256/512GB',
      dynamicIsland: '✓',
      alwaysOn: '❌',
      usbc: '✓ USB 2.0',
      launchPrice: '¥5999起'
    }
  },
  {
    model: 'iPhone 15 Plus',
    year: '2023.9',
    price: '¥3800-4500',
    tier: '大屏',
    highlight: false,
    specs: {
      chip: 'A16',
      screen: '6.7" OLED',
      refresh: '60Hz',
      ram: '6GB',
      camera: '4800万',
      telephoto: '无 (2x 裁切)',
      battery: '4383mAh',
      weight: '201g',
      storage: '128/256/512GB',
      dynamicIsland: '✓',
      alwaysOn: '❌',
      usbc: '✓ USB 2.0',
      launchPrice: '¥6999起'
    }
  },
  {
    model: 'iPhone 15 Pro',
    year: '2023.9',
    price: '¥4500-5200',
    tier: 'Pro 版',
    highlight: false,
    specs: {
      chip: 'A17 Pro',
      screen: '6.1" OLED ProMotion',
      refresh: '120Hz',
      ram: '8GB',
      camera: '4800万',
      telephoto: '3x 光学',
      battery: '3274mAh',
      weight: '187g',
      storage: '128/256/512/1TB',
      dynamicIsland: '✓',
      alwaysOn: '✓',
      usbc: '✓ USB 3.0',
      launchPrice: '¥7999起'
    }
  },
  {
    model: 'iPhone 15 Pro Max',
    year: '2023.9',
    price: '¥5500-6500',
    tier: '大屏',
    highlight: false,
    specs: {
      chip: 'A17 Pro',
      screen: '6.7" OLED ProMotion',
      refresh: '120Hz',
      ram: '8GB',
      camera: '4800万',
      telephoto: '5x 光学',
      battery: '4422mAh',
      weight: '221g',
      storage: '256/512/1TB',
      dynamicIsland: '✓',
      alwaysOn: '✓',
      usbc: '✓ USB 3.0',
      launchPrice: '¥9999起'
    }
  },
  {
    model: 'iPhone 16',
    year: '2024.9',
    price: '¥4500-5200',
    tier: '标准版',
    highlight: false,
    specs: {
      chip: 'A18',
      screen: '6.1" OLED',
      refresh: '60Hz',
      ram: '8GB',
      camera: '4800万',
      telephoto: '无 (2x 裁切)',
      battery: '3561mAh',
      weight: '170g',
      storage: '128/256/512GB',
      dynamicIsland: '✓',
      alwaysOn: '❌',
      usbc: '✓ USB 2.0',
      launchPrice: '¥5999起'
    }
  },
  {
    model: 'iPhone 16 Plus',
    year: '2024.9',
    price: '¥5200-5800',
    tier: '大屏',
    highlight: false,
    specs: {
      chip: 'A18',
      screen: '6.7" OLED',
      refresh: '60Hz',
      ram: '8GB',
      camera: '4800万',
      telephoto: '无 (2x 裁切)',
      battery: '4674mAh',
      weight: '199g',
      storage: '128/256/512GB',
      dynamicIsland: '✓',
      alwaysOn: '❌',
      usbc: '✓ USB 2.0',
      launchPrice: '¥6999起'
    }
  },
  {
    model: 'iPhone 16 Pro',
    year: '2024.9',
    price: '¥6200-7000',
    tier: 'Pro 版',
    highlight: false,
    specs: {
      chip: 'A18 Pro',
      screen: '6.3" OLED ProMotion',
      refresh: '120Hz',
      ram: '8GB',
      camera: '4800万',
      telephoto: '5x 光学',
      battery: '3577mAh',
      weight: '199g',
      storage: '128/256/512/1TB',
      dynamicIsland: '✓',
      alwaysOn: '✓',
      usbc: '✓ USB 3.0',
      launchPrice: '¥7999起'
    }
  },
  {
    model: 'iPhone 16 Pro Max',
    year: '2024.9',
    price: '¥6500-7500',
    tier: '大屏',
    highlight: false,
    specs: {
      chip: 'A18 Pro',
      screen: '6.9" OLED ProMotion',
      refresh: '120Hz',
      ram: '8GB',
      camera: '4800万',
      telephoto: '5x 光学',
      battery: '4685mAh',
      weight: '227g',
      storage: '256/512/1TB',
      dynamicIsland: '✓',
      alwaysOn: '✓',
      usbc: '✓ USB 3.0',
      launchPrice: '¥9999起'
    }
  },
  {
    model: 'iPhone 17',
    year: '2025.9',
    price: '全新 ¥6999起',
    tier: '标准版',
    highlight: true,
    specs: {
      chip: 'A19',
      screen: '6.3" OLED ProMotion',
      refresh: '120Hz',
      ram: '8GB',
      camera: '48MP 双 Fusion',
      telephoto: '无 (2x 裁切)',
      battery: '未公布',
      weight: '未公布',
      storage: '256/512/1GB',
      dynamicIsland: '✓',
      alwaysOn: '❌',
      usbc: '✓ USB 2.0',
      launchPrice: '¥6999起'
    }
  },
  {
    model: 'iPhone Air',
    year: '2025.9',
    price: '全新 ¥8999起',
    tier: 'Air',
    highlight: true,
    specs: {
      chip: 'A19 Pro',
      screen: '6.5" OLED ProMotion',
      refresh: '120Hz',
      ram: '8GB',
      camera: '48MP Fusion',
      telephoto: '无',
      battery: '未公布',
      weight: '未公布',
      storage: '256/512/1GB',
      dynamicIsland: '✓',
      alwaysOn: '❌',
      usbc: '✓ USB 2.0',
      launchPrice: '¥8999起'
    }
  },
  {
    model: 'iPhone 17 Pro',
    year: '2025.9',
    price: '全新 ¥9999起',
    tier: 'Pro 版',
    highlight: true,
    specs: {
      chip: 'A19 Pro + 均热板',
      screen: '6.3" OLED ProMotion',
      refresh: '120Hz',
      ram: '12GB',
      camera: '48MP x3 三摄',
      telephoto: '4x 光学 / 8x Fusion',
      battery: '未公布',
      weight: '未公布',
      storage: '256/512/1TB/2TB',
      dynamicIsland: '✓',
      alwaysOn: '✓',
      usbc: '✓ USB 3.0',
      launchPrice: '¥9999起'
    }
  },
  {
    model: 'iPhone 17 Pro Max',
    year: '2025.9',
    price: '全新 ¥11999起',
    tier: '大屏',
    highlight: true,
    specs: {
      chip: 'A19 Pro + 均热板',
      screen: '6.9" OLED ProMotion',
      refresh: '120Hz',
      ram: '12GB',
      camera: '48MP x3 三摄',
      telephoto: '4x 光学 / 8x Fusion',
      battery: 'iPhone 史上最大',
      weight: '未公布',
      storage: '256/512/1TB/2TB',
      dynamicIsland: '✓',
      alwaysOn: '✓',
      usbc: '✓ USB 3.0',
      launchPrice: '¥11999起'
    }
  }
]

const filteredPhones = computed(() => {
  let list = phones
  if (selectedModels.value.length) {
    list = list.filter(p => selectedModels.value.includes(p.model))
  } else if (selectedTier.value !== '全部') {
    list = list.filter(p => p.tier === selectedTier.value)
  }
  return list
})
</script>

<style scoped>
.iphone-compare {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px 60px;
}

/* Header */
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

.header-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.title {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px;
}

.subtitle {
  font-size: 15px;
  color: #64748b;
  margin: 0;
}

/* Recommend */
.section-title {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 20px;
}

.recommend-section {
  margin-bottom: 36px;
}

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

.rec-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
}

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

.rec-model {
  font-size: 22px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4px;
}

.rec-price {
  font-size: 14px;
  color: #6366f1;
  font-weight: 600;
  margin-bottom: 14px;
}

.rec-reasons {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
  color: #475569;
}

.rec-tip {
  font-size: 12px;
  color: #94a3b8;
  text-align: center;
}

/* Filter */
.filter-section {
  margin-bottom: 24px;
}

.filter-row {
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
}

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

.filter-btn:hover {
  background: rgba(255,255,255,0.9);
}

.filter-btn.active {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  border-color: transparent;
  box-shadow: 0 2px 12px rgba(99,102,241,0.3);
}

/* Table */
.table-section {
  margin-bottom: 40px;
}

.table-wrapper {
  overflow-x: auto;
  border-radius: 20px;
  background: rgba(255,255,255,0.85);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.9);
  box-shadow: 0 4px 24px rgba(0,0,0,0.04);
}

.spec-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  min-width: 900px;
}

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

th.sticky-col {
  z-index: 3;
  background: rgba(248,250,252,0.95);
}

.spec-label {
  font-weight: 600;
  color: #475569;
}

.highlight {
  background: rgba(238,242,255,0.5);
}

.phone-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.phone-model {
  font-size: 13px;
  font-weight: 700;
  color: #1e293b;
}

.phone-year {
  font-size: 11px;
  color: #94a3b8;
}

.phone-price {
  font-size: 11px;
  color: #6366f1;
  font-weight: 600;
}

.spec-table tbody tr:hover {
  background: rgba(248,250,252,0.6);
}

/* Advice */
.advice-section {
  margin-bottom: 40px;
}

.advice-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}

.advice-card {
  background: rgba(255,255,255,0.85);
  backdrop-filter: blur(12px);
  border-radius: 20px;
  padding: 24px;
  border: 1px solid rgba(255,255,255,0.9);
  box-shadow: 0 4px 24px rgba(0,0,0,0.04);
  transition: all 0.3s;
}

.advice-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 32px rgba(0,0,0,0.08);
}

.advice-card h3 {
  font-size: 16px;
  margin: 0 0 10px;
  color: #1e293b;
}

.advice-card p {
  font-size: 14px;
  color: #64748b;
  line-height: 1.7;
  margin: 0;
}

.advice-card strong {
  color: #6366f1;
}

/* Footer */
.footer {
  text-align: center;
  font-size: 12px;
  color: #94a3b8;
}

/* Responsive */
@media (max-width: 768px) {
  .header {
    padding: 32px 0 24px;
  }
  .back-btn {
    position: static;
    margin-bottom: 12px;
  }
  .title {
    font-size: 22px;
  }
  .recommend-cards {
    grid-template-columns: 1fr;
  }
  .advice-cards {
    grid-template-columns: 1fr;
  }
}

/* 指定设备选择器 */
.select-section {
  margin-bottom: 24px;
}

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

.select-header:hover {
  background: rgba(255,255,255,0.95);
}

.selected-count {
  color: #6366f1;
  font-weight: 700;
}

.toggle-arrow {
  font-size: 12px;
  color: #94a3b8;
  transition: transform 0.3s;
}

.toggle-arrow.open {
  transform: rotate(180deg);
}

.select-body {
  margin-top: 12px;
  padding: 20px;
  background: rgba(255,255,255,0.85);
  backdrop-filter: blur(12px);
  border-radius: 20px;
  border: 1px solid rgba(255,255,255,0.9);
  box-shadow: 0 4px 24px rgba(0,0,0,0.04);
}

.select-actions {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

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

.action-btn:hover {
  background: rgba(99,102,241,0.15);
}

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

.checkbox-item:hover {
  background: rgba(248,250,252,0.8);
}

.checkbox-item.checked {
  background: rgba(238,242,255,0.8);
  border-color: rgba(99,102,241,0.3);
}

.checkbox-item input[type="checkbox"] {
  accent-color: #6366f1;
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.cb-model {
  font-weight: 600;
  color: #1e293b;
  flex: 1;
}

.cb-price {
  font-size: 11px;
  color: #6366f1;
}
</style>
