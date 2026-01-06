import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { examAPI } from '../api/client';

export default function AuthPage() {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [position, setPosition] = useState('咨询顾问');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!code.trim() || !name.trim() || !email.trim()) {
      setError('请填写所有字段');
      return;
    }

    if (!privacyAccepted) {
      setError('请阅读并同意隐私政策');
      return;
    }

    setLoading(true);
    try {
      // 验证授权码
      await examAPI.verify(code);

      // 验证成功，开始考试
      const response = await examAPI.startExam({
        code,
        name,
        email,
        position,
      });

      if (response.data.success) {
        // 保存考试信息到 sessionStorage
        sessionStorage.setItem('examId', response.data.examId);
        sessionStorage.setItem('examCode', code);
        sessionStorage.setItem('examStartTime', Date.now().toString());
        sessionStorage.setItem('examDuration', response.data.duration.toString());

        // 跳转到考试页面
        navigate('/exam');
      } else {
        setError('启动考试失败，请重试');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || '授权码无效或已使用');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">AI应用及思考能力测试</h1>
          <p className="mt-2 text-sm text-gray-600">
            评估你的 AI 应用能力和思维方式
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                授权码 <span className="text-red-500">*</span>
              </label>
              <input
                id="code"
                type="text"
                required
                placeholder="输入授权码"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                姓名 <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                required
                placeholder="输入你的姓名"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                邮箱 <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                required
                placeholder="输入你的邮箱"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="position" className="block text-sm font-medium text-gray-700">
                应聘岗位 <span className="text-red-500">*</span>
              </label>
              <select
                id="position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              >
                <option value="咨询顾问">咨询顾问</option>
                <option value="渠道BD">渠道BD</option>
                <option value="大客户经理">大客户经理（KA）</option>
              </select>
            </div>
          </div>

          {/* 隐私政策和授权说明 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
            <h3 className="text-sm font-semibold text-blue-900">🔒 隐私保护声明</h3>
            <div className="text-xs text-blue-800 space-y-2">
              <p>• 您的个人信息仅用于本次测试，不会用于其他目的</p>
              <p>• 考试结果将通过内部系统推送给HR，不对外公开</p>
              <p>• 您的答题数据仅保存在本地，不会上传至第三方</p>
              <p>• 考试过程中不会显示分数，保护您的隐私</p>
            </div>
            
            <div className="flex items-start space-x-2">
              <input
                id="privacy"
                type="checkbox"
                checked={privacyAccepted}
                onChange={(e) => setPrivacyAccepted(e.target.checked)}
                className="mt-0.5 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="privacy" className="text-xs text-blue-900">
                我已阅读并同意上述隐私政策，授权进行AI应用及思考能力测试
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !privacyAccepted}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '开始考试中...' : '开始考试'}
          </button>
        </form>

        <div className="text-center text-sm text-gray-600 space-y-2">
          <p>✓ 30 道题目</p>
          <p>✓ 60 分钟限时</p>
          <p>✓ 无需等待反馈</p>
        </div>
      </div>
    </div>
  );
}
