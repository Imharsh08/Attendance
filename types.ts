
export enum AttendanceStatus {
  PRESENT = 'Present',
  ABSENT = 'Absent',
  LATE = 'Late',
  EXCUSED = 'Excused'
}

export interface AttendanceEntry {
  id: string;
  date: string;
  name: string;
  status: AttendanceStatus;
  notes: string;
}

export type NewAttendanceEntry = Omit<AttendanceEntry, 'id' | 'date'>;
