import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpenCheck, 
  Play, 
  Timer, 
  CheckCircle, 
  XCircle, 
  Lightbulb,
  Flame,
  Trophy,
  Target,
  Code,
  Clock,
  Camera,
  Eye,
  EyeOff,
  AlertTriangle,
  Settings
} from 'lucide-react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useNavigate } from 'react-router-dom';
import LayoutWrapper from '../../components/layout/LayoutWrapper';

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

const difficulties = ['Easy', 'Medium', 'Hard'];

const sampleProblems = {
  'Software Developer': {
    Easy: {
      title: "Two Sum",
      description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
      template: `function twoSum(nums, target) {
    // Your code here
    
}`,
      testCases: [
        { input: "[2,7,11,15], 9", expected: "[0,1]" },
        { input: "[3,2,4], 6", expected: "[1,2]" }
      ]
    },
    Medium: {
      title: "Longest Substring Without Repeating Characters",
      description: "Given a string s, find the length of the longest substring without repeating characters.",
      template: `function lengthOfLongestSubstring(s) {
    // Your code here
    
}`,
      testCases: [
        { input: '"abcabcbb"', expected: "3" },
        { input: '"bbbbb"', expected: "1" }
      ]
    }
  },
  'Frontend Developer': {
    Easy: {
      title: "DOM Manipulation",
      description: "Write a function that changes the background color of all elements with class 'highlight' to yellow.",
      template: `function highlightElements() {
    // Your code here
    
}`,
      testCases: [
        { input: "HTML with 3 elements having class 'highlight'", expected: "All elements background changed to yellow" }
      ]
    }
  },
  'Data Scientist': {
    Medium: {
      title: "Data Analysis",
      description: "Given a dataset, calculate the mean, median, and mode of a numeric column.",
      template: `def analyze_data(data):
    # Your code here
    pass`,
      testCases: [
        { input: "[1, 2, 2, 3, 4, 4, 4]", expected: "mean: 2.86, median: 3, mode: 4" }
      ]
    }
  }
};

// Filter job roles to only show those with available problems
const availableJobRoles = Object.keys(sampleProblems);

const languages = [
  { id: 'javascript', name: 'JavaScript', extension: 'js' },
  { id: 'python', name: 'Python', extension: 'py' },
  { id: 'java', name: 'Java', extension: 'java' },
  { id: 'cpp', name: 'C++', extension: 'cpp' }
];

