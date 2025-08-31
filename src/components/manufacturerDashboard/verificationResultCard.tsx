const VerificationResultCard: React.FC<{
  type: 'authentic' | 'counterfeit' | 'not-found' | 'error';
  children: React.ReactNode;
 }> = ({ type, children }) => {
  const styles = {
    authentic: 'bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 shadow-md',
    counterfeit: 'bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 shadow-md',
    'not-found': 'bg-gradient-to-r from-gray-50 to-slate-50 border-l-4 border-gray-400 shadow-md',
    error: 'bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 shadow-md'
  };

  return (
    <div className={`p-6 rounded-xl my-4 ${styles[type]}`}>
      {children}
    </div>
  );
};
export default VerificationResultCard