<script setup lang="ts">
import {ref, computed, onMounted, defineAsyncComponent} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useDemoStore} from '@/stores/demo'
import {ArrowLeft} from '@element-plus/icons-vue'
import type {DemoItem} from '@/types/demo'

const route = useRoute()
const router = useRouter()
const demoStore = useDemoStore()

const showCode = ref(false)
const running = ref(false)
const demoCode = ref('')

// 获取当前demo
const demo = computed(() => {
    const demoId = route.params.id as string
    return demoStore.getDemoById(demoId)
})

// 动态加载Demo组件
const currentDemoComponent = computed(() => {
    if (!demo.value) return null
    
    const componentName = demo.value.component
    return defineAsyncComponent(() =>
            import(`@/components/demos/${componentName}.vue`)
    )
})

// 获取相关demo（同分类）
const relatedDemos = computed(() => {
    if (!demo.value) return []
    return demoStore.getDemosByCategory(demo.value.category)
            .filter(d => d.id !== demo.value!.id)
            .slice(0, 3)
})

// 运行demo
const runDemo = async () => {
    running.value = true
    // 模拟运行过程
    await new Promise(resolve => setTimeout(resolve, 1000))
    running.value = false
    
    // 这里可以执行demo特定的运行逻辑
    console.log(`运行demo: ${demo.value?.title}`)
}

// 返回上一页
const goBack = () => {
    router.back()
}

// 跳转到其他demo
const goToDemo = (id: string) => {
    router.push(`/demo/${id}`)
}

// 获取难度对应的颜色类型
const getDifficultyType = (difficulty?: string) => {
    switch (difficulty) {
        case '初级':
            return 'success'
        case '中级':
            return 'warning'
        case '高级':
            return 'danger'
        default:
            return 'info'
    }
}

// 获取难度对应的星数
const getDifficultyStars = (difficulty?: string) => {
    switch (difficulty) {
        case '初级':
            return 1
        case '中级':
            return 3
        case '高级':
            return 5
        default:
            return 0
    }
}

// 格式化日期
const formatDate = (dateStr?: string) => {
    if (!dateStr) return '未知'
    const date = new Date(dateStr)
    return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

onMounted(() => {
    if (!demo.value) {
        router.replace('/')
    }
})
</script>

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
                        <el-icon>
                            <ArrowLeft/>
                        </el-icon>
                        返回
                    </el-button>
                    
                    <div class="nav-title">
                        <h2>{{ demo?.title }}</h2>
                        <div class="demo-meta">
                            <el-tag :type="getDifficultyType(demo?.difficulty)" size="small">
                                {{ demo?.difficulty }}
                            </el-tag>
                            <el-tag type="primary" size="small">
                                {{ demo?.category }}
                            </el-tag>
                        </div>
                    </div>
                    
                    <div class="nav-actions">
                        <el-button type="primary" @click="runDemo" :loading="running">
                            运行测试
                        </el-button>
                    </div>
                </div>
            </div>
        </nav>
        
        <!-- 内容区域 -->
        <div class="container detail-container">
            <div class="detail-content">
                <!-- Demo组件展示区域 -->
                <div class="demo-area">
                    <div class="demo-header">
                        <h3>Demo演示</h3>
                        <el-button
                                type="text"
                                @click="showCode = !showCode"
                        >
                            {{ showCode ? '隐藏代码' : '查看代码' }}
                        </el-button>
                    </div>
                    
                    <!-- 动态加载Demo组件 -->
                    <div class="demo-component">
                        <component
                                :is="currentDemoComponent"
                                v-if="currentDemoComponent && !showCode"
                        />
                        
                        <!-- 代码展示 -->
                        <div v-if="showCode" class="code-preview">
                            <pre><code>{{ demoCode }}</code></pre>
                        </div>
                    </div>
                </div>
                
                <!-- 右侧信息栏 -->
                <div class="info-sidebar">
                    <!-- Demo信息 -->
                    <div class="info-card">
                        <h4>Demo信息</h4>
                        <div class="info-item">
                            <span class="info-label">创建时间:</span>
                            <span class="info-value">{{ formatDate(demo?.createdTime) }}</span>
                        </div>
                        <div v-if="demo?.updatedTime" class="info-item">
                            <span class="info-label">更新时间:</span>
                            <span class="info-value">{{ formatDate(demo?.updatedTime) }}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">难度等级:</span>
                            <span class="info-value">
                <el-rate
                        :model-value="getDifficultyStars(demo?.difficulty)"
                        disabled
                        show-score
                        text-color="#ff9900"
                />
              </span>
                        </div>
                    </div>
                    
                    <!-- 标签 -->
                    <div class="info-card">
                        <h4>标签</h4>
                        <div class="tags-container">
                            <el-tag
                                    v-for="tag in demo?.tags"
                                    :key="tag"
                                    size="small"
                                    class="info-tag"
                            >
                                {{ tag }}
                            </el-tag>
                        </div>
                    </div>
                    
                    <!-- 描述 -->
                    <div class="info-card">
                        <h4>描述</h4>
                        <p class="description">{{ demo?.description }}</p>
                    </div>
                    
                    <!-- 相关Demo -->
                    <div class="info-card">
                        <h4>相关Demo</h4>
                        <div class="related-demos">
                            <div
                                    v-for="related in relatedDemos"
                                    :key="related.id"
                                    class="related-item"
                                    @click="goToDemo(related.id)"
                            >
                                <span class="related-title">{{ related.title }}</span>
                                <el-tag size="small" :type="getDifficultyType(related.difficulty)">
                                    {{ related.difficulty }}
                                </el-tag>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.demo-detail-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
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
}

.back-button {
    color: #409EFF;
    font-size: 14px;
}

.nav-title {
    text-align: center;
    flex: 1;
}

.nav-title h2 {
    margin: 0 0 8px 0;
    font-size: 24px;
    color: #333;
}

.demo-meta {
    display: flex;
    justify-content: center;
    gap: 8px;
}

.detail-container {
    padding: 30px 0;
}

.detail-content {
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 24px;
}

@media (max-width: 992px) {
    .detail-content {
        grid-template-columns: 1fr;
    }
}

.demo-area {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.demo-header {
    padding: 20px 24px;
    border-bottom: 1px solid #e4e7ed;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.demo-header h3 {
    margin: 0;
    font-size: 18px;
    color: #333;
}

.demo-component {
    padding: 24px;
    min-height: 400px;
}

.code-preview {
    background: #1e1e1e;
    color: #d4d4d4;
    padding: 20px;
    border-radius: 8px;
    overflow-x: auto;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 14px;
    line-height: 1.5;
}

.code-preview pre {
    margin: 0;
}

.info-sidebar {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.info-card {
    background: white;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.info-card h4 {
    margin: 0 0 16px 0;
    font-size: 16px;
    color: #333;
    padding-bottom: 12px;
    border-bottom: 1px solid #e4e7ed;
}

.info-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
}

.info-label {
    font-size: 14px;
    color: #666;
}

.info-value {
    font-size: 14px;
    color: #333;
    font-weight: 500;
}

.tags-container {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.info-tag {
    background: #f0f9ff;
    border-color: #bae0ff;
    color: #409EFF;
}

.description {
    font-size: 14px;
    color: #666;
    line-height: 1.6;
    margin: 0;
}

.related-demos {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.related-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    background: #f8f9fa;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.related-item:hover {
    background: #e9ecef;
    transform: translateX(4px);
}

.related-title {
    font-size: 14px;
    color: #333;
    flex: 1;
    margin-right: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>