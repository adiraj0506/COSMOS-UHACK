// ═══════════════════════════════════════════════════════════════════════════
//  COSMOS — College Dashboard Types & Mock Data
//  TODO backend teammate: all data from GET /api/college/* endpoints
// ═══════════════════════════════════════════════════════════════════════════

// ── Enums ─────────────────────────────────────────────────────────────────────
export type ReadinessLevel = 'high' | 'medium' | 'low'
export type PlacementStatus = 'placed' | 'in-process' | 'not-started'
export type BatchYear = '2025' | '2024' | '2023' | '2022'
export type Branch = 'CSE' | 'IT' | 'ECE' | 'MECH' | 'CIVIL' | 'EEE'

// ── Student ───────────────────────────────────────────────────────────────────
export interface Student {
  id:               string
  name:             string
  cosmosId:         string
  branch:           Branch
  batch:            BatchYear
  email:            string
  avatar:           string            // initials
  readinessScore:   number            // 0-100
  readinessLevel:   ReadinessLevel
  placementStatus:  PlacementStatus
  targetRole:       string
  skills:           string[]
  streakDays:       number
  lastActive:       string            // e.g. "2h ago"
  assessmentsDone:  number
  roadmapProgress:  number            // 0-100
  resumeScore:      number            // 0-100
  isAtRisk:         boolean           // readiness < 40
}

// ── Placement Record ──────────────────────────────────────────────────────────
export interface PlacementRecord {
  id:        string
  studentId: string
  student:   string
  company:   string
  role:      string
  package:   string             // e.g. "12 LPA"
  date:      string
  branch:    Branch
  logoColor: string
}

// ── Analytics ─────────────────────────────────────────────────────────────────
export interface BranchStats {
  branch:          Branch
  total:           number
  avgReadiness:    number
  placed:          number
  atRisk:          number
  color:           string
}

export interface ReadinessTrend {
  month:   string
  avg:     number
  high:    number
  low:     number
}

export interface SkillGap {
  skill:     string
  students:  number
  pct:       number
  color:     string
}

// ── College Profile ───────────────────────────────────────────────────────────
export interface CollegeProfile {
  name:           string
  code:           string
  city:           string
  state:          string
  totalStudents:  number
  activeBatch:    BatchYear
  logoInitial:    string
}

// ═══════════════════════════════════════════════════════════════════════════
//  Mock Data
// ═══════════════════════════════════════════════════════════════════════════

export const MOCK_COLLEGE: CollegeProfile = {
  name: 'Indian Institute of Technology Bombay',
  code: 'IITB-2025',
  city: 'Mumbai', state: 'Maharashtra',
  totalStudents: 342,
  activeBatch: '2025',
  logoInitial: 'IIT',
}

