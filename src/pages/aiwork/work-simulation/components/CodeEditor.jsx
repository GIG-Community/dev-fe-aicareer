import React, { useState, useRef, useEffect } from 'react';
import { Play, Save, RefreshCw, Bug, Terminal, FileText } from 'lucide-react';

const CodeEditor = ({ 
    initialCode = '', 
    onCodeChange, 
    onRunTests, 
    testResults = [],
    onAddBreakpoint,
    debugBreakpoints = [],
    language = 'javascript' 
}) => {
    const [code, setCode] = useState(initialCode);
    const [isRunning, setIsRunning] = useState(false);
    const [executionOutput, setExecutionOutput] = useState([]);
    const [activeLineNumber, setActiveLineNumber] = useState(null);
    const textareaRef = useRef(null);
    const lineNumbersRef = useRef(null);

    useEffect(() => {
        setCode(initialCode);
    }, [initialCode]);

    const handleCodeChange = (e) => {
        const newCode = e.target.value;
        setCode(newCode);
        if (onCodeChange) {
            onCodeChange(newCode);
        }
    };

    const handleScroll = (e) => {
        if (lineNumbersRef.current) {
            lineNumbersRef.current.scrollTop = e.target.scrollTop;
        }
    };

    const handleLineClick = (lineNumber) => {
        if (onAddBreakpoint) {
            onAddBreakpoint(lineNumber);
        }
    };

    const runCode = async () => {
        setIsRunning(true);
        setExecutionOutput([]);
        
        // Simulate code execution
        const outputLines = [
            { type: 'info', content: '🔄 Running code...' },
            { type: 'output', content: 'Starting user service tests...' }
        ];

        // Check for common patterns and provide relevant output
        if (code.includes('console.log')) {
            const logs = code.match(/console\.log\(['"](.*?)['"]\)/g);
            if (logs) {
                logs.forEach(log => {
                    const message = log.match(/['"](.*?)['"]/)[1];
                    outputLines.push({ type: 'log', content: message });
                });
            }
        }

        if (code.includes('async') || code.includes('await')) {
            outputLines.push({ type: 'info', content: '⚡ Async operations detected' });
        }

        if (code.includes('bcrypt') || code.includes('hash')) {
            outputLines.push({ type: 'success', content: '🔐 Security: Password hashing implemented' });
        }

        if (code.includes('try') && code.includes('catch')) {
            outputLines.push({ type: 'success', content: '✅ Error handling: Try-catch blocks found' });
        }

        // Simulate execution delay
        for (let i = 0; i < outputLines.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 300));
            setExecutionOutput(prev => [...prev, outputLines[i]]);
        }

        setIsRunning(false);

        // Trigger test run if callback provided
        if (onRunTests) {
            onRunTests();
        }
    };

    const saveCode = () => {
        // Simulate saving
        setExecutionOutput(prev => [...prev, { type: 'success', content: '💾 Code saved successfully' }]);
    };

    const formatCode = () => {
        // Simple code formatting
        const formatted = code
            .split('\n')
            .map(line => line.trim())
            .join('\n')
            .replace(/{\s+/g, '{\n  ')
            .replace(/}\s+/g, '\n}\n')
            .replace(/;\s+/g, ';\n  ');
        
        setCode(formatted);
        if (onCodeChange) {
            onCodeChange(formatted);
        }
    };

    // Update highlight when component mounts
    useEffect(() => {
        // No need to call updateHighlight as we removed the transparent text overlay approach
    }, []);

    const lineCount = code.split('\n').length;
    const lines = Array.from({ length: Math.max(lineCount, 20) }, (_, i) => i + 1);

    return (
        <div className="h-full flex flex-col bg-gray-900">
            {/* Toolbar */}
            <div className="bg-gray-800 px-4 py-2 flex items-center justify-between border-b border-gray-700">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-blue-400" />
                        <span className="text-blue-400 text-sm font-medium">UserService.js</span>
                        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                        <span className="text-xs text-gray-400">Modified</span>
                    </div>
                </div>
                
                <div className="flex items-center space-x-2">
                    <button
                        onClick={formatCode}
                        className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1 rounded flex items-center transition-colors"
                    >
                        <RefreshCw className="w-3 h-3 mr-1" />
                        Format
                    </button>
                    <button
                        onClick={saveCode}
                        className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded flex items-center transition-colors"
                    >
                        <Save className="w-3 h-3 mr-1" />
                        Save
                    </button>
                    <button
                        onClick={runCode}
                        disabled={isRunning}
                        className="text-xs bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white px-3 py-1 rounded flex items-center transition-colors"
                    >
                        <Play className="w-3 h-3 mr-1" />
                        {isRunning ? 'Running...' : 'Run'}
                    </button>
                </div>
            </div>

            {/* Editor Area */}
            <div className="flex-1 flex relative overflow-hidden">
                {/* Line Numbers */}
                <div 
                    ref={lineNumbersRef}
                    className="w-12 bg-gray-800 text-gray-500 text-sm py-2 overflow-hidden select-none z-10 flex-shrink-0"
                >
                    {lines.map((lineNum) => (
                        <div 
                            key={lineNum}
                            className={`text-right px-2 py-0.5 cursor-pointer hover:bg-gray-700 leading-6 ${
                                debugBreakpoints.includes(lineNum) 
                                    ? 'bg-red-600 text-white' 
                                    : activeLineNumber === lineNum 
                                    ? 'bg-gray-700 text-gray-200' 
                                    : ''
                            }`}
                            onClick={() => handleLineClick(lineNum)}
                            onMouseEnter={() => setActiveLineNumber(lineNum)}
                            onMouseLeave={() => setActiveLineNumber(null)}
                        >
                            {lineNum}
                        </div>
                    ))}
                </div>

                {/* Code Editor Container */}
                <div className="flex-1 relative">
                    {/* Code Input with VS Code Colors */}
                    <textarea
                        ref={textareaRef}
                        value={code}
                        onChange={handleCodeChange}
                        onScroll={handleScroll}
                        className="absolute inset-0 bg-gray-900 font-mono text-sm p-4 resize-none focus:outline-none leading-6 z-10"
                        style={{ 
                            tabSize: 2,
                            lineHeight: '1.5rem',
                            color: '#D4D4D4', // VS Code default text color
                            caretColor: '#FFFFFF'
                        }}
                        spellCheck={false}
                        autoComplete="off"
                        placeholder=""
                    />

                    {/* Placeholder text when empty */}
                    {!code && (
                        <div className="absolute top-4 left-4 text-gray-600 pointer-events-none z-5 font-mono text-sm">
                            // Start coding here...
                        </div>
                    )}
                </div>

                {/* Execution Output Panel */}
                {executionOutput.length > 0 && (
                    <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col z-30 flex-shrink-0">
                        <div className="bg-gray-700 px-3 py-2 flex items-center border-b border-gray-600">
                            <Terminal className="w-4 h-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-300">Output</span>
                            <button 
                                onClick={() => setExecutionOutput([])}
                                className="ml-auto text-xs text-gray-400 hover:text-gray-200"
                            >
                                Clear
                            </button>
                        </div>
                        <div className="flex-1 p-3 overflow-y-auto font-mono text-xs">
                            {executionOutput.map((output, index) => (
                                <div 
                                    key={index} 
                                    className={`mb-1 ${
                                        output.type === 'error' ? 'text-red-400' :
                                        output.type === 'success' ? 'text-green-400' :
                                        output.type === 'warning' ? 'text-yellow-400' :
                                        output.type === 'info' ? 'text-blue-400' :
                                        output.type === 'log' ? 'text-purple-400' :
                                        'text-gray-300'
                                    }`}
                                >
                                    {output.content}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Status Bar */}
            <div className="bg-gray-800 px-4 py-1 text-xs text-gray-400 border-t border-gray-700 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <span className="text-blue-400">JavaScript</span>
                    <span>UTF-8</span>
                    <span>Ln {code.split('\n').length}, Col 1</span>
                </div>
                <div className="flex items-center space-x-4">
                    {debugBreakpoints.length > 0 && (
                        <span className="flex items-center">
                            <Bug className="w-3 h-3 mr-1 text-red-400" />
                            <span className="text-red-400">{debugBreakpoints.length} breakpoint{debugBreakpoints.length !== 1 ? 's' : ''}</span>
                        </span>
                    )}
                    <span className={`flex items-center ${
                        testResults.some(t => t.status === 'failing') ? 'text-red-400' :
                        testResults.every(t => t.status === 'passing') && testResults.length > 0 ? 'text-green-400' :
                        'text-yellow-400'
                    }`}>
                        {testResults.length} test{testResults.length !== 1 ? 's' : ''}
                    </span>
                    <span className="text-gray-500">Spaces: 2</span>
                </div>
            </div>

            {/* Custom CSS for better syntax highlighting in textarea */}
            <style jsx>{`
                textarea::placeholder {
                    color: #6A9955;
                    font-style: italic;
                }
                textarea::-webkit-scrollbar {
                    width: 8px;
                    height: 8px;
                }
                textarea::-webkit-scrollbar-track {
                    background: #2D3748;
                }
                textarea::-webkit-scrollbar-thumb {
                    background: #4A5568;
                    border-radius: 4px;
                }
                textarea::-webkit-scrollbar-thumb:hover {
                    background: #718096;
                }
            `}</style>
        </div>
    );
};

export default CodeEditor;
