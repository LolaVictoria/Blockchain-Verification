//unused component for now
import { Shield } from 'lucide-react';

interface Props {
  trustScore: string;
}

export const PlatformTrustSection = ({ trustScore }: Props) => {
  const platformTrustMetrics = [
    { metric: 'Platform Uptime', score: 99.9, color: '#10B981' },
    { metric: 'Data Security', score: 98.5, color: '#3B82F6' },
    { metric: 'Verification Speed', score: 97.8, color: '#F59E0B' },
    { metric: 'User Satisfaction', score: 96.2, color: '#8B5CF6' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <h3 className="text-xl font-semibold mb-4">Platform Security & Trust</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {platformTrustMetrics.map((metric, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-gray-700">{metric.metric}</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full" 
                    style={{ 
                      width: `${metric.score}%`, 
                      backgroundColor: metric.color 
                    }}
                  ></div>
                </div>
                <span className="text-sm font-medium w-12">{metric.score}%</span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col justify-center items-center">
          <div className="text-4xl font-bold text-green-600">{trustScore}%</div>
          <p className="text-gray-600 text-center">Platform Trust Score</p>
          <div className="flex items-center mt-2 text-green-600">
            <Shield className="h-5 w-5 mr-1" />
            <span className="text-sm">Blockchain Secured</span>
          </div>
        </div>
      </div>
    </div>
  );
};