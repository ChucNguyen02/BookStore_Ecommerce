import apiClient from './api.client';
import {
  type AddressRequest,
  type AddressResponse,
} from '../types';

class AddressService {
  private readonly BASE_URL = '/addresses';

  async getUserAddresses(): Promise<AddressResponse[]> {
    const response = await apiClient.get<AddressResponse[]>(this.BASE_URL);
    return response.result ?? [];
  }

  async createAddress(data: AddressRequest): Promise<AddressResponse> {
    const response = await apiClient.post<AddressResponse>(this.BASE_URL, data);
    if (!response.result) {
      throw new Error(response.message || 'Failed to create address');
    }
    return response.result;
  }

  async updateAddress(addressId: string, data: AddressRequest): Promise<AddressResponse> {
    const response = await apiClient.put<AddressResponse>(
      `${this.BASE_URL}/${addressId}`,
      data
    );
    if (!response.result) {
      throw new Error(response.message || 'Failed to update address');
    }
    return response.result;
  }

  async deleteAddress(addressId: string): Promise<void> {
    await apiClient.delete<unknown>(`${this.BASE_URL}/${addressId}`);
  }

  async setDefaultAddress(addressId: string): Promise<AddressResponse> {
    const response = await apiClient.patch<AddressResponse>(
      `${this.BASE_URL}/${addressId}/default`
    );
    if (!response.result) {
      throw new Error(response.message || 'Failed to set default address');
    }
    return response.result;
  }

  async getDefaultAddress(): Promise<AddressResponse | null> {
    const response = await apiClient.get<AddressResponse>(
      `${this.BASE_URL}/default`
    );
    return response.result ?? null;
  }

  async countUserAddresses(): Promise<number> {
    const response = await apiClient.get<number>(`${this.BASE_URL}/count`);
    return response.result ?? 0;
  }

  async deleteAllUserAddresses(): Promise<void> {
    await apiClient.delete<unknown>(`${this.BASE_URL}/all`);
  }
}

export const addressService = new AddressService();
export default addressService;