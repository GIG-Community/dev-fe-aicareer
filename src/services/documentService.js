import convertApiService from './api/convertApiService';

export class DocumentService {
  constructor() {
    this.uploadedDocuments = [];
    this.parsedContent = null;
    this.documentChunks = [];
    this.vectorStore = new Map();
    this.pdfParserLoaded = false;
    this.tesseractLoaded = false;
    this.convertApiLoaded = false;
    this.loadPDFParser();
    this.loadTesseract();
    this.loadConvertApi();
    // Define common words to filter out from keywords
    this.commonWords = [
      'the', 'and', 'that', 'have', 'for', 'not', 'with', 'you', 'this', 'but',
      'his', 'from', 'they', 'she', 'will', 'one', 'all', 'would', 'there', 'their',
      'what', 'out', 'about', 'who', 'get', 'which', 'when', 'make', 'can', 'like',
      'time', 'just', 'him', 'know', 'take', 'person', 'into', 'year', 'your', 'good',
      'some', 'could', 'them', 'see', 'other', 'than', 'then', 'now', 'look', 'only',
      'come', 'its', 'over', 'think', 'also', 'back', 'after', 'use', 'two', 'how',
      'our', 'work', 'first', 'well', 'way', 'even', 'new', 'want', 'because', 'any',
      'these', 'give', 'day', 'most', 'was', 'were', 'been', 'has', 'had', 'are', 'such',
      'more', 'doing', 'done', 'very', 'many'
    ];
  }

