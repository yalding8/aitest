import axios from 'axios';

// 在生产环境使用相对路径，开发环境使用 localhost
const isProduction = import.meta.env.MODE === 'production';
// 如果是生产环境，强制使用 /api。否则优先使用 VITE_API_URL，最后回退到 localhost:3005
const API_BASE_URL = isProduction ? '/api' : (import.meta.env.VITE_API_URL || 'http://localhost:3005/api');

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface VerifyRequest {
  code: string;
}

export interface VerifyResponse {
  success: boolean;
  message: string;
}

export interface StartExamRequest {
  code: string;
  name: string;
  email: string;
  position: string;
}

export interface Question {
  id: number;
  type: 'single' | 'multiple' | 'case';
  category: string;
  question: string;
  options: string[];
  score: number;
}

export interface StartExamResponse {
  success: boolean;
  examId: string;
  questions: Question[];
  duration: number; // 分钟
}

export interface SubmitRequest {
  examId: string;
  answers: Record<number, string | string[]>;
  duration: number; // 花费的秒数
}

export interface SubmitResponse {
  success: boolean;
  message: string;
  score?: number;
}

// API 调用函数
export const examAPI = {
  verify: (code: string) => apiClient.post<VerifyResponse>('/verify', { code }),
  startExam: (data: StartExamRequest) => apiClient.post<StartExamResponse>('/start', data),
  submitExam: (data: SubmitRequest) => apiClient.post<SubmitResponse>('/submit', data),
};
