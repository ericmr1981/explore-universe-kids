# RUNBOOK — App Home Portal 新增子应用（给 Coding Assistant / Claude Code）

> 目的：把“门户加入口/新增 app”的默认流程固化，让执行型 agent 不需要理解上下文也能稳定交付。

## 0. 适用范围
- Portal：`ericmr1981/app-Home-Portal`
- 部署形态：VPS + Nginx，子应用挂载到子路径（如 `/space/`）
- 登录：继承 Portal cookie `portal_auth`

## 1. 执行原则（硬规则）
1) **禁止直接改生产**：不要改 VPS/Nginx/systemd/安全组；只交付代码 + 命令清单 + 变更说明。
2) **子路径优先**：应用必须支持 base path（例如 `/space/`），路由/资源引用必须在子路径下正确工作。
3) **未登录处理**：检测不到 `portal_auth` 时，跳转到 **`/login.html`**（Portal 登录页）。
4) **入口配置唯一来源**：Portal 入口只通过 `app-Home-Portal/public/config/apps.json` 增加卡片。
5) **不依赖外部服务**：MVP 默认内置数据（JSON/静态资源），除非任务单明确允许引入 API。
6) **L3 强制限制**：标准流程里的 L3 执行器必须是 **Claude Code**（`claude` CLI）。
   - 若启动/调用失败：先给出错误与排查修复；仍不行则通知 Eric，**不得私自切换到其他 coding agent**。
7) **L3 标准执行形态（推荐/默认）**：使用 **tmux 承载 Claude Code**，并在 **iTerm/iTerm2** 中 `tmux attach` 展示开发进度与状态（监控窗口）。
   - 参考手册：`/Users/ericmr/.openclaw/workspace/knowledge/L3-ClaudeCode-tmux-iTerm.md`
## 2. 目录/文件约定（推荐）
- 静态站点优先（最省事、最稳定）：
  - `public/index.html`
  - `public/styles.css`
  - `public/app.js`
  - `public/data/*.json`

## 3. Base Path 常见坑（必须自查）
- 不要用以 `/` 开头的资源绝对路径（例如 `/styles.css`），要用相对路径或根据 base path 拼接。
- JS 里构造链接时，使用 `new URL('./xxx', import.meta.url)` 或相对路径策略，避免部署到 `/space/` 时资源 404。
- 确保任何 `fetch('data/planets.json')` 这种路径在 `/space/` 下仍能加载。

## 4. Portal apps.json（必须保持 JSON 合法）
- 修改前先格式化/校验 JSON。
- 新卡片字段建议：`id`, `name`, `description`, `path`, `icon`, `tags`。

## 5. 交付门禁（必须全部通过才算完成）
- 本地可运行（至少 `python3 -m http.server` 级别）
- 关键路径 smoke test：
  - 直接访问 `/space/` 应正常渲染
  - 未登录时跳 `/login.html`
  - 点击入口/行星等交互正常
- 输出：
  - 变更文件清单
  - 关键实现说明（短）
  - 3~7 条人类验收步骤

## 6. 通知路由（Eric 偏好）
- **过程性通知**（进度/里程碑/构建部署状态）统一发到 Telegram 群：`-5183032732`。
- 私聊只保留：关键确认 + 最终交付。
