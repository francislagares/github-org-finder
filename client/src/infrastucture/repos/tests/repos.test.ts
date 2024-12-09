import axios from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Repo } from '@/domain/entities/repo';
import ApiService from '@/infrastucture/api/apiClient';

vi.mock('axios');

const service = new ApiService<Repo[]>('/repos');

describe('Repos Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch data successfully', async () => {
    const mockData: Repo[] = [
      {
        id: 2935646,
        name: 'brackets-app',
        url: 'https://api.github.com/repos/adobe/brackets-app',
        branches: 6,
        language: 'C++',
        isChecked: false,
      },
      {
        id: 2935646,
        name: 'brackets-app',
        url: 'https://api.github.com/repos/adobe/brackets-app',
        branches: 6,
        language: 'C++',
        isChecked: false,
      },
    ];

    axios.get.mockResolvedValue({
      data: mockData,
    });

    const response = await service.getAll<Repo[]>();

    // Verificamos que la respuesta sea la esperada
    expect(response).toEqual(mockData);
    expect(axios.get).toHaveBeenCalledWith('/repos', expect.any(Object)); // Verificar si la llamada a axios.get fue realizada correctamente
  });

  it('should handle error response', async () => {
    // Simulamos un error
    const errorMessage = { message: 'Internal Server Error' };

    (axios.get as vi.Mock).mockRejectedValue({
      response: { data: errorMessage },
    });

    // Intentamos llamar a getAll y esperamos que se lance un error
    try {
      await service.getAll<Repo[]>();
    } catch (error) {
      expect(error.response?.data.message).toBe('Internal Server Error');
    }
  });
});
