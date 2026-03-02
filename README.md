# 探索宇宙 | Explore Universe Kids

一个面向儿童的太阳系科普应用，展示太阳系动态运行图，点击行星查看详细信息。

## 功能特性

- 🌞 太阳系动态运行图 - 行星绕太阳公转动画
- 🪐 点击行星展示详细信息（名称、大小、距离、特征等）
- 🔐 继承 Portal 认证体系
- 📱 响应式设计，支持桌面和移动设备
- ⚡ 纯静态前端，无需构建工具

## 技术栈

- HTML5
- CSS3 (动画、响应式布局)
- JavaScript (ES6+)
- 内置 JSON 数据（无外部 API 依赖）

## 本地运行

### 方式 1: Python
```bash
cd public
python3 -m http.server 8080
```

### 方式 2: Node.js serve
```bash
npx serve public -p 8080
```

访问: http://localhost:8080/space/

## 部署说明

此应用部署在 Portal 的 `/space/` 子路径下。

### Nginx 配置示例

```nginx
location /space/ {
    alias /var/www/html/space/;
    index index.html;
    try_files $uri $uri/ /space/index.html;
}
```

## 认证

应用检查 `portal_auth` cookie，未登录时会自动重定向到 `/login.html`。

## 浏览器支持

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- 移动浏览器 (iOS Safari, Chrome Mobile)

## 目录结构

```
explore-universe-kids/
├── public/
│   ├── index.html          # 主页面
│   ├── styles.css          # 样式与动画
│   ├── app.js              # 交互逻辑
│   └── data/
│       └── planets.json    # 行星数据
├── .gitignore
├── README.md
├── DELIVERY.md             # 交付文档
└── package.json
```

## 开发

如需 lint 检查：

```bash
npm install
npm run lint
```

## License

MIT