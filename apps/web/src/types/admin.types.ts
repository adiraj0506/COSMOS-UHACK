// ─────────────────────────────────────────────────────────────────────────────
// src/types/admin.types.ts
// Shared interfaces + rich mock data for Learners, Colleges, Recruiters
// ─────────────────────────────────────────────────────────────────────────────

export interface Learner {
  id: string
  name: string
  email: string
  college: string
  domain: string
  readiness: number      // 0-100
  resumeScore: number    // 0-100
  status: 'active' | 'inactive' | 'placed'
  joinedAt: string
  skills: string[]
  assessmentsDone: number
}

export interface College {
  id: string
  name: string
  city: string
  code: string
  adminEmail: string
  totalStudents: number
  activeStudents: number
  placementRate: number  // 0-100
  avgReadiness: number   // 0-100
  status: 'active' | 'pending' | 'suspended'
  onboardedAt: string
  topDomains: string[]
}

export interface Recruiter {
  id: string
  name: string
  email: string
  company: string
  industry: string
  activeJobs: number
  totalHires: number
  avgPackageLPA: number
  status: 'active' | 'inactive' | 'verified'
  joinedAt: string
  hiringDomains: string[]
}

// ─── Mock Learners ────────────────────────────────────────────────────────────
export const MOCK_LEARNERS: Learner[] = [
  { id: 'l1', name: 'Priya Nair',       email: 'priya@vit.ac.in',        college: 'VIT Vellore',    domain: 'Full Stack',    readiness: 88, resumeScore: 82, status: 'placed',   joinedAt: '2024-08-12', skills: ['React','Node.js','PostgreSQL'],  assessmentsDone: 9  },
  { id: 'l2', name: 'Arjun Mehta',      email: 'arjun@bits.ac.in',       college: 'BITS Pilani',    domain: 'Backend',       readiness: 74, resumeScore: 68, status: 'active',   joinedAt: '2024-09-03', skills: ['Go','Docker','Kafka'],           assessmentsDone: 7  },
  { id: 'l3', name: 'Shreya Ghosh',     email: 'shreya@iit.ac.in',       college: 'IIT Bombay',     domain: 'Data Science',  readiness: 91, resumeScore: 89, status: 'placed',   joinedAt: '2024-07-20', skills: ['Python','TensorFlow','SQL'],     assessmentsDone: 11 },
  { id: 'l4', name: 'Rahul Verma',      email: 'rahul@nit.ac.in',        college: 'NIT Trichy',     domain: 'Frontend',      readiness: 62, resumeScore: 55, status: 'active',   joinedAt: '2024-10-15', skills: ['React','TypeScript','CSS'],      assessmentsDone: 5  },
  { id: 'l5', name: 'Ananya Reddy',     email: 'ananya@srm.edu.in',      college: 'SRM Chennai',    domain: 'DevOps',        readiness: 47, resumeScore: 40, status: 'inactive', joinedAt: '2024-11-01', skills: ['Linux','AWS','Jenkins'],         assessmentsDone: 3  },
  { id: 'l6', name: 'Karan Singh',      email: 'karan@manipal.edu',      college: 'MIT Manipal',    domain: 'Full Stack',    readiness: 79, resumeScore: 73, status: 'active',   joinedAt: '2024-08-28', skills: ['Vue','Express','MySQL'],         assessmentsDone: 8  },
  { id: 'l7', name: 'Divya Bhadra',     email: 'divya@amity.edu',        college: 'Amity Noida',    domain: 'UI/UX',         readiness: 55, resumeScore: 60, status: 'active',   joinedAt: '2024-09-19', skills: ['Figma','React','CSS'],           assessmentsDone: 4  },
  { id: 'l8', name: 'Manish Sinha',     email: 'manish@vit.ac.in',       college: 'VIT Vellore',    domain: 'Backend',       readiness: 83, resumeScore: 77, status: 'active',   joinedAt: '2024-07-05', skills: ['Java','Spring','Redis'],         assessmentsDone: 10 },
  { id: 'l9', name: 'Neha Kulkarni',    email: 'neha@pune.edu',          college: 'Pune University', domain: 'Data Science', readiness: 38, resumeScore: 32, status: 'inactive', joinedAt: '2024-12-01', skills: ['Python','Pandas'],              assessmentsDone: 2  },
  { id: 'l10',name: 'Vikram Nair',      email: 'vikram@cbit.ac.in',      college: 'CBIT Hyderabad', domain: 'Full Stack',    readiness: 70, resumeScore: 65, status: 'active',   joinedAt: '2024-10-08', skills: ['React','Node.js','MongoDB'],    assessmentsDone: 6  },
]

