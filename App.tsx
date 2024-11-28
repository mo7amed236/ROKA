import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ExpenseTable from './components/ExpenseTable';
import PrintModal from './components/PrintModal';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Representative, Expense } from './types';

function App() {
  const [representatives, setRepresentatives] = useLocalStorage<Representative[]>('representatives', []);
  const [expenses, setExpenses] = useLocalStorage<{ [key: number]: Expense[] }>('expenses', {});
  const [selectedRep, setSelectedRep] = useState<number | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  const handleAddRep = () => {
    const name = prompt('أدخل اسم المندوب');
    if (name) {
      const newRep = {
        id: Date.now(),
        name,
      };
      setRepresentatives([...representatives, newRep]);
      setExpenses({ ...expenses, [newRep.id]: [] });
    }
  };

  const handleDeleteRep = (id: number) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المندوب؟')) {
      setRepresentatives(representatives.filter((rep) => rep.id !== id));
      const newExpenses = { ...expenses };
      delete newExpenses[id];
      setExpenses(newExpenses);
      if (selectedRep === id) {
        setSelectedRep(null);
      }
    }
  };

  const handleClearAll = () => {
    if (window.confirm('هل أنت متأكد من مسح جميع البيانات؟')) {
      setRepresentatives([]);
      setExpenses({});
      setSelectedRep(null);
      localStorage.clear();
    }
  };

  const handleAddRow = () => {
    if (selectedRep) {
      const newExpense: Expense = {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        carNumber: '',
        meterReading: '',
        description: '',
        amount: 0,
      };
      setExpenses({
        ...expenses,
        [selectedRep]: [...(expenses[selectedRep] || []), newExpense],
      });
    }
  };

  const handleDeleteRow = (expenseId: number) => {
    if (selectedRep) {
      setExpenses({
        ...expenses,
        [selectedRep]: expenses[selectedRep].filter((exp) => exp.id !== expenseId),
      });
    }
  };

  const handleUpdateExpense = (updatedExpense: Expense) => {
    if (selectedRep) {
      setExpenses({
        ...expenses,
        [selectedRep]: expenses[selectedRep].map((exp) =>
          exp.id === updatedExpense.id ? updatedExpense : exp
        ),
      });
    }
  };

  return (
    <div className="flex min-h-screen" dir="rtl">
      <Sidebar
        representatives={representatives}
        selectedRep={selectedRep}
        onSelectRep={setSelectedRep}
        onAddRep={handleAddRep}
        onDeleteRep={handleDeleteRep}
        onPrintAll={() => setIsPrintModalOpen(true)}
        onClearAll={handleClearAll}
      />
      <div className="flex-1 bg-white">
        {selectedRep ? (
          <>
            <div className="p-4 bg-gray-100 border-b">
              <h1 className="text-2xl font-bold">
                {representatives.find((rep) => rep.id === selectedRep)?.name}
              </h1>
            </div>
            <ExpenseTable
              expenses={expenses[selectedRep] || []}
              onAddRow={handleAddRow}
              onDeleteRow={handleDeleteRow}
              onUpdateExpense={handleUpdateExpense}
            />
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            اختر مندوباً من القائمة
          </div>
        )}
      </div>
      <PrintModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        representatives={representatives}
        expenses={expenses}
      />
    </div>
  );
}

export default App;