const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`;

export class GeminiService {
  constructor() {
    this.conversationHistory = [];
    this.currentQuestionIndex = 0;
    this.currentInterviewType = 'normal';
    this.interviewFlows = this.initializeInterviewFlows();
  }

  initializeInterviewFlows() {
    return {
      normal: {
        name: 'Interview Normal',
        stages: [
          {
            type: 'opening',
            topics: ['self_introduction', 'motivation', 'basic_background']
          },
          {
            type: 'experience_skills',
            topics: ['relevant_experience', 'key_strengths', 'achievements']
          },
          {
            type: 'position_fit',
            topics: ['why_position', 'company_interest', 'career_goals']
          }
        ]
      },
      technical: {
        name: 'Interview Teknis',
        stages: [
          {
            type: 'technical_intro',
            topics: ['technical_background', 'core_skills']
          },
          {
            type: 'problem_solving',
            topics: ['technical_challenges', 'problem_approach', 'tools_technologies']
          },
          {
            type: 'advanced_technical',
            topics: ['system_design', 'best_practices', 'innovation']
          }
        ]
      },
      behavioral: {
        name: 'Interview Behavioral',
        stages: [
          {
            type: 'personal_intro',
            topics: ['background_journey', 'core_values']
          },
          {
            type: 'teamwork_leadership',
            topics: ['team_experience', 'conflict_resolution', 'leadership_examples']
          },
          {
            type: 'adaptability_growth',
            topics: ['learning_mindset', 'pressure_handling', 'feedback_reception']
          }
        ]
      }
    };
  }

  getCurrentStage() {
    const flow = this.interviewFlows[this.currentInterviewType];
    if (!flow) return null;
    
    const stageIndex = Math.floor(this.currentQuestionIndex / 3); // 3 questions per stage
    return flow.stages[stageIndex] || flow.stages[flow.stages.length - 1];
  }

  async generateInterviewQuestion(jobRole, language = 'en', difficulty = 'medium', interviewType = 'normal') {
    this.currentInterviewType = interviewType;
    
    console.log(`Generating question for language: ${language}, type: ${interviewType}, difficulty: ${difficulty}`);
    
    // Check if API key is configured
    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'undefined') {
      console.warn('Gemini API key not configured, using fallback question');
      return this.getFallbackQuestion(jobRole, language, interviewType);
    }

    const currentStage = this.getCurrentStage();
    const contextualPrompt = this.buildContextualPrompt(jobRole, language, difficulty, interviewType, currentStage);

    console.log(`Generated prompt for ${language}:`, contextualPrompt);

    try {
      console.log('Making request to Gemini API...', GEMINI_API_URL);
      
      const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: contextualPrompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 200,
            topP: 0.9,
            topK: 40
          }
        }),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`API request failed with status ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('API Response:', data);

      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error('Invalid response format from Gemini API');
      }

      const question = data.candidates[0].content.parts[0].text.trim();
      console.log(`Generated question in ${language}:`, question);
      
      this.conversationHistory.push({
        role: 'interviewer',
        content: question,
        timestamp: new Date().toISOString(),
        stage: currentStage?.type,
        questionIndex: this.currentQuestionIndex
      });

      this.currentQuestionIndex++;
      return question;
    } catch (error) {
      console.error('Error generating question:', error);
      return this.getFallbackQuestion(jobRole, language, interviewType);
    }
  }

  buildContextualPrompt(jobRole, language, difficulty, interviewType, currentStage) {
    const basePrompts = {
      en: {
        normal: `You are conducting a professional job interview for a ${jobRole} position at ${difficulty} difficulty level. This is question #${this.currentQuestionIndex + 1}.`,
        technical: `You are conducting a technical interview for a ${jobRole} position at ${difficulty} difficulty level. Focus on technical skills and problem-solving. This is question #${this.currentQuestionIndex + 1}.`,
        behavioral: `You are conducting a behavioral interview for a ${jobRole} position at ${difficulty} difficulty level. Focus on soft skills and past experiences. This is question #${this.currentQuestionIndex + 1}.`
      },
      id: {
        normal: `Anda sedang melakukan wawancara kerja profesional untuk posisi ${jobRole} dengan tingkat kesulitan ${difficulty}. Ini adalah pertanyaan #${this.currentQuestionIndex + 1}.`,
        technical: `Anda sedang melakukan wawancara teknis untuk posisi ${jobRole} dengan tingkat kesulitan ${difficulty}. Fokus pada kemampuan teknis dan pemecahan masalah. Ini adalah pertanyaan #${this.currentQuestionIndex + 1}.`,
        behavioral: `Anda sedang melakukan wawancara behavioral untuk posisi ${jobRole} dengan tingkat kesulitan ${difficulty}. Fokus pada soft skills dan pengalaman masa lalu. Ini adalah pertanyaan #${this.currentQuestionIndex + 1}.`
      },
      zh: {
        normal: `您正在为${jobRole}职位进行专业面试，难度级别为${difficulty}。这是第${this.currentQuestionIndex + 1}个问题。`,
        technical: `您正在为${jobRole}职位进行技术面试，难度级别为${difficulty}。专注于技术技能和解决问题的能力。这是第${this.currentQuestionIndex + 1}个问题。`,
        behavioral: `您正在为${jobRole}职位进行行为面试，难度级别为${difficulty}。专注于软技能和过往经历。这是第${this.currentQuestionIndex + 1}个问题。`
      },
      ja: {
        normal: `${jobRole}ポジションの${difficulty}レベルのプロフェッショナル面接を実施しています。これは${this.currentQuestionIndex + 1}番目の質問です。`,
        technical: `${jobRole}ポジションの${difficulty}レベルの技術面接を実施しています。技術スキルと問題解決能力に焦点を当てます。これは${this.currentQuestionIndex + 1}番目の質問です。`,
        behavioral: `${jobRole}ポジションの${difficulty}レベルの行動面接を実施しています。ソフトスキルと過去の経験に焦点を当てます。これは${this.currentQuestionIndex + 1}番目の質問です。`
      },
      ar: {
        normal: `أنت تجري مقابلة عمل مهنية لمنصب ${jobRole} بمستوى صعوبة ${difficulty}. هذا هو السؤال رقم ${this.currentQuestionIndex + 1}. يرجى طرح السؤال باللغة العربية فقط.`,
        technical: `أنت تجري مقابلة تقنية لمنصب ${jobRole} بمستوى صعوبة ${difficulty}. ركز على المهارات التقنية وحل المشكلات. هذا هو السؤال رقم ${this.currentQuestionIndex + 1}. يرجى طرح السؤال باللغة العربية فقط.`,
        behavioral: `أنت تجري مقابلة سلوكية لمنصب ${jobRole} بمستوى صعوبة ${difficulty}. ركز على المهارات الناعمة والخبرات السابقة. هذا هو السؤال رقم ${this.currentQuestionIndex + 1}. يرجى طرح السؤال باللغة العربية فقط.`
      }
    };

    const stageGuidance = this.getStageGuidance(currentStage, language);
    const basePrompt = basePrompts[language]?.[interviewType] || basePrompts.en[interviewType];
    
    const languageInstructions = {
      en: 'Ask ONE specific, relevant interview question in English. Keep it professional and clear.',
      id: 'Ajukan SATU pertanyaan wawancara yang spesifik dan relevan dalam Bahasa Indonesia. Tetap profesional dan jelas.',
      zh: '请用中文提出一个具体且相关的面试问题。保持专业和清晰。',
      ja: '日本語で具体的で関連性のある面接質問を1つ聞いてください。プロフェッショナルで明確に。',
      ar: 'اطرح سؤال مقابلة واحد محدد وذو صلة باللغة العربية. حافظ على الطابع المهني والوضوح. يجب أن يكون السؤال باللغة العربية فقط.'
    };
    
    return `${basePrompt}

${stageGuidance}

${languageInstructions[language] || languageInstructions.en}

Do not include any prefixes, explanations, or additional text - just the question itself in the requested language.`;
  }

  buildEvaluationPrompt(answer, question, jobRole, language) {
    const prompts = {
      en: `Evaluate this interview answer for a ${jobRole} position:

QUESTION: "${question}"
ANSWER: "${answer}"

Provide feedback in EXACTLY this format:
SCORE: [number from 1-10]
STRENGTHS: [2-3 specific strengths, separated by semicolons]
IMPROVEMENTS: [2-3 specific improvements, separated by semicolons]
SUGGESTION: [one actionable tip]

Be specific and constructive in your feedback.`,

      id: `Evaluasi jawaban wawancara ini untuk posisi ${jobRole}:

PERTANYAAN: "${question}"
JAWABAN: "${answer}"

Berikan feedback dalam format PERSIS seperti ini:
SKOR: [angka dari 1-10]
KEKUATAN: [2-3 kekuatan spesifik, dipisahkan dengan titik koma]
PERBAIKAN: [2-3 perbaikan spesifik, dipisahkan dengan titik koma]
SARAN: [satu tips yang dapat diterapkan]

Berikan feedback yang spesifik dan konstruktif.`,

      zh: `评估这个${jobRole}职位的面试回答：

问题："${question}"
回答："${answer}"

请按以下格式提供反馈：
评分：[1-10的数字]
优势：[2-3个具体优势，用分号分隔]
改进：[2-3个具体改进，用分号分隔]
建议：[一个可行的建议]

请在评估中具体且具有建设性。`,

      ja: `${jobRole}ポジションのこの面接回答を評価してください：

質問：「${question}」
回答：「${answer}」

以下の形式でフィードバックを提供してください：
スコア：[1-10の数字]
強み：[2-3つの具体的な強み、セミコロンで区切る]
改善点：[2-3つの具体的な改善点、セミコロンで区切る]
提案：[実行可能な一つのヒント]

評価は具体的で建設的にしてください。`,

      ar: `قيم هذه الإجابة في المقابلة لمنصب ${jobRole}:

السؤال: "${question}"
الإجابة: "${answer}"

قدم التقييم في هذا التنسيق تماماً:
النقاط: [رقم من 1-10]
نقاط القوة: [2-3 نقاط قوة محددة، مفصولة بفاصلة منقوطة]
التحسينات: [2-3 تحسينات محددة، مفصولة بفاصلة منقوطة]
الاقتراح: [نصيحة قابلة للتطبيق]

كن محدداً وبناءً في تقييمك.`
    };

    return prompts[language] || prompts.en;
  }

  getStageGuidance(stage, language) {
    const stageGuidance = {
      en: {
        // Normal Interview
        opening: 'Focus on: brief self-introduction, motivation for applying, relevant background',
        experience_skills: 'Focus on: most relevant work experience, key strengths, notable achievements',
        position_fit: 'Focus on: why this specific role, company knowledge, future career plans',
        
        // Technical Interview
        technical_intro: 'Focus on: technical background, core programming/technical skills',
        problem_solving: 'Focus on: approach to technical problems, challenging projects solved, preferred tools',
        advanced_technical: 'Focus on: system architecture, optimization strategies, technical innovation',
        
        // Behavioral Interview
        personal_intro: 'Focus on: career journey, personal values, work philosophy',
        teamwork_leadership: 'Focus on: collaboration experiences, handling conflicts, leadership situations',
        adaptability_growth: 'Focus on: learning new skills, working under pressure, receiving feedback'
      },
      id: {
        // Normal Interview
        opening: 'Fokus pada: perkenalan singkat, motivasi melamar, latar belakang relevan',
        experience_skills: 'Fokus pada: pengalaman kerja paling relevan, kekuatan utama, pencapaian menonjol',
        position_fit: 'Fokus pada: mengapa posisi spesifik ini, pengetahuan perusahaan, rencana karier masa depan',
        
        // Technical Interview
        technical_intro: 'Fokus pada: latar belakang teknis, keterampilan programming/teknis inti',
        problem_solving: 'Fokus pada: pendekatan masalah teknis, proyek menantang yang diselesaikan, tools pilihan',
        advanced_technical: 'Fokus pada: arsitektur sistem, strategi optimisasi, inovasi teknis',
        
        // Behavioral Interview
        personal_intro: 'Fokus pada: perjalanan karier, nilai personal, filosofi kerja',
        teamwork_leadership: 'Fokus pada: pengalaman kolaborasi, menangani konflik, situasi kepemimpinan',
        adaptability_growth: 'Fokus pada: belajar keterampilan baru, bekerja di bawah tekanan, menerima feedback'
      },
      zh: {
        // Normal Interview
        opening: '关注：简要自我介绍、申请动机、相关背景',
        experience_skills: '关注：最相关的工作经验、关键优势、显著成就',
        position_fit: '关注：为什么选择这个特定职位、公司知识、未来职业规划',
        
        // Technical Interview
        technical_intro: '关注：技术背景、核心编程/技术技能',
        problem_solving: '关注：技术问题解决方法、已解决的挑战项目、首选工具',
        advanced_technical: '关注：系统架构、优化策略、技术创新',
        
        // Behavioral Interview
        personal_intro: '关注：职业历程、个人价值观、工作哲学',
        teamwork_leadership: '关注：合作经验、处理冲突、领导情况',
        adaptability_growth: '关注：学习新技能、承受压力、接受反馈'
      },
      ja: {
        // Normal Interview
        opening: '焦点：簡潔な自己紹介、応募動機、関連する背景',
        experience_skills: '焦点：最も関連する職歴、主要な強み、注目すべき成果',
        position_fit: '焦点：なぜこの特定の役職か、会社の知識、将来のキャリア計画',
        
        // Technical Interview
        technical_intro: '焦点：技術的背景、コアプログラミング/技術スキル',
        problem_solving: '焦点：技術的問題へのアプローチ、解決した困難なプロジェクト、好みのツール',
        advanced_technical: '焦点：システムアーキテクチャ、最適化戦略、技術革新',
        
        // Behavioral Interview
        personal_intro: '焦点：キャリアの歩み、個人的価値観、仕事の哲学',
        teamwork_leadership: '焦点：協力経験、対立の処理、リーダーシップ状況',
        adaptability_growth: '焦点：新しいスキルの学習、プレッシャー下での作業、フィードバックの受容'
      },
      ar: {
        // Normal Interview
        opening: 'ركز على: تعريف مختصر بالنفس، دافع التقديم، الخلفية ذات الصلة',
        experience_skills: 'ركز على: الخبرة العملية الأكثر صلة، نقاط القوة الرئيسية، الإنجازات البارزة',
        position_fit: 'ركز على: لماذا هذا المنصب تحديداً، معرفة الشركة، خطط المهنة المستقبلية',
        
        // Technical Interview
        technical_intro: 'ركز على: الخلفية التقنية، المهارات البرمجية/التقنية الأساسية',
        problem_solving: 'ركز على: نهج المشاكل التقنية، المشاريع الصعبة المحلولة، الأدوات المفضلة',
        advanced_technical: 'ركز على: هندسة الأنظمة، استراتيجيات التحسين، الابتكار التقني',
        
        // Behavioral Interview
        personal_intro: 'ركز على: رحلة المهنة، القيم الشخصية، فلسفة العمل',
        teamwork_leadership: 'ركز على: تجارب التعاون، التعامل مع الصراعات، مواقف القيادة',
        adaptability_growth: 'ركز على: تعلم مهارات جديدة، العمل تحت الضغط، تلقي التغذية الراجعة'
      }
    };

    const guidance = stageGuidance[language] || stageGuidance.en;
    return guidance[stage?.type] || guidance.opening;
  }

  async evaluateAnswer(answer, question, jobRole, language = 'en') {
    // Check if API key is configured
    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'undefined') {
      console.warn('Gemini API key not configured, using mock evaluation');
      return this.getMockEvaluation(language);
    }

    const evaluationPrompt = this.buildEvaluationPrompt(answer, question, jobRole, language);

    try {
      const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: evaluationPrompt
            }]
          }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 400,
            topP: 0.8,
            topK: 20
          }
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error('Invalid response format from Gemini API');
      }

      const evaluation = data.candidates[0].content.parts[0].text;
      console.log('Raw evaluation response:', evaluation);
      
      this.conversationHistory.push({
        role: 'candidate',
        content: answer,
        timestamp: new Date().toISOString()
      });

      return this.parseEvaluation(evaluation, language);
    } catch (error) {
      console.error('Error evaluating answer:', error);
      
      // Return mock evaluation if API fails
      this.conversationHistory.push({
        role: 'candidate',
        content: answer,
        timestamp: new Date().toISOString()
      });

      return this.getMockEvaluation(language);
    }
  }

  parseEvaluation(evaluation, language = 'en') {
    console.log('Parsing evaluation:', evaluation);
    
    const result = {
      score: 0,
      strengths: [],
      improvements: [],
      suggestion: ''
    };

    // Split into lines and clean
    const lines = evaluation.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    // Define keywords for different languages with more variations
    const keywords = {
      en: {
        score: ['SCORE:', 'Score:', 'RATING:', 'Rating:', 'POINTS:', 'Points:'],
        strengths: ['STRENGTHS:', 'Strengths:', 'STRENGTH:', 'Strength:', 'POSITIVES:', 'Positives:'],
        improvements: ['IMPROVEMENTS:', 'Improvements:', 'IMPROVEMENT:', 'Improvement:', 'AREAS FOR IMPROVEMENT:', 'Areas for improvement:', 'WEAKNESSES:', 'Weaknesses:'],
        suggestion: ['SUGGESTION:', 'Suggestion:', 'RECOMMENDATION:', 'Recommendation:', 'TIP:', 'Tip:', 'ADVICE:', 'Advice:']
      },
      id: {
        score: ['SKOR:', 'Skor:', 'NILAI:', 'Nilai:', 'POIN:', 'Poin:'],
        strengths: ['KEKUATAN:', 'Kekuatan:', 'KELEBIHAN:', 'Kelebihan:', 'POSITIF:', 'Positif:'],
        improvements: ['PERBAIKAN:', 'Perbaikan:', 'PENINGKATAN:', 'Peningkatan:', 'KELEMAHAN:', 'Kelemahan:'],
        suggestion: ['SARAN:', 'Saran:', 'REKOMENDASI:', 'Rekomendasi:', 'NASIHAT:', 'Nasihat:']
      },
      zh: {
        score: ['评分：', '评分:', '分数：', '分数:', '得分：', '得分:', 'SCORE:', 'Score:'],
        strengths: ['优势：', '优势:', '长处：', '长处:', '强项：', '强项:', '优点：', '优点:', 'STRENGTHS:', 'Strengths:'],
        improvements: ['改进：', '改进:', '改善：', '改善:', '不足：', '不足:', '缺点：', '缺点:', 'IMPROVEMENTS:', 'Improvements:'],
        suggestion: ['建议：', '建议:', '推荐：', '推荐:', '提议：', '提议:', '意见：', '意见:', 'SUGGESTION:', 'Suggestion:']
      },
      ja: {
        score: ['スコア：', 'スコア:', '点数：', '点数:', '評価：', '評価:', 'SCORE:', 'Score:'],
        strengths: ['強み：', '強み:', '長所：', '長所:', '良い点：', '良い点:', 'STRENGTHS:', 'Strengths:'],
        improvements: ['改善点：', '改善点:', '改善：', '改善:', '弱み：', '弱み:', '課題：', '課題:', 'IMPROVEMENTS:', 'Improvements:'],
        suggestion: ['提案：', '提案:', '推奨：', '推奨:', 'アドバイス：', 'アドバイス:', 'SUGGESTION:', 'Suggestion:']
      },
      ar: {
        score: ['النقاط:', 'النقاط：', 'التقييم:', 'التقييم：', 'الدرجة:', 'الدرجة：', 'النتيجة:', 'النتيجة：', 'SCORE:', 'Score:'],
        strengths: ['نقاط القوة:', 'نقاط القوة：', 'القوة:', 'القوة：', 'المميزات:', 'المميزات：', 'الإيجابيات:', 'الإيجابيات：', 'STRENGTHS:', 'Strengths:'],
        improvements: ['التحسينات:', 'التحسينات：', 'التطوير:', 'التطوير：', 'المجالات للتحسين:', 'المجالات للتحسين：', 'نقاط الضعف:', 'نقاط الضعف：', 'IMPROVEMENTS:', 'Improvements:'],
        suggestion: ['الاقتراح:', 'الاقتراح：', 'التوصية:', 'التوصية：', 'النصيحة:', 'النصيحة：', 'المشورة:', 'المشورة：', 'SUGGESTION:', 'Suggestion:']
      }
    };

    const langKeywords = keywords[language] || keywords.en;

    lines.forEach(line => {
      const upperLine = line.toUpperCase();
      const lineWithColon = line.includes('：') ? line.replace('：', ':') : line;
      
      // Parse Score with more flexible matching
      const scoreMatch = langKeywords.score.find(keyword => 
        upperLine.includes(keyword.toUpperCase()) || 
        line.includes(keyword) ||
        lineWithColon.toUpperCase().includes(keyword.toUpperCase())
      );
      if (scoreMatch) {
        // Look for numbers in the line
        const scoreText = line.substring(Math.max(line.indexOf(':'), line.indexOf('：')) + 1).trim();
        const numbers = scoreText.match(/\d+/g);
        if (numbers && numbers.length > 0) {
          const scoreNumber = parseInt(numbers[0]);
          if (!isNaN(scoreNumber) && scoreNumber >= 1 && scoreNumber <= 10) {
            result.score = scoreNumber;
          }
        }
        return;
      }

      // Parse Strengths with flexible matching
      const strengthMatch = langKeywords.strengths.find(keyword => 
        upperLine.includes(keyword.toUpperCase()) || 
        line.includes(keyword) ||
        lineWithColon.toUpperCase().includes(keyword.toUpperCase())
      );
      if (strengthMatch) {
        const separator = line.includes('：') ? '：' : ':';
        const strengthsText = line.substring(line.indexOf(separator) + 1).trim();
        if (strengthsText) {
          // Try different separators
          const separators = [';', '；', '，', ',', '。', '.', '\n'];
          let items = [strengthsText];
          
          for (const sep of separators) {
            if (strengthsText.includes(sep)) {
              items = strengthsText.split(sep).map(s => s.trim()).filter(s => s.length > 0);
              break;
            }
          }
          result.strengths = items.slice(0, 3); // Limit to 3 items
        }
        return;
      }

      // Parse Improvements with flexible matching
      const improvementMatch = langKeywords.improvements.find(keyword => 
        upperLine.includes(keyword.toUpperCase()) || 
        line.includes(keyword) ||
        lineWithColon.toUpperCase().includes(keyword.toUpperCase())
      );
      if (improvementMatch) {
        const separator = line.includes('：') ? '：' : ':';
        const improvementsText = line.substring(line.indexOf(separator) + 1).trim();
        if (improvementsText) {
          // Try different separators
          const separators = [';', '；', '，', ',', '。', '.', '\n'];
          let items = [improvementsText];
          
          for (const sep of separators) {
            if (improvementsText.includes(sep)) {
              items = improvementsText.split(sep).map(s => s.trim()).filter(s => s.length > 0);
              break;
            }
          }
          result.improvements = items.slice(0, 3); // Limit to 3 items
        }
        return;
      }

      // Parse Suggestion with flexible matching
      const suggestionMatch = langKeywords.suggestion.find(keyword => 
        upperLine.includes(keyword.toUpperCase()) || 
        line.includes(keyword) ||
        lineWithColon.toUpperCase().includes(keyword.toUpperCase())
      );
      if (suggestionMatch) {
        const separator = line.includes('：') ? '：' : ':';
        const suggestionText = line.substring(line.indexOf(separator) + 1).trim();
        if (suggestionText) {
          result.suggestion = suggestionText;
        }
        return;
      }
    });

    // Enhanced fallback parsing if structured format fails
    if (result.score === 0 || result.strengths.length === 0) {
      console.log('Enhanced fallback parsing...');
      const fallback = this.enhancedFallbackParsing(evaluation, language);
      result.score = result.score || fallback.score;
      result.strengths = result.strengths.length > 0 ? result.strengths : fallback.strengths;
      result.improvements = result.improvements.length > 0 ? result.improvements : fallback.improvements;
      result.suggestion = result.suggestion || fallback.suggestion;
    }

    console.log('Parsed result:', result);
    return result;
  }

  enhancedFallbackParsing(text, language) {
    // Extract score with more patterns
    const scorePatterns = [
      /(?:score|skor|rating|nilai|评分|評分|スコア|النقاط|التقييم)[\s:：]*(\d+)/i,
      /(\d+)[\s]*[\/out of]*[\s]*10/i,
      /(\d+)[\s]*分/i,
      /(\d+)[\s]*点/i
    ];
    
    let score = 7; // default fallback
    for (const pattern of scorePatterns) {
      const match = text.match(pattern);
      if (match) {
        const foundScore = parseInt(match[1]);
        if (!isNaN(foundScore) && foundScore >= 1 && foundScore <= 10) {
          score = foundScore;
          break;
        }
      }
    }

    // Enhanced fallback strengths and improvements
    const fallbacks = {
      en: {
        strengths: ['Good communication', 'Shows enthusiasm', 'Relevant experience'],
        improvements: ['Add more specific examples', 'Elaborate on experience', 'Provide measurable results'],
        suggestion: 'Provide concrete examples to strengthen your answer.'
      },
      id: {
        strengths: ['Komunikasi baik', 'Menunjukkan antusiasme', 'Pengalaman relevan'],
        improvements: ['Tambahkan contoh lebih spesifik', 'Jelaskan pengalaman lebih detail', 'Berikan hasil yang terukur'],
        suggestion: 'Berikan contoh konkret untuk memperkuat jawaban Anda.'
      },
      zh: {
        strengths: ['良好的沟通能力', '表现出热情', '相关经验丰富'],
        improvements: ['添加更具体的例子', '详细说明经验', '提供可衡量的结果'],
        suggestion: '提供具体的例子来加强你的回答。'
      },
      ja: {
        strengths: ['良好なコミュニケーション', '熱意を示している', '関連する経験'],
        improvements: ['より具体的な例を追加', '経験を詳しく説明', '測定可能な結果を提供'],
        suggestion: '回答を強化するために具体例を提供してください。'
      },
      ar: {
        strengths: ['التواصل الجيد', 'إظهار الحماس', 'الخبرة ذات الصلة'],
        improvements: ['إضافة أمثلة أكثر تحديداً', 'توضيح الخبرة بالتفصيل', 'تقديم نتائج قابلة للقياس'],
        suggestion: 'قدم أمثلة ملموسة لتقوية إجابتك.'
      }
    };

    return {
      score,
      ...fallbacks[language] || fallbacks.en
    };
  }

  getMockEvaluation(language = 'en') {
    const mockEvaluations = {
      en: {
        score: 7,
        strengths: ['Clear communication', 'Relevant experience mentioned'],
        improvements: ['Add more specific examples', 'Elaborate on technical skills'],
        suggestion: 'Try to provide concrete examples with measurable results.'
      },
      id: {
        score: 7,
        strengths: ['Komunikasi yang jelas', 'Pengalaman relevan disebutkan'],
        improvements: ['Tambahkan contoh yang lebih spesifik', 'Jelaskan keterampilan teknis lebih detail'],
        suggestion: 'Cobalah berikan contoh konkret dengan hasil yang dapat diukur.'
      },
      zh: {
        score: 7,
        strengths: ['沟通清晰', '提到了相关经验'],
        improvements: ['添加更具体的例子', '详细说明技术技能'],
        suggestion: '尝试提供具有可衡量结果的具体例子。'
      },
      ja: {
        score: 7,
        strengths: ['明確なコミュニケーション', '関連する経験の言及'],
        improvements: ['より具体的な例を追加', '技術スキルを詳しく説明'],
        suggestion: '測定可能な結果を伴う具体的な例を提供してみてください。'
      },
      ar: {
        score: 7,
        strengths: ['التواصل الواضح', 'ذكر الخبرة ذات الصلة'],
        improvements: ['إضافة أمثلة أكثر تحديداً', 'توضيح المهارات التقنية بالتفصيل'],
        suggestion: 'حاول تقديم أمثلة ملموسة مع نتائج قابلة للقياس.'
      }
    };

    return mockEvaluations[language] || mockEvaluations.en;
  }

  getFallbackQuestion(jobRole, language = 'en', interviewType = 'normal') {
    const fallbackQuestions = {
      en: {
        normal: [
          `Tell me about yourself and why you're interested in this ${jobRole} position.`,
          `What relevant experience and key strengths do you bring to this role?`,
          `Why do you want to work here and where do you see your career going?`
        ],
        technical: [
          `Describe your technical background and core skills for the ${jobRole} role.`,
          `Walk me through how you approach complex technical problems and your preferred tools.`,
          `How do you design systems and what's your approach to technical innovation?`
        ],
        behavioral: [
          `Tell me about your career journey and what drives you professionally.`,
          `Describe your experience working in teams and how you handle workplace conflicts.`,
          `How do you adapt to change and continue growing in your career?`
        ]
      },
      id: {
        normal: [
          `Ceritakan tentang diri Anda dan mengapa tertarik dengan posisi ${jobRole} ini.`,
          `Pengalaman relevan dan kekuatan utama apa yang Anda bawa untuk peran ini?`,
          `Mengapa Anda ingin bekerja di sini dan kemana arah karier Anda?`
        ],
        technical: [
          `Jelaskan latar belakang teknis dan keterampilan inti Anda untuk peran ${jobRole}.`,
          `Ceritakan bagaimana Anda menangani masalah teknis kompleks dan tools favorit Anda.`,
          `Bagaimana Anda merancang sistem dan pendekatan Anda terhadap inovasi teknis?`
        ],
        behavioral: [
          `Ceritakan perjalanan karier Anda dan apa yang memotivasi Anda secara profesional.`,
          `Jelaskan pengalaman Anda bekerja dalam tim dan bagaimana menangani konflik kerja.`,
          `Bagaimana Anda beradaptasi dengan perubahan dan terus berkembang dalam karier?`
        ]
      },
      zh: {
        normal: [
          `请介绍一下自己，以及为什么对这个${jobRole}职位感兴趣。`,
          `您为这个角色带来了什么相关经验和核心优势？`,
          `您为什么想在这里工作，您的职业发展方向是什么？`
        ],
        technical: [
          `请描述您的技术背景和${jobRole}角色所需的核心技能。`,
          `请介绍您如何处理复杂的技术问题以及您偏好的工具。`,
          `您如何设计系统，您对技术创新的方法是什么？`
        ],
        behavioral: [
          `请介绍您的职业历程以及是什么在专业上驱动着您。`,
          `请描述您在团队中工作的经验以及如何处理职场冲突。`,
          `您如何适应变化并在职业生涯中持续成长？`
        ]
      },
      ja: {
        normal: [
          `自己紹介と、なぜこの${jobRole}のポジションに興味を持ったのかを教えてください。`,
          `この役職にどのような関連経験と主要な強みをもたらしますか？`,
          `なぜここで働きたいのか、キャリアをどのように進めていきたいかを教えてください。`
        ],
        technical: [
          `${jobRole}の役職に必要な技術的背景とコアスキルについて説明してください。`,
          `複雑な技術的問題にどのようにアプローチし、好みのツールについて教えてください。`,
          `システムをどのように設計し、技術革新に対するアプローチは何ですか？`
        ],
        behavioral: [
          `あなたのキャリアの歩みと、専門的に何があなたを駆り立てているかを教えてください。`,
          `チームでの作業経験と、職場での対立をどのように処理するかを説明してください。`,
          `変化にどのように適応し、キャリアで成長し続けるのですか？`
        ]
      },
      ar: {
        normal: [
          `أخبرني عن نفسك ولماذا أنت مهتم بمنصب ${jobRole} هذا.`,
          `ما الخبرة ذات الصلة ونقاط القوة الرئيسية التي تجلبها لهذا الدور؟`,
          `لماذا تريد العمل هنا وأين ترى مسيرتك المهنية تتجه؟`
        ],
        technical: [
          `اوصف خلفيتك التقنية والمهارات الأساسية لدور ${jobRole}.`,
          `اشرح لي كيف تتعامل مع المشاكل التقنية المعقدة وأدواتك المفضلة.`,
          `كيف تصمم الأنظمة وما نهجك في الابتكار التقني؟`
        ],
        behavioral: [
          `أخبرني عن رحلة مسيرتك المهنية وما يحفزك مهنياً.`,
          `اوصف خبرتك في العمل ضمن فرق وكيف تتعامل مع صراعات العمل.`,
          `كيف تتكيف مع التغيير وتواصل النمو في مسيرتك المهنية؟`
        ]
      }
    };

    const questions = fallbackQuestions[language]?.[interviewType] || fallbackQuestions.en[interviewType];
    const stageIndex = Math.floor(this.currentQuestionIndex / 3); // 3 questions per stage
    const questionIndex = stageIndex % questions.length;
    const question = questions[questionIndex];
    
    this.conversationHistory.push({
      role: 'interviewer',
      content: question,
      timestamp: new Date().toISOString(),
      stage: 'fallback',
      questionIndex: this.currentQuestionIndex
    });

    this.currentQuestionIndex++;
    return question;
  }

  resetConversation() {
    this.conversationHistory = [];
    this.currentQuestionIndex = 0;
    this.currentInterviewType = 'normal';
  }

  getInterviewProgress() {
    const flow = this.interviewFlows[this.currentInterviewType];
    if (!flow) return null;

    const totalStages = flow.stages.length;
    const currentStageIndex = Math.floor(this.currentQuestionIndex / 3);
    const progress = Math.min((currentStageIndex / totalStages) * 100, 100);

    return {
      currentStage: currentStageIndex,
      totalStages: totalStages,
      progress: Math.round(progress),
      stageName: flow.stages[currentStageIndex]?.type || 'completed'
    };
  }

  getAvailableInterviewTypes() {
    return Object.keys(this.interviewFlows).map(key => ({
      value: key,
      name: this.interviewFlows[key].name
    }));
  }
}

export default new GeminiService();