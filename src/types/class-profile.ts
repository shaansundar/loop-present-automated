export interface TermsResponse {
    terms: {
        id: number;
        name: string;
        created_at: string;
        updated_at: string;
    }[]
}

export interface ProgramInfoResponse {
    programs: {
        id: number;
        name: string;
        created_at: string;
        updated_at: string;
    }[],
}

export interface SubjectInfoRequest {
    term_id: string;
}

export interface SubjectInfoResponse {
    subjects: {
        id: number;
        name: string;
        term_id: number;
        created_at: string;
        updated_at: string;
    }[]
}

export interface SectionInfoRequest {
    program_id: string;
    term_id: string;
    subject_id: string;
}

export interface SectionInfoResponse {
    sections: {
        id: number;
        name: string;
        program_id: number;
        term_id: number;
        subject_id: number;
        created_at: string;
        updated_at: string;
    }[]
}
