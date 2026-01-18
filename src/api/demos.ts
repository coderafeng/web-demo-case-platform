import http, { createMockResponse, createMockPagination, mockDelay, mockError } from './http'
import type { ApiResponse, GetDemosParams } from './types'
import type { Demo, DemoWithRelations, Stats } from './types'
import { mockDemos, findDemoById, findDemosByCategory, findDemosByTag, searchDemos } from './mock/demos'
import { mockCategories } from './mock/categories'
import { mockTags } from './mock/tags'

class DemoAPI {
    // 获取 Demo 列表
    async getDemos(params?: GetDemosParams): Promise<ApiResponse<Demo[]>> {
        await mockDelay()

        let data = [...mockDemos]

        // 应用筛选条件
        if (params?.categoryId) {
            data = findDemosByCategory(params.categoryId)
        }

        if (params?.tagIds && params.tagIds.length > 0) {
            data = data.filter(demo =>
                params.tagIds!.some(tagId => demo.tagIds.includes(tagId))
            )
        }

        if (params?.difficulty) {
            data = data.filter(demo => demo.difficulty === params.difficulty)
        }

        if (params?.keyword) {
            data = searchDemos(params.keyword)
        }

        // 应用分页
        const page = params?.page || 1
        const size = params?.size || 10
        const total = data.length

        return createMockPagination(data, page, size, total)
    }

    // 获取单个 Demo
    async getDemoById(id: string): Promise<ApiResponse<Demo>> {
        await mockDelay()

        const demo = findDemoById(id)
        if (!demo) {
            return mockError('Demo not found', 404)
        }

        // 增加浏览量
        demo.views += 1

        return createMockResponse(demo)
    }

    // 获取带关联的 Demo
    async getDemoWithRelations(id: string): Promise<ApiResponse<DemoWithRelations>> {
        await mockDelay()

        const demo = findDemoById(id)
        if (!demo) {
            return mockError('Demo not found', 404)
        }

        const category = mockCategories.find(cat => cat.id === demo.categoryId)
        const tags = mockTags.filter(tag => demo.tagIds.includes(tag.id))

        const demoWithRelations: DemoWithRelations = {
            ...demo,
            category,
            tags
        }

        // 增加浏览量
        demo.views += 1

        return createMockResponse(demoWithRelations)
    }

    // 创建 Demo
    async createDemo(demoData: Omit<Demo, 'id' | 'createdAt' | 'views' | 'likes'>): Promise<ApiResponse<Demo>> {
        await mockDelay(500)

        // 验证分类是否存在
        if (!mockCategories.find(cat => cat.id === demoData.categoryId)) {
            return mockError('Category not found', 400)
        }

        // 验证标签是否存在
        const invalidTags = demoData.tagIds.filter(tagId =>
            !mockTags.find(tag => tag.id === tagId)
        )
        if (invalidTags.length > 0) {
            return mockError(`Tags not found: ${invalidTags.join(', ')}`, 400)
        }

        const newDemo: Demo = {
            ...demoData,
            id: `demo-${Date.now()}`,
            createdAt: new Date().toISOString(),
            views: 0,
            likes: 0
        }

        mockDemos.push(newDemo)

        return createMockResponse(newDemo, 'Demo created successfully', 201)
    }

    // 更新 Demo
    async updateDemo(id: string, updates: Partial<Demo>): Promise<ApiResponse<Demo>> {
        await mockDelay(400)

        const index = mockDemos.findIndex(demo => demo.id === id)
        if (index === -1) {
            return mockError('Demo not found', 404)
        }

        // 验证分类
        if (updates.categoryId && !mockCategories.find(cat => cat.id === updates.categoryId)) {
            return mockError('Category not found', 400)
        }

        // 验证标签
        if (updates.tagIds) {
            const invalidTags = updates.tagIds.filter(tagId =>
                !mockTags.find(tag => tag.id === tagId)
            )
            if (invalidTags.length > 0) {
                return mockError(`Tags not found: ${invalidTags.join(', ')}`, 400)
            }
        }

        const updatedDemo: Demo = {
            ...mockDemos[index],
            ...updates,
            updatedAt: new Date().toISOString()
        }

        mockDemos[index] = updatedDemo

        return createMockResponse(updatedDemo, 'Demo updated successfully')
    }

    // 删除 Demo
    async deleteDemo(id: string): Promise<ApiResponse<void>> {
        await mockDelay(300)

        const index = mockDemos.findIndex(demo => demo.id === id)
        if (index === -1) {
            return mockError('Demo not found', 404)
        }

        mockDemos.splice(index, 1)

        return createMockResponse(undefined, 'Demo deleted successfully')
    }

    // 点赞 Demo
    async likeDemo(id: string): Promise<ApiResponse<{ likes: number }>> {
        await mockDelay(200)

        const demo = findDemoById(id)
        if (!demo) {
            return mockError('Demo not found', 404)
        }

        demo.likes += 1

        return createMockResponse({ likes: demo.likes }, 'Demo liked successfully')
    }

    // 获取统计数据
    async getStats(): Promise<ApiResponse<Stats>> {
        await mockDelay(400)

        const totalViews = mockDemos.reduce((sum, demo) => sum + demo.views, 0)
        const totalLikes = mockDemos.reduce((sum, demo) => sum + demo.likes, 0)

        const demosByCategory: Record<string, number> = {}
        mockCategories.forEach(cat => {
            demosByCategory[cat.name] = findDemosByCategory(cat.id).length
        })

        const recentDemos = [...mockDemos]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5)

        const stats: Stats = {
            totalDemos: mockDemos.length,
            totalClasses: 0, // 需要从班级API获取
            totalStudents: 0, // 需要从学生API获取
            totalViews,
            totalLikes,
            demosByCategory,
            recentDemos
        }

        return createMockResponse(stats)
    }
}

export const demoApi = new DemoAPI()