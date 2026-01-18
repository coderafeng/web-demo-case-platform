// API 总出口
export * from './types'
export { default as http } from './http'

// 导出所有 API
export { demoApi } from './demos'
export { categoryApi } from './categories'
export { tagApi } from './tags'
export { classApi } from './classes'
export { studentApi } from './students'
export { scoreApi } from './score'

// 重新导出模拟数据（仅开发环境使用）
export * from './mock'