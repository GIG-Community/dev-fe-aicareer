import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, VideoOff, Video, PhoneOff, Settings, MessageCircle, Clock, Maximize2, Camera } from 'lucide-react';
import geminiService from '../../../services/geminiService';
import audioService from '../../../services/audioService';

const InterviewSimulation = ({ onEnd }) => {
  // Setup states
  const [setupComplete, setSetupComplete] = useState(false);
  const [jobRole, setJobRole] = useState('Software Developer');
  const [language, setLanguage] = useState('en');
  const [difficulty, setDifficulty] = useState('medium');
  const [interviewType, setInterviewType] = useState('normal');

  // Session states
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [questionCount, setQuestionCount] = useState(0);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [micEnabled, setMicEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [showChat, setShowChat] = useState(false);

  // New states for transcription and timing
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [speakingStartTime, setSpeakingStartTime] = useState(null);
  const [speakingDuration, setSpeakingDuration] = useState(0);
  const [totalSpeakingTime, setTotalSpeakingTime] = useState(0);
  const [interimTranscript, setInterimTranscript] = useState('');

  // New states for camera
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [cameraStream, setCameraStream] = useState(null);
  const [cameraError, setCameraError] = useState('');

  const textareaRef = useRef(null);
  const speakingTimerRef = useRef(null);
  const videoRef = useRef(null);
  const userVideoRef = useRef(null);

  const languages = [
    { 
      code: 'en', 
      name: 'English', 
      flag: '🇺🇸',
      nativeName: 'English',
      sample: 'Tell me about yourself.'
    },
    { 
      code: 'id', 
      name: 'Bahasa Indonesia', 
      flag: '🇮🇩',
      nativeName: 'Bahasa Indonesia',
      sample: 'Ceritakan tentang diri Anda.'
    },
    { 
      code: 'zh', 
      name: '中文', 
      flag: '🇨🇳',
      nativeName: '中文 (简体)',
      sample: '请介绍一下自己。'
    },
    { 
      code: 'ja', 
      name: '日本語', 
      flag: '🇯🇵',
      nativeName: '日本語',
      sample: '自己紹介をしてください。'
    },
    { 
      code: 'ar', 
      name: 'العربية', 
      flag: '🇸🇦',
      nativeName: 'العربية',
      sample: 'أخبرني عن نفسك.'
    },
  ];

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

  // ...existing code for useEffect, handlers, and functions...
  useEffect(() => {
    if (setupComplete && sessionStarted) {
      audioService.setLanguage(language);
      generateNewQuestion();
    }
  }, [sessionStarted, setupComplete]);

  const handleStartInterview = () => {
    setSetupComplete(true);
    setSessionStarted(true);
    setError('');
  };

  const generateNewQuestion = async () => {
    setLoading(true);
    setError('');
    setIsSpeaking(true);
    
    try {
      const question = await geminiService.generateInterviewQuestion(jobRole, language, difficulty, interviewType);
      setCurrentQuestion(question);
      setQuestionCount(prev => prev + 1);
      
      // Auto speak the question
      setTimeout(async () => {
        try {
          await audioService.speak(question, language);
        } catch (err) {
          console.log('Speech synthesis failed:', err);
        }
        setIsSpeaking(false);
      }, 1000);
      
    } catch (err) {
      setError('Failed to generate question. Please try again.');
      console.error(err);
      setIsSpeaking(false);
    }
    setLoading(false);
  };

  const startListening = async () => {
    try {
      setIsListening(true);
      setIsTranscribing(true);
      setCurrentTranscript('');
      setInterimTranscript('');
      setError('');
      setSpeakingStartTime(Date.now());
      
      // Start speaking timer
      speakingTimerRef.current = setInterval(() => {
        if (speakingStartTime) {
          const duration = Math.floor((Date.now() - speakingStartTime) / 1000);
          setSpeakingDuration(duration);
        }
      }, 1000);

      const result = await audioService.startListeningWithTranscript(
        (interimText) => {
          setInterimTranscript(interimText);
        },
        (finalText) => {
          setCurrentTranscript(prev => prev + (prev ? ' ' : '') + finalText);
          setInterimTranscript('');
        }
      );
      
      setUserAnswer(prev => prev + (prev ? ' ' : '') + result);
      setIsListening(false);
      setIsTranscribing(false);
      
      // Stop timer and add to total
      if (speakingTimerRef.current) {
        clearInterval(speakingTimerRef.current);
        setTotalSpeakingTime(prev => prev + speakingDuration);
        setSpeakingDuration(0);
        setSpeakingStartTime(null);
      }
      
    } catch (err) {
      setError('Speech recognition failed. Please try again.');
      setIsListening(false);
      setIsTranscribing(false);
      
      if (speakingTimerRef.current) {
        clearInterval(speakingTimerRef.current);
        setSpeakingDuration(0);
        setSpeakingStartTime(null);
      }
    }
  };

  const stopListening = () => {
    audioService.stopListening();
    setIsListening(false);
    setIsTranscribing(false);
    
    if (speakingTimerRef.current) {
      clearInterval(speakingTimerRef.current);
      setTotalSpeakingTime(prev => prev + speakingDuration);
      setSpeakingDuration(0);
      setSpeakingStartTime(null);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const submitAnswer = async () => {
    if (!userAnswer.trim()) return;

    setLoading(true);
    try {
      const evaluation = await geminiService.evaluateAnswer(userAnswer, currentQuestion, jobRole, language);
      setFeedback(evaluation);
    } catch (err) {
      setError('Failed to evaluate answer.');
    }
    setLoading(false);
  };

  const nextQuestion = () => {
    setUserAnswer('');
    setFeedback(null);
    generateNewQuestion();
  };

  const endSession = () => {
    const history = geminiService.getConversationHistory();
    if (onEnd) {
      onEnd(history, questionCount);
    } else {
      // Default behavior - redirect or show results
      console.log('Interview session ended', { history, questionCount });
    }
  };

  // Camera functions
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        },
        audio: false // We handle audio separately
      });
      
      setCameraStream(stream);
      setCameraError('');
      
      // Set video source after stream is available
      setTimeout(() => {
        if (userVideoRef.current && stream) {
          userVideoRef.current.srcObject = stream;
          userVideoRef.current.play().catch(console.error);
        }
      }, 100);
      
    } catch (error) {
      console.error('Error accessing camera:', error);
      setCameraError('Camera access denied or not available');
      setCameraEnabled(false);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    if (userVideoRef.current) {
      userVideoRef.current.srcObject = null;
    }
  };

  const toggleCamera = async () => {
    if (cameraEnabled && cameraStream) {
      stopCamera();
      setCameraEnabled(false);
    } else {
      setCameraEnabled(true);
      await startCamera();
    }
  };

  // Initialize camera when setup completes
  useEffect(() => {
    if (setupComplete && cameraEnabled) {
      startCamera();
    }
    
    return () => {
      stopCamera();
    };
  }, [setupComplete, cameraEnabled]);

  // Update video enabled state
  const handleVideoToggle = () => {
    setVideoEnabled(!videoEnabled);
    if (!videoEnabled && cameraEnabled && !cameraStream) {
      startCamera();
    }
  };

  // Setup View - Enhanced with Camera Preview
  if (!setupComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="glass-card rounded-xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Video className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">AI Interview Simulation</h2>
            <p className="text-gray-600">Set up your interview session</p>
          </div>

          {/* Camera Preview */}
          <div className="mb-6">
            <div className="relative bg-gray-100 rounded-lg overflow-hidden h-32 flex items-center justify-center">
              {cameraStream && cameraEnabled ? (
                <video
                  ref={userVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                  style={{ transform: 'scaleX(-1)' }}
                  onLoadedMetadata={() => {
                    if (userVideoRef.current) {
                      userVideoRef.current.play().catch(console.error);
                    }
                  }}
                />
              ) : (
                <div className="text-center">
                  <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">
                    {cameraError ? 'Camera access denied' : 'Camera preview'}
                  </p>
                </div>
              )}
            </div>
            <div className="flex justify-center mt-2">
              <button
                onClick={cameraEnabled ? () => {
                  stopCamera();
                  setCameraEnabled(false);
                } : () => {
                  setCameraEnabled(true);
                  startCamera();
                }}
                className={`text-sm px-3 py-1 rounded ${
                  cameraEnabled 
                    ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                {cameraEnabled ? 'Disable Camera' : 'Enable Camera'}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Interview Type</label>
              <select
                value={interviewType}
                onChange={(e) => setInterviewType(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="normal">Normal Interview</option>
                <option value="technical">Technical Interview</option>
                <option value="behavioral">Behavioral Interview</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Job Role</label>
              <select
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white max-h-40 overflow-y-auto"
              >
                <optgroup label="Technology/IT">
                  <option value="Software Developer">Software Developer</option>
                  <option value="Full Stack Developer">Full Stack Developer</option>
                  <option value="Frontend Developer">Frontend Developer</option>
                  <option value="Backend Developer">Backend Developer</option>
                  <option value="Mobile App Developer">Mobile App Developer</option>
                  <option value="DevOps Engineer">DevOps Engineer</option>
                  <option value="Cloud Architect">Cloud Architect</option>
                  <option value="System Administrator">System Administrator</option>
                  <option value="Cybersecurity Specialist">Cybersecurity Specialist</option>
                  <option value="Software Architect">Software Architect</option>
                  <option value="Technical Lead">Technical Lead</option>
                  <option value="Quality Assurance Engineer">Quality Assurance Engineer</option>
                </optgroup>
                
                <optgroup label="Data Science/Analytics">
                  <option value="Data Scientist">Data Scientist</option>
                  <option value="Data Analyst">Data Analyst</option>
                  <option value="Machine Learning Engineer">Machine Learning Engineer</option>
                  <option value="AI Engineer">AI Engineer</option>
                  <option value="Business Intelligence Analyst">Business Intelligence Analyst</option>
                  <option value="Data Engineer">Data Engineer</option>
                  <option value="Research Scientist">Research Scientist</option>
                </optgroup>
                
                <optgroup label="Digital Marketing">
                  <option value="Digital Marketing Manager">Digital Marketing Manager</option>
                  <option value="Social Media Manager">Social Media Manager</option>
                  <option value="SEO Specialist">SEO Specialist</option>
                  <option value="Content Marketing Manager">Content Marketing Manager</option>
                  <option value="Performance Marketing Manager">Performance Marketing Manager</option>
                  <option value="Email Marketing Specialist">Email Marketing Specialist</option>
                  <option value="Growth Hacker">Growth Hacker</option>
                  <option value="Digital Advertising Manager">Digital Advertising Manager</option>
                </optgroup>
                
                <optgroup label="Product Management">
                  <option value="Product Manager">Product Manager</option>
                  <option value="Product Owner">Product Owner</option>
                  <option value="Technical Product Manager">Technical Product Manager</option>
                  <option value="Product Marketing Manager">Product Marketing Manager</option>
                  <option value="Product Designer">Product Designer</option>
                </optgroup>
                
                <optgroup label="Visual Design">
                  <option value="UI/UX Designer">UI/UX Designer</option>
                  <option value="Graphic Designer">Graphic Designer</option>
                  <option value="Web Designer">Web Designer</option>
                  <option value="Motion Graphics Designer">Motion Graphics Designer</option>
                  <option value="Brand Designer">Brand Designer</option>
                  <option value="Creative Director">Creative Director</option>
                </optgroup>
                
                <optgroup label="E-commerce">
                  <option value="E-commerce Manager">E-commerce Manager</option>
                  <option value="Marketplace Manager">Marketplace Manager</option>
                  <option value="E-commerce Analyst">E-commerce Analyst</option>
                  <option value="Digital Sales Manager">Digital Sales Manager</option>
                </optgroup>
                
                <optgroup label="Finance/Fintech">
                  <option value="Fintech Product Manager">Fintech Product Manager</option>
                  <option value="Financial Analyst">Financial Analyst</option>
                  <option value="Blockchain Developer">Blockchain Developer</option>
                  <option value="Cryptocurrency Analyst">Cryptocurrency Analyst</option>
                  <option value="Digital Payment Specialist">Digital Payment Specialist</option>
                </optgroup>
                
                <optgroup label="Business Development">
                  <option value="Business Development Manager">Business Development Manager</option>
                  <option value="Partnership Manager">Partnership Manager</option>
                  <option value="Sales Development Representative">Sales Development Representative</option>
                  <option value="Account Manager">Account Manager</option>
                </optgroup>
                
                <optgroup label="Consulting">
                  <option value="IT Consultant">IT Consultant</option>
                  <option value="Digital Transformation Consultant">Digital Transformation Consultant</option>
                  <option value="Technology Consultant">Technology Consultant</option>
                  <option value="Management Consultant">Management Consultant</option>
                </optgroup>
                
                <optgroup label="Emerging Digital Roles">
                  <option value="Content Creator">Content Creator</option>
                  <option value="Community Manager">Community Manager</option>
                  <option value="Digital Project Manager">Digital Project Manager</option>
                  <option value="Scrum Master">Scrum Master</option>
                  <option value="Agile Coach">Agile Coach</option>
                  <option value="Technical Writer">Technical Writer</option>
                  <option value="Game Developer">Game Developer</option>
                  <option value="AR/VR Developer">AR/VR Developer</option>
                  <option value="IoT Developer">IoT Developer</option>
                  <option value="Automation Engineer">Automation Engineer</option>
                </optgroup>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
              <div className="grid grid-cols-1 gap-3">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`relative p-4 border-2 rounded-lg text-left transition-all transform hover:scale-[1.02] ${
                      language === lang.code
                        ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-lg'
                        : 'border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{lang.flag}</span>
                        <div>
                          <div className="font-medium text-base">{lang.nativeName}</div>
                          <div className="text-sm text-gray-500">{lang.name}</div>
                        </div>
                      </div>
                      {language === lang.code && (
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                          <span className="text-xs font-medium text-blue-600">Selected</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Sample question preview */}
                    {language === lang.code && (
                      <div className="mt-3 pt-3 border-t border-blue-200">
                        <div className="text-xs text-blue-600 font-medium mb-1">Sample Question:</div>
                        <div className="text-sm text-blue-700 italic" dir={lang.code === 'ar' ? 'rtl' : 'ltr'}>
                          "{lang.sample}"
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
              
              {/* Language preview section */}
              {language && (
                <div className="mt-4 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg">
                      {languages.find(l => l.code === language)?.flag}
                    </span>
                    <span className="text-sm font-medium text-gray-700">
                      Interview will be conducted in {languages.find(l => l.code === language)?.nativeName}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600">
                    Questions and feedback will be provided in the selected language
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <button
              onClick={handleStartInterview}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors mt-6"
            >
              Start Interview Simulation
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Video Call Interface - Enhanced with Real Camera
return (
    <div className="fixed inset-0 h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col overflow-hidden z-50 pt-16">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center flex-shrink-0">
            <div className="flex items-center space-x-4">
                <h1 className="text-gray-800 font-medium">AI Interview Simulation</h1>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                    Question {questionCount}
                </span>
                {/* Speaking Timer */}
                <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600 text-sm">
                        Speaking: {formatTime(speakingDuration)} / Total: {formatTime(totalSpeakingTime)}
                    </span>
                </div>
            </div>
            <div className="flex items-center space-x-2">
                <button
                    onClick={() => setShowChat(!showChat)}
                    className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <MessageCircle className="w-5 h-5" />
                </button>
                <button 
                    onClick={toggleCamera}
                    className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <Camera className="w-5 h-5" />
                </button>
            </div>
        </div>

        {/* Main Video Area */}
        <div className="flex-1 flex min-h-0">
            {/* Video Grid */}
            <div className="flex-1 p-4 overflow-auto">
                <div className="grid grid-cols-2 gap-4 h-full max-h-[400px]">
                    {/* AI Interviewer */}
                    <div className="relative bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                                <div className={`w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 ${isSpeaking ? 'ring-4 ring-green-400 animate-pulse' : ''}`}>
                                    <span className="text-2xl font-bold text-white">AI</span>
                                </div>
                                <h3 className="text-gray-800 font-medium">AI Interviewer</h3>
                                <p className="text-gray-500 text-sm mt-1">
                                    {isSpeaking ? 'Speaking...' : 'Listening'}
                                </p>
                            </div>
                        </div>
                        <div className="absolute bottom-4 left-4">
                            <span className="bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
                                AI Interviewer
                            </span>
                        </div>
                    </div>

                    {/* User - Real Camera Feed */}
                    <div className="relative bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg">
                        {cameraEnabled && videoEnabled && cameraStream && !cameraError ? (
                            <>
                                <video
                                    ref={userVideoRef}
                                    autoPlay
                                    muted
                                    playsInline
                                    className="w-full h-full object-cover"
                                    style={{ transform: 'scaleX(-1)' }}
                                    onLoadedMetadata={() => {
                                        if (userVideoRef.current) {
                                            userVideoRef.current.play().catch(err => {
                                                console.error('Video play failed:', err);
                                            });
                                        }
                                    }}
                                    onError={(e) => {
                                        console.error('Video error:', e);
                                        setCameraError('Video playback failed');
                                    }}
                                />
                                {/* Overlay indicators */}
                                <div className="absolute inset-0">
                                    {isListening && (
                                        <div className="absolute inset-0 ring-4 ring-red-400 animate-pulse rounded-xl"></div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                    {cameraError ? (
                        <>
                            <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-gray-600 font-medium mb-2">Camera Unavailable</h3>
                            <p className="text-gray-500 text-sm px-4">{cameraError}</p>
                            <button
                                onClick={() => {
                                    setCameraError('');
                                    startCamera();
                                }}
                                className="mt-3 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded"
                            >
                                Retry Camera
                            </button>
                        </>
                    ) : (
                        <>
                            <div className={`w-24 h-24 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 ${isListening ? 'ring-4 ring-red-400 animate-pulse' : ''}`}>
                                <span className="text-2xl font-bold text-white">ME</span>
                            </div>
                            <h3 className="text-gray-800 font-medium">You</h3>
                            <p className="text-gray-500 text-sm mt-1">
                                {isListening ? `Speaking... ${formatTime(speakingDuration)}` : 'Ready'}
                            </p>
                            {!videoEnabled && (
                                <p className="text-gray-400 text-xs mt-2">Camera Off</p>
                            )}
                        </>
                    )}
                  </div>
                </div>
              )}
              
              <div className="absolute bottom-4 left-4">
                <span className="bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
                  You {isTranscribing && '🎤'} {cameraEnabled && videoEnabled && cameraStream && '📹'}
                </span>
              </div>
            </div>
          </div>

          {/* Question Display */}
          <div className="mt-4 bg-white border border-gray-200 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-800 font-medium">Current Question</h3>
              {loading && (
                <div className="flex items-center text-blue-600">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse mr-2"></div>
                  <span className="text-sm">Generating...</span>
                </div>
              )}
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-lg p-4">
              <p className="text-gray-800 text-lg leading-relaxed">
                {currentQuestion || 'Preparing your question...'}
              </p>
            </div>
          </div>

          {/* Real-time Transcription */}
          {(isTranscribing || currentTranscript || interimTranscript) && (
            <div className="mt-4 bg-white border border-gray-200 rounded-xl p-6 shadow-lg">
              <h3 className="text-gray-800 font-medium mb-4 flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></span>
                Live Transcription
              </h3>
              <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 min-h-[80px]">
                <p className="text-gray-800">
                  {currentTranscript}
                  <span className="text-gray-500 italic">
                    {interimTranscript && ` ${interimTranscript}`}
                  </span>
                  {isTranscribing && <span className="animate-pulse">|</span>}
                </p>
              </div>
            </div>
          )}

          {/* Answer Input */}
          <div className="mt-4 bg-white border border-gray-200 rounded-xl p-6 shadow-lg">
            <h3 className="text-gray-800 font-medium mb-4">Your Response</h3>
            <textarea
              ref={textareaRef}
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Type your answer here or use voice input..."
              className="w-full h-32 p-4 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              disabled={isListening}
            />
            <div className="flex justify-between items-center mt-3">
              <span className="text-gray-500 text-sm">
                {userAnswer.length} characters • Total speaking: {formatTime(totalSpeakingTime)}
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={isListening ? stopListening : startListening}
                  disabled={loading || !currentQuestion}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 ${
                    isListening 
                      ? 'bg-red-600 hover:bg-red-700 text-white' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {isListening ? `Stop (${formatTime(speakingDuration)})` : 'Voice Input'}
                </button>
                <button
                  onClick={submitAnswer}
                  disabled={!userAnswer.trim() || loading}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
                >
                  {loading ? 'Evaluating...' : 'Submit'}
                </button>
              </div>
            </div>
          </div>

          {/* Feedback */}
          {feedback && (
            <div className="mt-4 bg-white border border-gray-200 rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-800 font-medium">AI Feedback</h3>
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-green-600">{feedback.score}/10</span>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">Strengths</h4>
                  <ul className="text-green-700 text-sm space-y-1">
                    {feedback.strengths.filter(s => s).map((strength, idx) => (
                      <li key={idx}>• {strength}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
                  <h4 className="font-medium text-orange-800 mb-2">Improvements</h4>
                  <ul className="text-orange-700 text-sm space-y-1">
                    {feedback.improvements.filter(i => i).map((improvement, idx) => (
                      <li key={idx}>• {improvement}</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {feedback.suggestion && (
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-4">
                  <h4 className="font-medium text-blue-800 mb-2">Suggestion</h4>
                  <p className="text-blue-700 text-sm">{feedback.suggestion}</p>
                </div>
              )}
              
              <button
                onClick={nextQuestion}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
              >
                Next Question
              </button>
            </div>
          )}
        </div>

        {/* Chat Sidebar */}
        {showChat && (
          <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-gray-800 font-medium">Transcription History</h3>
            </div>
            <div className="flex-1 p-4 overflow-auto">
              <div className="space-y-2 text-sm">
                <div className="text-gray-500">Session transcript will appear here...</div>
                {currentTranscript && (
                  <div className="bg-gray-50 border border-gray-200 p-3 rounded">
                    <div className="text-gray-800">{currentTranscript}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Controls - Enhanced */}
      <div className="bg-white border-t border-gray-200 px-6 py-4 flex justify-center flex-shrink-0">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setMicEnabled(!micEnabled)}
            className={`p-3 rounded-full transition-colors ${
              micEnabled 
                ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' 
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
            title={micEnabled ? 'Mute microphone' : 'Unmute microphone'}
          >
            {micEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>
          
          <button
            onClick={handleVideoToggle}
            className={`p-3 rounded-full transition-colors ${
              videoEnabled && cameraEnabled && cameraStream
                ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' 
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
            title={videoEnabled ? 'Turn off camera' : 'Turn on camera'}
          >
            {videoEnabled && cameraEnabled && cameraStream ? (
              <Video className="w-5 h-5" />
            ) : (
              <VideoOff className="w-5 h-5" />
            )}
          </button>

          {/* Camera Settings */}
          {cameraEnabled && (
            <button
              onClick={toggleCamera}
              className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
              title="Camera settings"
            >
              <Camera className="w-5 h-5" />
            </button>
          )}

          <button
            onClick={endSession}
            className="p-3 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors"
            title="End interview"
          >
            <PhoneOff className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          {error}
        </div>
      )}

      {/* Camera Permission Modal */}
      {cameraError && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md mx-4">
            <div className="text-center">
              <Camera className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-gray-800 font-medium mb-2">Camera Access Required</h3>
              <p className="text-gray-600 text-sm mb-4">
                To provide a realistic interview experience, please allow camera access. 
                You can continue without camera if needed.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={startCamera}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm"
                >
                  Allow Camera
                </button>
                <button
                  onClick={() => {
                    setCameraError('');
                    setCameraEnabled(false);
                  }}
                  className="flex-1 bg-gray-400 hover:bg-gray-500 text-white py-2 px-4 rounded-lg text-sm"
                >
                  Continue Without
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewSimulation;
