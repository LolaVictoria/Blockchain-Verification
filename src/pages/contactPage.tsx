import Navbar from "../components/navbar"

const ContactPage: React.FC = () => {
  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
    <div className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-6">Contact Us</h1>
          <p className="text-slate-400 text-xl">Get in touch with our team</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12">
          <div className="bg-slate-800/50 border border-blue-500/20 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Send us a message</h2>
            <form className="space-y-6">
              <div>
                <label className="block text-slate-300 mb-2">Name</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-blue-400 focus:outline-none"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-2">Email</label>
                <input 
                  type="email" 
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-blue-400 focus:outline-none"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-2">Message</label>
                <textarea 
                  rows={4}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-blue-400 focus:outline-none"
                  placeholder="Your message"
                ></textarea>
              </div>
              <button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all">
                Send Message
              </button>
            </form>
          </div>
          
          <div className="space-y-8">
            <div className="bg-slate-800/50 border border-blue-500/20 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-3">Email</h3>
              <p className="text-slate-300">support@verifychain.com</p>
            </div>
            
            <div className="bg-slate-800/50 border border-blue-500/20 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-3">Phone</h3>
              <p className="text-slate-300">+1 (555) 123-4567</p>
            </div>
            
            <div className="bg-slate-800/50 border border-blue-500/20 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-3">Office</h3>
              <p className="text-slate-300">123 Blockchain Street<br />Tech City, TC 12345</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
    </>
  );
};
export default ContactPage;