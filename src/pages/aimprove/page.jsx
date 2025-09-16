import React, { useState, useEffect } from 'react';
import { RocketIcon, BookOpen, Briefcase, Trophy, Star, Lock, CheckCircle, Clock, Flame, FileText, Brain, Heart, Target, MapPin, Building, DollarSign, TrendingUp, Lightbulb, Users, Award, Calendar } from 'lucide-react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import LayoutWrapper from '../../components/layout/LayoutWrapper';

function AimproveContent() {
  const [selectedPath, setSelectedPath] = useState('design');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const jobRoles = [
    // Technology/IT
    'Software Developer',
    'Full Stack Developer', 
    'Frontend Developer',
    'Backend Developer',
    'Mobile App Developer',
    'DevOps Engineer',
    'Cloud Architect',
    'System Administrator',
    'Cybersecurity Specialist',
    'Software Architect',
    'Technical Lead',
    'Quality Assurance Engineer',
    
    // Data Science/Analytics
    'Data Scientist',
    'Data Analyst',
    'Machine Learning Engineer',
    'AI Engineer',
    'Business Intelligence Analyst',
    'Data Engineer',
    'Research Scientist',
    
    // Digital Marketing
    'Digital Marketing Manager',
    'Social Media Manager',
    'SEO Specialist',
    'Content Marketing Manager',
    'Performance Marketing Manager',
    'Email Marketing Specialist',
    'Growth Hacker',
    'Digital Advertising Manager',
    
    // Product Management
    'Product Manager',
    'Product Owner',
    'Technical Product Manager',
    'Product Marketing Manager',
    'Product Designer',
    
    // Visual Design
    'UI/UX Designer',
    'Graphic Designer',
    'Web Designer',
    'Motion Graphics Designer',
    'Brand Designer',
    'Creative Director',
    
    // E-commerce
    'E-commerce Manager',
    'Marketplace Manager',
    'E-commerce Analyst',
    'Digital Sales Manager',
    
    // Finance/Fintech
    'Fintech Product Manager',
    'Financial Analyst',
    'Blockchain Developer',
    'Cryptocurrency Analyst',
    'Digital Payment Specialist',
    
    // Business Development
    'Business Development Manager',
    'Partnership Manager',
    'Sales Development Representative',
    'Account Manager',
    
    // Consulting
    'IT Consultant',
    'Digital Transformation Consultant',
    'Technology Consultant',
    'Management Consultant',
    
    // Additional Digital Roles
    'Content Creator',
    'Community Manager',
    'Digital Project Manager',
    'Scrum Master',
    'Agile Coach',
    'Technical Writer',
    'Game Developer',
    'AR/VR Developer',
    'IoT Developer',
    'Automation Engineer'
  ];

  const learningPaths = {
    frontend: {
      title: 'Frontend Development',
      description: 'Master modern frontend development',
      color: 'blue',
      currentXP: 1200,
      totalXP: 2000,
      streak: 7,
      nodes: [
        { id: 1, title: 'HTML Basics', type: 'lesson', status: 'completed', xp: 120 },
        { id: 2, title: 'CSS Fundamentals', type: 'lesson', status: 'completed', xp: 150 },
        { id: 3, title: 'JavaScript Essentials', type: 'lesson', status: 'completed', xp: 200 },
        { id: 4, title: 'First Project', type: 'project', status: 'completed', xp: 180 },
        { id: 5, title: 'React Fundamentals', type: 'lesson', status: 'current', xp: 250 },
        { id: 6, title: 'State Management', type: 'lesson', status: 'locked', xp: 200 },
        { id: 7, title: 'API Integration', type: 'lesson', status: 'locked', xp: 180 },
        { id: 8, title: 'Final Portfolio', type: 'capstone', status: 'locked', xp: 400 }
      ]
    },
    backend: {
      title: 'Backend Development',
      description: 'Build robust server applications',
      color: 'green',
      currentXP: 800,
      totalXP: 2200,
      streak: 4,
      nodes: [
        { id: 1, title: 'Programming Basics', type: 'lesson', status: 'completed', xp: 150 },
        { id: 2, title: 'Database Design', type: 'lesson', status: 'completed', xp: 200 },
        { id: 3, title: 'API Development', type: 'lesson', status: 'current', xp: 250 },
        { id: 4, title: 'Authentication', type: 'lesson', status: 'locked', xp: 200 },
        { id: 5, title: 'Advanced Topics', type: 'lesson', status: 'locked', xp: 300 },
        { id: 6, title: 'Final Project', type: 'capstone', status: 'locked', xp: 500 }
      ]
    },
    design: {
      title: 'UI/UX Design',
      description: 'Create beautiful user experiences',
      color: 'purple',
      currentXP: 900,
      totalXP: 1800,
      streak: 12,
      nodes: [
        { id: 1, title: 'Design Principles', type: 'lesson', status: 'completed', xp: 150 },
        { id: 2, title: 'User Research', type: 'lesson', status: 'completed', xp: 150 },
        { id: 3, title: 'Prototyping', type: 'lesson', status: 'completed', xp: 180 },
        { id: 4, title: 'Visual Design', type: 'lesson', status: 'current', xp: 200 },
        { id: 5, title: 'Design Systems', type: 'lesson', status: 'locked', xp: 250 },
        { id: 6, title: 'Portfolio Project', type: 'capstone', status: 'locked', xp: 400 }
      ]
    }
  };

  const improvementAreas = {
    cv: {
      title: 'CV Optimization',
      description: 'AI-powered CV analysis and improvement',
      color: 'blue',
      currentXP: 300,
      totalXP: 500,
      streak: 5,
      nodes: [
        { id: 1, title: 'Upload CV', type: 'lesson', status: 'completed', xp: 50 },
        { id: 2, title: 'ATS Analysis', type: 'lesson', status: 'completed', xp: 75 },
        { id: 3, title: 'Keywords Optimization', type: 'lesson', status: 'current', xp: 100 },
        { id: 4, title: 'Format Enhancement', type: 'project', status: 'locked', xp: 125 },
        { id: 5, title: 'Final Review', type: 'milestone', status: 'locked', xp: 150 }
      ]
    },
    portfolio: {
      title: 'Portfolio Enhancement',
      description: 'Build and optimize your professional portfolio',
      color: 'green',
      currentXP: 450,
      totalXP: 800,
      streak: 8,
      nodes: [
        { id: 1, title: 'Portfolio Audit', type: 'lesson', status: 'completed', xp: 80 },
        { id: 2, title: 'Project Showcase', type: 'lesson', status: 'completed', xp: 120 },
        { id: 3, title: 'Case Studies', type: 'project', status: 'completed', xp: 150 },
        { id: 4, title: 'Personal Branding', type: 'lesson', status: 'current', xp: 180 },
        { id: 5, title: 'SEO Optimization', type: 'lesson', status: 'locked', xp: 140 },
        { id: 6, title: 'Portfolio Launch', type: 'capstone', status: 'locked', xp: 200 }
      ]
    },
    hardskills: {
      title: 'Hard Skills Development',
      description: 'Technical skills training and certification',
      color: 'purple',
      currentXP: 600,
      totalXP: 1000,
      streak: 15,
      nodes: [
        { id: 1, title: 'Skill Assessment', type: 'lesson', status: 'completed', xp: 100 },
        { id: 2, title: 'Learning Path', type: 'lesson', status: 'completed', xp: 120 },
        { id: 3, title: 'Practice Projects', type: 'project', status: 'completed', xp: 180 },
        { id: 4, title: 'Certification Prep', type: 'lesson', status: 'current', xp: 200 },
        { id: 5, title: 'Industry Certification', type: 'milestone', status: 'locked', xp: 250 },
        { id: 6, title: 'Advanced Topics', type: 'lesson', status: 'locked', xp: 150 }
      ]
    },
    softskills: {
      title: 'Soft Skills Training',
      description: 'Communication, leadership, and interpersonal skills',
      color: 'orange',
      currentXP: 200,
      totalXP: 600,
      streak: 3,
      nodes: [
        { id: 1, title: 'Communication Basics', type: 'lesson', status: 'completed', xp: 80 },
        { id: 2, title: 'Public Speaking', type: 'lesson', status: 'current', xp: 120 },
        { id: 3, title: 'Leadership Skills', type: 'lesson', status: 'locked', xp: 150 },
        { id: 4, title: 'Team Collaboration', type: 'project', status: 'locked', xp: 130 },
        { id: 5, title: 'Emotional Intelligence', type: 'lesson', status: 'locked', xp: 120 }
      ]
    }
  };

  const relevantJobs = {
    frontend: [
      {
        id: 1,
        title: 'Frontend Developer',
        company: 'TechCorp',
        location: 'Jakarta, Indonesia',
        salary: 'Rp 8-15 juta',
        type: 'Full-time',
        posted: '2 days ago',
        skills: ['React', 'JavaScript', 'CSS', 'HTML'],
        match: 85
      },
      {
        id: 2,
        title: 'React Developer',
        company: 'StartupXYZ',
        location: 'Remote',
        salary: 'Rp 12-20 juta',
        type: 'Full-time',
        posted: '1 week ago',
        skills: ['React', 'TypeScript', 'Node.js'],
        match: 78
      },
      {
        id: 3,
        title: 'UI Developer',
        company: 'Digital Agency',
        location: 'Bandung, Indonesia',
        salary: 'Rp 6-10 juta',
        type: 'Contract',
        posted: '3 days ago',
        skills: ['Vue.js', 'CSS', 'JavaScript'],
        match: 72
      }
    ],
    backend: [
      {
        id: 1,
        title: 'Backend Developer',
        company: 'E-commerce Giant',
        location: 'Jakarta, Indonesia',
        salary: 'Rp 10-18 juta',
        type: 'Full-time',
        posted: '1 day ago',
        skills: ['Node.js', 'MongoDB', 'Express'],
        match: 88
      },
      {
        id: 2,
        title: 'API Developer',
        company: 'FinTech Startup',
        location: 'Surabaya, Indonesia',
        salary: 'Rp 9-16 juta',
        type: 'Full-time',
        posted: '4 days ago',
        skills: ['Python', 'Django', 'PostgreSQL'],
        match: 81
      },
      {
        id: 3,
        title: 'Cloud Engineer',
        company: 'Tech Solutions',
        location: 'Remote',
        salary: 'Rp 15-25 juta',
        type: 'Full-time',
        posted: '1 week ago',
        skills: ['AWS', 'Docker', 'Kubernetes'],
        match: 75
      }
    ],
    design: [
      {
        id: 1,
        title: 'UI/UX Designer',
        company: 'Design Studio',
        location: 'Jakarta, Indonesia',
        salary: 'Rp 7-12 juta',
        type: 'Full-time',
        posted: '2 days ago',
        skills: ['Figma', 'Adobe XD', 'Prototyping'],
        match: 92
      },
      {
        id: 2,
        title: 'Product Designer',
        company: 'Tech Unicorn',
        location: 'Remote',
        salary: 'Rp 12-20 juta',
        type: 'Full-time',
        posted: '3 days ago',
        skills: ['Design Systems', 'User Research', 'Figma'],
        match: 85
      },
      {
        id: 3,
        title: 'Visual Designer',
        company: 'Creative Agency',
        location: 'Bali, Indonesia',
        salary: 'Rp 6-10 juta',
        type: 'Contract',
        posted: '5 days ago',
        skills: ['Adobe Creative Suite', 'Branding'],
        match: 70
      }
    ]
  };

  // Pro tips data
  const proTips = {
    frontend: [
      {
        icon: TrendingUp,
        title: 'Master Modern Frameworks',
        description: 'Focus on React or Vue.js - they\'re in highest demand with 40% more job opportunities.'
      },
      {
        icon: Award,
        title: 'Build a Strong Portfolio',
        description: 'Create 3-5 diverse projects showcasing different skills. Include live demos and GitHub links.'
      },
      {
        icon: Users,
        title: 'Contribute to Open Source',
        description: 'Contributing to popular repositories shows collaboration skills and increases visibility.'
      }
    ],
    backend: [
      {
        icon: TrendingUp,
        title: 'Learn Cloud Technologies',
        description: 'AWS and Docker skills can increase your salary by 30-40%. Cloud expertise is crucial.'
      },
      {
        icon: Award,
        title: 'Master Database Design',
        description: 'Strong SQL and NoSQL knowledge differentiates senior developers from juniors.'
      },
      {
        icon: Users,
        title: 'Focus on API Design',
        description: 'RESTful API and GraphQL skills are essential for modern backend development.'
      }
    ],
    design: [
      {
        icon: TrendingUp,
        title: 'Learn Design Systems',
        description: 'Companies value designers who can create and maintain consistent design systems.'
      },
      {
        icon: Award,
        title: 'Master User Research',
        description: 'UX research skills can increase your value by 50%. Data-driven design is in high demand.'
      },
      {
        icon: Users,
        title: 'Stay Updated with Trends',
        description: 'Follow design trends and tools. Figma proficiency is now a must-have skill.'
      }
    ]
  };

  // Job market information
  const jobMarketInfo = {
    frontend: {
      demand: 'High',
      growth: '+25%',
      avgSalary: 'Rp 8-18 juta',
      topSkills: ['React', 'JavaScript', 'TypeScript', 'CSS'],
      companies: 'Tokopedia, Gojek, Shopee, Bukalapak'
    },
    backend: {
      demand: 'Very High',
      growth: '+30%',
      avgSalary: 'Rp 10-22 juta',
      topSkills: ['Node.js', 'Python', 'Java', 'AWS'],
      companies: 'Grab, OVO, Dana, Blibli'
    },
    design: {
      demand: 'High',
      growth: '+20%',
      avgSalary: 'Rp 7-15 juta',
      topSkills: ['Figma', 'User Research', 'Prototyping', 'Design Systems'],
      companies: 'Traveloka, Ruangguru, Halodoc, Ajaib'
    }
  };

  const JobCard = ({ job }) => (
    <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-100">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="font-semibold text-slate-800 text-lg mb-1">{job.title}</h4>
          <div className="flex items-center text-slate-600 text-sm mb-2">
            <Building className="w-4 h-4 mr-1" />
            {job.company}
          </div>
          <div className="flex items-center text-slate-500 text-sm">
            <MapPin className="w-4 h-4 mr-1" />
            {job.location}
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          job.match >= 85 ? 'bg-green-100 text-green-700' :
          job.match >= 75 ? 'bg-blue-100 text-blue-700' :
          'bg-yellow-100 text-yellow-700'
        }`}>
          {job.match}% match
        </div>
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center text-slate-600">
          <DollarSign className="w-4 h-4 mr-1" />
          <span className="font-medium">{job.salary}</span>
        </div>
        <div className="flex items-center text-slate-500 text-sm">
          <Calendar className="w-4 h-4 mr-1" />
          {job.posted}
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {job.skills.map((skill) => (
          <span key={skill} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
            {skill}
          </span>
        ))}
      </div>
      
      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
        Apply Now
      </button>
    </div>
  );

  const ProTipCard = ({ tip }) => {
    const Icon = tip.icon;
    return (
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
        <div className="flex items-start">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
            <Icon className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-800 mb-2">{tip.title}</h4>
            <p className="text-slate-600 text-sm">{tip.description}</p>
          </div>
        </div>
      </div>
    );
  };

  const JobMarketCard = ({ info }) => (
    <div className="glass-card rounded-xl p-6">
      <h3 className="text-xl font-bold text-slate-800 mb-6">Job Market Insights</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600 mb-1">{info.demand}</div>
          <div className="text-sm text-green-700">Market Demand</div>
        </div>
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600 mb-1">{info.growth}</div>
          <div className="text-sm text-blue-700">YoY Growth</div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold text-slate-800 mb-2">Average Salary</h4>
          <p className="text-slate-600">{info.avgSalary}</p>
        </div>
        
        <div>
          <h4 className="font-semibold text-slate-800 mb-2">Top Skills in Demand</h4>
          <div className="flex flex-wrap gap-2">
            {info.topSkills.map((skill) => (
              <span key={skill} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                {skill}
              </span>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold text-slate-800 mb-2">Top Hiring Companies</h4>
          <p className="text-slate-600 text-sm">{info.companies}</p>
        </div>
      </div>
    </div>
  );

  const HorizontalRoadmap = ({ data, type }) => {
    const progressPercentage = (data.currentXP / data.totalXP) * 100;
    const getIcon = () => {
      switch (type) {
        case 'cv': return FileText;
        case 'portfolio': return Briefcase;
        case 'hardskills': return Brain;
        case 'softskills': return Heart;
        default: return BookOpen;
      }
    };

    const Icon = getIcon();

    return (
      <div className="glass-card rounded-xl p-6 mb-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className={`w-12 h-12 bg-${data.color}-100 rounded-lg flex items-center justify-center mr-4`}>
              <Icon className={`w-6 h-6 text-${data.color}-600`} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">{data.title}</h3>
              <p className="text-slate-600 text-sm">{data.description}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Streak */}
            <div className="text-center">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center mb-1">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <div className="text-sm font-bold text-slate-800">{data.streak}</div>
              <div className="text-xs text-slate-500">streak</div>
            </div>
            
            {/* XP Progress */}
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">{data.currentXP}</div>
              <div className="text-xs text-slate-500">of {data.totalXP} XP</div>
              <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                <div 
                  className={`h-2 rounded-full bg-${data.color}-500`}
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Horizontal Roadmap */}
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 rounded-full transform -translate-y-1/2"></div>
          <div 
            className={`absolute top-1/2 left-0 h-1 bg-${data.color}-500 rounded-full transform -translate-y-1/2 transition-all duration-500`}
            style={{ width: `${(data.nodes.filter(n => n.status === 'completed').length / data.nodes.length) * 100}%` }}
          ></div>
          
          {/* Nodes */}
          <div className="flex justify-between items-center relative">
            {data.nodes.map((node, index) => {
              const getNodeIcon = () => {
                switch (node.type) {
                  case 'lesson': return BookOpen;
                  case 'project': return Briefcase;
                  case 'capstone': return Trophy;
                  case 'milestone': return Star;
                  default: return BookOpen;
                }
              };

              const getNodeColors = () => {
                switch (node.status) {
                  case 'completed':
                    return { bg: 'bg-green-500', text: 'text-white', ring: 'ring-4 ring-green-200' };
                  case 'current':
                    return { bg: `bg-${data.color}-500`, text: 'text-white', ring: `ring-4 ring-${data.color}-200` };
                  default:
                    return { bg: 'bg-gray-300', text: 'text-gray-500', ring: 'ring-4 ring-gray-200' };
                }
              };

              const NodeIcon = getNodeIcon();
              const colors = getNodeColors();

              return (
                <div key={node.id} className="flex flex-col items-center group">
                  {/* Node Circle */}
                  <div className={`
                    relative w-12 h-12 rounded-full ${colors.bg} ${colors.ring}
                    flex items-center justify-center shadow-lg cursor-pointer transition-all duration-300
                    ${node.status === 'current' ? 'animate-pulse scale-110' : 'hover:scale-105'}
                    ${node.status === 'locked' ? 'opacity-60' : ''}
                  `}>
                    {node.status === 'locked' ? (
                      <Lock className={`w-5 h-5 ${colors.text}`} />
                    ) : (
                      <NodeIcon className={`w-5 h-5 ${colors.text}`} />
                    )}
                    
                    {/* XP Badge */}
                    {node.status !== 'locked' && (
                      <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-1 py-0.5 rounded-full">
                        +{node.xp}
                      </div>
                    )}
                    
                    {/* Completion checkmark */}
                    {node.status === 'completed' && (
                      <div className="absolute -bottom-1 -right-1 bg-green-600 text-white rounded-full w-5 h-5 flex items-center justify-center">
                        <CheckCircle className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                  
                  {/* Node Title */}
                  <div className="mt-3 text-center">
                    <h4 className="font-medium text-slate-800 text-xs leading-tight">{node.title}</h4>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Stats */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="text-center p-2 bg-green-50 rounded-lg">
            <div className="text-lg font-bold text-green-600">
              {data.nodes.filter(n => n.status === 'completed').length}
            </div>
            <div className="text-xs text-green-700">Completed</div>
          </div>
          <div className="text-center p-2 bg-blue-50 rounded-lg">
            <div className="text-lg font-bold text-blue-600">
              {data.nodes.filter(n => n.status === 'current').length}
            </div>
            <div className="text-xs text-blue-700">Current</div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold text-gray-600">
              {data.nodes.filter(n => n.status === 'locked').length}
            </div>
            <div className="text-xs text-gray-700">Locked</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <RocketIcon className="w-12 h-12 text-blue-600 mr-4" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 to-blue-700 bg-clip-text text-transparent">
              AI Career Improvement
            </h1>
          </div>
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
            Follow structured learning paths to master skills and advance your career with gamified experiences.
          </p>
          {!user && (
            <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-blue-700">
                <strong>Login required:</strong> Please log in to access AI Improve features and track your progress.
              </p>
            </div>
          )}
        </div>

        {/* Career Path Selection */}
        <div className="glass-card rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Select Your Target Career Path</h3>
          <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white">
            <option value="">Choose your target role...</option>
            {jobRoles.map((role) => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>

        {/* Improvement Areas - Horizontal Roadmaps */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Career Improvement Areas</h2>
          
          {/* CV Optimization */}
          <HorizontalRoadmap data={improvementAreas.cv} type="cv" />
          
          {/* Portfolio Enhancement */}
          <HorizontalRoadmap data={improvementAreas.portfolio} type="portfolio" />
          
          {/* Hard Skills Development */}
          <HorizontalRoadmap data={improvementAreas.hardskills} type="hardskills" />
          
          {/* Soft Skills Training */}
          <HorizontalRoadmap data={improvementAreas.softskills} type="softskills" />
        </div>

        {/* Learning Path Selector */}
        <div className="glass-card rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Specialized Learning Paths</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {Object.entries(learningPaths).map(([key, path]) => (
              <button
                key={key}
                onClick={() => setSelectedPath(key)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  selectedPath === key
                    ? `border-${path.color}-500 bg-${path.color}-50 shadow-lg`
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}
              >
                <h4 className="font-semibold text-slate-800 mb-2">{path.title}</h4>
                <p className="text-sm text-slate-600 mb-3">{path.description}</p>
                <div className="text-xs text-slate-500">
                  {Math.round((path.currentXP / path.totalXP) * 100)}% complete
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Specialized Learning Path - Now Horizontal */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Selected Learning Path</h2>
          <HorizontalRoadmap data={learningPaths[selectedPath]} type="specialized" />
        </div>

        {/* New Sections */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Relevant Job Listings */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Relevant Job Opportunities</h2>
            <div className="space-y-4">
              {relevantJobs[selectedPath].map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
            <div className="mt-6 text-center">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                View All Jobs
              </button>
            </div>
          </div>

          {/* Job Market Info */}
          <div>
            <JobMarketCard info={jobMarketInfo[selectedPath]} />
          </div>
        </div>

        {/* Pro Tips Section */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <Lightbulb className="w-8 h-8 text-yellow-500 mr-3" />
            <h2 className="text-2xl font-bold text-slate-800">Pro Tips for Success</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {proTips[selectedPath].map((tip, index) => (
              <ProTipCard key={index} tip={tip} />
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="glass-card rounded-xl p-8 text-center mt-12 mb-12">
          <h3 className="text-2xl font-bold text-slate-800 mb-4">Ready to Start Your Journey?</h3>
          <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
            Begin your personalized learning path and advance your career with AI-powered guidance.
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-lg">
            Start Learning
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AimprovePage() {
  return (
    <LayoutWrapper>
      <AimproveContent />
    </LayoutWrapper>
  );
}
