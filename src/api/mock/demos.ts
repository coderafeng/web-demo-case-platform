import type {Demo} from '../types'

export const mockDemos: Demo[] = [
    {
        id: 'demo-table-merge',
        title: '表格合并单元格',
        description: '班级-学生表格合并展示，主从表数据合并单元格处理。展示嵌套数据（班级包含学生列表）的表格合并单元格处理，分页基于班级，前端实现平铺和合并。',
        categoryId: 'cat-ui',
        tagIds: ['tag-table', 'tag-element-plus'],
        component: 'TableMergeDemo',
        difficulty: 'intermediate',
        createdAt: '2026-01-15',
        updatedAt: '2026-01-18',
        author: '系统管理员',
        views: 156,
        likes: 24
    },
    {
        id: 'demo-virtual-scroll',
        title: '虚拟滚动列表',
        description: '大数据量下的虚拟滚动优化方案，提升页面性能。实现百万级数据的流畅滚动，支持动态高度和无限滚动。',
        categoryId: 'cat-performance',
        tagIds: ['tag-performance', 'tag-virtual-list'],
        component: 'VirtualScrollDemo',
        difficulty: 'advanced',
        createdAt: '2026-01-15',
        updatedAt: '2026-01-15',
        author: '前端专家',
        views: 89,
        likes: 18
    },
    {
        id: 'demo-drag-drop',
        title: '拖拽排序',
        description: '使用SortableJS实现的拖拽排序功能，支持多种列表类型。包括表格行拖拽、卡片拖拽、树形结构拖拽等。',
        categoryId: 'cat-interaction',
        tagIds: ['tag-drag', 'tag-sort'],
        component: 'DragDropDemo',
        difficulty: 'beginner',
        createdAt: '2026-01-15',
        updatedAt: '2026-01-15',
        author: '交互设计师',
        views: 123,
        likes: 31
    },
    {
        id: 'demo-charts',
        title: '图表展示',
        description: 'Echarts和Antv G2的对比使用，展示不同图表库的特点。包括折线图、柱状图、饼图、地图等多种图表类型。',
        categoryId: 'cat-data-viz',
        tagIds: ['tag-chart', 'tag-echarts'],
        component: 'ChartDemo',
        difficulty: 'intermediate',
        createdAt: '2026-01-15',
        updatedAt: '2026-01-15',
        author: '数据工程师',
        views: 210,
        likes: 42
    },
    {
        id: 'demo-form-validation',
        title: '表单验证',
        description: '复杂表单的验证规则实现，包括异步验证和自定义验证。支持动态表单、嵌套表单、表单联动等高级功能。',
        categoryId: 'cat-form',
        tagIds: ['tag-form', 'tag-element-plus'],
        component: 'FormValidationDemo',
        difficulty: 'intermediate',
        createdAt: '2026-01-15',
        updatedAt: '2026-01-15',
        author: '全栈开发',
        views: 167,
        likes: 28
    },
    {
        id: 'demo-file-upload',
        title: '文件上传',
        description: '大文件分片上传、断点续传和进度显示功能。支持多种文件类型，提供上传管理、预览和下载功能。',
        categoryId: 'cat-file',
        tagIds: ['tag-upload'],
        component: 'FileUploadDemo',
        difficulty: 'advanced',
        createdAt: '2026-01-15',
        updatedAt: '2026-01-15',
        author: '后端开发',
        views: 98,
        likes: 19
    },
    {
        id: 'demo-state-management',
        title: '状态管理',
        description: 'Pinia状态管理的最佳实践，包括模块化、持久化、类型安全等。',
        categoryId: 'cat-state',
        tagIds: ['tag-pinia', 'tag-vue'],
        component: 'StateManagementDemo',
        difficulty: 'intermediate',
        createdAt: '2026-01-15',
        updatedAt: '2026-01-15',
        author: '架构师',
        views: 145,
        likes: 36
    },
    {
        id: 'demo-routing-guards',
        title: '路由守卫',
        description: 'Vue Router路由守卫的实现，包括权限控制、页面拦截、路由动画等。',
        categoryId: 'cat-routing',
        tagIds: ['tag-vue'],
        component: 'RoutingGuardsDemo',
        difficulty: 'intermediate',
        createdAt: '2026-01-15',
        updatedAt: '2026-01-15',
        author: '安全专家',
        views: 112,
        likes: 22
    }
]

// 模拟数据查找函数
export const findDemoById = (id: string): Demo | undefined => {
    return mockDemos.find(demo => demo.id === id)
}

export const findDemosByCategory = (categoryId: string): Demo[] => {
    return mockDemos.filter(demo => demo.categoryId === categoryId)
}

export const findDemosByTag = (tagId: string): Demo[] => {
    return mockDemos.filter(demo => demo.tagIds.includes(tagId))
}

export const searchDemos = (keyword: string): Demo[] => {
    const lowerKeyword = keyword.toLowerCase()
    return mockDemos.filter(demo =>
        demo.title.toLowerCase().includes(lowerKeyword) ||
        demo.description.toLowerCase().includes(lowerKeyword)
    )
}