<script setup lang="ts">
import {ref, computed, onMounted} from 'vue'
import type {TableColumnCtx} from 'element-plus'
import type {ClassItem, StudentItem} from '@/types/demo'

// 状态管理
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const activeNames = ref(['1'])

// 数据
const classList = ref<ClassItem[]>([])
const spanMap = ref<Map<string, { rowspan: number; startIndex: number }>>(new Map())

// 计算属性
// 当前页的班级数据
const currentPageClasses = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    const end = Math.min(start + pageSize.value, classList.value.length)
    return classList.value.slice(start, end)
})

// 学生总数
const totalStudents = computed(() => {
    return classList.value.reduce((total, cls) => total + (cls.students?.length || 0), 0)
})

// 当前页平铺后的数据
const currentPageFlatData = computed(() => {
    const flatData: any[] = []
    spanMap.value.clear()
    
    currentPageClasses.value.forEach((classItem) => {
        const classId = classItem.id
        const students = classItem.students || []
        const studentCount = students.length
        
        // 记录合并配置
        spanMap.value.set(classId, {
            rowspan: Math.max(studentCount, 1),
            startIndex: flatData.length
        })
        
        if (students.length > 0) {
            // 有学生的班级
            students.forEach((student, studentIndex) => {
                flatData.push({
                    uniqueId: `${classId}_${student.id}`,
                    // 班级信息
                    classId: classItem.id,
                    className: classItem.name,
                    grade: classItem.grade,
                    headTeacher: classItem.headTeacher,
                    // 学生信息
                    studentId: student.id,
                    studentName: student.name,
                    gender: student.gender,
                    age: student.age,
                    score: student.score,
                    // 元数据（用于合并判断）
                    _meta: {
                        classId,
                        studentIndex,
                        isFirstStudent: studentIndex === 0,
                        studentCount
                    }
                })
            })
        } else {
            // 没有学生的班级
            flatData.push({
                uniqueId: `${classId}_empty`,
                classId: classItem.id,
                className: classItem.name,
                grade: classItem.grade,
                headTeacher: classItem.headTeacher,
                studentId: '--',
                studentName: '暂无学生',
                gender: '--',
                age: '--',
                score: '--',
                _meta: {
                    classId,
                    studentIndex: 0,
                    isFirstStudent: true,
                    studentCount: 1
                }
            })
        }
    })
    
    return flatData
})

// 生命周期
onMounted(() => {
    loadData()
})

// 方法
const loadData = async () => {
    loading.value = true
    try {
        // 模拟API请求
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // 生成模拟数据
        const mockData: ClassItem[] = []
        const classCount = 32
        
        for (let i = 1; i <= classCount; i++) {
            // 每个班级1-5个学生
            const studentCount = Math.floor(Math.random() * 5) + 1
            const students: StudentItem[] = []
            
            for (let j = 1; j <= studentCount; j++) {
                students.push({
                    id: `S${i}${j}`,
                    name: `学生${i}-${j}`,
                    gender: Math.random() > 0.5 ? '男' : '女',
                    age: Math.floor(Math.random() * 5) + 15,
                    score: Math.floor(Math.random() * 100)
                })
            }
            
            mockData.push({
                id: `C${i}`,
                name: `班级${i}`,
                grade: `${Math.floor((i % 3) + 1)}年级`,
                headTeacher: `老师${i}`,
                students
            })
        }
        
        classList.value = mockData
    } catch (error) {
        console.error('加载数据失败:', error)
    } finally {
        loading.value = false
    }
}

const addRandomClass = () => {
    const newId = `C${classList.value.length + 1}`
    const studentCount = Math.floor(Math.random() * 5) + 1
    const students: StudentItem[] = []
    
    for (let j = 1; j <= studentCount; j++) {
        students.push({
            id: `${newId}_S${j}`,
            name: `新学生${j}`,
            gender: Math.random() > 0.5 ? '男' : '女',
            age: Math.floor(Math.random() * 5) + 15,
            score: Math.floor(Math.random() * 100)
        })
    }
    
    classList.value.push({
        id: newId,
        name: `新班级${newId}`,
        grade: `${Math.floor(Math.random() * 3) + 1}年级`,
        headTeacher: `新老师`,
        students
    })
}

