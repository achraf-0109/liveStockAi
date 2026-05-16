import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Activity, CloudOff, PiggyBank, FileText, MousePointer2, BrainCircuit, ClipboardCheck } from 'lucide-react';
import useAppStore from '../store/useAppStore';
import { Button } from '../components/ui/Button';
import farmBackground from './resources/farmgreen.png';

export default function Home() {
  const setView = useAppStore((state) => state.setView);
  const [isExpanded, setIsExpanded] = useState(false);
  const [topCardIndex, setTopCardIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;

  const getCardAnimation = (index) => {
    const pos = (index - topCardIndex + 3) % 3;
    if (!isExpanded) {
      // Stacked
      return {
        x: (pos - 1) * 35,
        y: 0,
        rotate: pos === 0 ? 0 : (pos === 1 ? -6 : 6),
        scale: 1 - (pos * 0.05),
        zIndex: 30 - pos * 10,
        opacity: 1,
      };
    } else {
      // Expanded
      if (isMobile) {
        return {
          x: 0,
          y: (index - 1) * 320,
          rotate: 0,
          scale: 1,
          zIndex: 30 - pos * 10,
          opacity: 1,
        };
      } else {
        return {
          x: (index - 1) * 340,
          y: 0,
          rotate: 0,
          scale: 1,
          zIndex: 30 - pos * 10,
          opacity: 1,
        };
      }
    }
  };

  return (
    <div className="w-full bg-[#f4f7ed]">
      {/* Full-bleed Hero Section */}
      <section
        className="relative w-full py-32 px-4 sm:px-6 flex flex-col items-center justify-center mb-20"
        style={{
          backgroundImage: `url(${farmBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Semi-transparent overlay to ensure text contrast */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-agricultural-wheat"></div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center max-w-4xl mx-auto"
        >
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight drop-shadow-md">
            Feed Smarter, <br />
            <span className="text-agricultural-green">Farm Better.</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-800 max-w-2xl mx-auto mb-10 font-medium drop-shadow-sm">
            The simplest way for farmers to calculate precise nutritional needs, optimize feeding schedules, and save on feed costs using advanced AI.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" onClick={() => setView('assistant')} className="group text-lg shadow-emerald-500/40 shadow-xl px-8 border border-white/20">
              Launch AI Assistant
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 bg-white/90 backdrop-blur-md border-2 border-slate-300 hover:border-agricultural-green hover:bg-white shadow-lg">
              View Example Report
            </Button>
          </div>
        </motion.div>
      </section>

      <div className="flex flex-col items-center justify-center w-full max-w-5xl mx-auto space-y-20 px-4 sm:px-6 pb-20">

      {/* How it Works */}
      <section className="w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">How It Works</h2>
          <p className="text-slate-600">Get a professional nutrition plan in three simple steps.</p>
        </div>
        
        <div 
          className="relative w-full max-w-5xl mx-auto flex items-center justify-center cursor-pointer transition-all duration-500 ease-out"
          style={{ height: isExpanded && isMobile ? '850px' : '400px' }}
          onClick={() => {
            if (isExpanded) {
              setTopCardIndex((prev) => (prev + 1) % 3);
            }
            setIsExpanded(!isExpanded);
          }}
        >
          {[
            { step: 'Step 1', title: 'Select Animal', desc: 'Choose your livestock type and enter the number of animals in your herd.', icon: <MousePointer2 />, color: 'from-blue-500 to-cyan-400', shadow: 'shadow-blue-500/30' },
            { step: 'Step 2', title: 'AI Analysis', desc: 'Our veterinary-trained AI instantly calculates macronutrient and water needs.', icon: <BrainCircuit />, color: 'from-purple-500 to-fuchsia-400', shadow: 'shadow-purple-500/30' },
            { step: 'Step 3', title: 'Get Report', desc: 'Receive an actionable plan with feeding schedules and cost-saving tips.', icon: <ClipboardCheck />, color: 'from-emerald-500 to-teal-400', shadow: 'shadow-emerald-500/30' }
          ].map((item, i) => (
            <motion.div
              initial={{ opacity: 0 }}
              animate={getCardAnimation(i)}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              key={item.step}
              className="absolute w-[280px] sm:w-[320px] p-8 rounded-[2.5rem] text-center shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)] transition-shadow duration-300 border border-white/80 bg-white/95 backdrop-blur-sm overflow-hidden group"
            >
              {/* Decorative Watermark Icon */}
              <div className="absolute -right-8 -bottom-8 opacity-[0.03] text-slate-900 pointer-events-none transform group-hover:scale-110 transition-transform duration-500">
                {React.cloneElement(item.icon, { className: "w-56 h-56" })}
              </div>

              {/* Step Badge */}
              <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-slate-100 text-slate-500 text-sm font-bold mb-6 tracking-wide uppercase">
                {item.step}
              </div>

              {/* Icon Box */}
              <div className={`w-20 h-20 bg-gradient-to-br ${item.color} text-white rounded-[1.5rem] flex items-center justify-center mx-auto mb-8 shadow-xl ${item.shadow} relative overflow-hidden transform group-hover:-translate-y-1 transition-transform duration-300`}>
                <div className="absolute inset-0 bg-white/20 translate-y-[-50%] rotate-45 transform origin-top-left"></div>
                {React.cloneElement(item.icon, { className: "w-10 h-10 relative z-10" })}
              </div>
              
              <h3 className="text-2xl font-extrabold text-slate-900 mb-4 tracking-tight">{item.title}</h3>
              <p className="text-slate-600 font-medium leading-relaxed relative z-10">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Value Propositions */}
      <section className="w-full glass-card p-10 md:p-16 rounded-[2.5rem] bg-gradient-to-br from-white to-agricultural-green/5 border-agricultural-green/20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Why Farmers Trust LivestockAI</h2>
            <p className="text-lg text-slate-600 mb-8">
              Built for rural environments, our platform focuses on simplicity, accessibility, and real-world agricultural efficiency.
            </p>
            <ul className="space-y-6">
              {[
                { icon: <PiggyBank className="w-6 h-6 text-emerald-600" />, title: 'Reduce Feed Waste', desc: 'Optimize portions to stop overfeeding and save money.' },
                { icon: <CloudOff className="w-6 h-6 text-blue-600" />, title: 'Offline Ready', desc: 'Access saved reports anywhere, even without internet.' },
                { icon: <Activity className="w-6 h-6 text-red-600" />, title: 'Health First', desc: 'Prevent deficiencies before they impact productivity.' }
              ].map((feature, i) => (
                <li key={i} className="flex gap-4">
                  <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm shrink-0 h-min">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-lg">{feature.title}</h4>
                    <p className="text-slate-600">{feature.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
            {/* Visual representation of the report card */}
            <div className="absolute inset-0 bg-gradient-to-tr from-agricultural-green to-agricultural-sunset blur-3xl opacity-20 rounded-full"></div>
            <div className="relative bg-white/90 backdrop-blur-sm border border-slate-200 p-8 rounded-3xl shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                <FileText className="w-10 h-10 text-agricultural-green" />
                <div>
                  <div className="font-bold text-xl text-slate-800">Cow Nutrition Plan</div>
                  <div className="text-sm text-slate-500">Generated instantly</div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-3 bg-slate-100 rounded-full w-3/4"></div>
                <div className="h-3 bg-slate-100 rounded-full w-full"></div>
                <div className="h-3 bg-slate-100 rounded-full w-5/6"></div>
                <div className="flex gap-2 mt-6">
                  <div className="h-8 bg-emerald-100 rounded-lg w-1/3"></div>
                  <div className="h-8 bg-amber-100 rounded-lg w-1/3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>
    </div>
  );
}
