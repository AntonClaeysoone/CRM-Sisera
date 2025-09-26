import { useState } from 'react';
import { useShopStore } from '../../lib/stores/shopStore';
import { useCustomerStore } from '../../lib/stores/customerStore';
import { supabase } from '../../lib/supabase';

interface CustomerOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const CustomerOnboardingModal = ({ isOpen, onClose, onSuccess }: CustomerOnboardingModalProps) => {
  const { selectedShop } = useShopStore();
  const { addCustomer, refreshCustomers } = useCustomerStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    birthDate: '',
    store: selectedShop
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Voornaam is verplicht';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Achternaam is verplicht';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'E-mail is verplicht';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'E-mail adres is ongeldig';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefoonnummer is verplicht';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Adres is verplicht';
    }
    if (!formData.birthDate) {
      newErrors.birthDate = 'Geboortedatum is verplicht';
    }
    if (!formData.store) {
      newErrors.store = 'Winkel selectie is verplicht';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Save to Supabase
      const { data, error } = await supabase
        .from('customers')
        .insert([
          {
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            birth_date: formData.birthDate,
            store: formData.store
          }
        ])
        .select();

      if (error) {
        throw error;
      }

      if (data && data[0]) {
        // Convert Supabase customer to app format and add to local store
        const newCustomer = {
          id: data[0].id,
          firstName: data[0].first_name,
          lastName: data[0].last_name,
          email: data[0].email,
          phone: data[0].phone,
          address: data[0].address,
          birthDate: data[0].birth_date,
          store: data[0].store as 'sisera' | 'boss',
          notes: data[0].notes,
          createdAt: new Date(data[0].created_at),
          updatedAt: new Date(data[0].updated_at)
        };
        
        addCustomer(newCustomer);
      }

      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        birthDate: '',
        store: selectedShop
      });
      setErrors({});
      
      onClose();
      onSuccess?.();
    } catch (error) {
      console.error('Error saving customer:', error);
      setErrors({ general: 'Er is een fout opgetreden bij het opslaan van de klant.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleClose = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      birthDate: '',
      store: selectedShop
    });
    setErrors({});
    setIsSubmitting(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white">
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            🎯 Klant Onboarding - {formData.store === 'sisera' ? 'Sisera' : 'Boss'}
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ✕
          </button>
        </div>

        {/* Modal Content */}
        <p className="text-sm text-gray-600 mb-6">
          Voeg een nieuwe klant toe aan uw {formData.store === 'sisera' ? 'Sisera' : 'Boss'} database.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Winkel selectie */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Winkel Selectie *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, store: 'sisera' as const })}
                className={`p-3 border-2 rounded-lg text-center transition-all duration-200 ${
                  formData.store === 'sisera'
                    ? 'border-blue-500 bg-blue-50 text-blue-900'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="text-lg mb-1">🏪</div>
                <div className="font-medium">Sisera</div>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, store: 'boss' as const })}
                className={`p-3 border-2 rounded-lg text-center transition-all duration-200 ${
                  formData.store === 'boss'
                    ? 'border-blue-500 bg-blue-50 text-blue-900'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="text-lg mb-1">👔</div>
                <div className="font-medium">Boss</div>
              </button>
            </div>
            {errors.store && (
              <p className="mt-1 text-sm text-red-600">{errors.store}</p>
            )}
          </div>

          {/* Naam velden */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Voornaam *
              </label>
              <input
                type="text"
                required
                className={`input-field ${errors.firstName ? 'border-red-500' : ''}`}
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                placeholder="Voornaam van de klant"
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Achternaam *
              </label>
              <input
                type="text"
                required
                className={`input-field ${errors.lastName ? 'border-red-500' : ''}`}
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                placeholder="Achternaam van de klant"
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Contact informatie */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                E-mail *
              </label>
              <input
                type="email"
                required
                className={`input-field ${errors.email ? 'border-red-500' : ''}`}
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="voorbeeld@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefoonnummer *
              </label>
              <input
                type="tel"
                required
                className={`input-field ${errors.phone ? 'border-red-500' : ''}`}
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+32 123 456 789"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>
          </div>

          {/* Adres */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Adres *
            </label>
            <textarea
              rows={3}
              required
              className={`input-field ${errors.address ? 'border-red-500' : ''}`}
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Straat, huisnummer, postcode en plaats"
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-600">{errors.address}</p>
            )}
          </div>

          {/* Geboortedatum */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Geboortedatum *
            </label>
            <input
              type="date"
              required
              className={`input-field ${errors.birthDate ? 'border-red-500' : ''}`}
              value={formData.birthDate}
              onChange={(e) => handleInputChange('birthDate', e.target.value)}
              max={new Date().toISOString().split('T')[0]} // Prevent future dates
            />
            {errors.birthDate && (
              <p className="mt-1 text-sm text-red-600">{errors.birthDate}</p>
            )}
          </div>

          {/* Error display */}
          {errors.general && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{errors.general}</div>
            </div>
          )}

          {/* Submit buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="btn-secondary"
              disabled={isSubmitting}
            >
              Annuleren
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Klant wordt toegevoegd...' : 'Klant Toevoegen'}
            </button>
          </div>
        </form>

        {/* Info box */}
        <div className="mt-6 p-3 bg-blue-50 rounded-md">
          <p className="text-sm text-blue-700">
            <strong>Info:</strong> Deze klant wordt toegevoegd aan de {formData.store === 'sisera' ? 'Sisera' : 'Boss'} database.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomerOnboardingModal;