// 表格合并方法
const spanMethod = ({row, column, rowIndex, columnIndex}: {
    row: any
    column: TableColumnCtx<any>
    rowIndex: number
    columnIndex: number
}) => {
    const meta = row._meta
    const classConfig = spanMap.value.get(meta.classId)
    
    if (!classConfig) return {rowspan: 1, colspan: 1}
    
    // 需要合并的列：班级信息列（前4列）
    const needMergeColumns = [0, 1, 2, 3]
    
    if (needMergeColumns.includes(columnIndex)) {
        if (meta.isFirstStudent) {
            return {
                rowspan: classConfig.rowspan,
                colspan: 1
            }
        } else {
            return {
                rowspan: 0,
                colspan: 0
            }
        }
    }
    
    return {rowspan: 1, colspan: 1}
}

// 单元格样式
const cellStyle = ({row, column, rowIndex, columnIndex}: any) => {
    // 为合并的单元格添加特殊样式
    if (columnIndex < 4 && row._meta.isFirstStudent) {
        return {
            backgroundColor: '#f0f9ff',
            borderRight: '2px solid #409EFF'
        }
    }
    return {}
}

// 分页处理
const handlePageSizeChange = (size: number) => {
    pageSize.value = size
    currentPage.value = 1
}

const handlePageChange = (page: number) => {
    currentPage.value = page
}

// 其他方法
const viewClassDetail = (row: any) => {
    console.log('查看班级详情:', row.className)
    alert(`查看班级 ${row.className} 的详情\n学生数量: ${row._meta.studentCount}`)
}

const editStudent = (row: any) => {
    if (!row.studentId || row.studentId === '--') return
    console.log('编辑学生:', row.studentName)
    alert(`编辑学生 ${row.studentName}\n成绩: ${row.score}`)
}

const getScoreClass = (score: number) => {
    if (score === undefined || score === null) return 'score-empty'
    if (score >= 90) return 'score-excellent'
    if (score >= 60) return 'score-good'
    return 'score-poor'
}

// 原理说明代码
const explanationCode = `
// 1. 平铺当前页数据
const flatData = currentPageClasses.value.flatMap(cls => {
  const students = cls.students || []
  return students.length > 0
    ? students.map(student => ({ ...cls, ...student }))
    : [{ ...cls, studentName: '暂无学生' }]
})

// 2. 计算合并行数
const spanMap = new Map()
currentPageClasses.value.forEach((cls, index) => {
  const rowspan = cls.students?.length || 1
  spanMap.set(cls.id, rowspan)
})

// 3. 合并单元格方法
const spanMethod = ({ row, column, columnIndex }) => {
  if (columnIndex < 4) { // 班级列
    if (row.isFirstStudent) {
      return { rowspan: spanMap.get(row.classId), colspan: 1 }
    }
    return { rowspan: 0, colspan: 0 }
  }
  return { rowspan: 1, colspan: 1 }
}
`
</script>

