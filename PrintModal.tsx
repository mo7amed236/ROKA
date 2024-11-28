import React from 'react';
import { Printer, X } from 'lucide-react';
import { Representative, Expense } from '../types';

interface PrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  representatives: Representative[];
  expenses: { [key: number]: Expense[] };
}

export default function PrintModal({ isOpen, onClose, representatives, expenses }: PrintModalProps) {
  if (!isOpen) return null;

  const grandTotal = Object.values(expenses).reduce(
    (sum, repExpenses) => 
      sum + repExpenses.reduce((total, exp) => total + exp.amount, 0),
    0
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center print:hidden">
      <div className="bg-white rounded-lg p-6 w-[90%] max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">التقرير الشامل</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="print-section">
          {representatives.map((rep) => {
            const repExpenses = expenses[rep.id] || [];
            const total = repExpenses.reduce((sum, exp) => sum + exp.amount, 0);
            
            return (
              <div key={rep.id} className="mb-8">
                <h3 className="text-xl font-bold mb-4">{rep.name}</h3>
                <table className="w-full border-collapse mb-4">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2">التاريخ</th>
                      <th className="border p-2">رقم السيارة</th>
                      <th className="border p-2">رقم العداد</th>
                      <th className="border p-2">البيان</th>
                      <th className="border p-2">المبلغ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {repExpenses.map((exp) => (
                      <tr key={exp.id}>
                        <td className="border p-2">{exp.date}</td>
                        <td className="border p-2">{exp.carNumber}</td>
                        <td className="border p-2">{exp.meterReading}</td>
                        <td className="border p-2">{exp.description}</td>
                        <td className="border p-2">{exp.amount}</td>
                      </tr>
                    ))}
                    <tr className="bg-gray-50">
                      <td colSpan={4} className="border p-2 text-left font-bold">
                        الإجمالي
                      </td>
                      <td className="border p-2 font-bold">{total}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            );
          })}
          
          <div className="text-xl font-bold mt-8">
            الإجمالي الكلي: {grandTotal}
          </div>
        </div>
        
        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={handlePrint}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            طباعة
          </button>
        </div>
      </div>
    </div>
  );
}