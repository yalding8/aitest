import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { examAPI, Question } from '../api/client';

interface ExamState {
  questions: Question[];
  answers: Record<number, string | string[]>;
  currentQuestionIndex: number;
}

export default function ExamPage() {
  const navigate = useNavigate();
  const [exam, setExam] = useState<ExamState>({
    questions: [],
    answers: {},
    currentQuestionIndex: 0,
  });
  const [timeLeft, setTimeLeft] = useState(3600); // 60 分钟 = 3600 秒
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  const examId = sessionStorage.getItem('examId');
  const examCode = sessionStorage.getItem('examCode');

  // 从 sessionStorage 加载考试数据
  useEffect(() => {
    const loadExamData = async () => {
      if (!examId || !examCode) {
        navigate('/');
        return;
      }

      try {
        // 获取题库
        const questionsData = await fetch('/题库.json').then(r => r.json());

        // 随机抽取 30 道题
        const shuffled = questionsData.questions
          .sort(() => Math.random() - 0.5)
          .slice(0, 30);

        setExam(prev => ({
          ...prev,
          questions: shuffled,
          answers: {},
        }));
      } catch (err) {
        console.error('Failed to load questions:', err);
        // 如果加载失败，导航回首页
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    loadExamData();
  }, [examId, examCode, navigate]);

  // 自动保存答案到 localStorage
  useEffect(() => {
    if (examId && exam.answers) {
      localStorage.setItem(`exam_${examId}`, JSON.stringify(exam.answers));
    }
  }, [examId, exam.answers]);

  // 页面关闭时自动提交
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!submitted && examId) {
        // 尝试发送答案
        navigator.sendBeacon(
          'http://localhost:3001/api/submit',
          JSON.stringify({
            examId,
            answers: exam.answers,
            duration: Math.floor((Date.now() - parseInt(sessionStorage.getItem('examStartTime') || '0')) / 1000)
          })
        );
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [examId, exam.answers, submitted]);

  // 倒计时
  useEffect(() => {
    if (submitted || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [submitted]);

  // 自动提交
  const handleSubmit = useCallback(async () => {
    if (submitted) return;
    setSubmitted(true);

    const startTime = parseInt(sessionStorage.getItem('examStartTime') || '0');
    const duration = Math.floor((Date.now() - startTime) / 1000);

    try {
      await examAPI.submitExam({
        examId: examId!,
        answers: exam.answers,
        duration,
      });

      sessionStorage.removeItem('examId');
      sessionStorage.removeItem('examCode');
      sessionStorage.removeItem('examStartTime');

      navigate('/complete');
    } catch (err) {
      console.error('Failed to submit exam:', err);
      alert('提交失败，请重试');
      setSubmitted(false);
    }
  }, [examId, exam.answers, navigate, submitted]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-600">加载题目中...</p>
      </div>
    );
  }

  // 如果没有题目，显示错误信息
  if (!exam.questions.length) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg text-red-600 mb-4">加载题目失败</p>
          <button 
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            返回首页
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = exam.questions[exam.currentQuestionIndex];
  const progress = ((exam.currentQuestionIndex + 1) / exam.questions.length) * 100;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeColor = timeLeft < 300 ? 'text-red-600' : 'text-gray-900';

  const handleAnswerChange = (value: string) => {
    if (currentQuestion.type === 'single') {
      setExam(prev => ({
        ...prev,
        answers: {
          ...prev.answers,
          [currentQuestion.id]: value,
        },
      }));
    } else if (currentQuestion.type === 'multiple') {
      const current = (exam.answers[currentQuestion.id] as string[]) || [];
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      setExam(prev => ({
        ...prev,
        answers: {
          ...prev.answers,
          [currentQuestion.id]: updated,
        },
      }));
    } else {
      // case 类型作为单选
      setExam(prev => ({
        ...prev,
        answers: {
          ...prev.answers,
          [currentQuestion.id]: value,
        },
      }));
    }
  };

  const handlePrevious = () => {
    if (exam.currentQuestionIndex > 0) {
      setExam(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex - 1,
      }));
    }
  };

  const handleNext = () => {
    if (exam.currentQuestionIndex < exam.questions.length - 1) {
      setExam(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
      }));
    }
  };

  const handleJumpToQuestion = (index: number) => {
    setExam(prev => ({
      ...prev,
      currentQuestionIndex: index,
    }));
  };

  const currentAnswer = exam.answers[currentQuestion.id];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold text-gray-900">
              第 {exam.currentQuestionIndex + 1}/{exam.questions.length} 题
            </h1>
          </div>
          <div className={`text-2xl font-mono font-bold ${timeColor}`}>
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-gray-200">
          <div
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {/* Question */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-blue-100 text-blue-600 text-sm font-semibold">
                    {exam.currentQuestionIndex + 1}
                  </span>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    {currentQuestion.type === 'single' && '单选题'}
                    {currentQuestion.type === 'multiple' && '多选题'}
                    {currentQuestion.type === 'case' && '案例分析'}
                  </span>
                </div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  {currentQuestion.question}
                </h2>
                <p className="text-sm text-gray-500">
                  分类：{currentQuestion.category}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {currentQuestion.options.map((option, idx) => {
                  const optionKey = String.fromCharCode(65 + idx); // A, B, C, D
                  const isSelected =
                    currentQuestion.type === 'multiple'
                      ? (currentAnswer as string[])?.includes(optionKey)
                      : currentAnswer === optionKey;

                  return (
                    <label
                      key={idx}
                      className={`flex items-start p-4 border rounded-lg cursor-pointer transition-all ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <input
                        type={currentQuestion.type === 'multiple' ? 'checkbox' : 'radio'}
                        name={`question-${currentQuestion.id}`}
                        value={optionKey}
                        checked={isSelected}
                        onChange={() => handleAnswerChange(optionKey)}
                        className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <div className="ml-3 flex-1">
                        <span className="font-medium text-gray-900">{optionKey}.</span>
                        <p className="text-gray-700 ml-2 inline">{option}</p>
                      </div>
                    </label>
                  );
                })}
              </div>

              {/* Navigation */}
              <div className="mt-8 flex justify-between gap-4">
                <button
                  onClick={handlePrevious}
                  disabled={exam.currentQuestionIndex === 0}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  上一题
                </button>

                <div className="flex gap-3">
                  <button
                    onClick={handleSubmit}
                    disabled={submitted}
                    className="px-6 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitted ? '提交中...' : '提前结束'}
                  </button>

                  {exam.currentQuestionIndex === exam.questions.length - 1 ? (
                    <button
                      onClick={handleSubmit}
                      disabled={submitted}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitted ? '提交中...' : '提交答卷'}
                    </button>
                  ) : (
                    <button
                      onClick={handleNext}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                    >
                      下一题
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Question Navigation */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-20">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">题目导航</h3>
              <div className="grid grid-cols-5 gap-2">
                {exam.questions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleJumpToQuestion(idx)}
                    className={`h-8 w-8 text-xs rounded font-medium transition-colors ${
                      idx === exam.currentQuestionIndex
                        ? 'bg-blue-600 text-white'
                        : exam.answers[q.id]
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    title={`第 ${idx + 1} 题`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 space-y-2 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 bg-green-100 rounded" />
                  <span>已作答</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 bg-gray-100 rounded" />
                  <span>未作答</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
