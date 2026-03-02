# TASK.md - 探索宇宙 (explore-universe-kids)

**任务 ID:** 2026-03-02-explore-universe  
**L3 执行模型:** Claude Code（强制：只能用 Claude Code；失败需报错排查，无法解决则通知 Eric）  
**优先级:** 正常  
**预估耗时:** 2-4 小时

---

## 0. 开工前必读（硬规则）
1) 先阅读：
   - `/Users/ericmr/.openclaw/workspace/RUNBOOK-APP-HOME-PORTAL.md`
   - `/Users/ericmr/.openclaw/workspace/TIPS-CODING-ASSISTANT.md`
2) 禁止直接改生产（VPS/Nginx/systemd/安全组）；只交付代码 + 命令清单。
3) 必须支持子路径 base path：`/space/`（路由/静态资源/数据加载均不能 404）。
4) 无 `portal_auth` → 跳转 `/login.html`。
5) 过程性进度通知统一发 Telegram 群：`-5183032732`。

## 1. 任务目标

为 app-Home-Portal 创建子应用『探索宇宙』，部署于 `/space/` 子路径，提供：
- 太阳系动态运行图（行星绕太阳公转动画）
- 点击行星展示基本信息（名称、大小、距离、特征等）
- 继承 portal 认证体系（未登录跳转 `/login.html`）
- 在门户首页增加卡片入口

---

## 2. 技术选型建议

### 推荐方案：纯静态前端 (Vanilla JS + HTML + CSS)

**理由:**
- 无需构建工具，直接部署静态资源
- 天然支持 `/space/` base path（相对路径引用）
- 无依赖，加载快，缓存友好
- 易于维护和扩展

**技术栈:**
- **HTML5:** 单页结构
- **CSS3:** 行星轨道动画（`@keyframes` + `transform`）
- **JavaScript (ES6+):** 点击交互、数据展示
- **数据源:** 内置 JSON（`data/planets.json`），不依赖外部 API

**目录结构:**
```
explore-universe-kids/
├── public/
│   ├── index.html          # 主页面
│   ├── styles.css          # 样式与动画
│   ├── app.js              # 交互逻辑
│   └── data/
│       └── planets.json    # 行星数据（内置）
├── .gitignore
├── README.md
└── package.json            # 仅用于 lint 脚本（可选）
```

---

## 3. 变更范围/文件清单

### 3.1 新仓库：explore-universe-kids

| 文件 | 说明 |
|------|------|
| `public/index.html` | 主页面，含太阳系画布、行星元素、信息弹窗 |
| `public/styles.css` | 轨道样式、动画 keyframes、响应式布局 |
| `public/app.js` | 行星数据加载、点击事件、弹窗控制 |
| `public/data/planets.json` | 8 大行星 + 冥王星数据（名称、大小、轨道半径、公转周期、颜色、描述） |
| `.gitignore` | 忽略 node_modules、.DS_Store 等 |
| `README.md` | 项目说明、部署指引 |

### 3.2 Portal 侧变更：app-Home-Portal

| 文件 | 变更内容 |
|------|----------|
| `public/config/apps.json` | 新增卡片配置项（见下方示例） |

**apps.json 变更示例:**
```json
{
  "apps": [
    // ... 现有应用
    {
      "name": "探索宇宙",
      "path": "/space/",
      "icon": "🪐",
      "description": "太阳系动态运行图，点击行星了解宇宙奥秘",
      "authRequired": true
    }
  ]
}
```

---

## 4. 交付门禁

### 4.1 代码质量检查

```bash
cd explore-universe-kids

# 若使用 ESLint（可选）
pnpm install  # 仅安装 devDependencies（eslint 等）
pnpm lint

# 若无构建工具，跳过此步
```

### 4.2 本地 Smoke Test

```bash
# 方式 1: 使用 Python 快速启动静态服务器
cd public
python3 -m http.server 8080

# 方式 2: 使用 npx serve
npx serve public -p 8080
```

**访问 URL:** `http://localhost:8080/space/`  
**预期:**
- [ ] 页面加载正常，太阳居中，行星沿轨道运行
- [ ] 点击行星弹出信息框（名称、描述）
- [ ] 关闭弹窗功能正常
- [ ] 响应式布局（手机/桌面均正常）

### 4.3 认证集成测试

```bash
# 在 Portal 环境下测试（需已部署）

# 测试 1: 未登录访问 /space/ → 应重定向到 /login.html
curl -I http://<portal-domain>/space/

# 测试 2: 登录后访问 → 应正常展示
# 手动浏览器测试
```

### 4.4 人类验收步骤

1. **视觉验收:**
   - [ ] 太阳位于中心，颜色/大小合理
   - [ ] 8 大行星轨道半径递进，视觉清晰
   - [ ] 动画流畅（60fps），无卡顿
   - [ ] 行星颜色与真实特征接近（火星红色、地球蓝色等）

2. **交互验收:**
   - [ ] 点击任意行星，弹出信息框
   - [ ] 信息框内容准确（名称、距离、特征等）
   - [ ] 点击弹窗外区域或关闭按钮可关闭弹窗
   - [ ] 多个行星点击无冲突

3. **集成验收:**
   - [ ] 在 Portal 首页可见『探索宇宙』卡片
   - [ ] 点击卡片跳转到 `/space/`
   - [ ] 未登录时访问 `/space/` 重定向到登录页
   - [ ] 登录后正常访问

4. **性能验收:**
   - [ ] 首屏加载时间 < 2s（本地测试）
   - [ ] 动画无掉帧（Chrome DevTools Performance）
   - [ ] 移动端（iPhone/Android）正常显示

---

## 5. 需要执行的命令清单

### 5.1 创建仓库与初始提交

