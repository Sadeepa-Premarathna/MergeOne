import React, { useMemo, useState } from 'react';
import { X } from 'lucide-react';
import { Employee } from '../data/mockData';

interface AddEmployeeModalProps {
  onClose: () => void;
  onCreate: (employee: Employee) => void;
  existingDepartments?: string[];
}

type FormState = {
  employee_id: string;
  name: string;
  nic: string;
  email: string;
  phone: string;
  role: string;
  date_of_birth: string;
  basic_salary: string;
  status: Employee['status'];
  department: string;
  join_date: string;
  address: string;
  gender: '' | 'Male' | 'Female' | 'Other';
};

const initialState: FormState = {
  employee_id: '',
  name: '',
  nic: '',
  email: '',
  phone: '',
  role: '',
  date_of_birth: '',
  basic_salary: '',
  status: 'Active',
  department: '',
  join_date: '',
  address: '',
  gender: '',
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Employee ID: Must start with "EMP" followed by exactly 4 digits
const employeeIdRegex = /^EMP\d{4}$/;
// Employee Name: Only letters and spaces, 3-50 characters
const employeeNameRegex = /^[A-Za-z ]{3,50}$/;
// NIC: Exactly 10 characters - 9 digits followed by V or v
const nicRegex = /^\d{9}[Vv]$/;
// Phone: Exactly 10 digits only
const phoneRegex = /^\d{10}$/;

// Phone validation function
const validatePhone = (phone: string): { isValid: boolean; error: string } => {
  if (!phone) {
    return { isValid: false, error: 'Phone number is required' };
  }
  
  // Check if input is exactly 10 digits - reject anything else
  if (!phoneRegex.test(phone)) {
    return { isValid: false, error: 'Phone number must be exactly 10 digits.' };
  }
  
  return { isValid: true, error: '' };
};

// Date validation functions
const isAtLeast18YearsOld = (dateOfBirth: string): boolean => {
  if (!dateOfBirth) return false;
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();
  
  return age > 18 || (age === 18 && (monthDiff > 0 || (monthDiff === 0 && dayDiff >= 0)));
};

const isJoinDateValid = (joinDate: string, dateOfBirth: string): boolean => {
  if (!joinDate || !dateOfBirth) return false;
  
  const joinDateObj = new Date(joinDate);
  const birthDateObj = new Date(dateOfBirth);
  const today = new Date();
  
  // Join date cannot be in the future
  if (joinDateObj > today) return false;
  
  // Must be at least 18 years after date of birth
  const age = joinDateObj.getFullYear() - birthDateObj.getFullYear();
  const monthDiff = joinDateObj.getMonth() - birthDateObj.getMonth();
  const dayDiff = joinDateObj.getDate() - birthDateObj.getDate();
  
  return age > 18 || (age === 18 && (monthDiff > 0 || (monthDiff === 0 && dayDiff >= 0)));
};

const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({ onClose, onCreate, existingDepartments }) => {
  const [form, setForm] = useState<FormState>(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [backendErrors, setBackendErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<keyof FormState, boolean>>({
    employee_id: false,
    name: false,
    nic: false,
    email: false,
    phone: false,
    role: false,
    date_of_birth: false,
    basic_salary: false,
    status: false,
    department: false,
    join_date: false,
    address: false,
    gender: false,
  });

  const departments = useMemo(() => (existingDepartments && existingDepartments.length > 0
    ? existingDepartments
    : ['HR','Finance','Manufacturing','Sales','Distribution']
  ), [existingDepartments]);

  const statusOptions = ['Active', 'Inactive', 'Resigned', 'Terminated'];

  const errors = useMemo(() => {
    const e: Partial<Record<keyof FormState, string>> = {};
    
    // Employee ID validation - Must start with "EMP" followed by exactly 4 digits
    if (!form.employee_id.trim()) {
      e.employee_id = 'Employee ID is required';
    } else if (!employeeIdRegex.test(form.employee_id.trim())) {
      e.employee_id = 'Employee ID must be in format EMP#### (e.g., EMP0001)';
    }
    
    // Employee Name validation - Only letters and spaces, 3-50 characters
    if (!form.name.trim()) {
      e.name = 'Full name is required';
    } else if (!/^[A-Za-z ]{3,50}$/.test(form.name.trim())) {
      e.name = 'Name must contain only letters and spaces (3-50 characters)';
    }
    
    // NIC validation - Exactly 10 characters: 9 digits followed by V or v
    if (!form.nic.trim()) {
      e.nic = 'NIC is required';
    } else if (!nicRegex.test(form.nic.trim())) {
      e.nic = 'NIC must be exactly 10 characters: 9 digits followed by V or v (e.g., 123456789V)';
    }
    
    // Email validation
    if (!form.email.trim()) {
      e.email = 'Email is required';
    } else if (!emailRegex.test(form.email.trim())) {
      e.email = 'Email is invalid';
    }
    
    // Phone validation - Exactly 10 digits
    const phoneValidation = validatePhone(form.phone.trim());
    if (!phoneValidation.isValid) {
      e.phone = phoneValidation.error;
    }
    
    // Role validation
    if (!form.role.trim()) {
      e.role = 'Role is required';
    }
    
    // Date of Birth validation - Cannot be future date and must be at least 18 years old
    if (!form.date_of_birth) {
      e.date_of_birth = 'Date of birth is required';
    } else {
      const birthDate = new Date(form.date_of_birth);
      const today = new Date();
      
      if (birthDate > today) {
        e.date_of_birth = 'Date of birth cannot be a future date';
      } else if (!isAtLeast18YearsOld(form.date_of_birth)) {
        e.date_of_birth = 'Employee must be at least 18 years old';
      }
    }
    
    // Join Date validation - Cannot be future date and must be at least 18 years after DOB
    if (!form.join_date) {
      e.join_date = 'Join date is required';
    } else {
      const joinDate = new Date(form.join_date);
      const today = new Date();
      
      if (joinDate > today) {
        e.join_date = 'Join date cannot be a future date';
      } else if (form.date_of_birth && !isJoinDateValid(form.join_date, form.date_of_birth)) {
        e.join_date = 'Join date must be at least 18 years after date of birth';
      }
    }
    
    // Basic salary validation
    if (!form.basic_salary) {
      e.basic_salary = 'Base salary is required';
    } else if (Number.isNaN(Number(form.basic_salary)) || Number(form.basic_salary) <= 0) {
      e.basic_salary = 'Enter a valid amount';
    }
    
    // Status validation
    if (!form.status) {
      e.status = 'Status is required';
    }
    
    // Department validation
    if (!form.department.trim()) {
      e.department = 'Department is required';
    }
    
    // address optional
    // gender optional
    return e;
  }, [form]);

  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors]);

  const setField = (key: keyof FormState, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
    // Clear backend errors when user starts typing
    if (backendErrors[key]) {
      setBackendErrors(prev => ({ ...prev, [key]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched to show validation errors
    const allTouched: Record<keyof FormState, boolean> = { ...touched } as any;
    (Object.keys(initialState) as Array<keyof FormState>).forEach(k => { allTouched[k] = true; });
    setTouched(allTouched);
    
    // Check if form is valid
    if (!isValid) {
      console.log('Form validation errors:', errors);
      alert('Please fix the highlighted errors before submitting.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        employee_id: form.employee_id.trim(),
        name: form.name.trim(),
        NIC: form.nic.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        role: form.role.trim(),
        date_of_birth: form.date_of_birth,
        basic_salary: Number(form.basic_salary),
        status: form.status,
        department: form.department.trim(),
        join_date: form.join_date,
        address: form.address.trim(),
        gender: form.gender || undefined,
      };

      console.log('📤 Sending payload to backend:', payload);

      const res = await fetch('http://localhost:8000/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log('📥 Backend response:', data);

      if (!res.ok) {
        // Handle validation errors from backend
        if (data && data.errors) {
          console.log('❌ Setting backend errors:', data.errors);
          setBackendErrors(data.errors);
          
          // Show user-friendly error message
          const errorCount = Object.keys(data.errors).length;
          alert(`Please fix ${errorCount} validation error${errorCount > 1 ? 's' : ''} and try again.`);
          return;
        }
        
        const message = data?.message || 'Failed to create employee';
        throw new Error(message);
      }

      // Success - data.success should be true and data.data contains employee
      if (data.success && data.data) {
        const created: Employee = {
          id: data.data._id,
          employeeId: data.data.employee_id,
          name: data.data.name,
          nic: data.data.NIC,
          role: data.data.role,
          department: data.data.department,
          status: data.data.status,
          joinDate: data.data.join_date ? new Date(data.data.join_date).toISOString().slice(0, 10) : '',
          dateOfBirth: data.data.date_of_birth ? new Date(data.data.date_of_birth).toISOString().slice(0, 10) : '',
          phone: data.data.phone,
          email: data.data.email,
          address: data.data.address || '',
          salary: Number(data.data.basic_salary),
          bankAccount: '',
          epfEligible: false,
          etfEligible: false,
          attendanceRate: 0,
          gender: data.data.gender || '',
        };

        console.log('✅ Successfully created employee:', created);

        // Clear form and notify success
        setForm(initialState);
        setBackendErrors({});
        setTouched({} as Record<keyof FormState, boolean>);
        
        onCreate(created);
        alert('Employee created successfully!');
        onClose();
      } else {
        throw new Error('Unexpected response format from server');
      }
    } catch (err: any) {
      console.error('💥 Error creating employee:', err);
      let errorMessage = 'Unexpected error while creating employee';
      
      if (err?.message?.includes('Failed to fetch') || err?.name === 'TypeError') {
        errorMessage = 'Unable to connect to the server. Please check if the backend is running on port 8000.';
      } else if (err?.message) {
        errorMessage = err.message;
      }
      
      alert(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Add Employee</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
              <input
                className={`w-full px-3 py-2 border rounded-lg ${(touched.employee_id && errors.employee_id) || backendErrors.employee_id ? 'border-red-500' : 'border-gray-300'}`}
                value={form.employee_id}
                onChange={(e) => {
                  setField('employee_id', e.target.value.toUpperCase());
                  setTouched(prev => ({ ...prev, employee_id: true }));
                }}
                onBlur={() => setTouched(prev => ({ ...prev, employee_id: true }))}
                placeholder="e.g., EMP0001"
                maxLength={7}
              />
              {touched.employee_id && errors.employee_id && <p className="text-xs text-red-600 mt-1">{errors.employee_id}</p>}
              {backendErrors.employee_id && <p className="text-xs text-red-600 mt-1">{backendErrors.employee_id}</p>}
              <p className="text-xs text-gray-500 mt-1">Format: EMP followed by exactly 4 digits</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
              <input
                className={`w-full px-3 py-2 border rounded-lg ${touched.name && errors.name ? 'border-red-500' : 'border-gray-300'}`}
                value={form.name}
                onChange={(e) => {
                  // Only allow letters and spaces
                  const value = e.target.value.replace(/[^A-Za-z ]/g, '');
                  setField('name', value);
                  setTouched(prev => ({ ...prev, name: true }));
                }}
                onBlur={() => setTouched(prev => ({ ...prev, name: true }))}
                placeholder="e.g., John Doe"
                maxLength={50}
              />
              {touched.name && errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
              <p className="text-xs text-gray-500 mt-1">Only letters and spaces (3-50 characters)</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">NIC</label>
              <input
                className={`w-full px-3 py-2 border rounded-lg ${(touched.nic && errors.nic) || backendErrors.NIC ? 'border-red-500' : 'border-gray-300'}`}
                value={form.nic}
                onChange={(e) => {
                  // Allow only digits and V/v, max 10 characters
                  const value = e.target.value.replace(/[^0-9Vv]/g, '').toUpperCase();
                  setField('nic', value);
                  setTouched(prev => ({ ...prev, nic: true }));
                }}
                onBlur={() => setTouched(prev => ({ ...prev, nic: true }))}
                placeholder="e.g., 123456789V"
                maxLength={10}
              />
              {touched.nic && errors.nic && <p className="text-xs text-red-600 mt-1">{errors.nic}</p>}
              {backendErrors.NIC && <p className="text-xs text-red-600 mt-1">{backendErrors.NIC}</p>}
              <p className="text-xs text-gray-500 mt-1">Format: 9 digits followed by V</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                className={`w-full px-3 py-2 border rounded-lg ${(touched.email && errors.email) || backendErrors.email ? 'border-red-500' : 'border-gray-300'}`}
                value={form.email}
                onChange={(e) => setField('email', e.target.value)}
                onBlur={() => setTouched(prev => ({ ...prev, email: true }))}
                placeholder="name@example.com"
              />
              {touched.email && errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
              {backendErrors.email && <p className="text-xs text-red-600 mt-1">{backendErrors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                className={`w-full px-3 py-2 border rounded-lg ${touched.phone && errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                value={form.phone}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  setField('phone', value);
                  setTouched(prev => ({ ...prev, phone: true }));
                }}
                onBlur={() => setTouched(prev => ({ ...prev, phone: true }))}
                placeholder="0771234567"
                maxLength={10}
              />
              {touched.phone && errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
              <p className="text-xs text-gray-500 mt-1">Enter exactly 10 digits (0-9 only)</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <input
                className={`w-full px-3 py-2 border rounded-lg ${touched.role && errors.role ? 'border-red-500' : 'border-gray-300'}`}
                value={form.role}
                onChange={(e) => setField('role', e.target.value)}
                onBlur={() => setTouched(prev => ({ ...prev, role: true }))}
                placeholder="e.g., HR Specialist"
              />
              {touched.role && errors.role && <p className="text-xs text-red-600 mt-1">{errors.role}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
              <input
                type="date"
                className={`w-full px-3 py-2 border rounded-lg ${touched.date_of_birth && errors.date_of_birth ? 'border-red-500' : 'border-gray-300'}`}
                value={form.date_of_birth}
                onChange={(e) => setField('date_of_birth', e.target.value)}
                onBlur={() => setTouched(prev => ({ ...prev, date_of_birth: true }))}
              />
              {touched.date_of_birth && errors.date_of_birth && <p className="text-xs text-red-600 mt-1">{errors.date_of_birth}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Base Salary</label>
              <input
                type="number"
                className={`w-full px-3 py-2 border rounded-lg ${touched.basic_salary && errors.basic_salary ? 'border-red-500' : 'border-gray-300'}`}
                value={form.basic_salary}
                onChange={(e) => setField('basic_salary', e.target.value)}
                onBlur={() => setTouched(prev => ({ ...prev, basic_salary: true }))}
                placeholder="e.g., 50000"
                min={0}
                step="0.01"
              />
              {touched.basic_salary && errors.basic_salary && <p className="text-xs text-red-600 mt-1">{errors.basic_salary}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                className={`w-full px-3 py-2 border rounded-lg ${touched.status && errors.status ? 'border-red-500' : 'border-gray-300'}`}
                value={form.status}
                onChange={(e) => setField('status', e.target.value)}
                onBlur={() => setTouched(prev => ({ ...prev, status: true }))}
              >
                <option value="">Select status</option>
                {statusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              {touched.status && errors.status && <p className="text-xs text-red-600 mt-1">{errors.status}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <select
                className={`w-full px-3 py-2 border rounded-lg ${touched.department && errors.department ? 'border-red-500' : 'border-gray-300'}`}
                value={form.department}
                onChange={(e) => setField('department', e.target.value)}
                onBlur={() => setTouched(prev => ({ ...prev, department: true }))}
              >
                <option value="">Select a department</option>
                {departments.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              {touched.department && errors.department && <p className="text-xs text-red-600 mt-1">{errors.department}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Join Date</label>
              <input
                type="date"
                className={`w-full px-3 py-2 border rounded-lg ${touched.join_date && errors.join_date ? 'border-red-500' : 'border-gray-300'}`}
                value={form.join_date}
                onChange={(e) => setField('join_date', e.target.value)}
                onBlur={() => setTouched(prev => ({ ...prev, join_date: true }))}
              />
              {touched.join_date && errors.join_date && <p className="text-xs text-red-600 mt-1">{errors.join_date}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select
                className="w-full px-3 py-2 border rounded-lg border-gray-300"
                value={form.gender}
                onChange={(e) => setField('gender', e.target.value)}
              >
                <option value="">Prefer not to say</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea
                className="w-full px-3 py-2 border rounded-lg border-gray-300"
                rows={3}
                value={form.address}
                onChange={(e) => setField('address', e.target.value)}
                placeholder="Optional"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-60" disabled={submitting}>Create</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployeeModal;


