export interface Student {
    id: number;
    name: string;
    rollno: string;
    email: string;
    fingerprint: string;
    program_id: number;
    created_at: string;
    updated_at: string;
}

export interface Attendance {
    id: number;
    pageid: number;
    program_id: number;
    term_id: number;
    subject_id: number;
    section_id: number;
    student_id: number;
    status: number;
    created_at: string;
    updated_at: string;
    student: Student;
}

export interface AttendanceResponse {
    attendance: Attendance[];
};
