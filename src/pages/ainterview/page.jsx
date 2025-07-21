import React, { useState } from 'react';
import { Globe2, ArrowLeft, Trophy, Clock, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AinterviewPage() {
  const navigate = useNavigate();
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [sessionResults, setSessionResults] = useState(null);

  const handleStartInterview = () => {
    navigate('/ainterview/interview-simulation');
  };

  const handleEndInterview = (conversationHistory, questionCount) => {
    setSessionResults({
      history: conversationHistory,
      questionCount: questionCount,
      completedAt: new Date().toISOString()
    });
    setInterviewStarted(false);
  };

  const handleBackToHome = () => {
    setInterviewStarted(false);
    setSessionResults(null);
  };

  const calculateSessionStats = () => {
    if (!sessionResults?.history) return null;
    
    const candidateAnswers = sessionResults.history.filter(item => item.role === 'candidate');
    const avgWordsPerAnswer = candidateAnswers.reduce((acc, answer) => {
      return acc + answer.content.split(' ').length;
    }, 0) / candidateAnswers.length || 0;

    return {
      totalQuestions: sessionResults.questionCount,
      totalAnswers: candidateAnswers.length,
      avgWordsPerAnswer: Math.round(avgWordsPerAnswer),
      sessionDuration: 'N/A' // Could be calculated if we track start/end times
    };
  };

  // Results View
  if (sessionResults) {
    const stats = calculateSessionStats();
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-6">
              <Trophy className="w-12 h-12 text-yellow-500 mr-4" />
              <h1 className="text-4xl font-bold text-slate-800">Interview Complete!</h1>
            </div>
            <p className="text-xl text-slate-600">
              Great job on completing your AI interview session
            </p>
          </div>

          {/* Session Statistics */}
          {stats && (
            <div className="glass-card p-6 rounded-xl mb-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">Session Statistics</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Target className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-slate-800">{stats.totalQuestions}</div>
                  <div className="text-sm text-slate-600">Questions</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Globe2 className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-slate-800">{stats.totalAnswers}</div>
                  <div className="text-sm text-slate-600">Answers</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Clock className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="text-2xl font-bold text-slate-800">{stats.avgWordsPerAnswer}</div>
                  <div className="text-sm text-slate-600">Avg Words</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Trophy className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="text-2xl font-bold text-slate-800">100%</div>
                  <div className="text-sm text-slate-600">Completion</div>
                </div>
              </div>
            </div>
          )}

          {/* Interview History */}
          <div className="glass-card p-6 rounded-xl mb-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Interview Summary</h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {sessionResults.history.map((item, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg ${
                    item.role === 'interviewer' 
                      ? 'bg-blue-50 border-l-4 border-blue-400' 
                      : 'bg-green-50 border-l-4 border-green-400'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-sm font-medium ${
                      item.role === 'interviewer' ? 'text-blue-700' : 'text-green-700'
                    }`}>
                      {item.role === 'interviewer' ? 'AI Interviewer' : 'Your Answer'}
                    </span>
                    <span className="text-xs text-slate-500">
                      {new Date(item.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className={`text-sm ${
                    item.role === 'interviewer' ? 'text-blue-800' : 'text-green-800'
                  }`}>
                    {item.content}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleStartInterview}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Start New Interview
            </button>
            <button
              onClick={handleBackToHome}
              className="bg-slate-600 hover:bg-slate-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Setup
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Landing/Setup View
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Globe2 className="w-12 h-12 text-blue-600 mr-4" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 to-blue-700 bg-clip-text text-transparent">
              AI Interview
            </h1>
          </div>
          <p className="text-xl text-slate-600 mb-8">
            Practice and perfect your interview skills with AI-powered mock interviews supporting multiple languages.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="glass-card p-6 rounded-xl text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Globe2 className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Multi-Language Support</h3>
            <p className="text-slate-600 text-sm">
              Practice interviews in English, Indonesian, Chinese, and Japanese
            </p>
          </div>
          
          <div className="glass-card p-6 rounded-xl text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Target className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">AI-Powered Feedback</h3>
            <p className="text-slate-600 text-sm">
              Get instant, detailed feedback on your answers with scoring and improvement suggestions
            </p>
          </div>
          
          <div className="glass-card p-6 rounded-xl text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Voice Recognition</h3>
            <p className="text-slate-600 text-sm">
              Use voice input and hear questions spoken aloud for a realistic interview experience
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="glass-card p-8 rounded-2xl max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">Ready to Start?</h2>
            <p className="text-slate-600 mb-6">
              Begin your AI-powered interview practice session. Choose your job role, language, and difficulty level to get personalized questions and feedback.
            </p>
            <button
              onClick={handleStartInterview}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-8 rounded-lg font-medium transition-all transform hover:scale-105 shadow-lg"
            >
              Start Interview Practice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}