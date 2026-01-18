// 数据处理工具函数

// 根据班级名称获取年级
export function getGradeFromClassName(className: string): string {
    if (className.includes('高一')) return '高一'
    if (className.includes('高二')) return '高二'
    if (className.includes('高三')) return '高三'
    return '未知'
}

// 获取年级对应的颜色
export function getGradeColor(grade: string): string {
    switch (grade) {
        case '高一': return '#67C23A' // 绿色
        case '高二': return '#E6A23C' // 橙色
        case '高三': return '#F56C6C' // 红色
        default: return '#909399'    // 灰色
    }
}

// 格式化成绩
export function formatScore(score?: number): string {
    if (score === undefined || score === null) return '--'
    return score.toString()
}

// 获取成绩等级
export function getScoreLevel(score: number): string {
    if (score >= 90) return '优秀'
    if (score >= 80) return '良好'
    if (score >= 60) return '及格'
    return '不及格'
}

// 获取成绩等级对应的颜色
export function getScoreLevelColor(score: number): string {
    if (score >= 90) return '#67C23A' // 绿色
    if (score >= 80) return '#409EFF' // 蓝色
    if (score >= 60) return '#E6A23C' // 橙色
    return '#F56C6C' // 红色
}

// 计算平均成绩
export function calculateAverage(scores: number[]): number {
    if (scores.length === 0) return 0
    const sum = scores.reduce((a, b) => a + b, 0)
    return parseFloat((sum / scores.length).toFixed(2))
}

// 分组数据
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
    return array.reduce((acc, item) => {
        const keyValue = String(item[key])
        if (!acc[keyValue]) {
            acc[keyValue] = []
        }
        acc[keyValue].push(item)
        return acc
    }, {} as Record<string, T[]>)
}