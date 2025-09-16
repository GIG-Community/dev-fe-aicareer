/**
 * Direct implementation of ConvertAPI service
 * This avoids the issues with loading the JavaScript client library
 */
class ConvertApiService {
  constructor() {
    this.apiKey = 'a1U7Ae2pceF7PjUxi1VB4U7UF1ijZxba';
    this.baseUrl = 'https://v2.convertapi.com/convert';
  }

  /**
   * Convert PDF to text using ConvertAPI
   * @param {File} file - The PDF file to convert
   * @returns {Promise<string>} - The extracted text
   */
  async convertPdfToText(file) {
    try {
      console.log(`Converting PDF to text: ${file.name}`);
      
      // Create form data for the API request
      const formData = new FormData();
      formData.append('File', file);
      formData.append('StoreFile', 'true');
      
      // Make the API request
      const response = await fetch(`${this.baseUrl}/pdf/to/txt?apikey=${this.apiKey}`, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error (${response.status}): ${errorText}`);
      }
      
      const result = await response.json();
      console.log('ConvertAPI response:', result);
      
      if (!result.Files || !result.Files.length) {
        throw new Error('No files in the conversion result');
      }
      
      // Download the converted text
      const textFileUrl = result.Files[0].Url;
      const textResponse = await fetch(textFileUrl);
      
      if (!textResponse.ok) {
        throw new Error(`Failed to download converted text: ${textResponse.status}`);
      }
      
      const textContent = await textResponse.text();
      console.log(`Extracted ${textContent.length} characters of text from PDF`);
      
      return textContent;
    } catch (error) {
      console.error('PDF conversion error:', error);
      throw new Error(`PDF conversion failed: ${error.message}`);
    }
  }

  /**
   * Convert DOC/DOCX to text
   * @param {File} file - The document file to convert
   * @returns {Promise<string>} - The extracted text
   */
  async convertDocToText(file) {
    try {
      console.log(`Converting document to text: ${file.name}`);
      
      // Determine source format based on file type
      const sourceFormat = file.type.includes('openxmlformats') ? 'docx' : 'doc';
      
      // Create form data for the API request
      const formData = new FormData();
      formData.append('File', file);
      formData.append('StoreFile', 'true');
      
      // Make the API request
      const response = await fetch(`${this.baseUrl}/${sourceFormat}/to/txt?apikey=${this.apiKey}`, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error (${response.status}): ${errorText}`);
      }
      
      const result = await response.json();
      console.log('ConvertAPI response:', result);
      
      if (!result.Files || !result.Files.length) {
        throw new Error('No files in the conversion result');
      }
      
      // Download the converted text
      const textFileUrl = result.Files[0].Url;
      const textResponse = await fetch(textFileUrl);
      
      if (!textResponse.ok) {
        throw new Error(`Failed to download converted text: ${textResponse.status}`);
      }
      
      const textContent = await textResponse.text();
      console.log(`Extracted ${textContent.length} characters of text from document`);
      
      return textContent;
    } catch (error) {
      console.error('Document conversion error:', error);
      throw new Error(`Document conversion failed: ${error.message}`);
    }
  }
}

export default new ConvertApiService();