  // Load PDF parser library dynamically
  async loadPDFParser() {
    try {
      // Load PDF.js library from CDN
      if (!window.pdfjsLib) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js';
        script.onload = () => {
          // Set worker path
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js';
          this.pdfParserLoaded = true;
          console.log('PDF.js library loaded successfully');
        };
        script.onerror = () => {
          console.error('Failed to load PDF.js library');
        };
        document.head.appendChild(script);
      } else {
        this.pdfParserLoaded = true;
      }
    } catch (error) {
      console.error('Error loading PDF parser:', error);
    }
  }

  // Load Tesseract.js for OCR
  async loadTesseract() {
    try {
      if (!window.Tesseract) {
        // Load Tesseract.js from CDN
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@4/dist/tesseract.min.js';
        script.onload = () => {
          this.tesseractLoaded = true;
          console.log('Tesseract.js library loaded successfully');
        };
        script.onerror = () => {
          console.error('Failed to load Tesseract.js library');
        };
        document.head.appendChild(script);
      } else {
        this.tesseractLoaded = true;
      }
    } catch (error) {
      console.error('Error loading Tesseract:', error);
    }
  }

  // Load ConvertAPI library dynamically
  async loadConvertApi() {
    try {
      // Hard code the API key directly to avoid any undefined issues
      const API_KEY = 'a1U7Ae2pceF7PjUxi1VB4U7UF1ijZxba';
      
      if (!window.ConvertApi) {
        console.log('Loading ConvertAPI from CDN...');
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/convertapi-js/lib/convertapi.js';
        script.onload = () => {
          this.convertApiLoaded = true;
          console.log('ConvertAPI library loaded successfully');
          // Initialize ConvertAPI with the API key directly
          if (window.ConvertApi && window.ConvertApi.auth) {
            this.convertApi = window.ConvertApi.auth(API_KEY);
            console.log('ConvertAPI initialized with key:', API_KEY.substring(0, 5) + '...');
          } else {
            console.error('ConvertAPI loaded but auth method not found');
          }
        };
        script.onerror = () => {
          console.error('Failed to load ConvertAPI library');
        };
        document.head.appendChild(script);
      } else {
        this.convertApiLoaded = true;
        // Initialize ConvertAPI with the API key directly
        if (window.ConvertApi && window.ConvertApi.auth) {
          this.convertApi = window.ConvertApi.auth(API_KEY);
          console.log('ConvertAPI initialized with key (already loaded):', API_KEY.substring(0, 5) + '...');
        } else {
          console.error('ConvertAPI already loaded but auth method not found');
        }
      }
    } catch (error) {
      console.error('Error loading ConvertAPI:', error);
    }
  }

  async uploadDocument(file) {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error('No file provided'));
        return;
      }

      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'image/jpeg',
        'image/png',
        'image/jpg'
      ];

      if (!allowedTypes.includes(file.type)) {
        reject(new Error('File type not supported. Please upload PDF, DOC, DOCX, TXT, or image files.'));
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        reject(new Error('File size must be less than 10MB'));
        return;
      }

      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          let content = '';
          let processingMessage = '';
          
          if (file.type === 'text/plain') {
            content = e.target.result;
          } else if (file.type.startsWith('image/')) {
            processingMessage = 'Processing image with OCR...';
            content = await this.handleImageFile(file, e.target.result);
          } else if (file.type === 'application/pdf') {
            processingMessage = 'Converting PDF to text...';
            
            // Try multiple methods in sequence with better error handling
            try {
              console.log('Attempting ConvertAPI PDF conversion...');
              content = await this.convertPdfToTextWithConvertApi(file);
              processingMessage += ' (using ConvertAPI)';
            } catch (convertError) {
              console.warn('ConvertAPI PDF conversion failed, trying PDF.js extraction:', convertError);
              
              try {
                console.log('Attempting PDF.js extraction...');
                content = await this.extractTextFromPDF(e.target.result);
                processingMessage += ' (using PDF.js)';
              } catch (pdfError) {
                console.warn('PDF.js extraction failed, trying OCR:', pdfError);
                
                try {
                  console.log('Attempting OCR extraction...');
                  content = await this.extractTextFromPDFWithOCR(e.target.result, file.name);
                  processingMessage += ' (using OCR)';
                } catch (ocrError) {
                  console.warn('All PDF extraction methods failed, using fallback:', ocrError);
                  content = await this.extractTextFallback(file);
                  processingMessage += ' (basic extraction)';
                }
              }
            }
          } else if (file.type.includes('word')) {
            processingMessage = 'Converting document to text...';
            try {
              content = await this.convertDocToTextWithConvertApi(file);
              processingMessage += ' (using ConvertAPI)';
            } catch (docError) {
              console.warn('Word document conversion failed:', docError);
              content = await this.extractTextFallback(file);
              processingMessage += ' (basic extraction)';
            }
          } else {
            // Try to convert as text
            const decoder = new TextDecoder('utf-8');
            content = decoder.decode(e.target.result);
          }

          // Validate extracted content
          if (!content || content.trim().length < 20) {
            content = `[Document: ${file.name}]\n\nNo meaningful text could be extracted from this file. Please try uploading a text version or a clearer document.`;
            processingMessage += ' (limited content extracted)';
          }

          const document = {
            id: Date.now() + Math.random(),
            name: file.name,
            type: file.type,
            size: file.size,
            content: content,
            uploadedAt: new Date().toISOString(),
            chunks: [],
            processingMethod: processingMessage
          };

          // Process document for RAG
          await this.processDocumentForRAG(document);

          this.uploadedDocuments.push(document);
          resolve(document);
        } catch (error) {
          console.error('Document processing error:', error);
          reject(error);
        }
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      // Read file based on type
      if (file.type === 'text/plain') {
        reader.readAsText(file);
      } else {
        reader.readAsArrayBuffer(file);
      }
    });
  }

  // New method to convert PDF to text using ConvertAPI
  async convertPdfToTextWithConvertApi(file) {
    try {
      // Use the direct API service instead of the library
      const textContent = await convertApiService.convertPdfToText(file);
      
      if (!textContent || textContent.trim().length < 50) {
        throw new Error('Could not extract sufficient text from the PDF');
      }
      
      return textContent;
    } catch (error) {
      console.error('ConvertAPI PDF conversion error:', error);
      throw new Error(`ConvertAPI PDF conversion failed: ${error.message}. Falling back to other methods.`);
    }
  }
  
  // New method to convert DOC/DOCX to text using ConvertAPI
  async convertDocToTextWithConvertApi(file) {
    try {
      // Use the direct API service instead of the library
      const textContent = await convertApiService.convertDocToText(file);
      
      if (!textContent || textContent.trim().length < 50) {
        throw new Error('Could not extract sufficient text from the document');
      }
      
      return textContent;
    } catch (error) {
      console.error('ConvertAPI document conversion error:', error);
      throw new Error(`ConvertAPI document conversion failed: ${error.message}. Falling back to other methods.`);
    }
  }

  async extractTextFromPDF(arrayBuffer) {
    try {
      if (!this.pdfParserLoaded || !window.pdfjsLib) {
        // Fallback: Wait a bit and try again
        await new Promise(resolve => setTimeout(resolve, 2000));
        if (!window.pdfjsLib) {
          throw new Error('PDF parser not available. Please try uploading a TXT file instead.');
        }
      }

      console.log('Starting PDF text extraction...');
      
      // Load PDF document
      const pdf = await window.pdfjsLib.getDocument({
        data: arrayBuffer,
        verbosity: 0 // Reduce console logs
      }).promise;

      console.log(`PDF loaded successfully. Pages: ${pdf.numPages}`);
      
      let fullText = '';
      const maxPages = Math.min(pdf.numPages, 20); // Limit to first 20 pages for performance

      // Extract text from each page
      for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
        try {
          const page = await pdf.getPage(pageNum);
          const textContent = await page.getTextContent();
          
          // Combine text items into readable text
          const pageText = textContent.items
            .map(item => item.str)
            .join(' ')
            .replace(/\s+/g, ' ') // Clean up multiple spaces
            .trim();
          
          if (pageText.length > 0) {
            fullText += pageText + '\n\n';
          }
          
          console.log(`Extracted text from page ${pageNum}: ${pageText.length} characters`);
        } catch (pageError) {
          console.warn(`Error extracting text from page ${pageNum}:`, pageError);
          continue; // Skip problematic pages
        }
      }

      if (pdf.numPages > 20) {
        fullText += `\n[Note: Only first 20 pages were processed out of ${pdf.numPages} total pages]`;
      }

      // Clean up the extracted text
      fullText = this.cleanExtractedText(fullText);
      
      if (!fullText || fullText.trim().length < 50) {
        throw new Error('PDF appears to be empty or contains mostly images/scanned content. Please try uploading a text-based PDF or convert it to TXT format.');
      }

      console.log(`PDF text extraction completed. Total characters: ${fullText.length}`);
      return fullText;

    } catch (error) {
      console.error('PDF extraction error:', error);
      throw new Error(`Failed to extract text from PDF: ${error.message}. Please try converting the PDF to TXT format first.`);
    }
  }

  // New method for OCR on PDFs
  async extractTextFromPDFWithOCR(arrayBuffer, fileName) {
    if (!this.pdfParserLoaded || !window.pdfjsLib) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      if (!window.pdfjsLib) {
        throw new Error('PDF parser not available for OCR processing.');
      }
    }
    
    if (!this.tesseractLoaded || !window.Tesseract) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      if (!window.Tesseract) {
        throw new Error('OCR capabilities not available. Please try uploading a TXT file instead.');
      }
    }

    console.log('Starting PDF OCR extraction...');
    
    try {
      // Load PDF document
      const pdf = await window.pdfjsLib.getDocument({
        data: arrayBuffer,
        verbosity: 0
      }).promise;
      
      console.log(`PDF loaded for OCR. Pages: ${pdf.numPages}`);
      
      let fullText = '';
      const maxPages = Math.min(pdf.numPages, 5); // Limit OCR to first 5 pages for performance
      
      // Process each page with OCR
      for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
        try {
          console.log(`Processing page ${pageNum} with OCR...`);
          
          // Render PDF page to canvas
          const page = await pdf.getPage(pageNum);
          const viewport = page.getViewport({ scale: 1.5 }); // Higher scale for better OCR
          
          // Create canvas
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          
          // Render PDF page to canvas
          await page.render({
            canvasContext: ctx,
            viewport: viewport
          }).promise;
          
          // Convert canvas to image data URL
          const imageData = canvas.toDataURL('image/png');
          
          // Perform OCR on the image
          const result = await window.Tesseract.recognize(
            imageData,
            'eng', // Language
            { 
              logger: m => console.log(`OCR status: ${m.status} (${Math.round(m.progress * 100)}%)`) 
            }
          );
          
          const pageText = result.data.text;
          console.log(`OCR extracted ${pageText.length} characters from page ${pageNum}`);
          
          if (pageText.length > 0) {
            fullText += pageText + '\n\n';
          }
          
        } catch (pageError) {
          console.warn(`Error processing page ${pageNum} with OCR:`, pageError);
          continue; // Skip problematic pages
        }
      }
      
      if (pdf.numPages > maxPages) {
        fullText += `\n[Note: Only first ${maxPages} pages were processed with OCR out of ${pdf.numPages} total pages]`;
      }
      
      // Clean up the extracted text
      fullText = this.cleanExtractedText(fullText);
      
      if (!fullText || fullText.trim().length < 50) {
        throw new Error('OCR could not extract sufficient text from the PDF. The document might be of poor quality or contain mostly images.');
      }
      
      console.log(`PDF OCR extraction completed. Total characters: ${fullText.length}`);
      return fullText;
      
    } catch (error) {
      console.error('PDF OCR extraction error:', error);
      throw new Error(`Failed to extract text from PDF using OCR: ${error.message}. Please try a clearer PDF or convert to text.`);
    }
  }

  async extractTextFromWord(file, arrayBuffer) {
    try {
      // For Word documents, we'll provide a helpful error message
      throw new Error(`Word document parsing not yet implemented. Please save "${file.name}" as a TXT file and upload that instead.`);
    } catch (error) {
      throw error;
    }
  }

  async handleImageFile(file, arrayBuffer) {
    try {
      if (!this.tesseractLoaded || !window.Tesseract) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        if (!window.Tesseract) {
          return `[Image File: ${file.name}] - OCR not available. Please convert to text.`;
        }
      }
      
      console.log(`Starting OCR on image: ${file.name}`);
      
      // Convert ArrayBuffer to Blob for Tesseract
      const blob = new Blob([arrayBuffer], { type: file.type });
      const imageUrl = URL.createObjectURL(blob);
      
      // Perform OCR on the image
      const result = await window.Tesseract.recognize(
        imageUrl,
        'eng', // Language
        { 
          logger: m => console.log(`OCR status: ${m.status} (${Math.round(m.progress * 100)}%)`) 
        }
      );
      
      // Release the object URL
      URL.revokeObjectURL(imageUrl);
      
      const extractedText = result.data.text;
      console.log(`OCR extracted ${extractedText.length} characters from image`);
      
      if (!extractedText || extractedText.trim().length < 20) {
        return `[Image File: ${file.name}]\n\nOCR attempted but extracted minimal text. The image might not contain clear text content. Consider uploading a clearer image or a text file.`;
      }
      
      return extractedText;
      
    } catch (error) {
      console.error('Image OCR error:', error);
      return `[Image File: ${file.name}]\n\nOCR processing failed: ${error.message}. Please try a clearer image or upload text directly.`;
    }
  }

  cleanExtractedText(text) {
    return text
      // Remove excessive whitespace
      .replace(/\s+/g, ' ')
      // Remove page numbers and common PDF artifacts
      .replace(/Page \d+/gi, '')
      .replace(/^\d+\s*$/gm, '') // Remove standalone numbers
      // Clean up common PDF extraction issues
      .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space between camelCase
      .replace(/\.\s*([a-z])/g, '. $1') // Fix sentence spacing
      // Remove empty lines
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('\n')
      .trim();
  }

  async processDocumentForRAG(document) {
    try {
      // Validate document content first
      if (!document.content || document.content.trim().length < 50) {
        throw new Error('Document content is too short or empty');
      }

      // Log document statistics
      console.log(`Processing document: ${document.name}`);
      console.log(`Content length: ${document.content.length} characters`);
      console.log(`Content preview: ${document.content.substring(0, 200)}...`);

      // Split document content into chunks for better retrieval
      const chunks = this.chunkDocument(document.content, 300);
      
      if (chunks.length === 0) {
        throw new Error('Failed to create chunks from document content');
      }
      
      // Create embeddings for each chunk
      const processedChunks = chunks.map((chunk, index) => ({
        id: `${document.id}_chunk_${index}`,
        documentId: document.id,
        content: chunk,
        embedding: this.createSimpleEmbedding(chunk),
        keywords: this.extractKeywords(chunk),
        section: this.identifySection(chunk)
      }));

      document.chunks = processedChunks;
      this.documentChunks.push(...processedChunks);
      
      // Store in vector store for retrieval
      processedChunks.forEach(chunk => {
        this.vectorStore.set(chunk.id, chunk);
      });

      console.log(`Processed ${processedChunks.length} chunks from ${document.name}`);

      // Log section analysis
      const sections = {};
      processedChunks.forEach(chunk => {
        sections[chunk.section] = (sections[chunk.section] || 0) + 1;
      });
      console.log('Document sections found:', sections);

    } catch (error) {
      console.error('Error processing document for RAG:', error);
      throw error;
    }
  }

  chunkDocument(content, chunkSize = 300) {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const chunks = [];
    let currentChunk = '';

    for (const sentence of sentences) {
      if (currentChunk.length + sentence.length > chunkSize && currentChunk.length > 0) {
        chunks.push(currentChunk.trim());
        currentChunk = sentence.trim();
      } else {
        currentChunk += (currentChunk ? '. ' : '') + sentence.trim();
      }
    }

    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim());
    }

    return chunks;
  }

  createSimpleEmbedding(text) {
    // Simplified embedding using character frequency and keywords
    const words = text.toLowerCase().split(/\s+/);
    const wordFreq = {};
    
    words.forEach(word => {
      const cleanWord = word.replace(/[^a-z0-9]/g, '');
      if (cleanWord.length > 2) {
        wordFreq[cleanWord] = (wordFreq[cleanWord] || 0) + 1;
      }
    });

    // Create a simple vector based on important keywords
    const importantKeywords = [
      'experience', 'skills', 'education', 'project', 'work', 'developer', 'engineer',
      'manage', 'lead', 'team', 'technical', 'programming', 'software', 'application',
      'database', 'api', 'frontend', 'backend', 'fullstack', 'agile', 'scrum'
    ];

    const vector = importantKeywords.map(keyword => wordFreq[keyword] || 0);
    return vector;
  }

  // Updated to extract actual words from the text instead of using predefined keywords
  extractKeywords(text) {
    if (!text || typeof text !== 'string') {
      console.warn('Invalid text provided to extractKeywords:', text);
      return [];
    }
    
    const lowerText = text.toLowerCase();
    
    // Extract actual words that appear to be technical terms or skills
    // Start by splitting into words and cleaning them
    const words = lowerText
      .replace(/[^\w\s.-]/g, ' ')  // Replace non-word chars except dots, hyphens
      .split(/\s+/)                // Split by whitespace
      .filter(word => word.length > 2)  // Keep only words longer than 2 chars
      .filter(word => !this.commonWords.includes(word)); // Remove common English words
      
    // Count word frequencies
    const wordFreq = {};
    words.forEach(word => {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    });
    
    // Find terms that appear multiple times and seem to be technical terms
    return Object.entries(wordFreq)
      .filter(([word, count]) => {
        // Likely a technical term if:
        // 1. It appears multiple times
        // 2. Contains digits or special characters that suggest technical term
        // 3. Is in camelCase or has periods/hyphens
        return count >= 2 || 
               /\d/.test(word) ||  // Contains digits
               /[A-Z]/.test(word) ||  // Contains uppercase (possible camelCase)
               /[.-]/.test(word);     // Contains dots or hyphens
      })
      .sort((a, b) => b[1] - a[1])  // Sort by frequency, most frequent first
      .slice(0, 20)                 // Take top 20
      .map(([word]) => word);       // Extract just the word
  }

  // Improved section identification that doesn't rely on keywords
  identifySection(text) {
    if (!text || typeof text !== 'string') {
      return 'general';
    }
    
    const lowerText = text.toLowerCase();
    
    // Check for section headers - look for patterns that appear to be section headers
    if (/\b(education|university|college|degree|bachelor|master|phd)\b/.test(lowerText)) {
      // Count education-related terms to ensure it's really about education
      const educationTerms = ['education', 'university', 'college', 'degree', 'bachelor', 'master', 'phd', 'school'];
      const count = educationTerms.reduce((acc, term) => 
        acc + (lowerText.includes(term) ? 1 : 0), 0);
      
      if (count >= 2) return 'education';
    }
    
    if (/\b(work experience|professional experience|employment history|work history)\b/.test(lowerText) ||
        /\b(20\d\d\s*-\s*(20\d\d|present))\b/.test(lowerText)) { // Date ranges like 2015-2020
      return 'experience';
    }
    
    if (/\b(skills|technical skills|proficiencies|technologies|tools)\b/.test(lowerText)) {
      return 'skills';
    }
    
    if (/\b(projects|project experience|key projects)\b/.test(lowerText)) {
      return 'projects';
    }
    
    if (/\b(certification|certified|license|accreditation)\b/.test(lowerText)) {
      return 'certifications';
    }
    
    if (/\b(summary|profile|objective|professional summary|about me)\b/.test(lowerText) && 
        lowerText.length < 500) { // Summaries are usually short
      return 'summary';
    }
    
    if (/\b(achievements|awards|honors|recognition)\b/.test(lowerText)) {
      return 'achievements';
    }
    
    if (/\b(contact|email|phone|address|linkedin|github)\b/.test(lowerText) && 
        /\b(@|www\.|http|\.com|\.org)\b/.test(lowerText)) { // Contains web or email indicators
      return 'contact';
    }
    
    // Try to detect sections based on content structure and patterns
    if (/\b(20\d\d\s*-\s*(20\d\d|present|current))\b/.test(lowerText) && 
        /\b(worked|managed|developed|led|responsible|duties)\b/.test(lowerText)) {
      return 'experience';
    }
    
    // Look for lists of technologies which might indicate skills
    if (/(•|\*|-|,)\s*(javascript|python|java|html|css|react|sql|aws|azure|docker)\b/i.test(lowerText)) {
      return 'skills';
    }
    
    return 'general';
  }

  // Extract skills from the document
  extractSkillsEnhanced() {
    // First, find chunks specifically marked as 'skills' section
    const skillsSectionChunks = this.documentChunks.filter(chunk => chunk.section === 'skills');
    
    // If we have dedicated skills sections, extract from there
    if (skillsSectionChunks.length > 0) {
      console.log(`Found ${skillsSectionChunks.length} dedicated skills sections`);
      
      // Extract all words from skills sections, removing common words
      const allSkillsText = skillsSectionChunks.map(chunk => chunk.content).join(' ');
      
      // Find skill patterns - skills are often separated by commas, bullets, or appear in lists
      const skillPatterns = allSkillsText.match(/[•\-*]?\s*([A-ZaZ0-9#\+\.\-/]+(?:\s+[A-ZaZ0-9#\+\.\-/]+){0,2})[,•\-*]/g) || [];
      
      // Clean up the extracted skills
      const extractedSkills = skillPatterns.map(skill => 
        skill.replace(/[•\-*,]/g, '').trim()
      ).filter(skill => 
        skill.length > 2 && !this.commonWords.includes(skill.toLowerCase())
      );
      
      // Deduplicate
      const uniqueSkills = [...new Set(extractedSkills)];
      console.log('Extracted skills from dedicated skills sections:', uniqueSkills);
      
      if (uniqueSkills.length > 0) {
        return uniqueSkills;
      }
    }
    
    // As a fallback, try to identify skills from the keywords found across all chunks
    console.log('No dedicated skills section found, extracting skills from all content');
    
    // Gather all keywords from all chunks
    const allKeywords = this.documentChunks.flatMap(chunk => chunk.keywords);
    
    // Count occurrences of each keyword
    const keywordFreq = {};
    allKeywords.forEach(keyword => {
      keywordFreq[keyword] = (keywordFreq[keyword] || 0) + 1;
    });
    
    // Sort by frequency and select the most common ones
    const skills = Object.entries(keywordFreq)
      .sort(([, countA], [, countB]) => countB - countA)
      .slice(0, 15)
      .map(([keyword]) => keyword);
    
    console.log('Extracted skills from overall content:', skills);
    return skills;
  }

  // Extract experience entries from the document
  extractExperienceEnhanced() {
    const experienceChunks = this.documentChunks.filter(chunk => 
      chunk.section === 'experience' || 
      chunk.content.toLowerCase().includes('developer') ||
      chunk.content.toLowerCase().includes('engineer') ||
      chunk.content.toLowerCase().includes('manager') ||
      chunk.content.toLowerCase().includes('analyst') ||
      chunk.content.toLowerCase().includes('worked') ||
      chunk.content.toLowerCase().includes('experience')
    );

    if (experienceChunks.length === 0) {
      console.warn('No experience-related content found in uploaded documents');
      return [];
    }

    // Group consecutive experience chunks as they might be from the same job
    let currentJobChunks = [];
    const jobGroups = [];
    
    for (let i = 0; i < experienceChunks.length; i++) {
      const chunk = experienceChunks[i];
      
      // Start of a new job if it contains date patterns or job titles
      const hasDatePattern = /\b(20\d\d|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\b/i.test(chunk.content);
      const hasJobTitle = /\b(developer|engineer|manager|analyst|designer|consultant|intern)\b/i.test(chunk.content);
      
      if (hasDatePattern || hasJobTitle) {
        // Save previous job group if it exists
        if (currentJobChunks.length > 0) {
          jobGroups.push([...currentJobChunks]);
          currentJobChunks = [];
        }
      }
      
      currentJobChunks.push(chunk);
    }
    
    // Add the last job group
    if (currentJobChunks.length > 0) {
      jobGroups.push(currentJobChunks);
    }
    
    // Process each job group into a single experience entry
    const experiences = jobGroups.map(chunks => {
      // Join the content from all chunks in this job
      const content = chunks.map(c => c.content).join("\n");
      
      // Extract potential job title
      const titleMatch = content.match(/\b(senior|lead|junior|staff)?\s*(developer|engineer|manager|analyst|designer|consultant|specialist|director|architect|administrator|coordinator|technician)\b/i);
      const title = titleMatch ? titleMatch[0] : "Position";
      
      // Extract potential dates
      const dateMatch = content.match(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|may|june|july|august|september|october|november|december)[\s\-]+(20\d\d)\s*(?:-|to|–)\s*(?:(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|may|june|july|august|september|october|november|december)[\s\-]+(20\d\d)|(present|current))\b/i);
      
      let dates = "";
      if (dateMatch) {
        dates = dateMatch[0];
      } else {
        // Try just finding years
        const yearMatch = content.match(/\b(20\d\d)\s*(?:-|to|–)\s*(?:(20\d\d)|(present|current))\b/i);
        if (yearMatch) {
          dates = yearMatch[0];
        }
      }
      
      // Extract potential company name (words near the dates or title)
      let company = "";
      const companyMatch = content.match(/\b([A-Z][a-z]+(?: [A-Z][a-z]+){0,4}(?:,? (?:Inc|LLC|Ltd|GmbH|Co|Corporation|Limited))?)\b/);
      if (companyMatch) {
        company = companyMatch[0];
      }
      
      // Compile the experience entry
      return {
        title: title || "Position",
        company: company || "Company",
        dates: dates || "Date range",
        content: content,
        keywords: chunks.flatMap(c => c.keywords)
      };
    });

    // Sort by likely recency (if dates are available)
    experiences.sort((a, b) => {
      const aHasPresent = /present|current/i.test(a.dates);
      const bHasPresent = /present|current/i.test(b.dates);
      
      if (aHasPresent && !bHasPresent) return -1;
      if (!aHasPresent && bHasPresent) return 1;
      
      // Extract years and compare
      const aYearMatch = a.dates.match(/20(\d\d)/g);
      const bYearMatch = b.dates.match(/20(\d\d)/g);
      
      if (aYearMatch && bYearMatch) {
        // Compare the most recent year in each
        const aMaxYear = Math.max(...aYearMatch.map(y => parseInt(y)));
        const bMaxYear = Math.max(...bYearMatch.map(y => parseInt(y)));
        return bMaxYear - aMaxYear; // Most recent first
      }
      
      return 0;
    });

    console.log(`Extracted ${experiences.length} experience entries with structure:`, 
      experiences.map(e => `${e.title} at ${e.company}, ${e.dates}`));
      
    return experiences.slice(0, 5); // Return top 5 most recent
  }

  // Extract education entries from the document
  extractEducationEnhanced() {
    const educationChunks = this.documentChunks.filter(chunk => chunk.section === 'education');
    
    if (educationChunks.length === 0) {
      return [];
    }

    return educationChunks.map(chunk => ({
      content: chunk.content,
      keywords: chunk.keywords
    }));
  }

  // Extract projects from the document
  extractProjectsEnhanced() {
    const projectChunks = this.documentChunks.filter(chunk => chunk.section === 'projects');
    
    if (projectChunks.length === 0) {
      return [];
    }

    return projectChunks.map(chunk => ({
      content: chunk.content,
      keywords: chunk.keywords
    }));
  }

  // Extract certifications from the document
  extractCertifications() {
    const certificationChunks = this.documentChunks.filter(chunk => chunk.section === 'certifications');
    
    if (certificationChunks.length === 0) {
      return [];
    }

    return certificationChunks.map(chunk => ({
      content: chunk.content,
      keywords: chunk.keywords
    }));
  }

  // Generate a summary from the document
  generateEnhancedSummary() {
    if (this.documentChunks.length === 0) {
      return 'No content available for summary';
    }

    const summaryChunk = this.documentChunks.find(chunk => chunk.section === 'summary');
    if (summaryChunk) {
      return summaryChunk.content;
    }

    // Generate basic summary from first few chunks
    const firstChunks = this.documentChunks.slice(0, 3);
    return firstChunks.map(chunk => chunk.content).join(' ').substring(0, 500) + '...';
  }

  // Get the document sections
  getDocumentSections() {
    const sections = {};
    this.documentChunks.forEach(chunk => {
      sections[chunk.section] = (sections[chunk.section] || 0) + 1;
    });
    return sections;
  }

  // Enhanced analysis with RAG context
  async analyzeDocuments() {
    if (this.uploadedDocuments.length === 0) {
      return null;
    }

    // Validate that we have actual content
    const totalContent = this.uploadedDocuments
      .map(doc => doc.content)
      .join(' ')
      .trim();

    if (totalContent.length < 100) {
      throw new Error('Documents contain insufficient content for analysis');
    }

    // Combine all document contents
    const combinedContent = this.uploadedDocuments
      .map(doc => `=== ${doc.name} ===\n${doc.content}`)
      .join('\n\n');

    // Extract comprehensive information using RAG
    const analysis = {
      skills: this.extractSkillsEnhanced(),
      experience: this.extractExperienceEnhanced(),
      education: this.extractEducationEnhanced(),
      projects: this.extractProjectsEnhanced(),
      certifications: this.extractCertifications(),
      summary: this.generateEnhancedSummary(),
      rawContent: combinedContent,
      chunks: this.documentChunks.length,
      sections: this.getDocumentSections()
    };

    // Validate analysis results
    if (analysis.skills.length === 0 && analysis.experience.length === 0) {
      console.warn('CV analysis produced minimal results - content may not be in expected format');
    }

    this.parsedContent = analysis;
    console.log('CV Analysis Results:', {
      skills: analysis.skills.length,
      experience: analysis.experience.length,
      education: analysis.education.length,
      projects: analysis.projects.length,
      chunks: analysis.chunks
    });

    return analysis;
  }

  // RAG retrieval function that was missing
  retrieveRelevantChunks(query, topK = 3) {
    if (this.documentChunks.length === 0) {
      return [];
    }

    const queryEmbedding = this.createSimpleEmbedding(query);
    const queryKeywords = this.extractKeywords(query);
    
    // Score chunks based on similarity
    const scoredChunks = this.documentChunks.map(chunk => {
      let score = 0;
      
      // Keyword matching score
      const matchingKeywords = chunk.keywords.filter(k => queryKeywords.includes(k));
      score += matchingKeywords.length * 2;
      
      // Content similarity score (simplified cosine similarity)
      const similarity = this.cosineSimilarity(queryEmbedding, chunk.embedding);
      score += similarity * 10;
      
      // Section relevance bonus
      if (query.toLowerCase().includes(chunk.section)) {
        score += 5;
      }
      
      return { ...chunk, score };
    });

    // Sort by score and return top K
    return scoredChunks
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  }

  // Helper function for vector similarity calculation
  cosineSimilarity(vecA, vecB) {
    if (vecA.length !== vecB.length) return 0;
    
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }
    
    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  // New method to get RAG context for interview questions
  getRAGContext(query, topK = 3) {
    if (this.documentChunks.length === 0) {
      return { 
        chunks: [], 
        context: 'No CV content available',
        keywords: []
      };
    }

    // Get relevant chunks based on the query
    const relevantChunks = this.retrieveRelevantChunks(query, topK);
    
    // Combine chunks into a coherent context
    const context = relevantChunks
      .map(chunk => chunk.content)
      .join('\n\n');
    
    // Extract keywords from the query and chunks
    const queryKeywords = this.extractKeywords(query);
    const chunkKeywords = relevantChunks.flatMap(chunk => chunk.keywords);
    
    // Find matching keywords (intersection)
    const matchingKeywords = queryKeywords.filter(k => 
      chunkKeywords.includes(k)
    );
    
    console.log(`Generated RAG context for query: "${query}" (matched ${relevantChunks.length} chunks, ${matchingKeywords.length} keywords)`);
    
    return {
      chunks: relevantChunks,
      context,
      keywords: matchingKeywords,
      query
    };
  }

  // Method to generate CV preview text for UI display
  generateCVPreview() {
    if (this.uploadedDocuments.length === 0 || !this.parsedContent) {
      return 'No CV uploaded or analysis not available.';
    }

    const formattedSections = [];
    
    // Add summary if available
    if (this.parsedContent.summary && this.parsedContent.summary.length > 10) {
      formattedSections.push(`SUMMARY:\n${this.parsedContent.summary}`);
    }
    
    // Add skills section
    if (this.parsedContent.skills && this.parsedContent.skills.length > 0) {
      formattedSections.push(`SKILLS:\n${this.parsedContent.skills.join(', ')}`);
    }
    
    // Add experience entries
    if (this.parsedContent.experience && this.parsedContent.experience.length > 0) {
      const experienceEntries = this.parsedContent.experience.map(exp => {
        return `• ${exp.title || 'Position'} at ${exp.company || 'Company'} (${exp.dates || 'Date range'})`;
      }).join('\n');
      
      formattedSections.push(`EXPERIENCE:\n${experienceEntries}`);
    }
    
    // Add education if available
    if (this.parsedContent.education && this.parsedContent.education.length > 0) {
      const educationEntries = this.parsedContent.education.map(edu => {
        return `• ${edu.content}`;
      }).join('\n');
      
      formattedSections.push(`EDUCATION:\n${educationEntries}`);
    }
    
    // Add projects if available
    if (this.parsedContent.projects && this.parsedContent.projects.length > 0) {
      const projectEntries = this.parsedContent.projects.map(proj => {
        return `• ${proj.content}`;
      }).join('\n');
      
      formattedSections.push(`PROJECTS:\n${projectEntries}`);
    }
    
    // Join all sections
    return formattedSections.join('\n\n');
  }
  
  // Add helper method to remove a document by ID
  removeDocument(documentId) {
    const documentIndex = this.uploadedDocuments.findIndex(doc => doc.id === documentId);
    
    if (documentIndex !== -1) {
      // Remove the document from the array
      this.uploadedDocuments.splice(documentIndex, 1);
      
      // Remove any chunks associated with this document
      this.documentChunks = this.documentChunks.filter(
        chunk => chunk.documentId !== documentId
      );
      
      // Remove from vector store
      for (const [chunkId, chunk] of this.vectorStore.entries()) {
        if (chunk.documentId === documentId) {
          this.vectorStore.delete(chunkId);
        }
      }
      
      // Reset parsed content if no documents left
      if (this.uploadedDocuments.length === 0) {
        this.parsedContent = null;
      } else {
        // Re-analyze remaining documents
        this.analyzeDocuments();
      }
      
      return true;
    }
    
    return false;
  }

  async extractTextFallback(file) {
    return `[Document: ${file.name}]\n\nThis document could not be fully processed. Please try converting it to a text file for better results.`;
  }

  getUploadedDocuments() {
    return this.uploadedDocuments;
  }

  clearDocuments() {
    this.uploadedDocuments = [];
    this.parsedContent = null;
    this.documentChunks = [];
    this.vectorStore.clear();
  }

  getParsedContent() {
    return this.parsedContent;
  }
}

const documentService = new DocumentService();
export default documentService;