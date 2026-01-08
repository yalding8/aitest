import React from 'react';
import { useNavigate } from 'react-router-dom';

const GuidePage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 mb-8 border border-blue-100">
                    <div className="flex items-center justify-center mb-3">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <span className="text-3xl">📖</span>
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                        AI应用及思考能力测试
                    </h1>
                    <p className="text-center text-xl text-gray-600 font-medium">考生操作手册</p>
                </div>

                {/* Content */}
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-10 space-y-10 border border-blue-100">
                    {/* Section 1 */}
                    <section className="group">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md">
                                1
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">考前准备</h2>
                        </div>
                        <div className="ml-13 space-y-4">
                            <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-blue-50 transition-colors">
                                <div className="text-3xl">💻</div>
                                <div className="flex-1">
                                    <p className="text-gray-700"><strong className="text-gray-900">建议设备</strong>：推荐使用 <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md font-semibold">电脑（PC/Mac）</span> 访问，体验最佳。</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-blue-50 transition-colors">
                                <div className="text-3xl">🌐</div>
                                <div className="flex-1">
                                    <p className="text-gray-700"><strong className="text-gray-900">浏览器</strong>：推荐使用 <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md font-semibold">Chrome</span>、<span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md font-semibold">Edge</span> 或 <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md font-semibold">Safari</span> 浏览器。</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-blue-50 transition-colors">
                                <div className="text-3xl">⏱️</div>
                                <div className="flex-1">
                                    <p className="text-gray-700"><strong className="text-gray-900">网络环境</strong>：请确保网络连接稳定，建议预留 <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md font-semibold">60分钟</span> 无干扰时间。</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 2 */}
                    <section className="group">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md">
                                2
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">登录考试系统</h2>
                        </div>
                        <div className="ml-13 space-y-4">
                            <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-indigo-50 transition-colors">
                                <div className="text-3xl">🔗</div>
                                <div className="flex-1">
                                    <p className="text-gray-700 mb-2"><strong className="text-gray-900">访问地址</strong>：</p>
                                    <a
                                        href="https://test.pylosy.com/"
                                        className="inline-block px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        https://test.pylosy.com/
                                    </a>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-indigo-50 transition-colors">
                                <div className="text-3xl">📝</div>
                                <div className="flex-1">
                                    <p className="text-gray-700 mb-3"><strong className="text-gray-900">登录步骤</strong>：</p>
                                    <ol className="space-y-2 text-gray-700">
                                        <li className="flex items-start gap-2">
                                            <span className="text-indigo-600 font-bold">①</span>
                                            <span>点击链接进入系统首页</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-indigo-600 font-bold">②</span>
                                            <span>输入HR/管理员分发的 <strong>授权码</strong>（例如：<code className="px-3 py-1 bg-gray-800 text-green-400 rounded-md font-mono text-sm">UHOMESBJ123</code>）</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-indigo-600 font-bold">③</span>
                                            <span>填写真实姓名、邮箱及应聘/在职岗位</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-indigo-600 font-bold">④</span>
                                            <span>点击"开始考试"</span>
                                        </li>
                                    </ol>
                                </div>
                            </div>
                            <div className="p-4 bg-amber-50 border-l-4 border-amber-400 rounded-lg">
                                <div className="flex items-start gap-3">
                                    <span className="text-2xl">⚠️</span>
                                    <p className="text-sm text-amber-800">
                                        <strong>注意</strong>：如果不确定您的授权码，请联系招聘负责人或部门主管。
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 3 */}
                    <section className="group">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md">
                                3
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">考试规则</h2>
                        </div>
                        <div className="ml-13 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-5 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                                <div className="text-3xl mb-2">📊</div>
                                <p className="text-gray-700"><strong className="text-gray-900">题量</strong>：共 <span className="text-2xl font-bold text-purple-600">30</span> 道题目</p>
                            </div>
                            <div className="p-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                                <div className="text-3xl mb-2">⏰</div>
                                <p className="text-gray-700"><strong className="text-gray-900">时长</strong>：限时 <span className="text-2xl font-bold text-blue-600">60</span> 分钟</p>
                            </div>
                            <div className="p-5 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                                <div className="text-3xl mb-2">✏️</div>
                                <p className="text-gray-700"><strong className="text-gray-900">题型</strong>：单选 + 多选</p>
                            </div>
                            <div className="p-5 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200">
                                <div className="text-3xl mb-2">📤</div>
                                <p className="text-gray-700"><strong className="text-gray-900">提交</strong>：手动或自动</p>
                            </div>
                        </div>
                    </section>

                    {/* Section 4 */}
                    <section className="group">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md">
                                4
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">注意事项</h2>
                        </div>
                        <div className="ml-13 space-y-3">
                            <div className="flex items-start gap-3 p-4 bg-red-50 rounded-xl border border-red-200">
                                <span className="text-2xl">🔴</span>
                                <p className="text-gray-700"><strong className="text-red-600">请勿刷新页面</strong>：考试过程中刷新可能会导致答题进度丢失。</p>
                            </div>
                            <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                                <span className="text-2xl">🔒</span>
                                <p className="text-gray-700"><strong className="text-yellow-700">一次性有效</strong>：您的授权码在提交试卷后立即失效，无法再次登录。</p>
                            </div>
                            <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl border border-green-200">
                                <span className="text-2xl">✅</span>
                                <p className="text-gray-700"><strong className="text-green-700">结果反馈</strong>：提交成功后，页面会提示"答卷已提交"。系统不直接显示分数，评估结果将由后台自动推送给招聘/管理团队。</p>
                            </div>
                        </div>
                    </section>

                    {/* Section 5 */}
                    <section className="group">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md">
                                5
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">遇到问题怎么办？</h2>
                        </div>
                        <div className="ml-13">
                            <p className="text-gray-700 mb-4">如遇到页面卡顿、授权码无效或无法提交等情况：</p>
                            <div className="space-y-2">
                                {['检查网络连接', '截图保留当前页面状态', '立即联系对应HR或IT支持人员处理'].map((step, idx) => (
                                    <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                        <div className="w-6 h-6 bg-gray-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                            {idx + 1}
                                        </div>
                                        <span className="text-gray-700">{step}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Footer */}
                    <div className="pt-8 border-t-2 border-gray-200">
                        <p className="text-center text-gray-600 text-lg mb-6 italic">🍀 祝您考试顺利！</p>

                        {/* CTA Button */}
                        <div className="flex justify-center">
                            <button
                                onClick={() => navigate('/')}
                                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                            >
                                <span className="flex items-center gap-2">
                                    <span>返回登录页面</span>
                                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GuidePage;
