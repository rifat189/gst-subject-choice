/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, useMemo, ReactNode } from 'react';
import { motion, Reorder, AnimatePresence, useDragControls } from 'motion/react';
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
  Save,
  ChevronRight,
  Search,
  ClipboardCheck,
  FileSpreadsheet,
  FileCode,
  FileText,
  Layers,
  RotateCcw
} from 'lucide-react';
import html2canvas from 'html2canvas';

import { INITIAL_UNIVERSITIES } from './constants';
import { ChoiceItem, UniversityInfo, SubjectInfo } from './types';

interface ChoiceRowProps {
  key?: string | number; // Added to satisfy TS when used in map
  item: ChoiceItem;
  index: number;
  universities: UniversityInfo[];
  updateChoice: (id: string, updates: Partial<ChoiceItem>) => void;
  removeChoice: (id: string) => void;
  getSubjectOptionsForChoice: (uniId: string, choiceId: string) => any[];
  universityOptions: any[];
  isScrolled: boolean;
}

// New Row Component to allow useDragControls hook usage
function ChoiceRow({ 
  item, 
  index, 
  universities, 
  updateChoice, 
  removeChoice, 
  getSubjectOptionsForChoice,
  universityOptions,
  isScrolled
}: ChoiceRowProps) {
  const dragControls = useDragControls();
  const uni = universities.find(u => u.id === item.universityId);
  const sub = uni?.subjects.find(s => s.id === item.subjectId);
  const lastPos = sub?.lastPos || '-';

  return (
    <Reorder.Item 
      key={item.id} 
      value={item}
      dragListener={false}
      dragControls={dragControls}
      initial={false}
      animate={{ 
        scale: 1, 
        backgroundColor: 'rgb(255 255 255)', 
        boxShadow: '0 0px 0px 0px rgba(0, 0, 0, 0)',
        zIndex: 1
      }}
      whileDrag={{ 
        scale: 1.02,
        backgroundColor: 'rgb(248 250 252)', // slate-50
        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        zIndex: 100
      }}
      transition={{ duration: 0.2 }}
      className="grid grid-cols-[44px_130px_1fr_90px_180px_40px] gap-2 px-0 py-0 bg-white border-b border-slate-100 transition-colors group select-none relative"
    >
      <div 
        onPointerDown={(e) => {
          dragControls.start(e);
          // Prevent text selection during drag
          if (e.cancelable) e.preventDefault();
        }}
        className={`sticky left-0 bg-white z-20 flex items-center justify-center text-[10px] font-black text-slate-300 cursor-grab active:cursor-grabbing group-hover:text-emerald-600 transition-all px-1 touch-none select-none border-r border-slate-100 h-12 ${isScrolled ? 'shadow-[2px_0_4px_rgba(0,0,0,0.05)]' : ''}`}
      >
        <GripVertical size={12} className="opacity-30 flex-shrink-0" />
        <span className="flex-shrink-0">{(index + 1).toString().padStart(2, '0')}</span>
      </div>

      <div className="flex items-center min-w-0 py-2">
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

      <div className="flex items-center min-w-0 py-2">
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

      <div className="flex items-center justify-center py-2 px-1">
        <div className="w-full text-center font-mono text-[10px] font-black text-slate-500 bg-slate-50 border border-slate-100 rounded py-1.5">
          {lastPos}
        </div>
      </div>

      <div className="flex items-center min-w-0 py-2">
        <textarea 
          className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-[11px] h-[32px] focus:ring-1 focus:ring-emerald-500 outline-none resize-none overflow-hidden"
          placeholder="..."
          rows={1}
          value={item.note}
          onChange={(e) => updateChoice(item.id, { note: e.target.value })}
        />
      </div>

      <div className="flex items-center justify-center py-2">
        <button onClick={() => removeChoice(item.id)} className="p-1 px-1.5 rounded-full text-slate-300 md:text-slate-200 hover:text-red-500 hover:bg-red-50 transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100">
          <Trash2 size={13} />
        </button>
      </div>
    </Reorder.Item>
  );
}

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
  const [openUpward, setOpenUpward] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const checkDirection = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      // If less than 200px below, and more space above, open upward
      setOpenUpward(spaceBelow < 200 && rect.top > spaceBelow);
    }
  };

  useEffect(() => {
    if (isOpen) {
      checkDirection();
    }
  }, [isOpen]);

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
        <div className={`absolute z-50 w-full bg-white border border-slate-200 rounded shadow-xl max-h-48 overflow-y-auto ring-1 ring-black/5 ${openUpward ? 'bottom-full mb-1' : 'top-full mt-1'}`}>
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
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [copyFormat, setCopyFormat] = useState<'TSV' | 'ASCII'>('TSV');
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [templateSelectedUniIds, setTemplateSelectedUniIds] = useState<string[]>([]);
  const [selectedColumns, setSelectedColumns] = useState<string[]>(['SL', 'University', 'Subject', 'Last Rank', 'Note']);
  const [isTableScrolled, setIsTableScrolled] = useState(false);

  const listRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const downloadMenuRef = useRef<HTMLDivElement>(null);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setIsTableScrolled(e.currentTarget.scrollLeft > 0);
  };

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
        let parsed = JSON.parse(savedUnis);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Data Migration/Repair: Fix the 'pstu' vs 'prstu' conflict if it exists in saved data
          const pirojpur = parsed.find((u: any) => u.fullName.toLowerCase().includes('pirojpur'));
          if (pirojpur && pirojpur.id === 'pstu') {
            pirojpur.id = 'prstu';
            pirojpur.shortName = 'PrSTU';
            // Also update choices pointing to the old ID
            const savedChoices = localStorage.getItem('gst_choice_list');
            if (savedChoices) {
              const cParsed = JSON.parse(savedChoices);
              const cFixed = cParsed.map((c: any) => c.universityId === 'pstu' && pirojpur.fullName.includes(c.universityId) ? {...c, universityId: 'prstu'} : c);
              localStorage.setItem('gst_choice_list', JSON.stringify(cFixed));
              setChoices(cFixed);
            }
          }
          
          setUniversities(parsed);
          setSelectedUniId(parsed[0].id);
          return;
        }
      } catch (e) {
        console.error("Failed to load universities", e);
      }
    }
    
    setUniversities(INITIAL_UNIVERSITIES);
    setSelectedUniId(INITIAL_UNIVERSITIES[0].id);
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
    // Only show subjects NOT already used in other rows for THIS university
    const usedIds = choices
      .filter(c => c.id !== currentChoiceId && c.universityId === uniId && c.subjectId)
      .map(c => c.subjectId);
    
    return uni.subjects
      .filter(sub => !usedIds.includes(sub.id))
      .map(sub => ({
        key: sub.id,
        label: sub.name,
        available: true
      }));
  };

  const ALL_COLUMNS = ['SL', 'University', 'Subject', 'Last Rank', 'Note'];

  const applyTemplate = () => {
    const allItems: ChoiceItem[] = [];
    
    // Only use selected universities
    const selectedUnis = universities.filter(u => templateSelectedUniIds.includes(u.id));

    selectedUnis.forEach(uni => {
      uni.subjects.forEach(sub => {
        allItems.push({
          id: Math.random().toString(36).substr(2, 9),
          universityId: uni.id,
          subjectId: sub.id,
          note: ''
        });
      });
    });

    const parseRank = (val: string | number | undefined) => {
      if (val === undefined || val === null) return 999999;
      if (typeof val === 'number') return val;
      // Extract first sequence of digits
      const match = val.toString().match(/\d+/);
      if (!match) return 999999;
      return parseInt(match[0], 10);
    };

    // Sort ascending by lastPos (Best rank first)
    allItems.sort((a, b) => {
      const uA = universities.find(u => u.id === a.universityId);
      const sA = uA?.subjects.find(s => s.id === a.subjectId);
      const uB = universities.find(u => u.id === b.universityId);
      const sB = uB?.subjects.find(s => s.id === b.subjectId);
      
      const rankA = parseRank(sA?.lastPos);
      const rankB = parseRank(sB?.lastPos);
      
      if (rankA !== rankB) return rankA - rankB;
      // Secondary sort by name if ranks are identical
      return (sA?.name || '').localeCompare(sB?.name || '');
    });

    setChoices(allItems);
    setShowTemplateModal(false);
  };

  const performCopyTable = async () => {
    // Only export valid rows (must have university and subject)
    const validChoices = choices.filter(c => c.universityId && c.subjectId);
    if (validChoices.length === 0) return;
    
    // Prepare rows
    const rows: string[][] = [];
    validChoices.forEach((item, index) => {
      const uni = universities.find(u => u.id === item.universityId);
      const sub = uni?.subjects.find(s => s.id === item.subjectId);
      
      const rowData: string[] = [];
      if (selectedColumns.includes('SL')) rowData.push((index + 1).toString());
      if (selectedColumns.includes('University')) rowData.push(uni ? (uni.shortName || uni.fullName) : '');
      if (selectedColumns.includes('Subject')) rowData.push(sub ? sub.name : '');
      if (selectedColumns.includes('Last Rank')) rowData.push(sub ? sub.lastPos.toString() : '-');
      if (selectedColumns.includes('Note')) rowData.push(item.note.replace(/\n/g, ' '));
      
      rows.push(rowData);
    });

    let content = "";
    if (copyFormat === 'TSV') {
      content = selectedColumns.join('\t') + '\n';
      content += rows.map(r => r.join('\t')).join('\n');
    } else {
      // ASCII Table logic - Strict requirements
      // Max Width: 48 (safe under 50)
      // Borders use: +, -, |
      const N = selectedColumns.length;
      const borderCharsCount = 3 * N + 1; // | cell | cell | -> 3 chars per cell + 1 ending |
      const totalAvailableWidth = 47 - borderCharsCount; 
      
      // Assign tentative max widths based on column importance
      const maxColWidths = selectedColumns.map(col => {
        if (col === 'SL') return 3;
        if (col === 'Last Rank') return 5;
        if (col === 'University') return 10;
        if (col === 'Subject') return 12;
        if (col === 'Note') return 10;
        return 8;
      });

      // Distribute remaining width if any
      const currentTotal = maxColWidths.reduce((a, b) => a + b, 0);
      const diff = totalAvailableWidth - currentTotal;
      if (diff > 0 && selectedColumns.includes('Subject')) {
        const subIndex = selectedColumns.indexOf('Subject');
        maxColWidths[subIndex] += diff;
      }

      const truncate = (val: string, max: number) => {
        const s = val.toString();
        if (s.length <= max) return s;
        return s.substring(0, max - 1) + '.'; // dots are standard ASCII
      };

      const truncatedRows = rows.map(row => 
        row.map((cell, i) => truncate(cell, maxColWidths[i]))
      );
      const truncatedHeaders = selectedColumns.map((col, i) => truncate(col, maxColWidths[i]));

      const colWidths = truncatedHeaders.map((col, i) => 
        Math.max(col.length, ...truncatedRows.map(row => row[i]?.length || 0))
      );

      const createDivider = () => '+' + colWidths.map(w => '-'.repeat(w + 2)).join('+') + '+';
      const formatRow = (r: string[]) => '| ' + r.map((cell, i) => cell.toString().padEnd(colWidths[i])).join(' | ') + ' |';
      
      let table = "```\n";
      table += createDivider() + '\n';
      table += formatRow(truncatedHeaders) + '\n';
      table += createDivider() + '\n';
      truncatedRows.forEach(row => {
        table += formatRow(row) + '\n';
      });
      table += createDivider() + '\n';
      table += "```";
      content = table;
    }

    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setShowCopyModal(false);
      setShowDownloadMenu(false);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
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
    <div className="h-screen bg-slate-50 text-slate-900 flex flex-col font-sans overflow-hidden relative">
      
      {/* Header - FIXED TOP */}
      <header className="bg-white border-b border-slate-200 px-4 md:px-6 py-3 flex items-center justify-between shrink-0 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-slate-900 rounded-lg flex items-center justify-center text-white shadow-lg">
            <GraduationCap size={20} strokeWidth={2.5} />
          </div>
          <h1 className="text-lg font-black tracking-tight text-slate-800 uppercase">Choice Maker</h1>
        </div>
        <div className="flex items-center gap-1.5 md:gap-3">
          <button 
            onClick={() => {
              setTemplateSelectedUniIds(universities.map(u => u.id));
              setShowTemplateModal(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-md bg-white text-[11px] font-black uppercase text-slate-600 hover:border-emerald-200 hover:text-emerald-600 hover:bg-emerald-50 transition-all active:scale-95 group shadow-sm"
            title="Import Subjects by Selected Varsities"
          >
            <FileText size={14} className="group-hover:text-emerald-500" /> 
            <span className="hidden md:inline">Template</span>
          </button>

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
                    onClick={() => {
                       setCopyFormat('ASCII');
                       setShowCopyModal(true);
                       setShowDownloadMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-[11px] font-black uppercase text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    <FileCode size={14} className="text-emerald-500" />
                    <span>Copy Table (ASCII)</span>
                  </button>
                  <button 
                    onClick={() => {
                       setCopyFormat('TSV');
                       setShowCopyModal(true);
                       setShowDownloadMenu(false);
                    }}
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
            onClick={() => setShowResetConfirm(true)}
            className="p-1.5 md:p-2 flex items-center justify-center rounded-md text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all active:scale-90"
            title="Reset/Clear List"
          >
            <RotateCcw size={16} strokeWidth={2.5} />
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

          <div data-capture-container className="flex-1 overflow-auto relative" ref={scrollContainerRef} onScroll={handleScroll}>
            <div ref={listRef} data-capture-target className="min-w-[700px] md:min-w-full inline-block align-middle md:block bg-white">
              {/* Sticky Headers for the table */}
              <div data-capture-headers className="grid grid-cols-[44px_130px_1fr_90px_180px_40px] gap-2 px-0 py-0 bg-white md:bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-black text-slate-500 sticky top-0 z-30">
                <div className={`sticky left-0 bg-white md:bg-slate-50 z-40 flex items-center justify-center border-r border-slate-100 transition-all h-10 ${isTableScrolled ? 'shadow-[2px_0_4px_rgba(0,0,0,0.05)]' : ''}`}>SL</div>
                <div className="pl-3 flex items-center">University</div>
                <div className="flex items-center">Subject Opportunity</div>
                <div className="text-center flex items-center justify-center">Last Rank</div>
                <div className="flex items-center">Notes</div>
                <div className="flex items-center justify-center">Rem</div>
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
                    choices.map((item, index) => (
                      <ChoiceRow 
                        key={item.id}
                        item={item}
                        index={index}
                        universities={universities}
                        updateChoice={updateChoice}
                        removeChoice={removeChoice}
                        getSubjectOptionsForChoice={getSubjectOptionsForChoice}
                        universityOptions={universityOptions}
                        isScrolled={isTableScrolled}
                      />
                    ))
                  )}
                </AnimatePresence>
              </Reorder.Group>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Action Hub */}
      <div className="fixed bottom-12 right-6 z-[60] flex md:flex-col flex-row-reverse items-end md:items-center gap-3 pointer-events-none">
        <button 
          onClick={addChoice} 
          className="pointer-events-auto h-12 w-12 md:w-auto md:px-6 bg-slate-900 border border-slate-800 rounded-full text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-600 transition-all flex items-center justify-center md:gap-3 shadow-xl active:scale-95"
          title="Add New Row"
        >
          <Plus size={20} />
          <span className="hidden md:inline">New Row</span>
        </button>
        <button 
          onClick={copyLatest} 
          className="pointer-events-auto h-10 w-10 md:w-auto md:px-4 bg-white border border-slate-200 rounded-full text-slate-600 text-[10px] font-black uppercase tracking-widest hover:border-emerald-300 hover:text-emerald-600 transition-all flex items-center justify-center md:gap-2 shadow-lg active:scale-95"
          title="Copy Previous Row"
        >
          <Copy size={18} className="text-emerald-500" />
          <span className="hidden md:inline">Copy Previous</span>
        </button>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 px-6 py-2 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 shrink-0">
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.3)]"></div>
            <span>On Device</span>
          </div>
          <span>Updated: {lastSaved}</span>
        </div>
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
                            <div className="flex items-center gap-3 overflow-hidden flex-1">
                              {editingUniId === uni.id ? (
                                <div className="flex gap-1 w-full" onClick={(e) => e.stopPropagation()}>
                                  <input 
                                    className="w-12 bg-slate-50 border border-emerald-200 rounded px-1 py-1 text-[9px] font-black uppercase outline-none" 
                                    value={uni.shortName} 
                                    onChange={(e) => updateUniversity(uni.id, { shortName: e.target.value })} 
                                    autoFocus 
                                  />
                                  <input 
                                    className="flex-1 bg-slate-50 border border-emerald-200 rounded px-1 py-1 text-[9px] font-bold outline-none" 
                                    value={uni.fullName} 
                                    onChange={(e) => updateUniversity(uni.id, { fullName: e.target.value })} 
                                  />
                                  <button 
                                    onClick={() => setEditingUniId(null)} 
                                    className="p-1 bg-emerald-600 text-white rounded"
                                  >
                                    <Check size={12} />
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <span className="text-[9px] font-black bg-slate-900 text-white w-14 py-0.5 rounded shrink-0 text-center">{uni.shortName}</span>
                                  <span className={`text-[11px] font-bold truncate ${selectedUniId === uni.id ? 'text-emerald-700' : 'text-slate-700'}`}>{uni.fullName}</span>
                                </>
                              )}
                            </div>
                            <ChevronRight size={14} className={`hidden md:block text-slate-300 transition-transform ${selectedUniId === uni.id ? 'translate-x-1 text-emerald-400' : ''}`} />
                            <ChevronDown size={14} className={`md:hidden text-slate-300 transition-transform ${mobileExpandedUniId === uni.id ? 'rotate-180 text-emerald-400' : ''}`} />
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
                                    <div key={sub.id} className="bg-white rounded p-2 flex flex-col gap-2 shadow-xs border border-emerald-50">
                                      {editingSubId?.uniId === uni.id && editingSubId?.subId === sub.id ? (
                                        <div className="flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
                                          <input 
                                            className="w-full bg-slate-50 border border-emerald-100 rounded px-2 py-1 text-[10px] font-bold outline-none" 
                                            value={sub.name} 
                                            onChange={(e) => updateSubjectInUni(uni.id, sub.id, { name: e.target.value })} 
                                          />
                                          <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                              <span className="text-[9px] font-black uppercase text-slate-400">Rank:</span>
                                              <input 
                                                className="w-20 bg-white border border-slate-200 rounded px-1 py-0.5 text-[10px] font-mono font-bold text-emerald-600" 
                                                value={sub.lastPos} 
                                                onChange={(e) => updateSubjectInUni(uni.id, sub.id, { lastPos: e.target.value })} 
                                              />
                                            </div>
                                            <button onClick={() => setEditingSubId(null)} className="p-1.5 bg-emerald-600 text-white rounded"><Check size={12} /></button>
                                          </div>
                                        </div>
                                      ) : (
                                        <div className="flex items-center justify-between">
                                          <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-slate-800">{sub.name}</span>
                                            <span className="text-[9px] text-slate-400">Rank: <b className="text-emerald-500">{sub.lastPos}</b></span>
                                          </div>
                                          <div className="flex gap-1">
                                            <button onClick={(e) => { e.stopPropagation(); setEditingSubId({uniId: uni.id, subId: sub.id}); }} className="p-1 text-slate-400"><Edit2 size={12} /></button>
                                            <button onClick={(e) => { e.stopPropagation(); deleteSubjectInUni(uni.id, sub.id); }} className="p-1 text-red-300"><Trash2 size={12} /></button>
                                          </div>
                                        </div>
                                      )}
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

      {/* University Selection Modal for Template */}
      <AnimatePresence>
        {showTemplateModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[160] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 flex flex-col max-h-[85vh]"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
                <div>
                  <h3 className="text-sm font-black uppercase text-slate-800 tracking-tight">Select Varsities for Template</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Subjects will be added by historical rank</p>
                </div>
                <button onClick={() => setShowTemplateModal(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center shrink-0">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 accent-emerald-600 cursor-pointer"
                    checked={templateSelectedUniIds.length === universities.length}
                    onChange={(e) => {
                      if (e.target.checked) setTemplateSelectedUniIds(universities.map(u => u.id));
                      else setTemplateSelectedUniIds([]);
                    }}
                  />
                  <span className="text-[11px] font-black uppercase text-slate-600 group-hover:text-emerald-600 transition-colors">Select All Universities</span>
                </label>
                <span className="text-[10px] font-black text-slate-300 uppercase">{templateSelectedUniIds.length}/{universities.length} Selected</span>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-1">
                {universities.map(uni => (
                  <label key={uni.id} className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${templateSelectedUniIds.includes(uni.id) ? 'bg-emerald-50 border-emerald-100 shadow-sm' : 'bg-white border-transparent hover:border-slate-200 text-slate-500'}`}>
                    <div className="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 accent-emerald-600 cursor-pointer"
                        checked={templateSelectedUniIds.includes(uni.id)}
                        onChange={(e) => {
                          if (e.target.checked) setTemplateSelectedUniIds([...templateSelectedUniIds, uni.id]);
                          else setTemplateSelectedUniIds(templateSelectedUniIds.filter(id => id !== uni.id));
                        }}
                      />
                      <div className="flex flex-col">
                        <span className={`text-xs font-bold leading-tight ${templateSelectedUniIds.includes(uni.id) ? 'text-emerald-900' : 'text-slate-700'}`}>{uni.fullName}</span>
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-0.5">{uni.subjects.length} Subjects Available</span>
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              <div className="p-6 border-t border-slate-100 bg-white shrink-0">
                <button 
                  onClick={applyTemplate}
                  disabled={templateSelectedUniIds.length === 0}
                  className="w-full py-4 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-[0.2em] hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3"
                >
                  <PlusCircle size={18} /> Confirm & Import Template
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Column Selection Modal for Copy */}
      <AnimatePresence>
        {showCopyModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[160] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm border border-slate-200"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-black uppercase text-slate-800 tracking-tight">Copy as {copyFormat}</h3>
                <button onClick={() => setShowCopyModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-2 mb-6">
                <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer border border-transparent hover:border-slate-100 transition-all">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 accent-emerald-600 cursor-pointer"
                    checked={selectedColumns.length === ALL_COLUMNS.length}
                    onChange={(e) => {
                      if (e.target.checked) setSelectedColumns(ALL_COLUMNS);
                      else setSelectedColumns([]);
                    }}
                  />
                  <span className="text-xs font-black uppercase text-slate-900">Select All</span>
                </label>
                <div className="h-px bg-slate-100 my-2" />
                {ALL_COLUMNS.map(col => (
                  <label key={col} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 accent-emerald-600 cursor-pointer"
                      checked={selectedColumns.includes(col)}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedColumns([...selectedColumns, col]);
                        else setSelectedColumns(selectedColumns.filter(c => c !== col));
                      }}
                    />
                    <span className="text-xs font-bold text-slate-700">{col}</span>
                  </label>
                ))}
              </div>

              <button 
                onClick={performCopyTable}
                disabled={selectedColumns.length === 0}
                className="w-full py-3 bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-[0.1em] hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-100 transition-all flex items-center justify-center gap-2"
              >
                <ClipboardCheck size={16} /> Copy Table
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Capture Preview Modal Removed - PDFs download directly */}
    </div>
  );
}
