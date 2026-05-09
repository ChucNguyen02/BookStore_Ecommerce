import { useTranslation } from 'react-i18next'; // src/components/profile/AddressForm.tsx
import { useState, useEffect } from 'react';
import { User, Phone, MapPin, Home, X, Save } from 'lucide-react';
import type { AddressResponse, AddressRequest } from '../../../types';
import { useAppContext } from '../../../context/AppContext';
import toast from 'react-hot-toast';

interface AddressFormProps {
  address?: AddressResponse | null;
  updating: boolean;
  onSubmit: (data: AddressRequest) => Promise<void>;
  onCancel: () => void;
}

export const AddressForm = ({ address, updating, onSubmit, onCancel }: AddressFormProps) => {const { t } = useTranslation();
  const { language } = useAppContext();
  const [formData, setFormData] = useState<AddressRequest>({
    fullName: '',
    phone: '',
    province: '',
    district: '',
    ward: '',
    detailAddress: '',
    isDefault: false
  });

  useEffect(() => {
    if (address) {
      setFormData({
        fullName: address.fullName,
        phone: address.phone,
        province: address.province,
        district: address.district,
        ward: address.ward,
        detailAddress: address.detailAddress,
        isDefault: address.isDefault
      });
    }
  }, [address]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      toast.error(language === 'vi' ? t("Common.vuiLongNhapHoTen") : 'Please enter full name');
      return;
    }

    if (!formData.phone.trim()) {
      toast.error(language === 'vi' ? t("Common.vuiLongNhapSoDien") : 'Please enter phone number');
      return;
    }

    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      toast.error(language === 'vi' ? t("Common.soDienThoaiKhongHop") : 'Invalid phone number');
      return;
    }

    if (!formData.province.trim()) {
      toast.error(language === 'vi' ? t("Common.vuiLongNhapTinhthanhPho") : 'Please enter province/city');
      return;
    }

    if (!formData.district.trim()) {
      toast.error(language === 'vi' ? t("Common.vuiLongNhapQuanhuyen") : 'Please enter district');
      return;
    }

    if (!formData.ward.trim()) {
      toast.error(language === 'vi' ? t("Common.vuiLongNhapPhuongxa") : 'Please enter ward');
      return;
    }

    if (!formData.detailAddress.trim()) {
      toast.error(language === 'vi' ? t("Common.vuiLongNhapDiaChi") : 'Please enter detail address');
      return;
    }

    await onSubmit(formData);
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-xl border-2 border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {address ?
          language === 'vi' ? t("Common.chinhSuaDiaChi") : 'Edit Address' :
          language === 'vi' ? t("Common.themDiaChiMoi") : 'Add New Address'}
                </h3>
                <button
          onClick={onCancel}
          disabled={updating}
          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors disabled:opacity-50">
          
                    <X className="w-5 h-5" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {language === 'vi' ? t("Common.hoVaTen") : 'Full Name'} <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                            <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                disabled={updating}
                className="w-full pl-11 pr-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50"
                placeholder={t("Common.nguyenVanA")}
                required />
              
                        </div>
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {language === 'vi' ? t("Common.soDienThoai") : 'Phone Number'} <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                            <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={updating}
                className="w-full pl-11 pr-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50"
                placeholder="0123456789"
                required />
              
                        </div>
                    </div>

                    {/* Province */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {language === 'vi' ? t("Common.tinhthanhPho") : 'Province/City'} <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                            <input
                type="text"
                name="province"
                value={formData.province}
                onChange={handleChange}
                disabled={updating}
                className="w-full pl-11 pr-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50"
                placeholder={t("Common.tpHoChiMinh")}
                required />
              
                        </div>
                    </div>

                    {/* District */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {language === 'vi' ? t("Common.quanhuyen") : 'District'} <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                            <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleChange}
                disabled={updating}
                className="w-full pl-11 pr-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50"
                placeholder={t("Common.quan1")}
                required />
              
                        </div>
                    </div>

                    {/* Ward */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {language === 'vi' ? t("Common.phuongxa") : 'Ward'} <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                            <input
                type="text"
                name="ward"
                value={formData.ward}
                onChange={handleChange}
                disabled={updating}
                className="w-full pl-11 pr-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50"
                placeholder={t("Common.phuongBenNghe")}
                required />
              
                        </div>
                    </div>

                    {/* Detail Address */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {language === 'vi' ? t("Common.diaChiCuThe") : 'Detail Address'} <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <Home className="absolute left-3 top-3 w-5 h-5 text-gray-400 dark:text-gray-500" />
                            <textarea
                name="detailAddress"
                value={formData.detailAddress}
                onChange={handleChange}
                disabled={updating}
                rows={3}
                className="w-full pl-11 pr-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50 resize-none"
                placeholder={t("Common.soNhaTenDuong")}
                required />
              
                        </div>
                    </div>
                </div>

                {/* Set as Default */}
                <div className="flex items-center gap-2">
                    <input
            type="checkbox"
            name="isDefault"
            checked={formData.isDefault}
            onChange={handleChange}
            disabled={updating}
            className="w-4 h-4 text-green-600 rounded focus:ring-green-500 dark:focus:ring-green-400 disabled:opacity-50" />
          
                    <label className="text-sm text-gray-700 dark:text-gray-300">
                        {language === 'vi' ? t("Common.datLamDiaChiMac") : 'Set as default address'}
                    </label>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                    <button
            type="button"
            onClick={onCancel}
            disabled={updating}
            className="flex-1 px-6 py-2.5 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            
                        <X className="w-5 h-5" />
                        {language === 'vi' ? t("Common.huy") : 'Cancel'}
                    </button>
                    <button
            type="submit"
            disabled={updating}
            className="flex-1 px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 dark:hover:from-green-700 dark:hover:to-emerald-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            
                        <Save className="w-5 h-5" />
                        {updating ?
            language === 'vi' ? t("Common.dangLuu") : 'Saving...' :
            address ?
            language === 'vi' ? t("Common.capNhat") : 'Update' :
            language === 'vi' ? t("Common.themDiaChi") : 'Add Address'}
                    </button>
                </div>
            </form>
        </div>);

};