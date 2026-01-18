<template>
    <div class="home-page">
        <!-- 顶部导航 -->
        <header class="app-header">
            <div class="container">
                <div class="header-content" style="padding-left: 20px;">
                    <h1 class="app-title">Vue3测试研究Demo用例平台</h1>
                    <div class="header-actions">
                        <el-input
                                v-model="searchKeyword"
                                placeholder="搜索demo..."
                                class="search-input"
                                @input="handleSearch"
                                clearable
                        >
                            <template #prefix>
                                <el-icon><Search /></el-icon>
                            </template>
                        </el-input>
                        <el-select
                                v-model="selectedCategory"
                                placeholder="按分类筛选"
                                class="category-select"
                                clearable
                                @change="handleCategoryChange"
                        >
                            <el-option
                                    v-for="category in categories"
                                    :key="category.id"
                                    :label="category.name"
                                    :value="category.id"
                            />
                        </el-select>
                    </div>
                </div>
            </div>
        </header>
        
        <!-- 内容区域 -->
        <main class="main-content">
            <div class="container">
                <!-- 统计信息 -->
                <div class="stats-bar">
                    <div class="stat-item">
                        <span class="stat-label">总demo数:</span>
                        <span class="stat-value">{{ filteredDemos.length }}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">分类数:</span>
                        <span class="stat-value">{{ categories.length }}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">最近创建:</span>
                        <span class="stat-value">{{ latestCreate }}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">最近更新:</span>
                        <span class="stat-value">{{ latestUpdate }}</span>
                    </div>
                </div>
                
                <!-- Demo卡片网格 -->
                <div class="demo-grid">
                    <div
                            v-for="demo in filteredDemos"
                            :key="demo.id"
                            class="demo-card"
                            @click="goToDemo(demo.id)"
                    >
                        <div class="card-header">
                            <h3 class="card-title">{{ demo.title }}</h3>
                            <!-- 修复难度标签样式 -->
                            <el-tag
                                    size="small"
                                    :style="getDifficultyStyle(demo.difficulty)"
                                    class="difficulty-tag"
                            >
                                {{ getDifficultyText(demo.difficulty) }}
                            </el-tag>
                        </div>
                        
                        <div class="card-body">
                            <p class="card-description">{{ demo.description }}</p>
                        </div>
                        
                        <div class="card-footer">
                            <div class="tags-container">
                                <!-- 分类标签 -->
                                <el-tag
                                        size="small"
                                        class="category-tag"
                                        :style="{
                    backgroundColor: getCategoryColor(demo.categoryId) + '20',
                    borderColor: getCategoryColor(demo.categoryId),
                    color: getCategoryColor(demo.categoryId)
                  }"
                                >
                                    {{ getCategoryName(demo.categoryId) }}
                                </el-tag>
                                <!-- 修复普通标签样式 -->
                                <el-tag
                                        v-for="tag in getTagObjects(demo.tagIds)"
                                        :key="tag.id"
                                        size="small"
                                        class="tag-item"
                                        :style="{
                    backgroundColor: tag.color + '20',
                    borderColor: tag.color,
                    color: tag.color
                  }"
                                >
                                    {{ tag.name }}
                                </el-tag>
                            </div>
                            
                            <div class="meta-info">
                <span class="create-time">
                  <el-icon><Clock /></el-icon>
                  {{ formatDate(demo.createdAt) }}
                </span>
                                <span v-if="demo.updatedAt" class="update-time">
                  <el-icon><Refresh /></el-icon>
                  {{ formatDate(demo.updatedAt) }}
                </span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- 空状态 -->
                <div v-if="filteredDemos.length === 0" class="empty-state">
                    <el-empty description="没有找到相关demo" />
                </div>
                
                <!-- 加载状态 -->
                <div v-if="loading && filteredDemos.length === 0" class="loading-state">
                    <el-skeleton :rows="3" animated />
                </div>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDemoStore } from '@/stores/demo'
import { Search, Clock, Refresh } from '@element-plus/icons-vue'
import type { Demo, Tag, Category } from '@/api/types'

const router = useRouter()
const demoStore = useDemoStore()

const searchKeyword = ref('')
const selectedCategory = ref('')
const loading = ref(false)

// 计算属性
const demos = computed(() => demoStore.demos)
const categories = computed(() => demoStore.categories)
const tags = computed(() => demoStore.tags)

// 获取最新创建时间
const latestCreate = computed(() => {
    const demosWithCreate = demos.value.filter(demo => demo.createdAt)
    if (demosWithCreate.length === 0) return '暂无'
    
    const latest = demosWithCreate.reduce((latest, demo) => {
        return new Date(demo.createdAt) > new Date(latest) ? demo.createdAt : latest
    }, demosWithCreate[0].createdAt)
    
    return formatDate(latest)
})

// 获取最新更新时间
const latestUpdate = computed(() => {
    const demosWithUpdate = demos.value.filter(demo => demo.updatedAt)
    if (demosWithUpdate.length === 0) return '暂无'
    
    const latest = demosWithUpdate.reduce((latest, demo) => {
        return new Date(demo.updatedAt!) > new Date(latest) ? demo.updatedAt! : latest
    }, demosWithUpdate[0].updatedAt!)
    
    return formatDate(latest)
})

// 筛选后的demo列表
const filteredDemos = computed(() => {
    let data = [...demos.value]
    
    if (searchKeyword.value) {
        const keyword = searchKeyword.value.toLowerCase()
        data = data.filter(demo =>
                demo.title.toLowerCase().includes(keyword) ||
                demo.description.toLowerCase().includes(keyword) ||
                demo.tagIds.some(tagId => {
                    const tag = tags.value.find(t => t.id === tagId)
                    return tag?.name.toLowerCase().includes(keyword)
                })
        )
    }
    
    if (selectedCategory.value) {
        data = data.filter(demo => demo.categoryId === selectedCategory.value)
    }
    
    return data
})

