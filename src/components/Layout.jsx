import React from 'react';


const Layout = ({ children }) => {
  return (
    <div className="min-h-screen text-slate-100 font-sans selection:bg-indigo-500/30 relative">
      <header className="border-b border-slate-800/60 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20 p-1">
              <img src="/logo.png" alt="ContractCanvas" className="w-full h-full object-contain" />
            </div>
            <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              ContractCanvas
            </span>
          </div>
          <nav className="flex items-center gap-6 text-sm font-medium text-slate-400">
            <a href="#" className="hover:text-white transition-colors">Documentation</a>
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8 relative z-20">
        {children}
      </main>
      <footer className="border-t border-slate-800/60 py-8 mt-12 relative z-20">
        <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} ContractCanvas. Open source smart contract visualizer.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
