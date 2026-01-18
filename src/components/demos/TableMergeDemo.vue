<template>
    <div class="table-merge-demo">
        <!-- 控制面板 -->
        <div class="control-panel-area">
            <div class="control-panel">
                <div class="control-filters">
                    <div class="filter-item">
                        <el-select
                                v-model="selectedGrade"
                                clearable
                                placeholder="选择年级"
                                style="width: 120px"
                                @change="handleGradeChange"
                        >
                            <el-option label="高一" value="高一" />
                            <el-option label="高二" value="高二" />
                            <el-option label="高三" value="高三" />
                        </el-select>
                    </div>
                    
                    <div class="filter-item">
                        <el-select
                                v-model="selectedClass"
                                clearable
                                placeholder="选择班级"
                                style="width: 150px"
                                @change="handleClassChange"
                                filterable
                        >
                            <el-option
                                    v-for="cls in allClasses"
                                    :key="cls.id"
                                    :label="cls.name"
                                    :value="cls.name"
                            />
                        </el-select>
                    </div>
                    
                    <div class="filter-item">
                        <el-button
                                :loading="loading"
                                type="primary"
                                @click="handleSearch"
                        >
                            <el-icon><search /></el-icon>
                            查询
                        </el-button>
                        <el-button
                                type="default"
                                @click="handleReset"
                        >
                            重置
                        </el-button>
                    </div>
                </div>
                
                <!-- 统计信息 -->
                <div v-if="!loading && nestedData.length > 0" class="stats-info">
                    <span>总班级数: {{ pagination.total }}</span>
                    <span>当前页: {{ currentPage }}/{{ totalPages }}</span>
                    <span>总学生数: {{ totalStudents }}</span>
                    <span>总成绩记录: {{ totalScores }}</span>
                </div>
            </div>
        </div>
        
        <!-- 数据展示区域 -->
        <div class="data-display-area">
            <div class="table-wrapper">
                <el-table
                        :data="flatData"
                        :span-method="spanMethod"
                        :cell-style="cellStyle"
                        :header-cell-style="headerCellStyle"
                        border
                        height="600px"
                        row-key="uniqueId"
                        stripe
                        style="width: 100%"
                        v-loading="loading"
                        class="enhanced-table"
                >
                    <!-- 班级信息列 -->
                    <el-table-column align="center" label="班级ID" prop="classId" width="100" />
                    <el-table-column label="班级名称" prop="className" width="150" />
                    <el-table-column align="center" label="年级" prop="grade" width="100">
                        <template #default="{ row }">
                            <el-tag :type="getGradeTagType(row.grade)" size="small">
                                {{ row.grade }}
                            </el-tag>
                        </template>
                    </el-table-column>
                    
                    <!-- 学生信息列 -->
                    <el-table-column align="center" label="学生ID" prop="studentId" width="100" />
                    <el-table-column label="学生姓名" prop="studentName" width="120" />
                    <el-table-column align="center" label="性别" prop="gender" width="80">
                        <template #default="{ row }">
                            <el-tag :type="row.gender === '男' ? 'primary' : 'danger'" size="small">
                                {{ row.gender }}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="年龄" prop="age" width="80" />
                    
                    <!-- 成绩信息列 -->
                    <el-table-column align="center" label="成绩ID" prop="scoreId" width="100" />
                    <el-table-column align="center" label="考试日期" prop="examDate" width="120">
                        <template #default="{ row }">
                            {{ formatExamDate(row.examDate) }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="分数" prop="score" width="100">
                        <template #default="{ row }">
              <span :class="getScoreClass(row.score)">
                {{ row.score || '--' }}
              </span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="等级" width="100">
                        <template #default="{ row }">
              <span v-if="row.score !== undefined && row.score !== null && row.score !== '--'">
                {{ getScoreLevel(row.score) }}
              </span>
                            <span v-else>--</span>
                        </template>
                    </el-table-column>
                    
                    <!-- 操作列 -->
                    <el-table-column align="center" fixed="right" label="操作" width="200">
                        <template #default="{ row }">
                            <div class="action-buttons">
                                <el-button
                                        v-if="row._meta.isFirstStudent"
                                        type="primary"
                                        link
                                        size="small"
                                        @click.stop="viewClassDetail(row)"
                                >
                                    班级详情
                                </el-button>
                                <el-button
                                        v-if="row.studentId && row.studentId !== '--'"
                                        type="success"
                                        link
                                        size="small"
                                        @click.stop="viewStudentScores(row)"
                                >
                                    成绩详情
                                </el-button>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            
            <!-- 分页 -->
            <div class="pagination-wrapper">
                <el-pagination
                        v-model:current-page="currentPage"
                        v-model:page-size="pageSize"
                        :page-sizes="[1, 5, 10, 20]"
                        :total="pagination.total"
                        layout="total, sizes, prev, pager, next, jumper"
                        @size-change="handlePageSizeChange"
                        @current-change="handlePageChange"
                        background
                        :disabled="loading"
                />
            </div>
        </div>
        
        <!-- 文档说明区域 -->
        <div class="documentation-section">
            <div class="section-header">
                <h3 style="text-align: left;">思路与代码</h3>
            </div>
            
            <div class="documentation-content">
                <div class="doc-block">
                    <h4>📌 核心思路</h4>
                    <p>展示嵌套数据（班级包含学生列表）的表格合并单元格处理，分页基于班级，前端实现平铺和合并。</p>
                    <div class="key-points">
                        <div class="point-item">
                            <span class="point-icon">🔹</span>
                            <span class="point-text">
                <strong>保持嵌套结构</strong>：后端返回班级包含学生的嵌套数据
              </span>
                        </div>
                        <div class="point-item">
                            <span class="point-icon">🔹</span>
                            <span class="point-text">
                <strong>前端按需平铺</strong>：只平铺当前页的数据，减少计算量
              </span>
                        </div>
                        <div class="point-item">
                            <span class="point-icon">🔹</span>
                            <span class="point-text">
                <strong>动态合并计算</strong>：根据每个班级的学生数量计算合并行数
              </span>
                        </div>
                        <div class="point-item">
                            <span class="point-icon">🔹</span>
                            <span class="point-text">
                <strong>正确分页</strong>：分页基于班级数量，确保班级数据完整
              </span>
                        </div>
                    </div>
                </div>
                
                <div class="doc-block">
                    <h4>💻 关键代码实现</h4>
                    <h5>1. 数据平铺逻辑</h5>
                    <div class="code-block">
            <pre><code class="language-javascript">
const flatData = currentPageClasses.flatMap(cls => {
  const students = studentsMap.get(cls.id) || []
  return students.length > 0
    ? students.map(student => ({
        ...cls,
        ...student,
        gender: student.gender === 'male' ? '男' : '女'
      }))
    : [{ ...cls, studentName: '暂无学生' }]
})</code></pre>
                    </div>
                    
                    <h5>2. 合并单元格算法</h5>
                    <div class="code-block">
            <pre><code class="language-javascript">
const spanMethod = ({ row, column, rowIndex, columnIndex }) => {
  if (columnIndex < 4) {
    if (row.isFirstStudent) {
      return {
        rowspan: spanMap.get(row.classId),
        colspan: 1
      }
    }
    return { rowspan: 0, colspan: 0 }
  }
  return { rowspan: 1, colspan: 1 }
}</code></pre>
                    </div>
                </div>
                
                <div class="doc-block">
                    <h4>⚠️ 注意事项</h4>
                    <div class="notes">
                        <div class="note-item warning">
                            <strong>性能考虑：</strong>只平铺当前页数据，避免大数据量下的性能问题
                        </div>
                        <div class="note-item info">
                            <strong>分页逻辑：</strong>分页基于班级数量，需要确保每个班级的数据完整性
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue'
import type { TableColumnCtx } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { classNestedApi } from '@/api/classes-nested'
import { classApi } from '@/api/classes'
import type { ClassWithStudentsAndScores, StudentWithScores, Class } from '@/api/types'

const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(5)

// 筛选条件
const selectedGrade = ref('')
const selectedClass = ref('')

// 数据存储
const allClasses = ref<Class[]>([]) // 所有班级（用于下拉框）
const nestedData = ref<ClassWithStudentsAndScores[]>([]) // 嵌套数据

// 分页信息
const pagination = ref({
    page: 1,
    size: 1,
    total: 0
})

// 计算属性
const totalPages = computed(() => {
    return Math.ceil(pagination.value.total / pageSize.value)
})

const totalStudents = computed(() => {
    return nestedData.value.reduce((total, cls) => total + cls.students.length, 0)
})

const totalScores = computed(() => {
    return nestedData.value.reduce((total, cls) => {
        return total + cls.students.reduce((studentTotal, student) => {
            return studentTotal + (student.scores?.length || 0)
        }, 0)
    }, 0)
})

// 平铺数据计算属性
const flatData = computed(() => {
    const flat: any[] = []
    
    nestedData.value.forEach((classItem) => {
        const classId = classItem.id
        const className = classItem.name
        const grade = extractGradeFromClassName(className)
        
        // 班级信息
        const classInfo = {
            classId,
            className,
            grade
        }
        
        if (classItem.students.length === 0) {
            // 没有学生的班级
            flat.push({
                ...classInfo,
                uniqueId: `class_${classId}_empty`,
                studentId: '--',
                studentName: '暂无学生',
                gender: '--',
                age: '--',
                scoreId: '--',
                examDate: '--',
                score: '--',
                _meta: {
                    classId,
                    studentId: null,
                    isFirstStudent: true,
                    studentCount: 0,
                    hasScores: false
                }
            })
        } else {
            // 有学生的班级
            classItem.students.forEach((student, studentIndex) => {
                const studentId = student.id
                const studentScores = student.scores || []
                const hasScores = studentScores.length > 0
                
                if (!hasScores) {
                    // 没有成绩的学生
                    flat.push({
                        ...classInfo,
                        uniqueId: `class_${classId}_student_${studentId}_empty`,
                        studentId,
                        studentName: student.name,
                        gender: student.gender === 'male' ? '男' : '女',
                        age: student.age,
                        scoreId: '--',
                        examDate: '--',
                        score: '--',
                        _meta: {
                            classId,
                            studentId,
                            isFirstStudent: studentIndex === 0,
                            studentCount: classItem.students.length,
                            hasScores: false,
                            scoreCount: 0
                        }
                    })
                } else {
                    // 有成绩的学生
                    studentScores.forEach((score, scoreIndex) => {
                        flat.push({
                            ...classInfo,
                            uniqueId: `class_${classId}_student_${studentId}_score_${score.id}`,
                            studentId,
                            studentName: student.name,
                            gender: student.gender === 'male' ? '男' : '女',
                            age: student.age,
                            scoreId: score.id,
                            examDate: score.createDate,
                            score: score.score,
                            _meta: {
                                classId,
                                studentId,
                                isFirstStudent: studentIndex === 0 && scoreIndex === 0,
                                studentCount: classItem.students.length,
                                hasScores: true,
                                scoreCount: studentScores.length,
                                isFirstScore: scoreIndex === 0
                            }
                        })
                    })
                }
            })
        }
    })
    
    return flat
})

// 从班级名称提取年级
const extractGradeFromClassName = (className: string): string => {
    if (className.includes('高一')) return '高一'
    if (className.includes('高二')) return '高二'
    if (className.includes('高三')) return '高三'
    return '未知'
}

// 加载基础数据（班级列表）
const loadAllClasses = async () => {
    try {
        const response = await classApi.getClasses({
            page: 1,
            size: 100
        })
        
        if (response.code === 200) {
            allClasses.value = response.data
        }
    } catch (error) {
        console.error('加载班级列表失败:', error)
    }
}

// 加载嵌套数据
const loadNestedData = async () => {
    loading.value = true
    
    try {
        const response = await classNestedApi.getNestedClasses({
            page: currentPage.value,
            size: pageSize.value,
            grade: selectedGrade.value || undefined,
            className: selectedClass.value || undefined
        })
        
        if (response.code === 200) {
            nestedData.value = response.data
            pagination.value = {
                page: response.page || currentPage.value,
                size: response.size || pageSize.value,
                total: response.total || 0
            }
            
            console.log('加载的嵌套数据:', nestedData.value)
            console.log('生成的平铺数据:', flatData.value)
        } else {
            console.error('加载数据失败:', response.message)
        }
    } catch (error) {
        console.error('加载数据失败:', error)
    } finally {
        loading.value = false
    }
}

// 合并单元格算法
const spanMethod = ({ row, column, rowIndex, columnIndex }: {
    row: any
    column: TableColumnCtx<any>
    rowIndex: number
    columnIndex: number
}) => {
    const meta = row._meta
    
    // 班级信息列 (0-2列：班级ID、班级名称、年级)
    if (columnIndex < 3) {
        // 只有每组的第一个学生（或空班级行）才显示班级信息
        if (meta.isFirstStudent) {
            // 计算这个班级有多少行
            const classRows = flatData.value.filter(item => item._meta.classId === meta.classId).length
            return {
                rowspan: classRows,
                colspan: 1
            }
        }
        return { rowspan: 0, colspan: 0 }
    }
    
    // 学生信息列 (3-6列：学生ID、学生姓名、性别、年龄)
    if (columnIndex >= 3 && columnIndex <= 6) {
        // 只有每个学生的第一个成绩行（或没有成绩的学生行）才显示学生信息
        if (meta.hasScores) {
            if (meta.isFirstScore) {
                return {
                    rowspan: meta.scoreCount,
                    colspan: 1
                }
            }
            return { rowspan: 0, colspan: 0 }
        } else {
            // 没有成绩的学生，只占一行
            if (meta.isFirstStudent) {
                return { rowspan: 1, colspan: 1 }
            }
            return { rowspan: 0, colspan: 0 }
        }
    }
    
    return { rowspan: 1, colspan: 1 }
}

// 表头样式函数
const headerCellStyle = ({ row, column, rowIndex, columnIndex }: any) => {
    return {
        backgroundColor: '#f5f7fa',
        color: '#333',
        fontWeight: '600',
        fontSize: '14px',
        borderRight: '2px solid #dcdfe6',
        borderBottom: '2px solid #c0c4cc',
        padding: '12px 0'
    }
}

// 单元格样式
const cellStyle = ({ row, column, rowIndex, columnIndex }: any) => {
    // 如果是固定列（操作列），设置白色背景
    if (column.fixed === 'right') {
        return {
            backgroundColor: '#ffffff',
            position: 'relative',
            zIndex: 2,
            borderRight: '2px solid #dcdfe6',
            borderBottom: '1px solid #e4e7ed',
            borderTop: '1px solid #e4e7ed'
        }
    }
    // 班级信息列高亮
    if (columnIndex < 3 && row._meta.isFirstStudent) {
        return {
            backgroundColor: '#f0f9ff',
            fontWeight: '500',
            borderRight: '2px solid #409EFF',
            borderBottom: '2px solid #409EFF',
            borderTop: '1px solid #e4e7ed'
        }
    }
    
    // 学生信息列高亮（有成绩的学生的第一行，或没有成绩的学生）
    if (columnIndex >= 3 && columnIndex <= 6) {
        if ((row._meta.hasScores && row._meta.isFirstScore) ||
                (!row._meta.hasScores && row._meta.isFirstStudent)) {
            return {
                backgroundColor: '#f8f9fa',
                borderRight: '1px solid #e4e7ed',
                borderBottom: '1px solid #e4e7ed',
                borderTop: '1px solid #e4e7ed'
            }
        }
    }
    
    // 成绩列根据分数高亮
    if (columnIndex >= 7 && row.score !== '--') {
        const score = row.score
        if (score >= 90) {
            return {
                backgroundColor: '#f0f9eb',
                color: '#67C23A',
                fontWeight: '500',
                borderRight: '2px solid #e4e7ed',
                borderBottom: '1px solid #e4e7ed',
                borderTop: '1px solid #e4e7ed'
            }
        } else if (score >= 80) {
            return {
                backgroundColor: '#ecf5ff',
                color: '#409EFF',
                fontWeight: '500',
                borderRight: '2px solid #e4e7ed',
                borderBottom: '1px solid #e4e7ed',
                borderTop: '1px solid #e4e7ed'
            }
        } else if (score >= 60) {
            return {
                backgroundColor: '#fdf6ec',
                color: '#E6A23C',
                fontWeight: '500',
                borderRight: '2px solid #e4e7ed',
                borderBottom: '1px solid #e4e7ed',
                borderTop: '1px solid #e4e7ed'
            }
        } else {
            return {
                backgroundColor: '#fef0f0',
                color: '#F56C6C',
                fontWeight: '500',
                borderRight: '2px solid #e4e7ed',
                borderBottom: '1px solid #e4e7ed',
                borderTop: '1px solid #e4e7ed'
            }
        }
    }
    
    // 默认样式
    return {
        borderRight: '2px solid #e4e7ed',
        borderBottom: '1px solid #e4e7ed',
        borderTop: '1px solid #e4e7ed'
    }
}

// 事件处理
const handleGradeChange = () => {
    currentPage.value = 1
    selectedClass.value = '' // 切换年级时清空班级选择
}

const handleClassChange = () => {
    currentPage.value = 1
}

const handleSearch = () => {
    loadNestedData()
}

const handleReset = () => {
    selectedGrade.value = ''
    selectedClass.value = ''
    currentPage.value = 1
    loadNestedData()
}

const handlePageSizeChange = (size: number) => {
    pageSize.value = size
    currentPage.value = 1
    loadNestedData()
}

const handlePageChange = (page: number) => {
    currentPage.value = page
    loadNestedData()
}

// 工具函数
const getGradeTagType = (grade: string) => {
    switch (grade) {
        case '高一': return 'success'
        case '高二': return 'warning'
        case '高三': return 'danger'
        default: return 'info'
    }
}

const getScoreClass = (score: number | string) => {
    if (score === '--' || score === undefined || score === null) return 'score-empty'
    
    const numScore = Number(score)
    if (numScore >= 90) return 'score-excellent'
    if (numScore >= 80) return 'score-good'
    if (numScore >= 60) return 'score-normal'
    return 'score-poor'
}

const getScoreLevel = (score: number) => {
    if (score >= 90) return '优秀'
    if (score >= 80) return '良好'
    if (score >= 60) return '及格'
    return '不及格'
}

const formatExamDate = (dateStr: string) => {
    if (dateStr === '--') return '--'
    try {
        const date = new Date(dateStr)
        return `${date.getMonth() + 1}月${date.getDate()}日`
    } catch {
        return dateStr
    }
}

// 操作函数
const viewClassDetail = (row: any) => {
    const classData = nestedData.value.find(cls => cls.id === row.classId)
    if (!classData) return
    
    const studentCount = classData.students.length
    let totalScores = 0
    let scoreCount = 0
    let maxScore = 0
    let minScore = 100
    
    classData.students.forEach(student => {
        const scores = student.scores || []
        scores.forEach(score => {
            totalScores += score.score
            scoreCount++
            maxScore = Math.max(maxScore, score.score)
            minScore = Math.min(minScore, score.score)
        })
    })
    
    const averageScore = scoreCount > 0 ? (totalScores / scoreCount).toFixed(2) : '0'
    
    const message = `
班级详情：
班级名称：${classData.name}
年级：${row.grade}
学生人数：${studentCount}
有成绩学生：${classData.students.filter(s => s.scores?.length > 0).length}人
成绩统计：
  - 平均分：${averageScore}
  - 最高分：${maxScore || '--'}
  - 最低分：${minScore || '--'}
  - 成绩记录数：${scoreCount}
  `.trim()
    
    alert(message)
}

const viewStudentScores = (row: any) => {
    const classData = nestedData.value.find(cls => cls.id === row.classId)
    if (!classData) return
    
    const student = classData.students.find(s => s.id === row.studentId)
    if (!student || !student.scores || student.scores.length === 0) {
        alert(`学生 ${row.studentName} 暂无成绩记录`)
        return
    }
    
    const scores = student.scores
    const total = scores.reduce((sum, score) => sum + score.score, 0)
    const average = (total / scores.length).toFixed(2)
    const maxScore = Math.max(...scores.map(s => s.score))
    const minScore = Math.min(...scores.map(s => s.score))
    
    const message = `
学生成绩详情：
学生姓名：${student.name}
班级：${row.className}
年龄：${student.age}
性别：${row.gender}

成绩记录（共${scores.length}次）：
${scores.map((score, idx) =>
            `${idx + 1}. ${formatExamDate(score.createDate)} - ${score.score}分 (${getScoreLevel(score.score)})`
    ).join('\n')}

平均分：${average}
最高分：${maxScore}
最低分：${minScore}
  `.trim()
    
    alert(message)
}

// 初始化
onMounted(() => {
    loadAllClasses()
    loadNestedData()
})

// 监听分页和筛选条件变化
watch([currentPage, pageSize, selectedGrade, selectedClass], () => {
    loadNestedData()
}, { immediate: false })
</script>

<style scoped>
/* 样式保持不变 */
.table-merge-demo {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.control-panel-area {
    margin-bottom: 4px;
}

.control-panel {
    padding: 12px 0;
    border-bottom: 1px solid #f0f0f0;
}

.control-filters {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    align-items: center;
    margin-bottom: 12px;
}

.filter-item {
    display: flex;
    align-items: center;
    gap: 8px;
}

.stats-info {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    padding: 8px 12px;
    background: #f8f9fa;
    border-radius: 4px;
    font-size: 12px;
    color: #666;
}

.stats-info span {
    padding: 2px 6px;
    background: white;
    border-radius: 3px;
    border: 1px solid #e4e7ed;
}

.data-display-area {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.table-wrapper {
    flex: 1;
    border-radius: 6px;
    overflow: hidden;
    border: 1px solid #e4e7ed;
    min-height: 600px;
    background: white;
}

.action-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    justify-content: center;
}

.pagination-wrapper {
    display: flex;
    justify-content: flex-end;
    padding-top: 12px;
    border-top: 1px solid #f0f0f0;
}

/* 增强表格边框样式 */
.enhanced-table {
    border: 2px solid #dcdfe6;
    border-radius: 6px;
    overflow: hidden;
}

/* 表头样式增强 */
:deep(.enhanced-table .el-table__header) {
    border-bottom: 3px solid #c0c4cc;
}

:deep(.enhanced-table .el-table__header th) {
    border-right: 2px solid #c0c4cc !important;
    background-color: #f5f7fa !important;
    font-weight: 600;
    color: #333;
    padding: 12px 0 !important;
}

/* 单元格边框增强 */
:deep(.enhanced-table .el-table__cell) {
    border-right: 2px solid #e4e7ed !important;
    border-bottom: 1px solid #e4e7ed !important;
}

/* 行分隔线增强 */
:deep(.enhanced-table .el-table__row:not(:last-child) .el-table__cell) {
    border-bottom: 1px solid #e4e7ed !important;
}

/* 斑马纹行的边框 */
:deep(.enhanced-table .el-table__row--striped .el-table__cell) {
    border-bottom: 1px solid #e4e7ed !important;
    background-color: #f8f9fa !important;
}

/* 固定列边框增强 */
:deep(.enhanced-table .el-table__fixed-right) {
    border-left: 3px solid #dcdfe6;
}

/* 操作列按钮容器 */
.action-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    justify-content: center;
    background-color: #fff;
    padding: 4px 0;
    min-height: 32px;
    align-items: center;
    border-radius: 4px;
    border: 1px solid #f0f0f0;
}

/* 成绩样式 */
.score-excellent {
    color: #67C23A;
    font-weight: 500;
}

.score-good {
    color: #409EFF;
    font-weight: 500;
}

.score-normal {
    color: #E6A23C;
    font-weight: 500;
}

.score-poor {
    color: #F56C6C;
    font-weight: 500;
}

.score-empty {
    color: #909399;
}
</style>