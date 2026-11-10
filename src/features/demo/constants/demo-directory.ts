export type DirectoryStaff = {
  name: string
  role: 'admin' | 'hod' | 'teacher'
  department: string | null
  designation: string
  email: string
  courses: number | null
}

export type DirectoryStudent = {
  name: string
  registrationNumber: string
  program: string
  batch: string
  email: string
  courses: number
}

/** Password for every account in the university directory. */
export const DIRECTORY_PASSWORD = 'myteka500'

export const UNIVERSITY_SUMMARY = [
  { label: 'Departments', value: 6 },
  { label: 'Programs', value: 10 },
  { label: 'Batches', value: 14 },
  { label: 'Students', value: 162 },
  { label: 'Faculty and staff', value: 27 },
  { label: 'Courses this term', value: 70 },
]

export const DIRECTORY_STAFF: DirectoryStaff[] = [
  {
    name: 'Registrar Office',
    role: 'admin',
    department: null,
    designation: 'Registrar',
    email: 'registrar@uni-portal.example',
    courses: null,
  },
  {
    name: 'Dr. Farhan Qadir',
    role: 'hod',
    department: 'Artificial Intelligence',
    designation: 'Professor',
    email: 'farhan.qadir@uni-portal.example',
    courses: null,
  },
  {
    name: 'Dr. Imran Zafar',
    role: 'hod',
    department: 'Electrical Engineering',
    designation: 'Professor',
    email: 'imran.zafar@uni-portal.example',
    courses: null,
  },
  {
    name: 'Dr. Shaista Noreen',
    role: 'hod',
    department: 'Management Sciences',
    designation: 'Professor',
    email: 'shaista.noreen@uni-portal.example',
    courses: null,
  },
  {
    name: 'Dr. Rashid Minhas',
    role: 'hod',
    department: 'Mathematics',
    designation: 'Professor',
    email: 'rashid.minhas@uni-portal.example',
    courses: null,
  },
  {
    name: 'Dr. Khalid Pervez',
    role: 'hod',
    department: 'Physics',
    designation: 'Professor',
    email: 'khalid.pervez@uni-portal.example',
    courses: null,
  },
  {
    name: 'Usman Ghani',
    role: 'teacher',
    department: 'Software Engineering',
    designation: 'Assistant Professor',
    email: 'usman.ghani@uni-portal.example',
    courses: 5,
  },
  {
    name: 'Sadia Parveen',
    role: 'teacher',
    department: 'Software Engineering',
    designation: 'Lecturer',
    email: 'sadia.parveen@uni-portal.example',
    courses: 3,
  },
  {
    name: 'Hamid Raza',
    role: 'teacher',
    department: 'Software Engineering',
    designation: 'Lecturer',
    email: 'hamid.raza@uni-portal.example',
    courses: 4,
  },
  {
    name: 'Bilal Haider',
    role: 'teacher',
    department: 'Artificial Intelligence',
    designation: 'Assistant Professor',
    email: 'bilal.haider@uni-portal.example',
    courses: 5,
  },
  {
    name: 'Mehwish Anwar',
    role: 'teacher',
    department: 'Artificial Intelligence',
    designation: 'Lecturer',
    email: 'mehwish.anwar@uni-portal.example',
    courses: 3,
  },
  {
    name: 'Shahid Latif',
    role: 'teacher',
    department: 'Artificial Intelligence',
    designation: 'Lecturer',
    email: 'shahid.latif@uni-portal.example',
    courses: 4,
  },
  {
    name: 'Engr. Rubina Kausar',
    role: 'teacher',
    department: 'Electrical Engineering',
    designation: 'Assistant Professor',
    email: 'rubina.kausar@uni-portal.example',
    courses: 4,
  },
  {
    name: 'Engr. Waqar Younas',
    role: 'teacher',
    department: 'Electrical Engineering',
    designation: 'Lecturer',
    email: 'waqar.younas@uni-portal.example',
    courses: 3,
  },
  {
    name: 'Dr. Salman Abbasi',
    role: 'teacher',
    department: 'Electrical Engineering',
    designation: 'Associate Professor',
    email: 'salman.abbasi@uni-portal.example',
    courses: 3,
  },
  {
    name: 'Kashif Mahmood',
    role: 'teacher',
    department: 'Management Sciences',
    designation: 'Assistant Professor',
    email: 'kashif.mahmood@uni-portal.example',
    courses: 4,
  },
  {
    name: 'Rabia Aslam',
    role: 'teacher',
    department: 'Management Sciences',
    designation: 'Lecturer',
    email: 'rabia.aslam@uni-portal.example',
    courses: 4,
  },
  {
    name: 'Dr. Adnan Baig',
    role: 'teacher',
    department: 'Management Sciences',
    designation: 'Associate Professor',
    email: 'adnan.baig@uni-portal.example',
    courses: 4,
  },
  {
    name: 'Saima Rauf',
    role: 'teacher',
    department: 'Management Sciences',
    designation: 'Lecturer',
    email: 'saima.rauf@uni-portal.example',
    courses: 4,
  },
  {
    name: 'Naveed Akhtar',
    role: 'teacher',
    department: 'Management Sciences',
    designation: 'Lecturer',
    email: 'naveed.akhtar@uni-portal.example',
    courses: 4,
  },
  {
    name: 'Dr. Zubair Anjum',
    role: 'teacher',
    department: 'Mathematics',
    designation: 'Associate Professor',
    email: 'zubair.anjum@uni-portal.example',
    courses: 2,
  },
  {
    name: 'Hina Shahid',
    role: 'teacher',
    department: 'Mathematics',
    designation: 'Lecturer',
    email: 'hina.shahid@uni-portal.example',
    courses: 3,
  },
  {
    name: 'Dr. Samina Gul',
    role: 'teacher',
    department: 'Physics',
    designation: 'Assistant Professor',
    email: 'samina.gul@uni-portal.example',
    courses: 2,
  },
  {
    name: 'Irfan Bukhari',
    role: 'teacher',
    department: 'Physics',
    designation: 'Lecturer',
    email: 'irfan.bukhari@uni-portal.example',
    courses: 3,
  },
]

