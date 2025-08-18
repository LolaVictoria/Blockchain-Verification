import RegisterProductForm from "../components/manufacturerDashboard/registerProductForm";
import ProductList from "../components/manufacturerDashboard/productList"
import { useState } from "react";

const ManufacturerDashboard: React.FC = () => {
  const [refreshProducts, setRefreshProducts] = useState(0);

  return (
    <div className="space-y-8">
      <RegisterProductForm onProductRegistered={() => setRefreshProducts(prev => prev + 1)} />
      <div key={refreshProducts}>
        <ProductList />
      </div>
    </div>
  );
};
export default ManufacturerDashboard;