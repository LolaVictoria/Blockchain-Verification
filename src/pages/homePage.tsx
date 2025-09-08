import React from 'react';
import { Shield,  ChevronRight, Lock, Zap, Database } from 'lucide-react';
import Footer from '../components/layout/footer';
import Navbar from '../components/layout/navbar';
import { Link } from 'react-router-dom';



  const HomePage: React.FC = () => {
    return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Navigation */}
      <Navbar />

      {/* Page Content */}
      <main>
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 text-blue-400 text-sm mb-6">
              <Lock className="w-4 h-4" />
              <span>Blockchain-Powered Verification</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white via-blue-200 to-cyan-400 bg-clip-text text-transparent">
                Verify Products
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                With Blockchain
              </span>
            </h1>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
              Ensure product authenticity and build consumer trust with our immutable blockchain verification system. 
              Track products from manufacturer to consumer with complete transparency.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link to="/">
            <button 
              className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 transform hover:scale-105 flex items-center space-x-2"
            >
              <span>Get Started</span>
              <ChevronRight className="w-5 h-5" />
            </button>
              </Link>
            {/* <button className="border border-blue-500/30 text-blue-400 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-500/10 transition-all duration-200">
              Watch Demo
            </button> */}
          </div>

          {/* Floating Elements */}
          <div className="relative">
            <div className="absolute -top-10 left-1/4 w-16 h-16 bg-blue-500/20 rounded-full animate-pulse"></div>
            <div className="absolute top-20 right-1/4 w-12 h-12 bg-cyan-500/20 rounded-full animate-pulse delay-1000"></div>
            <div className="absolute -bottom-5 left-1/3 w-8 h-8 bg-blue-400/30 rounded-full animate-pulse delay-500"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Why Choose VerifyChain?
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Our blockchain-powered platform provides unparalleled security and transparency for product verification
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-8 hover:border-blue-400/40 transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Immutable Records</h3>
              <p className="text-slate-400 leading-relaxed">
                Every product verification is permanently recorded on the blockchain, ensuring data integrity and preventing tampering.
              </p>
            </div>
            
            <div className="bg-slate-800/50 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-8 hover:border-blue-400/40 transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Real-time Tracking</h3>
              <p className="text-slate-400 leading-relaxed">
                Track your products in real-time from manufacturing to delivery, providing complete supply chain visibility.
              </p>
            </div>
            
            <div className="bg-slate-800/50 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-8 hover:border-blue-400/40 transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Database className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Global Access</h3>
              <p className="text-slate-400 leading-relaxed">
                Access verification data from anywhere in the world with our decentralized infrastructure and global network.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="group">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                10M+
              </div>
              <div className="text-slate-400 text-lg">Products Verified</div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                50K+
              </div>
              <div className="text-slate-400 text-lg">Active Manufacturers</div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                180+
              </div>
              <div className="text-slate-400 text-lg">Countries Served</div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                99.9%
              </div>
              <div className="text-slate-400 text-lg">Uptime Guarantee</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border-t border-blue-500/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Secure Your Supply Chain?
          </h2>
          <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of manufacturers and developers who trust VerifyChain to protect their products and customers.
          </p>
          {/* <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 transform hover:scale-105"
            >
              Start Free Trial
            </button>
            <button 
              className="border border-blue-400/30 text-blue-400 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-500/10 transition-all duration-200"
            >
              Contact Sales
            </button>
          </div> */}
        </div>
      </section>
      </main>

      {/* Footer - only show on home page */}
      {/* {currentPage === 'home' && ( */}
        <Footer />
      
    </div>
    </>
  );
};

export default HomePage;