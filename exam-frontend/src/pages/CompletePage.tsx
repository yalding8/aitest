import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CompletePage() {
  const navigate = useNavigate();

  useEffect(() => {
    // 检查是否正确进入此页面
    const examId = sessionStorage.getItem('examId');
    if (examId) {
      // 如果还有 examId，说明用户没有正确提交，重定向到首页
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md text-center space-y-8">
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-24 w-24 bg-green-100 rounded-full" />
            </div>
            <svg
              className="relative h-24 w-24 text-green-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">
            答卷已提交
          </h1>
          <p className="text-lg text-gray-600">
            感谢你的参与，我们已收到你的答题结果。
          </p>
          <p className="text-base text-gray-500">
            HR 团队将在审阅后与你联系，祝你好运！
          </p>
        </div>

        {/* Details */}
        <div className="bg-blue-50 rounded-lg p-6 space-y-3 text-left">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">题目数量</span>
            <span className="text-sm text-gray-900">30 道</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">及格线</span>
            <span className="text-sm text-gray-900">80 分</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">评估维度</span>
            <span className="text-sm text-gray-900">AI 能力 & 思维</span>
          </div>
        </div>

        {/* Footer */}
        <div className="space-y-3">
          <p className="text-sm text-gray-500">
            本测试不显示分数，结果已通过安全渠道提交。
          </p>
          <button
            onClick={() => window.location.reload()}
            className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            返回首页
          </button>
        </div>
      </div>
    </div>
  );
}
