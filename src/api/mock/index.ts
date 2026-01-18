export * from './demos'
export * from './categories'
export * from './tags'
export * from './classes'
export * from './students'
export * from './score'

// 数据完整性检查函数
export const checkDataIntegrity = (): string[] => {
    const errors: string[] = []

    // 这里可以添加数据完整性检查逻辑
    // 例如检查所有关联的ID是否存在等

    // 检查学生所属班级是否存在
    const studentClassErrors = mockStudents
        .filter(student => !mockClasses.some(cls => cls.id === student.classId))
        .map(student => `学生 ${student.name} (ID: ${student.id}) 所属班级 ${student.classId} 不存在`)

    errors.push(...studentClassErrors)

    // 检查成绩所属学生是否存在
    const scoreStudentErrors = mockScores
        .filter(score => !mockStudents.some(stu => stu.id === score.studentId))
        .map(score => `成绩 (ID: ${score.id}) 所属学生 ${score.studentId} 不存在`)

    errors.push(...scoreStudentErrors)

    // 检查成绩分数范围
    const scoreRangeErrors = mockScores
        .filter(score => score.score < 0 || score.score > 100)
        .map(score => `成绩 (ID: ${score.id}) 分数 ${score.score} 超出范围 (0-100)`)

    errors.push(...scoreRangeErrors)

    return errors
}

// 数据统计函数
export const getDataStats = () => {
    return {
        totalClasses: mockClasses.length,
        totalStudents: mockStudents.length,
        totalScores: mockScores.length,
        studentsByClass: mockClasses.map(cls => ({
            className: cls.name,
            studentCount: mockStudents.filter(stu => stu.classId === cls.id).length
        })),
        genderDistribution: {
            male: mockStudents.filter(stu => stu.gender === 'male').length,
            female: mockStudents.filter(stu => stu.gender === 'female').length
        }
    }
}