```bash
# 创建本地目录
mkdir -p explore-universe-kids/public/data
cd explore-universe-kids

# 初始化 Git
git init
git checkout -b main

# 创建 .gitignore
cat > .gitignore << 'EOF'
node_modules/
.DS_Store
*.log
EOF

# 创建 package.json（仅用于可选的 lint 脚本）
cat > package.json << 'EOF'
{
  "name": "explore-universe-kids",
  "version": "1.0.0",
  "description": "太阳系动态运行图 - 儿童科普应用",
  "scripts": {
    "lint": "eslint public/*.js || true",
    "dev": "npx serve public -p 8080"
  },
  "devDependencies": {
    "eslint": "^8.0.0"
  }
}
EOF

# 创建核心文件（内容略，由 Claude Code 编写）
# public/index.html
# public/styles.css
# public/app.js
# public/data/planets.json
# README.md

# 初始提交
git add .
git commit -m "feat: 初始版本 - 太阳系动态运行图 MVP"

# 创建 GitHub 仓库
gh repo create explore-universe-kids --public --source=. --remote=origin --push
```

### 5.2 Portal 侧变更

```bash
cd app-Home-Portal

# 编辑 apps.json（手动或使用 jq）
# 在 apps 数组末尾添加新卡片配置

# 示例：使用 jq 追加（假设 apps.json 结构为 {"apps": [...]}）
# jq '.apps += [{"name":"探索宇宙","path":"/space/","icon":"🪐","description":"太阳系动态运行图，点击行星了解宇宙奥秘","authRequired":true}]' \
#   public/config/apps.json > public/config/apps.json.tmp && \
#   mv public/config/apps.json.tmp public/config/apps.json

# 提交变更
git add public/config/apps.json
git commit -m "feat: 添加探索宇宙应用入口"
git push
```

### 5.3 部署到 VPS（L2 主会话执行）

```bash
# 在 VPS 上操作（由主会话执行，L3 不直接操作生产）

# 1. 克隆新仓库到 VPS
cd /var/www/html
git clone https://github.com/<org>/explore-universe-kids.git space

# 2. 配置 Nginx（由主会话确认配置位置）
# 在现有 Portal 配置中增加 /space/ location

# 3. 重启 Nginx（如需要）
sudo systemctl reload nginx

# 4. 验证访问
curl -I https://<portal-domain>/space/
```

---

## 6. 风险点与回滚点

### 6.1 风险点

| 风险 | 影响 | 缓解措施 |
|------|------|----------|
| **Portal apps.json 格式错误** | 门户首页卡片加载失败 | 提交前用 `jq` 或 JSON 校验工具验证格式 |
| **Nginx 配置错误** | `/space/` 路径 404 或 500 | 先备份 Nginx 配置，修改后 `nginx -t` 验证 |
| **静态资源缓存** | 更新后用户仍看到旧版本 | 在资源 URL 后加版本查询参数（如 `?v=1.0.0`）或配置 Nginx 缓存策略 |
| **认证逻辑冲突** | 未登录用户未正确重定向 | 在测试环境充分验证认证流程 |
| **移动端兼容性问题** | 手机用户无法正常显示 | 使用响应式设计，在 Chrome DevTools 中模拟多设备测试 |
| **动画性能问题** | 低性能设备掉帧 | 减少 DOM 节点数量，使用 CSS transform 而非位置变化，限制轨道数量 |

### 6.2 回滚点

**Portal 侧回滚:**
```bash
cd app-Home-Portal
git revert HEAD  # 回滚 apps.json 变更
git push
# 通知主会话重新部署或等待 CI/CD 自动部署
```

**Nginx 回滚（由主会话执行）:**
```bash
# 恢复备份的 Nginx 配置
sudo cp /etc/nginx/sites-available/portal.bak /etc/nginx/sites-available/portal
sudo systemctl reload nginx
```

**子应用回滚:**
```bash
# 在 VPS 上移除 /space/ 目录
cd /var/www/html
rm -rf space  # 或使用 trash 命令
```

---

## 7. 注意事项

### 7.1 Base Path `/space/` 处理

- 所有资源引用使用**相对路径**或**以 `/space/` 开头**
- 示例:
  ```html
  <!-- 正确 -->
  <link rel="stylesheet" href="./styles.css">
  <script src="./app.js"></script>
  <img src="./data/planets.json">
  
  <!-- 或使用绝对路径 -->
  <link rel="stylesheet" href="/space/styles.css">
  ```

### 7.2 行星数据建议

- 内置 JSON，不依赖外部 API（避免 CORS、网络延迟、API 失效等问题）
- 数据字段建议:
  ```json
  {
    "name": "地球",
    "nameEn": "Earth",
    "radius": 6371,
    "distanceFromSun": 149600000,
    "orbitalPeriod": 365.25,
    "color": "#6b93d6",
    "size": "medium",
    "description": "我们居住的蓝色星球，唯一已知存在生命的行星。"
  }
  ```

### 7.3 动画实现建议

- 使用 CSS `@keyframes` 实现公转动画
- 每个行星独立的动画 duration（根据公转周期比例）
- 使用 `transform-origin` 控制轨道中心点
- 示例:
  ```css
  @keyframes orbit {
    from { transform: rotate(0deg) translateX(100px) rotate(0deg); }
    to   { transform: rotate(360deg) translateX(100px) rotate(-360deg); }
  }
  ```

---

## 8. 验收后清理

- [ ] 确认 smoke test 通过
- [ ] 确认 Portal 集成正常
- [ ] 确认认证重定向正常
- [ ] 通知 L2 主会话进行生产部署
- [ ] 更新 README.md 添加部署截图

---

**任务结束。** 完成后向 L2 主会话汇报执行结果。
