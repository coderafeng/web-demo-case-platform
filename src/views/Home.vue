<script setup lang="ts">
import {ref, computed, onMounted} from 'vue'
import {useRouter} from 'vue-router'
import {useDemoStore} from '@/stores/demo'
import {Clock, Refresh, Search} from '@element-plus/icons-vue'
import type {DemoItem} from '@/types/demo'

const router = useRouter()
const demoStore = useDemoStore()

const searchKeyword = ref('')
const selectedCategory = ref('')

// 获取所有分类
const categories = computed(() => {
    const cats = new Set<string>()
    demoStore.demoList.forEach(demo => {
        cats.add(demo.category)
    })
    return Array.from(cats).map(cat => ({
        value: cat,
        label: cat
    }))
})

// 获取最新创建时间
const latestCreate = computed(() => {
    const demosWithCreate = demoStore.demoList.filter(demo => demo.createdTime)
    if (demosWithCreate.length === 0) return '暂无'
    
    const latest = demosWithCreate.reduce((latest, demo) => {
        return new Date(demo.createdTime!) > new Date(latest) ? demo.createdTime! : latest
    }, demosWithCreate[0].createdTime!)
    
    return formatDate(latest)
})

// 获取最新更新时间
const latestUpdate = computed(() => {
    const demosWithUpdate = demoStore.demoList.filter(demo => demo.updatedTime)
    if (demosWithUpdate.length === 0) return '暂无'
    
    const latest = demosWithUpdate.reduce((latest, demo) => {
        return new Date(demo.updatedTime!) > new Date(latest) ? demo.updatedTime! : latest
    }, demosWithUpdate[0].updatedTime!)
    
    return formatDate(latest)
})

// 筛选后的demo列表
const filteredDemos = computed(() => {
    let demos = demoStore.demoList
    
    if (searchKeyword.value) {
        demos = demoStore.searchDemos(searchKeyword.value)
    }
    
    if (selectedCategory.value) {
        demos = demos.filter(demo => demo.category === selectedCategory.value)
    }
    
    return demos
})

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
    // 获取月份和日期，确保两位数字
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${date.getFullYear()}-${month}-${day}`;
}

onMounted(() => {
    // 可以在这里加载更多初始数据
})
</script>

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
                                <el-icon>
                                    <Search/>
                                </el-icon>
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
                                    :key="category.value"
                                    :label="category.label"
                                    :value="category.value"
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
                            <el-tag
                                    :class="`difficulty-${demo.difficulty}`"
                                    size="small"
                            >
                                {{ demo.difficulty }}
                            </el-tag>
                        </div>
                        
                        <div class="card-body">
                            <p class="card-description">{{ demo.description }}</p>
                        </div>
                        
                        <div class="card-footer">
                            <div class="tags-container">
                                <el-tag
                                        type="primary"
                                        size="small"
                                        class="category-tag"
                                >
                                    {{ demo.category }}
                                </el-tag>
                                <el-tag
                                        v-for="tag in demo.tags"
                                        :key="tag"
                                        size="small"
                                        class="tag-item"
                                >
                                    {{ tag }}
                                </el-tag>
                            </div>
                            
                            <div class="meta-info">
                <span class="create-time">
                  <el-icon><Clock/></el-icon>
                  {{ formatDate(demo.createdTime) }}
                </span>
                                <span v-if="demo.updatedTime" class="update-time">
                  <el-icon><Refresh/></el-icon>
                  更新于 {{ formatDate(demo.updatedTime) }}
                </span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- 空状态 -->
                <div v-if="filteredDemos.length === 0" class="empty-state">
                    <el-empty description="没有找到相关demo"/>
                </div>
            </div>
        </main>
    </div>
</template>

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
    height: 398px;
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

.card-body {
    padding: 16px 20px;
    flex: 1;
}

.card-description {
    font-size: 14px;
    color: #666;
    line-height: 1.6;
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.card-footer {
    padding: 16px 20px;
    border-top: 1px solid #f0f0f0;
    background: #fafafa;
    height: 70px;
}

.tags-container {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    min-height: 46px;
    margin-bottom: 12px;
}

.tag-item {
    background: #f0f9ff;
    border-color: #bae0ff;
    color: #409EFF;
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