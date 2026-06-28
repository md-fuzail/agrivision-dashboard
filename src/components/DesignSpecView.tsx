"use client";

import React, { useState } from 'react';
import { 
  Eye, HelpCircle, FileText, CheckCircle2, Award, 
  Zap, Compass, RefreshCw, Layout, Smartphone, Pointer, LucideIcon 
} from 'lucide-react';

type WireframeId = 'sidebar' | 'header' | 'kpis' | 'critical' | 'attention' | 'trends' | 'farms-grid';

interface DesignQuestion {
  q: string;
  a: string;
  icon: LucideIcon;
}

interface WireframeSection {
  id: WireframeId;
  title: string;
  desc: string;
}

const DESIGN_QUESTIONS: DesignQuestion[] = [
  {
    q: "What psychological or interaction design principles did you apply to reduce the user's cognitive load?",
    a: "Executives scan; they don't read. To ensure the Director can triage the region in under 30 seconds, I applied:\n\n• Gestalt Principles (Enclosure): Hard visual boundaries (cards, colored regions) separate distinct data types—high-stakes 'Fires' are visually isolated from low-stakes 'Trends' instantly.\n\n• Progressive Disclosure: Only the delta (what changed) and status are surfaced by default. Dense tabular data is hidden behind collapsible panels or slide-over drawers, protecting the primary scan field from visual noise.\n\n• Hick's Law & Accessible Semantics: Avoided deep dropdowns in favor of a single-click segmented control. Red is reserved exclusively for critical interventions, but always paired with distinct iconography (⚠️ vs ✓), ARIA labels for screen readers, and directional arrows for emphasis. This ensures urgency is accessible to colorblind users and cognitive disabilities.\n\n• F-Pattern Scanning: Information is arranged to match the natural top-left → top-right → center scanning pattern that executives use. Critical information (Fire Check) is top-left; secondary context (Trends) is top-right.",
    icon: Compass
  },
  {
    q: "What are the three things the user should see first, and why?",
    a: "The visual hierarchy strictly mirrors a Director's morning mental model:\n\n1. 🚨 The 'Fire Check' (Critical Alerts) — Top-left of the scan path. If a farm is in critical condition, nothing else matters until intervention is dispatched. This is a hard operational blocker.\n\n2. 📋 The 'Daily Operations' (Task Queue) — Centrally positioned. Once fires are out, 'What are today's scheduled operational bottlenecks?' is the second question.\n\n3. 📊 The 'Macro Trajectory' (Sparklines) — Right-aligned summary. Executives want to know trend direction instantly: 'Are we trending up or down?' Custom SVG sparklines provide rapid visual shapes (↗️ vs ↘️) rather than forcing them to parse raw numbers.\n\nScan time: Top-left → center → right = ~15 seconds. Critical alerts take 5 seconds, leaving 25 seconds for detail exploration.",
    icon: Eye
  },
  {
    q: "What did you leave out, and why?",
    a: "A dashboard is defined as much by what you omit as what you include. Here is what I left out and why:\n\n• Data Grids: Showing granular raw metrics for 8 farms simultaneously creates cognitive overload. Directors need aggregated insights, not telemetry.\n\n• Pagination / Infinite Scroll: This UI is optimized for 8–12 farms. If the business scales to 50+ farms, we pivot to a virtualized list (react-window). Trying to support both now adds complexity that doesn't pay dividends yet.\n\n• Heavy Charting Libraries: Recharts, Chart.js, etc., carry massive bundle overheads. For simple trend visualization, custom SVG sparklines (zero dependencies) are faster to render, smaller in size, and more intentional.\n\n• Redux / Complex State Tools: For a dashboard with this scope, a custom headless hook is sufficient. Redux adds abstraction debt without benefit.\n\n• Dark Mode: Deliberately excluded. Field users in glaring sunlight need high-contrast mode, not dark mode. This is a more critical requirement than aesthetic preference.\n\nPrinciple: YAGNI (You Aren't Gonna Need It). Every byte in the bundle should justify its weight.",
    icon: Layout
  },
  {
    q: "What would you ask the actual users before building this for real?",
    a: "To move from prototype to production, I would stress-test the operational reality:\n\n• Alert Fatigue Calibration: 'What is the exact threshold for a Critical alert?' 'What metrics trigger a false positive most often?' If everything is urgent, nothing is. We need data to calibrate thresholds.\n\n• Ergonomics & Environment: 'Are Directors using this on iPads in glaring sunlight, or at a desk?' 'What is the typical connection speed in the field? Is offline-first caching (IndexedDB) a hard requirement?'\n\n• Workflow Closure: 'When a task is marked Done here, does it trigger a webhook to a Zone Manager's device?' 'Is this a read-only view, or a two-way command center that dispatches actions?'\n\n• Scaling Boundaries: 'At what farm count does this UI break for you? 12? 20? 50?' 'Do you want a regional roll-up view, or always farm-level detail?'\n\n• Authentication & Permissions: 'Do different users see different farms? (RBAC)' 'Is this internal-only, or do external stakeholders access it?'",
    icon: HelpCircle
  },
  {
    q: "What was the most challenging part of coding this task, and how did you solve it?",
    a: "The biggest challenge was architecting state so it scales predictably without premature optimization.\n\nWhen toggling the Province filter, the KPI math (aggregations), task lists, and dynamic SVG sparklines must all recalculate simultaneously. Naive approaches like hard-coding derived data cause re-render cascades, while blanket 'useMemo' on everything hides the dependency graph and makes debugging a nightmare.\n\nThe Solution: I built a custom Headless Component Hook (useDashboardState) that cleanly separates:\n1. Raw state (farms, filters, tasks from mock API)\n2. Derived state (filtered farms, aggregated KPIs, computed once)\n3. UI state (expanded panels, separate concern)\n\nThis approach prevents unnecessary re-renders natively (memoization targets the data flow, not components), makes the business logic testable, keeps components purely presentational, and scales to 50 farms without refactoring.",
    icon: Zap
  },
  {
    q: "How do you balance delivering real value quickly versus over-complicating the solution?",
    a: "I focus strictly on the core user constraint: 'Triage 8 farms in 30 seconds.'\n\nIt's tempting to over-engineer: 'We should build a complex relational database schema', or 'We need Redux, React Query, and WebSockets.'\n\nInstead, I focused 100% of my time on a flawless frontend execution that directly solves the 30-second constraint. But I didn't ship sloppy code. How I kept it real:\n\n• Strict TypeScript interfaces that perfectly mirror a REST/JSON payload shape.\n• Mock data that validates against those interfaces—not hard-coded junk.\n• A data layer abstraction so a backend engineer can swap my mock hook for a real API fetch tomorrow without breaking the UI contract.\n• Zero hard-coded business logic in components—all math is in the hook.\n\nResult: Stakeholders can validate the interaction model today. Backend scaffolding happens in Phase 2, once the business logic is approved. No rework, no surprises.",
    icon: RefreshCw
  }
];

