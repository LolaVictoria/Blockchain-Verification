import apiClient from './apiClient';
import type { ProfileUpdateRequest, ApiResponse, User } from '../../types/auth';

export const profileService = {
  async getProfile() {
    return await apiClient.get<ApiResponse<User>>('/manufacturer/profile');
  },

  async updateProfile(data: ProfileUpdateRequest) {
    return await apiClient.post<ApiResponse<User>>('/manufacturer/profile', data);
  },

  async getLastUpdateTimes(types: string[]) {
    return await apiClient.get<ApiResponse>(`/manufacturer/last-update-times?types=${types.join(',')}`);
  }
};