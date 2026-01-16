<script setup lang="ts">
</script>

<template>
    <div class="virtual-scroll-demo">
        <h3>虚拟滚动列表</h3>
        <p class="demo-description">大数据量下的虚拟滚动优化方案</p>
        
        <div class="demo-content">
            <el-alert
                    title="这是一个占位组件，实际项目中需要实现虚拟滚动逻辑"
                    type="info"
                    :closable="false"
            />
        </div>
    </div>
</template>

<style scoped>
.virtual-scroll-demo {
    padding: 20px;
}

.demo-description {
    color: #666;
    margin-bottom: 20px;
}

.demo-content {
    padding: 20px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>