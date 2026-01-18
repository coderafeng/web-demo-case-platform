import axios from 'axios'
import type { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'

// 创建 axios 实例
const http = axios.create({
    baseURL: '/api', // API 基础路径
    timeout: 10000, // 请求超时时间
    headers: {
        'Content-Type': 'application/json'
    }
})

// 请求拦截器
http.interceptors.request.use(
    (config) => {
        // 可以在这里添加 token 等认证信息
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }

        // 模拟请求延迟（仅开发环境）
        if (import.meta.env.DEV) {
            console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, config.params || config.data)
        }

        return config
    },
    (error) => {
        console.error('Request error:', error)
        return Promise.reject(error)
    }
)

// 响应拦截器
http.interceptors.response.use(
    (response) => {
        // 模拟响应延迟（仅开发环境）
        if (import.meta.env.DEV) {
            console.log(`[API Response] ${response.config.url}`, response.data)
        }

        return response
    },
    (error: AxiosError) => {
        // 统一错误处理
        console.error('Response error:', error)

        // 可以根据状态码进行不同的错误处理
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    console.error('未授权，请重新登录')
                    break
                case 403:
                    console.error('拒绝访问')
                    break
                case 404:
                    console.error('请求的资源不存在')
                    break
                case 500:
                    console.error('服务器错误')
                    break
                default:
                    console.error('请求失败')
            }
        }

        return Promise.reject(error)
    }
)

// API 响应格式
export interface ApiResponse<T = any> {
    code: number
    message: string
    data: T
    timestamp: number
    page?: number
    size?: number
    total?: number
}

// 分页参数
export interface PaginationParams {
    page?: number
    size?: number
    keyword?: string
    [key: string]: any // 其他查询参数
}

// 模拟延迟函数
export const mockDelay = (ms: number = 300) => {
    return new Promise(resolve => setTimeout(resolve, ms))
}

// 生成模拟响应
export const createMockResponse = <T>(
    data: T,
    message: string = 'success',
    code: number = 200,
    options?: {
        page?: number
        size?: number
        total?: number
    }
): ApiResponse<T> => {
    return {
        code,
        message,
        data,
        timestamp: Date.now(),
        ...options
    }
}

// 生成模拟分页数据
export const createMockPagination = <T>(
    data: T[],
    page: number = 1,
    size: number = 10,
    total: number = data.length
) => {
    const start = (page - 1) * size
    const end = start + size
    const pagedData = data.slice(start, end)

    return createMockResponse(pagedData, 'success', 200, { page, size, total })
}

// 模拟错误响应
export const mockError = (message: string, code: number = 400) => {
    return Promise.reject({
        response: {
            data: {
                code,
                message,
                timestamp: Date.now()
            }
        }
    })
}

export default http