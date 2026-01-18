import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { demoApi, categoryApi, tagApi, classApi, studentApi, scoreApi } from '@/api'
import type { Demo, DemoWithRelations, Category, Tag, Class, Student, Score, GetDemosParams, GetClassesParams } from '@/api/types'

export const useDemoStore = defineStore('demo', () => {
    // 状态
    const demos = ref<Demo[]>([])
    const currentDemo = ref<DemoWithRelations | null>(null)
    const categories = ref<Category[]>([])
    const tags = ref<Tag[]>([])
    const classes = ref<Class[]>([])
    const students = ref<Student[]>([])
    const scores = ref<Score[]>([])

    // 分页状态
    const pagination = ref({
        page: 1,
        size: 10,
        total: 0
    })

    // 加载状态
    const loading = ref(false)
    const error = ref<string | null>(null)

    // 计算属性
    const totalDemos = computed(() => demos.value.length)
    const popularDemos = computed(() =>
        [...demos.value]
            .sort((a, b) => b.views - a.views)
            .slice(0, 5)
    )

    const recentDemos = computed(() =>
        [...demos.value]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5)
    )

    // 根据班级名称获取年级
    const getGradeFromClassName = (className: string): string => {
        if (className.includes('高一')) return '高一'
        if (className.includes('高二')) return '高二'
        if (className.includes('高三')) return '高三'
        return '未知'
    }

    // 获取分类名称
    const getCategoryName = (categoryId: string) => {
        const category = categories.value.find(cat => cat.id === categoryId)
        return category?.name || 'Unknown'
    }

    // Actions
    const fetchDemos = async (params?: GetDemosParams) => {
        loading.value = true
        error.value = null

        try {
            const response = await demoApi.getDemos(params)
            if (response.code === 200) {
                demos.value = response.data
                if (response.page && response.size && response.total) {
                    pagination.value = {
                        page: response.page,
                        size: response.size,
                        total: response.total
                    }
                }
            } else {
                throw new Error(response.message)
            }
        } catch (err: any) {
            error.value = err.message || '加载失败'
            console.error('加载Demo列表失败:', err)
        } finally {
            loading.value = false
        }
    }

    const fetchDemoById = async (id: string) => {
        loading.value = true
        error.value = null

        try {
            const response = await demoApi.getDemoWithRelations(id)
            if (response.code === 200) {
                currentDemo.value = response.data
            } else {
                throw new Error(response.message)
            }
        } catch (err: any) {
            error.value = err.message || '加载失败'
            console.error('加载Demo详情失败:', err)
        } finally {
            loading.value = false
        }
    }

    const fetchCategories = async () => {
        try {
            const response = await categoryApi.getCategories()
            if (response.code === 200) {
                categories.value = response.data
            }
        } catch (err) {
            console.error('加载分类失败:', err)
        }
    }

    const fetchTags = async () => {
        try {
            const response = await tagApi.getTags()
            if (response.code === 200) {
                tags.value = response.data
            }
        } catch (err) {
            console.error('加载标签失败:', err)
        }
    }

    const fetchClasses = async (params?: GetClassesParams) => {
        loading.value = true
        error.value = null

        try {
            const response = await classApi.getClasses(params)
            if (response.code === 200) {
                classes.value = response.data
                if (response.page && response.size && response.total) {
                    pagination.value = {
                        page: response.page,
                        size: response.size,
                        total: response.total
                    }
                }
            } else {
                throw new Error(response.message)
            }
        } catch (err: any) {
            error.value = err.message || '加载失败'
            console.error('加载班级数据失败:', err)
        } finally {
            loading.value = false
        }
    }

    const fetchStudents = async (classId?: number) => {
        loading.value = true
        error.value = null

        try {
            const response = await studentApi.getStudents({
                classId: classId,
                page: pagination.value.page,
                size: pagination.value.size
            })
            if (response.code === 200) {
                students.value = response.data
                if (response.page && response.size && response.total) {
                    pagination.value = {
                        page: response.page,
                        size: response.size,
                        total: response.total
                    }
                }
            } else {
                throw new Error(response.message)
            }
        } catch (err: any) {
            error.value = err.message || '加载失败'
            console.error('加载学生数据失败:', err)
        } finally {
            loading.value = false
        }
    }

    const fetchScores = async (studentId?: number) => {
        loading.value = true
        error.value = null

        try {
            const response = await scoreApi.getScores({
                studentId: studentId,
                page: pagination.value.page,
                size: pagination.value.size
            })
            if (response.code === 200) {
                scores.value = response.data
                if (response.page && response.size && response.total) {
                    pagination.value = {
                        page: response.page,
                        size: response.size,
                        total: response.total
                    }
                }
            } else {
                throw new Error(response.message)
            }
        } catch (err: any) {
            error.value = err.message || '加载失败'
            console.error('加载成绩数据失败:', err)
        } finally {
            loading.value = false
        }
    }

    const likeDemo = async (id: string) => {
        try {
            const response = await demoApi.likeDemo(id)
            if (response.code === 200) {
                const demoIndex = demos.value.findIndex(d => d.id === id)
                if (demoIndex > -1) {
                    demos.value[demoIndex].likes = response.data.likes
                }

                if (currentDemo.value?.id === id) {
                    currentDemo.value.likes = response.data.likes
                }

                return response.data.likes
            }
        } catch (err) {
            console.error('点赞失败:', err)
        }
    }

    const createDemo = async (demoData: Omit<Demo, 'id' | 'createdAt' | 'views' | 'likes'>) => {
        try {
            const response = await demoApi.createDemo(demoData)
            if (response.code === 201) {
                demos.value.unshift(response.data)
                return response.data
            }
        } catch (err) {
            console.error('创建Demo失败:', err)
            throw err
        }
    }

    // 新增：获取班级统计信息
    const getClassStats = async (classId: number) => {
        try {
            const response = await scoreApi.getClassScoreStats(classId)
            if (response.code === 200) {
                return response.data
            }
            return null
        } catch (err) {
            console.error('获取班级统计信息失败:', err)
            return null
        }
    }

    return {
        // State
        demos,
        currentDemo,
        categories,
        tags,
        classes,
        students,
        scores,
        pagination,
        loading,
        error,

        // Getters
        totalDemos,
        popularDemos,
        recentDemos,
        getGradeFromClassName,
        getCategoryName,

        // Actions
        fetchDemos,
        fetchDemoById,
        fetchCategories,
        fetchTags,
        fetchClasses,
        fetchStudents,
        fetchScores,
        likeDemo,
        createDemo,
        getClassStats
    }
})