import React from 'react';
import { Printer, Plus, Trash2 } from 'lucide-react';

interface Expense {
  id: number;
  date: string;
  carNumber: string;
  meterReading: string;
  description: string;
  amount: number;
}

interface ExpenseTableProps {
  expenses: Expense[];
  onAddRow: () => void;
  onDeleteRow: (id: number) => void;
  onUpdateExpense: (expense: Expense) => void;
}

export default function ExpenseTable({
  expenses,
  onAddRow,
  onDeleteRow,
  onUpdateExpense,
}: ExpenseTableProps) {
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="p-6">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-right">التاريخ</th>
              <th className="border p-2 text-right">رقم السيارة</th>
              <th className="border p-2 text-right">رقم العداد</th>
              <th className="border p-2 text-right">البيان</th>
              <th className="border p-2 text-right">المبلغ</th>
              <th className="border p-2"></th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id}>
                <td className="border p-2">
                  <input
                    type="date"
                    value={expense.date}
                    onChange={(e) =>
                      onUpdateExpense({ ...expense, date: e.target.value })
                    }
                    className="w-full"
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="text"
                    value={expense.carNumber}
                    onChange={(e) =>
                      onUpdateExpense({ ...expense, carNumber: e.target.value })
                    }
                    className="w-full"
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="text"
                    value={expense.meterReading}
                    onChange={(e) =>
                      onUpdateExpense({ ...expense, meterReading: e.target.value })
                    }
                    className="w-full"
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="text"
                    value={expense.description}
                    onChange={(e) =>
                      onUpdateExpense({ ...expense, description: e.target.value })
                    }
                    className="w-full"
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="number"
                    value={expense.amount}
                    onChange={(e) =>
                      onUpdateExpense({
                        ...expense,
                        amount: parseFloat(e.target.value),
                      })
                    }
                    className="w-full"
                  />
                </td>
                <td className="border p-2">
                  <button
                    onClick={() => onDeleteRow(expense.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-50">
              <td colSpan={4} className="border p-2 text-right font-bold">
                الإجمالي
              </td>
              <td className="border p-2 font-bold">{total}</td>
              <td className="border p-2"></td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="mt-4 flex justify-between">
        <button
          onClick={onAddRow}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          إضافة صف
        </button>
        <button
          onClick={() => window.print()}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center gap-2"
        >
          <Printer className="w-4 h-4" />
          طباعة
        </button>
      </div>
    </div>
  );
}