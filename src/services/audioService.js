export class AudioService {
  constructor() {
    this.recognition = null;
    this.synthesis = window.speechSynthesis;
    this.isListening = false;
    this.currentLanguage = 'en-US';
    this.preferredVoice = null;
    this.voiceGender = 'female'; // default
    
    this.initializeSpeechRecognition();
    this.loadVoicePreferences();
  }

  initializeSpeechRecognition() {
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new window.webkitSpeechRecognition();
    } else if ('SpeechRecognition' in window) {
      this.recognition = new window.SpeechRecognition();
    }

    if (this.recognition) {
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.maxAlternatives = 1;
    }
  }

  loadVoicePreferences() {
    // Load voice preferences from localStorage
    const savedGender = localStorage.getItem('interview_voice_gender');
    if (savedGender) {
      this.voiceGender = savedGender;
    }
  }

  setVoiceGender(gender) {
    this.voiceGender = gender;
    localStorage.setItem('interview_voice_gender', gender);
    this.preferredVoice = null; // Reset to find new voice
  }

  setLanguage(language) {
    const languageMap = {
      'en': 'en-US',
      'id': 'id-ID'
    };
    
    this.currentLanguage = languageMap[language] || 'en-US';
    console.log(`Setting audio language to: ${this.currentLanguage} for language code: ${language}`);
    
    if (this.recognition) {
      this.recognition.lang = this.currentLanguage;
    }
    
    // Reset preferred voice when language changes
    this.preferredVoice = null;
  }

  findBestVoice(language) {
    const voices = this.synthesis.getVoices();
    console.log('Available voices:', voices.map(v => `${v.name} (${v.lang}) - ${v.gender || 'unknown'}`));
    
    let candidateVoices = [];
    
    if (language === 'en') {
      // English voice preferences with quality and natural-sounding criteria
      const englishVariants = ['en-US', 'en-GB', 'en-AU', 'en-CA'];
      
      // High-quality English voices (prioritize natural-sounding names)
      const preferredEnglishVoices = [
        // US English - Female
        'Samantha', 'Alex', 'Allison', 'Ava', 'Susan', 'Zoe', 'Microsoft Zira',
        // US English - Male  
        'Tom', 'Daniel', 'David', 'Microsoft David',
        // UK English - Female
        'Kate', 'Serena', 'Microsoft Hazel',
        // UK English - Male
        'Oliver', 'Microsoft George'
      ];
      
      // First, try to find voices by preferred names
      for (const voiceName of preferredEnglishVoices) {
        const voice = voices.find(v => 
          v.name.includes(voiceName) && 
          englishVariants.some(variant => v.lang.startsWith(variant))
        );
        if (voice) {
          const isPreferredGender = this.isVoiceGenderMatch(voice, this.voiceGender);
          candidateVoices.push({
            voice,
            priority: isPreferredGender ? 10 : 5,
            reason: `Preferred ${voiceName} voice`
          });
        }
      }
      
      // Then find by language and quality indicators
      voices.forEach(voice => {
        if (englishVariants.some(variant => voice.lang.startsWith(variant))) {
          const isPreferredGender = this.isVoiceGenderMatch(voice, this.voiceGender);
          const isHighQuality = this.isHighQualityVoice(voice);
          
          let priority = 1;
          if (isPreferredGender) priority += 3;
          if (isHighQuality) priority += 2;
          if (voice.lang === 'en-US') priority += 1;
          
          candidateVoices.push({
            voice,
            priority,
            reason: `${voice.name} (${voice.lang})`
          });
        }
      });
    } 
    else if (language === 'id') {
      // Indonesian voice preferences
      const indonesianVariants = ['id-ID', 'id'];
      
      // Preferred Indonesian voices
      const preferredIndonesianVoices = [
        'Damayanti', 'Andika', 'Microsoft Andika'
      ];
      
      // First, try preferred names
      for (const voiceName of preferredIndonesianVoices) {
        const voice = voices.find(v => 
          v.name.includes(voiceName) && 
          indonesianVariants.some(variant => v.lang.startsWith(variant))
        );
        if (voice) {
          const isPreferredGender = this.isVoiceGenderMatch(voice, this.voiceGender);
          candidateVoices.push({
            voice,
            priority: isPreferredGender ? 10 : 7,
            reason: `Preferred Indonesian voice: ${voiceName}`
          });
        }
      }
      
      // Then find any Indonesian voices
      voices.forEach(voice => {
        if (indonesianVariants.some(variant => voice.lang.startsWith(variant))) {
          const isPreferredGender = this.isVoiceGenderMatch(voice, this.voiceGender);
          const isHighQuality = this.isHighQualityVoice(voice);
          
          let priority = 1;
          if (isPreferredGender) priority += 3;
          if (isHighQuality) priority += 2;
          
          candidateVoices.push({
            voice,
            priority,
            reason: `Indonesian voice: ${voice.name}`
          });
        }
      });
    }
    
    // Sort by priority and return the best voice
    candidateVoices.sort((a, b) => b.priority - a.priority);
    
    if (candidateVoices.length > 0) {
      const bestVoice = candidateVoices[0];
      console.log(`Selected voice: ${bestVoice.voice.name} (${bestVoice.voice.lang}) - Priority: ${bestVoice.priority}, Reason: ${bestVoice.reason}`);
      return bestVoice.voice;
    }
    
    console.warn(`No suitable voice found for language ${language}`);
    return null;
  }

  isVoiceGenderMatch(voice, preferredGender) {
    // Check voice name patterns for gender indication
    const femalePatterns = [
      'samantha', 'allison', 'ava', 'susan', 'zoe', 'zira', 'kate', 'serena', 'hazel',
      'damayanti', 'sari', 'female', 'woman'
    ];
    
    const malePatterns = [
      'tom', 'daniel', 'david', 'oliver', 'george', 'andika', 'male', 'man'
    ];
    
    const voiceName = voice.name.toLowerCase();
    
    if (preferredGender === 'female') {
      return femalePatterns.some(pattern => voiceName.includes(pattern));
    } else if (preferredGender === 'male') {
      return malePatterns.some(pattern => voiceName.includes(pattern));
    }
    
    return true; // If no preference or can't determine, consider it a match
  }

  isHighQualityVoice(voice) {
    // Indicators of high-quality voices
    const highQualityIndicators = [
      'premium', 'enhanced', 'neural', 'natural', 'microsoft', 'google', 'apple'
    ];
    
    const voiceName = voice.name.toLowerCase();
    return highQualityIndicators.some(indicator => voiceName.includes(indicator));
  }

  speak(text, language = 'en') {
    return new Promise((resolve, reject) => {
      if (!this.synthesis) {
        reject(new Error('Speech synthesis not supported'));
        return;
      }

      // Stop any ongoing speech
      this.synthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      
      console.log(`Speaking in ${language} with ${this.voiceGender} voice preference`);
      
      // Wait for voices to load if needed
      const setVoiceAndSpeak = () => {
        // Find or use cached voice
        if (!this.preferredVoice) {
          this.preferredVoice = this.findBestVoice(language);
        }
        
        if (this.preferredVoice) {
          utterance.voice = this.preferredVoice;
          console.log(`Using voice: ${this.preferredVoice.name} (${this.preferredVoice.lang})`);
        } else {
          console.warn(`No suitable voice found for ${language}, using default`);
        }

        // Set speech parameters based on language
        if (language === 'id') {
          utterance.rate = 0.85; // Slightly slower for Indonesian
          utterance.pitch = 1.0;
        } else {
          utterance.rate = 0.9; // Good pace for English
          utterance.pitch = 1.0;
        }
        
        utterance.volume = 1;
        utterance.lang = this.currentLanguage;

        // Add event handlers
        utterance.onstart = () => {
          console.log(`Started speaking in ${language}: "${text.substring(0, 50)}..."`);
        };

        utterance.onend = () => {
          console.log(`Finished speaking in ${language}`);
          resolve();
        };
        
        utterance.onerror = (event) => {
          console.error('Speech synthesis error:', event.error, 'for language:', language);
          reject(new Error(`Speech synthesis error: ${event.error}`));
        };

        // Start speaking
        this.synthesis.speak(utterance);
      };

      // Check if voices are already loaded
      if (this.synthesis.getVoices().length > 0) {
        setVoiceAndSpeak();
      } else {
        // Wait for voices to load
        let voicesLoaded = false;
        
        const onVoicesChanged = () => {
          if (!voicesLoaded && this.synthesis.getVoices().length > 0) {
            voicesLoaded = true;
            console.log('Voices loaded, proceeding with speech...');
            setVoiceAndSpeak();
          }
        };

        this.synthesis.addEventListener('voiceschanged', onVoicesChanged);
        
        // Fallback timeout
        setTimeout(() => {
          if (!voicesLoaded) {
            console.warn('Voices loading timeout, proceeding with available voices');
            voicesLoaded = true;
            this.synthesis.removeEventListener('voiceschanged', onVoicesChanged);
            setVoiceAndSpeak();
          }
        }, 2000);
      }
    });
  }

  getAvailableVoices(language) {
    const voices = this.synthesis.getVoices();
    const targetLang = language === 'en' ? 'en' : 'id';
    
    return voices
      .filter(voice => voice.lang.startsWith(targetLang))
      .map(voice => ({
        name: voice.name,
        lang: voice.lang,
        gender: this.detectVoiceGender(voice),
        isPreferred: this.isHighQualityVoice(voice)
      }));
  }

  detectVoiceGender(voice) {
    const voiceName = voice.name.toLowerCase();
    
    if (this.isVoiceGenderMatch(voice, 'female')) {
      return 'female';
    } else if (this.isVoiceGenderMatch(voice, 'male')) {
      return 'male';
    }
    
    return 'unknown';
  }

  isSupported() {
    return !!(this.recognition && this.synthesis);
  }

  getIsListening() {
    return this.isListening;
  }

  async startListeningWithTranscript(onInterimResult, onFinalResult) {
    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        reject(new Error('Speech recognition not supported'));
        return;
      }

      if (this.isListening) {
        reject(new Error('Already listening'));
        return;
      }

      this.isListening = true;
      
      // Enable interim results for real-time transcription
      this.recognition.interimResults = true;
      this.recognition.continuous = true;
      
      // Set language explicitly
      console.log(`Setting recognition language to: ${this.currentLanguage} for language: ${this.currentLanguage}`);
      this.recognition.lang = this.currentLanguage;
      
      let finalTranscript = '';
      
      this.recognition.onresult = (event) => {
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
            onFinalResult(transcript);
          } else {
            interimTranscript += transcript;
          }
        }
        
        if (interimTranscript) {
          onInterimResult(interimTranscript);
        }
      };

      this.recognition.onend = () => {
        this.isListening = false;
        // Reset to original settings
        this.recognition.interimResults = false;
        this.recognition.continuous = false;
        resolve(finalTranscript);
      };

      this.recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error, 'for language:', this.currentLanguage);
        this.isListening = false;
        // Reset to original settings
        this.recognition.interimResults = false;
        this.recognition.continuous = false;
        
        // Provide helpful error messages for specific languages
        if (this.currentLanguage.startsWith('ar') && (event.error === 'language-not-supported' || event.error === 'no-speech')) {
          reject(new Error('Arabic speech recognition may not be fully supported in this browser. Please type your answer instead.'));
        } else if (this.currentLanguage.startsWith('zh') && event.error === 'language-not-supported') {
          reject(new Error('Chinese speech recognition may not be supported. Please type your answer instead.'));
        } else {
          reject(new Error(`Speech recognition error: ${event.error}`));
        }
      };

      try {
        this.recognition.start();
      } catch (error) {
        this.isListening = false;
        console.error('Failed to start recognition:', error);
        reject(error);
      }
    });
  }

  async startListening() {
    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        reject(new Error('Speech recognition not supported'));
        return;
      }

      if (this.isListening) {
        reject(new Error('Already listening'));
        return;
      }

      this.isListening = true;
      
      this.recognition.onresult = (event) => {
        const result = event.results[0][0].transcript;
        this.isListening = false;
        resolve(result);
      };

      this.recognition.onerror = (event) => {
        this.isListening = false;
        reject(new Error(`Speech recognition error: ${event.error}`));
      };

      this.recognition.onend = () => {
        this.isListening = false;
      };

      try {
        this.recognition.start();
      } catch (error) {
        this.isListening = false;
        reject(error);
      }
    });
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  stopSpeaking() {
    if (this.synthesis) {
      this.synthesis.cancel();
    }
  }
}

export default new AudioService();
