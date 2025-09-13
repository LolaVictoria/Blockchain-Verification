import { useState, useEffect } from 'react';
import { useCustomerAnalytics } from '../../hooks/useAnalytics';
import {VerificationHistoryChart} from './customer/verificationHistoryChart';
import { CustomerDeviceBreakdownComponent } from './customer/customerDeviceBreakdownChart';
// import { PlatformTrustSection } from './customer/platformTrustSection';
import { VerificationLogsTable } from './customer/verificationLogsTable';
import { CounterfeitReportsTable } from './customer/counterfeitReportsTable';
import { CustomerInsights } from './customer/customerInsights';
import { AlertTriangle } from 'lucide-react';

const CustomerAnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = useState<string>('30d');
  
  const {
    loading,
    error,
    customerHistory,
    customerDevices,
    verificationLogs,
    counterfeitReports,
    loadCustomerAnalytics,
    setError
  } = useCustomerAnalytics(timeRange);

  useEffect(() => {
    loadCustomerAnalytics();
  }, [loadCustomerAnalytics]);

  // Calculate customer metrics from API data
  const totalCustomerVerifications = customerHistory.reduce((sum, day) => sum + day.verifications, 0);
  const totalAuthentic = customerHistory.reduce((sum, day) => sum + day.authentic, 0);
  const totalCounterfeit = customerHistory.reduce((sum, day) => sum + day.counterfeit, 0);
  
  const customerAuthenticRate = totalCustomerVerifications > 0 
    ? ((totalAuthentic / totalCustomerVerifications) * 100).toFixed(1)
    : '0';
    
  const avgVerificationTime = totalCustomerVerifications > 0
    ? (customerHistory.reduce((sum, day) => sum + (day.avgTime * day.verifications), 0) / totalCustomerVerifications).toFixed(2)
    : '0';

  const totalDevicesVerified = customerDevices.reduce((sum, device) => sum + device.count, 0);
  // const platformTrustScore = '98.1'; 

  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 ">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading analytics...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
              <div>
                <h3 className="text-red-800 font-medium">Error Loading Analytics</h3>
                <p className="text-red-700 text-sm">{error}</p>
                <button 
                  onClick={() => {
                    setError(null);
                    loadCustomerAnalytics();
                  }}
                  className="mt-2 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 ">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My Verification Analytics
          </h1>
          <p className="text-gray-600">
            Track your product verification history and platform insights
          </p>
        </div>

        {/* Time Range Filter */}
        <div className=" mb-6">
          <label className="text-sm font-medium text-gray-700 text-center ">Time Range:</label>
          <div className='flex flex-col lg:flex-row space-x-2'>

          {(['7d', '30d', '90d', '1y'] as const).map((range) => (
            <button
            key={range}
              onClick={() => setTimeRange(range)}
              className={`w-40 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeRange === range
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {range === '7d' ? 'Last 7 Days' : 
               range === '30d' ? 'Last 30 Days' : 
               range === '90d' ? 'Last 90 Days' : 'Last Year'}
            </button>

          ))}
          </div>
        </div>

       
        

        {/* Customer Verification Activity */}
        <div className="grid grid-cols-1 gap-y-6 mb-8">
          <CustomerDeviceBreakdownComponent data={customerDevices} />
        

        {/* Platform Trust & Security */}
        {/* <PlatformTrustSection trustScore={platformTrustScore} /> */}

        {/* Verification Logs */}
        <VerificationLogsTable logs={verificationLogs} />

        {/* Counterfeit Reports */}
        <CounterfeitReportsTable reports={counterfeitReports} />
        <VerificationHistoryChart data={customerHistory} />

        {/* Customer Insights */}
        <CustomerInsights 
          authenticRate={customerAuthenticRate}
          totalVerifications={totalCustomerVerifications}
          avgTime={avgVerificationTime}
          totalDevices={totalDevicesVerified}
          // trustScore={platformTrustScore}
          totalCounterfeit={totalCounterfeit}
        />
        </div>
      </div>
    </div>
  );
};

export default CustomerAnalyticsDashboard;