// TODO backend: GET /api/college/students?batch&branch&search
export const MOCK_STUDENTS: Student[] = [
  { id:'s1',  name:'Akash Sharma',    cosmosId:'CSM-LRN-4821', branch:'CSE',  batch:'2025', email:'akash@iitb.ac.in',    avatar:'AS', readinessScore:68, readinessLevel:'medium', placementStatus:'in-process', targetRole:'Backend Developer',    skills:['Node.js','PostgreSQL','Docker'],      streakDays:52, lastActive:'2h ago',  assessmentsDone:8,  roadmapProgress:62, resumeScore:72, isAtRisk:false },
  { id:'s2',  name:'Priya Nair',      cosmosId:'CSM-LRN-3142', branch:'CSE',  batch:'2025', email:'priya@iitb.ac.in',    avatar:'PN', readinessScore:84, readinessLevel:'high',   placementStatus:'placed',     targetRole:'Frontend Developer',   skills:['React','TypeScript','Next.js'],       streakDays:71, lastActive:'1h ago',  assessmentsDone:12, roadmapProgress:88, resumeScore:91, isAtRisk:false },
  { id:'s3',  name:'Rohan Mehta',     cosmosId:'CSM-LRN-5934', branch:'IT',   batch:'2025', email:'rohan@iitb.ac.in',    avatar:'RM', readinessScore:31, readinessLevel:'low',    placementStatus:'not-started', targetRole:'Full Stack Developer', skills:['HTML','CSS'],                        streakDays:4,  lastActive:'5d ago',  assessmentsDone:2,  roadmapProgress:18, resumeScore:28, isAtRisk:true  },
  { id:'s4',  name:'Sneha Iyer',      cosmosId:'CSM-LRN-2287', branch:'CSE',  batch:'2025', email:'sneha@iitb.ac.in',    avatar:'SI', readinessScore:79, readinessLevel:'high',   placementStatus:'in-process', targetRole:'Data Engineer',        skills:['Python','SQL','Spark','Kafka'],      streakDays:38, lastActive:'3h ago',  assessmentsDone:10, roadmapProgress:74, resumeScore:81, isAtRisk:false },
  { id:'s5',  name:'Arjun Patel',     cosmosId:'CSM-LRN-6612', branch:'ECE',  batch:'2025', email:'arjun@iitb.ac.in',    avatar:'AP', readinessScore:45, readinessLevel:'medium', placementStatus:'not-started', targetRole:'Embedded Engineer',    skills:['C','C++','RTOS'],                   streakDays:12, lastActive:'1d ago',  assessmentsDone:4,  roadmapProgress:35, resumeScore:44, isAtRisk:false },
  { id:'s6',  name:'Kavya Reddy',     cosmosId:'CSM-LRN-7731', branch:'CSE',  batch:'2025', email:'kavya@iitb.ac.in',    avatar:'KR', readinessScore:91, readinessLevel:'high',   placementStatus:'placed',     targetRole:'ML Engineer',          skills:['Python','TensorFlow','PyTorch','AWS'], streakDays:89, lastActive:'30m ago', assessmentsDone:15, roadmapProgress:95, resumeScore:94, isAtRisk:false },
  { id:'s7',  name:'Dev Gupta',       cosmosId:'CSM-LRN-8844', branch:'IT',   batch:'2025', email:'dev@iitb.ac.in',      avatar:'DG', readinessScore:28, readinessLevel:'low',    placementStatus:'not-started', targetRole:'Backend Developer',    skills:['Java'],                             streakDays:1,  lastActive:'1w ago',  assessmentsDone:1,  roadmapProgress:10, resumeScore:22, isAtRisk:true  },
  { id:'s8',  name:'Ananya Singh',    cosmosId:'CSM-LRN-9123', branch:'CSE',  batch:'2025', email:'ananya@iitb.ac.in',   avatar:'AS', readinessScore:62, readinessLevel:'medium', placementStatus:'in-process', targetRole:'DevOps Engineer',      skills:['Docker','Kubernetes','AWS','CI/CD'],  streakDays:29, lastActive:'4h ago',  assessmentsDone:7,  roadmapProgress:55, resumeScore:66, isAtRisk:false },
  { id:'s9',  name:'Vikram Joshi',    cosmosId:'CSM-LRN-1056', branch:'MECH', batch:'2025', email:'vikram@iitb.ac.in',   avatar:'VJ', readinessScore:38, readinessLevel:'low',    placementStatus:'not-started', targetRole:'Product Manager',      skills:['Excel','Figma'],                    streakDays:7,  lastActive:'2d ago',  assessmentsDone:3,  roadmapProgress:22, resumeScore:35, isAtRisk:true  },
  { id:'s10', name:'Riya Kapoor',     cosmosId:'CSM-LRN-2345', branch:'CSE',  batch:'2025', email:'riya@iitb.ac.in',     avatar:'RK', readinessScore:77, readinessLevel:'high',   placementStatus:'placed',     targetRole:'Frontend Developer',   skills:['React','Vue','TypeScript','CSS'],     streakDays:44, lastActive:'1h ago',  assessmentsDone:11, roadmapProgress:80, resumeScore:85, isAtRisk:false },
  { id:'s11', name:'Nikhil Verma',    cosmosId:'CSM-LRN-3456', branch:'IT',   batch:'2025', email:'nikhil@iitb.ac.in',   avatar:'NV', readinessScore:55, readinessLevel:'medium', placementStatus:'in-process', targetRole:'Backend Developer',    skills:['Go','PostgreSQL','Redis'],           streakDays:21, lastActive:'6h ago',  assessmentsDone:6,  roadmapProgress:48, resumeScore:58, isAtRisk:false },
  { id:'s12', name:'Pooja Sharma',    cosmosId:'CSM-LRN-4567', branch:'ECE',  batch:'2025', email:'pooja@iitb.ac.in',    avatar:'PS', readinessScore:23, readinessLevel:'low',    placementStatus:'not-started', targetRole:'VLSI Engineer',        skills:['Verilog'],                          streakDays:0,  lastActive:'2w ago',  assessmentsDone:0,  roadmapProgress:5,  resumeScore:18, isAtRisk:true  },
]

