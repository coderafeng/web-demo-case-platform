<template>
    <div class="demo-detail-page">
        <!-- 顶部导航栏 -->
        <nav class="detail-nav">
            <div class="container">
                <div class="nav-content">
                    <el-button
                            type="primary"
                            link
                            @click="goBack"
                            class="back-button"
                    >
                        <el-icon><ArrowLeft /></el-icon>
                        返回
                    </el-button>
                    
                    <div class="nav-title">
                        <h2>{{ demo?.title || '加载中...' }}</h2>
                        <div class="demo-meta">
                            <el-tag :type="getDifficultyType(demo?.difficulty)" size="small">
                                {{ getDifficultyText(demo?.difficulty) }}
                            </el-tag>
                            <el-tag type="primary" size="small">
                                {{ getCategoryName(demo?.categoryId) }}
                            </el-tag>
                        </div>
                    </div>
                    
                    <!-- 删除顶部运行测试按钮，只保留占位div保持布局 -->
                    <div class="nav-actions-placeholder"></div>
                </div>
            </div>
        </nav>
        
        <!-- 内容区域 -->
        <div class="container detail-container">
            <!-- 统一的信息卡片区域 -->
            <div class="unified-info-card">
                <div class="card-header">
                    <h3 style="text-align: left;">Demo信息</h3>
                </div>
                
                <div class="card-content">
                    <!-- Flex布局的基本信息行 -->
                    <div class="basic-info-row">
                        <!-- 标签 -->
                        <div class="info-item tags-item">
                            <span class="info-label">标签</span>
                            <div class="tags-container">
                                <el-tag
                                        v-for="tag in getDemoTags(demo?.tagIds || [])"
                                        :key="tag.id"
                                        size="small"
                                        class="info-tag"
                                        :style="{
                    backgroundColor: tag.color + '20',
                    borderColor: tag.color,
                    color: tag.color
                  }"
                                >
                                    {{ tag.name }}
                                </el-tag>
                            </div>
                        </div>
                        
                        <!-- 难度等级 -->
                        <div class="info-item">
                            <span class="info-label">难度等级</span>
                            <span class="info-value">
                <el-rate
                        :model-value="getDifficultyStars(demo?.difficulty)"
                        disabled
                        text-color="#ff9900"
                        style="--el-rate-icon-size: 16px;"
                />
              </span>
                        </div>
                        
                        <!-- 创建时间 -->
                        <div class="info-item">
                            <span class="info-label">创建时间</span>
                            <span class="info-value">{{ formatDate(demo?.createdAt) }}</span>
                        </div>
                        
                        <!-- 更新时间 -->
                        <div v-if="demo?.updatedAt" class="info-item">
                            <span class="info-label">更新时间</span>
                            <span class="info-value">{{ formatDate(demo?.updatedAt) }}</span>
                        </div>
                        
                        <!-- 作者 -->
                        <div v-if="demo?.author" class="info-item">
                            <span class="info-label">作者</span>
                            <span class="info-value">{{ demo.author }}</span>
                        </div>
                    </div>
                    
                    <!-- 描述信息（与标题同一行） -->
                    <div class="description-row">
                        <span class="description-label">描述</span>
                        <span class="description-content">
              {{ demo?.description }}
            </span>
                    </div>
                </div>
            </div>
            
            <!-- Demo组件展示区域 -->
            <div class="demo-main-area">
                <div class="demo-area">
                    <div class="demo-header">
                        <h3 style="text-align: left;">Demo演示</h3>
                    </div>
                    
                    <!-- 动态加载Demo组件 -->
                    <div class="demo-component">
                        <div v-if="!currentDemoComponent" class="loading-component">
                            <el-skeleton :rows="5" animated />
                        </div>
                        <component
                                v-else-if="currentDemoComponent"
                                :is="currentDemoComponent"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, defineAsyncComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDemoStore } from '@/stores/demo'
import { ArrowLeft } from '@element-plus/icons-vue'
import type { Demo } from '@/api/types'

const route = useRoute()
const router = useRouter()
const demoStore = useDemoStore()

const loading = ref(false)

// 获取当前demo
const demo = computed(() => {
    return demoStore.currentDemo
})

// 动态加载Demo组件
const currentDemoComponent = computed(() => {
    if (!demo.value) return null
    
    const componentName = demo.value.component
    if (!componentName) return null
    
    try {
        return defineAsyncComponent(() =>
                import(`@/components/demos/${componentName}.vue`)
        )
    } catch (error) {
        console.error('加载组件失败:', error)
        return null
    }
})

// 获取难度对应的颜色类型
const getDifficultyType = (difficulty?: string) => {
    switch (difficulty) {
        case 'beginner': return 'success'
        case 'intermediate': return 'warning'
        case 'advanced': return 'danger'
        default: return 'info'
    }
}

// 获取难度对应的星数
const getDifficultyStars = (difficulty?: string) => {
    switch (difficulty) {
        case 'beginner': return 1
        case 'intermediate': return 3
        case 'advanced': return 5
        default: return 0
    }
}

// 获取难度文本
const getDifficultyText = (difficulty?: string) => {
    const map: Record<string, string> = {
        'beginner': '初级',
        'intermediate': '中级',
        'advanced': '高级'
    }
    return map[difficulty || ''] || difficulty || '未知'
}

// 获取分类名称
const getCategoryName = (categoryId?: string) => {
    if (!categoryId) return '未知'
    const category = demoStore.categories.find(cat => cat.id === categoryId)
    return category?.name || '未知分类'
}

