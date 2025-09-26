import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useShopStore } from '../../lib/stores/shopStore';
import { useCustomerStore } from '../../lib/stores/customerStore';
import { supabase } from '../../lib/supabase';
import siseraLogo from '../../images/LOGO SISERA PNG.png';
import bossLogo from '../../images/boss.png';

const CustomerRegistration = () => {
  const navigate = useNavigate();
  const { selectedShop, setSelectedShop } = useShopStore();
  const { addCustomer } = useCustomerStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    birthDate: '',
    store: selectedShop,
    acceptMarketing: false,
    acceptTerms: false
  });

  // Update form data when shop changes
  useEffect(() => {
    setFormData(prev => ({ ...prev, store: selectedShop }));
  }, [selectedShop]);

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
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'U moet akkoord gaan met de algemene voorwaarden';
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
        const newCustomer = {
          id: data[0].id,
          firstName: data[0].first_name,
          lastName: data[0].last_name,
          email: data[0].email,
          phone: data[0].phone,
          address: data[0].address,
          birthDate: data[0].birth_date,
          store: data[0].store as 'sisera' | 'boss',
          notes: data[0].notes || '',
          createdAt: new Date(data[0].created_at),
          updatedAt: new Date(data[0].updated_at)
        };
        
        addCustomer(newCustomer);
        
        setSuccessMessage('Gelukt! Uw gegevens zijn succesvol geregistreerd.');
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          address: '',
          birthDate: '',
          store: selectedShop,
          acceptMarketing: false,
          acceptTerms: false
        });
        setErrors({});
        
        // Reset success message after 5 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 5000);
      }
    } catch (error) {
      console.error('Error saving customer:', error);
      setErrors({ general: 'Er is een fout opgetreden. Probeer het later opnieuw.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: '' }));
    }
  };

  const storeDisplayName = selectedShop === 'sisera' ? 'Sisera' : 'Boss';

  return (
    <motion.div 
      className="h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div 
        className="w-full max-w-2xl"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {/* Close Button */}
        <motion.div 
          className="absolute top-0 right-0 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <motion.button
            onClick={() => navigate('/dashboard')}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.button>
        </motion.div>

        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Registreer als klant
          </h1>
          <p className="text-lg text-gray-600">
            Word lid en profiteer van voordelen
          </p>
        </motion.div>

        {/* Main Form Card */}
        <motion.div 
          className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* Store Selection */}
          <motion.div 
            className="mb-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <label className="block text-lg font-semibold text-gray-800 mb-4 text-center">
              Selecteer uw winkel *
            </label>
            <div className="grid grid-cols-2 gap-4">
              <motion.button
                type="button"
                onClick={() => setSelectedShop('sisera')}
                className={`p-4 border-2 rounded-lg text-center transition-all duration-300 transform relative overflow-hidden ${
                  selectedShop === 'sisera'
                    ? 'border-blue-500 bg-blue-50 shadow-lg'
                    : 'border-gray-300 bg-white hover:bg-blue-50 hover:border-blue-300'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                animate={{
                  scale: selectedShop === 'sisera' ? 1.01 : 1,
                }}
              >
                <div className="flex items-center justify-center">
                  <img 
                    src={siseraLogo}
                    alt="Sisera"
                    className="w-20 h-20 object-contain"
                  />
                </div>
                {selectedShop === 'sisera' && (
                  <motion.div
                    className="absolute inset-0 border-2 border-blue-500 rounded-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.button>
              <motion.button
                type="button"
                onClick={() => setSelectedShop('boss')}
                className={`p-4 border-2 rounded-lg text-center transition-all duration-300 transform relative overflow-hidden ${
                  selectedShop === 'boss'
                    ? 'border-blue-500 bg-blue-50 shadow-lg'
                    : 'border-gray-300 bg-white hover:bg-blue-50 hover:border-blue-300'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                animate={{
                  scale: selectedShop === 'boss' ? 1.01 : 1,
                }}
              >
                <div className="flex items-center justify-center">
                  <img 
                    src={bossLogo}
                    alt="Boss"
                    className="w-20 h-20 object-contain"
                  />
                </div>
                {selectedShop === 'boss' && (
                  <motion.div
                    className="absolute inset-0 border-2 border-blue-500 rounded-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.button>
            </div>
            <AnimatePresence>
              {errors.store && (
                <motion.p 
                  className="mt-3 text-sm text-red-600 text-center"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  {errors.store}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Success Message */}
          <AnimatePresence>
            {successMessage && (
              <motion.div 
                className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-center"
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-green-600 text-lg">✅ {successMessage}</div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Message */}
          <AnimatePresence>
            {errors.general && (
              <motion.div 
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-center"
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-red-600 text-lg">❌ {errors.general}</div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Voornaam *
                </label>
                <input
                  type="text"
                  required
                  className={`w-full px-3 py-2 text-sm border-2 rounded-lg transition-colors duration-200 ${
                    errors.firstName 
                      ? 'border-red-400 focus:border-red-500 focus:ring-red-200' 
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                  } focus:outline-none focus:ring-2`}
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="Uw voornaam"
                />
                {errors.firstName && (
                  <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Achternaam *
                </label>
                <input
                  type="text"
                  required
                  className={`w-full px-3 py-2 text-sm border-2 rounded-lg transition-colors duration-200 ${
                    errors.lastName 
                      ? 'border-red-400 focus:border-red-500 focus:ring-red-200' 
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                  } focus:outline-none focus:ring-2`}
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Uw achternaam"
                />
                {errors.lastName && (
                  <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-mail *
                </label>
                <input
                  type="email"
                  required
                  className={`w-full px-3 py-2 text-sm border-2 rounded-lg transition-colors duration-200 ${
                    errors.email 
                      ? 'border-red-400 focus:border-red-500 focus:ring-red-200' 
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                  } focus:outline-none focus:ring-2`}
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="uw.email@voorbeeld.com"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefoon *
                </label>
                <input
                  type="tel"
                  required
                  className={`w-full px-3 py-2 text-sm border-2 rounded-lg transition-colors duration-200 ${
                    errors.phone 
                      ? 'border-red-400 focus:border-red-500 focus:ring-red-200' 
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                  } focus:outline-none focus:ring-2`}
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+32 123 456 789"
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
                )}
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Adres *
              </label>
              <textarea
                rows={2}
                required
                className={`w-full px-3 py-2 text-sm border-2 rounded-lg transition-colors duration-200 resize-none ${
                  errors.address 
                    ? 'border-red-400 focus:border-red-500 focus:ring-red-200' 
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                } focus:outline-none focus:ring-2`}
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Straat, huisnummer, postcode en plaats"
              />
              {errors.address && (
                <p className="mt-1 text-xs text-red-600">{errors.address}</p>
              )}
            </div>

            {/* Birth Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Geboortedatum *
              </label>
              <input
                type="date"
                required
                className={`w-full px-3 py-2 text-sm border-2 rounded-lg transition-colors duration-200 ${
                  errors.birthDate 
                    ? 'border-red-400 focus:border-red-500 focus:ring-red-200' 
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                } focus:outline-none focus:ring-2`}
                value={formData.birthDate}
                onChange={(e) => handleInputChange('birthDate', e.target.value)}
                max={new Date().toISOString().split('T')[0]}
              />
              {errors.birthDate && (
                <p className="mt-1 text-xs text-red-600">{errors.birthDate}</p>
              )}
            </div>

            {/* Marketing Opt-in */}
            <div className="pt-3">
              <label className="flex items-start space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.acceptMarketing}
                  onChange={(e) => handleInputChange('acceptMarketing', e.target.checked)}
                  className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-1"
                />
                <span className="text-xs text-gray-700 leading-relaxed">
                  Ja, ik wil op de hoogte gehouden worden van aanbiedingen en nieuws via e-mail
                </span>
              </label>
            </div>

            {/* Terms & Conditions */}
            <div className="pt-1">
              <label className="flex items-start space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={formData.acceptTerms}
                  onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
                  className={`mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-1 ${errors.acceptTerms ? 'border-red-500' : ''}`}
                />
                <span className={`text-xs leading-relaxed ${errors.acceptTerms ? 'text-red-700' : 'text-gray-700'}`}>
                  Ik ben akkoord met de{' '}
                  <span className="text-blue-600 underline hover:text-blue-700 cursor-pointer">
                    algemene voorwaarden
                  </span>{' '}
                  en het{' '}
                  <span className="text-blue-600 underline hover:text-blue-700 cursor-pointer">
                    privacybeleid
                  </span>
                </span>
              </label>
              {errors.acceptTerms && (
                <p className="mt-1 text-xs text-red-600">{errors.acceptTerms}</p>
              )}
            </div>

            {/* Submit Button */}
            <motion.div 
              className="pt-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-6 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed rounded-lg shadow-lg transition-all duration-200"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                animate={isSubmitting ? { scale: 0.98 } : {}}
              >
                {isSubmitting ? 
                  <motion.span 
                    className="flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <motion.svg 
                      className="h-6 w-6 text-white mr-3" 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </motion.svg>
                    Verwerken...
                  </motion.span>
                : 
                  '✅ Registreer mij als klant'
                }
              </motion.button>
            </motion.div>
          </form>

          {/* Info Footer */}
          <motion.div 
            className="mt-8 p-4 bg-blue-50 rounded-lg text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            <p className="text-sm text-blue-700">
              🛡️ Uw gegevens worden veilig opgeslagen en alleen gebruikt voor onze klantenservice
            </p>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.div 
          className="text-center mt-8 text-gray-500"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <p className="text-sm">© 2024 {storeDisplayName} - Klant Registratie Systeem</p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default CustomerRegistration;
