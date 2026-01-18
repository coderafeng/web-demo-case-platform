import http, { createMockResponse, createMockPagination, mockDelay, mockError } from './http'
import type { ApiResponse, PaginationParams } from './types'
import type { Score } from './types'
import { mockScores, findScoreById, findScoresByStudent, searchScores } from './mock/score'
import { mockStudents } from './mock/students'

export interface GetScoresParams extends PaginationParams {
    studentId?: number
    startScore?: number
    endScore?: number
    startCreateDate?: string
    endCreateDate?: string
}

class ScoreAPI {
    // 获取成绩列表
    async getScores(params?: GetScoresParams): Promise<ApiResponse<Score[]>> {
        await mockDelay()

        let data = [...mockScores]

        // 应用筛选条件
        if (params?.studentId) {
            data = findScoresByStudent(params.studentId)
        }

        if (params?.startScore !== undefined || params?.endScore !== undefined ||
            params?.startCreateDate || params?.endCreateDate) {
            data = searchScores(
                params.startScore || 0,
                params.endScore || 100,
                params.startCreateDate || '2000-01-01',
                params.endCreateDate || '2100-12-31'
            )
        }

        // 应用分页
        const page = params?.page || 1
        const size = params?.size || 10
        const total = data.length

        return createMockPagination(data, page, size, total)
    }

    // 获取单个成绩
    async getScoreById(id: number): Promise<ApiResponse<Score>> {
        await mockDelay()

        const score = findScoreById(id)
        if (!score) {
            return mockError('成绩不存在', 404)
        }

        return createMockResponse(score)
    }

    // 创建成绩
    async createScore(scoreData: Omit<Score, 'id'>): Promise<ApiResponse<Score>> {
        await mockDelay(500)

        // 验证学生是否存在
        if (!mockStudents.find(stu => stu.id === scoreData.studentId)) {
            return mockError('学生不存在', 400)
        }

        // 验证分数范围
        if (scoreData.score < 0 || scoreData.score > 100) {
            return mockError('分数必须在0-100之间', 400)
        }

        const newScore: Score = {
            id: mockScores.length + 1,
            ...scoreData
        }

        mockScores.push(newScore)

        return createMockResponse(newScore, '添加成绩成功', 201)
    }

    // 更新成绩
    async updateScore(id: number, updates: Partial<Score>): Promise<ApiResponse<Score>> {
        await mockDelay(400)

        const index = mockScores.findIndex(sc => sc.id === id)
        if (index === -1) {
            return mockError('成绩不存在', 404)
        }

        // 验证学生是否存在（如果更新学生ID）
        if (updates.studentId && !mockStudents.find(stu => stu.id === updates.studentId)) {
            return mockError('学生不存在', 400)
        }

        // 验证分数范围
        if (updates.score !== undefined && (updates.score < 0 || updates.score > 100)) {
            return mockError('分数必须在0-100之间', 400)
        }

        const updatedScore: Score = {
            ...mockScores[index],
            ...updates
        }

        mockScores[index] = updatedScore

        return createMockResponse(updatedScore, '更新成绩成功')
    }

    // 删除成绩
    async deleteScore(id: number): Promise<ApiResponse<void>> {
        await mockDelay(300)

        const index = mockScores.findIndex(sc => sc.id === id)
        if (index === -1) {
            return mockError('成绩不存在', 404)
        }

        mockScores.splice(index, 1)

        return createMockResponse(undefined, '删除成绩成功')
    }

    // 批量删除成绩
    async deleteScoresByStudent(studentId: number): Promise<ApiResponse<void>> {
        await mockDelay(300)

        const initialLength = mockScores.length
        const idSet = new Set([studentId])
        const filteredScores = mockScores.filter(sc => !idSet.has(sc.studentId))

        if (filteredScores.length === initialLength) {
            return createMockResponse(undefined, '没有需要删除的成绩')
        }

        // 更新mock数据
        mockScores.length = 0
        mockScores.push(...filteredScores)

        return createMockResponse(undefined, '删除成绩成功')
    }

    // 获取学生平均成绩
    async getStudentAverageScore(studentId: number): Promise<ApiResponse<number>> {
        await mockDelay(200)

        const scores = findScoresByStudent(studentId)
        if (scores.length === 0) {
            return createMockResponse(0, '该学生暂无成绩')
        }

        const total = scores.reduce((sum, score) => sum + score.score, 0)
        const average = total / scores.length

        return createMockResponse(parseFloat(average.toFixed(2)), '计算成功')
    }

    // 获取班级成绩统计
    async getClassScoreStats(classId: number): Promise<ApiResponse<{
        average: number
        max: number
        min: number
        totalStudents: number
        studentsWithScores: number
    }>> {
        await mockDelay(400)

        const students = mockStudents.filter(stu => stu.classId === classId)
        if (students.length === 0) {
            return mockError('班级不存在或没有学生', 404)
        }

        let totalScores = 0
        let totalScoreCount = 0
        let maxScore = 0
        let minScore = 100
        let studentsWithScores = 0

        students.forEach(student => {
            const scores = findScoresByStudent(student.id)
            if (scores.length > 0) {
                studentsWithScores++
                scores.forEach(score => {
                    totalScores += score.score
                    totalScoreCount++
                    maxScore = Math.max(maxScore, score.score)
                    minScore = Math.min(minScore, score.score)
                })
            }
        })

        const average = totalScoreCount > 0 ? totalScores / totalScoreCount : 0

        return createMockResponse({
            average: parseFloat(average.toFixed(2)),
            max: maxScore,
            min: minScore,
            totalStudents: students.length,
            studentsWithScores
        }, '统计成功')
    }
}

export const scoreApi = new ScoreAPI()