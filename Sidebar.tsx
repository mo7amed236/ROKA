import React from 'react';
import { Users, Plus, Printer, Trash2 } from 'lucide-react';
import { Representative } from '../types';

interface SidebarProps {
  representatives: Representative[];
  selectedRep: number | null;
  onSelectRep: (id: number) => void;
  onAddRep: () => void;
  onDeleteRep: (id: number) => void;
  onPrintAll: () => void;
  onClearAll: () => void;
}

export default function Sidebar({
  representatives,
  selectedRep,
  onSelectRep,
  onAddRep,
  onDeleteRep,
  onPrintAll,
  onClearAll,
}: SidebarProps) {
  return (
    <div className="w-64 bg-gray-800 min-h-screen p-4 text-white print:hidden">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Users className="w-5 h-5" />
          المناديب
        </h2>
        <button
          onClick={onAddRep}
          className="p-2 bg-green-600 rounded-full hover:bg-green-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      
      <ul className="space-y-2 mb-6">
        {representatives.map((rep) => (
          <li
            key={rep.id}
            className={`flex items-center justify-between p-2 rounded transition-colors ${
              selectedRep === rep.id ? 'bg-gray-700' : 'hover:bg-gray-700'
            }`}
          >
            <button
              onClick={() => onSelectRep(rep.id)}
              className="text-right hover:text-gray-300 flex-1"
            >
              {rep.name}
            </button>
            <button
              onClick={() => onDeleteRep(rep.id)}
              className="text-red-400 hover:text-red-500 p-1"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </li>
        ))}
      </ul>
      
      <div className="space-y-2 mt-auto">
        <button
          onClick={onPrintAll}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <Printer className="w-4 h-4" />
          طباعة الكل
        </button>
        <button
          onClick={onClearAll}
          className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          مسح البيانات
        </button>
      </div>
    </div>
  );
}