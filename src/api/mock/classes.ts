import type {Class} from '../types'
import {mockStudents} from './students'

export const mockClasses: Class[] = [
    {
        "id": 1,
        "name": "高一一班"
    },
    {
        "id": 2,
        "name": "高一二班"
    },
    {
        "id": 3,
        "name": "高一三班"
    },
    {
        "id": 4,
        "name": "高一四班"
    },
    {
        "id": 5,
        "name": "高一五班"
    },
    {
        "id": 6,
        "name": "高一六班"
    },
    {
        "id": 7,
        "name": "高一七班"
    },
    {
        "id": 8,
        "name": "高一八班"
    },
    {
        "id": 9,
        "name": "高一九班"
    },
    {
        "id": 10,
        "name": "高一十班"
    },
    {
        "id": 11,
        "name": "高二一班"
    },
    {
        "id": 12,
        "name": "高二二班"
    },
    {
        "id": 13,
        "name": "高二三班"
    },
    {
        "id": 14,
        "name": "高二四班"
    },
    {
        "id": 15,
        "name": "高二五班"
    },
    {
        "id": 16,
        "name": "高二六班"
    },
    {
        "id": 17,
        "name": "高二七班"
    },
    {
        "id": 18,
        "name": "高二八班"
    },
    {
        "id": 19,
        "name": "高二九班"
    },
    {
        "id": 20,
        "name": "高二十班"
    },
    {
        "id": 21,
        "name": "高二十一班"
    },
    {
        "id": 22,
        "name": "高二十二班"
    },
    {
        "id": 23,
        "name": "高三一班"
    },
    {
        "id": 24,
        "name": "高三二班"
    },
    {
        "id": 25,
        "name": "高三三班"
    },
    {
        "id": 26,
        "name": "高三四班"
    },
    {
        "id": 27,
        "name": "高三五班"
    },
    {
        "id": 28,
        "name": "高三六班"
    },
    {
        "id": 29,
        "name": "高三七班"
    },
    {
        "id": 30,
        "name": "高三八班"
    }
]

// 获取带学生的班级
export const getClassWithStudents = (id: number) => {
    const cls = mockClasses.find(c => c.id === id)
    if (!cls) return undefined

    const students = mockStudents.filter(stu => stu.classId === id)
    return {
        ...cls,
        students
    }
}

export const findClassById = (id: number): Class | undefined => {
    return mockClasses.find(cls => cls.id === id)
}

export const findClassesByName = (name: string): Class[] => {
    return mockClasses.filter(cls => cls.name.toLowerCase().includes(name.toLowerCase()) )
}

export const findClassesByGrade = (grade: string): Class[] => {
    return mockClasses.filter(cls => {
        if (grade === '高一') return cls.name.includes('高一')
        if (grade === '高二') return cls.name.includes('高二')
        if (grade === '高三') return cls.name.includes('高三')
        return true
    })
}