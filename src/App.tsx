/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect, useMemo, ReactNode } from 'react';
import { motion, Reorder, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Copy, 
  Trash2, 
  Download, 
  GripVertical, 
  ChevronDown, 
  Info,
  ExternalLink,
  HelpCircle,
  Clock,
  Settings,
  X,
  Edit2,
  Check,
  PlusCircle,
  AlertTriangle,
  GraduationCap,
  Image as ImageIcon,
  Save,
  ChevronRight,
  Search,
  ClipboardCheck,
  FileSpreadsheet
} from 'lucide-react';
import html2canvas from 'html2canvas';

import { INITIAL_UNIVERSITIES } from './constants';
import { ChoiceItem, UniversityInfo, SubjectInfo } from './types';

// Custom Dropdown
const SearchableSelect = ({ 
  options, 
  value, 
  onChange, 
  placeholder, 
  disabled = false,
  renderOption
}: { 
  options: { key: string; label: string; shortVal?: string; available?: boolean }[]; 
  value: string; 
  onChange: (key: string) => void; 
  placeholder: string;
  disabled?: boolean;
  renderOption?: (opt: any) => ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredOptions = useMemo(() => {
    return options.filter(opt => 
      opt.label.toLowerCase().includes(search.toLowerCase()) || 
      (opt.shortVal && opt.shortVal.toLowerCase().includes(search.toLowerCase()))
    );
  }, [options, search]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(o => o.key === value);

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full text-left px-2 py-1.5 bg-white border border-slate-200 rounded text-[11px] flex justify-between items-center transition-all ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-slate-300 focus:ring-1 focus:ring-emerald-500 outline-none shadow-sm font-medium text-slate-700'}`}
      >
        <span className="truncate">
          {selectedOption ? (selectedOption.shortVal || selectedOption.label) : placeholder}
        </span>
        <ChevronDown size={12} className="text-slate-400 flex-shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded shadow-xl max-h-48 overflow-y-auto ring-1 ring-black/5">
          <div className="sticky top-0 bg-slate-50 border-b border-slate-100 p-1">
            <div className="relative">
              <input 
                autoFocus
                className="w-full pl-7 pr-2 py-1 text-[11px] border border-slate-200 rounded focus:outline-none focus:border-emerald-400 font-medium"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search size={10} className="absolute left-2 top-2 text-slate-400" />
            </div>
          </div>
          <div className="py-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => {
                    onChange(opt.key);
                    setIsOpen(false);
                    setSearch('');
                  }}
                  className={`w-full text-left px-3 py-1.5 text-[11px] hover:bg-slate-50 flex flex-col ${value === opt.key ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-600'}`}
                >
                  {renderOption ? renderOption(opt) : opt.label}
                </button>
              ))
            ) : (
              <div className="px-3 py-2 text-[11px] text-slate-400 italic text-center">No results</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  const [choices, setChoices] = useState<ChoiceItem[]>([]);
  const [universities, setUniversities] = useState<UniversityInfo[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [lastSaved, setLastSaved] = useState<string>('');
  const [showManageModal, setShowManageModal] = useState(false);
  const [searchUni, setSearchUni] = useState('');
  
  const [selectedUniId, setSelectedUniId] = useState<string | null>(null);
  const [editingUniId, setEditingUniId] = useState<string | null>(null);
  const [editingSubId, setEditingSubId] = useState<{uniId: string, subId: string} | null>(null);
  const [mobileExpandedUniId, setMobileExpandedUniId] = useState<string | null>(null);
  const [uniIdToDelete, setUniIdToDelete] = useState<string | null>(null);
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const listRef = useRef<HTMLDivElement>(null);
  const downloadMenuRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (downloadMenuRef.current && !downloadMenuRef.current.contains(event.target as Node)) {
        setShowDownloadMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Load Data
  useEffect(() => {
    const savedChoices = localStorage.getItem('gst_choice_list');
    if (savedChoices) {
      try {
        setChoices(JSON.parse(savedChoices));
      } catch (e) {
        console.error("Failed to load choices", e);
      }
    }

    const savedUnis = localStorage.getItem('gst_universities_data');
    if (savedUnis) {
      try {
        const parsed = JSON.parse(savedUnis);
        if (Array.isArray(parsed)) {
          setUniversities(parsed);
          if (parsed.length > 0) setSelectedUniId(parsed[0].id);
        } else {
          setUniversities(INITIAL_UNIVERSITIES);
          setSelectedUniId(INITIAL_UNIVERSITIES[0].id);
        }
      } catch (e) {
        setUniversities(INITIAL_UNIVERSITIES);
        setSelectedUniId(INITIAL_UNIVERSITIES[0].id);
      }
    } else {
      setUniversities(INITIAL_UNIVERSITIES);
      setSelectedUniId(INITIAL_UNIVERSITIES[0].id);
    }
  }, []);

  // Selection repair check: ensure selectedUniId always points to an existing university
  useEffect(() => {
    if (universities.length > 0) {
      const exists = universities.some(u => u.id === selectedUniId);
      if (!exists) {
        setSelectedUniId(universities[0].id);
      }
    } else {
      setSelectedUniId(null);
    }
  }, [universities, selectedUniId]);

  // Save Data
  useEffect(() => {
    if (universities.length > 0) {
      localStorage.setItem('gst_universities_data', JSON.stringify(universities));
    }
  }, [universities]);

  useEffect(() => {
    localStorage.setItem('gst_choice_list', JSON.stringify(choices));
    setLastSaved(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  }, [choices]);

  const addChoice = () => {
    const newChoice: ChoiceItem = {
      id: Math.random().toString(36).substr(2, 9),
      universityId: '',
      subjectId: '',
      note: ''
    };
    setChoices([...choices, newChoice]);
  };

  const copyLatest = () => {
    if (choices.length === 0) return addChoice();
    const latest = choices[choices.length - 1];
    setChoices([...choices, { ...latest, id: Math.random().toString(36).substr(2, 9) }]);
  };

  const updateChoice = (id: string, updates: Partial<ChoiceItem>) => {
    setChoices(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const removeChoice = (id: string) => {
    setChoices(prev => prev.filter(c => c.id !== id));
  };

  const universityOptions = useMemo(() => universities.map(uni => ({
    key: uni.id,
    label: uni.fullName,
    shortVal: uni.shortName
  })), [universities]);

  const getSubjectOptionsForChoice = (uniId: string, currentChoiceId: string) => {
    const uni = universities.find(u => u.id === uniId);
    if (!uni) return [];
    const usedIds = choices.filter(c => c.id !== currentChoiceId && c.universityId === uniId).map(c => c.subjectId);
    return uni.subjects.map(sub => ({
      key: sub.id,
      label: sub.name,
      available: !usedIds.includes(sub.id)
    }));
  };

  const copyTableToClipboard = async () => {
    if (choices.length === 0) return;
    
    // Create header row
    let tsv = "SL\tUniversity\tSubject\tLast Rank\tNote\n";
    
    // Create data rows
    choices.forEach((item, index) => {
      const uni = universities.find(u => u.id === item.universityId);
      const sub = uni?.subjects.find(s => s.id === item.subjectId);
      const uniName = uni ? (uni.shortName || uni.fullName) : '';
      const subName = sub ? sub.name : '';
      const lastPos = sub ? sub.lastPos : '-';
      const note = item.note.replace(/\n/g, ' '); // Flatten notes for one line
      
      tsv += `${index + 1}\t${uniName}\t${subName}\t${lastPos}\t${note}\n`;
    });

    try {
      await navigator.clipboard.writeText(tsv);
      setCopied(true);
      setShowDownloadMenu(false);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  // Fixed Image Download
  const downloadImage = async () => {
    if (!listRef.current) return;
    setIsExporting(true);
    setShowDownloadMenu(false);
    
    try {
      // Small delay to ensure menu is closed and layout is stable
      await new Promise(r => setTimeout(r, 400));
      
      const element = listRef.current;
      
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff',
        onclone: (clonedDoc) => {
          const headers = clonedDoc.querySelector('[data-capture-headers]') as HTMLElement;
          if (headers) {
            headers.style.position = 'relative';
            headers.style.top = '0';
          }
          
          // Ensure all captured elements are visible and not transformed by motion in a way that breaks capture
          const reorderGroup = clonedDoc.querySelector('.divide-y') as HTMLElement;
          if (reorderGroup) {
            reorderGroup.style.transform = 'none';
          }
        }
      });
      
      const imgData = canvas.toDataURL('image/png', 1.0);
      setCapturedImage(imgData);
      
    } catch (error) {
      console.error("Export Error:", error);
      alert("Capture failed. Try the 'Copy Table' or 'Share Link' instead.");
    } finally {
      setIsExporting(false);
    }
  };

  // Manage Data
  const addUniversity = () => {
    const newUni: UniversityInfo = {
      id: Math.random().toString(36).substr(2, 9),
      shortName: 'VAR',
      fullName: 'New University Name',
      subjects: []
    };
    setUniversities([newUni, ...universities]);
    setSelectedUniId(newUni.id);
    setEditingUniId(newUni.id);
    setMobileExpandedUniId(newUni.id);
  };

  const updateUniversity = (id: string, updates: Partial<UniversityInfo>) => {
    setUniversities(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
  };

  const deleteUniversity = (id: string) => {
    setUniIdToDelete(id);
  };

  const confirmDeleteUniversity = () => {
    if (!uniIdToDelete) return;
    const id = uniIdToDelete;
    setUniversities(prev => prev.filter(u => u.id !== id));
    setChoices(prev => prev.map(c => c.universityId === id ? { ...c, universityId: '', subjectId: '' } : c));
    setUniIdToDelete(null);
  };

  const addSubjectToUni = (uniId: string) => {
    setUniversities(prev => prev.map(u => {
      if (u.id === uniId) {
        const newSub = { id: Math.random().toString(36).substr(2, 9), name: 'New Subject', lastPos: '-' };
        return { ...u, subjects: [newSub, ...u.subjects] };
      }
      return u;
    }));
  };

  const updateSubjectInUni = (uniId: string, subId: string, updates: Partial<SubjectInfo>) => {
    setUniversities(prev => prev.map(u => {
      if (u.id === uniId) {
        return { ...u, subjects: u.subjects.map(s => s.id === subId ? { ...s, ...updates } : s) };
      }
      return u;
    }));
  };

  const deleteSubjectInUni = (uniId: string, subId: string) => {
    setUniversities(prev => prev.map(u => {
      if (u.id === uniId) return { ...u, subjects: u.subjects.filter(s => s.id !== subId) };
      return u;
    }));
    setChoices(choices.map(c => (c.universityId === uniId && c.subjectId === subId) ? { ...c, subjectId: '' } : c));
  };

  const filteredUniversities = useMemo(() => {
    if (!searchUni) return universities;
    return universities.filter(u => 
      u.fullName.toLowerCase().includes(searchUni.toLowerCase()) || 
      u.shortName.toLowerCase().includes(searchUni.toLowerCase())
    );
  }, [universities, searchUni]);

  const selectedUniversity = useMemo(() => universities.find(u => u.id === selectedUniId), [universities, selectedUniId]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans overflow-x-hidden relative">
      
      {/* Header - STICKY TOP */}
      <header className="bg-white border-b border-slate-200 px-4 md:px-6 py-3 flex items-center justify-between shrink-0 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-slate-900 rounded-lg flex items-center justify-center text-white shadow-lg">
            <GraduationCap size={20} strokeWidth={2.5} />
          </div>
          <h1 className="text-lg font-black tracking-tight text-slate-800 uppercase">Choice Maker</h1>
        </div>
        <div className="flex items-center gap-1.5 md:gap-3">
          <div className="relative" ref={downloadMenuRef}>
            <button 
              onClick={() => setShowDownloadMenu(!showDownloadMenu)}
              className={`flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-md bg-white text-[11px] font-black uppercase text-slate-600 hover:bg-slate-50 transition-colors ${showDownloadMenu ? 'border-slate-400 bg-slate-50 ring-1 ring-slate-200' : ''}`}
            >
              <Download size={14} /> 
              <span className="hidden sm:inline">Export</span>
              <ChevronDown size={12} className={`transition-transform ${showDownloadMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* Export Menu Dropdown */}
            <AnimatePresence>
              {showDownloadMenu && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-[60] py-1"
                >
                  <button 
                    onClick={downloadImage}
                    disabled={isExporting}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-[11px] font-black uppercase text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    <ImageIcon size={14} className="text-emerald-500" />
                    <span>{isExporting ? 'Capturing...' : 'PNG Image'}</span>
                  </button>
                  <button 
                    onClick={copyTableToClipboard}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-[11px] font-black uppercase text-slate-600 hover:bg-slate-50 transition-colors border-t border-slate-50"
                  >
                    <FileSpreadsheet size={14} className="text-emerald-500" />
                    <span>Copy Table (TSV)</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Copy Feedback Toast */}
            <AnimatePresence>
              {copied && (
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 10 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="absolute left-1/2 -translate-x-1/2 top-full mt-4 bg-slate-900 text-white px-4 py-2 rounded-full text-[10px] whitespace-nowrap font-black uppercase tracking-widest shadow-xl flex items-center gap-2 pointer-events-none z-[70]"
                >
                  <ClipboardCheck size={12} className="text-green-400" />
                  Copied to Clipboard
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button 
            onClick={() => setShowManageModal(true)}
            className="p-1.5 px-2 md:px-3 flex items-center gap-2 border border-slate-200 rounded-md bg-white text-[11px] font-black uppercase text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <Settings size={14} /> <span className="hidden md:inline">Manage Varsities</span>
          </button>
          <button 
            onClick={addChoice}
            className="px-4 py-1.5 bg-slate-900 text-white rounded-md text-[11px] font-black uppercase hover:bg-black shadow-sm flex items-center gap-1.5 active:scale-95 transition-all"
          >
            <Plus size={14} /> <span className="hidden sm:inline">Add Row</span>
          </button>
        </div>
      </header>

      {/* Main UI */}
      <main className="flex-1 p-2 md:p-6 overflow-hidden flex flex-col pt-2 bg-slate-50">
        <div className="bg-white rounded-xl border border-slate-200 shadow-xl flex flex-col flex-1 overflow-hidden">
          
          {/* List Header Labels Bar - Secondary Sticky */}
          <div className="px-4 py-1.5 bg-emerald-50 border-b border-emerald-100 flex items-center justify-between text-[10px] text-emerald-700 font-black uppercase tracking-tighter">
            <div className="flex items-center gap-4">
              <span>Items: {choices.length}</span>
              <span>Universities: {new Set(choices.map(c => c.universityId).filter(Boolean)).size}</span>
            </div>
            <div className="flex items-center gap-1 italic lowercase font-medium">
              <HelpCircle size={10} />
              <span>Drag #SL to reorder</span>
            </div>
          </div>

          <div data-capture-container className="flex-1 overflow-auto relative">
            <div ref={listRef} data-capture-target className="min-w-[700px] md:min-w-full inline-block align-middle md:block bg-white">
              {/* Sticky Headers for the table */}
              <div data-capture-headers className="grid grid-cols-[40px_130px_1fr_90px_180px_40px] gap-2 px-4 py-3 bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-black text-slate-500 sticky top-0 z-30">
                <div className="flex justify-center">SL</div>
                <div className="pl-1">University</div>
                <div>Subject Opportunity</div>
                <div className="text-center">Last Rank</div>
                <div>Notes</div>
                <div className="flex justify-center">Rem</div>
              </div>

              {/* Rows */}
              <Reorder.Group axis="y" values={choices} onReorder={setChoices} className="divide-y divide-slate-100 bg-white">
                <AnimatePresence initial={false}>
                  {choices.length === 0 ? (
                    <div className="py-24 text-center">
                      <GraduationCap size={64} className="mx-auto mb-4 opacity-5 text-slate-900" />
                      <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-200">Empty List</p>
                    </div>
                  ) : (
                    choices.map((item, index) => {
                      const uni = universities.find(u => u.id === item.universityId);
                      const sub = uni?.subjects.find(s => s.id === item.subjectId);
                      const lastPos = sub?.lastPos || '-';

                      return (
                        <Reorder.Item 
                          key={item.id} 
                          value={item}
                          className="grid grid-cols-[40px_130px_1fr_90px_180px_40px] items-center gap-2 px-4 py-1.5 bg-white hover:bg-slate-50 transition-colors group"
                        >
                          <div className="flex justify-center text-[11px] font-black text-slate-300 cursor-grab active:cursor-grabbing group-hover:text-emerald-600 transition-colors">
                            #{(index + 1).toString().padStart(2, '0')}
                          </div>

                          <div className="min-w-0">
                            <SearchableSelect 
                              placeholder="Varsity"
                              value={item.universityId}
                              onChange={(val) => updateChoice(item.id, { universityId: val, subjectId: '' })}
                              options={universityOptions}
                              renderOption={(opt) => (
                                <div className="flex flex-col py-0.5">
                                  <span className="font-bold text-[11px] leading-tight">{opt.shortVal}</span>
                                  <span className="text-[9px] text-slate-400 truncate">{opt.label}</span>
                                </div>
                              )}
                            />
                          </div>

                          <div className="min-w-0">
                            <SearchableSelect 
                              placeholder="Choice"
                              value={item.subjectId}
                              disabled={!item.universityId}
                              onChange={(val) => updateChoice(item.id, { subjectId: val })}
                              options={getSubjectOptionsForChoice(item.universityId, item.id)}
                              renderOption={(opt) => (
                                <span className={`text-[11px] leading-tight ${opt.available ? 'font-bold text-slate-700' : 'text-slate-300 line-through italic'}`}>
                                  {opt.label}
                                </span>
                              )}
                            />
                          </div>

                          <div className="px-1 text-center font-mono text-[10px] font-black text-slate-500 bg-slate-50 border border-slate-100 rounded py-1.5">
                            {lastPos}
                          </div>

                          <div className="min-w-0">
                            <textarea 
                              className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-[11px] h-[32px] focus:ring-1 focus:ring-emerald-500 outline-none resize-none overflow-hidden"
                              placeholder="..."
                              rows={1}
                              value={item.note}
                              onChange={(e) => updateChoice(item.id, { note: e.target.value })}
                            />
                          </div>

                          <div className="flex justify-center">
                            <button onClick={() => removeChoice(item.id)} className="p-1 px-1.5 rounded-full text-slate-200 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100">
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </Reorder.Item>
                      );
                    })
                  )}
                </AnimatePresence>
              </Reorder.Group>
            </div>
          </div>

          <div className="p-3 border-t border-slate-200 bg-slate-50 flex gap-2">
            <button onClick={addChoice} className="flex-1 py-2 border border-slate-200 rounded bg-white text-slate-500 text-[10px] font-black uppercase tracking-widest hover:border-slate-400 transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95">
              <Plus size={14} /> New Row
            </button>
            <button onClick={copyLatest} className="flex-1 py-1.5 border border-slate-200 rounded bg-white text-slate-500 text-[10px] font-black uppercase tracking-widest hover:border-slate-400 transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95">
              <Copy size={14} /> Copy Previous
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 px-6 py-2 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 shrink-0">
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.3)]"></div>
            <span>On Device</span>
          </div>
          <span>Updated: {lastSaved}</span>
        </div>
        <button onClick={() => setShowResetConfirm(true)} className="text-red-300 hover:text-red-500 transition-colors">Reset List</button>
      </footer>

      {/* Reset Confirmation Overlay */}
      <AnimatePresence>
        {showResetConfirm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm border border-slate-200 text-center"
            >
              <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Trash2 size={24} />
              </div>
              <h3 className="text-sm font-black uppercase text-slate-800 tracking-tight mb-2">Reset Entire List?</h3>
              <p className="text-[11px] text-slate-500 mb-6 font-medium">This will clear all universities and subjects you've selected from the main list. This action cannot be undone.</p>
              <div className="flex gap-2 w-full">
                <button onClick={() => setShowResetConfirm(false)} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-[10px] font-black uppercase text-slate-500 hover:bg-slate-50">Cancel</button>
                <button 
                  onClick={() => { setChoices([]); setShowResetConfirm(false); }}
                  className="flex-1 py-2.5 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase hover:bg-red-700 shadow-lg shadow-red-100"
                >Clear Everything</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {uniIdToDelete && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm border border-slate-200"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-4">
                  <AlertTriangle size={24} />
                </div>
                <h3 className="text-sm font-black uppercase text-slate-800 tracking-tight mb-2">Delete University?</h3>
                <p className="text-[11px] text-slate-500 mb-6 font-medium">
                  This will permanently remove <b>{universities.find(u => u.id === uniIdToDelete)?.fullName}</b> and clear its selections from your choice list.
                </p>
                <div className="flex gap-2 w-full">
                  <button 
                    onClick={() => setUniIdToDelete(null)}
                    className="flex-1 py-2.5 border border-slate-200 rounded-xl text-[10px] font-black uppercase text-slate-500 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={confirmDeleteUniversity}
                    className="flex-1 py-2.5 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase hover:bg-red-700 shadow-lg shadow-red-100"
                  >
                    Delete Now
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reset (Restore Defaults) Confirmation Overlay */}
      <AnimatePresence>
        {showRestoreConfirm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm border border-slate-200 text-center"
            >
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Settings size={24} />
              </div>
              <h3 className="text-sm font-black uppercase text-slate-800 tracking-tight mb-2">Restore Defaults?</h3>
              <p className="text-[11px] text-slate-500 mb-6 font-medium">This will wipe all your custom universities and subjects and restore the original GST list. This cannot be undone.</p>
              <div className="flex gap-2 w-full">
                <button onClick={() => setShowRestoreConfirm(false)} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-[10px] font-black uppercase text-slate-500 hover:bg-slate-50">Wait, No</button>
                <button 
                  onClick={() => { 
                    setUniversities(INITIAL_UNIVERSITIES); 
                    localStorage.removeItem('gst_universities_data');
                    setShowRestoreConfirm(false);
                  }}
                  className="flex-1 py-2.5 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase hover:bg-emerald-700 shadow-lg shadow-emerald-100"
                >Restore Now</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* MANAGEMENT MODAL */}
      <AnimatePresence>
        {showManageModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-2 sm:p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="bg-white rounded-2xl shadow-3xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-200"
            >
              {/* Modal Header */}
              <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Settings size={18} /></div>
                  <h2 className="text-sm font-black uppercase text-slate-800 tracking-wider">Varsity Database</h2>
                </div>
                <button onClick={() => setShowManageModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X size={20} className="text-slate-500" />
                </button>
              </div>

              {/* Toolbar */}
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-between shrink-0">
                <button onClick={addUniversity} className="w-full sm:w-auto px-4 py-1.5 bg-emerald-600 text-white rounded-lg text-[11px] font-black uppercase tracking-widest hover:bg-emerald-700 flex items-center justify-center gap-2 shadow-lg shadow-emerald-200">
                  <Plus size={14} /> Add New Varsity
                </button>
                <div className="relative w-full sm:w-64">
                  <input 
                    className="w-full bg-white border border-slate-200 rounded-lg px-8 py-1.5 text-[11px] outline-none focus:ring-1 focus:ring-emerald-500"
                    placeholder="Search varsities..."
                    value={searchUni}
                    onChange={(e) => setSearchUni(e.target.value)}
                  />
                  <Search size={14} className="absolute left-2.5 top-2 text-slate-400" />
                </div>
              </div>

              {/* Main Content Area: Split View */}
              <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-white">
                
                {/* Left Sidebar: Varsity List */}
                <div className="w-full md:w-80 border-r border-slate-200 flex flex-col bg-white overflow-hidden">
                  <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
                    {filteredUniversities.length === 0 ? (
                      <div className="p-10 text-center text-slate-300 text-[10px] font-bold uppercase">No Varsities Found</div>
                    ) : (
                      filteredUniversities.map(uni => (
                        <div 
                          key={uni.id} 
                          className={`flex flex-col group transition-all ${selectedUniId === uni.id ? 'bg-emerald-50' : 'bg-white hover:bg-slate-50'}`}
                        >
                          <div 
                            onClick={(e) => {
                              setSelectedUniId(uni.id);
                              if (mobileExpandedUniId === uni.id) setMobileExpandedUniId(null);
                              else setMobileExpandedUniId(uni.id);
                            }}
                            className="px-4 py-3 cursor-pointer flex items-center justify-between"
                          >
                            <div className="flex items-center gap-3 overflow-hidden">
                              <span className="text-[9px] font-black bg-slate-900 text-white w-14 py-0.5 rounded shrink-0 text-center">{uni.shortName}</span>
                              <span className={`text-[11px] font-bold truncate ${selectedUniId === uni.id ? 'text-emerald-700' : 'text-slate-700'}`}>{uni.fullName}</span>
                            </div>
                            <ChevronRight size={14} className={`text-slate-300 transition-transform ${selectedUniId === uni.id ? 'translate-x-1 text-emerald-400' : ''}`} />
                          </div>

                          {/* Mobile Accordion Content */}
                          <AnimatePresence>
                            {mobileExpandedUniId === uni.id && (
                              <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="md:hidden overflow-hidden px-4 pb-4 border-t border-emerald-100/50 bg-emerald-50/50"
                              >
                                <div className="flex items-center gap-2 py-3 border-b border-emerald-100 mb-3">
                                  <button onClick={(e) => { e.stopPropagation(); addSubjectToUni(uni.id); }} className="flex-1 h-8 bg-emerald-600 text-white rounded flex items-center justify-center gap-1.5 text-[10px] font-black uppercase"><PlusCircle size={14} /> Sub</button>
                                  <button onClick={(e) => { e.stopPropagation(); setEditingUniId(uni.id); }} className="h-8 px-3 bg-white border border-emerald-200 text-emerald-600 rounded flex items-center justify-center"><Edit2 size={14} /></button>
                                  <button onClick={(e) => { e.stopPropagation(); deleteUniversity(uni.id); }} className="h-8 px-3 bg-red-50 text-red-500 rounded flex items-center justify-center text-red-500"><Trash2 size={14} /></button>
                                </div>
                                {/* Inline Subject List for Mobile */}
                                <div className="space-y-2">
                                  {uni.subjects.map(sub => (
                                    <div key={sub.id} className="bg-white rounded p-2 flex items-center justify-between shadow-xs border border-emerald-50">
                                      <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-slate-800">{sub.name}</span>
                                        <span className="text-[9px] text-slate-400">Rank: <b className="text-emerald-500">{sub.lastPos}</b></span>
                                      </div>
                                      <div className="flex gap-1">
                                        <button onClick={(e) => { e.stopPropagation(); setEditingSubId({uniId: uni.id, subId: sub.id}); }} className="p-1 text-slate-400"><Edit2 size={12} /></button>
                                        <button onClick={(e) => { e.stopPropagation(); deleteSubjectInUni(uni.id, sub.id); }} className="p-1 text-red-300"><Trash2 size={12} /></button>
                                      </div>
                                    </div>
                                  ))}
                                  {uni.subjects.length === 0 && <p className="text-[10px] italic text-slate-400 text-center py-2">No subjects added</p>}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Right Pane: Subject List & Uni Details (PC/Tab Only) */}
                <div className="hidden md:flex flex-1 flex-col bg-slate-50/30 overflow-hidden">
                  {selectedUniversity ? (
                    <div className="flex-1 flex flex-col overflow-hidden">
                      {/* Selected Uni Header */}
                      <div className="bg-white p-5 border-b border-slate-200 shrink-0">
                        {editingUniId === selectedUniversity.id ? (
                          <div className="flex gap-3 items-center">
                            <input className="w-24 bg-slate-50 border border-emerald-200 rounded px-2 py-2 text-xs font-black uppercase outline-none" value={selectedUniversity.shortName} onChange={(e) => updateUniversity(selectedUniversity.id, { shortName: e.target.value })} autoFocus />
                            <input className="flex-1 bg-slate-50 border border-emerald-200 rounded px-2 py-2 text-xs font-bold outline-none" value={selectedUniversity.fullName} onChange={(e) => updateUniversity(selectedUniversity.id, { fullName: e.target.value })} />
                            <button onClick={() => setEditingUniId(null)} className="p-2 bg-emerald-600 text-white rounded-lg shadow-lg shadow-emerald-100"><Check size={18} /></button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                              <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">{selectedUniversity.fullName}</h3>
                              <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Short Name: {selectedUniversity.shortName}</p>
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => addSubjectToUni(selectedUniversity.id)} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-[10px] font-black uppercase tracking-[0.1em] flex items-center gap-2 hover:bg-emerald-700 transition-colors"><PlusCircle size={14} /> Add Subject</button>
                              <button onClick={() => setEditingUniId(selectedUniversity.id)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors"><Edit2 size={16} /></button>
                              <button onClick={() => deleteUniversity(selectedUniversity.id)} className="p-2 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Subject List Grid */}
                      <div className="flex-1 overflow-y-auto p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          <AnimatePresence initial={false}>
                            {selectedUniversity.subjects.map(sub => (
                              <motion.div 
                                key={sub.id} 
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-all group"
                              >
                                {editingSubId?.uniId === selectedUniversity.id && editingSubId?.subId === sub.id ? (
                                  <div className="flex flex-col gap-3 w-full">
                                    <input 
                                      className="w-full bg-slate-50 border border-emerald-100 rounded-lg px-3 py-2 text-xs font-bold outline-none" 
                                      value={sub.name} 
                                      onChange={(e) => updateSubjectInUni(selectedUniversity.id, sub.id, { name: e.target.value })} 
                                    />
                                    <div className="flex items-center justify-between bg-slate-50 rounded-lg p-1 px-3">
                                      <label className="text-[10px] font-black uppercase text-slate-400">Position Rank:</label>
                                      <div className="flex items-center gap-2">
                                        <input 
                                          className="w-24 bg-white border border-slate-200 rounded px-2 py-1 text-xs font-mono font-bold text-emerald-600" 
                                          value={sub.lastPos} 
                                          onChange={(e) => updateSubjectInUni(selectedUniversity.id, sub.id, { lastPos: e.target.value })} 
                                        />
                                        <button onClick={() => setEditingSubId(null)} className="p-1 bg-emerald-600 text-white rounded"><Check size={14} /></button>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    <div className="flex flex-col min-w-0 pr-4">
                                      <h4 className="text-[11px] font-black text-slate-800 leading-tight truncate">{sub.name}</h4>
                                      <div className="flex items-center gap-2 mt-2">
                                        <span className="text-[10px] font-black text-slate-400 uppercase">Last Rank:</span>
                                        <span className="text-[11px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded leading-none">{sub.lastPos}</span>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <button onClick={() => setEditingSubId({uniId: selectedUniversity.id, subId: sub.id})} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-full"><Edit2 size={16} /></button>
                                      <button onClick={() => deleteSubjectInUni(selectedUniversity.id, sub.id)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full"><Trash2 size={16} /></button>
                                    </div>
                                  </>
                                )}
                              </motion.div>
                            ))}
                          </AnimatePresence>
                          <button 
                            onClick={() => addSubjectToUni(selectedUniversity.id)}
                            className="bg-transparent border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-emerald-300 hover:text-emerald-500 hover:bg-white transition-all group"
                          >
                            <Plus size={24} className="group-hover:scale-110 transition-transform" />
                            <span className="text-[10px] font-black uppercase tracking-widest">New Subject Opportunity</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-20 text-slate-300">
                      <GraduationCap size={48} className="mb-4 opacity-10" />
                      <p className="text-[11px] font-black uppercase tracking-widest text-center">Selected a varsity to edit its subjects</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-5 border-t border-slate-200 bg-white flex flex-col sm:flex-row justify-between gap-4 shrink-0">
                <div className="flex gap-2">
                  <button onClick={() => setShowRestoreConfirm(true)} className="px-5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 uppercase tracking-tighter transition-colors">Restore Defaults</button>
                </div>
                <button onClick={() => setShowManageModal(false)} className="px-12 py-3 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-[0.2em] hover:bg-black active:scale-95 transition-all">Close Editor</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Capture Preview Modal */}
      <AnimatePresence>
        {capturedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-3xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-800"
            >
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><ImageIcon size={18} /></div>
                  <div>
                    <h2 className="text-[10px] font-black uppercase text-slate-800 tracking-wider">Image Preview (Ready to Share)</h2>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tight">Long press or right-click to save if download fails</p>
                  </div>
                </div>
                <button onClick={() => setCapturedImage(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X size={20} className="text-slate-500" />
                </button>
              </div>
              
              <div className="flex-1 overflow-auto bg-slate-100 p-4 sm:p-8 flex items-start justify-center">
                <img 
                  src={capturedImage} 
                  alt="Choice List Capture" 
                  className="max-w-full shadow-2xl rounded-lg bg-white"
                  crossOrigin="anonymous"
                />
              </div>

              <div className="p-5 border-t border-slate-100 bg-white flex flex-col sm:flex-row justify-between gap-4 shrink-0">
                <div className="flex items-center gap-2 order-2 sm:order-1">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                   <span className="text-[10px] font-black uppercase text-slate-400">High Quality PNG Generated</span>
                </div>
                <div className="flex gap-2 order-1 sm:order-2">
                  <button 
                    onClick={() => {
                      const link = document.createElement('a');
                      link.download = `ChoiceList_${Date.now()}.png`;
                      link.href = capturedImage;
                      link.click();
                    }}
                    className="flex-1 sm:flex-initial px-8 py-3 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-[0.1em] hover:bg-black active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <Download size={16} /> Download
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
