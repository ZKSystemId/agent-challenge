import { createTool } from '@mastra/core';
import { z } from 'zod';

export const githubAnalysisTool = createTool({
  id: 'github-analyzer',
  description: 'Analyze GitHub repositories, fetch stars, forks, issues, and latest commits.',
  inputSchema: z.object({
    owner: z.string().describe('Repository owner username'),
    repo: z.string().describe('Repository name'),
  }),
  execute: async ({ context }) => {
    const { owner, repo } = context;
    
    try {
      const repoResponse = await fetch(
        `https://api.github.com/repos/${owner}/${repo}`,
        { 
          headers: { 'Accept': 'application/vnd.github.v3+json' },
          cache: 'no-store' 
        }
      );
      
      if (!repoResponse.ok) {
        throw new Error(`GitHub API error: ${repoResponse.status}`);
      }
      
      const repoData = await repoResponse.json();
      
      const commitsResponse = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/commits?per_page=1`,
        { 
          headers: { 'Accept': 'application/vnd.github.v3+json' },
          cache: 'no-store' 
        }
      );
      
      const commits = commitsResponse.ok ? await commitsResponse.json() : [];
      const latestCommit = commits[0];
      
      return {
        success: true,
        repository: `${owner}/${repo}`,
        description: repoData.description || 'No description',
        stars: repoData.stargazers_count,
        forks: repoData.forks_count,
        openIssues: repoData.open_issues_count,
        language: repoData.language || 'Unknown',
        latestCommit: latestCommit ? {
          sha: latestCommit.sha.substring(0, 7),
          message: latestCommit.commit.message,
          author: latestCommit.commit.author.name,
        } : null,
        url: repoData.html_url,
        source: 'GitHub API',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },
});
