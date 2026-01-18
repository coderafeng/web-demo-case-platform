import http, { createMockResponse, mockDelay, mockError } from './http'
import type { ApiResponse } from './types'
import type { Tag } from './types'
import { mockTags, findTagById } from './mock/tags'

class TagAPI {
    // 获取标签列表
    async getTags(): Promise<ApiResponse<Tag[]>> {
        await mockDelay()

        return createMockResponse(mockTags)
    }

    // 获取单个标签
    async getTagById(id: string): Promise<ApiResponse<Tag>> {
        await mockDelay()

        const tag = findTagById(id)
        if (!tag) {
            return mockError('Tag not found', 404)
        }

        return createMockResponse(tag)
    }

    // 创建标签
    async createTag(tagData: Omit<Tag, 'id'>): Promise<ApiResponse<Tag>> {
        await mockDelay(400)

        const newTag: Tag = {
            ...tagData,
            id: `tag-${Date.now()}`
        }

        mockTags.push(newTag)

        return createMockResponse(newTag, 'Tag created successfully', 201)
    }
}

export const tagApi = new TagAPI()