const WIREFRAME_SECTIONS: WireframeSection[] = [
  { id: "sidebar", title: "1. Brand Sidebar", desc: "Establishes institutional presence and quick navigation channels. Minimal footprint, persistent anchor." },
  { id: "header", title: "2. Greeting & Fast Filters", desc: "Top horizontal bar providing instant time context, current region, and layout controllers. Answers: 'Who is looking, and when?'" },
  { id: "kpis", title: "3. KPI Summary Row", desc: "Answers: 'Is anything on fire?' and 'What needs attention?' in 1 second. Top-scanned strip." },
  { id: "critical", title: "4. Urgent Alert Hub", desc: "Primary visual anchor. Pulses red if active. Action buttons to dispatch help immediately." },
  { id: "attention", title: "5. Attention / Tasks", desc: "Daily operational checklist. Users can check off items to dynamically update KPI scores." },
  { id: "trends", title: "6. Sparkline Trends", desc: "Shows high-level crop production, water usage, and revenue trajectory visually over time." },
  { id: "farms-grid", title: "7. Farm Detail Matrix", desc: "8 compact cards representing the individual status of each zone. Drill-down available via hover and click." }
];

export default function DesignSpecView() {
  const [activeQuestion, setActiveQuestion] = useState<number>(0);
  const [hoveredWireframeBlock, setHoveredWireframeBlock] = useState<WireframeId | null>(null);

  const handleBlockInteraction = (id: WireframeId) => {
    setHoveredWireframeBlock(prev => prev === id ? null : id);
  };

  return (
    <div id="design-spec-layout" className="flex-1 bg-gray-50/50 p-4 md:p-8 overflow-y-auto">
      <div className="mb-6 border-b border-gray-200 pb-5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
          Design Blueprint & Documentation
        </span>
        <h2 className="text-2xl md:text-3xl font-black tracking-tight font-sans mt-3 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
          AgriVision Product Architecture
        </h2>
        <p className="text-sm text-gray-500 mt-1.5 font-medium">
          Review the digital Figma mockup layout wireframe and the core design questions below.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 md:gap-8">
        <div className="xl:col-span-5 bg-white border border-gray-200 p-5 md:p-6 rounded-2xl shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-950 flex items-center mb-1">
              <Layout className="h-4.5 w-4.5 mr-1.5 text-emerald-600" /> Figma Interactive Wireframe
            </h3>
            <p className="text-xs text-gray-400 font-medium mb-4 flex items-center">
              <Pointer className="h-3 w-3 mr-1" /> Hover or tap elements to inspect annotations.
            </p>
          </div>
          
          <div className="border border-gray-200 bg-gray-50 rounded-xl p-3 flex space-x-2 h-[420px] shadow-inner relative overflow-hidden group">
            <button
              type="button"
              id="wireframe-block-sidebar"
              onMouseEnter={() => setHoveredWireframeBlock("sidebar")}
              onMouseLeave={() => setHoveredWireframeBlock(null)}
              onClick={() => handleBlockInteraction("sidebar")}
              aria-label="Inspect Brand Sidebar"
              className={`w-12 bg-[#0a231c] rounded-lg border flex flex-col justify-between items-center py-4 transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                hoveredWireframeBlock === 'sidebar' ? 'ring-2 ring-emerald-500 border-transparent shadow-md scale-[1.02]' : 'border-emerald-950'
              }`}
            >
              <div className="h-3 w-3 bg-emerald-400 rounded-sm"></div>
              <div className="space-y-2">
                <div className="h-1 w-6 bg-emerald-800 rounded"></div>
                <div className="h-1 w-6 bg-emerald-800 rounded"></div>
                <div className="h-1 w-6 bg-emerald-800 rounded"></div>
              </div>
              <div className="h-4 w-4 bg-emerald-900 rounded-full"></div>
            </button>
            
            <div className="flex-1 flex flex-col justify-between">
              <button
                type="button"
                id="wireframe-block-header"
                onMouseEnter={() => setHoveredWireframeBlock("header")}
                onMouseLeave={() => setHoveredWireframeBlock(null)}
                onClick={() => handleBlockInteraction("header")}
                aria-label="Inspect Header"
                className={`w-full h-8 bg-white border rounded-lg flex items-center justify-between px-3 text-[10px] font-bold text-gray-400 cursor-pointer transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                  hoveredWireframeBlock === 'header' ? 'ring-2 ring-emerald-500 border-transparent shadow-md scale-[1.01]' : 'border-gray-300'
                }`}
              >
                <span>Good Morning, Director</span>
                <div className="h-4 w-12 bg-gray-100 rounded"></div>
              </button>
              
              <button
                type="button"
                id="wireframe-block-kpis"
                onMouseEnter={() => setHoveredWireframeBlock("kpis")}
                onMouseLeave={() => setHoveredWireframeBlock(null)}
                onClick={() => handleBlockInteraction("kpis")}
                aria-label="Inspect KPIs"
                className={`w-full grid grid-cols-4 gap-1.5 cursor-pointer transition-all duration-300 rounded-lg p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                  hoveredWireframeBlock === 'kpis' ? 'ring-2 ring-emerald-500 bg-emerald-50 shadow-md scale-[1.01]' : ''
                }`}
              >
                {[
                  { label: "8", text: "Farms" },
                  { label: "2", text: "Alerts" },
                  { label: "5", text: "Tasks" },
                  { label: "75%", text: "Health" }
                ].map((kpi, index) => (
                  <div key={index} className="bg-white border border-gray-200/80 rounded-md p-1.5 text-center shadow-xs pointer-events-none">
                    <p className="text-[10px] font-black text-gray-800 leading-none">{kpi.label}</p>
                    <p className="text-[7px] text-gray-400 mt-0.5">{kpi.text}</p>
                  </div>
                ))}
              </button>
              
              <div className="grid grid-cols-12 gap-1.5 flex-1 my-1.5">
                <button
                  type="button"
                  id="wireframe-block-critical"
                  onMouseEnter={() => setHoveredWireframeBlock("critical")}
                  onMouseLeave={() => setHoveredWireframeBlock(null)}
                  onClick={() => handleBlockInteraction("critical")}
                  aria-label="Inspect Critical Alerts"
                  className={`col-span-5 bg-white border rounded-lg p-2 flex flex-col justify-between cursor-pointer transition-all duration-300 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                    hoveredWireframeBlock === 'critical' ? 'ring-2 ring-red-500 border-transparent shadow-md scale-[1.02]' : 'border-gray-300'
                  }`}
                >
                  <span className="text-[8px] font-extrabold text-red-500 flex items-center"><span className="h-1.5 w-1.5 bg-red-500 rounded-full mr-1 animate-pulse"></span> Critical</span>
                  <div className="space-y-1 w-full">
                    <div className="h-3 w-full bg-red-50 border border-red-100 rounded"></div>
                    <div className="h-3 w-full bg-red-50 border border-red-100 rounded"></div>
                  </div>
                </button>
                
                <button
                  type="button"
                  id="wireframe-block-attention"
                  onMouseEnter={() => setHoveredWireframeBlock("attention")}
                  onMouseLeave={() => setHoveredWireframeBlock(null)}
                  onClick={() => handleBlockInteraction("attention")}
                  aria-label="Inspect Attention List"
                  className={`col-span-4 bg-white border rounded-lg p-2 flex flex-col justify-between cursor-pointer transition-all duration-300 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                    hoveredWireframeBlock === 'attention' ? 'ring-2 ring-amber-500 border-transparent shadow-md scale-[1.02]' : 'border-gray-300'
                  }`}
                >
                  <span className="text-[8px] font-extrabold text-amber-600">Attention</span>
                  <div className="space-y-1 w-full">
                    <div className="h-2 w-full bg-gray-100 rounded"></div>
                    <div className="h-2 w-full bg-gray-100 rounded"></div>
                    <div className="h-2 w-full bg-gray-100 rounded"></div>
                  </div>
                </button>
                
                <button
                  type="button"
                  id="wireframe-block-trends"
                  onMouseEnter={() => setHoveredWireframeBlock("trends")}
                  onMouseLeave={() => setHoveredWireframeBlock(null)}
                  onClick={() => handleBlockInteraction("trends")}
                  aria-label="Inspect Trends"
                  className={`col-span-3 bg-white border rounded-lg p-2 flex flex-col justify-between cursor-pointer transition-all duration-300 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                    hoveredWireframeBlock === 'trends' ? 'ring-2 ring-blue-500 border-transparent shadow-md scale-[1.02]' : 'border-gray-300'
                  }`}
                >
                  <span className="text-[8px] font-extrabold text-blue-500">Trends</span>
                  <div className="h-8 w-full bg-blue-50/50 rounded flex items-center justify-center">
                    <span className="text-[9px] font-bold text-blue-600">↗</span>
                  </div>
                </button>
              </div>
              
              <button
                type="button"
                id="wireframe-block-farms-grid"
                onMouseEnter={() => setHoveredWireframeBlock("farms-grid")}
                onMouseLeave={() => setHoveredWireframeBlock(null)}
                onClick={() => handleBlockInteraction("farms-grid")}
                aria-label="Inspect Farms Grid"
                className={`w-full h-24 bg-white border rounded-lg p-2 cursor-pointer transition-all duration-300 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                  hoveredWireframeBlock === 'farms-grid' ? 'ring-2 ring-emerald-500 border-transparent shadow-md scale-[1.01]' : 'border-gray-300'
                }`}
              >
                <span className="text-[8px] font-extrabold text-emerald-700">8 Farms Matrix</span>
                <div className="grid grid-cols-8 gap-1 mt-2">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="h-10 bg-gray-50 border border-gray-200 rounded flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-[8px] font-black text-gray-400">#{i+1}</span>
                    </div>
                  ))}
                </div>
              </button>
            </div>
          </div>
          
          <div className="mt-5 bg-emerald-950/5 text-emerald-900 border border-emerald-900/10 p-4 rounded-xl min-h-[90px] flex items-center transition-all duration-300">
            {hoveredWireframeBlock ? (
              <div key={hoveredWireframeBlock} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  {WIREFRAME_SECTIONS.find(s => s.id === hoveredWireframeBlock)?.title} Annotation:
                </h5>
                <p className="text-xs mt-1.5 leading-relaxed font-semibold">
                  {WIREFRAME_SECTIONS.find(s => s.id === hoveredWireframeBlock)?.desc}
                </p>
              </div>
            ) : (
              <div className="flex items-center space-x-3 text-gray-500 w-full">
                <Smartphone className="h-5 w-5 text-emerald-600 shrink-0 animate-pulse" />
                <p className="text-xs font-semibold leading-relaxed">
                  Interact with any layout block in the wireframe above to reveal its UX placement theory.
                </p>
              </div>
            )}
          </div>
        </div>
        
        <div className="xl:col-span-7 bg-white border border-gray-200 p-5 md:p-6 rounded-2xl shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-950 flex items-center mb-1">
              <FileText className="h-4.5 w-4.5 mr-1.5 text-emerald-600" /> Executive Design Q&A
            </h3>
            <p className="text-xs text-gray-400 font-medium mb-5">
              Answers outlining UX decisions, logic constraints, and technical trade-offs.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-5 flex-1">
            
            <div className="sm:w-5/12 flex flex-col gap-1.5" role="tablist" aria-orientation="vertical">
              {DESIGN_QUESTIONS.map((q, index) => {
                const QuestionIcon = q.icon;
                const isActive = activeQuestion === index;
                return (
                  <button
                    key={index}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={`qa-panel-${index}`}
                    id={`qa-tab-${index}`}
                    onClick={() => setActiveQuestion(index)}
                    className={`text-left text-xs font-bold p-3 rounded-xl transition-all duration-200 group relative overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-900 border border-emerald-100 shadow-xs'
                        : 'bg-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-900 border border-transparent'
                    }`}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500" />
                    )}
                    <div className="flex items-center space-x-2.5">
                      <QuestionIcon className={`h-4 w-4 shrink-0 transition-colors ${isActive ? 'text-emerald-600' : 'text-gray-400 group-hover:text-emerald-500'}`} />
                      <span className="line-clamp-2 leading-tight">{q.q}</span>
                    </div>
                  </button>
                );
              })}
            </div>
            
            <div 
              id={`qa-panel-${activeQuestion}`}
              role="tabpanel"
              aria-labelledby={`qa-tab-${activeQuestion}`}
              className="sm:w-7/12 bg-gray-50/50 border border-gray-100 rounded-xl p-5 md:p-6 flex flex-col min-h-[300px]"
            >
              <div 
                key={activeQuestion} 
                className="animate-in fade-in slide-in-from-right-4 duration-300 ease-out flex-1"
              >
                <div className="flex items-start space-x-3 border-b border-gray-100 pb-4 mb-4">
                  <Award className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <h4 className="text-sm font-extrabold text-gray-950 leading-snug">
                    {DESIGN_QUESTIONS[activeQuestion].q}
                  </h4>
                </div>
                <div className="text-xs font-medium text-gray-700 leading-relaxed whitespace-pre-line space-y-2">
                  {DESIGN_QUESTIONS[activeQuestion].a.split('\n\n').map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 border-t border-gray-100 pt-4 flex items-center justify-between text-xs text-emerald-700 font-bold bg-emerald-50/50 p-3 rounded-xl border-dashed">
            <span className="flex items-center">
              <CheckCircle2 className="h-4 w-4 mr-1.5 text-emerald-600" /> Verified: Fulfills Constraints
            </span>
            <span className="text-gray-400 font-normal bg-white px-2 py-0.5 rounded border border-gray-100 shadow-2xs">AgriVision Spec V1.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}