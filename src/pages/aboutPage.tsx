import Navbar from "../components/layout/navbar"

const AboutPage: React.FC = () => {
  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
    <div className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-6">About VerifyChain</h1>
          <p className="text-slate-400 text-xl">Leading the future of product verification</p>
        </div>
        
        <div className="bg-slate-800/50 border border-blue-500/20 rounded-2xl p-12 mb-12">
          <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
          <p className="text-slate-300 text-lg leading-relaxed mb-6">
            VerifyChain is dedicated to eliminating counterfeit products and building trust in global supply chains through blockchain technology. 
            We provide manufacturers and consumers with the tools to verify product authenticity instantly and transparently.
          </p>
          <p className="text-slate-300 text-lg leading-relaxed">
            Founded in 2023, we've grown to serve over 50,000 manufacturers worldwide, protecting millions of products and building consumer confidence.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-slate-800/50 border border-blue-500/20 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">Our Vision</h3>
            <p className="text-slate-300">A world where every product can be trusted, verified, and traced back to its authentic source.</p>
          </div>
          
          <div className="bg-slate-800/50 border border-blue-500/20 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">Our Values</h3>
            <p className="text-slate-300">Transparency, security, innovation, and trust are the core principles that drive everything we do.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  </>
  );
};
export default  AboutPage;