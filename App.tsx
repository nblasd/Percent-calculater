
import React, { useState, useEffect, useCallback } from 'react';
import { CalcMode, HistoryItem } from './types';
import { solveMathProblem } from './services/geminiService';
import Visualizer from './components/Visualizer';

const App: React.FC = () => {
  // Calculator States
  const [mode, setMode] = useState<CalcMode>(CalcMode.BASIC);
  const [inputA, setInputA] = useState<string>('');
  const [inputB, setInputB] = useState<string>('');
  const [result, setResult] = useState<number | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // AI Assistant States
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const calculate = useCallback(() => {
    const a = parseFloat(inputA);
    const b = parseFloat(inputB);

    if (isNaN(a) || isNaN(b)) {
      setResult(null);
      return;
    }

    let res = 0;
    switch (mode) {
      case CalcMode.BASIC:
        // What is B% of A?
        res = (b / 100) * a;
        break;
      case CalcMode.REVERSE:
        // A is what % of B?
        res = (a / b) * 100;
        break;
      case CalcMode.CHANGE:
        // % Increase/Decrease from A to B
        res = ((b - a) / a) * 100;
        break;
    }

    setResult(res);

    // Update History (Limit to 5)
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      type: mode,
      inputs: { a, b },
      result: res,
      timestamp: new Date()
    };
    setHistory(prev => [newItem, ...prev].slice(0, 5));
  }, [inputA, inputB, mode]);

  useEffect(() => {
    calculate();
  }, [calculate]);

  const handleAiAsk = async () => {
    if (!aiQuery.trim()) return;
    setIsAiLoading(true);
    setAiResponse('');
    const response = await solveMathProblem(aiQuery);
    setAiResponse(response);
    setIsAiLoading(false);
  };

  const getLabelA = () => {
    if (mode === CalcMode.BASIC) return "Total Amount";
    if (mode === CalcMode.REVERSE) return "Portion Value";
    return "Initial Value";
  };

  const getLabelB = () => {
    if (mode === CalcMode.BASIC) return "Percentage (%)";
    if (mode === CalcMode.REVERSE) return "Total Amount";
    return "Final Value";
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 px-4 py-8 md:py-12">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-indigo-900 mb-2 tracking-tight">Precision Percent</h1>
          <p className="text-slate-500 font-medium">Professional calculations with intelligent insights</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Calculator Column */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Mode Switcher */}
            <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200">
              {(Object.keys(CalcMode) as Array<keyof typeof CalcMode>).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(CalcMode[m])}
                  className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    mode === CalcMode[m] 
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' 
                      : 'text-slate-500 hover:text-indigo-600 hover:bg-slate-50'
                  }`}
                >
                  {m === 'BASIC' ? 'Standard' : m === 'REVERSE' ? 'Reverse %' : 'Change'}
                </button>
              ))}
            </div>

            {/* Input Card */}
            <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{getLabelA()}</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={inputA}
                      onChange={(e) => setInputA(e.target.value)}
                      placeholder="e.g. 100"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-lg font-semibold focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{getLabelB()}</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={inputB}
                      onChange={(e) => setInputB(e.target.value)}
                      placeholder="e.g. 20"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-lg font-semibold focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Result Area */}
              <div className="bg-indigo-50 rounded-2xl p-6 text-center border border-indigo-100 transition-all">
                <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1">Calculated Result</p>
                <div className="text-4xl font-black text-indigo-700">
                  {result !== null ? result.toLocaleString(undefined, { maximumFractionDigits: 2 }) : '0.00'}
                  <span className="text-xl ml-1 font-bold text-indigo-400">
                    {mode === CalcMode.REVERSE || mode === CalcMode.CHANGE ? '%' : ''}
                  </span>
                </div>
              </div>
            </div>

            {/* History Table */}
            <div className="bg-white rounded-3xl p-6 shadow-lg shadow-slate-200/40 border border-slate-100">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">Recent Calculations</h3>
              <div className="space-y-3">
                {history.length === 0 ? (
                  <p className="text-slate-400 text-sm text-center py-4 italic">No history yet</p>
                ) : (
                  history.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-indigo-500 uppercase">{item.type}</span>
                        <span className="text-sm text-slate-600 font-medium">
                          {item.inputs.a} & {item.inputs.b}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-slate-800">
                          {item.result.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                          {item.type !== CalcMode.BASIC ? '%' : ''}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Side Panel: Visualization & AI Assistant */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Visualization */}
            <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100">
               <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6 text-center">Visual Context</h3>
               <Visualizer 
                percentage={mode === CalcMode.BASIC ? parseFloat(inputB) || 0 : result || 0} 
                total={mode === CalcMode.BASIC ? parseFloat(inputA) || 0 : parseFloat(inputB) || 0} 
              />
            </div>

            {/* AI Assistant */}
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-8 text-white shadow-2xl shadow-indigo-300 relative overflow-hidden group">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-white/20 transition-all duration-500"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold">Ask AI Assistant</h2>
                </div>
                
                <p className="text-indigo-100 text-sm mb-6 leading-relaxed">
                  Need help with a complex bill, tip calculation, or interest rate query?
                </p>

                <div className="space-y-4">
                  <div className="relative">
                    <textarea
                      value={aiQuery}
                      onChange={(e) => setAiQuery(e.target.value)}
                      placeholder="e.g. How much is an 18% tip on a $142 bill?"
                      className="w-full bg-white/10 border border-white/20 rounded-2xl p-4 text-sm placeholder:text-white/40 focus:ring-2 focus:ring-white/50 outline-none transition-all min-h-[100px] resize-none"
                    />
                  </div>
                  
                  <button
                    onClick={handleAiAsk}
                    disabled={isAiLoading}
                    className="w-full bg-white text-indigo-700 font-bold py-4 rounded-2xl hover:bg-indigo-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isAiLoading ? (
                      <div className="w-5 h-5 border-2 border-indigo-700 border-t-transparent rounded-full animate-spin"></div>
                    ) : 'Analyze Query'}
                  </button>

                  {aiResponse && (
                    <div className="mt-6 p-4 bg-white/10 rounded-2xl border border-white/10 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{aiResponse}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
