import { useWeb3 } from '../../hooks/useWeb3';

export const ConnectionStatus: React.FC = () => {
  const { connectionStatus, isAuthorized } = useWeb3();

  const getStatusStyles = () => {
    switch (connectionStatus.type) {
      case 'connected':
        return isAuthorized 
          ? 'bg-green-50 border-green-200 text-green-800'
          : 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'disconnected':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-orange-50 border-orange-200 text-orange-800';
    }
  };

  const getDotColor = () => {
    switch (connectionStatus.type) {
      case 'connected':
        return isAuthorized ? 'bg-green-400' : 'bg-yellow-400';
      case 'disconnected':
        return 'bg-red-400';
      default:
        return 'bg-orange-400';
    }
  };

  return (
    <div className={`rounded-lg border p-4 mb-3 ${getStatusStyles()}`}>
      <div className="flex items-center gap-3">
        <div className={`h-3 w-3 rounded-full ${getDotColor()} animate-pulse`} />
        <span className="font-medium">{connectionStatus.message}</span>
      </div>
    </div>
  );
};



// components/dashboard/ProductCard.tsx

// components/dashboard/ProductGrid.tsx