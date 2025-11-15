
import React from 'react';
import { AttendanceEntry, AttendanceStatus } from '../types';
import { EditIcon } from './icons/EditIcon';
import { DeleteIcon } from './icons/DeleteIcon';

interface AttendanceRowProps {
  entry: AttendanceEntry;
  onEdit: (entry: AttendanceEntry) => void;
  onDelete: (id: string) => void;
}

const statusColorMap: Record<AttendanceStatus, string> = {
  [AttendanceStatus.PRESENT]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  [AttendanceStatus.ABSENT]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  [AttendanceStatus.LATE]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  [AttendanceStatus.EXCUSED]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
};

const AttendanceRow: React.FC<AttendanceRowProps> = ({ entry, onEdit, onDelete }) => {
  const { id, date, name, status, notes } = entry;

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">{new Date(date).toLocaleDateString()}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{name}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColorMap[status]}`}>
          {status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300 max-w-xs truncate">{notes || '-'}</td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center justify-end space-x-4">
          <button onClick={() => onEdit(entry)} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-200" aria-label={`Edit entry for ${name}`}>
            <EditIcon />
          </button>
          <button onClick={() => onDelete(id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200" aria-label={`Delete entry for ${name}`}>
            <DeleteIcon />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default AttendanceRow;
