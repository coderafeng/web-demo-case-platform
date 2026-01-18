import http, { createMockResponse, mockDelay, mockError } from './http'
import type { ApiResponse } from './types'
import type { Category } from './types'
import { mockCategories, findCategoryById } from './mock/categories'

class CategoryAPI {
    // 获取分类列表
    async getCategories(): Promise<ApiResponse<Category[]>> {
        await mockDelay()

        return createMockResponse(mockCategories)
    }

    // 获取单个分类
    async getCategoryById(id: string): Promise<ApiResponse<Category>> {
        await mockDelay()

        const category = findCategoryById(id)
        if (!category) {
            return mockError('Category not found', 404)
        }

        return createMockResponse(category)
    }

    // 创建分类
    async createCategory(categoryData: Omit<Category, 'id'>): Promise<ApiResponse<Category>> {
        await mockDelay(400)

        const newCategory: Category = {
            ...categoryData,
            id: `cat-${Date.now()}`
        }

        mockCategories.push(newCategory)

        return createMockResponse(newCategory, 'Category created successfully', 201)
    }

    // 更新分类
    async updateCategory(id: string, updates: Partial<Category>): Promise<ApiResponse<Category>> {
        await mockDelay(300)

        const index = mockCategories.findIndex(cat => cat.id === id)
        if (index === -1) {
            return mockError('Category not found', 404)
        }

        const updatedCategory: Category = {
            ...mockCategories[index],
            ...updates
        }

        mockCategories[index] = updatedCategory

        return createMockResponse(updatedCategory, 'Category updated successfully')
    }
}

export const categoryApi = new CategoryAPI()