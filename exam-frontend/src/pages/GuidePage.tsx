import React from 'react';
import { useNavigate } from 'react-router-dom';

const GuidePage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
                    <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
                        AI应用及思考能力测试
                    </h1>
                    <p className="text-center text-lg text-gray-600">考生操作手册</p>
                </div>

                {/* Content */}
                <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
                    {/* Section 1 */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-blue-500">
                            1. 考前准备
                        </h2>
                        <ul className="space-y-3 text-gray-700">
                            <li className="flex items-start">
                                <span className="text-blue-500 mr-2">•</span>
                                <div>
                                    <strong>建议设备</strong>：推荐使用 <strong className="text-blue-600">电脑（PC/Mac）</strong> 访问，体验最佳。
                                </div>
                            </li>
                            <li className="flex items-start">
                                <span className="text-blue-500 mr-2">•</span>
                                <div>
                                    <strong>浏览器</strong>：推荐使用 <strong className="text-blue-600">Chrome</strong>、<strong className="text-blue-600">Edge</strong> 或 <strong className="text-blue-600">Safari</strong> 浏览器。
                                </div>
                            </li>
                            <li className="flex items-start">
                                <span className="text-blue-500 mr-2">•</span>
                                <div>
                                    <strong>网络环境</strong>：请确保网络连接稳定，建议预留 <strong className="text-blue-600">60分钟</strong> 无干扰时间。
                                </div>
                            </li>
                        </ul>
                    </section>

                    {/* Section 2 */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-blue-500">
                            2. 登录考试系统
                        </h2>
                        <ul className="space-y-3 text-gray-700">
                            <li className="flex items-start">
                                <span className="text-blue-500 mr-2">•</span>
                                <div>
                                    <strong>访问地址</strong>：
                                    <a href="https://test.pylosy.com/" className="text-blue-600 hover:underline ml-1">
                                        https://test.pylosy.com/
                                    </a>
                                </div>
                            </li>
                            <li className="flex items-start">
                                <span className="text-blue-500 mr-2">•</span>
                                <div>
                                    <strong>登录步骤</strong>：
                                    <ol className="list-decimal ml-6 mt-2 space-y-2">
                                        <li>点击链接进入系统首页。</li>
                                        <li>输入HR/管理员分发的 <strong>授权码</strong>（例如：<code className="bg-gray-100 px-2 py-1 rounded text-sm">UHOMESBJ123</code>）。</li>
                                        <li>填写真实姓名、邮箱及应聘/在职岗位（咨询顾问/渠道BD/大客户经理等）。</li>
                                        <li>点击"开始考试"。</li>
                                    </ol>
                                </div>
                            </li>
                        </ul>
                        <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                            <p className="text-sm text-yellow-800">
                                <strong>注意</strong>：如果不确定您的授权码，请联系招聘负责人或部门主管。
                            </p>
                        </div>
                    </section>

                    {/* Section 3 */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-blue-500">
                            3. 考试规则
                        </h2>
                        <ul className="space-y-3 text-gray-700">
                            <li className="flex items-start">
                                <span className="text-blue-500 mr-2">•</span>
                                <div>
                                    <strong>题量</strong>：共 <strong className="text-blue-600">30道</strong> 题目（系统随机抽取）。
                                </div>
                            </li>
                            <li className="flex items-start">
                                <span className="text-blue-500 mr-2">•</span>
                                <div>
                                    <strong>时长</strong>：限时 <strong className="text-blue-600">60分钟</strong>。页面上方会显示倒计时。
                                </div>
                            </li>
                            <li className="flex items-start">
                                <span className="text-blue-500 mr-2">•</span>
                                <div>
                                    <strong>题型</strong>：包含单选题（方框选择）和多选题。
                                </div>
                            </li>
                            <li className="flex items-start">
                                <span className="text-blue-500 mr-2">•</span>
                                <div>
                                    <strong>提交</strong>：
                                    <ul className="ml-6 mt-2 space-y-1">
                                        <li>• 答题完毕后，请点击页面底部的"提交答卷"按钮。</li>
                                        <li>• 若倒计时结束，系统将自动提交当前答案。</li>
                                    </ul>
                                </div>
                            </li>
                        </ul>
                    </section>

                    {/* Section 4 */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-blue-500">
                            4. 注意事项
                        </h2>
                        <ol className="space-y-3 text-gray-700 list-decimal ml-6">
                            <li>
                                <span className="text-red-500 mr-2">🔴</span>
                                <strong>请勿刷新页面</strong>：考试过程中刷新可能会导致答题进度丢失。
                            </li>
                            <li>
                                <span className="text-yellow-500 mr-2">🔒</span>
                                <strong>一次性有效</strong>：您的授权码在提交试卷后立即失效，无法再次登录。
                            </li>
                            <li>
                                <span className="text-green-500 mr-2">✅</span>
                                <strong>结果反馈</strong>：提交成功后，页面会提示"答卷已提交"。<strong>系统不直接显示分数</strong>，评估结果将由后台自动推送给招聘/管理团队。
                            </li>
                        </ol>
                    </section>

                    {/* Section 5 */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-blue-500">
                            5. 遇到问题怎么办？
                        </h2>
                        <p className="text-gray-700 mb-3">如遇到页面卡顿、授权码无效或无法提交等情况：</p>
                        <ol className="space-y-2 text-gray-700 list-decimal ml-6">
                            <li>检查网络连接。</li>
                            <li>截图保留当前页面状态。</li>
                            <li>立即联系对应HR或IT支持人员处理。</li>
                        </ol>
                    </section>

                    {/* Footer */}
                    <div className="pt-8 border-t border-gray-200">
                        <p className="text-center text-gray-600 italic">祝您考试顺利！</p>
                    </div>

                    {/* Action Button */}
                    <div className="flex justify-center pt-4">
                        <button
                            onClick={() => navigate('/')}
                            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition-colors duration-200"
                        >
                            返回登录页面
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GuidePage;
