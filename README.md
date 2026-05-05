# Baby-Growth-Records-Front

宝宝疫苗接种规划表 — 前端项目

## 技术栈

- **框架**：Vue 3
- **构建工具**：Vite 6
- **路由**：Vue Router 4

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

前端默认运行在 `http://localhost:5173`，需要同时启动后端服务。

## 生产构建

```bash
npm run build
```

构建产物输出到 `dist/` 目录。

## 部署

### 方式一：Nginx 静态部署

1. 构建项目

```bash
npm run build
```

2. 将 `dist/` 目录上传到服务器，配置 Nginx

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/baby-front/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 代理后端 API
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

3. 重载 Nginx

```bash
nginx -s reload
```

### 方式二：phpStudy 部署（本地/开发环境）

1. 构建项目 `npm run build`
2. 将 `dist/` 目录内容复制到网站根目录（如 `E:\phpstudy_pro\WWW\baby\dist`）
3. 配置 phpStudy 的 Nginx/Apache 指向该目录
4. 确保后端 Laravel 服务已启动（`php artisan serve` 或通过 phpStudy 配置）

## 环境变量

API 地址在 `src/api/vaccine.js` 中配置，默认为 `http://localhost:8000/api`。部署时需根据实际后端地址修改。
