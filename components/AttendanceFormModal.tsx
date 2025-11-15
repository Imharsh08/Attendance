
import React, { useState, useEffect } from 'react';
import { AttendanceEntry, NewAttendanceEntry, AttendanceStatus } from '../types';
import Modal from './Modal';
import Loader from './Loader';

interface AttendanceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (entry: AttendanceEntry | NewAttendanceEntry) => void;
  initialData?: AttendanceEntry | null;
  isLoading: boolean;
}

const AttendanceFormModal: React.FC<AttendanceFormModalProps> = ({ isOpen, onClose, onSubmit, initialData, isLoading }) => {
  const [name, setName] = useState('');
  const [status, setStatus] = useState<AttendanceStatus>(AttendanceStatus.PRESENT);
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<{name?: string}>({});

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setStatus(initialData.status);
      setNotes(initialData.notes);
    } else {
      // Reset form for new entry
      setName('');
      setStatus(AttendanceStatus.PRESENT);
      setNotes('');
    }
    setErrors({});
  }, [initialData, isOpen]);

  const validate = () => {
    const newErrors: {name?: string} = {};
    if (!name.trim()) {
        newErrors.name = "Name is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    const entryData = {
      name,
      status,
      notes,
    };

    if (initialData) {
      onSubmit({ ...initialData, ...entryData });
    } else {
      onSubmit(entryData);
    }
  };

  const isEditing = !!initialData;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Edit Attendance Entry' : 'Add New Attendance Entry'}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Full Name
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
             {errors.name && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.name}</p>}
          </div>
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as AttendanceStatus)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            {Object.values(AttendanceStatus).map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Notes
          </label>
          <div className="mt-1">
            <textarea
              id="notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 dark:disabled:bg-blue-800 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader /> : (isEditing ? 'Save Changes' : 'Add Entry')}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AttendanceFormModal;
