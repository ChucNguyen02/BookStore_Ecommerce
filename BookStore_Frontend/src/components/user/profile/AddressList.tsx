import { useTranslation } from 'react-i18next';import { useState } from 'react';
import { MapPin, Plus, Edit, Trash2, Check, AlertTriangle } from 'lucide-react';
import type { AddressResponse, AddressRequest } from '../../../types';
import { useAppContext } from '../../../context/AppContext';
import { AddressForm } from './AddressForm';

interface AddressListProps {
  addresses: AddressResponse[];
  updating: boolean;
  onCreate: (data: AddressRequest) => Promise<boolean>;
  onUpdate: (addressId: string, data: AddressRequest) => Promise<boolean>;
  onDelete: (addressId: string) => Promise<boolean>;
  onSetDefault: (addressId: string) => Promise<boolean>;
  onDeleteAll: () => Promise<boolean>;
}

export const AddressList = ({
  addresses,
  updating,
  onCreate,
  onUpdate,
  onDelete,
  onSetDefault,
  onDeleteAll
}: AddressListProps) => {const { t } = useTranslation();
  const { language } = useAppContext();
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressResponse | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);

  const handleCreate = async (data: AddressRequest) => {
    const success = await onCreate(data);
    if (success) {
      setShowForm(false);
    }
  };

  const handleUpdate = async (data: AddressRequest) => {
    if (!editingAddress) return;
    const success = await onUpdate(editingAddress.id, data);
    if (success) {
      setEditingAddress(null);
    }
  };

  const handleDelete = async (addressId: string) => {
    const success = await onDelete(addressId);
    if (success) {
      setDeletingId(null);
    }
  };

  const handleDeleteAll = async () => {
    const success = await onDeleteAll();
    if (success) {
      setShowDeleteAllConfirm(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-xl">
                        <MapPin className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white">
                        {language === 'vi' ? t("Common.diaChiGiaoHang") : 'Shipping Addresses'}
                    </h2>
                </div>
                <div className="flex gap-2">
                    {addresses.length > 0 &&
          <button
            onClick={() => setShowDeleteAllConfirm(true)}
            disabled={updating}
            className="px-4 py-2 border-2 border-red-500 text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50">
            
                            {language === 'vi' ? t("Common.xoaTatCa") : 'Delete All'}
                        </button>
          }
                    <button
            onClick={() => setShowForm(true)}
            disabled={updating}
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all disabled:opacity-50 flex items-center gap-2">
            
                        <Plus className="w-5 h-5" />
                        {language === 'vi' ? t("Common.themDiaChi") : 'Add Address'}
                    </button>
                </div>
            </div>

            {/* Address Form */}
            {(showForm || editingAddress) &&
      <div className="mb-6">
                    <AddressForm
          address={editingAddress}
          updating={updating}
          onSubmit={editingAddress ? handleUpdate : handleCreate}
          onCancel={() => {
            setShowForm(false);
            setEditingAddress(null);
          }} />
        
                </div>
      }

            {/* Delete All Confirmation */}
            {showDeleteAllConfirm &&
      <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-500 rounded-xl">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <h3 className="font-semibold text-red-900 dark:text-red-300 mb-2">
                                {language === 'vi' ? t("Common.xacNhanXoaTatCa") : 'Confirm Delete All Addresses'}
                            </h3>
                            <p className="text-sm text-red-800 dark:text-red-400 mb-4">
                                {language === 'vi' ? t("Common.banCoChacChanMuon") :

              'Are you sure you want to delete all addresses? This action cannot be undone.'}
                            </p>
                            <div className="flex gap-2">
                                <button
                onClick={() => setShowDeleteAllConfirm(false)}
                className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                
                                    {language === 'vi' ? t("Common.huy") : 'Cancel'}
                                </button>
                                <button
                onClick={handleDeleteAll}
                disabled={updating}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50">
                
                                    {updating ? language === 'vi' ? t("Common.dangXoa") : 'Deleting...' : language === 'vi' ? t("Common.xoaTatCa") : 'Delete All'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
      }

            {/* Address List */}
            {addresses.length > 0 ?
      <div className="space-y-4">
                    {addresses.map((address) =>
        <div
          key={address.id}
          className={`p-4 border-2 rounded-xl transition-all ${address.isDefault ?
          'border-green-500 bg-green-50 dark:bg-green-900/20' :
          'border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-700'}`
          }>
          
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className="font-semibold text-gray-900 dark:text-white">
                                            {address.fullName}
                                        </h3>
                                        {address.isDefault &&
                <span className="px-2 py-0.5 bg-green-500 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                                                <Check className="w-3 h-3" />
                                                {language === 'vi' ? t("Common.macDinh") : 'Default'}
                                            </span>
                }
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                        {address.phone}
                                    </p>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                        {address.fullAddress}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                        {language === 'vi' ? t("Common.themLuc") : 'Added: '}
                                        {new Date(address.createdAt).toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US')}
                                    </p>
                                </div>

                                <div className="flex gap-2 ml-4">
                                    {!address.isDefault &&
              <button
                onClick={() => onSetDefault(address.id)}
                disabled={updating}
                className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors disabled:opacity-50"
                title={language === 'vi' ? t("Common.datLamMacDinh") : 'Set as default'}>
                
                                            <Check className="w-5 h-5" />
                                        </button>
              }
                                    <button
                onClick={() => setEditingAddress(address)}
                disabled={updating}
                className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors disabled:opacity-50"
                title={language === 'vi' ? t("Common.chinhSua") : 'Edit'}>
                
                                        <Edit className="w-5 h-5" />
                                    </button>
                                    <button
                onClick={() => setDeletingId(address.id)}
                disabled={updating}
                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                title={language === 'vi' ? t("Common.xoa") : 'Delete'}>
                
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Delete Confirmation */}
                            {deletingId === address.id &&
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-500 rounded-lg">
                                    <p className="text-sm text-red-800 dark:text-red-400 mb-3">
                                        {language === 'vi' ? t("Common.banCoChacChanMuon") :

              'Are you sure you want to delete this address?'}
                                    </p>
                                    <div className="flex gap-2">
                                        <button
                onClick={() => setDeletingId(null)}
                className="px-3 py-1.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                
                                            {language === 'vi' ? t("Common.huy") : 'Cancel'}
                                        </button>
                                        <button
                onClick={() => handleDelete(address.id)}
                disabled={updating}
                className="px-3 py-1.5 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50">
                
                                            {updating ? language === 'vi' ? t("Common.dangXoa") : 'Deleting...' : language === 'vi' ? t("Common.xoa") : 'Delete'}
                                        </button>
                                    </div>
                                </div>
          }
                        </div>
        )}
                </div> :

      <div className="text-center py-12">
                    <MapPin className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
                        {language === 'vi' ? t("Common.chuaCoDiaChiNao") : 'No addresses yet'}
                    </p>
                    <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all">
          
                        <Plus className="w-5 h-5" />
                        {language === 'vi' ? t("Common.themDiaChiDauTien") : 'Add your first address'}
                    </button>
                </div>
      }
        </div>);

};