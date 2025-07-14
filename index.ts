import { getAttendance } from "@/api/attendance/get/route";
import { saveAttendance } from "@/api/attendance/save/route";
import { login } from "@/api/login/route";
import { getSections } from "@/api/sections/route";
import { getSubjects } from "@/api/subjects/route";
import { PROF_LIST } from "@/constants/prof-list";
import { STUDENTS_LIST } from "@/constants/students-list";
import type { SectionInfoResponse, SubjectInfoResponse } from "@/types/class-profile";

const REQUEST_TERM_ID = "4";
const REQUEST_PROGRAM_ID = "1";

const handleGetSubjects = async (token: string, term_id: string) => {
    const subjectsResponse = await getSubjects({
        term_id: term_id,
    }, token);
    return subjectsResponse as SubjectInfoResponse;
}

const handleGetSections = async (token: string, subject_id: string,) => {
    const sectionsResponse = await getSections({
        program_id: REQUEST_PROGRAM_ID,
        term_id: REQUEST_TERM_ID,
        subject_id: subject_id,
    }, token);
    return sectionsResponse as SectionInfoResponse;
}

const handleRandomize = (attendance: {
    attendance_status: string,
    readableRollNo: string,
    student_id: string,
    id: string,
    pageid: string,
    section_id: string,
    subject_id: string,
    token: string,
}[]) => {
    const selectedStudents: {
        attendance_status: string,
        student_id: string,
        id: string,
        pageid: string,
        section_id: string,
        readableRollNo: string,
        subject_id: string,
        token: string,
    }[] = [];

    // Check if all students from studentList have status 1. if even a single student has status 0, then the function continues, else it breaks
    const allStudentsStatus = attendance.filter(item => STUDENTS_LIST.includes(item.readableRollNo)).every(item => item.attendance_status === "1")
    if (allStudentsStatus) return selectedStudents;

    attendance.forEach(item => {
        if (item.attendance_status === "0") {
            {
                if (STUDENTS_LIST.includes(item.readableRollNo)) {
                    selectedStudents.push(item);
                } else {
                    if (Math.random() < 0.8) {
                        selectedStudents.push(item);
                    }
                }
            }
        }
    })
    return selectedStudents;
}

const handleGetAttendance = async (token: string, section_id: string, subject_id: string) => {

    const attendanceResponse = await getAttendance({
        section_id: section_id,
        term_id: REQUEST_TERM_ID,
        program_id: REQUEST_PROGRAM_ID,
        subject_id: subject_id,
    }, token);
    if (!attendanceResponse) return null;
    const mappedStudents = attendanceResponse.attendance.map(item => {
        return {
            attendance_status: item.status.toString(),
            student_id: item.student_id.toString(),
            readableRollNo: item.student.rollno.toString(),
            id: item.id.toString(),
            pageid: item.pageid.toString(),
            section_id: section_id,
            subject_id: subject_id,
            token: token,
        }
    })
    return mappedStudents;
}

const handleSaveAttendance = async (attendance: {
    attendance_status: string,
    student_id: string,
    id: string,
    pageid: string,
    section_id: string,
    subject_id: string,
}, token: string) => {
    const saveAttendanceResponse = await saveAttendance({
        id: attendance.id,
        pageid: attendance.pageid,
        program_id: REQUEST_PROGRAM_ID,
        term_id: REQUEST_TERM_ID,
        subject_id: attendance.subject_id,
        section_id: attendance.section_id,
        student_id: attendance.student_id,
    }, token)
    return { RollNo: saveAttendanceResponse.attendance.student_id, status: saveAttendanceResponse.attendance.status };
}

const main = async () => {

    const presenceStatus = new Map<string, boolean>();
    const dateWithHour = new Date().toLocaleString('en-US', { day: '2-digit', month: '2-digit', hour: '2-digit' });

    const profList = PROF_LIST.map(item => {
        return {
            email: item.email,
            password: item.password,
            name: item.name,
        }
    })

    const loginAll = await Promise.all(profList.map(async (item) => {
        const loginResponse = await login({
            email: item.email,
            password: item.password,
        });
        if (!loginResponse) return null;
        const subjects = await handleGetSubjects(loginResponse.token, REQUEST_TERM_ID);

        return { data: { subjects: subjects.subjects.map(item => item.id.toString()), token: loginResponse.token, prof: item.name } }
    }))

    console.log("INFO: Login Length:", loginAll.length);
    const subjectData = loginAll.map(item => item?.data).flat().map(item => item?.subjects.map(sub => ({ subject: sub, token: item?.token, prof: item?.prof }))).flat();
    console.log("INFO: SubjectData Length:", subjectData.length);

    const fetchSections = await Promise.all(subjectData.map(async (item) => {
        if (!item) return null;
        const sections = await handleGetSections(item.token, item.subject);
        return { sections: sections.sections.map(item => item.id.toString()), token: item.token, subject: item.subject, prof: item.prof }
    }))

    const sectionsData = fetchSections.map(item => item?.sections.map(sec => ({ sections: sec, token: item?.token, subject: item?.subject, prof: item?.prof }))).flat();

    console.log("INFO: SectionsData Length:", sectionsData.length);

    const fetchAttendance = await Promise.all(sectionsData.map(async (item) => {
        if (!item) return null;
        const attendance = await handleGetAttendance(item.token, item.sections, item.subject);
        return { token: item.token, prof: item.prof, subject: item.subject, section: item.sections, attendance: attendance }
    }))

    console.log("INFO: Fetch Attendance Length:", fetchAttendance.length);

    // const activeClasses = fetchAttendance.find(item => item?.attendance?.find(att => att.attendance_status === "1"))
    const activeClasses = []
    for (const item of fetchAttendance) {
        if (!item) return null;
        if (!item.attendance) return null;
        for (const attendance of item.attendance) {
            if (attendance.attendance_status === "1") {
                activeClasses.push(item)
                break;
            }
        }
    }

    console.log("INFO: Active Classes:", activeClasses.length);
    console.log("INFO: Active Classes:", activeClasses.map(item => item.prof + "," + item.subject + "," + item.section));

    const postedAttendance = []

    for (const item of activeClasses) {
        if (presenceStatus.get(item.subject + item.section + dateWithHour) || presenceStatus.get(item.subject + item.section + (parseFloat(dateWithHour) - 1).toString())) {
            console.log("INFO: Already Posted:", item.subject + item.section + dateWithHour);
            continue;
        } else {
            if (!item.attendance) return null;
            const chooseRandom = handleRandomize(item.attendance)

            console.log("INFO: Choose Random:", chooseRandom.length);
            console.log("INFO: Chosen From List:", chooseRandom.filter(item => STUDENTS_LIST.includes(item.readableRollNo)));

            for (const attendance of chooseRandom) {
                const saveAttendance = await handleSaveAttendance(attendance, item.token)
                postedAttendance.push({
                    subject: item.subject,
                    section: item.section,
                    attendance: attendance,
                    rollno: attendance.readableRollNo,
                    status: saveAttendance.status,
                })
            }
            presenceStatus.set(item.subject + item.section + dateWithHour, true);
        }
        console.log("SUCCESS: Attendance Posted:", postedAttendance);
    }

}

main();
setInterval(main, 5 * 60 * 1000);