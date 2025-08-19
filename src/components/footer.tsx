import { Shield } from "lucide-react"
import { Link } from "react-router-dom";


const Footer: React.FC = () => {
    return (
        <footer className="bg-slate-900/80 border-t border-blue-500/20 py-12 px-4">
                  <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-8">
                      <div>
                        <div className="flex items-center space-x-2 mb-4">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center">
                            <Shield className="w-5 h-5 text-white" />
                          </div>
                          <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                            VerifyChain
                          </span>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed">
                          Securing global supply chains with blockchain technology and innovative verification solutions.
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-white font-semibold mb-4">Product</h3>
                        <div className="space-y-2 text-sm">
                          <Link to="/how-it-works">
                          <button className="block text-slate-400 hover:text-blue-400 transition-colors">Features</button>
                          </Link>
                          <button className="block text-slate-400 hover:text-blue-400 transition-colors">Pricing</button>
                          <button className="block text-slate-400 hover:text-blue-400 transition-colors">API</button>
                          <button className="block text-slate-400 hover:text-blue-400 transition-colors">Documentation</button>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-white font-semibold mb-4">Company</h3>
                        <div className="space-y-2 text-sm">
                          <Link to="/about">
                          <button className="block text-slate-400 hover:text-blue-400 transition-colors">About Us</button>
                          </Link>
                          <button className="block text-slate-400 hover:text-blue-400 transition-colors">Careers</button>
                          <button className="block text-slate-400 hover:text-blue-400 transition-colors">Blog</button>
                          <button className="block text-slate-400 hover:text-blue-400 transition-colors">Press</button>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-white font-semibold mb-4">Support</h3>
                        <div className="space-y-2 text-sm">
                          <button className="block text-slate-400 hover:text-blue-400 transition-colors">Help Center</button>
                          <Link to="/contact">
                          <button className="block text-slate-400 hover:text-blue-400 transition-colors">Contact</button>
                          </Link>
                          <button className="block text-slate-400 hover:text-blue-400 transition-colors">Privacy</button>
                          <button className="block text-slate-400 hover:text-blue-400 transition-colors">Terms</button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t border-slate-700 mt-8 pt-8 text-center text-slate-400 text-sm">
                      <p>&copy; 2025 VerifyChain. All rights reserved.</p>
                    </div>
                  </div>
                </footer>
    )
} 
export default Footer;