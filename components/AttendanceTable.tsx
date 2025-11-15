
import React from 'react';
import { AttendanceEntry } from '../types';
import AttendanceRow from './AttendanceRow';

interface AttendanceTableProps {
  entries: AttendanceEntry[];
  onEdit: (entry: AttendanceEntry) => void;
  onDelete: (id: string) => void;
}

const AttendanceTable: React.FC<AttendanceTableProps> = ({ entries, onEdit, onDelete }) => {
  if (entries.length === 0) {
    return (
      <div className="text-center py-16 px-6">
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">No Attendance Records Found</h3>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Click the '+' button to add the first entry.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Date
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Name
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Notes
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {entries.map((entry) => (
            <AttendanceRow key={entry.id} entry={entry} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceTable;
