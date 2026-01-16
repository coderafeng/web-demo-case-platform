import {defineStore} from 'pinia'
import {ref} from 'vue'
import type {DemoItem} from '@/types/demo'

export const useDemoStore = defineStore('demo', () => {
    // 所有demo列表
    const demoList = ref<DemoItem[]>([
        {
            id: 'table-merge',
            title: '渲染分页数据，部分单元格做合并',
            description: '分页查询的数据，含有嵌套子数据。页面渲染的结果，其中部分单元格需要合并，用例以班级、老师、学生的数据关系做展示',
            category: 'UI组件',
            tags: ['表格', '合并单元格', 'ElementUI', '嵌套数据', '数据处理'],
            component: 'TableMergeDemo',
            difficulty: '高级',
            createdTime: '2026-01-15',
            updatedTime: '2026-01-17'
        },
        {
            id: 'virtual-scroll',
            title: '虚拟滚动列表',
            description: '大数据量下的虚拟滚动优化方案',
            category: '性能优化',
            tags: ['性能', '虚拟列表'],
            component: 'VirtualScrollDemo',
            difficulty: '高级',
            createdTime: '2026-01-15',
            updatedTime: '2026-01-15'
        },
        {
            id: 'drag-drop',
            title: '拖拽排序',
            description: '使用SortableJS实现的拖拽排序功能',
            category: '交互体验',
            tags: ['拖拽', '排序'],
            component: 'DragDropDemo',
            difficulty: '初级',
            createdTime: '2026-01-15',
            updatedTime: '2026-01-15'
        },
        {
            id: 'chart-demo',
            title: '图表展示',
            description: 'Echarts和Antv G2的对比使用',
            category: '数据可视化',
            tags: ['图表', 'Echarts'],
            component: 'ChartDemo',
            difficulty: '中级',
            createdTime: '2026-01-15',
            updatedTime: '2026-01-15'
        }
    ])

    // 当前查看的demo
    const currentDemo = ref<DemoItem | null>(null)

    // 根据ID获取demo
    const getDemoById = (id: string) => {
        return demoList.value.find(demo => demo.id === id) || null
    }

    // 按分类过滤
    const getDemosByCategory = (category: string) => {
        return demoList.value.filter(demo => demo.category === category)
    }

    // 搜索demo
    const searchDemos = (keyword: string) => {
        if (!keyword) return demoList.value
        const lowerKeyword = keyword.toLowerCase()
        return demoList.value.filter(demo =>
            demo.title.toLowerCase().includes(lowerKeyword) ||
            demo.description.toLowerCase().includes(lowerKeyword) ||
            demo.tags.some(tag => tag.toLowerCase().includes(lowerKeyword))
        )
    }

    return {
        demoList,
        currentDemo,
        getDemoById,
        getDemosByCategory,
        searchDemos
    }
})