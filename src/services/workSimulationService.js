const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`;

export class WorkSimulationService {
  constructor() {
    this.simulationHistory = [];
    this.currentStage = 0;
    this.currentScenario = null;
    this.teamMembers = [];
    this.tasks = [];
    this.simulationMetrics = {
      teamworkScore: 0,
      problemSolvingScore: 0,
      timeManagementScore: 0,
      communicationScore: 0,
      leadershipScore: 0
    };
  }

  initializeSimulation(simulationId) {
    this.currentScenario = this.getScenarioData(simulationId);
    this.currentStage = 0;
    this.simulationHistory = [];
    this.teamMembers = this.currentScenario.teamMembers;
    this.tasks = [...this.currentScenario.stages[0].tasks];
    this.resetMetrics();
    
    return {
      scenario: this.currentScenario,
      initialMessage: this.currentScenario.stages[0].introduction,
      teamMembers: this.teamMembers,
      tasks: this.tasks
    };
  }

  getScenarioData(simulationId) {
    const scenarios = {
      'frontend-dev': {
        title: 'Frontend Developer Sprint',
        company: 'TechStart Inc.',
        role: 'Frontend Developer',
        duration: 60,
        description: 'Build and optimize a critical e-commerce checkout flow with live coding and team collaboration',
        teamMembers: [
          { name: 'Sarah (Product Manager)', role: 'PM', avatar: '👩‍💼' },
          { name: 'Mike (Backend Dev)', role: 'Backend', avatar: '👨‍💻' },
          { name: 'Lisa (UX Designer)', role: 'Designer', avatar: '👩‍🎨' },
          { name: 'Alex (QA Engineer)', role: 'QA', avatar: '👨‍🔬' }
        ],
        stages: [
          {
            name: 'Sprint Planning & Code Setup',
            duration: 20,
            introduction: 'Welcome to the sprint planning. We need to implement a new checkout flow to improve conversion rates by 15%. You have the code editor ready and need to start implementation.',
            tasks: [
              'Analyze existing checkout code structure',
              'Set up React components for new flow',
              'Plan API integration strategy',
              'Create initial component structure'
            ],
            challenges: ['Legacy code integration', 'API compatibility', 'Performance requirements'],
            technicalTasks: [
              'Fix the API error handling in CheckoutPage.jsx',
              'Implement loading states for better UX',
              'Add form validation for checkout fields',
              'Optimize bundle size by code splitting'
            ]
          },
          {
            name: 'Development & Code Review',
            duration: 25,
            introduction: 'Development phase - implement features while handling code review feedback and team collaboration.',
            tasks: [
              'Implement checkout form validation',
              'Handle API integration and error cases',
              'Address code review feedback',
              'Coordinate with backend team on API changes'
            ],
            challenges: ['Conflicting code review feedback', 'API endpoint changes', 'Performance bottlenecks'],
            technicalTasks: [
              'Resolve merge conflicts in feature branch',
              'Update component props based on design feedback',
              'Add unit tests for form validation',
              'Implement error boundary for API failures'
            ]
          },
          {
            name: 'Testing & Deployment',
            duration: 15,
            introduction: 'Final phase - handle QA feedback, performance optimization, and prepare for deployment.',
            tasks: [
              'Fix QA-reported bugs',
              'Optimize performance metrics',
              'Handle deployment pipeline issues',
              'Document implementation decisions'
            ],
            challenges: ['Last-minute bug discoveries', 'Performance requirements not met', 'Deployment conflicts'],
            technicalTasks: [
              'Debug memory leak in checkout component',
              'Optimize bundle size to meet requirements',
              'Fix CI/CD pipeline errors',
              'Update README with new feature documentation'
            ]
          }
        ]
      },
      'devops-engineer': {
        title: 'Production Incident Response',
        company: 'CloudScale Systems',
        role: 'DevOps Engineer',
        duration: 60,
        description: 'Handle critical production outage affecting customer checkout system with real monitoring tools',
        teamMembers: [
          { name: 'Emma (Site Reliability)', role: 'SRE', avatar: '👩‍💻' },
          { name: 'Carlos (Security)', role: 'Security', avatar: '👨‍🔒' },
          { name: 'David (Engineering Lead)', role: 'Tech Lead', avatar: '👨‍💼' },
          { name: 'Rachel (Customer Success)', role: 'CS', avatar: '👩‍💬' }
        ],
        stages: [
          {
            name: 'Incident Detection & Assessment',
            duration: 15,
            introduction: 'ALERT: Critical production issue detected. Checkout service is experiencing high error rates. You need to quickly assess the situation using monitoring tools.',
            tasks: [
              'Analyze monitoring dashboards for root cause',
              'Check system health metrics and logs',
              'Coordinate with engineering team',
              'Communicate incident status to stakeholders'
            ],
            challenges: ['Multiple simultaneous alerts', 'Cascading failure symptoms', 'Limited monitoring visibility'],
            technicalTasks: [
              'Use kubectl to check pod status in production',
              'Analyze application logs for error patterns',
              'Check database connection pool status',
              'Verify load balancer health checks'
            ]
          },
          {
            name: 'Diagnosis & Emergency Fix',
            duration: 25,
            introduction: 'Root cause identified: Frontend pods are crash-looping due to container image issues. You need to implement emergency fixes.',
            tasks: [
              'Implement immediate mitigation strategies',
              'Coordinate with multiple teams during fix',
              'Execute rollback procedures if needed',
              'Monitor system recovery metrics'
            ],
            challenges: ['Time pressure from business impact', 'Coordination with multiple teams', 'Risk of making issue worse'],
            technicalTasks: [
              'Execute kubectl rollback to previous stable version',
              'Scale up healthy backend pods to handle load',
              'Update container registry credentials',
              'Implement temporary traffic routing fixes'
            ]
          },
          {
            name: 'Recovery & Post-Incident',
            duration: 20,
            introduction: 'System is stabilizing. Now focus on full recovery, monitoring, and post-incident activities.',
            tasks: [
              'Verify full system recovery',
              'Create incident timeline and report',
              'Implement monitoring improvements',
              'Plan preventive measures'
            ],
            challenges: ['Ensuring no regression', 'Comprehensive incident documentation', 'Preventing similar issues'],
            technicalTasks: [
              'Set up additional monitoring alerts',
              'Create runbook for similar incidents',
              'Update deployment pipeline safeguards',
              'Schedule post-mortem with all stakeholders'
            ]
          }
        ]
      },
      'software-engineer': {
        id: 'software-engineer',
        title: 'Software Engineer Development Sprint',
        company: 'TechVantage Solutions',
        role: 'Software Engineer',
        duration: 60,
        description: 'Build and debug a user management system with full-stack development, testing, and code review processes',
        teamMembers: [
          { name: 'Sarah (Tech Lead)', role: 'Tech Lead', avatar: '👩‍💼' },
          { name: 'Mike (Backend Developer)', role: 'Backend', avatar: '👨‍💻' },
          { name: 'Lisa (QA Engineer)', role: 'QA', avatar: '👩‍🔬' },
          { name: 'Alex (DevOps)', role: 'DevOps', avatar: '👨‍🔧' }
        ],
        stages: [
          {
            name: 'Code Development & Debugging',
            duration: 25,
            introduction: 'You need to implement and debug a UserService class. The current code has security issues and failing tests. Start by analyzing the code and fixing critical issues.',
            tasks: [
              'Review existing UserService implementation',
              'Fix security vulnerabilities in password handling',
              'Implement proper error handling',
              'Add input validation',
              'Write comprehensive unit tests'
            ],
            challenges: ['Security vulnerabilities', 'Failing unit tests', 'Performance issues'],
            technicalTasks: [
              'Replace insecure password hashing with bcrypt',
              'Add database transaction handling',
              'Implement input sanitization',
              'Create test coverage for edge cases'
            ]
          },
          {
            name: 'Code Review & Collaboration',
            duration: 20,
            introduction: 'Your code is ready for review. Address team feedback, participate in code review discussions, and collaborate on architectural decisions.',
            tasks: [
              'Address code review comments',
              'Discuss architectural improvements with team',
              'Resolve merge conflicts',
              'Update documentation',
              'Ensure code meets quality standards'
            ],
            challenges: ['Conflicting feedback from reviewers', 'Architectural disagreements', 'Time constraints'],
            technicalTasks: [
              'Refactor code based on peer feedback',
              'Update API documentation',
              'Add logging and monitoring',
              'Optimize database queries'
            ]
          },
          {
            name: 'Testing & Deployment',
            duration: 15,
            introduction: 'Final phase - ensure all tests pass, handle integration issues, and prepare for deployment.',
            tasks: [
              'Run comprehensive test suite',
              'Fix integration test failures',
              'Validate performance metrics',
              'Prepare deployment checklist',
              'Document release notes'
            ],
            challenges: ['Integration test failures', 'Performance bottlenecks', 'Deployment pipeline issues'],
            technicalTasks: [
              'Debug memory leaks in test environment',
              'Optimize API response times',
              'Configure CI/CD pipeline',
              'Set up monitoring alerts'
            ]
          }
        ]
      },
      'product-manager': {
        id: 'product-manager',
        title: 'Product Manager Sprint Execution',
        company: 'InnovateCorp',
        role: 'Product Manager',
        duration: 60,
        description: 'Manage product roadmap, coordinate cross-functional teams, and make strategic decisions using project management tools',
        teamMembers: [
          { name: 'David (Engineering Lead)', role: 'Engineering Lead', avatar: '👨‍💻' },
          { name: 'Emma (UX Designer)', role: 'UX Designer', avatar: '👩‍🎨' },
          { name: 'Jason (Marketing)', role: 'Marketing', avatar: '👨‍💼' },
          { name: 'Maria (Customer Success)', role: 'Customer Success', avatar: '👩‍💬' }
        ],
        stages: [
          {
            name: 'Sprint Planning & Roadmap',
            duration: 20,
            introduction: 'Start of new sprint. You need to prioritize user stories, manage the product backlog, and coordinate with stakeholders on roadmap decisions.',
            tasks: [
              'Review and prioritize product backlog',
              'Conduct sprint planning meeting',
              'Define user story acceptance criteria',
              'Coordinate with engineering on technical feasibility',
              'Update product roadmap timeline'
            ],
            challenges: ['Competing stakeholder priorities', 'Technical constraints', 'Resource limitations'],
            technicalTasks: [
              'Move high-priority stories to sprint',
              'Update epic progress tracking',
              'Schedule stakeholder reviews',
              'Define success metrics for new features'
            ]
          },
          {
            name: 'Execution & Stakeholder Management',
            duration: 25,
            introduction: 'Sprint is underway. Manage daily coordination, handle stakeholder requests, and make critical product decisions while monitoring progress.',
            tasks: [
              'Facilitate daily standups',
              'Address blocking issues',
              'Respond to stakeholder feedback',
              'Make scope adjustment decisions',
              'Monitor sprint progress metrics'
            ],
            challenges: ['Scope creep requests', 'Team blockers', 'Conflicting feedback'],
            technicalTasks: [
              'Update sprint board status',
              'Manage user story transitions',
              'Document stakeholder decisions',
              'Adjust resource allocation'
            ]
          },
          {
            name: 'Review & Strategic Planning',
            duration: 15,
            introduction: 'Sprint review and retrospective. Analyze results, gather feedback, and plan for upcoming sprints and product strategy.',
            tasks: [
              'Conduct sprint review with stakeholders',
              'Analyze sprint metrics and team velocity',
              'Plan next sprint priorities',
              'Update long-term product strategy',
              'Document lessons learned'
            ],
            challenges: ['Missed sprint commitments', 'Stakeholder expectation management', 'Strategic pivots'],
            technicalTasks: [
              'Update roadmap based on results',
              'Archive completed user stories',
              'Plan upcoming epic priorities',
              'Schedule follow-up stakeholder meetings'
            ]
          }
        ]
      }
    };

    return scenarios[simulationId];
  }

  async generateStageContent(stageIndex, userAction, context = '') {
    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'undefined') {
      return this.getFallbackContent(stageIndex, userAction);
    }

    const stage = this.currentScenario.stages[stageIndex];
    const prompt = this.buildStagePrompt(stage, userAction, context);

    try {
      const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 400,
            topP: 0.9,
            topK: 40
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      const content = data.candidates[0].content.parts[0].text.trim();

      this.simulationHistory.push({
        stage: stageIndex,
        userAction,
        aiResponse: content,
        timestamp: new Date().toISOString()
      });

      return {
        content,
        teamFeedback: this.generateTeamFeedback(userAction, stage),
        nextActions: this.getNextActions(stageIndex, userAction)
      };

    } catch (error) {
      console.error('Error generating stage content:', error);
      return this.getFallbackContent(stageIndex, userAction);
    }
  }

  buildStagePrompt(stage, userAction, context) {
    const technicalContext = this.currentScenario.id === 'software-engineer' 
      ? 'The user is working in a live development environment with code editor, debugger, test runner, and code review tools.'
      : 'The user is working with project management tools including sprint boards, roadmap planners, and stakeholder dashboards.';

    return `You are simulating a real professional workplace scenario for "${this.currentScenario.title}" at ${this.currentScenario.company}.

