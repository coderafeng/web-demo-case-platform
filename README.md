# Vue3 测试研究平台

一个用于存放各种Vue3测试和研究demo的平台，使用最新的Vue3技术栈。
- 每个demo以卡片形式展示，可以独立运行
- 提供完整的实现说明，具有良好的代码组织和注释
- 便于扩展和维护

## 技术栈

- Vue 3.5
- Vite 5
- TypeScript 5
- Element Plus
- Pinia
- Vue Router 4

## 功能特性

1. **卡片式Demo管理**：每个测试demo以卡片形式展示
2. **分类筛选**：按类别筛选demo
3. **搜索功能**：快速查找demo
4. **详情展示**：每个demo有独立的详情页
5. **代码查看**：支持查看demo源代码

## 已实现Demo

1. **表格合并单元格**：班级-学生表格的合并单元格处理
2. **虚拟滚动列表**：大数据量优化方案（占位）
3. **拖拽排序**：使用SortableJS实现（占位）
4. **图表展示**：Echarts和Antv G2对比（占位）

## 项目结构

```text
src/
├── api/
│   ├── index.ts              # API 总出口
│   ├── http.ts               # Axios 配置
│   ├── types.ts              # API 类型定义
│   ├── demos.ts              # Demo API
│   ├── categories.ts         # 分类 API
│   ├── tags.ts               # 标签 API
│   ├── classes.ts            # 班级 API
│   ├── students.ts           # 学生 API
│   └── mock/                 # 模拟数据
│       ├── index.ts          # 模拟数据总出口
│       ├── demos.ts          # Demo 模拟数据
│       ├── categories.ts     # 分类模拟数据
│       ├── tags.ts           # 标签模拟数据
│       ├── classes.ts        # 班级模拟数据
│       └── students.ts       # 学生模拟数据
├── components/ # 组件目录
│   └── demos/                # 技术研究demo用例展示
│       ├── TableMergeDemo.vue  # 分页查询列表，含有嵌套数组数据，渲染时部分单元格做合并操作
│       ├── VirtualScrollDemo.vue  # 大数据量下的虚拟滚动列表优化方案，提升页面性能
├── views/ # 页面组件
│   ├── DemoDetail.vue       # demo演示详情
│   ├── Home.vue       # 主页面，每个卡片式容器代表一个demo用例（flex布局）
├── stores/ # Pinia状态管理
├── router/ # 路由配置
├── types/ # TypeScript类型定义
├── styles/ # 样式文件
└── utils/ # 工具函数
```

## 快速开始

1、安装依赖
```bash
pnpm install
```

2、启动开发服务器
```bash
pnpm run dev
```

3、访问：http://localhost:3000

## 添加新Demo

1. 在 `stores/demo.ts` 中添加demo信息
2. 在 `components/demos/` 目录下创建组件
3. 组件会自动注册并展示在首页

