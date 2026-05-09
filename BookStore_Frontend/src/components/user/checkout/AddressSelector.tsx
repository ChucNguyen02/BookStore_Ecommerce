import { useState } from 'react';
import { MapPin, Check, Plus, Edit } from 'lucide-react';
import type { AddressResponse } from '../../../types/address.types';
import { AddressForm } from '../profile/AddressForm';
import { useTranslation } from 'react-i18next';

interface AddressSelectorProps {
  addresses: AddressResponse[];
  selectedAddress: AddressResponse | null;
  onSelectAddress: (address: AddressResponse) => void;
  onAddAddress: (data: any) => Promise<boolean>;
  onUpdateAddress: (addressId: string, data: any) => Promise<boolean>;
  updating: boolean;
}

export const AddressSelector = ({
  addresses,
  selectedAddress,
  onSelectAddress,
  onAddAddress,
  onUpdateAddress,
  updating,
}: AddressSelectorProps) => {
  const { t } = useTranslation();
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressResponse | null>(null);

  const handleSubmit = async (data: any) => {
    let success;
    if (editingAddress) {
      success = await onUpdateAddress(editingAddress.id, data);
    } else {
      success = await onAddAddress(data);
    }

    if (success) {
      setShowForm(false);
      setEditingAddress(null);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingAddress(null);
  };

  const handleEdit = (address: AddressResponse) => {
    setEditingAddress(address);
    setShowForm(true);
  };

  if (showForm || editingAddress) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <AddressForm
          address={editingAddress}
          updating={updating}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-serif font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <MapPin className="w-6 h-6 text-green-600 dark:text-green-400" />
          {t('addressSelector.title')}
        </h3>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          {t('addressSelector.addNew')}
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          {t('addressSelector.noAddresses')}
        </div>
      ) : (
        <div className="space-y-3">
          {addresses.map((address) => (
            <div
              key={address.id}
              onClick={() => onSelectAddress(address)}
              className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                selectedAddress?.id === address.id
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {address.fullName}
                    </h4>
                    {address.isDefault && (
                      <span className="px-2 py-0.5 bg-green-500 text-white text-xs font-semibold rounded-full">
                        {t('addressSelector.default')}
                      </span>
                    )}
                    {selectedAddress?.id === address.id && (
                      <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {address.phone}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {address.fullAddress}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(address);
                  }}
                  className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};