import React from 'react';
import { BookOpenCheck } from 'lucide-react';

export default function AitestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <BookOpenCheck className="w-12 h-12 text-blue-600 mr-4" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 to-blue-700 bg-clip-text text-transparent">
              Aitest
            </h1>
          </div>
          <p className="text-xl text-slate-600 mb-8">
            Test your knowledge and skills with AI-generated assessments and quizzes.
          </p>
          <div className="glass-card p-8 rounded-2xl max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">Coming Soon</h2>
            <p className="text-slate-600">
              This feature is under development. Prepare for adaptive testing and comprehensive skill assessments.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
