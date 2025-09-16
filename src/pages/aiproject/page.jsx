import React, { useState, useEffect } from 'react';
import { Target, Code, Users, Lightbulb, Trophy, Clock, Star, ChevronRight } from 'lucide-react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useNavigate } from 'react-router-dom';
import LayoutWrapper from '../../components/layout/LayoutWrapper';

function AiprojectContent() {
  const [user, setUser] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const projects = [
    {
      id: 'ecommerce-platform',
      title: 'E-commerce Platform',
      description: 'Build a full-stack e-commerce platform with React, Node.js, and MongoDB',
      duration: '2-3 weeks',
      difficulty: 'Advanced',
      skills: ['React', 'Node.js', 'MongoDB', 'Payment Integration', 'Authentication'],
      icon: '🛒',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'social-media-dashboard',
      title: 'Social Media Dashboard',
      description: 'Create a comprehensive social media analytics dashboard',
      duration: '1-2 weeks',
      difficulty: 'Intermediate',
      skills: ['Vue.js', 'Chart.js', 'API Integration', 'Data Visualization'],
      icon: '📊',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'task-management-app',
      title: 'Task Management App',
      description: 'Develop a collaborative task management application',
      duration: '1 week',
      difficulty: 'Beginner',
      skills: ['JavaScript', 'Local Storage', 'CSS Grid', 'Drag & Drop'],
      icon: '✅',
      color: 'from-green-500 to-teal-500'
    }
  ];

  const handleStartProject = (projectId) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setSelectedProject(projectId);
    // Navigate to project workspace
  };

  return (
    <div className={`min-h-screen ${user ? 'p-8' : 'bg-gradient-to-br from-blue-50 to-indigo-100 pt-32'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Target className="w-12 h-12 text-blue-600 mr-4" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 to-blue-700 bg-clip-text text-transparent">
              AI Project Builder
            </h1>
          </div>
          <p className="text-xl text-slate-600 mb-8">
            Build real-world projects with AI guidance and step-by-step tutorials
          </p>
          {!user && (
            <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-blue-700">
                <strong>Login required:</strong> Please log in to access AI Project features and save your progress.
              </p>
            </div>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="glass-card p-6 rounded-xl text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Code className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Guided Development</h3>
            <p className="text-slate-600 text-sm">
              Step-by-step guidance with AI mentor support throughout the project
            </p>
          </div>
          
          <div className="glass-card p-6 rounded-xl text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Collaborative Features</h3>
            <p className="text-slate-600 text-sm">
              Work with team members and get peer reviews on your project
            </p>
          </div>
          
          <div className="glass-card p-6 rounded-xl text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Portfolio Building</h3>
            <p className="text-slate-600 text-sm">
              Add completed projects directly to your professional portfolio
            </p>
          </div>
        </div>

        {/* Project Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {projects.map((project) => (
            <div key={project.id} className="glass-card rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className={`h-3 bg-gradient-to-r ${project.color}`}></div>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-3">{project.icon}</span>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">{project.title}</h3>
                    <div className="flex items-center text-sm text-slate-500">
                      <Clock className="w-4 h-4 mr-1" />
                      {project.duration}
                      <span className={`ml-2 text-xs px-2 py-1 rounded-full ${
                        project.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                        project.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {project.difficulty}
                      </span>
                    </div>
                  </div>
                </div>
                
                <p className="text-slate-600 mb-4 text-sm">{project.description}</p>
                
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-slate-700 mb-2">Skills You'll Learn:</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.skills.map((skill, idx) => (
                      <span key={idx} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <button
                  onClick={() => handleStartProject(project.id)}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center"
                >
                  {user ? 'Start Project' : 'Login to Start'}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="glass-card p-8 rounded-2xl max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">Ready to Build?</h2>
            <p className="text-slate-600 mb-6">
              Start building real-world projects with AI guidance and add them to your professional portfolio.
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm text-slate-500">
              <div className="flex items-center">
                <Lightbulb className="w-4 h-4 mr-1" />
                AI Guidance
              </div>
              <div className="flex items-center">
                <Star className="w-4 h-4 mr-1" />
                Portfolio Ready
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                Peer Reviews
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AiprojectPage() {
  return (
    <LayoutWrapper>
      <AiprojectContent />
    </LayoutWrapper>
  );
}