// TODO backend: GET /api/college/placements
export const MOCK_PLACEMENTS: PlacementRecord[] = [
  { id:'p1', studentId:'s2',  student:'Priya Nair',   company:'Google',    role:'SWE',             package:'45 LPA', date:'Mar 2025', branch:'CSE',  logoColor:'#4285f4' },
  { id:'p2', studentId:'s6',  student:'Kavya Reddy',  company:'OpenAI',    role:'ML Engineer',     package:'80 LPA', date:'Feb 2025', branch:'CSE',  logoColor:'#10b981' },
  { id:'p3', studentId:'s10', student:'Riya Kapoor',  company:'Razorpay',  role:'Frontend Dev',    package:'28 LPA', date:'Mar 2025', branch:'CSE',  logoColor:'#2563eb' },
  { id:'p4', studentId:'s8',  student:'Ananya Singh', company:'Zepto',     role:'DevOps Engineer', package:'22 LPA', date:'Mar 2025', branch:'CSE',  logoColor:'#7c3aed' },
]

// TODO backend: GET /api/college/analytics/branch
export const MOCK_BRANCH_STATS: BranchStats[] = [
  { branch:'CSE',   total:142, avgReadiness:68, placed:38, atRisk:8,  color:'#a855f7' },
  { branch:'IT',    total:98,  avgReadiness:55, placed:19, atRisk:14, color:'#06b6d4' },
  { branch:'ECE',   total:62,  avgReadiness:41, placed:8,  atRisk:18, color:'#f59e0b' },
  { branch:'MECH',  total:24,  avgReadiness:36, placed:2,  atRisk:9,  color:'#f43f5e' },
  { branch:'CIVIL', total:10,  avgReadiness:29, placed:0,  atRisk:4,  color:'#64748b' },
  { branch:'EEE',   total:6,   avgReadiness:48, placed:1,  atRisk:2,  color:'#10b981' },
]

// TODO backend: GET /api/college/analytics/trend
export const MOCK_TREND: ReadinessTrend[] = [
  { month:'Oct', avg:48, high:72, low:24 },
  { month:'Nov', avg:52, high:76, low:28 },
  { month:'Dec', avg:55, high:79, low:26 },
  { month:'Jan', avg:58, high:82, low:30 },
  { month:'Feb', avg:62, high:86, low:31 },
  { month:'Mar', avg:65, high:89, low:33 },
]

// TODO backend: GET /api/college/analytics/skill-gaps
export const MOCK_SKILL_GAPS: SkillGap[] = [
  { skill:'System Design', students:198, pct:58, color:'#a855f7' },
  { skill:'DSA — Graphs',  students:167, pct:49, color:'#f43f5e' },
  { skill:'Cloud (AWS)',   students:154, pct:45, color:'#f59e0b' },
  { skill:'Docker/K8s',    students:142, pct:41, color:'#06b6d4' },
  { skill:'SQL Advanced',  students:128, pct:37, color:'#10b981' },
]

// ── Helpers ───────────────────────────────────────────────────────────────────
export function readinessColor(score: number): string {
  if (score >= 75) return '#10b981'
  if (score >= 50) return '#f59e0b'
  return '#f43f5e'
}

export function readinessBg(score: number): string {
  if (score >= 75) return 'rgba(16,185,129,0.12)'
  if (score >= 50) return 'rgba(245,158,11,0.12)'
  return 'rgba(244,63,94,0.12)'
}