Current Stage: ${stage.name}
Role: ${this.currentScenario.role}
Team Members: ${this.teamMembers.map(m => m.name).join(', ')}

${technicalContext}

Stage Context: ${stage.introduction}
Current Tasks: ${stage.tasks.join(', ')}
Technical Tasks: ${stage.technicalTasks ? stage.technicalTasks.join(', ') : 'N/A'}
Potential Challenges: ${stage.challenges.join(', ')}

User Action: "${userAction}"
Additional Context: ${context}

Respond as if you are the professional workplace environment reacting to the user's action. Include:
1. Immediate consequences of the action (technical or project management related)
2. Specific team member reactions with professional context
3. New challenges or information that emerge from the action
4. Progress on both collaborative and technical/strategic tasks
5. Relevant metrics, feedback, or professional outcomes

Keep responses realistic for ${this.currentScenario.role} work environments, mentioning specific tools, processes, or decisions when relevant. Limit to 300 words.`;
  }

  generateTeamFeedback(userAction, stage) {
    // Simulate different team member responses based on action
    const feedbackOptions = {
      good: [
        "Great approach! This will help us move forward efficiently.",
        "I like how you're thinking about this problem.",
        "This solution addresses our main concerns well."
      ],
      neutral: [
        "That's one way to approach it. Let me know if you need input.",
        "Okay, let's see how this works out.",
        "I see where you're going with this."
      ],
      concern: [
        "I have some concerns about this approach. Can we discuss?",
        "This might create some challenges. Let's think it through.",
        "We should consider the potential risks here."
      ]
    };

    // Simple sentiment analysis of user action (in real implementation, use AI)
    const sentiment = userAction.length > 50 ? 'good' : 
                     userAction.includes('help') || userAction.includes('collaborate') ? 'good' :
                     userAction.includes('skip') || userAction.includes('ignore') ? 'concern' : 'neutral';

    return {
      member: this.teamMembers[Math.floor(Math.random() * this.teamMembers.length)],
      message: feedbackOptions[sentiment][Math.floor(Math.random() * feedbackOptions[sentiment].length)]
    };
  }

  getNextActions(stageIndex, userAction) {
    const stage = this.currentScenario.stages[stageIndex];
    return [
      `Continue with: ${stage.tasks[Math.floor(Math.random() * stage.tasks.length)]}`,
      'Ask team for input on next steps',
      'Review and adjust current approach',
      'Address any blocking issues'
    ];
  }

  async evaluateSimulationPerformance(actions, timeSpent) {
    const evaluation = {
      overallScore: 0,
      breakdown: {
        teamwork: { score: 0, feedback: '' },
        problemSolving: { score: 0, feedback: '' },
        timeManagement: { score: 0, feedback: '' },
        communication: { score: 0, feedback: '' },
        leadership: { score: 0, feedback: '' }
      },
      recommendations: []
    };

    // Analyze actions for scoring (simplified version)
    let collaborationCount = 0;
    let problemSolvingCount = 0;
    let communicationQuality = 0;

    actions.forEach(action => {
      const actionText = action.toLowerCase();
      if (actionText.includes('team') || actionText.includes('collaborate')) {
        collaborationCount++;
      }
      if (actionText.includes('solve') || actionText.includes('analyze')) {
        problemSolvingCount++;
      }
      if (actionText.length > 30) {
        communicationQuality++;
      }
    });

    // Calculate scores
    evaluation.breakdown.teamwork.score = Math.min(10, (collaborationCount / actions.length) * 10 + 5);
    evaluation.breakdown.problemSolving.score = Math.min(10, (problemSolvingCount / actions.length) * 10 + 5);
    evaluation.breakdown.communication.score = Math.min(10, (communicationQuality / actions.length) * 10 + 4);
    evaluation.breakdown.timeManagement.score = timeSpent < this.currentScenario.duration * 1.2 ? 8 : 6;
    evaluation.breakdown.leadership.score = 7; // Base score, could be improved with AI analysis

    evaluation.overallScore = Object.values(evaluation.breakdown)
      .reduce((sum, category) => sum + category.score, 0) / 5;

    // Generate feedback
    evaluation.breakdown.teamwork.feedback = evaluation.breakdown.teamwork.score > 7 ? 
      'Excellent collaboration with team members' : 'Could improve team communication';
    
    evaluation.breakdown.problemSolving.feedback = evaluation.breakdown.problemSolving.score > 7 ?
      'Strong analytical and problem-solving approach' : 'Consider more systematic problem analysis';

    evaluation.recommendations = this.generateRecommendations(evaluation.breakdown);

    return evaluation;
  }

  generateRecommendations(breakdown) {
    const recommendations = [];
    
    if (breakdown.teamwork.score < 7) {
      recommendations.push('Practice active collaboration and regular team check-ins');
    }
    if (breakdown.problemSolving.score < 7) {
      recommendations.push('Develop structured problem-solving methodologies');
    }
    if (breakdown.communication.score < 7) {
      recommendations.push('Improve written and verbal communication clarity');
    }
    
    return recommendations;
  }

  getFallbackContent(stageIndex, userAction) {
    const fallbackResponses = [
      "Your team acknowledges your decision and continues working on the current tasks.",
      "The action moves the project forward. Team members are coordinating their efforts.",
      "Progress is being made. Some new challenges have emerged that need attention.",
      "The team is responding well to your leadership. Next steps are becoming clearer."
    ];

    return {
      content: fallbackResponses[stageIndex % fallbackResponses.length],
      teamFeedback: {
        member: this.teamMembers[0],
        message: "Sounds good, let's keep moving forward."
      },
      nextActions: ['Continue with current approach', 'Review progress', 'Address any issues']
    };
  }

  resetMetrics() {
    this.simulationMetrics = {
      teamworkScore: 0,
      problemSolvingScore: 0,
      timeManagementScore: 0,
      communicationScore: 0,
      leadershipScore: 0
    };
  }

  getCurrentProgress() {
    return {
      currentStage: this.currentStage,
      totalStages: this.currentScenario?.stages.length || 0,
      progress: this.currentScenario ? (this.currentStage / this.currentScenario.stages.length) * 100 : 0
    };
  }
}

export default new WorkSimulationService();
