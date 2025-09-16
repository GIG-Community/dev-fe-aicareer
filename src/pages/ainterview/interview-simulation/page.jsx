import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, VideoOff, Video, PhoneOff, Settings, MessageCircle, Clock, Maximize2, Camera, Upload, X, FileText, Trash2, CheckCircle, User } from 'lucide-react';
import geminiService from '../../../services/geminiService';
import audioService from '../../../services/audioService';
import documentService from '../../../services/documentService';

const InterviewSimulation = ({ onEnd }) => {
  // Setup states
  const [setupComplete, setSetupComplete] = useState(false);
  const [jobRole, setJobRole] = useState('Software Developer');
  const [language, setLanguage] = useState('en');
  const [difficulty, setDifficulty] = useState('medium');
  const [interviewType, setInterviewType] = useState('normal');
  const [voiceGender, setVoiceGender] = useState('female');

  // Document upload states
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [documentAnalysis, setDocumentAnalysis] = useState(null);
  const [interviewInsights, setInterviewInsights] = useState(null);

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
  const fileInputRef = useRef(null);

  const languages = [
    { 
      code: 'en', 
      name: 'English', 
      flag: '🇺🇸',
      nativeName: 'English',
      sample: 'Tell me about yourself and your experience.'
    },
    { 
      code: 'id', 
      name: 'Bahasa Indonesia', 
      flag: '🇮🇩',
      nativeName: 'Bahasa Indonesia',
      sample: 'Ceritakan tentang diri Anda dan pengalaman Anda.'
    }
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
      audioService.setVoiceGender(voiceGender);
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
          setError(`Speech synthesis not available for ${language}. Please read the question above.`);
        }
        setIsSpeaking(false);
      }, 1000);
      
    } catch (err) {
      setError(`Cannot generate questions: ${err.message}`);
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
    setError('');
    
    try {
      const evaluation = await geminiService.evaluateAnswer(userAnswer, currentQuestion, jobRole, language);
      
      if (evaluation) {
        setFeedback(evaluation);
      } else {
        setError('Unable to evaluate answer: API response could not be parsed properly. Your answer has been recorded.');
      }
    } catch (err) {
      setError(`Evaluation failed: ${err.message}. Your answer has been recorded.`);
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

  const analyzeDocuments = async () => {
    try {
      const analysis = await documentService.analyzeDocuments();
      
      if (!analysis) {
        setUploadError('No documents available for analysis');
        return;
      }

      if (analysis.skills.length === 0 && analysis.experience.length === 0) {
        setUploadError('Could not extract meaningful information from uploaded documents. The text may be too short, unclear, or not in the expected CV format.');
        setDocumentAnalysis(null);
        return;
      }

      setDocumentAnalysis(analysis);
      geminiService.setCandidateProfile(analysis);
      
      // Get interview insights based on RAG analysis
      const insights = geminiService.getInterviewInsights();
      setInterviewInsights(insights);
      
      console.log('Document analysis complete:', analysis?.summary);
      console.log('Interview insights:', insights);
      
    } catch (error) {
      console.error('Document analysis failed:', error);
      setUploadError(`Document analysis failed: ${error.message}`);
      setDocumentAnalysis(null);
    }
  };

  // Update the upload section to provide better information about the ConvertAPI
  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setIsUploading(true);
    setUploadError('');

    let successCount = 0;
    let errors = [];

    try {
      for (const file of files) {
        try {
          const document = await documentService.uploadDocument(file);
          setUploadedDocuments(prev => [...prev, document]);
          successCount++;
        } catch (fileError) {
          console.error(`Failed to upload ${file.name}:`, fileError);
          errors.push(`${file.name}: ${fileError.message}`);
        }
      }
      
      if (successCount > 0) {
        await analyzeDocuments();
      }
      
      if (errors.length > 0) {
        setUploadError(`Some files failed to upload:\n${errors.join('\n')}`);
      }
      
    } catch (error) {
      setUploadError(`Upload failed: ${error.message}`);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleVoiceGenderChange = (gender) => {
    setVoiceGender(gender);
    audioService.setVoiceGender(gender);
  };

  // Setup View - Enhanced with RAG insights
  if (!setupComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 pt-20">
        <div className="glass-card rounded-xl shadow-xl p-6 sm:p-8 w-full max-w-4xl">
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Video className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">AI Interview Simulation</h2>
            <p className="text-gray-600">Set up your personalized interview session</p>
          </div>

          {/* Document Upload Section - Wider and more prominent */}
          <div className="mb-8">
            <label className="block text-base font-medium text-gray-700 mb-3">
              Upload CV/Portfolio (Recommended for Personalized Experience)
            </label>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 sm:p-8 text-center hover:border-blue-400 transition-colors bg-white bg-opacity-50">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                className="hidden"
              />
              
              <Upload className="w-10 h-10 text-blue-500 mx-auto mb-3" />
              <p className="text-gray-700 mb-2 text-lg">
                Drag and drop your CV or portfolio, or{' '}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-blue-600 hover:text-blue-700 font-medium underline"
                  disabled={isUploading}
                >
                  browse files
                </button>
              </p>
              <p className="text-sm text-gray-500 max-w-lg mx-auto">
                Supports PDF, DOC, DOCX, TXT, JPG, PNG (max 10MB each). 
                PDF and DOC files will be automatically converted to text.
              </p>
              
              {isUploading && (
                <div className="mt-4 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-blue-600">Uploading and analyzing...</span>
                </div>
              )}
              
              {uploadError && (
                <div className="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded max-w-lg mx-auto">
                  {uploadError}
                </div>
              )}
            </div>

            {/* Uploaded Documents - Made more spacious */}
            {uploadedDocuments.length > 0 && (
              <div className="mt-6 space-y-3">
                <h4 className="text-base font-medium text-gray-700">Uploaded Documents:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {uploadedDocuments.map((doc) => (
                    <div key={doc.id} className="flex flex-col bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center overflow-hidden">
                          <FileText className="w-5 h-5 text-green-600 mr-2 flex-shrink-0" />
                          <span className="text-sm text-green-800 truncate">{doc.name}</span>
                          <CheckCircle className="w-4 h-4 text-green-600 ml-2 flex-shrink-0" />
                        </div>
                        <button
                          onClick={() => documentService.removeDocument(doc.id)}
                          className="text-red-500 hover:text-red-700 flex-shrink-0 ml-2"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                      {doc.processingMethod && (
                        <div className="mt-1 text-xs text-green-700 italic">
                          {doc.processingMethod}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                {/* Enhanced Document Analysis Summary - Wider and better organized */}
                {documentAnalysis && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-5 mt-4">
                    <h5 className="text-base font-medium text-blue-800 mb-3">📊 Analysis Results:</h5>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-3">
                      <div className="bg-white rounded p-3">
                        <div className="font-medium text-gray-700">Content Extracted</div>
                        <div className="text-blue-700">Skills: {documentAnalysis.skills?.length || 0} found</div>
                        <div className="text-blue-700">Experience: {documentAnalysis.experience?.length || 0} entries</div>
                        <div className="text-blue-700">Projects: {documentAnalysis.projects?.length || 0} found</div>
                      </div>
                      <div className="bg-white rounded p-3">
                        <div className="font-medium text-gray-700">Document Parsing</div>
                        <div className="text-blue-700">Text Chunks: {documentAnalysis.chunks || 0}</div>
                        <div className="text-blue-700">Total Words: {documentAnalysis.rawContent?.split(' ').length || 0}</div>
                      </div>
                    </div>

                    {documentAnalysis.summary?.topKeywords && documentAnalysis.summary.topKeywords.length > 0 ? (
                      <div className="bg-white rounded p-3 mb-3">
                        <div className="font-medium text-gray-700 mb-1">🔍 Skills Detected in CV:</div>
                        <div className="flex flex-wrap gap-1">
                          {documentAnalysis.summary.topKeywords.map((keyword, index) => (
                            <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-3">
                        <div className="text-yellow-800 text-xs">
                          ⚠️ No technical skills detected in CV. Questions will be generic.
                        </div>
                      </div>
                    )}

                    {/* Interview Insights - Only show if available */}
                    {interviewInsights ? (
                      <div className="bg-white rounded p-3">
                        <div className="font-medium text-gray-700 mb-2">🎯 Interview Assessment:</div>
                        <div className="text-xs space-y-1">
                          {interviewInsights.experienceLevel && (
                            <div className="text-green-700">
                              Experience Level: <span className="font-medium">{interviewInsights.experienceLevel}</span>
                            </div>
                          )}
                          {interviewInsights.focusAreas && interviewInsights.focusAreas.length > 0 && (
                            <div className="text-blue-700">
                              Focus Areas: {interviewInsights.focusAreas.join(', ')}
                            </div>
                          )}
                          {interviewInsights.strengths && interviewInsights.strengths.length > 0 && (
                            <div className="text-purple-700">
                              Key Strengths: {interviewInsights.strengths.join(', ')}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gray-50 rounded p-3">
                        <div className="text-gray-600 text-xs">
                          ℹ️ Insufficient CV data for detailed insights. General questions will be used.
                        </div>
                      </div>
                    )}
                    
                    <p className="text-xs text-blue-600 mt-3 font-medium">
                      {documentAnalysis.skills?.length > 0 || documentAnalysis.experience?.length > 0 
                        ? '✨ Questions will be personalized based on your CV content'
                        : '⚠️ Questions will be generic due to insufficient CV information'
                      }
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Rest of the setup screen content in two columns for better layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {/* Camera Preview */}
              <div className="mb-6">
                <label className="block text-base font-medium text-gray-700 mb-2">Camera Preview</label>
                <div className="relative bg-gray-100 rounded-lg overflow-hidden h-36 sm:h-48 flex items-center justify-center">
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

              <div>
                <label className="block text-base font-medium text-gray-700 mb-2">Interview Type</label>
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
                <label className="block text-base font-medium text-gray-700 mb-2">Job Role</label>
                <select
                  value={jobRole}
                  onChange={(e) => setJobRole(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white max-h-40 overflow-y-auto"
                >
                  {/* Simplified job roles list - you can include the full list from existing code */}
                  <option value="Software Developer">Software Developer</option>
                  <option value="Full Stack Developer">Full Stack Developer</option>
                  <option value="Data Scientist">Data Scientist</option>
                  <option value="Digital Marketing Manager">Digital Marketing Manager</option>
                  <option value="UI/UX Designer">UI/UX Designer</option>
                  <option value="Product Manager">Product Manager</option>
                  {/* Add more as needed */}
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-base font-medium text-gray-700 mb-2">Language</label>
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
                          <div className="text-sm text-blue-700 italic">
                            "{lang.sample}"
                          </div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-base font-medium text-gray-700 mb-2">AI Interviewer Voice</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleVoiceGenderChange('female')}
                    className={`p-3 border-2 rounded-lg text-center transition-all ${
                      voiceGender === 'female'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400 bg-white'
                    }`}
                  >
                    <User className="w-5 h-5 mx-auto mb-1" />
                    <div className="text-sm font-medium">Female Voice</div>
                    <div className="text-xs text-gray-500">Professional & Clear</div>
                  </button>
                  <button
                    onClick={() => handleVoiceGenderChange('male')}
                    className={`p-3 border-2 rounded-lg text-center transition-all ${
                      voiceGender === 'male'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400 bg-white'
                    }`}
                  >
                    <User className="w-5 h-5 mx-auto mb-1" />
                    <div className="text-sm font-medium">Male Voice</div>
                    <div className="text-xs text-gray-500">Authoritative & Warm</div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-base font-medium text-gray-700 mb-2">Difficulty</label>
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
            </div>
          </div>

          <button
            onClick={handleStartInterview}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors mt-8"
          >
            Start Interview Simulation
          </button>
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

      {/* Error Display - More specific */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 max-w-md">
          <div className="text-sm font-medium">Error:</div>
          <div className="text-xs">{error}</div>
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
