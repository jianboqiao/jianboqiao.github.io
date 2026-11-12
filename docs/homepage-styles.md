# 主页风格切换

在仓库根目录的 `_config.yml` 中修改这一项：

```yaml
homepage_style: "anleeno"
```

- `anleeno`：新风格，参考 Anleeno Academic，包含半透明导航、固定人物栏、紧凑论文列表、图片放大和返回顶部。
- `classic`：原来的 AcadHomepage 风格。

保存后提交并推送到 GitHub，等待原有的 GitHub Pages 构建完成。无需修改 Pages 的部署方式。本地使用 `bundle exec jekyll serve` 时，修改 `_config.yml` 后需要重启服务。

切换在 Jekyll 构建时完成。中文 `/` 和英文 `/en/` 会使用同一套选定主题；网站没有面向访客的风格切换器，也没有第二套主页地址。配置为空或填写其他值时回退到 `classic`。

## 内容维护

两套主题共用以下内容，不需要更新两份主题数据：

| 内容 | 文件 |
| --- | --- |
| 中文主页 | `_pages/about-zh.md` |
| 英文主页 | `_pages/about.md` |
| 姓名、头像、联系方式 | `_config.yml` 中的 `author` |
| 中英文导航 | `_data/navigation.yml` |
| 新主题界面文字 | `_data/theme_labels.yml` |

两个语言页面中的 `about-me`、`news`、`education`、`publications`、`honors`、`talks` 和 `academic-activities` 是导航定位标记。编辑内容时请保留这些标记。英文旧标题生成的锚点仍然保留。

## 主题代码

| 文件 | 用途 |
| --- | --- |
| `_layouts/default.html` | 根据配置选择主题 |
| `_includes/themes/classic.html` | 原主题页面结构 |
| `assets/css/main.scss` | 原主题样式 |
| `_includes/themes/anleeno.html` | 新主题页面结构 |
| `assets/css/anleeno.scss` | 新主题样式和响应式布局 |
| `assets/js/anleeno.js` | 新主题导航、图片放大和返回顶部 |

新主题是对 [Anleeno Academic](https://github.com/Anleeno/anleeno-academic) 的 Jekyll 适配，使用本站已有照片、论文和图片。没有引入其 React/Vite 构建流程、论文推荐服务、PDF 阅读器或 Scholar 引用抓取功能。两套主题继续优先使用微软雅黑。

代码许可见 [Anleeno Academic MIT License](../assets/licenses/anleeno-academic.txt)，此文件也会随网站一起发布。
