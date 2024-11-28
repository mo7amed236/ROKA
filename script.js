let representatives = [];
let expenses = {};
let selectedRep = null;

// حفظ البيانات في LocalStorage
function saveData() {
    localStorage.setItem('representatives', JSON.stringify(representatives));
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

// استرجاع البيانات من LocalStorage
function loadData() {
    const savedRepresentatives = localStorage.getItem('representatives');
    const savedExpenses = localStorage.getItem('expenses');
    
    if (savedRepresentatives) {
        representatives = JSON.parse(savedRepresentatives);
    }
    if (savedExpenses) {
        expenses = JSON.parse(savedExpenses);
    }
    
    updateRepresentativesList();
}

// إضافة مندوب جديد
function addRepresentative() {
    const name = prompt('أدخل اسم المندوب');
    if (name) {
        const newRep = {
            id: Date.now(),
            name: name
        };
        representatives.push(newRep);
        expenses[newRep.id] = [];
        updateRepresentativesList();
        saveData();
    }
}

// حذف مندوب
function deleteRepresentative(id) {
    if (confirm('هل أنت متأكد من حذف هذا المندوب؟')) {
        representatives = representatives.filter(rep => rep.id !== id);
        delete expenses[id];
        if (selectedRep === id) {
            selectedRep = null;
            document.getElementById('expense-section').style.display = 'none';
            document.getElementById('welcome-message').style.display = 'flex';
        }
        updateRepresentativesList();
        saveData();
    }
}

// اختيار مندوب لعرض المصروفات
function selectRepresentative(id) {
    selectedRep = id;
    const rep = representatives.find(r => r.id === id);
    document.getElementById('welcome-message').style.display = 'none';
    document.getElementById('expense-section').style.display = 'block';
    document.getElementById('representative-name').textContent = rep.name;
    updateExpenseTable();
}

// إضافة صف جديد للمصروفات
function addExpenseRow() {
    if (selectedRep) {
        const newExpense = {
            id: Date.now(),
            date: new Date().toISOString().split('T')[0],
            carNumber: '',
            meterReading: '',
            description: '',
            amount: 0
        };
        expenses[selectedRep].push(newExpense);
        updateExpenseTable();
        saveData();
    }
}

// حذف صف من المصروفات
function deleteExpenseRow(expenseId) {
    if (selectedRep) {
        expenses[selectedRep] = expenses[selectedRep].filter(exp => exp.id !== expenseId);
        updateExpenseTable();
        saveData();
    }
}

// تحديث البيانات داخل الصفوف
function updateExpense(expenseId, field, value) {
    if (selectedRep) {
        expenses[selectedRep] = expenses[selectedRep].map(exp => {
            if (exp.id === expenseId) {
                return { ...exp, [field]: field === 'amount' ? parseFloat(value) || 0 : value };
            }
            return exp;
        });
        updateExpenseTable();
        saveData();
    }
}

// تحديث جدول المصروفات
function updateExpenseTable() {
    const tbody = document.getElementById('expense-table-body');
    tbody.innerHTML = '';
    
    if (selectedRep && expenses[selectedRep]) {
        expenses[selectedRep].forEach(expense => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><input type="date" value="${expense.date}" onchange="updateExpense(${expense.id}, 'date', this.value)"></td>
                <td><input type="text" value="${expense.carNumber}" onchange="updateExpense(${expense.id}, 'carNumber', this.value)"></td>
                <td><input type="text" value="${expense.meterReading}" onchange="updateExpense(${expense.id}, 'meterReading', this.value)"></td>
                <td><input type="text" value="${expense.description}" onchange="updateExpense(${expense.id}, 'description', this.value)"></td>
                <td><input type="number" value="${expense.amount}" onchange="updateExpense(${expense.id}, 'amount', this.value)"></td>
                <td><button onclick="deleteExpenseRow(${expense.id})" class="delete-btn">✕</button></td>
            `;
            tbody.appendChild(row);
        });
        
        const total = expenses[selectedRep].reduce((sum, exp) => sum + (exp.amount || 0), 0);
        document.getElementById('total-amount').textContent = total;
    }
}

// تحديث قائمة المناديب
function updateRepresentativesList() {
    const list = document.getElementById('representatives-list');
    list.innerHTML = '';
    
    representatives.forEach(rep => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span onclick="selectRepresentative(${rep.id})">${rep.name}</span>
            <button onclick="deleteRepresentative(${rep.id})" class="delete-btn">✕</button>
        `;
        list.appendChild(li);
    });
}

// طباعة التقارير لجميع المناديب
function printAllReports() {
    const printWindow = window.open('', '_blank');
    let content = '<html dir="rtl"><head><title>تقرير شامل</title>';
    content += '<style>body{font-family:Arial;} table{width:100%;border-collapse:collapse;margin-bottom:2rem;} th,td{border:1px solid #000;padding:8px;text-align:right;} h2{margin:1rem 0;}</style>';
    content += '</head><body>';
    
    let grandTotal = 0;
    
    representatives.forEach(rep => {
        const repExpenses = expenses[rep.id] || [];
        const total = repExpenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
        grandTotal += total;
        
        content += `<h2>${rep.name}</h2>`;
        content += '<table><thead><tr><th>التاريخ</th><th>رقم السيارة</th><th>رقم العداد</th><th>البيان</th><th>المبلغ</th></tr></thead><tbody>';
        
        repExpenses.forEach(exp => {
            content += `<tr>
                <td>${exp.date}</td>
                <td>${exp.carNumber}</td>
                <td>${exp.meterReading}</td>
                <td>${exp.description}</td>
                <td>${exp.amount}</td>
            </tr>`;
        });
        
        content += `<tr><td colspan="4" style="text-align:left;font-weight:bold;">الإجمالي</td><td style="font-weight:bold;">${total}</td></tr>`;
        content += '</tbody></table>';
    });
    
    content += `<h2>الإجمالي الكلي: ${grandTotal}</h2>`;
    content += '</body></html>';
    
    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.focus();
}

// مسح جميع البيانات
function clearAllData() {
    if (confirm('هل أنت متأكد من مسح جميع البيانات؟')) {
        representatives = [];
        expenses = {};
        selectedRep = null;
        document.getElementById('expense-section').style.display = 'none';
        document.getElementById('welcome-message').style.display = 'flex';
        updateRepresentativesList();
        localStorage.clear();
    }
}

// تصدير التقرير
function exportToReport() {
    const modal = document.getElementById('report-modal');
    const content = document.getElementById('report-content');
    
    let reportHTML = '';
    let grandTotal = 0;
    
    representatives.forEach(rep => {
        const repExpenses = expenses[rep.id] || [];
        const total = repExpenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
        grandTotal += total;
        
        reportHTML += `<h3>${rep.name}</h3>`;
        reportHTML += '<table><thead><tr><th>التاريخ</th><th>رقم السيارة</th><th>رقم العداد</th><th>البيان</th><th>المبلغ</th></tr></thead><tbody>';
        
        repExpenses.forEach(exp => {
            reportHTML += `<tr>
                <td>${exp.date}</td>
                <td>${exp.carNumber}</td>
                <td>${exp.meterReading}</td>
                <td>${exp.description}</td>
                <td>${exp.amount}</td>
            </tr>`;
        });
        
        reportHTML += `<tr><td colspan="4" style="text-align:left;font-weight:bold;">الإجمالي</td
