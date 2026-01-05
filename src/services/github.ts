import { Octokit } from '@octokit/rest';
import type { GitHubFileResponse } from '@/types';

class GitHubService {
  private octokit: Octokit;
  private owner: string;
  private repo: string;
  private branch: string;

  constructor() {
    const token = import.meta.env.VITE_GITHUB_TOKEN;
    this.owner = import.meta.env.VITE_GITHUB_OWNER;
    this.repo = import.meta.env.VITE_GITHUB_REPO;
    this.branch = import.meta.env.VITE_GITHUB_BRANCH || 'main';

    if (!token) {
      throw new Error('GitHub token not configured');
    }

    this.octokit = new Octokit({ auth: token });
  }

  /**
   * Read a file from the repository
   */
  async getFile(path: string): Promise<GitHubFileResponse> {
    try {
      const response = await this.octokit.rest.repos.getContent({
        owner: this.owner,
        repo: this.repo,
        path,
        ref: this.branch,
      });

      if ('content' in response.data) {
        // Decode base64 and handle UTF-8
        const base64 = response.data.content.replace(/\s/g, '');
        const decoded = decodeURIComponent(escape(atob(base64)));
        return {
          content: decoded,
          sha: response.data.sha,
          path: response.data.path,
        };
      }

      throw new Error('File not found');
    } catch (error) {
      console.error('Error fetching file:', error);
      throw error;
    }
  }

  /**
   * Update or create a file in the repository
   */
  async updateFile(
    path: string,
    content: string,
    message: string,
    sha?: string
  ): Promise<void> {
    try {
      const encodedContent = btoa(unescape(encodeURIComponent(content)));

      await this.octokit.rest.repos.createOrUpdateFileContents({
        owner: this.owner,
        repo: this.repo,
        path,
        message,
        content: encodedContent,
        branch: this.branch,
        sha,
      });
    } catch (error) {
      console.error('Error updating file:', error);
      throw error;
    }
  }

  /**
   * Upload an image to the repository
   */
  async uploadImage(
    path: string,
    imageData: string,
    message: string
  ): Promise<string> {
    try {
      // Remove data URL prefix if present
      const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');

      await this.octokit.rest.repos.createOrUpdateFileContents({
        owner: this.owner,
        repo: this.repo,
        path,
        message,
        content: base64Data,
        branch: this.branch,
      });

      // Return the URL to the uploaded image
      return `https://raw.githubusercontent.com/${this.owner}/${this.repo}/${this.branch}/${path}`;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }

  /**
   * Parse TypeScript data file to JSON
   */
  parseDataFile<T>(content: string): T[] {
    let jsonContent = '';
    try {
      // Remove UTF-8 BOM if present
      let cleanContent = content.replace(/^\uFEFF/, '');

      // Remove all import statements (including multiline)
      cleanContent = cleanContent.replace(/import\s+[\s\S]*?from\s+['"][^'"]+['"];?/g, '');

      // Remove single-line comments
      cleanContent = cleanContent.replace(/\/\/.*$/gm, '');

      // Remove multi-line comments
      cleanContent = cleanContent.replace(/\/\*[\s\S]*?\*\//g, '');

      // Replace asset identifiers with string placeholders so evaluation doesn't need the assets
      cleanContent = cleanContent.replace(/imageUrl\s*:\s*([A-Za-z_][\w]*)/g, 'imageUrl: "$1"');
      cleanContent = cleanContent.replace(/pdfUrl\s*:\s*([A-Za-z_][\w]*)/g, 'pdfUrl: "$1"');

      // Grab the right-hand side of the export assignment
      const exportMatch = cleanContent.match(/export\s+(const|let|var)\s+\w+\s*=\s*([\s\S]+)/);
      if (!exportMatch) {
        throw new Error('No export assignment found in data file');
      }

      let rhs = exportMatch[2].trim();

      // If an array literal exists, isolate it; otherwise use the whole RHS
      const arrayMatch = rhs.match(/\[[\s\S]*\]/);
      jsonContent = arrayMatch ? arrayMatch[0] : rhs;

      // Remove trailing semicolons and trailing commas before closing braces/brackets
      jsonContent = jsonContent.replace(/;?\s*$/, '');
      jsonContent = jsonContent.replace(/,(\s*[}\]])/g, '$1');

      // Normalize to JSON: quote keys and ensure valid JSON
      const normalized = jsonContent
        .replace(/(\w+)\s*:/g, '"$1":')
        .replace(/,(\s*[}\]])/g, '$1');

      return JSON.parse(normalized) as T[];
    } catch (error) {
      console.error('Error parsing data file:', error);
      console.error('Content preview:', jsonContent?.substring(0, 500));
      throw new Error('Failed to parse data file');
    }
  }

  /**
   * Convert JSON data back to TypeScript format
   */
  formatDataFile(data: any[], typeName: string, variableName: string): string {
    const jsonString = JSON.stringify(data, null, 2);
    return `export const ${variableName}: ${typeName}[] = ${jsonString};\n`;
  }

  /**
   * Get data from a specific data file
   */
  async getData<T>(fileName: string): Promise<{ data: T[]; sha: string; originalContent: string }> {
    const filePath = `data/${fileName}.ts`;
    const file = await this.getFile(filePath);
    const data = this.parseDataFile<T>(file.content);
    return { data, sha: file.sha, originalContent: file.content };
  }

  /**
   * Update data in a specific data file
   */
  async updateData<T>(
    fileName: string,
    data: T[],
    typeName: string,
    variableName: string,
    message: string,
    sha: string,
    originalContent?: string
  ): Promise<void> {
    const filePath = `data/${fileName}.ts`;
    
    let newContent: string;
    
    if (originalContent) {
      // Preserve imports and comments, only replace the data array
      const arrayString = JSON.stringify(data, null, 2);

          // Find the export statement, keep the original variable name and replace everything after the = sign
          newContent = originalContent.replace(
            /export\s+(const|let|var)\s+(\w+)\s*=\s*[\s\S]+/,
            (_match, decl, varName) => `export ${decl} ${varName}: ${typeName}[] = ${arrayString};\n`
          );
    } else {
      // Fallback to simple format
      newContent = this.formatDataFile(data, typeName, variableName);
    }
    
    await this.updateFile(filePath, newContent, message, sha);
  }
}

export const githubService = new GitHubService();
