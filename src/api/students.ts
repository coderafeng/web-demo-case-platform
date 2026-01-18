import http, { createMockResponse, createMockPagination, mockDelay, mockError } from './http'
import type { ApiResponse, GetStudentsParams } from './types'
import type { Student } from './types'
import {
    mockStudents,
    findStudentById,
    findStudentsByClass,
    searchStudents,
    deleteStudentsByClass
} from './mock/students'
import { mockClasses } from './mock/classes'
import {mockScores, deleteScoresByStudent} from "./mock/score.ts";

class StudentAPI {
    // 获取学生列表
    async getStudents(params?: GetStudentsParams): Promise<ApiResponse<Student[]>> {
        await mockDelay()

        let data = [...mockStudents]

        // 应用筛选条件
        if (params?.classId) {
            data = findStudentsByClass(params.classId)
        }

        data = searchStudents(params.name, params?.minAge, params?.maxAge, params?.gender);

        // 应用分页
        const page = params?.page || 1
        const size = params?.size || 10
        const total = data.length

        return createMockPagination(data, page, size, total)
    }

    // 获取单个学生
    async getStudentById(id: number): Promise<ApiResponse<Student>> {
        await mockDelay()

        const student = findStudentById(id)
        if (!student) {
            return mockError('学生不存在', 404)
        }

        return createMockResponse(student)
    }

    // 创建学生
    async createStudent(name: string, age: number, classId: number, gender: 'male' | 'female'): Promise<ApiResponse<Student>> {
        await mockDelay(500)

        // 验证班级是否存在
        if (!mockClasses.find(cls => cls.id === classId)) {
            return mockError('班级不存在', 400)
        }

        const newStudent: Student = {
            id: mockStudents.length + 1,
            name: name,
            age: age,
            classId: classId,
            gender: gender
        }

        mockStudents.push(newStudent)

        return createMockResponse(newStudent, '添加学生成功', 201)
    }

    // 更新学生
    async updateStudent(id: number, name: string, age: number, classId: number, gender: 'male' | 'female'): Promise<ApiResponse<Student>> {
        await mockDelay(400)

        const index = mockStudents.findIndex(stu => stu.id === id)
        if (index === -1) {
            return mockError('学生不存在', 404)
        }

        // 验证班级是否存在（如果更新班级）
        if (!mockClasses.find(cls => cls.id === classId)) {
            return mockError('班级不存在', 400)
        }

        const updatedStudent: Student = {
            id: id,
            name: name,
            age: age,
            classId: classId,
            gender: gender
        }

        mockStudents[index] = updatedStudent

        return createMockResponse(updatedStudent, '更新学生成功')
    }

    // 删除学生
    async deleteStudent(id: number): Promise<ApiResponse<void>> {
        await mockDelay(300)

        const index = mockStudents.findIndex(stu => stu.id === id)
        if (index === -1) {
            return mockError('学生不存在', 404)
        }

        deleteScoresByStudent([id]);
        mockStudents.splice(index, 1)

        return createMockResponse(undefined, '删除学生成功')
    }

    async deleteStudentByClassId(classId: number): Promise<ApiResponse<void>> {
        await mockDelay(300)
        deleteStudentsByClass(classId);
        return createMockResponse(undefined, '删除学生成功')
    }

}

export const studentApi = new StudentAPI()