<template>
    <div class="table-merge-demo">
        <div class="demo-header">
            <h3>班级-学生表格合并展示</h3>
            <p class="demo-description">
                展示嵌套数据（班级包含学生列表）的表格合并单元格处理，分页基于班级，前端实现平铺和合并。
            </p>
        </div>
        
        <!-- 控制面板 -->
        <div class="control-panel">
            <el-space :size="20">
                <el-button type="primary" @click="loadData" :loading="loading">
                    加载数据
                </el-button>
                
                <el-select v-model="pageSize" @change="handlePageSizeChange">
                    <el-option label="每页5个班级" :value="5"/>
                    <el-option label="每页10个班级" :value="10"/>
                    <el-option label="每页15个班级" :value="15"/>
                </el-select>
                
                <el-button @click="addRandomClass">
                    添加测试班级
                </el-button>
            </el-space>
        </div>
        
        <!-- 数据统计 -->
        <div class="stats-info">
            <el-space :size="30">
                <div class="stat-item">
                    <span class="stat-label">班级总数:</span>
                    <span class="stat-value">{{ classList.length }}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">学生总数:</span>
                    <span class="stat-value">{{ totalStudents }}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">当前页行数:</span>
                    <span class="stat-value">{{ currentPageFlatData.length }}</span>
                </div>
            </el-space>
        </div>
        
        <!-- 表格展示 -->
        <div class="table-container">
            <el-table
                    :data="currentPageFlatData"
                    :span-method="spanMethod"
                    border
                    stripe
                    style="width: 100%"
                    row-key="uniqueId"
                    v-loading="loading"
                    :cell-style="cellStyle"
            >
                <!-- 班级信息列（需要合并） -->
                <el-table-column
                        label="班级ID"
                        prop="classId"
                        width="100"
                        align="center"
                />
                <el-table-column
                        label="班级名称"
                        prop="className"
                        width="150"
                />
                <el-table-column
                        label="年级"
                        prop="grade"
                        width="100"
                        align="center"
                />
                <el-table-column
                        label="班主任"
                        prop="headTeacher"
                        width="120"
                />
                
                <!-- 学生信息列 -->
                <el-table-column
                        label="学生ID"
                        prop="studentId"
                        width="100"
                        align="center"
                />
                <el-table-column
                        label="学生姓名"
                        prop="studentName"
                        width="120"
                />
                <el-table-column
                        label="性别"
                        prop="gender"
                        width="80"
                        align="center"
                >
                    <template #default="{ row }">
                        <el-tag
                                :type="row.gender === '男' ? 'primary' : 'danger'"
                                size="small"
                        >
                            {{ row.gender }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                        label="年龄"
                        prop="age"
                        width="80"
                        align="center"
                />
                <el-table-column
                        label="成绩"
                        prop="score"
                        width="100"
                        align="center"
                >
                    <template #default="{ row }">
            <span :class="getScoreClass(row.score)">
              {{ row.score || '--' }}
            </span>
                    </template>
                </el-table-column>
                
                <!-- 操作列 -->
                <el-table-column
                        label="操作"
                        width="150"
                        align="center"
                        fixed="right"
                >
                    <template #default="{ row }">
                        <el-button
                                v-if="row._meta.isFirstStudent"
                                type="text"
                                size="small"
                                @click="viewClassDetail(row)"
                        >
                            班级详情
                        </el-button>
                        <el-button
                                type="text"
                                size="small"
                                @click="editStudent(row)"
                                :disabled="!row.studentId"
                        >
                            编辑
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        
        <!-- 分页 -->
        <div class="pagination-container">
            <el-pagination
                    @size-change="handlePageSizeChange"
                    @current-change="handlePageChange"
                    :current-page="currentPage"
                    :page-sizes="[5, 10, 15]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="classList.length"
                    :disabled="loading"
            />
        </div>
        
        <!-- 原理说明 -->
        <div class="explanation-section">
            <el-collapse v-model="activeNames">
                <el-collapse-item title="实现原理" name="1">
                    <div class="explanation-content">
                        <h4>核心思路：</h4>
                        <ol>
                            <li><strong>保持嵌套结构</strong>：后端返回班级包含学生的嵌套数据</li>
                            <li><strong>前端按需平铺</strong>：只平铺当前页的数据，减少计算量</li>
                            <li><strong>动态合并计算</strong>：根据每个班级的学生数量计算合并行数</li>
                            <li><strong>正确分页</strong>：分页基于班级数量，确保班级数据完整</li>
                        </ol>
                        
                        <h4>关键代码：</h4>
                        <pre><code>{{ explanationCode }}</code></pre>
                    </div>
                </el-collapse-item>
            </el-collapse>
        </div>
    </div>
</template>

<style scoped>
.table-merge-demo {
    padding: 0;
}

.demo-header {
    margin-bottom: 24px;
}

.demo-header h3 {
    margin: 0 0 12px 0;
    font-size: 20px;
    color: #333;
}

.demo-description {
    margin: 0;
    font-size: 14px;
    color: #666;
    line-height: 1.6;
}

.control-panel {
    padding: 20px;
    background: #f8f9fa;
    border-radius: 8px;
    margin-bottom: 20px;
}

.stats-info {
    padding: 16px;
    background: white;
    border-radius: 8px;
    margin-bottom: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.stat-item {
    display: inline-flex;
    flex-direction: column;
}

.stat-label {
    font-size: 12px;
    color: #999;
    margin-bottom: 4px;
}

.stat-value {
    font-size: 24px;
    font-weight: 600;
    color: #409EFF;
}

.table-container {
    margin-bottom: 24px;
    background: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.pagination-container {
    display: flex;
    justify-content: center;
    margin-bottom: 30px;
}

.explanation-section {
    background: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.explanation-content {
    padding: 16px;
}

.explanation-content h4 {
    margin: 16px 0 8px 0;
    color: #333;
    font-size: 16px;
}

.explanation-content ol {
    margin: 12px 0;
    padding-left: 24px;
}

.explanation-content li {
    margin-bottom: 8px;
    line-height: 1.6;
}

.explanation-content pre {
    background: #1e1e1e;
    color: #d4d4d4;
    padding: 16px;
    border-radius: 6px;
    overflow-x: auto;
    font-size: 13px;
    line-height: 1.5;
}

/* 成绩样式 */
.score-excellent {
    color: #67C23A;
    font-weight: bold;
}

.score-good {
    color: #409EFF;
}

.score-poor {
    color: #F56C6C;
}

.score-empty {
    color: #909399;
    font-style: italic;
}
</style>