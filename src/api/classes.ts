import http, { createMockResponse, createMockPagination, mockDelay, mockError } from './http'
import type { Student, ApiResponse, GetClassesParams } from './types'
import type { Class, ClassWithStudents } from './types'
import { mockClasses, findClassById, findClassesByName, getClassWithStudents } from './mock/classes'
import {deleteStudentsByClass, mockStudents} from './mock/students'

class ClassAPI {
    // 获取班级列表
    async getClasses(params?: GetClassesParams): Promise<ApiResponse<Class[]>> {
        await mockDelay()

        let data = [...mockClasses]

        // 应用筛选条件
        if (params?.className) {
            data = findClassesByName(params.className)
        }

        // 应用分页
        const page = params?.page || 1
        const size = params?.size || 10
        const total = data.length

        return createMockPagination(data, page, size, total)
    }

    // 获取单个班级
    async getClassById(id: number): Promise<ApiResponse<Class>> {
        await mockDelay()

        const cls = findClassById(id)
        if (!cls) {
            return mockError('未找到班级', 404)
        }

        return createMockResponse(cls)
    }

    // 获取带学生的班级
    async getClassWithStudents(id: number): Promise<ApiResponse<ClassWithStudents>> {
        await mockDelay()

        const classWithStudents = getClassWithStudents(id)
        if (!classWithStudents) {
            return mockError('未找到班级', 404)
        }

        return createMockResponse(classWithStudents)
    }

    async getStudentsByClass(classId: number): Promise<ApiResponse<Student[]>> {
        await mockDelay()

        const students = mockStudents.filter(stu => stu.classId === classId)

        return createMockResponse(students)
    }

    // 创建班级
    async createClass(className: string): Promise<ApiResponse<Class>> {
        await mockDelay(500)

        const newClass: Class = {
            id: mockClasses.length + 1,
            name: className
        }

        mockClasses.push(newClass)

        return createMockResponse(newClass, '添加班级成功', 201)
    }

    // 更新班级
    async updateClass(id: number, className: string): Promise<ApiResponse<Class>> {
        await mockDelay(400)

        const index = mockClasses.findIndex(cls => cls.id === id)
        if (index === -1) {
            return mockError('未找到班级', 404)
        }

        const updatedClass: Class = {
            id: id,
            name: className
        }

        mockClasses[index] = updatedClass

        return createMockResponse(updatedClass, '更新班级成功')
    }

    // 删除班级
    async deleteClass(id: number): Promise<ApiResponse<void>> {
        await mockDelay(300)

        const index = mockClasses.findIndex(cls => cls.id === id)
        if (index === -1) {
            return mockError('未找到班级', 404)
        }

        // 删除关联的学生
        deleteStudentsByClass(id);
        mockClasses.splice(index, 1)

        return createMockResponse(undefined, '删除班级成功')
    }
}

export const classApi = new ClassAPI()