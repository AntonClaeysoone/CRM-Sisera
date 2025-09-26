import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCustomerStore } from '../../lib/stores/customerStore';
import { useShopStore } from '../../lib/stores/shopStore';
import ShopSelector from '../../components/ShopSelector';
import SupabaseDebug from '../../components/debug/SupabaseDebug';

const Dashboard = () => {
  const navigate = useNavigate();
  const { customers, loadCustomers } = useCustomerStore();
  const { selectedShop, getShopDisplayName } = useShopStore();

  // Load customers from Supabase on mount
  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  // Shop-specific customer filtering
  const shopCustomers = customers.filter(customer => customer.store === selectedShop);

  const stats = [
    {
      name: 'Totaal Klanten',
      value: shopCustomers.length,
      icon: '👥',
      color: 'bg-blue-500'
    },
    {
      name: 'Nieuwe Klanten (Deze Maand)',
      value: shopCustomers.filter(c => {
        const now = new Date();
        const customerDate = new Date(c.createdAt);
        return customerDate.getMonth() === now.getMonth() && 
               customerDate.getFullYear() === now.getFullYear();
      }).length,
      icon: '🆕',
      color: 'bg-green-500'
    },
    {
      name: 'VIP Klanten',
      value: shopCustomers.filter(c => c.notes?.toLowerCase().includes('vip')).length,
      icon: '⭐',
      color: 'bg-yellow-500'
    },
    {
      name: 'Online Klanten',
      value: shopCustomers.filter(c => c.notes?.toLowerCase().includes('online')).length,
      icon: '💻',
      color: 'bg-purple-500'
    }
  ];

  const recentCustomers = shopCustomers
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Dashboard - {getShopDisplayName()}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Overzicht van uw {getShopDisplayName()} CRM systeem
          </p>
        </div>
        <button
          onClick={() => navigate('/register')}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
        >
          📝 Klant Registratie
        </button>
      </div>

      {/* Shop Selector */}
      <ShopSelector />

      {/* Debug - Remove in production */}
      <SupabaseDebug />

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="card">
            <div className="flex items-center">
              <div className={`flex-shrink-0 p-3 rounded-md ${stat.color}`}>
                <span className="text-white text-xl">{stat.icon}</span>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {stat.name}
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stat.value}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Customers */}
      <div className="card">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recente Klanten</h2>
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
                  Toegevoegd
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {customer.firstName} {customer.lastName}
                    </div>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(customer.createdAt).toLocaleDateString('nl-BE')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Snelle Acties</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <button className="btn-primary text-center">
            ➕ Nieuwe Klant Toevoegen
          </button>
          <button className="btn-secondary text-center">
            📊 Rapport Genereren
          </button>
          <button className="btn-secondary text-center">
            📧 E-mail Campagne
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