export const DIRECTORY_STUDENTS: DirectoryStudent[] = [
  {
    name: 'Bilal Siddiqui',
    registrationNumber: '23-BSSE-002',
    program: 'BS Software Engineering',
    batch: 'Batch 2023',
    email: 'bilal.siddiqui@student.uni-portal.example',
    courses: 5,
  },
  {
    name: 'Kamran Zafar',
    registrationNumber: '24-BBA-002',
    program: 'Bachelor of Business Administration',
    batch: 'Batch 2024',
    email: 'kamran.zafar@student.uni-portal.example',
    courses: 5,
  },
  {
    name: 'Saad Chaudhry',
    registrationNumber: '24-BSAI-002',
    program: 'BS Artificial Intelligence',
    batch: 'Batch 2024',
    email: 'saad.chaudhry@student.uni-portal.example',
    courses: 5,
  },
  {
    name: 'Nimra Latif',
    registrationNumber: '24-BSDS-001',
    program: 'BS Data Science',
    batch: 'Batch 2024',
    email: 'nimra.latif@student.uni-portal.example',
    courses: 5,
  },
  {
    name: 'Maria Zafar',
    registrationNumber: '24-BSEE-001',
    program: 'BS Electrical Engineering',
    batch: 'Batch 2024',
    email: 'maria.zafar@student.uni-portal.example',
    courses: 5,
  },
  {
    name: 'Kiran Butt',
    registrationNumber: '24-BSMATH-001',
    program: 'BS Mathematics',
    batch: 'Batch 2024',
    email: 'kiran.butt@student.uni-portal.example',
    courses: 5,
  },
  {
    name: 'Zainab Khan',
    registrationNumber: '25-BSAF-001',
    program: 'BS Accounting and Finance',
    batch: 'Batch 2025',
    email: 'zainab.khan@student.uni-portal.example',
    courses: 5,
  },
  {
    name: 'Minal Mahmood',
    registrationNumber: '25-BSPHY-001',
    program: 'BS Physics',
    batch: 'Batch 2025',
    email: 'minal.mahmood@student.uni-portal.example',
    courses: 5,
  },
  {
    name: 'Sana Rana',
    registrationNumber: '25-MBA-001',
    program: 'Master of Business Administration',
    batch: 'Batch 2025',
    email: 'sana.rana@student.uni-portal.example',
    courses: 5,
  },
  {
    name: 'Anum Gill',
    registrationNumber: '25-MSSE-001',
    program: 'MS Software Engineering',
    batch: 'Batch 2025',
    email: 'anum.gill@student.uni-portal.example',
    courses: 5,
  },
]
