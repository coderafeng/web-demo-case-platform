// src/api/mock/nested-data.ts
import type { Class, Student, Score, ClassWithStudentsAndScores } from '../types'
import { mockClasses } from './classes'
import { mockStudents } from './students'
import { mockScores } from './score'

// 创建完整的嵌套数据结构
export const createNestedClassData = (): ClassWithStudentsAndScores[] => {
    return mockClasses.map(cls => {
        const classStudents = mockStudents.filter(stu => stu.classId === cls.id)

        const studentsWithScores = classStudents.map(student => {
            const studentScores = mockScores.filter(score => score.studentId === student.id)
            return {
                ...student,
                scores: studentScores
            }
        })

        return {
            ...cls,
            students: studentsWithScores
        }
    })
}

// 分页获取嵌套数据
export const getNestedClasses = (page: number = 1, size: number = 10, grade?: string, className?: string) => {
    let allData = createNestedClassData()

    // 年级筛选
    if (grade) {
        allData = allData.filter(cls => {
            if (grade === '高一') return cls.name.includes('高一')
            if (grade === '高二') return cls.name.includes('高二')
            if (grade === '高三') return cls.name.includes('高三')
            return true
        })
    }

    // 班级名称精确匹配
    if (className) {
        allData = allData.filter(cls => cls.name === className)
    }

    // 分页
    const start = (page - 1) * size
    const end = start + size
    const data = allData.slice(start, end)

    return {
        data,
        total: allData.length,
        page,
        size
    }
}