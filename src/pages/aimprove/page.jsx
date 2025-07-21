import React from 'react';
import { RocketIcon } from 'lucide-react';

export default function AimprovePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <RocketIcon className="w-12 h-12 text-blue-600 mr-4" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 to-blue-700 bg-clip-text text-transparent">
              Aimprove
            </h1>
          </div>
          <p className="text-xl text-slate-600 mb-8">
            Improve your skills with AI-powered learning and development tools.
          </p>
          <div className="glass-card p-8 rounded-2xl max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">Coming Soon</h2>
            <p className="text-slate-600">
              This feature is under development. Stay tuned for personalized skill improvement recommendations and learning paths.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
