export interface AddressResponse {
    id: string;
    fullName: string;
    phone: string;
    province: string;
    district: string;
    ward: string;
    detailAddress: string;
    fullAddress: string;
    isDefault: boolean;
    createdAt: string;
}

export interface AddressRequest {
    fullName: string;
    phone: string;
    province: string;
    district: string;
    ward: string;
    detailAddress: string;
    isDefault?: boolean;
}