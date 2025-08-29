import React, { useState, useRef, useEffect } from 'react';
import { Package2, ExternalLink, MoreVertical, ArrowRightLeft, Eye, History,  Copy } from 'lucide-react';
import type { Product } from '../../../types/dashboard';

interface ProductCardProps {
  product: Product;
  onTransferOwnership: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onTransferOwnership }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCopySerialNumber = async () => {
    try {
      await navigator.clipboard.writeText(product.serial_number);
      // You can add a toast notification here
      setShowMenu(false);
    } catch (err) {
      console.error('Failed to copy serial number:', err);
    }
  };

  const handleViewDetails = () => {
    // Implement view details functionality
    console.log('View details for:', product.serial_number);
    setShowMenu(false);
  };

  const handleViewHistory = () => {
    // Implement view ownership history functionality
    console.log('View history for:', product.serial_number);
    setShowMenu(false);
  };

  // const handleVerifyAuthenticity = () => {
  //   // Implement verify authenticity functionality
  //   console.log('Verify authenticity for:', product.serial_number);
  //   setShowMenu(false);
  // };

  const handleTransferOwnership = () => {
    onTransferOwnership(product);
    setShowMenu(false);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-6 relative">
      {/* Menu Button */}
      <div className="absolute top-4 right-4" ref={menuRef}>
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Product options"
        >
          <MoreVertical className="h-5 w-5 text-gray-600" />
        </button>

        {/* Dropdown Menu */}
        {showMenu && (
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
            <button
              onClick={handleViewDetails}
              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Eye className="h-4 w-4" />
              View Details
            </button>

            <button
              onClick={handleViewHistory}
              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <History className="h-4 w-4" />
              Ownership History
            </button>
            

          {/* <Link to="/verify">
            <button
              onClick={handleVerifyAuthenticity}
              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Shield className="h-4 w-4" />
              Verify Authenticity
            </button>
           </Link> */}

            <button
              onClick={handleCopySerialNumber}
              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Copy className="h-4 w-4" />
              Copy Serial Number
            </button>

            <hr className="my-2 border-gray-100" />

            <button
              onClick={handleTransferOwnership}
              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-orange-600 hover:bg-orange-50 transition-colors"
            >
              <ArrowRightLeft className="h-4 w-4" />
              Transfer Ownership
            </button>
          </div>
        )}
      </div>

      {/* Product Content */}
      <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg mb-4 mx-auto">
        <Package2 className="h-8 w-8 text-blue-600" />
      </div>

      <div className="text-center">
        <h4 className="font-semibold text-lg text-gray-900 mb-2">
          {product.product_name || `${product.brand} ${product.model}`}
        </h4>
        <div className="space-y-2 mb-4">
          <p className="text-sm text-gray-600">
            <span className="font-medium">SN:</span> {product.serial_number}
          </p>
          {product.category && (
            <p className="text-sm text-gray-600">{product.category}</p>
          )}
          {product.device_type && (
            <p className="text-sm text-gray-600">{product.device_type}</p>
          )}
        </div>

        {product.transaction_hash && (
          <a
            href={`https://sepolia.etherscan.io/tx/${product.transaction_hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            View on Blockchain
            <ExternalLink className="ml-1 h-4 w-4" />
          </a>
        )}
      </div>
    </div>
  );
};