// 获取demo的标签
const getDemoTags = (tagIds: string[]) => {
    return demoStore.tags.filter(tag => tagIds.includes(tag.id))
}

// 格式化日期
const formatDate = (dateStr?: string) => {
    if (!dateStr) return '未知'
    const date = new Date(dateStr)
    return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).replace(/\//g, '-')
}

// 返回上一页
const goBack = () => {
    router.back()
}

onMounted(async () => {
    loading.value = true
    try {
        const demoId = route.params.id as string
        if (demoId) {
            await demoStore.fetchDemoById(demoId)
        }
    } catch (error) {
        console.error('加载demo详情失败:', error)
    } finally {
        loading.value = false
    }
})
</script>

<style scoped>
.demo-detail-page {
    min-height: 100vh;
    background: #f5f7fa;
}

.detail-nav {
    background: white;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    padding: 16px 0;
    position: sticky;
    top: 0;
    z-index: 100;
}

.nav-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    max-width: 1600px;
    margin: 0 auto;
}

.back-button {
    color: #409EFF;
    font-size: 14px;
    min-width: 60px; /* 给返回按钮固定宽度，保持标题居中 */
}

/* 修改标题居中方式 */
.nav-title {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.nav-title h2 {
    margin: 0 0 8px 0;
    font-size: 24px;
    color: #333;
    text-align: center;
}

.demo-meta {
    display: flex;
    justify-content: center;
    gap: 8px;
}

/* 占位div，保持三栏布局平衡 */
.nav-actions-placeholder {
    min-width: 60px; /* 与返回按钮宽度一致，保持标题居中 */
}

.detail-container {
    padding: 30px 20px;
    max-width: 1600px;
    margin: 0 auto;
}

/* 统一的信息卡片 */
.unified-info-card {
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    margin-bottom: 24px;
    overflow: hidden;
}

.card-header {
    padding: 20px 24px;
    border-bottom: 1px solid #e4e7ed;
    background: #fafafa;
}

.card-header h3 {
    margin: 0;
    font-size: 18px;
    color: #333;
    font-weight: 600;
}

.card-content {
    padding: 24px;
}

/* 基本信息行 - Flex布局 */
.basic-info-row {
    display: flex;
    flex-wrap: wrap;
    gap: 32px;
    margin-bottom: 24px;
    padding-bottom: 24px;
    border-bottom: 1px solid #f0f0f0;
}

.info-item {
    display: flex;
    flex-direction: column;
    min-width: 150px;
}

/* 标签项特殊处理 */
.tags-item {
    min-width: 0;
    flex: 0 1 auto;
}

.tags-container {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 4px;
    max-width: 300px;
}

.info-label {
    font-size: 13px;
    color: #666;
    margin-bottom: 6px;
    font-weight: 700;
}

.info-value {
    font-size: 14px;
    color: #333;
    font-weight: 500;
}

.info-tag {
    font-weight: 500;
    border-width: 1px;
    border-style: solid;
    font-size: 12px;
    padding: 2px 8px;
    height: 24px;
    line-height: 20px;
}

/* 描述行（标签和内容同一行） */
.description-row {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    margin-top: 16px;
}

.description-label {
    font-size: 13px;
    color: #666;
    font-weight: 600;
    min-width: 40px;
    line-height: 1.6;
    padding-top: 2px;
}

.description-content {
    font-size: 14px;
    color: #666;
    line-height: 1.6;
    flex: 1;
    margin: 0;
    text-align: justify;
}

/* Demo主区域 */
.demo-main-area {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.demo-area {
    width: 100%;
}

.demo-header {
    padding: 20px 24px;
    border-bottom: 1px solid #e4e7ed;
    background: white;
}

.demo-header h3 {
    margin: 0;
    font-size: 18px;
    color: #333;
    font-weight: 600;
}

.demo-component {
    padding: 24px;
    min-height: 400px;
    background: #fafafa;
}

.loading-component {
    padding: 20px;
}

/* 响应式设计 */
@media (max-width: 1024px) {
    .basic-info-row {
        gap: 24px;
    }
    
    .info-item {
        min-width: 120px;
    }
    
    .tags-item {
        min-width: 100%;
        order: -1;
    }
}

@media (max-width: 768px) {
    .nav-content {
        flex-direction: column;
        gap: 12px;
        text-align: center;
    }
    
    .nav-title {
        width: 100%;
    }
    
    .nav-title h2 {
        font-size: 20px;
        text-align: center;
    }
    
    .back-button {
        align-self: flex-start;
        margin-bottom: 8px;
    }
    
    .nav-actions-placeholder {
        display: none;
    }
    
    .basic-info-row {
        flex-direction: column;
        gap: 20px;
    }
    
    .info-item {
        min-width: auto;
        width: 100%;
    }
    
    .tags-item {
        min-width: auto;
    }
    
    .description-row {
        flex-direction: column;
        gap: 8px;
    }
    
    .description-label {
        min-width: auto;
    }
    
    .demo-header {
        padding: 16px 20px;
    }
}

@media (max-width: 480px) {
    .detail-container {
        padding: 20px 15px;
    }
    
    .card-content,
    .demo-component {
        padding: 16px;
    }
    
    .basic-info-row {
        gap: 16px;
    }
    
    .tags-container {
        gap: 4px;
    }
}
</style>