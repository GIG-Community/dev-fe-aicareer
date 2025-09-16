import React, { useState, useEffect } from 'react';
import { BrainCircuit, Users, Clock, Target, ChevronRight, Play, Code, Kanban } from 'lucide-react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useNavigate } from 'react-router-dom';
import LayoutWrapper from '../../components/layout/LayoutWrapper';
import WorkSimulation from './work-simulation/page';

function AiworkContent() {
  const [activeSimulation, setActiveSimulation] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const jobSimulations = [
    {
      id: 'software-engineer',
      title: 'Software Engineer Development',
      description: 'Build full-stack features with live coding, debugging, testing, and code review processes',
      duration: '45-60 minutes',
      skills: ['Full-Stack Development', 'Debugging', 'Testing', 'Code Review', 'System Design'],
      difficulty: 'Medium',
      icon: '👨‍💻',
      color: 'from-blue-500 to-cyan-500',
      technicalAspects: [
        'Live Code Editor with Multi-Language Support',
        'Integrated Debugging Tools & Breakpoints',
        'Unit Testing & Test-Driven Development',
        'Code Review & Pull Request Workflow',
        'Database Query Interface',
        'API Testing & Documentation'
      ],
      realWorldChallenges: [
        'Debug complex production issues with limited info',
        'Implement new features while maintaining backward compatibility',
        'Optimize database queries under performance constraints',
        'Handle merge conflicts and code review feedback',
        'Balance technical debt vs new feature development'
      ]
    },
    {
      id: 'product-manager',
      title: 'Product Manager Sprint',
      description: 'Manage product roadmap, sprint planning, and stakeholder coordination using project management tools',
      duration: '45-60 minutes',
      skills: ['Product Strategy', 'Sprint Planning', 'Stakeholder Management', 'Data Analysis', 'Roadmap Planning'],
      difficulty: 'Hard',
      icon: '📋',
      color: 'from-purple-500 to-pink-500',
      technicalAspects: [
        'Interactive Sprint Board (Jira-like Interface)',
        'Product Roadmap & Timeline Management',
        'User Story Creation & Epic Management',
        'Stakeholder Communication Dashboard',
        'Analytics & Metrics Visualization',
        'Resource Allocation & Capacity Planning'
      ],
      realWorldChallenges: [
        'Balance conflicting stakeholder priorities',
        'Manage scope creep during active sprints',
        'Make data-driven decisions with incomplete information',
        'Coordinate cross-functional teams under tight deadlines',
        'Pivot product strategy based on market feedback'
      ]
    }
  ];

  const handleStartSimulation = (simulationId) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setActiveSimulation(simulationId);
  };

  if (activeSimulation) {
    return (
      <WorkSimulation 
        simulationId={activeSimulation}
        onEnd={() => setActiveSimulation(null)}
      />
    );
  }

  return (
    <div className={`min-h-screen ${user ? 'p-8' : 'bg-gradient-to-br from-blue-50 to-indigo-100 pt-28'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <BrainCircuit className="w-12 h-12 text-blue-600 mr-4" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 to-blue-700 bg-clip-text text-transparent">
              Aiwork - Professional Edition
            </h1>
          </div>
          <p className="text-xl text-slate-600 mb-4">
            Experience authentic professional work scenarios with real tools and workflows
          </p>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Simulate real work environments with live coding interfaces, project management boards, and collaborative team dynamics
          </p>
          {!user && (
            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-blue-700">
                <strong>Login required:</strong> Please log in to access AI Work simulations and track your professional experience.
              </p>
            </div>
          )}
        </div>

        {/* Feature Highlights */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="glass-card p-6 rounded-2xl text-center">
            <Code className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Live Development Tools</h3>
            <p className="text-slate-600">Code editors, debuggers, testing frameworks, and database interfaces integrated</p>
          </div>
          
          <div className="glass-card p-6 rounded-2xl text-center">
            <Kanban className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Project Management</h3>
            <p className="text-slate-600">Sprint boards, roadmap planning, user story management, and stakeholder dashboards</p>
          </div>
          
          <div className="glass-card p-6 rounded-2xl text-center">
            <Users className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Team Collaboration</h3>
            <p className="text-slate-600">Real-time team coordination, code reviews, sprint ceremonies, and stakeholder meetings</p>
          </div>
        </div>

        {/* Job Simulations Comparison */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Choose Your Professional Challenge</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {jobSimulations.map((simulation) => (
              <div 
                key={simulation.id}
                className="glass-card rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <div className={`h-3 bg-gradient-to-r ${simulation.color}`}></div>
                <div className="p-8">
                  <div className="flex items-center mb-6">
                    <span className="text-4xl mr-4">{simulation.icon}</span>
                    <div>
                      <h3 className="text-xl font-bold text-slate-800">{simulation.title}</h3>
                      <div className="flex items-center text-sm text-slate-500 mt-1">
                        <Clock className="w-4 h-4 mr-1" />
                        {simulation.duration}
                        <span className={`ml-3 text-xs px-2 py-1 rounded-full ${
                          simulation.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                          simulation.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {simulation.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-slate-600 mb-6 text-sm leading-relaxed">
                    {simulation.description}
                  </p>

                  {/* Technical Aspects */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-slate-700 mb-3">🛠️ Professional Tools & Features:</h4>
                    <div className="space-y-2">
                      {simulation.technicalAspects.map((aspect, idx) => (
                        <div key={idx} className="flex items-center text-xs text-slate-600">
                          <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                          {aspect}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Real World Challenges */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-slate-700 mb-3">⚡ Real-World Challenges:</h4>
                    <div className="space-y-2">
                      {simulation.realWorldChallenges.map((challenge, idx) => (
                        <div key={idx} className="flex items-center text-xs text-slate-600">
                          <div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>
                          {challenge}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700">Core Skills:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {simulation.skills.map((skill, idx) => (
                        <span 
                          key={idx}
                          className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleStartSimulation(simulation.id)}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center group"
                  >
                    <Play className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                    {user ? 'Start Professional Simulation' : 'Login to Start Simulation'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison Section */}
        <div className="glass-card p-8 rounded-2xl mb-8">
          <h2 className="text-2xl font-semibold text-slate-800 mb-6 text-center">Software Engineer vs Product Manager: Different Perspectives</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="border-r border-slate-200 pr-8">
              <h3 className="text-lg font-bold text-blue-600 mb-4">👨‍💻 Software Engineer Experience</h3>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-start">
                  <ChevronRight className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                  Write, debug, and test code in live development environment
                </li>
                <li className="flex items-start">
                  <ChevronRight className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                  Handle database queries, API integrations, and performance optimization
                </li>
                <li className="flex items-start">
                  <ChevronRight className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                  Participate in code reviews and technical architecture decisions
                </li>
                <li className="flex items-start">
                  <ChevronRight className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                  Collaborate with team on technical implementation challenges
                </li>
              </ul>
            </div>
            <div className="pl-8">
              <h3 className="text-lg font-bold text-purple-600 mb-4">📋 Product Manager Experience</h3>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-start">
                  <ChevronRight className="w-4 h-4 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                  Manage sprint boards, user stories, and product roadmaps
                </li>
                <li className="flex items-start">
                  <ChevronRight className="w-4 h-4 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                  Coordinate stakeholder meetings and requirement gathering
                </li>
                <li className="flex items-start">
                  <ChevronRight className="w-4 h-4 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                  Analyze metrics, user feedback, and market data for decisions
                </li>
                <li className="flex items-start">
                  <ChevronRight className="w-4 h-4 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                  Balance technical constraints with business objectives
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Technical Preview */}
        <div className="glass-card p-8 rounded-2xl max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-4">
            <Code className="w-8 h-8 text-blue-600 mr-2" />
            <Kanban className="w-8 h-8 text-purple-600 ml-2" />
          </div>
          <h2 className="text-2xl font-semibold text-slate-800 mb-4">Professional Work Environments</h2>
          <p className="text-slate-600 mb-6">
            Experience authentic professional workflows with integrated development tools and project management systems.
          </p>
          <div className="grid md:grid-cols-2 gap-6 text-left">
            <div className="bg-slate-50 rounded-lg p-4">
              <h4 className="font-semibold text-slate-800 mb-2">Software Engineer Tools</h4>
              <div className="flex flex-wrap gap-2 text-sm">
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">VS Code Interface</span>
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">Debugger</span>
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">Testing Framework</span>
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">Database Console</span>
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">API Tester</span>
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">Git Interface</span>
              </div>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <h4 className="font-semibold text-slate-800 mb-2">Product Manager Tools</h4>
              <div className="flex flex-wrap gap-2 text-sm">
                <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">Sprint Board</span>
                <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">Roadmap Planner</span>
                <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">User Stories</span>
                <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">Analytics Dashboard</span>
                <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">Stakeholder Panel</span>
                <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">Timeline Manager</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AiworkPage() {
  return (
    <LayoutWrapper>
      <AiworkContent />
    </LayoutWrapper>
  );
}