// 辅助方法：获取分类对象
const getCategory = (categoryId: string): Category | undefined => {
    return categories.value.find(cat => cat.id === categoryId)
}

// 辅助方法：获取分类名称
const getCategoryName = (categoryId: string) => {
    const category = getCategory(categoryId)
    return category?.name || '未知分类'
}

// 辅助方法：获取分类颜色
const getCategoryColor = (categoryId: string) => {
    const category = getCategory(categoryId)
    return category?.color || '#409EFF'
}

// 辅助方法：获取标签对象数组
const getTagObjects = (tagIds: string[]): Tag[] => {
    return tags.value.filter(tag => tagIds.includes(tag.id))
}

// 辅助方法：获取难度文本
const getDifficultyText = (difficulty: string) => {
    const map: Record<string, string> = {
        'beginner': '初级',
        'intermediate': '中级',
        'advanced': '高级'
    }
    return map[difficulty] || difficulty
}

// 辅助方法：获取难度样式
const getDifficultyStyle = (difficulty: string) => {
    const styles: Record<string, { backgroundColor: string; borderColor: string; color: string }> = {
        'beginner': {
            backgroundColor: '#e8f5e9',
            borderColor: '#2e7d32',
            color: '#2e7d32'
        },
        'intermediate': {
            backgroundColor: '#e3f2fd',
            borderColor: '#1565c0',
            color: '#1565c0'
        },
        'advanced': {
            backgroundColor: '#fef0f0',     // Element Plus danger 类型的浅红色
            borderColor: '#f56c6c',         // Element Plus danger 类型的红色
            color: '#f56c6c'                // Element Plus danger 类型的红色
        }
    }
    return styles[difficulty] || styles.beginner
}

// 搜索处理
const handleSearch = () => {
    // 搜索逻辑已通过computed自动处理
}

// 分类筛选
const handleCategoryChange = () => {
    // 筛选逻辑已通过computed自动处理
}

// 跳转到demo详情页
const goToDemo = (id: string) => {
    router.push(`/demo/${id}`)
}

// 格式化日期
const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) {
        return '今天'
    } else if (diffDays === 1) {
        return '昨天'
    } else if (diffDays < 7) {
        return `${diffDays}天前`
    } else if (diffDays < 30) {
        return `${Math.floor(diffDays / 7)}周前`
    } else {
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const day = date.getDate().toString().padStart(2, '0')
        return `${date.getFullYear()}-${month}-${day}`
    }
}

// 初始化数据
onMounted(async () => {
    loading.value = true
    try {
        await Promise.all([
            demoStore.fetchDemos(),
            demoStore.fetchCategories(),
            demoStore.fetchTags()
        ])
    } catch (error) {
        console.error('加载数据失败:', error)
    } finally {
        loading.value = false
    }
})
</script>

<style scoped>
.home-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 24px;
}

.app-header {
    padding: 20px 0;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 20px;
}

.app-title {
    color: white;
    font-size: 28px;
    font-weight: 600;
    margin: 0;
}

.header-actions {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
}

.search-input {
    width: 300px;
}

.category-select {
    width: 200px;
}

.main-content {
    padding: 40px 0;
}

.stats-bar {
    display: flex;
    gap: 50px;
    margin-bottom: 30px;
    padding: 20px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.stat-label {
    font-size: 14px;
    color: #666;
    margin-bottom: 4px;
}

.stat-value {
    font-size: 24px;
    font-weight: 600;
    color: #409EFF;
}

.demo-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    gap: 24px;
}

.demo-card {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 1px solid #e4e7ed;
    display: flex;
    flex-direction: column;
    height: 266px;
}

.demo-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    border-color: #409EFF;
}

.card-header {
    padding: 20px 20px 12px;
    border-bottom: 1px solid #f0f0f0;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
}

.card-title {
    font-size: 18px;
    font-weight: 600;
    color: #333;
    margin: 0;
    flex: 1;
}

.difficulty-tag {
    font-weight: 500;
}

.card-body {
    padding: 16px 20px;
    flex: 1;
}

.card-description {
    font-size: 16px;
    color: #666;
    line-height: 1.6;
    text-align: left;
    margin: 0;
    /* 多行文本截断 */
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.card-footer {
    padding: 10px 20px;
    border-top: 1px solid #f0f0f0;
    background: #fafafa;
    min-height: 48px;
}

.tags-container {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 10px;
}

.category-tag,
.tag-item {
    font-weight: 500;
    border-width: 1px;
    border-style: solid;
}

.meta-info {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: #999;
}

.meta-info .el-icon {
    margin-right: 4px;
    font-size: 12px;
}

.create-time,
.update-time {
    display: flex;
    align-items: center;
}

.empty-state {
    padding: 60px 20px;
    text-align: center;
    background: white;
    border-radius: 8px;
    grid-column: 1 / -1;
}

.loading-state {
    grid-column: 1 / -1;
    padding: 20px;
    background: white;
    border-radius: 8px;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .header-content {
        flex-direction: column;
        align-items: stretch;
    }
    
    .app-title {
        text-align: center;
    }
    
    .header-actions {
        justify-content: center;
    }
    
    .search-input,
    .category-select {
        width: 100%;
    }
    
    .stats-bar {
        flex-direction: column;
        gap: 20px;
        text-align: center;
    }
    
    .demo-grid {
        grid-template-columns: 1fr;
    }
}
</style>