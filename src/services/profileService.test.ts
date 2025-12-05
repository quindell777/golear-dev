/**
 * @file profileService.test.ts
 * @description
 * Testes para o serviço de perfil do usuário.
 */

import { vi } from 'vitest';
import api from './api';
import { connectUser, disconnectUser, getConnectionStatus, getProfile, getProfileById, updateProfile } from './profileService';

// Mocking the api module
vi.mock('./api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('profileService', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should get a user profile', async () => {
    const mockProfile = { user: { id: '1' }, profile: { name: 'Test User' } };
    (api.get as jest.Mock).mockResolvedValue({ data: mockProfile });

    const profile = await getProfile();

    expect(api.get).toHaveBeenCalledWith('/profile/api');
    expect(profile).toEqual({ id: '1', name: 'Test User' });
  });

  it('should get a user profile by ID', async () => {
    const mockProfile = { user: { id: '1' }, profile: { name: 'Test User' } };
    (api.get as jest.Mock).mockResolvedValue({ data: mockProfile });

    const profile = await getProfileById('1');

    expect(api.get).toHaveBeenCalledWith('/usuarios/1/perfil');
    expect(profile).toEqual({ id: '1', name: 'Test User' });
  });

  it('should update a user profile', async () => {
    const mockResponse = { success: true };
    (api.put as jest.Mock).mockResolvedValue({ data: mockResponse });

    const response = await updateProfile({ name: 'New Name' });

    expect(api.put).toHaveBeenCalledWith('/profile/api', { name: 'New Name' });
    expect(response).toEqual(mockResponse);
  });

  it('should get connection status', async () => {
    const mockResponse = { success: true, following: true };
    (api.get as jest.Mock).mockResolvedValue({ data: mockResponse });

    const status = await getConnectionStatus('1');

    expect(api.get).toHaveBeenCalledWith('/usuarios/1/connection-status');
    expect(status).toBe(true);
  });

  it('should connect a user', async () => {
    const mockResponse = { success: true };
    (api.post as jest.Mock).mockResolvedValue({ data: mockResponse });

    const response = await connectUser('1');

    expect(api.post).toHaveBeenCalledWith('/usuarios/1/conectar');
    expect(response).toEqual(mockResponse);
  });

  it('should disconnect a user', async () => {
    const mockResponse = { success: true };
    (api.delete as jest.Mock).mockResolvedValue({ data: mockResponse });

    const response = await disconnectUser('1');

    expect(api.delete).toHaveBeenCalledWith('/usuarios/1/desconectar');
    expect(response).toEqual(mockResponse);
  });
});
