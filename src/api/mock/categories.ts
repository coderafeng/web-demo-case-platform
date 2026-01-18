import type { Category } from '../types'

export const mockCategories: Category[] = [
    {
        id: 'cat-ui',
        name: 'UI组件',
        description: '各种UI组件的实现和优化方案',
        icon: 'ElementPlus',
        color: '#409EFF',
        order: 1
    },
    {
        id: 'cat-performance',
        name: '性能优化',
        description: '前端性能优化方案和实践',
        icon: 'TrendCharts',
        color: '#67C23A',
        order: 2
    },
    {
        id: 'cat-interaction',
        name: '交互体验',
        description: '提升用户体验的交互效果',
        icon: 'Pointer',
        color: '#E6A23C',
        order: 3
    },
    {
        id: 'cat-data-viz',
        name: '数据可视化',
        description: '图表和数据展示方案',
        icon: 'PieChart',
        color: '#F56C6C',
        order: 4
    },
    {
        id: 'cat-form',
        name: '表单处理',
        description: '表单相关功能和验证实现',
        icon: 'Document',
        color: '#909399',
        order: 5
    },
    {
        id: 'cat-file',
        name: '文件处理',
        description: '文件上传下载和处理方案',
        icon: 'UploadFilled',
        color: '#9B8DFF',
        order: 6
    },
    {
        id: 'cat-state',
        name: '状态管理',
        description: 'Vue状态管理方案',
        icon: 'Setting',
        color: '#FF6B93',
        order: 7
    },
    {
        id: 'cat-routing',
        name: '路由导航',
        description: '路由和导航相关实现',
        icon: 'Link',
        color: '#06D6A0',
        order: 8
    }
]

export const findCategoryById = (id: string): Category | undefined => {
    return mockCategories.find(cat => cat.id === id)
}