function AitestContent() {
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [currentProblem, setCurrentProblem] = useState(null);
  const [code, setCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(3600);
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState(null);
  const [streak, setStreak] = useState(7);
  const [aiRecommendation, setAiRecommendation] = useState('');
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [cheatingAlert, setCheatingAlert] = useState(null);
  const [lineNumbers, setLineNumbers] = useState([1]);
  const timerRef = useRef(null);
  const videoRef = useRef(null);
  const codeRef = useRef(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Camera monitoring
  useEffect(() => {
    if (cameraEnabled && currentProblem) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [cameraEnabled, currentProblem]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      // Simulate cheating detection
      const interval = setInterval(() => {
        if (Math.random() > 0.95) { // 5% chance of detecting suspicious activity
          setCheatingAlert({
            type: 'warning',
            message: 'Multiple faces detected or looking away from screen',
            timestamp: new Date().toLocaleTimeString()
          });
          setTimeout(() => setCheatingAlert(null), 5000);
        }
      }, 10000);
      return () => clearInterval(interval);
    } catch (error) {
      console.error('Camera access denied:', error);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  // Update line numbers when code changes
  useEffect(() => {
    const lines = code.split('\n').length;
    setLineNumbers(Array.from({length: lines}, (_, i) => i + 1));
  }, [code]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getAvailableDifficulties = () => {
    if (!selectedRole || !sampleProblems[selectedRole]) return [];
    return Object.keys(sampleProblems[selectedRole]);
  };

  const startProblem = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (selectedRole && selectedDifficulty) {
      const problem = sampleProblems[selectedRole]?.[selectedDifficulty];
      if (problem) {
        setCurrentProblem(problem);
        setCode(problem.template);
        setTimeLeft(3600);
        setIsRunning(true);
        setResult(null);
        setAiRecommendation('');
        setCameraEnabled(true);
      }
    }
  };

  const runCode = () => {
    // Simulate code execution
    const isCorrect = Math.random() > 0.5; // Random for demo
    
    if (isCorrect) {
      setResult({
        status: 'AC',
        message: 'Accepted! All test cases passed.',
        execution_time: '85ms',
        memory: '42.1 MB'
      });
      setAiRecommendation('Great job! Your solution is correct and efficient.');
    } else {
      setResult({
        status: 'WA',
        message: 'Wrong Answer on test case 2',
        execution_time: '120ms',
        memory: '45.3 MB'
      });
      setAiRecommendation('Consider edge cases like empty arrays. Also, check your loop boundaries and array indexing.');
    }
  };

  const submitCode = () => {
    setIsRunning(false);
    runCode();
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  if (!currentProblem) {
    return (
      <div className={`min-h-screen ${user ? 'p-8' : 'bg-gradient-to-br from-blue-50 to-indigo-100 pt-32'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <BookOpenCheck className="w-12 h-12 text-blue-600 mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 to-blue-700 bg-clip-text text-transparent">
                AI Technical Test
              </h1>
            </div>
            <p className="text-xl text-slate-600 mb-8">
              Practice coding problems tailored to your career path with AI-powered feedback
            </p>
            {!user && (
              <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <p className="text-blue-700">
                  <strong>Login required:</strong> Please log in to access AI Test features and save your progress.
                </p>
              </div>
            )}
          </div>

          {/* Streak Display */}
          <div className="flex justify-center mb-8">
            <div className="glass-card p-6 rounded-xl flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Flame className="w-6 h-6 text-orange-500" />
                <span className="text-lg font-semibold text-slate-700">Current Streak</span>
                <span className="text-2xl font-bold text-orange-600">{streak}</span>
              </div>
              <div className="h-8 w-px bg-slate-300"></div>
              <div className="flex items-center space-x-2">
                <Trophy className="w-6 h-6 text-yellow-500" />
                <span className="text-lg font-semibold text-slate-700">Problems Solved</span>
                <span className="text-2xl font-bold text-yellow-600">42</span>
              </div>
            </div>
          </div>

          {/* Problem Selection */}
          <div className="max-w-4xl mx-auto">
            <div className="glass-card p-8 rounded-2xl">
              <h2 className="text-2xl font-semibold text-slate-800 mb-6 flex items-center">
                <Target className="w-6 h-6 mr-2 text-blue-600" />
                Select Your Challenge
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Job Role</label>
                  <select 
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={selectedRole}
                    onChange={(e) => {
                      setSelectedRole(e.target.value);
                      setSelectedDifficulty(''); // Reset difficulty when role changes
                    }}
                  >
                    <option value="">Select a job role</option>
                    {availableJobRoles.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                  <p className="text-xs text-slate-500 mt-1">
                    Only roles with available problems are shown
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Difficulty</label>
                  <select 
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    disabled={!selectedRole}
                  >
                    <option value="">Select difficulty</option>
                    {getAvailableDifficulties().map(diff => (
                      <option key={diff} value={diff}>{diff}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Language</label>
                  <select 
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                  >
                    {languages.map(lang => (
                      <option key={lang.id} value={lang.id}>{lang.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Camera className="w-5 h-5 text-amber-600" />
                  <h3 className="font-semibold text-amber-800">Camera Monitoring</h3>
                </div>
                <p className="text-sm text-amber-700">
                  Camera will be activated during the test to ensure test integrity. 
                  Make sure you're in a well-lit environment and facing the camera.
                </p>
              </div>

              <button
                onClick={startProblem}
                disabled={!selectedRole || !selectedDifficulty}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
              >
                <Code className="w-5 h-5 mr-2" />
                {user ? 'Start Coding Challenge' : 'Login to Start Challenge'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${user ? '' : 'bg-slate-50 pt-20'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Camera Feed */}
        {cameraEnabled && (
          <div className="fixed top-24 right-6 z-50">
            <div className="bg-white rounded-lg shadow-lg border p-2">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-slate-600">Monitoring</span>
                </div>
                <button
                  onClick={() => setCameraEnabled(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <EyeOff className="w-4 h-4" />
                </button>
              </div>
              <video
                ref={videoRef}
                autoPlay
                muted
                className="w-32 h-24 bg-slate-100 rounded"
              />
            </div>
          </div>
        )}

        {/* Cheating Alert */}
        {cheatingAlert && (
          <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <div>
                  <h3 className="font-semibold text-red-800">Suspicious Activity Detected</h3>
                  <p className="text-sm text-red-700">{cheatingAlert.message}</p>
                  <p className="text-xs text-red-600">Time: {cheatingAlert.timestamp}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Header with Timer */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-slate-800">{currentProblem.title}</h1>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              selectedDifficulty === 'Easy' ? 'bg-green-100 text-green-800' :
              selectedDifficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {selectedDifficulty}
            </span>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Flame className="w-5 h-5 text-orange-500" />
              <span className="font-semibold text-orange-600">{streak} day streak</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <span className={`font-mono text-lg font-semibold ${timeLeft < 300 ? 'text-red-600' : 'text-blue-600'}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
            {cameraEnabled && (
              <div className="flex items-center space-x-2">
                <Eye className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium text-green-600">Monitored</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Problem Description */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Problem Description</h3>
              <p className="text-slate-600 mb-6">{currentProblem.description}</p>
              
              <h4 className="text-md font-semibold text-slate-800 mb-3">Test Cases:</h4>
              <div className="space-y-3">
                {currentProblem.testCases.map((test, index) => (
                  <div key={index} className="bg-slate-50 p-3 rounded">
                    <div className="text-sm text-slate-600">
                      <strong>Input:</strong> {test.input}
                    </div>
                    <div className="text-sm text-slate-600">
                      <strong>Expected:</strong> {test.expected}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Result Display */}
            {result && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center space-x-3 mb-4">
                  {result.status === 'AC' ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-500" />
                  )}
                  <h3 className={`text-lg font-semibold ${result.status === 'AC' ? 'text-green-700' : 'text-red-700'}`}>
                    {result.status === 'AC' ? 'Accepted' : 'Wrong Answer'}
                  </h3>
                </div>
                <p className="text-slate-600 mb-4">{result.message}</p>
                <div className="text-sm text-slate-500 space-y-1">
                  <div>Runtime: {result.execution_time}</div>
                  <div>Memory: {result.memory}</div>
                </div>
              </div>
            )}

            {/* AI Recommendation */}
            {aiRecommendation && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <Lightbulb className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-blue-800">AI Recommendation</h3>
                </div>
                <p className="text-blue-700">{aiRecommendation}</p>
              </div>
            )}
          </div>

          {/* Enhanced Code Editor */}
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="border-b p-4 flex items-center justify-between bg-slate-50">
              <div className="flex items-center space-x-4">
                <h3 className="text-lg font-semibold text-slate-800">Code Editor</h3>
                <select 
                  className="text-sm border border-slate-300 rounded px-2 py-1"
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                >
                  {languages.map(lang => (
                    <option key={lang.id} value={lang.id}>{lang.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={runCode}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <Play className="w-4 h-4" />
                  <span>Run</span>
                </button>
                <button
                  onClick={submitCode}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Submit
                </button>
              </div>
            </div>
            
            {/* Code Editor with Line Numbers */}
            <div className="flex">
              {/* Line Numbers */}
              <div className="bg-slate-100 px-4 py-4 text-right border-r border-slate-200 select-none">
                {lineNumbers.map(num => (
                  <div key={num} className="text-sm text-slate-500 font-mono leading-6">
                    {num}
                  </div>
                ))}
              </div>
              
              {/* Code Area */}
              <div className="flex-1 relative">
                <textarea
                  ref={codeRef}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full h-96 font-mono text-sm p-4 border-none focus:outline-none resize-none bg-white leading-6"
                  style={{
                    fontFamily: "'JetBrains Mono', 'Fira Code', 'Monaco', 'Consolas', monospace",
                    fontSize: '14px',
                    lineHeight: '24px',
                    tabSize: 2
                  }}
                  placeholder="Write your code here..."
                  spellCheck={false}
                  onKeyDown={(e) => {
                    if (e.key === 'Tab') {
                      e.preventDefault();
                      const start = e.target.selectionStart;
                      const end = e.target.selectionEnd;
                      const newValue = code.substring(0, start) + '  ' + code.substring(end);
                      setCode(newValue);
                      setTimeout(() => {
                        e.target.selectionStart = e.target.selectionEnd = start + 2;
                      });
                    }
                  }}
                />
              </div>
            </div>
            
            {/* Status Bar */}
            <div className="border-t bg-slate-50 px-4 py-2 flex items-center justify-between text-sm text-slate-600">
              <div className="flex items-center space-x-4">
                <span>Lines: {lineNumbers.length}</span>
                <span>Language: {languages.find(l => l.id === selectedLanguage)?.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>UTF-8</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AitestPage() {
  return (
    <LayoutWrapper>
      <AitestContent />
    </LayoutWrapper>
  );
}
