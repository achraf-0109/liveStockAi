import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Info, AlertCircle, Globe } from 'lucide-react';
import useAppStore from '../store/useAppStore';
import { Button } from '../components/ui/Button';

const animals = [
  { id: 'cow', name: 'Cow', icon: '🐄' },
  { id: 'sheep', name: 'Sheep', icon: '🐑' },
  { id: 'goat', name: 'Goat', icon: '🐐' },
  { id: 'chicken', name: 'Chicken', icon: '🐔' },
  { id: 'camel', name: 'Camel', icon: '🐪' },
];

const languages = [
  { id: 'en', name: 'English', flag: '🇬🇧' },
  { id: 'darija', name: 'الدارجة', flag: '🇲🇦' },
  { id: 'tamazight', name: 'ⵜⴰⵎⴰⵣⵉⵖⵜ', flag: 'ⵣ' },
];

export default function Dashboard() {
  const { animalType, setAnimalType, herdSize, setHerdSize, setView, language, setLanguage } = useAppStore();
  const [error, setError] = useState('');

  const handleGenerate = () => {
    if (!animalType) {
      setError('Please select an animal type.');
      return;
    }
    if (!herdSize || herdSize <= 0) {
      setError('Please enter a valid number of animals.');
      return;
    }
    setError('');
    setView('generating');
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-10 px-4 sm:px-6 w-full max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
          Smart Feeding Made <span className="text-agricultural-green">Simple.</span>
        </h1>
        <p className="text-lg text-slate-600 max-w-xl mx-auto">
          Get AI-powered nutritional recommendations, tailored feeding schedules, and cost-saving tips for your livestock in seconds.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="w-full glass-card rounded-3xl p-6 md:p-10"
      >
        {/* Language Selection */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <Globe className="w-4 h-4 text-agricultural-sunset" />
            Choose your language / اختار اللغة ديالك / ⵙⵜⵉ ⵜⵓⵜⵍⴰⵢⵜ
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {languages.map((lang) => (
              <button
                key={lang.id}
                onClick={() => setLanguage(lang.id)}
                className={`flex items-center justify-center gap-2 p-3 rounded-2xl border-2 transition-all text-base font-medium ${
                  language === lang.id
                    ? 'border-agricultural-sunset bg-agricultural-sunset/10 shadow-md text-agricultural-sunset-dark'
                    : 'border-slate-200 hover:border-agricultural-sunset/50 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <span className="text-xl">{lang.flag}</span>
                <span>{lang.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Animal Selection */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            What type of animal are you feeding?
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {animals.map((animal) => (
              <button
                key={animal.id}
                onClick={() => setAnimalType(animal.id)}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
                  animalType === animal.id
                    ? 'border-agricultural-green bg-agricultural-green/10 shadow-md'
                    : 'border-slate-200 hover:border-agricultural-green/50 hover:bg-slate-50'
                }`}
              >
                <span className="text-3xl mb-2 block">{animal.icon}</span>
                <span className={`font-medium ${animalType === animal.id ? 'text-agricultural-green-dark' : 'text-slate-600'}`}>
                  {animal.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Herd Size */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            How many animals are in the herd?
          </label>
          <div className="relative">
            <input
              type="number"
              min="1"
              value={herdSize}
              onChange={(e) => setHerdSize(e.target.value)}
              placeholder="e.g. 50"
              className="w-full text-xl px-5 py-4 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:border-agricultural-green focus:ring-4 focus:ring-agricultural-green/20 transition-all"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-2 text-sm font-medium"
          >
            <AlertCircle className="w-5 h-5 shrink-0" />
            {error}
          </motion.div>
        )}

        {/* Submit Button */}
        <Button size="lg" onClick={handleGenerate} className="group text-lg shadow-emerald-500/20 shadow-xl">
          Generate AI Report
          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>

        <div className="mt-6 flex items-start gap-2 text-sm text-slate-500 bg-slate-50 p-4 rounded-xl border border-slate-100">
          <Info className="w-5 h-5 shrink-0 text-agricultural-sunset" />
          <p>
            Our AI uses the latest veterinary insights to calculate optimal food ratios and water requirements based strictly on species and herd size.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
