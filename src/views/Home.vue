<template>
  <div class="home">
    <header class="header">
      <div class="logo">🧰</div>
      <h1 class="title">工具箱</h1>
      <p class="subtitle">实用小工具集合</p>
    </header>

    <div class="tools-grid">
      <div
        v-for="tool in tools"
        :key="tool.name"
        class="tool-card"
        @click="openTool(tool)"
      >
        <div class="tool-icon">{{ tool.icon }}</div>
        <div class="tool-info">
          <h2 class="tool-name">{{ tool.name }}</h2>
          <p class="tool-desc">{{ tool.desc }}</p>
          <span v-if="tool.link" class="tool-badge">新窗口打开</span>
        </div>
        <div class="tool-arrow">→</div>
      </div>
    </div>

    <footer class="footer">
      <p>持续更新中…</p>
    </footer>
  </div>
</template>

<script setup>
function openTool(tool) {
  if (tool.route) {
    window.location.href = tool.route
  } else if (tool.link) {
    window.open(tool.link, '_blank')
  }
}

const tools = [
  {
    icon: '💉',
    name: '宝宝疫苗接种规划',
    desc: '全周期免疫规划表，追踪接种进度',
    route: '/vaccine-plan'
  },
  {
    icon: '📱',
    name: '苹果手机参数对比',
    desc: 'iPhone 13 起全系列参数对比 & 二手性价比推荐',
    route: '/iphone-compare'
  },
  {
    icon: '📟',
    name: 'iPad 参数对比',
    desc: 'iPad 10 起全系列参数对比 & 二手性价比推荐',
    route: '/ipad-compare'
  },
  {
    icon: '🔐',
    name: '密码管理器',
    desc: '安全存储和管理你的密码',
    link: location.protocol + '//' + location.hostname + ':8080'
  },
  {
    icon: '🏖️',
    name: '躺平计算器',
    desc: '计算你需要多少钱才能躺平退休',
    link: location.protocol + '//' + location.hostname + ':81'
  }
]
</script>

<style scoped>
.home {
  max-width: 800px;
  margin: 0 auto;
  padding: 48px 20px 60px;
}

.header {
  text-align: center;
  margin-bottom: 48px;
}

.logo {
  font-size: 56px;
  margin-bottom: 12px;
}

.title {
  font-size: 32px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px;
}

.subtitle {
  font-size: 15px;
  color: #64748b;
  margin: 0;
}

.tools-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.tool-card {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px 28px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.9);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);
  cursor: pointer;
  transition: all 0.3s ease;
}

.tool-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.95);
}

.tool-icon {
  font-size: 40px;
  flex-shrink: 0;
}

.tool-info {
  flex: 1;
}

.tool-name {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 4px;
}

.tool-desc {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

.tool-badge {
  display: inline-block;
  margin-top: 6px;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 11px;
  background: rgba(99,102,241,0.1);
  color: #6366f1;
  font-weight: 500;
}

.tool-arrow {
  font-size: 20px;
  color: #94a3b8;
  flex-shrink: 0;
  transition: transform 0.3s ease;
}

.tool-card:hover .tool-arrow {
  transform: translateX(4px);
  color: #6366f1;
}

.footer {
  text-align: center;
  margin-top: 48px;
  font-size: 13px;
  color: #94a3b8;
}

@media (max-width: 480px) {
  .home {
    padding: 32px 16px 40px;
  }
  .title {
    font-size: 26px;
  }
  .tool-card {
    padding: 18px 20px;
  }
  .tool-icon {
    font-size: 32px;
  }
}
</style>
