const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`;
import documentService from './documentService';

export class GeminiService {
  constructor() {
    this.conversationHistory = [];
    this.currentQuestionIndex = 0;
    this.currentInterviewType = 'normal';
    this.candidateProfile = null; // New: Store CV/portfolio analysis
    this.interviewFlows = this.initializeInterviewFlows();
  }
  // Add this method to your GeminiService class

async evaluateAnswer(answer, question, jobRole, language = 'en') {
  console.log(`Evaluating answer for ${jobRole} in ${language}`);
  
  // Check if API key is configured
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'undefined') {
    throw new Error('Gemini API key not configured. Cannot evaluate answers without API access.');
  }

  // Build the evaluation prompt
  const evaluationPrompt = this.buildEvaluationPrompt(answer, question, jobRole, language);
  
  console.log('Generated evaluation prompt:', evaluationPrompt);

  try {
    console.log('Making evaluation request to Gemini API...');
    
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
          temperature: 0.3, // Lower temperature for more consistent evaluation
          maxOutputTokens: 300,
          topP: 0.8,
          topK: 30
        }
      }),
    });

    console.log('Evaluation response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Evaluation API Error Response:', errorText);
      throw new Error(`Evaluation API request failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Evaluation API Response:', data);

    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response format from Gemini API for evaluation');
    }

    const evaluationText = data.candidates[0].content.parts[0].text.trim();
    console.log('Raw evaluation text:', evaluationText);
    
    // Parse the evaluation using the strict parser
    const parsedEvaluation = this.parseEvaluationStrict(evaluationText, language);
    
    if (!parsedEvaluation) {
      console.warn('Failed to parse evaluation, falling back to basic response');
      
      // Fallback evaluation if parsing fails
      return {
        score: 5, // Default neutral score
        strengths: [language === 'id' ? 'jawaban diberikan' : 'answer provided'],
        improvements: [language === 'id' ? 'dapat lebih detail' : 'could be more detailed'],
        suggestion: language === 'id' ? 'Berikan contoh spesifik untuk memperkuat jawaban' : 'Provide specific examples to strengthen your answer',
        rawEvaluation: evaluationText
      };
    }

    // Store the evaluation in conversation history
    this.conversationHistory.push({
      role: 'evaluation',
      content: parsedEvaluation,
      rawEvaluation: evaluationText,
      timestamp: new Date().toISOString(),
      questionIndex: this.currentQuestionIndex - 1 // Previous question
    });

    return {
      ...parsedEvaluation,
      rawEvaluation: evaluationText
    };

  } catch (error) {
    console.error('Error evaluating answer:', error);
    
    // Return a basic evaluation instead of throwing
    return {
      score: null,
      strengths: [],
      improvements: [],
      suggestion: language === 'id' 
        ? 'Maaf, terjadi kesalahan saat mengevaluasi jawaban. Silakan coba lagi.' 
        : 'Sorry, there was an error evaluating your answer. Please try again.',
      error: error.message,
      rawEvaluation: ''
    };
  }
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

  getStageGuidance(currentStage, language) {
    // Remove this method entirely - we don't want to generate fake guidance
    return '';
  }

  async generateInterviewQuestion(jobRole, language = 'en', difficulty = 'medium', interviewType = 'normal') {
    this.currentInterviewType = interviewType;
    
    console.log(`Generating question for language: ${language}, type: ${interviewType}, difficulty: ${difficulty}`);
    
    // Check if API key is configured
    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'undefined') {
      throw new Error('Gemini API key not configured. Cannot generate questions without API access.');
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
        throw new Error(`API request failed: ${response.status} - ${errorText}`);
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
      throw error; // Don't use fallback, just throw the error
    }
  }

  setCandidateProfile(profileData) {
    this.candidateProfile = profileData;
    console.log('Candidate profile set:', profileData?.summary);
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
      }
    };

    const stageGuidance = this.getStageGuidance(currentStage, language);
    const basePrompt = basePrompts[language]?.[interviewType] || basePrompts.en[interviewType];
    
    // Enhanced profile context with RAG
    let profileContext = '';
    if (this.candidateProfile) {
      profileContext = this.buildRAGProfileContext(language, currentStage, interviewType);
    }
    
    const languageInstructions = {
      en: 'Ask ONE specific, relevant interview question in English. Keep it professional and clear.',
      id: 'Ajukan SATU pertanyaan wawancara yang spesifik dan relevan dalam Bahasa Indonesia. Tetap profesional dan jelas.'
    };
    
    return `${basePrompt}

${profileContext}

${stageGuidance}

${languageInstructions[language] || languageInstructions.en}

Do not include any prefixes, explanations, or additional text - just the question itself in the requested language.`;
  }

  buildRAGProfileContext(language, currentStage, interviewType) {
    if (!this.candidateProfile) {
      return ''; // Don't pretend we have profile data
    }

    // Create a query based on current stage and interview type
    const stageQueries = {
      opening: `background experience motivation ${interviewType}`,
      experience_skills: `work experience technical skills achievements projects`,
      position_fit: `career goals company fit motivation`,
      technical_intro: `technical background programming skills development`,
      problem_solving: `problem solving technical challenges projects`,
      advanced_technical: `system design architecture best practices`,
      personal_intro: `career journey values background`,
      teamwork_leadership: `team collaboration leadership management`,
      adaptability_growth: `learning growth challenges adaptation`
    };

    const query = stageQueries[currentStage?.type] || 'experience skills background';
    
    // Get relevant context using RAG
    const ragContext = documentService.getRAGContext(query);
    
    if (!ragContext.chunks.length) {
      console.warn('No relevant content found for query:', query);
      return ''; // Don't generate fake context
    }

    // Only return context if we actually have meaningful data
    if (ragContext.context.trim().length < 20) {
      console.warn('Insufficient CV content for meaningful context');
      return '';
    }

    const contextPrompts = {
      en: `
CANDIDATE CV ANALYSIS (Based on uploaded CV - use ONLY the information below):

RELEVANT CV SECTIONS:
${ragContext.context}

EXTRACTED DATA:
- Technical Skills Found: ${this.candidateProfile.skills?.length > 0 ? this.candidateProfile.skills.slice(0, 5).join(', ') : 'None detected'}
- Experience Entries: ${this.candidateProfile.experience?.length || 0} relevant entries found
- Projects Mentioned: ${this.candidateProfile.projects?.length || 0} projects found

STRICT INSTRUCTIONS:
- Ask questions ONLY about the specific information shown above
- DO NOT ask about skills or experiences not mentioned in the CV sections
- If the CV content is insufficient, ask general questions instead
- Reference exact details from the CV content provided`,
      
      id: `
ANALISIS CV KANDIDAT (Berdasarkan CV yang diupload - gunakan HANYA informasi di bawah ini):

BAGIAN CV YANG RELEVAN:
${ragContext.context}

DATA YANG DIEKSTRAK:
- Keahlian Teknis Ditemukan: ${this.candidateProfile.skills?.length > 0 ? this.candidateProfile.skills.slice(0, 5).join(', ') : 'Tidak terdeteksi'}
- Entri Pengalaman: ${this.candidateProfile.experience?.length || 0} entri relevan ditemukan
- Proyek yang Disebutkan: ${this.candidateProfile.projects?.length || 0} proyek ditemukan

INSTRUKSI KETAT:
- Ajukan pertanyaan HANYA tentang informasi spesifik yang ditunjukkan di atas
- JANGAN tanya tentang keahlian atau pengalaman yang tidak disebutkan di bagian CV
- Jika konten CV tidak mencukupi, ajukan pertanyaan umum saja
- Rujuk detail persis dari konten CV yang disediakan`
    };

    return contextPrompts[language] || contextPrompts.en;
  }

  buildEvaluationPrompt(answer, question, jobRole, language) {
    const prompts = {
      en: `Evaluate this interview answer for a ${jobRole} position:

QUESTION: "${question}"
ANSWER: "${answer}"

${this.candidateProfile ? `
CANDIDATE BACKGROUND CONTEXT (Use for evaluation):
- Skills: ${this.candidateProfile.skills?.slice(0, 8).join(', ') || 'Not specified'}
- Experience: ${this.candidateProfile.experience?.slice(0, 2).map(exp => exp.content || exp).join('; ') || 'Not specified'}
- Top Keywords from CV: ${this.candidateProfile.summary?.topKeywords?.slice(0, 5).join(', ') || 'None'}

Consider the candidate's background when evaluating the answer relevance and depth.
Check if the answer aligns with their stated experience and skills from their CV.
` : ''}

Provide feedback in EXACTLY this format:
SCORE: [number from 1-10]
STRENGTHS: [2-3 specific strengths, separated by semicolons]
IMPROVEMENTS: [2-3 specific improvements, separated by semicolons]
SUGGESTION: [one actionable tip]

Be specific and constructive in your feedback.`,

      id: `Evaluasi jawaban wawancara ini untuk posisi ${jobRole}:

PERTANYAAN: "${question}"
JAWABAN: "${answer}"

${this.candidateProfile ? `
KONTEKS LATAR BELAKANG KANDIDAT (Gunakan untuk evaluasi):
- Keahlian: ${this.candidateProfile.skills?.slice(0, 8).join(', ') || 'Tidak disebutkan'}
- Pengalaman: ${this.candidateProfile.experience?.slice(0, 2).map(exp => exp.content || exp).join('; ') || 'Tidak disebutkan'}
- Kata Kunci Utama dari CV: ${this.candidateProfile.summary?.topKeywords?.slice(0, 5).join(', ') || 'Tidak ada'}

Pertimbangkan latar belakang kandidat saat mengevaluasi relevansi dan kedalaman jawaban.
Periksa apakah jawaban selaras dengan pengalaman dan keahlian yang tercantum dalam CV mereka.
` : ''}

Berikan feedback dalam format PERSIS seperti ini:
SKOR: [angka dari 1-10]
KEKUATAN: [2-3 kekuatan spesifik, dipisahkan dengan titik koma]
PERBAIKAN: [2-3 perbaikan spesifik, dipisahkan dengan titik koma]
SARAN: [satu tips yang dapat diterapkan]

Berikan feedback yang spesifik dan konstruktif.`
    };

    return prompts[language] || prompts.en;
  }

  // Enhanced method to get contextual interview insights
  getInterviewInsights() {
    if (!this.candidateProfile) {
      console.warn('No candidate profile available for insights');
      return null;
    }

    // Only provide insights if we actually have data
    const skillsCount = this.candidateProfile.skills?.length || 0;
    const experienceCount = this.candidateProfile.experience?.length || 0;
    const projectsCount = this.candidateProfile.projects?.length || 0;

    if (skillsCount === 0 && experienceCount === 0 && projectsCount === 0) {
      console.warn('Insufficient profile data for meaningful insights');
      return null;
    }

    const insights = {
      strengths: [],
      potentialQuestions: [],
      focusAreas: [],
      experienceLevel: 'Cannot be determined from available data'
    };

    // Only analyze if we have actual data
    if (experienceCount >= 3 && skillsCount >= 10) {
      insights.experienceLevel = 'Senior (based on CV content)';
    } else if (experienceCount >= 1 && skillsCount >= 5) {
      insights.experienceLevel = 'Mid-level (based on CV content)';
    } else if (experienceCount > 0 || skillsCount > 0) {
      insights.experienceLevel = 'Junior (based on limited CV content)';
    }

    // Only add strengths if we actually found keywords
    if (this.candidateProfile.summary?.topKeywords?.length > 0) {
      insights.strengths = this.candidateProfile.summary.topKeywords.slice(0, 3);
    }

    // Only add potential questions if we have skills
    if (skillsCount > 0) {
      const topSkills = this.candidateProfile.skills.slice(0, 2);
      insights.potentialQuestions = topSkills.map(skill => 
        `Questions about ${skill} (found in CV)`
      );
    }

    // Only add focus areas if we have actual data
    if (this.candidateProfile.summary?.hasCertifications) {
      insights.focusAreas.push('Professional certifications (mentioned in CV)');
    }
    if (projectsCount > 0) {
      insights.focusAreas.push(`Project experience (${projectsCount} projects found)`);
    }

    return insights;
  }

  parseEvaluationStrict(evaluation, language = 'en') {
    console.log('Parsing evaluation strictly:', evaluation);
    
    const result = {
      score: null,
      strengths: [],
      improvements: [],
      suggestion: ''
    };

    // Define strict keywords for different languages
    const keywords = {
      en: {
        score: /(?:SCORE|Score|RATING|Rating):\s*(\d+)/i,
        strengths: /(?:STRENGTHS|Strengths):\s*([^]*?)(?=IMPROVEMENTS|IMPROVEMENT|$)/i,
        improvements: /(?:IMPROVEMENTS|IMPROVEMENT|Improvements):\s*([^]*?)(?=SUGGESTION|RECOMMENDATION|$)/i,
        suggestion: /(?:SUGGESTION|RECOMMENDATION|Suggestion|Recommendation):\s*([^]*?)$/i
      },
      id: {
        score: /(?:SKOR|Skor|NILAI|Nilai):\s*(\d+)/i,
        strengths: /(?:KEKUATAN|Kekuatan|KELEBIHAN|Kelebihan):\s*([^]*?)(?=PERBAIKAN|PENINGKATAN|$)/i,
        improvements: /(?:PERBAIKAN|PENINGKATAN|Perbaikan|Peningkatan):\s*([^]*?)(?=SARAN|REKOMENDASI|$)/i,
        suggestion: /(?:SARAN|REKOMENDASI|Saran|Rekomendasi):\s*([^]*?)$/i
      }
    };

    const langKeywords = keywords[language] || keywords.en;

    // Parse Score
    const scoreMatch = evaluation.match(langKeywords.score);
    if (scoreMatch) {
      const score = parseInt(scoreMatch[1], 10);
      if (!isNaN(score) && score >= 1 && score <= 10) {
        result.score = score;
      }
    }

    // Parse Strengths
    const strengthsMatch = evaluation.match(langKeywords.strengths);
    if (strengthsMatch) {
      const strengthsText = strengthsMatch[1].trim();
      if (strengthsText && strengthsText.length > 5) {
        result.strengths = strengthsText
          .split(/[;,\n]/)
          .map(s => s.trim())
          .filter(s => s.length > 3 && !s.match(/^[\d\s\-•]+$/))
          .slice(0, 3);
      }
    }

    // Parse Improvements
    const improvementsMatch = evaluation.match(langKeywords.improvements);
    if (improvementsMatch) {
      const improvementsText = improvementsMatch[1].trim();
      if (improvementsText && improvementsText.length > 5) {
        result.improvements = improvementsText
          .split(/[;,\n]/)
          .map(s => s.trim())
          .filter(s => s.length > 3 && !s.match(/^[\d\s\-•]+$/))
          .slice(0, 3);
      }
    }

    // Parse Suggestion
    const suggestionMatch = evaluation.match(langKeywords.suggestion);
    if (suggestionMatch) {
      const suggestion = suggestionMatch[1].trim();
      if (suggestion && suggestion.length > 5) {
        result.suggestion = suggestion;
      }
    }

    console.log('Strictly parsed result:', result);

    // Only return result if we have meaningful parsed data
    if (result.score !== null && result.strengths.length > 0 && result.improvements.length > 0) {
      return result;
    } else {
      console.warn('Evaluation parsing failed - API response does not contain proper evaluation format');
      return null;
    }
  }
}

export default new GeminiService();