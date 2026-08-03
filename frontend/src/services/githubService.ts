import axios from 'axios';
import type { Repository } from '../store/slices/githubSlice';

const GITHUB_API_BASE = 'https://api.github.com';

export const fetchGithubRepos = async (
  username: string,
): Promise<Repository[]> => {
  try {
    const response = await axios.get(
      `${GITHUB_API_BASE}/users/${username}/repos`,
      {
        params: {
          sort: 'updated',
          per_page: 12,
        },
      },
    );
    return response.data as Repository[];
  } catch (error) {
    console.error('Error fetching GitHub repositories:', error);
    throw error;
  }
};
