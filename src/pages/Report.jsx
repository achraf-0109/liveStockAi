import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Share2, Droplets, Wheat, Clock, TrendingUp, AlertTriangle, Volume2, Loader2, VolumeX } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import useAppStore from '../store/useAppStore';
import { Button } from '../components/ui/Button';
import { speakText, stopSpeaking } from '../services/aiService';

const COLORS = ['#10b981', '#f59e0b', '#3b82f6', '#8b5cf6', '#ef4444'];

const LANG_LABELS = {
  en: { name: 'English', flag: '🇬🇧' },
  darija: { name: 'الدارجة', flag: '🇲🇦' },
  tamazight: { name: 'ⵜⴰⵎⴰⵣⵉⵖⵜ', flag: 'ⵣ' },
};

export default function Report() {
  const { currentReport, setView, language } = useAppStore();
  const [isPlaying, setIsPlaying] = React.useState(false);

  if (!currentReport) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Button onClick={() => setView('assistant')}>Go Back</Button>
      </div>
    );
  }

  const { overview, dailyNeeds, nutritionalBreakdown, schedule, recommendations } = currentReport;

  const handlePlayAudio = async () => {
    if (isPlaying) {
      stopSpeaking();
      setIsPlaying(false);
      return;
    }

    try {
      setIsPlaying(true);

      // Build the text to read from the report
      const textParts = [
        overview.summary,
        `${dailyNeeds.water}. ${dailyNeeds.food}.`,
      ];
      
      // Add schedule
      schedule.forEach(item => {
        textParts.push(`${item.time}: ${item.action}`);
      });

      // Add recommendations
      textParts.push(recommendations.costSaving);
      textParts.push(recommendations.healthWarnings);

      const fullText = textParts.join('. ');
      
      await speakText(fullText, language);
      setIsPlaying(false);
    } catch (error) {
      console.error("Failed to play audio:", error);
      setIsPlaying(false);
    }
  };

  const langInfo = LANG_LABELS[language] || LANG_LABELS.en;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto w-full pb-10"
    >
      {/* Header Actions */}
      <div className="flex items-center justify-between mb-8">
        <Button variant="ghost" size="sm" onClick={() => setView('assistant')} className="gap-2">
          <ArrowLeft className="w-4 h-4" /> Start Over
        </Button>
        <div className="flex gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-full text-sm font-medium text-slate-600">
            <span>{langInfo.flag}</span>
            <span>{langInfo.name}</span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2 bg-white"
            onClick={handlePlayAudio}
          >
            {isPlaying ? (
              <VolumeX className="w-4 h-4 text-red-500" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
            {isPlaying ? 'Stop' : 'Listen 🔊'}
          </Button>
          <Button variant="outline" size="sm" className="gap-2 bg-white">
            <Share2 className="w-4 h-4" /> Share
          </Button>
          <Button variant="primary" size="sm" className="gap-2">
            <Download className="w-4 h-4" /> Save PDF
          </Button>
        </div>
      </div>

      {/* Main Overview Card */}
      <div className="glass-card rounded-3xl p-6 md:p-8 mb-8 bg-gradient-to-br from-white to-agricultural-green-light/30 border-agricultural-green/20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2 capitalize">
              {overview.animal} Nutrition Report
            </h1>
            <p className="text-lg text-slate-600">{overview.summary}</p>
          </div>
          <div className="bg-white/80 px-4 py-2 rounded-xl inline-flex items-center gap-2 border border-slate-200">
            <span className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Herd Size:</span>
            <span className="text-2xl font-bold text-agricultural-green-dark">{overview.size}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Metrics & Chart */}
        <div className="lg:col-span-1 space-y-8">
          {/* Daily Needs */}
          <div className="glass-card rounded-3xl p-6">
            <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-agricultural-green" /> Total Daily Needs
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-xl"><Droplets className="w-5 h-5" /></div>
                  <span className="font-medium text-slate-700">Water</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-xl text-slate-900">{dailyNeeds.water}</div>
                  <div className="text-xs text-slate-500">{dailyNeeds.waterPerHead}</div>
                </div>
              </div>
              <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 text-amber-600 rounded-xl"><Wheat className="w-5 h-5" /></div>
                  <span className="font-medium text-slate-700">Feed</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-xl text-slate-900">{dailyNeeds.food}</div>
                  <div className="text-xs text-slate-500">{dailyNeeds.foodPerHead}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="glass-card rounded-3xl p-6">
            <h3 className="font-bold text-lg text-slate-800 mb-2">Nutritional Breakdown</h3>
            <div className="h-64 w-full" style={{ minWidth: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={nutritionalBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {nutritionalBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Custom Legend */}
            <div className="flex flex-wrap justify-center gap-3 mt-2">
              {nutritionalBreakdown.map((item, index) => (
                <div key={item.name} className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  {item.name} ({item.value}%)
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Schedule & Recommendations */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Schedule */}
          <div className="glass-card rounded-3xl p-6">
            <h3 className="font-bold text-lg text-slate-800 mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-agricultural-sunset" /> Feeding Schedule
            </h3>
            <div className="relative border-l-2 border-slate-100 ml-3 space-y-8">
              {schedule.map((item, index) => (
                <div key={index} className="relative pl-6">
                  <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-4 border-agricultural-sunset"></div>
                  <div className="font-bold text-slate-900 mb-1">{item.time}</div>
                  <div className="text-slate-600 bg-slate-50/50 p-3 rounded-xl border border-slate-100 mt-2">
                    {item.action}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-card bg-emerald-50/50 rounded-3xl p-5 border-emerald-100">
              <h4 className="font-bold text-emerald-800 mb-2">Cost Savings</h4>
              <p className="text-sm text-emerald-700 leading-relaxed">{recommendations.costSaving}</p>
            </div>
            
            <div className="glass-card bg-amber-50/50 rounded-3xl p-5 border-amber-100">
              <h4 className="font-bold text-amber-800 mb-2 flex items-center gap-2">
                 Productivity
              </h4>
              <p className="text-sm text-amber-700 leading-relaxed">{recommendations.productivity}</p>
            </div>

            <div className="glass-card bg-blue-50/50 rounded-3xl p-5 border-blue-100">
              <h4 className="font-bold text-blue-800 mb-2">Local Alternatives</h4>
              <p className="text-sm text-blue-700 leading-relaxed">{recommendations.localFood}</p>
            </div>

            <div className="glass-card bg-red-50/50 rounded-3xl p-5 border-red-100">
              <h4 className="font-bold text-red-800 mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Health Warnings
              </h4>
              <p className="text-sm text-red-700 leading-relaxed">{recommendations.healthWarnings}</p>
            </div>
          </div>
          
        </div>
      </div>
    </motion.div>
  );
}
