import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Edit2, Trash2, Save, X } from 'lucide-react';

interface AttendanceRecord {
  attendance_id?: string;
  _id?: string;
  employee_id: string;
  month: string;
  working_days: number;
  ot_hours: number;
}

interface Employee {
  employee_id: string;
  name: string;
  NIC: string;
  email: string;
  phone: string;
  role: string;
  date_of_birth: string;
  basic_salary: number;
  status: string;
  department: string;
  join_date: string;
  address: string;
  gender: string;
}

interface AttendanceFormData {
  employee_id: string;
  month: string;
  working_days: number;
  ot_hours: number;
}

const Attendance: React.FC = () => {
  // Note: Using employee dropdown instead of context employee
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [editingRecord, setEditingRecord] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<AttendanceFormData>();

  // Hardcoded employee data - replace with actual API call when merged to codebase
  const employees: Employee[] = [
    {
      employee_id: "EMP001",
      name: "John Doe",
      NIC: "199912345678",
      email: "john.doe@example.com",
      phone: "0771234567",
      role: "Sales Manager",
      date_of_birth: "1999-01-15T00:00:00.000+00:00",
      basic_salary: 75000,
      status: "Active",
      department: "SALES",
      join_date: "2023-09-16T00:00:00.000+00:00",
      address: "123 Main Street, Colombo",
      gender: "Male"
    },
    {
      employee_id: "EMP002",
      name: "Jane Smith",
      NIC: "199512345679",
      email: "jane.smith@example.com",
      phone: "0771234568",
      role: "Marketing Executive",
      date_of_birth: "1995-03-22T00:00:00.000+00:00",
      basic_salary: 65000,
      status: "Active",
      department: "MARKETING",
      join_date: "2023-10-01T00:00:00.000+00:00",
      address: "456 Park Avenue, Kandy",
      gender: "Female"
    },
    {
      employee_id: "EMP003",
      name: "Michael Johnson",
      NIC: "199812345680",
      email: "michael.johnson@example.com",
      phone: "0771234569",
      role: "IT Support",
      date_of_birth: "1998-07-10T00:00:00.000+00:00",
      basic_salary: 70000,
      status: "Active",
      department: "IT",
      join_date: "2023-08-15T00:00:00.000+00:00",
      address: "789 Tech Street, Galle",
      gender: "Male"
    },
    {
      employee_id: "EMP004",
      name: "Sarah Williams",
      NIC: "199612345681",
      email: "sarah.williams@example.com",
      phone: "0771234570",
      role: "HR Manager",
      date_of_birth: "1996-05-18T00:00:00.000+00:00",
      basic_salary: 80000,
      status: "Active",
      department: "HR",
      join_date: "2023-07-01T00:00:00.000+00:00",
      address: "321 HR Lane, Negombo",
      gender: "Female"
    },
    {
      employee_id: "EMP005",
      name: "David Brown",
      NIC: "199412345682",
      email: "david.brown@example.com",
      phone: "0771234571",
      role: "Finance Manager",
      date_of_birth: "1994-09-12T00:00:00.000+00:00",
      basic_salary: 85000,
      status: "Active",
      department: "FINANCE",
      join_date: "2023-06-15T00:00:00.000+00:00",
      address: "654 Finance Road, Kurunegala",
      gender: "Male"
    },
    {
      employee_id: "EMP006",
      name: "Lisa Garcia",
      NIC: "199712345683",
      email: "lisa.garcia@example.com",
      phone: "0771234572",
      role: "Customer Service Rep",
      date_of_birth: "1997-11-25T00:00:00.000+00:00",
      basic_salary: 55000,
      status: "Active",
      department: "CUSTOMER_SERVICE",
      join_date: "2023-11-01T00:00:00.000+00:00",
      address: "987 Service Street, Anuradhapura",
      gender: "Female"
    },
    {
      employee_id: "EMP007",
      name: "Robert Wilson",
      NIC: "199312345684",
      email: "robert.wilson@example.com",
      phone: "0771234573",
      role: "Operations Manager",
      date_of_birth: "1993-04-08T00:00:00.000+00:00",
      basic_salary: 90000,
      status: "Active",
      department: "OPERATIONS",
      join_date: "2023-05-20T00:00:00.000+00:00",
      address: "147 Operations Avenue, Ratnapura",
      gender: "Male"
    },
    {
      employee_id: "EMP008",
      name: "Emily Davis",
      NIC: "199812345685",
      email: "emily.davis@example.com",
      phone: "0771234574",
      role: "Software Developer",
      date_of_birth: "1998-12-03T00:00:00.000+00:00",
      basic_salary: 95000,
      status: "Active",
      department: "IT",
      join_date: "2023-04-10T00:00:00.000+00:00",
      address: "258 Developer Drive, Jaffna",
      gender: "Female"
    },
    {
      employee_id: "EMP009",
      name: "James Miller",
      NIC: "199512345686",
      email: "james.miller@example.com",
      phone: "0771234575",
      role: "Warehouse Supervisor",
      date_of_birth: "1995-08-14T00:00:00.000+00:00",
      basic_salary: 60000,
      status: "Active",
      department: "WAREHOUSE",
      join_date: "2023-03-01T00:00:00.000+00:00",
      address: "369 Warehouse Way, Matara",
      gender: "Male"
    },
    {
      employee_id: "EMP010",
      name: "Maria Rodriguez",
      NIC: "199612345687",
      email: "maria.rodriguez@example.com",
      phone: "0771234576",
      role: "Quality Assurance",
      date_of_birth: "1996-10-30T00:00:00.000+00:00",
      basic_salary: 70000,
      status: "Active",
      department: "QUALITY",
      join_date: "2023-02-15T00:00:00.000+00:00",
      address: "741 Quality Quarter, Polonnaruwa",
      gender: "Female"
    }
  ];

  // Get current year and current month
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth(); // 0-based index
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Filter months to show only current year's months (from current month onwards)
  const availableMonths = monthNames.slice(currentMonth).map((month, index) => {
    const monthNumber = currentMonth + index + 1; // Convert to 1-based month number
    const formattedMonth = `${currentYear}-${monthNumber.toString().padStart(2, '0')}`;
    return {
      name: month,
      value: formattedMonth,
      displayName: `${month} ${currentYear}`
    };
  });

  useEffect(() => {
    if (selectedEmployeeId) {
      fetchAttendanceRecords(selectedEmployeeId);
    } else {
      setAttendanceRecords([]);
    }
  }, [selectedEmployeeId]);

  const handleEmployeeChange = (employeeId: string) => {
    setSelectedEmployeeId(employeeId);
    setEditingRecord(null); // Clear any editing state when changing employee
    reset(); // Reset form when changing employee
  };

  // Helper function to convert formatted month (YYYY-MM) to display name
  const formatMonthForDisplay = (monthValue: string) => {
    if (!monthValue) return '';
    const [year, monthNum] = monthValue.split('-');
    const monthIndex = parseInt(monthNum) - 1;
    return `${monthNames[monthIndex]} ${year}`;
  };

  // Get available months (excluding those that already have records for the selected employee)
  const getAvailableMonths = () => {
    if (!selectedEmployeeId) return availableMonths;
    
    // If editing, show all months (including the current one being edited)
    if (editingRecord) return availableMonths;
    
    // Get months that already have records for this employee
    const existingMonths = attendanceRecords.map(record => record.month);
    
    // Filter out months that already have records
    return availableMonths.filter(month => !existingMonths.includes(month.value));
  };

  const fetchAttendanceRecords = async (employeeId?: string) => {
    const targetEmployeeId = employeeId || selectedEmployeeId;
    if (!targetEmployeeId) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/attendance?employee_id=${targetEmployeeId}`);
      if (response.ok) {
        const result = await response.json();
        setAttendanceRecords(result.data || result); // Handle both wrapped and unwrapped responses
      } else {
        // Mock data for development - showing current year months
        const currentMonthFormatted = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}`;
        setAttendanceRecords([
          {
            _id: 'ATT001',
            employee_id: targetEmployeeId,
            month: currentMonthFormatted,
            working_days: 22,
            ot_hours: 8
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching attendance records:', error);
    }
  };

  const onSubmit = async (data: AttendanceFormData) => {
    if (!data.employee_id) {
      alert('Please select an employee');
      return;
    }
    
    setLoading(true);
    try {
      const payload = {
        employee_id: data.employee_id,
        month: data.month,
        working_days: data.working_days,
        ot_hours: data.ot_hours
      };

      const response = await fetch('http://localhost:5000/api/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const newRecord = await response.json();
        setAttendanceRecords([...attendanceRecords, newRecord]);
        reset();
        alert('Attendance record added successfully!');
      } else if (response.status === 409) {
        alert('An attendance record already exists for this employee and month. Please select a different month.');
        return;
      } else {
        throw new Error('Failed to add attendance record');
      }
    } catch (error) {
      console.error('Error adding attendance:', error);
      // Mock success for development
      const newRecord: AttendanceRecord = {
        _id: `ATT${Date.now()}`,
        employee_id: data.employee_id,
        month: data.month,
        working_days: data.working_days,
        ot_hours: data.ot_hours
      };
      setAttendanceRecords([...attendanceRecords, newRecord]);
      reset();
      alert('Attendance record added successfully!');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record: AttendanceRecord) => {
    const recordId = record.attendance_id || record._id;
    if (!recordId) {
      console.error('No valid ID found for record:', record);
      return;
    }
    
    console.log('Editing record with ID:', recordId);
    setEditingRecord(recordId);
    setSelectedEmployeeId(record.employee_id);
    setValue('employee_id', record.employee_id);
    setValue('month', record.month);
    setValue('working_days', record.working_days);
    setValue('ot_hours', record.ot_hours);
  };

  const handleUpdate = async (data: AttendanceFormData) => {
    if (!editingRecord) return;
    
    console.log('Updating record with ID:', editingRecord);
    console.log('Update data:', data);
    try {
      const response = await fetch(`http://localhost:5000/api/attendance/${editingRecord}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          working_days: data.working_days,
          ot_hours: data.ot_hours,
          employee_id: data.employee_id,
          month: data.month
        }),
      });

      if (response.ok) {
        const updatedRecord = await response.json();
        setAttendanceRecords(attendanceRecords.map(record => {
          const recordId = record.attendance_id || record._id;
          return recordId === editingRecord ? updatedRecord : record;
        }));
        setEditingRecord(null);
        reset();
        alert('Attendance record updated successfully!');
      } else {
        throw new Error('Failed to update attendance record');
      }
    } catch (error) {
      console.error('Error updating attendance:', error);
      // Mock update for development
      setAttendanceRecords(attendanceRecords.map(record => {
        const recordId = record.attendance_id || record._id;
        return recordId === editingRecord 
          ? { ...record, ...data }
          : record;
      }));
      setEditingRecord(null);
      reset();
      alert('Attendance record updated successfully!');
    }
  };

  const handleDelete = async (attendanceId: string) => {
    if (!confirm('Are you sure you want to delete this attendance record?')) return;
    
    console.log('Deleting record with ID:', attendanceId);
    try {
      const response = await fetch(`http://localhost:5000/api/attendance/${attendanceId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setAttendanceRecords(attendanceRecords.filter(record => {
          const recordId = record.attendance_id || record._id;
          return recordId !== attendanceId;
        }));
        alert('Attendance record deleted successfully!');
      } else {
        throw new Error('Failed to delete attendance record');
      }
    } catch (error) {
      console.error('Error deleting attendance:', error);
      // Mock delete for development
      setAttendanceRecords(attendanceRecords.filter(record => {
        const recordId = record.attendance_id || record._id;
        return recordId !== attendanceId;
      }));
      alert('Attendance record deleted successfully!');
    }
  };

  const cancelEdit = () => {
    setEditingRecord(null);
    setSelectedEmployeeId('');
    reset();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Mark Attendance</h1>

      {/* Attendance Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {editingRecord ? 'Update Attendance Record' : 'Add Attendance Record'}
        </h3>
        
        <form onSubmit={handleSubmit(editingRecord ? handleUpdate : onSubmit)} className="space-y-4">
          {/* Employee Selection */}
          <div className="mb-6">
            <label htmlFor="employee_id" className="block text-sm font-medium text-gray-700 mb-1">
              Select Employee *
            </label>
            <select
              {...register('employee_id', { required: 'Employee selection is required' })}
              value={selectedEmployeeId}
              onChange={(e) => handleEmployeeChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={!!editingRecord} // Disable when editing
            >
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp.employee_id} value={emp.employee_id}>
                  {emp.employee_id} - {emp.name} ({emp.role})
                </option>
              ))}
            </select>
            {errors.employee_id && (
              <p className="text-red-500 text-sm mt-1">{errors.employee_id.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="month" className="block text-sm font-medium text-gray-700 mb-1">
                Month ({currentYear}) *
              </label>
              <select
                {...register('month', { required: 'Month is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={getAvailableMonths().length === 0}
              >
                <option value="">
                  {getAvailableMonths().length === 0 
                    ? 'All months have records' 
                    : 'Select Month'
                  }
                </option>
                {getAvailableMonths().map((month) => (
                  <option key={month.name} value={month.value}>
                    {month.displayName}
                  </option>
                ))}
              </select>
              {errors.month && (
                <p className="text-red-500 text-sm mt-1">{errors.month.message}</p>
              )}
              {selectedEmployeeId && !editingRecord && getAvailableMonths().length === 0 && (
                <p className="text-blue-600 text-sm mt-1">
                  All available months already have attendance records for this employee.
                </p>
              )}
              {selectedEmployeeId && !editingRecord && getAvailableMonths().length < availableMonths.length && (
                <p className="text-gray-600 text-sm mt-1">
                  Only months without existing records are shown.
                </p>
              )}
            </div>

            <div>
              <label htmlFor="working_days" className="block text-sm font-medium text-gray-700 mb-1">
                Working Days *
              </label>
              <input
                type="number"
                {...register('working_days', { 
                  required: 'Working days is required',
                  min: { value: 1, message: 'Working days must be positive' },
                  max: { value: 31, message: 'Working days cannot exceed 31' }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 22"
              />
              {errors.working_days && (
                <p className="text-red-500 text-sm mt-1">{errors.working_days.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="ot_hours" className="block text-sm font-medium text-gray-700 mb-1">
                OT Hours *
              </label>
              <input
                type="number"
                step="0.5"
                {...register('ot_hours', { 
                  required: 'OT hours is required',
                  min: { value: 0, message: 'OT hours cannot be negative' }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 8"
              />
              {errors.ot_hours && (
                <p className="text-red-500 text-sm mt-1">{errors.ot_hours.message}</p>
              )}
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 disabled:opacity-50 transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>{loading ? 'Saving...' : editingRecord ? 'Update' : 'Submit'}</span>
            </button>
            
            {editingRecord && (
              <button
                type="button"
                onClick={cancelEdit}
                className="flex items-center space-x-2 px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                <X className="h-4 w-4" />
                <span>Cancel</span>
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Attendance Records Table - Only show when employee is selected */}
      {selectedEmployeeId && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Attendance Records for {employees.find(emp => emp.employee_id === selectedEmployeeId)?.name || 'Selected Employee'}
          </h3>
          
          {attendanceRecords.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No attendance records found for this employee</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Month</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Working Days</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">OT Hours</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceRecords.map((record) => (
                    <tr key={record.attendance_id || record._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-800">{formatMonthForDisplay(record.month)}</td>
                      <td className="py-3 px-4 text-gray-800">{record.working_days}</td>
                      <td className="py-3 px-4 text-gray-800">{record.ot_hours}</td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(record)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              const recordId = record.attendance_id || record._id;
                              if (recordId) handleDelete(recordId);
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Attendance;