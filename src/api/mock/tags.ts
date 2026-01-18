import type { Tag } from '../types'

export const mockTags: Tag[] = [
    // UI组件相关标签
    { id: 'tag-table', name: '表格', color: '#409EFF' },
    { id: 'tag-form', name: '表单', color: '#67C23A' },
    { id: 'tag-modal', name: '弹窗', color: '#E6A23C' },
    { id: 'tag-layout', name: '布局', color: '#F56C6C' },
    { id: 'tag-button', name: '按钮', color: '#909399' },
    { id: 'tag-card', name: '卡片', color: '#9B8DFF' },

    // 性能优化相关标签
    { id: 'tag-performance', name: '性能', color: '#FF6B93' },
    { id: 'tag-virtual-list', name: '虚拟列表', color: '#06D6A0' },
    { id: 'tag-lazy-load', name: '懒加载', color: '#118AB2' },
    { id: 'tag-code-split', name: '代码分割', color: '#EF476F' },
    { id: 'tag-cache', name: '缓存', color: '#FFD166' },

    // 交互体验相关标签
    { id: 'tag-drag', name: '拖拽', color: '#06D6A0' },
    { id: 'tag-sort', name: '排序', color: '#118AB2' },
    { id: 'tag-animation', name: '动画', color: '#EF476F' },
    { id: 'tag-gesture', name: '手势', color: '#FFD166' },
    { id: 'tag-keyboard', name: '键盘导航', color: '#073B4C' },

    // 数据可视化相关标签
    { id: 'tag-chart', name: '图表', color: '#EF476F' },
    { id: 'tag-analysis', name: '分析', color: '#409EFF' },
    { id: 'tag-echarts', name: 'Echarts', color: '#118AB2' },
    { id: 'tag-map', name: '地图', color: '#06D6A0' },
    { id: 'tag-data-viz', name: '数据可视化', color: '#FF6B93' },

    // 框架/库相关标签
    { id: 'tag-element-plus', name: 'Element Plus', color: '#409EFF' },
    { id: 'tag-vue', name: 'Vue', color: '#42b883' },
    { id: 'tailwind', name: 'Tailwind', color: '#38bdf8' },
    { id: 'tag-pinia', name: 'Pinia', color: '#ffd859' }
]

export const findTagById = (id: string): Tag | undefined => {
    return mockTags.find(tag => tag.id === id)
}