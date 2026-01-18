// src/api/classes-nested.ts
import { createMockResponse, createMockPagination, mockDelay, mockError } from './http'
import type { ApiResponse, GetClassesParams, ClassWithStudentsAndScores } from './types'
import { getNestedClasses } from './mock/nested-data'

class ClassNestedAPI {
    // 获取嵌套结构的班级数据
    async getNestedClasses(params?: GetClassesParams): Promise<ApiResponse<ClassWithStudentsAndScores[]>> {
        await mockDelay(500)

        try {
            const { data, total } = getNestedClasses(
                params?.page || 1,
                params?.size || 10,
                params?.grade,
                params?.className
            )

            return createMockResponse(
                data,
                'success',
                200,
                {
                    page: params?.page || 1,
                    size: params?.size || 10,
                    total
                }
            )
        } catch (error) {
            return mockError('获取数据失败', 500)
        }
    }

    // 获取单个班级的完整数据
    async getClassDetails(id: number): Promise<ApiResponse<ClassWithStudentsAndScores>> {
        await mockDelay(300)

        const allData = getNestedClasses().data
        const classData = allData.find(cls => cls.id === id)

        if (!classData) {
            return mockError('班级不存在', 404)
        }

        return createMockResponse(classData)
    }
}

export const classNestedApi = new ClassNestedAPI()