export class AudioService {
  constructor() {
    this.recognition = null;
    this.synthesis = window.speechSynthesis;
    this.isListening = false;
    this.currentLanguage = 'en-US';
    
    this.initializeSpeechRecognition();
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

  setLanguage(language) {
    const languageMap = {
      'en': 'en-US',
      'id': 'id-ID', 
      'zh': 'zh-CN',
      'ja': 'ja-JP',
      'ar': 'ar-SA'
    };
    
    this.currentLanguage = languageMap[language] || 'en-US';
    console.log(`Setting audio language to: ${this.currentLanguage} for language code: ${language}`);
    
    if (this.recognition) {
      this.recognition.lang = this.currentLanguage;
    }
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

  speak(text, language = 'en') {
    return new Promise((resolve, reject) => {
      if (!this.synthesis) {
        reject(new Error('Speech synthesis not supported'));
        return;
      }

      // Stop any ongoing speech
      this.synthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set voice based on language with better fallback
      const targetLang = this.getVoiceLanguage(language);
      console.log(`Looking for voice for language: ${targetLang}, original language: ${language}`);
      
      // Wait for voices to load if needed
      const setVoiceAndSpeak = () => {
        const voices = this.synthesis.getVoices();
        console.log('Available voices:', voices.map(v => `${v.name} (${v.lang})`));
        
        let voice = null;
        
        // Special handling for Arabic
        if (language === 'ar') {
          // Try multiple Arabic variants in order of preference
          const arabicVariants = [
            'ar-SA', 'ar-EG', 'ar-AE', 'ar-MA', 'ar-JO', 'ar-LB', 'ar-SY', 'ar-IQ', 'ar-KW', 'ar'
          ];
          
          for (const variant of arabicVariants) {
            voice = voices.find(v => 
              v.lang === variant || 
              v.lang.startsWith(variant) ||
              (v.name.toLowerCase().includes('arabic') && v.lang.startsWith('ar'))
            );
            if (voice) {
              console.log(`Found Arabic voice: ${voice.name} (${voice.lang})`);
              break;
            }
          }
          
          // If still no Arabic voice found, try any voice with 'arabic' in name
          if (!voice) {
            voice = voices.find(v => 
              v.name.toLowerCase().includes('arabic') ||
              v.name.toLowerCase().includes('عربي') ||
              v.lang.includes('ar')
            );
          }
        }
        // Special handling for Chinese
        else if (language === 'zh') {
          const chineseVariants = [
            'zh-CN', 'zh-TW', 'zh-HK', 'zh-SG', 'zh'
          ];
          
          for (const variant of chineseVariants) {
            voice = voices.find(v => 
              v.lang === variant || 
              v.lang.startsWith(variant) ||
              (v.name.toLowerCase().includes('chinese') && v.lang.startsWith('zh'))
            );
            if (voice) break;
          }
        }
        // Special handling for Japanese
        else if (language === 'ja') {
          voice = voices.find(v => 
            v.lang === 'ja-JP' || 
            v.lang.startsWith('ja') ||
            v.name.toLowerCase().includes('japanese')
          );
        }
        // Regular handling for other languages
        else {
          // Try exact match first
          voice = voices.find(v => v.lang === targetLang);
          
          // If no exact match, try language prefix match
          if (!voice && targetLang.includes('-')) {
            const langPrefix = targetLang.split('-')[0];
            voice = voices.find(v => v.lang.startsWith(langPrefix));
          }
        }
        
        if (voice) {
          utterance.voice = voice;
          console.log(`Using voice: ${voice.name} (${voice.lang}) for language: ${language}`);
        } else {
          console.warn(`No voice found for language ${targetLang}, using default. Available voices:`, voices.map(v => v.lang));
        }

        // Set speech parameters
        utterance.rate = language === 'ar' ? 0.8 : 0.9; // Slower for Arabic
        utterance.pitch = 1;
        utterance.volume = 1;
        utterance.lang = targetLang; // Set language explicitly

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
          
          // If Arabic fails, try with fallback settings
          if (language === 'ar' && event.error === 'language-not-supported') {
            console.log('Retrying Arabic speech with fallback voice...');
            const fallbackUtterance = new SpeechSynthesisUtterance(text);
            fallbackUtterance.rate = 0.8;
            fallbackUtterance.pitch = 1;
            fallbackUtterance.volume = 1;
            // Don't set specific voice, let browser choose
            fallbackUtterance.onend = () => resolve();
            fallbackUtterance.onerror = () => reject(new Error(`Speech synthesis failed for Arabic: ${event.error}`));
            
            this.synthesis.speak(fallbackUtterance);
          } else {
            reject(new Error(`Speech synthesis error: ${event.error}`));
          }
        };

        // Start speaking
        this.synthesis.speak(utterance);
        
        // Fallback timeout for Arabic
        if (language === 'ar') {
          setTimeout(() => {
            if (this.synthesis.speaking) {
              console.log('Arabic speech timeout, resolving anyway...');
              resolve();
            }
          }, Math.max(text.length * 100, 3000)); // Minimum 3 seconds
        }
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

  getVoiceLanguage(language) {
    const voiceMap = {
      'en': 'en-US',
      'id': 'id-ID',
      'zh': 'zh-CN', 
      'ja': 'ja-JP',
      'ar': 'ar-SA'
    };
    return voiceMap[language] || 'en-US';
  }

  stopSpeaking() {
    if (this.synthesis) {
      this.synthesis.cancel();
    }
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
}

export default new AudioService();
