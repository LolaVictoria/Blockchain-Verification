import Navbar from "../components/navbar"

const HowItWorksPage: React.FC = () => {
  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
    <div className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-6">How It Works</h1>
          <p className="text-slate-400 text-xl">Simple steps to secure your products with blockchain technology</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-slate-800/50 border border-blue-500/20 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-bold text-white">1</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">Register Product</h3>
            <p className="text-slate-400">Manufacturers register their products on our blockchain platform with unique identifiers.</p>
          </div>
          
          <div className="bg-slate-800/50 border border-blue-500/20 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-bold text-white">2</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">Generate Serial Token</h3>
            <p className="text-slate-400"> Each product receives a unique serial number token linked to its blockchain record for easy verification.</p>
          </div>
          
          <div className="bg-slate-800/50 border border-blue-500/20 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-bold text-white">3</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">Verify Instantly</h3>
            <p className="text-slate-400">Consumers enter the serial token to instantly verify product authenticity and view its complete journey.</p>
          </div>
        </div>
      </div>
    </div>
    </div>
    </>
  );
};
export default HowItWorksPage;