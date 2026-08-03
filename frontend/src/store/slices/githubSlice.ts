import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { fetchGithubRepos } from '../../services/githubService';

export interface Repository {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
}

export interface LanguageCount {
  [key: string]: number;
}

interface GithubState {
  repositories: Repository[];
  languages: LanguageCount;
  loading: boolean;
  error: string | null;
}

const initialState: GithubState = {
  repositories: [],
  languages: {},
  loading: false,
  error: null,
};

export const fetchRepositories = createAsyncThunk(
  'github/fetchRepositories',
  async (username: string) => {
    const repos = await fetchGithubRepos(username);
    return repos;
  },
);

const githubSlice = createSlice({
  name: 'github',
  initialState,
  reducers: {
    calculateLanguages: (state) => {
      const languageCount: LanguageCount = {};
      state.repositories.forEach((repo) => {
        if (repo.language) {
          languageCount[repo.language] =
            (languageCount[repo.language] || 0) + 1;
        }
      });
      state.languages = languageCount;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRepositories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchRepositories.fulfilled,
        (state, action: PayloadAction<Repository[]>) => {
          state.loading = false;
          state.repositories = action.payload;

          // Calculate languages
          const languageCount: LanguageCount = {};
          action.payload.forEach((repo) => {
            if (repo.language) {
              languageCount[repo.language] =
                (languageCount[repo.language] || 0) + 1;
            }
          });
          state.languages = languageCount;
        },
      )
      .addCase(fetchRepositories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch repositories';
      });
  },
});

export const { calculateLanguages } = githubSlice.actions;
export default githubSlice.reducer;
