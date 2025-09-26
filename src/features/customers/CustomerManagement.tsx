import { useState, useEffect } from 'react';
import { useCustomerStore } from '../../lib/stores/customerStore';
import { useShopStore } from '../../lib/stores/shopStore';
import { Customer } from '../../types';
import CustomerOnboardingModal from '../../components/customer/CustomerOnboardingModal';
import ShopSelector from '../../components/ShopSelector';

const CustomerManagement = () => {
  const { customers, addCustomer, updateCustomer, deleteCustomer, loadCustomers, isLoading, error } = useCustomerStore();
  const { selectedShop, getShopDisplayName } = useShopStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Load customers from Supabase on mount and when shop changes
  useEffect(() => {
    loadCustomers();
  }, [loadCustomers, selectedShop]);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    birthDate: '',
    notes: ''
  });

  // Filter customers by shop first, then by search term
  const shopCustomers = customers.filter(customer => customer.store === selectedShop);

  const filteredCustomers = shopCustomers.filter(customer =>
    `${customer.firstName} ${customer.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingCustomer) {
        await updateCustomer(editingCustomer.id, formData);
        setEditingCustomer(null);
      } else {
        await addCustomer({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          birthDate: formData.birthDate,
          store: selectedShop,
          notes: formData.notes
        });
      }
      
      setFormData({ firstName: '', lastName: '', email: '', phone: '', address: '', birthDate: '', notes: '' });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error saving customer:', error);
    }
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData({
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      phone: customer.phone,
      address: customer.address || '',
      birthDate: customer.birthDate || '',
      notes: customer.notes || ''
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Weet je zeker dat je deze klant wilt verwijderen?')) {
      try {
        await deleteCustomer(id);
      } catch (error) {
        console.error('Error deleting customer:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({ firstName: '', lastName: '', email: '', phone: '', address: '', birthDate: '', notes: '' });
    setEditingCustomer(null);
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Klantenbeheer - {getShopDisplayName()}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Beheer uw {getShopDisplayName()} klantendatabase
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowOnboarding(true)}
            className="btn-primary"
          >
            🎯 Klant Onboarding
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-secondary"
          >
            ➕ Snelle Toevoeging
          </button>
          <button
            onClick={() => loadCustomers()}
            className="btn-secondary"
          >
            🔄 Herlaad
          </button>
        </div>
      </div>

      {/* Shop Selector */}
      <ShopSelector />

      {/* Search */}
      <div className="card">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Zoek klanten op naam, e-mail of telefoon..."
              className="input-field"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="text-sm text-gray-500">
            {filteredCustomers.length} van {shopCustomers.length} {getShopDisplayName()} klanten
          </div>
        </div>
      </div>

      {/* Customer Onboarding Modal */}
      <CustomerOnboardingModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onSuccess={() => {
          setShowOnboarding(false);
          loadCustomers();
        }}
      />

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="card">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            {editingCustomer ? 'Klant Bewerken' : 'Nieuwe Klant Toevoegen'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Voornaam *
                </label>
                <input
                  type="text"
                  required
                  className="input-field"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Achternaam *
                </label>
                <input
                  type="text"
                  required
                  className="input-field"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-mail *
                </label>
                <input
                  type="email"
                  required
                  className="input-field"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefoon *
                </label>
                <input
                  type="tel"
                  required
                  className="input-field"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adres
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notities
              </label>
              <textarea
                rows={3}
                className="input-field"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={resetForm}
                className="btn-secondary"
              >
                Annuleren
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                {editingCustomer ? 'Bijwerken' : 'Toevoegen'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="card bg-red-50 border-red-200">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="card">
          <div className="text-center py-8">
            <div className="text-gray-500">Klanten worden geladen...</div>
          </div>
        </div>
      )}

      {/* Store Status Info */}
      <div className="card bg-blue-50 border-blue-200">
        <h3 className="text-lg font-medium text-blue-900 mb-2">Status</h3>
        <p className="text-sm text-blue-700">
          <strong>Huidige winkel:</strong> {getShopDisplayName()}
          <br />
          <strong>Klanten voor {getShopDisplayName()}:</strong> {shopCustomers.length}
          <br />
          <strong>Klanten na zoeken:</strong> {filteredCustomers.length}
          <br />
          {isLoading && "⏳ Laden..."}
        </p>
      </div>

      {/* Customers Table */}
      <div className="card">
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Naam
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  E-mail
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Telefoon
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Adres
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Geboortedatum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Toegevoegd
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acties
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {customer.firstName} {customer.lastName}
                    </div>
                    {customer.notes && (
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {customer.notes}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {customer.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {customer.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 max-w-xs truncate">
                      {customer.address || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {customer.birthDate ? new Date(customer.birthDate).toLocaleDateString('nl-BE') : '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(customer.createdAt).toLocaleDateString('nl-BE')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(customer)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Bewerken
                      </button>
                      <button
                        onClick={() => handleDelete(customer.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Verwijderen
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredCustomers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">
              {searchTerm ? 'Geen klanten gevonden voor deze zoekterm.' : 'Nog geen klanten toegevoegd.'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerManagement;