// ─── Mock Colleges ────────────────────────────────────────────────────────────
export const MOCK_COLLEGES: College[] = [
  { id: 'c1', name: 'VIT Vellore',          city: 'Vellore',   code: 'VIT',   adminEmail: 'admin@vit.ac.in',     totalStudents: 1240, activeStudents: 1100, placementRate: 87, avgReadiness: 71, status: 'active',    onboardedAt: '2024-01-15', topDomains: ['Full Stack','Backend','Data Science'] },
  { id: 'c2', name: 'BITS Pilani',           city: 'Pilani',    code: 'BITS',  adminEmail: 'admin@bits.ac.in',    totalStudents: 620,  activeStudents: 590,  placementRate: 92, avgReadiness: 79, status: 'active',    onboardedAt: '2024-02-01', topDomains: ['Backend','DevOps','Data Science'] },
  { id: 'c3', name: 'IIT Bombay',            city: 'Mumbai',    code: 'IITB',  adminEmail: 'admin@iitb.ac.in',    totalStudents: 480,  activeStudents: 465,  placementRate: 96, avgReadiness: 85, status: 'active',    onboardedAt: '2024-01-20', topDomains: ['Data Science','Full Stack','DevOps'] },
  { id: 'c4', name: 'NIT Trichy',            city: 'Trichy',    code: 'NITT',  adminEmail: 'admin@nitt.edu',      totalStudents: 490,  activeStudents: 430,  placementRate: 74, avgReadiness: 63, status: 'active',    onboardedAt: '2024-03-10', topDomains: ['Backend','Full Stack'] },
  { id: 'c5', name: 'SRM Chennai',           city: 'Chennai',   code: 'SRM',   adminEmail: 'admin@srm.edu.in',    totalStudents: 380,  activeStudents: 210,  placementRate: 61, avgReadiness: 52, status: 'pending',   onboardedAt: '2024-11-05', topDomains: ['Frontend','UI/UX'] },
  { id: 'c6', name: 'MIT Manipal',           city: 'Manipal',   code: 'MITM',  adminEmail: 'admin@manipal.edu',   totalStudents: 840,  activeStudents: 760,  placementRate: 81, avgReadiness: 68, status: 'active',    onboardedAt: '2024-02-20', topDomains: ['Full Stack','Backend'] },
  { id: 'c7', name: 'Amity Noida',           city: 'Noida',     code: 'AMIT',  adminEmail: 'admin@amity.edu',     totalStudents: 210,  activeStudents: 80,   placementRate: 48, avgReadiness: 41, status: 'suspended', onboardedAt: '2024-06-15', topDomains: ['UI/UX','Frontend'] },
  { id: 'c8', name: 'CBIT Hyderabad',        city: 'Hyderabad', code: 'CBIT',  adminEmail: 'admin@cbit.ac.in',    totalStudents: 320,  activeStudents: 280,  placementRate: 70, avgReadiness: 60, status: 'active',    onboardedAt: '2024-04-01', topDomains: ['Backend','Full Stack'] },
]

