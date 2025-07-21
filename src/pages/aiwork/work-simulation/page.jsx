import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, Clock, Target, Send, ArrowRight, CheckCircle, 
  AlertCircle, MessageCircle, Timer, Award, TrendingUp,
  User, Briefcase, X, Play, Pause, Code, Terminal, 
  Monitor, FileText, GitBranch, Bug, Zap, Activity, Kanban, Calendar
} from 'lucide-react';
import workSimulationService from '../../../services/workSimulationService';
import CodeEditor from './components/CodeEditor';

const WorkSimulation = ({ simulationId, onEnd }) => {
    const [simulationData, setSimulationData] = useState(null);
    const [currentStage, setCurrentStage] = useState(0);
    const [userAction, setUserAction] = useState('');
    const [conversationHistory, setConversationHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [timeSpent, setTimeSpent] = useState(0);
    const [stageTimeSpent, setStageTimeSpent] = useState(0);
    const [simulationStarted, setSimulationStarted] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [finalEvaluation, setFinalEvaluation] = useState(null);
    const [completedTasks, setCompletedTasks] = useState([]);
    const [teamFeedbackHistory, setTeamFeedbackHistory] = useState([]);
    
    // Technical interface states
    const [activeTab, setActiveTab] = useState('chat');
    const [codeContent, setCodeContent] = useState('');
    const [terminalOutput, setTerminalOutput] = useState([]);
    const [terminalInput, setTerminalInput] = useState('');
    const [testResults, setTestResults] = useState([]);
    const [debugBreakpoints, setDebugBreakpoints] = useState([]);
    const [codeReviewItems, setCodeReviewItems] = useState([]);
    
    // Product Manager specific states
    const [sprintBoard, setSprintBoard] = useState({
        backlog: [],
        todo: [],
        inProgress: [],
        review: [],
        done: []
    });
    const [userStories, setUserStories] = useState([]);
    const [roadmapItems, setRoadmapItems] = useState([]);
    const [stakeholderFeedback, setStakeholderFeedback] = useState([]);

    const timerRef = useRef(null);
    const textareaRef = useRef(null);
    const terminalRef = useRef(null);

    // Define tabs based on simulation type - moved before usage
    const tabs = simulationId === 'software-engineer' 
        ? [
                { id: 'chat', label: 'Team Chat', icon: MessageCircle },
                { id: 'code', label: 'Code Editor', icon: Code },
                { id: 'tests', label: 'Test Runner', icon: Target },
                { id: 'review', label: 'Code Review', icon: GitBranch }
            ]
        : [
                { id: 'chat', label: 'Team Chat', icon: MessageCircle },
                { id: 'sprint', label: 'Sprint Board', icon: Kanban },
                { id: 'roadmap', label: 'Roadmap', icon: Calendar },
                { id: 'stakeholders', label: 'Stakeholders', icon: Users }
            ];

    useEffect(() => {
        initializeSimulation();
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [simulationId]);

    useEffect(() => {
        if (simulationStarted && isActive) {
            timerRef.current = setInterval(() => {
                setTimeSpent(prev => prev + 1);
                setStageTimeSpent(prev => prev + 1);
            }, 1000);
        } else {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [simulationStarted, isActive]);

    const initializeSimulation = () => {
        const data = workSimulationService.initializeSimulation(simulationId);
        setSimulationData(data);
        
        // Add initial message to conversation
        setConversationHistory([{
            type: 'system',
            content: data.initialMessage,
            timestamp: new Date().toISOString(),
            stage: 0
        }]);
    };

    const startSimulation = () => {
        setSimulationStarted(true);
        setIsActive(true);
    };

    const pauseSimulation = () => {
        setIsActive(!isActive);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const submitAction = async () => {
        if (!userAction.trim() || loading) return;

        setLoading(true);
        const action = userAction.trim();
        setUserAction('');

        // Add user action to conversation
        const userMessage = {
            type: 'user',
            content: action,
            timestamp: new Date().toISOString(),
            stage: currentStage
        };

        setConversationHistory(prev => [...prev, userMessage]);

        try {
            // Get AI response for the action
            const response = await workSimulationService.generateStageContent(
                currentStage,
                action,
                `Time spent on stage: ${stageTimeSpent}s`
            );

            // Add AI response to conversation
            const aiMessage = {
                type: 'ai',
                content: response.content,
                timestamp: new Date().toISOString(),
                stage: currentStage,
                teamFeedback: response.teamFeedback,
                nextActions: response.nextActions
            };

            setConversationHistory(prev => [...prev, aiMessage]);
            
            // Add team feedback to history
            if (response.teamFeedback) {
                setTeamFeedbackHistory(prev => [...prev, {
                    ...response.teamFeedback,
                    stage: currentStage,
                    timestamp: new Date().toISOString()
                }]);
            }

            // Randomly complete tasks based on action quality
            if (action.length > 20 && Math.random() > 0.6) {
                const currentStageTasks = simulationData.scenario.stages[currentStage].tasks;
                const availableTasks = currentStageTasks.filter(task => 
                    !completedTasks.some(completed => completed.task === task)
                );
                
                if (availableTasks.length > 0) {
                    const completedTask = {
                        task: availableTasks[0],
                        stage: currentStage,
                        timestamp: new Date().toISOString()
                    };
                    setCompletedTasks(prev => [...prev, completedTask]);
                }
            }

        } catch (error) {
            console.error('Error processing action:', error);
            const errorMessage = {
                type: 'system',
                content: 'System: There was an issue processing your action. Please try again.',
                timestamp: new Date().toISOString(),
                stage: currentStage,
                isError: true
            };
            setConversationHistory(prev => [...prev, errorMessage]);
        }

        setLoading(false);
    };

    const nextStage = () => {
        if (currentStage < simulationData.scenario.stages.length - 1) {
            const nextStageIndex = currentStage + 1;
            setCurrentStage(nextStageIndex);
            setStageTimeSpent(0);
            
            // Add stage transition message
            const transitionMessage = {
                type: 'system',
                content: `--- Stage ${nextStageIndex + 1}: ${simulationData.scenario.stages[nextStageIndex].name} ---\n\n${simulationData.scenario.stages[nextStageIndex].introduction}`,
                timestamp: new Date().toISOString(),
                stage: nextStageIndex,
                isTransition: true
            };
            
            setConversationHistory(prev => [...prev, transitionMessage]);
        } else {
            finishSimulation();
        }
    };

    const finishSimulation = async () => {
        setIsActive(false);
        setLoading(true);
        
        try {
            // Collect all user actions for evaluation
            const userActions = conversationHistory
                .filter(msg => msg.type === 'user')
                .map(msg => msg.content);

            const evaluation = await workSimulationService.evaluateSimulationPerformance(
                userActions,
                timeSpent
            );

            setFinalEvaluation(evaluation);
            setShowResults(true);
        } catch (error) {
            console.error('Error evaluating performance:', error);
        }
        
        setLoading(false);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            submitAction();
        }
    };

    const initializeTechnicalEnvironment = () => {
        if (simulationId === 'software-engineer') {
            setCodeContent(`// E-commerce User Management System
class UserService {
    constructor(database) {
        this.db = database;
        this.cache = new Map();
    }

    async createUser(userData) {
        // TODO: Add validation
        try {
            const user = await this.db.users.create({
                email: userData.email,
                password: await this.hashPassword(userData.password),
                profile: userData.profile
            });
            
            // Clear cache
            this.cache.clear();
            return user;
        } catch (error) {
            // TODO: Better error handling
            throw error;
        }
    }

    async getUserById(userId) {
        // Check cache first
        if (this.cache.has(userId)) {
            return this.cache.get(userId);
        }

        const user = await this.db.users.findById(userId);
        if (user) {
            this.cache.set(userId, user);
        }
        return user;
    }

    async hashPassword(password) {
        // TODO: Implement secure hashing
        return password; // This is insecure!
    }
}

// Tests needed for this class
module.exports = UserService;`);

            setTestResults([
                { name: 'UserService.createUser', status: 'pending', message: 'Test not implemented' },
                { name: 'UserService.getUserById', status: 'failing', message: 'Cache invalidation issue' },
                { name: 'UserService.hashPassword', status: 'failing', message: 'Security vulnerability detected' }
            ]);

            setCodeReviewItems([
                { id: 1, type: 'security', line: 32, message: 'Password hashing is not secure - use bcrypt', status: 'pending', priority: 'high' },
                { id: 2, type: 'performance', line: 15, message: 'Consider using database transactions for user creation', status: 'pending', priority: 'medium' },
                { id: 3, type: 'testing', line: 8, message: 'Add input validation tests', status: 'pending', priority: 'low' }
            ]);

            setTerminalOutput([
                { type: 'system', content: '🔧 Development Environment Ready' },
                { type: 'command', content: 'npm test' },
                { type: 'error', content: '❌ 2 tests failing, 1 pending' },
                { type: 'command', content: 'npm run lint' },
                { type: 'warning', content: '⚠️  3 security issues found' }
            ]);

        } else if (simulationId === 'product-manager') {
            setSprintBoard({
                backlog: [
                    { id: 'US-101', title: 'User Registration Flow', points: 8, priority: 'high' },
                    { id: 'US-102', title: 'Password Reset Feature', points: 5, priority: 'medium' },
                    { id: 'US-103', title: 'Email Verification', points: 3, priority: 'low' }
                ],
                todo: [
                    { id: 'US-104', title: 'Shopping Cart Integration', points: 13, assignee: 'Mike (Backend)', priority: 'high' },
                    { id: 'US-105', title: 'Payment Gateway Setup', points: 8, assignee: 'Sarah (Frontend)', priority: 'high' }
                ],
                inProgress: [
                    { id: 'US-106', title: 'User Dashboard UI', points: 5, assignee: 'Lisa (Designer)', priority: 'medium', progress: 60 }
                ],
                review: [
                    { id: 'US-107', title: 'API Documentation', points: 3, assignee: 'Alex (QA)', priority: 'low' }
                ],
                done: [
                    { id: 'US-108', title: 'Login Authentication', points: 8, priority: 'high' },
                    { id: 'US-109', title: 'Database Schema', points: 5, priority: 'medium' }
                ]
            });

            setUserStories([
                { id: 'US-110', title: 'As a user, I want to save items to wishlist', status: 'draft', points: 5 },
                { id: 'US-111', title: 'As an admin, I want to manage user accounts', status: 'ready', points: 13 },
                { id: 'US-112', title: 'As a user, I want to track my orders', status: 'in-progress', points: 8 }
            ]);

            setRoadmapItems([
                { id: 'EPIC-1', title: 'User Management System', progress: 75, deadline: '2024-02-15', status: 'on-track' },
                { id: 'EPIC-2', title: 'E-commerce Core Features', progress: 45, deadline: '2024-03-01', status: 'at-risk' },
                { id: 'EPIC-3', title: 'Analytics & Reporting', progress: 0, deadline: '2024-03-15', status: 'not-started' }
            ]);

            setStakeholderFeedback([
                { from: 'CEO', message: 'Need to prioritize mobile experience for Q1', urgency: 'high', timestamp: '2 hours ago' },
                { from: 'Marketing', message: 'Can we add social media integration?', urgency: 'medium', timestamp: '1 day ago' },
                { from: 'Customer Support', message: 'Users reporting login issues', urgency: 'high', timestamp: '30 minutes ago' }
            ]);
        }
    };

    const handleTechnicalAction = (action, data) => {
        if (action === 'code_update') {
            setCodeContent(data);
            addTechnicalFeedback('code', 'Code updated successfully. Analysis running...');
            
            // Simulate code analysis
            setTimeout(() => {
                if (data.includes('bcrypt')) {
                    addTechnicalFeedback('security', '✅ Security improved: bcrypt implementation detected');
                    updateTestResults('UserService.hashPassword', 'passing', 'Security test passed');
                }
                
                if (data.includes('validation') || data.includes('joi') || data.includes('validate')) {
                    addTechnicalFeedback('validation', '✅ Input validation added');
                    updateTestResults('UserService.createUser', 'passing', 'Validation test passed');
                }
            }, 1000);
        } else if (action === 'terminal_command') {
            executeTerminalCommand(data);
        } else if (action === 'code_review') {
            handleCodeReview(data);
        }
    };

    const executeTerminalCommand = (command) => {
        const newOutput = [...terminalOutput, { type: 'command', content: `$ ${command}` }];
        
        // Simulate command responses
        if (command.includes('kubectl describe')) {
            newOutput.push({ type: 'output', content: 'Events:' });
            newOutput.push({ type: 'error', content: '  Warning  Failed  3m (x12 over 3h)  kubelet  Error: ImagePullBackOff' });
            newOutput.push({ type: 'system', content: '💡 Hint: Check container image and registry access' });
        } else if (command.includes('logs')) {
            newOutput.push({ type: 'output', content: '[2024-01-15 10:30:45] ERROR: Database connection timeout' });
            newOutput.push({ type: 'error', content: '[2024-01-15 10:30:46] FATAL: Unable to connect to postgres://db:5432' });
        } else if (command.includes('docker')) {
            newOutput.push({ type: 'output', content: 'Container restarted successfully' });
            newOutput.push({ type: 'system', content: '✅ Temporary fix applied. Monitoring for stability...' });
        } else {
            newOutput.push({ type: 'output', content: 'Command executed successfully' });
        }

        setTerminalOutput(newOutput);
        setTerminalInput('');
    };

    const handleCodeReview = (reviewId) => {
        setCodeReviewItems(prev => 
            prev.map(item => 
                item.id === reviewId 
                    ? { ...item, status: 'resolved' }
                    : item
            )
        );
        addTechnicalFeedback('review', 'Code review item resolved');
    };

    const addTechnicalFeedback = (source, message) => {
        const feedback = {
            type: 'technical',
            source,
            content: message,
            timestamp: new Date().toISOString(),
            stage: currentStage
        };
        setConversationHistory(prev => [...prev, feedback]);
    };

    const handleCodeUpdate = (newCode) => {
        setCodeContent(newCode);
        addTechnicalFeedback('code', 'Code updated successfully. Analysis running...');
        
        // Simulate code analysis
        setTimeout(() => {
            if (newCode.includes('bcrypt')) {
                addTechnicalFeedback('security', '✅ Security improved: bcrypt implementation detected');
                updateTestResults('UserService.hashPassword', 'passing', 'Security test passed');
            }
            
            if (newCode.includes('validation') || newCode.includes('joi') || newCode.includes('validate')) {
                addTechnicalFeedback('validation', '✅ Input validation added');
                updateTestResults('UserService.createUser', 'passing', 'Validation test passed');
            }
        }, 1000);
    };

    const handleRunTests = () => {
        setTestResults(prev => prev.map(test => ({ ...test, status: 'running' })));
        
        setTimeout(() => {
            setTestResults(prev => prev.map(test => {
                if (codeContent.includes('bcrypt') && test.name.includes('hashPassword')) {
                    return { ...test, status: 'passing', message: 'Password hashing secure' };
                }
                if (codeContent.includes('validation') && test.name.includes('createUser')) {
                    return { ...test, status: 'passing', message: 'Input validation working' };
                }
                return { ...test, status: 'failing' };
            }));
        }, 2000);
    };

    const updateTestResults = (testName, status, message) => {
        setTestResults(prev => prev.map(test => 
            test.name === testName ? { ...test, status, message } : test
        ));
    };

    const handleAddBreakpoint = (lineNumber) => {
        setDebugBreakpoints(prev => 
            prev.includes(lineNumber) 
                ? prev.filter(bp => bp !== lineNumber)
                : [...prev, lineNumber]
        );
        addTechnicalFeedback('debug', `Breakpoint ${prev.includes(lineNumber) ? 'removed' : 'added'} at line ${lineNumber}`);
    };

    // Initialize technical environment when simulation starts
    useEffect(() => {
        if (simulationData && simulationStarted) {
            initializeTechnicalEnvironment();
        }
    }, [simulationData, simulationStarted]);

    // Software Engineer specific components
    const TestRunner = () => (
        <div className="h-full bg-white p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-800">Test Results</h3>
                <button 
                    onClick={handleRunTests}
                    className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                    Run All Tests
                </button>
            </div>
            <div className="space-y-3">
                {testResults.map((test, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center">
                            <div className={`w-3 h-3 rounded-full mr-3 ${
                                test.status === 'passing' ? 'bg-green-500' :
                                test.status === 'failing' ? 'bg-red-500' :
                                test.status === 'running' ? 'bg-yellow-500 animate-pulse' :
                                'bg-gray-400'
                            }`}></div>
                            <span className="font-medium text-sm">{test.name}</span>
                        </div>
                        <span className="text-xs text-gray-600">{test.message}</span>
                    </div>
                ))}
            </div>
        </div>
    );

    const CodeReview = () => (
        <div className="h-full bg-white p-4 overflow-y-auto">
            <div className="flex items-center mb-4">
                <h3 className="font-medium text-gray-800">Code Review - PR #1247</h3>
            </div>
            <div className="space-y-3">
                {codeReviewItems.map((item) => (
                    <div 
                        key={item.id}
                        className={`border rounded-lg p-3 ${
                            item.status === 'resolved' ? 'bg-green-50 border-green-200' : 
                            item.priority === 'high' ? 'bg-red-50 border-red-200' :
                            item.priority === 'medium' ? 'bg-yellow-50 border-yellow-200' :
                            'bg-blue-50 border-blue-200'
                        }`}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                                <span className={`w-2 h-2 rounded-full mr-2 ${
                                    item.type === 'security' ? 'bg-red-500' :
                                    item.type === 'performance' ? 'bg-yellow-500' :
                                    'bg-blue-500'
                                }`}></span>
                                <span className="text-sm font-medium">Line {item.line} - {item.type}</span>
                                <span className={`ml-2 text-xs px-2 py-1 rounded ${
                                    item.priority === 'high' ? 'bg-red-100 text-red-700' :
                                    item.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-blue-100 text-blue-700'
                                }`}>
                                    {item.priority}
                                </span>
                            </div>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{item.message}</p>
                        {item.status === 'pending' && (
                            <button
                                onClick={() => handleCodeReview(item.id)}
                                className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                            >
                                Mark Resolved
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );

    // Product Manager specific components
    const SprintBoard = () => (
        <div className="h-full bg-gray-50 p-4">
            <h3 className="font-medium text-gray-800 mb-4">Sprint Board - Week 3</h3>
            <div className="grid grid-cols-5 gap-4 h-full">
                {Object.entries(sprintBoard).map(([column, items]) => (
                    <div key={column} className="bg-white rounded-lg p-3">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-gray-700 capitalize">
                                {column.replace(/([A-Z])/g, ' $1').trim()}
                            </h4>
                            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                                {items.length}
                            </span>
                        </div>
                        <div className="space-y-2">
                            {items.map((item) => (
                                <div 
                                    key={item.id} 
                                    className="bg-white border border-gray-200 rounded p-2 cursor-move hover:shadow-md"
                                    draggable
                                >
                                    <div className="text-xs text-blue-600 font-medium mb-1">{item.id}</div>
                                    <div className="text-sm font-medium text-gray-800 mb-2">{item.title}</div>
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                            {item.points} pts
                                        </span>
                                        {item.assignee && (
                                            <span className="text-gray-500">{item.assignee}</span>
                                        )}
                                    </div>
                                    {item.progress && (
                                        <div className="mt-2">
                                            <div className="bg-gray-200 rounded-full h-1">
                                                <div 
                                                    className="bg-blue-500 h-1 rounded-full" 
                                                    style={{ width: `${item.progress}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const ProductRoadmap = () => (
        <div className="h-full bg-white p-4">
            <h3 className="font-medium text-gray-800 mb-4">Product Roadmap - Q1 2024</h3>
            <div className="space-y-4">
                {roadmapItems.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-gray-800">{item.title}</h4>
                            <span className={`text-xs px-3 py-1 rounded-full ${
                                item.status === 'on-track' ? 'bg-green-100 text-green-700' :
                                item.status === 'at-risk' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-gray-100 text-gray-700'
                            }`}>
                                {item.status.replace('-', ' ')}
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                            <span>Progress: {item.progress}%</span>
                            <span>Due: {item.deadline}</span>
                        </div>
                        <div className="bg-gray-200 rounded-full h-2">
                            <div 
                                className={`h-2 rounded-full ${
                                    item.status === 'on-track' ? 'bg-green-500' :
                                    item.status === 'at-risk' ? 'bg-yellow-500' :
                                    'bg-gray-400'
                                }`}
                                style={{ width: `${item.progress}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const StakeholderDashboard = () => (
        <div className="h-full bg-white p-4">
            <h3 className="font-medium text-gray-800 mb-4">Stakeholder Communications</h3>
            <div className="space-y-3">
                {stakeholderFeedback.map((feedback, idx) => (
                    <div key={idx} className={`border-l-4 p-3 rounded ${
                        feedback.urgency === 'high' ? 'border-red-500 bg-red-50' :
                        feedback.urgency === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                        'border-blue-500 bg-blue-50'
                    }`}>
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-sm">{feedback.from}</span>
                            <span className="text-xs text-gray-500">{feedback.timestamp}</span>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{feedback.message}</p>
                        <div className="flex space-x-2">
                            <button className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                                Respond
                            </button>
                            <button className="text-xs bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700">
                                Add to Backlog
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    // Return early if no simulationData
    if (!simulationData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading simulation...</p>
                </div>
            </div>
        );
    }

    // Main Simulation Interface with Technical Tools
    if (simulationStarted && !showResults) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col">
                {/* Header */}
                <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <h1 className="text-xl font-bold text-gray-800">{simulationData.scenario.title}</h1>
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                            Stage {currentStage + 1}/{simulationData.scenario.stages.length}
                        </span>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2 text-gray-600">
                            <Timer className="w-5 h-5" />
                            <span className="font-mono">{formatTime(timeSpent)}</span>
                        </div>
                        
                        <button
                            onClick={pauseSimulation}
                            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
                        >
                            {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                        </button>
                        
                        <button
                            onClick={onEnd}
                            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex">
                    {/* Left Sidebar - Team & Tasks */}
                    <div className="w-80 bg-white border-r border-gray-200 p-6 overflow-y-auto">
                        {/* Current Stage Info */}
                        <div className="mb-6">
                            <h3 className="text-lg font-medium text-gray-800 mb-2">
                                {simulationData.scenario.stages[currentStage].name}
                            </h3>
                            <div className="text-sm text-gray-600 mb-3">
                                Stage {currentStage + 1} • {formatTime(stageTimeSpent)} elapsed
                            </div>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                <p className="text-blue-800 text-sm">
                                    {simulationData.scenario.stages[currentStage].introduction}
                                </p>
                            </div>
                        </div>

                        {/* Tasks */}
                        <div className="mb-6">
                            <h4 className="font-medium text-gray-800 mb-3">Stage Tasks</h4>
                            <div className="space-y-2">
                                {simulationData.scenario.stages[currentStage].tasks.map((task, index) => {
                                    const isCompleted = completedTasks.some(
                                        completed => completed.task === task && completed.stage === currentStage
                                    );
                                    return (
                                        <div 
                                            key={index} 
                                            className={`flex items-start space-x-2 p-2 rounded text-sm ${
                                                isCompleted ? 'bg-green-50 text-green-800' : 'bg-gray-50 text-gray-700'
                                            }`}
                                        >
                                            <CheckCircle 
                                                className={`w-4 h-4 mt-0.5 ${
                                                    isCompleted ? 'text-green-600' : 'text-gray-400'
                                                }`} 
                                            />
                                            <span className={isCompleted ? 'line-through' : ''}>{task}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Team Members */}
                        <div className="mb-6">
                            <h4 className="font-medium text-gray-800 mb-3">Team Members</h4>
                            <div className="space-y-2">
                                {simulationData.teamMembers.map((member, index) => (
                                    <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded text-sm">
                                        <span className="text-lg">{member.avatar}</span>
                                        <div>
                                            <div className="font-medium text-gray-800">{member.name}</div>
                                            <div className="text-gray-600">{member.role}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Team Feedback */}
                        {teamFeedbackHistory.length > 0 && (
                            <div>
                                <h4 className="font-medium text-gray-800 mb-3">Recent Team Feedback</h4>
                                <div className="space-y-2">
                                    {teamFeedbackHistory.slice(-3).reverse().map((feedback, index) => (
                                        <div key={index} className="bg-yellow-50 border border-yellow-200 rounded p-2">
                                            <div className="text-xs font-medium text-yellow-800">
                                                {feedback.member.name}
                                            </div>
                                            <div className="text-sm text-yellow-700 mt-1">
                                                "{feedback.message}"
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Main Technical Area */}
                    <div className="flex-1 flex flex-col">
                        {/* Tab Navigation */}
                        <div className="bg-white border-b border-gray-200">
                            <div className="flex">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`px-4 py-3 text-sm font-medium border-b-2 flex items-center ${
                                            activeTab === tab.id
                                                ? 'border-blue-500 text-blue-600 bg-blue-50'
                                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                        }`}
                                    >
                                        <tab.icon className="w-4 h-4 mr-2" />
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Technical Interface Content */}
                        <div className="flex-1">
                            {activeTab === 'chat' && (
                                <div className="h-full flex flex-col">
                                    {/* Chat interface */}
                                    <div className="flex-1 p-6 overflow-y-auto">
                                        <div className="space-y-4 max-w-4xl">
                                            {conversationHistory.map((message, index) => (
                                                <div 
                                                    key={index} 
                                                    className={`flex ${
                                                        message.type === 'user' ? 'justify-end' : 'justify-start'
                                                    }`}
                                                >
                                                    <div 
                                                        className={`max-w-[80%] rounded-xl p-4 ${
                                                            message.type === 'user' 
                                                                ? 'bg-blue-600 text-white' 
                                                                : message.type === 'system'
                                                                ? message.isTransition
                                                                    ? 'bg-purple-100 text-purple-800 border border-purple-200'
                                                                    : message.isError
                                                                    ? 'bg-red-100 text-red-800 border border-red-200'
                                                                    : 'bg-gray-100 text-gray-800'
                                                                : 'bg-white border border-gray-200 text-gray-800'
                                                        }`}
                                                    >
                                                        {message.type !== 'user' && (
                                                            <div className="flex items-center space-x-2 mb-2">
                                                                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                                                                    {message.type === 'system' ? '🏢' : '🤖'}
                                                                </div>
                                                                <span className="font-medium text-sm">
                                                                    {message.type === 'system' ? 'Workplace' : 'AI Facilitator'}
                                                                </span>
                                                            </div>
                                                        )}
                                                        <div className="whitespace-pre-wrap">{message.content}</div>
                                                        
                                                        {message.teamFeedback && (
                                                            <div className="mt-3 p-2 bg-black bg-opacity-10 rounded">
                                                                <div className="text-xs font-medium">
                                                                    {message.teamFeedback.member.name}:
                                                                </div>
                                                                <div className="text-sm">"{message.teamFeedback.message}"</div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                            
                                            {loading && (
                                                <div className="flex justify-start">
                                                    <div className="bg-white border border-gray-200 rounded-xl p-4 max-w-[80%]">
                                                        <div className="flex items-center space-x-2">
                                                            <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                                                            <span className="text-gray-600">Processing your action...</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-200 p-6 bg-white">
                                        <div className="flex space-x-4">
                                            <textarea
                                                ref={textareaRef}
                                                value={userAction}
                                                onChange={(e) => setUserAction(e.target.value)}
                                                onKeyPress={handleKeyPress}
                                                placeholder={isActive ? "What would you like to do? Describe your action in detail..." : "Simulation is paused"}
                                                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                                rows="3"
                                                disabled={!isActive || loading}
                                            />
                                            
                                            <div className="flex flex-col space-y-2">
                                                <button
                                                    onClick={submitAction}
                                                    disabled={!userAction.trim() || loading || !isActive}
                                                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors flex items-center"
                                                >
                                                    <Send className="w-4 h-4 mr-2" />
                                                    Submit
                                                </button>
                                                
                                                {currentStage < simulationData.scenario.stages.length - 1 ? (
                                                    <button
                                                        onClick={nextStage}
                                                        className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center text-sm"
                                                    >
                                                        <ArrowRight className="w-4 h-4 mr-1" />
                                                        Next Stage
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={finishSimulation}
                                                        className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors flex items-center text-sm"
                                                    >
                                                        <Target className="w-4 h-4 mr-1" />
                                                        Finish
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <div className="flex justify-between items-center mt-3 text-sm text-gray-500">
                                            <span>
                                                {userAction.length} characters • Stage {currentStage + 1} of {simulationData.scenario.stages.length}
                                            </span>
                                            <span>
                                                Press Enter to submit, Shift+Enter for new line
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            {activeTab === 'code' && (
                                <CodeEditor 
                                    initialCode={codeContent}
                                    onCodeChange={handleCodeUpdate}
                                    onRunTests={handleRunTests}
                                    testResults={testResults}
                                    onAddBreakpoint={handleAddBreakpoint}
                                    debugBreakpoints={debugBreakpoints}
                                    language="javascript"
                                />
                            )}
                            {activeTab === 'tests' && <TestRunner />}
                            {activeTab === 'review' && <CodeReview />}
                            {activeTab === 'sprint' && <SprintBoard />}
                            {activeTab === 'roadmap' && <ProductRoadmap />}
                            {activeTab === 'stakeholders' && <StakeholderDashboard />}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Results Screen
    if (showResults && finalEvaluation) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
                <div className="max-w-4xl mx-auto">
                    <div className="glass-card rounded-2xl p-8">
                        <div className="text-center mb-8">
                            <Award className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">Simulation Complete!</h1>
                            <p className="text-gray-600">Here's how you performed in the {simulationData.scenario.title}</p>
                        </div>

                        {/* Overall Score */}
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4">
                                <span className="text-4xl font-bold text-white">
                                    {Math.round(finalEvaluation.overallScore)}/10
                                </span>
                            </div>
                            <h2 className="text-xl font-semibold text-gray-800">Overall Performance</h2>
                        </div>

                        {/* Detailed Breakdown */}
                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                            {Object.entries(finalEvaluation.breakdown).map(([category, data]) => (
                                <div key={category} className="bg-white rounded-xl p-6 border border-gray-200">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-lg font-medium text-gray-800 capitalize">
                                            {category.replace(/([A-Z])/g, ' $1').trim()}
                                        </h3>
                                        <span className="text-2xl font-bold text-blue-600">
                                            {Math.round(data.score)}/10
                                        </span>
                                    </div>
                                    <p className="text-gray-600 text-sm">{data.feedback}</p>
                                    <div className="mt-3 bg-gray-200 rounded-full h-2">
                                        <div 
                                            className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-1000"
                                            style={{ width: `${(data.score / 10) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Statistics */}
                        <div className="grid md:grid-cols-4 gap-4 mb-8">
                            <div className="text-center p-4 bg-white rounded-xl border border-gray-200">
                                <Timer className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                                <div className="text-2xl font-bold text-gray-800">{formatTime(timeSpent)}</div>
                                <div className="text-gray-600 text-sm">Time Spent</div>
                            </div>
                            <div className="text-center p-4 bg-white rounded-xl border border-gray-200">
                                <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                                <div className="text-2xl font-bold text-gray-800">{completedTasks.length}</div>
                                <div className="text-gray-600 text-sm">Tasks Completed</div>
                            </div>
                            <div className="text-center p-4 bg-white rounded-xl border border-gray-200">
                                <MessageCircle className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                                <div className="text-2xl font-bold text-gray-800">
                                    {conversationHistory.filter(msg => msg.type === 'user').length}
                                </div>
                                <div className="text-gray-600 text-sm">Actions Taken</div>
                            </div>
                            <div className="text-center p-4 bg-white rounded-xl border border-gray-200">
                                <TrendingUp className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                                <div className="text-2xl font-bold text-gray-800">{currentStage + 1}</div>
                                <div className="text-gray-600 text-sm">Stages Completed</div>
                            </div>
                        </div>

                        {/* Recommendations */}
                        {finalEvaluation.recommendations.length > 0 && (
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
                                <h3 className="text-lg font-medium text-blue-800 mb-4">Recommendations for Improvement</h3>
                                <ul className="space-y-2">
                                    {finalEvaluation.recommendations.map((rec, index) => (
                                        <li key={index} className="flex items-start">
                                            <ArrowRight className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                                            <span className="text-blue-700">{rec}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => {
                                    setShowResults(false);
                                    initializeSimulation();
                                    setCurrentStage(0);
                                    setTimeSpent(0);
                                    setStageTimeSpent(0);
                                    setSimulationStarted(false);
                                    setIsActive(false);
                                    setConversationHistory([]);
                                    setCompletedTasks([]);
                                    setTeamFeedbackHistory([]);
                                }}
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                            >
                                Try Again
                            </button>
                            <button
                                onClick={onEnd}
                                className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
                            >
                                Back to Simulations
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Pre-start Screen
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="glass-card rounded-2xl p-8 max-w-2xl w-full">
                <div className="text-center mb-8">
                    <Briefcase className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        {simulationData.scenario.title}
                    </h1>
                    <p className="text-gray-600 mb-4">{simulationData.scenario.company}</p>
                    <p className="text-gray-700">{simulationData.scenario.description}</p>
                </div>

                {/* Team Members */}
                <div className="mb-8">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Your Team</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {simulationData.teamMembers.map((member, index) => (
                            <div key={index} className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200">
                                <span className="text-2xl">{member.avatar}</span>
                                <div>
                                    <div className="font-medium text-gray-800">{member.name}</div>
                                    <div className="text-sm text-gray-600">{member.role}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Simulation Stages */}
                <div className="mb-8">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Simulation Stages</h3>
                    <div className="space-y-3">
                        {simulationData.scenario.stages.map((stage, index) => (
                            <div key={index} className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200">
                                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-medium text-sm">
                                    {index + 1}
                                </div>
                                <div className="flex-1">
                                    <div className="font-medium text-gray-800">{stage.name}</div>
                                    <div className="text-sm text-gray-600">{stage.duration} minutes</div>
                                </div>
                                <Clock className="w-5 h-5 text-gray-400" />
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    onClick={startSimulation}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center"
                >
                    <Play className="w-5 h-5 mr-2" />
                    Start Simulation
                </button>
            </div>
        </div>
    );
};

export default WorkSimulation;
