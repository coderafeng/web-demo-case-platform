export interface DemoItem {
    id: string
    title: string
    description: string
    category: string
    tags: string[]
    component: string
    difficulty: '初级' | '中级' | '高级'
    createdTime: string
    updatedTime?: string
    author?: string
}

export interface ClassItem {
    id: string
    name: string
    grade: string
    headTeacher: string
    students: StudentItem[]
}

export interface StudentItem {
    id: string
    name: string
    gender: '男' | '女'
    age: number
    score?: number
}