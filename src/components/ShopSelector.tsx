import { useShopStore, Shop } from '../lib/stores/shopStore';

const ShopSelector = () => {
  const { selectedShop, setSelectedShop, getShopName } = useShopStore();

  const shops: { value: Shop; label: string; icon: string }[] = [
    { value: 'sisera', label: 'Sisera', icon: '🏪' },
    { value: 'boss', label: 'Boss', icon: '👔' }
  ];

  return (
    <div className="card">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Winkel Selectie</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {shops.map((shop) => (
          <button
            key={shop.value}
            onClick={() => setSelectedShop(shop.value)}
            className={`${
              selectedShop === shop.value
                ? 'bg-blue-100 border-blue-500 text-blue-900'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            } border-2 rounded-lg p-4 text-center transition-all duration-200`}
          >
            <div className="text-2xl mb-2">{shop.icon}</div>
            <div className="font-medium">{shop.label}</div>
            {selectedShop === shop.value && (
              <div className="text-sm text-blue-600 mt-1">✓ Geselecteerd</div>
            )}
          </button>
        ))}
      </div>
      <div className="mt-4 p-3 bg-blue-50 rounded-md">
        <p className="text-sm text-blue-700">
          <strong>Actieve winkel:</strong> {getShopName(selectedShop)}
        </p>
      </div>
    </div>
  );
};

export default ShopSelector;



