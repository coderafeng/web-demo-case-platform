import type { ApiResponse, PaginationParams } from './http'

// Demo 类型
export interface Demo {
    id: string
    title: string
    description: string
    categoryId: string
    tagIds: string[]
    component: string
    difficulty: 'beginner' | 'intermediate' | 'advanced'
    createdAt: string
    updatedAt?: string
    author?: string
    views: number
    likes: number
}

// 带关联的 Demo 类型
export interface DemoWithRelations extends Demo {
    category?: Category
    tags?: Tag[]
}

// 分类类型
export interface Category {
    id: string
    name: string
    description: string
    icon: string
    color: string
    order: number
}

// 标签类型
export interface Tag {
    id: string
    name: string
    color: string
    description?: string
}

// 班级类型
export interface Class {
    id: number
    name: string
}

// 带学生的班级类型
export interface ClassWithStudents extends Class {
    students: Student[]
}

// 班级类型（包含学生和成绩的完整嵌套结构）
export interface ClassWithStudentsAndScores extends Class {
    students: StudentWithScores[]
}

// 学生类型
export interface Student {
    id: number
    name: string
    age: number
    classId: number
    gender: 'male' | 'female'
}

// 带学生的班级类型
export interface StudentWithScores extends Student {
    scores: Score[]
}

// 学生类型（包含成绩）
export interface StudentWithScores extends Student {
    scores: Score[]
}

// 学生成绩类型
export interface Score {
    id: number
    score: number
    createDate: string
    studentId: number
}

// 统计数据类型
export interface Stats {
    totalDemos: number
    totalClasses: number
    totalStudents: number
    totalViews: number
    totalLikes: number
    demosByCategory: Record<string, number>
    recentDemos: Demo[]
}

// API 请求参数类型
export interface GetDemosParams extends PaginationParams {
    categoryId?: string
    tagIds?: string[]
    difficulty?: string
}

export interface GetClassesParams extends PaginationParams {
    className?: string
    grade?: string
}

export interface GetStudentsParams extends PaginationParams {
    classId?: number,
    name?: string,
    minAge?: number,
    maxAge?: number,
    gender?: 'male' | 'female'
}

// API 响应类型
export type DemosResponse = ApiResponse<Demo[]>
export type DemoResponse = ApiResponse<Demo>
export type DemoWithRelationsResponse = ApiResponse<DemoWithRelations>
export type CategoriesResponse = ApiResponse<Category[]>
export type TagsResponse = ApiResponse<Tag[]>
export type ClassesResponse = ApiResponse<Class[]>
export type ClassResponse = ApiResponse<Class>
export type ClassesNestedResponse = ApiResponse<ClassWithStudentsAndScores[]>
export type ClassWithStudentsResponse = ApiResponse<ClassWithStudents>
export type StudentsResponse = ApiResponse<Student[]>
export type StudentResponse = ApiResponse<Student>
export type StatsResponse = ApiResponse<Stats>