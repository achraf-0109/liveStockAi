import React from 'react';
import { Leaf } from 'lucide-react';
import useAppStore from '../../store/useAppStore';

export default function Navbar() {
  const { currentView, setView } = useAppStore();

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div 
            className="flex items-center space-x-2 cursor-pointer group"
            onClick={() => setView('home')}
          >
            <div className="p-2 bg-agricultural-green/10 rounded-xl group-hover:bg-agricultural-green/20 transition-colors">
              <Leaf className="w-6 h-6 text-agricultural-green" />
            </div>
            <span className="font-bold text-xl text-slate-800 tracking-tight">
              Livestock<span className="text-agricultural-green">AI</span>
            </span>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-4">
            <button 
              onClick={() => setView('home')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${currentView === 'home' ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
            >
              Home
            </button>
            <button 
              onClick={() => setView('assistant')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${['assistant', 'generating', 'report'].includes(currentView) ? 'bg-agricultural-green text-white shadow-md' : 'text-slate-600 hover:bg-agricultural-green/10 hover:text-agricultural-green-dark'}`}
            >
              AI Assistant
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