// ─── Mock Recruiters ──────────────────────────────────────────────────────────
export const MOCK_RECRUITERS: Recruiter[] = [
  { id: 'r1', name: 'Aisha Kapoor',    email: 'aisha@zepto.in',       company: 'Zepto',      industry: 'Quick Commerce', activeJobs: 8,  totalHires: 34, avgPackageLPA: 22, status: 'verified', joinedAt: '2024-03-10', hiringDomains: ['Backend','Full Stack','DevOps'] },
  { id: 'r2', name: 'Rohan Desai',     email: 'rohan@razorpay.com',   company: 'Razorpay',   industry: 'FinTech',        activeJobs: 12, totalHires: 56, avgPackageLPA: 28, status: 'verified', joinedAt: '2024-01-22', hiringDomains: ['Full Stack','Data Science'] },
  { id: 'r3', name: 'Preethi Rao',     email: 'preethi@swiggy.in',    company: 'Swiggy',     industry: 'FoodTech',       activeJobs: 5,  totalHires: 21, avgPackageLPA: 18, status: 'active',   joinedAt: '2024-05-14', hiringDomains: ['Backend','Data Science'] },
  { id: 'r4', name: 'Nikhil Sharma',   email: 'nikhil@cred.club',     company: 'CRED',       industry: 'FinTech',        activeJobs: 7,  totalHires: 29, avgPackageLPA: 25, status: 'verified', joinedAt: '2024-02-08', hiringDomains: ['Full Stack','Backend'] },
  { id: 'r5', name: 'Tanya Bose',      email: 'tanya@meesho.com',     company: 'Meesho',     industry: 'E-Commerce',     activeJobs: 3,  totalHires: 12, avgPackageLPA: 16, status: 'active',   joinedAt: '2024-07-30', hiringDomains: ['Frontend','UI/UX'] },
  { id: 'r6', name: 'Aryan Patel',     email: 'aryan@phonepe.com',    company: 'PhonePe',    industry: 'FinTech',        activeJobs: 9,  totalHires: 41, avgPackageLPA: 24, status: 'verified', joinedAt: '2024-01-05', hiringDomains: ['Backend','DevOps'] },
  { id: 'r7', name: 'Sonia Jain',      email: 'sonia@unacademy.com',  company: 'Unacademy',  industry: 'EdTech',         activeJobs: 4,  totalHires: 15, avgPackageLPA: 14, status: 'inactive', joinedAt: '2024-09-12', hiringDomains: ['Full Stack','Frontend'] },
  { id: 'r8', name: 'Dev Malhotra',    email: 'dev@groww.in',         company: 'Groww',      industry: 'FinTech',        activeJobs: 6,  totalHires: 23, avgPackageLPA: 20, status: 'active',   joinedAt: '2024-04-18', hiringDomains: ['Data Science','Backend'] },
]

// ─── Status helpers ───────────────────────────────────────────────────────────
export const learnerStatusMeta = {
  active:   { label: 'Active',   color: '#34d399', bg: 'rgba(52,211,153,0.12)',  border: 'rgba(52,211,153,0.25)'  },
  inactive: { label: 'Inactive', color: '#94a3b8', bg: 'rgba(148,163,184,0.10)', border: 'rgba(148,163,184,0.20)' },
  placed:   { label: 'Placed',   color: '#818cf8', bg: 'rgba(129,140,248,0.12)', border: 'rgba(129,140,248,0.25)' },
}
export const collegeStatusMeta = {
  active:    { label: 'Active',    color: '#34d399', bg: 'rgba(52,211,153,0.12)',  border: 'rgba(52,211,153,0.25)'  },
  pending:   { label: 'Pending',   color: '#fbbf24', bg: 'rgba(251,191,36,0.12)',  border: 'rgba(251,191,36,0.25)'  },
  suspended: { label: 'Suspended', color: '#f87171', bg: 'rgba(248,113,113,0.12)', border: 'rgba(248,113,113,0.25)' },
}
export const recruiterStatusMeta = {
  verified: { label: 'Verified', color: '#34d399', bg: 'rgba(52,211,153,0.12)',  border: 'rgba(52,211,153,0.25)'  },
  active:   { label: 'Active',   color: '#818cf8', bg: 'rgba(129,140,248,0.12)', border: 'rgba(129,140,248,0.25)' },
  inactive: { label: 'Inactive', color: '#94a3b8', bg: 'rgba(148,163,184,0.10)', border: 'rgba(148,163,184,0.20)' },
}