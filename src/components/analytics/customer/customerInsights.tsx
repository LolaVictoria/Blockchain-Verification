import { CheckCircle, Clock, TrendingUp } from 'lucide-react';

interface Props {
  authenticRate: string;
  totalVerifications: number;
  avgTime: string;
  totalDevices: number;
  // trustScore: string;
  totalCounterfeit: number;
}

export const CustomerInsights = ({ 
  authenticRate, 
  totalVerifications, 
  avgTime, 
  totalDevices, 
  // trustScore, 
  totalCounterfeit 
}: Props) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-semibold mb-4">Your Verification Insights</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
          <div>
            <p className="font-medium text-green-800">Great Track Record</p>
            <p className="text-sm text-green-700">
              {authenticRate}% of your {totalVerifications} verified products are authentic
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
          <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <p className="font-medium text-blue-800">Fast Verification</p>
            <p className="text-sm text-blue-700">
              Average verification time: {avgTime}s across {totalDevices} devices
            </p>
          </div>
        </div>
        {/* <div className="flex items-start space-x-3 p-4 bg-purple-50 rounded-lg">
          <Shield className="h-5 w-5 text-purple-600 mt-0.5" />
          <div>
            <p className="font-medium text-purple-800">Secure Platform</p>
            <p className="text-sm text-purple-700">
              Your data is protected by blockchain technology with {trustScore}% trust score
            </p>
          </div>
        </div> */}
        <div className="flex items-start space-x-3 p-4 bg-orange-50 rounded-lg">
          <TrendingUp className="h-5 w-5 text-orange-600 mt-0.5" />
          <div>
            <p className="font-medium text-orange-800">Security Awareness</p>
            <p className="text-sm text-orange-700">
              You've detected {totalCounterfeit} counterfeit products, protecting yourself and others
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
