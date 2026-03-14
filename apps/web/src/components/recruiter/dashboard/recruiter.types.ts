// ═══════════════════════════════════════════════════════════════════════════
//  COSMOS — Recruiter Dashboard Types & Mock Data
//  TODO backend: all endpoints live under /api/recruiter/*
// ═══════════════════════════════════════════════════════════════════════════

export type JobType      = 'full-time' | 'internship' | 'contract'
export type JobStatus    = 'active' | 'paused' | 'closed' | 'draft'
export type MatchLevel   = 'strong' | 'good' | 'moderate' | 'low'
export type ContactStatus = 'not-contacted' | 'mail-sent' | 'responded' | 'interview-scheduled'

// ── Recruiter profile ─────────────────────────────────────────────────────────
export interface RecruiterProfile {
  name:        string
  company:     string
  role:        string
  email:       string
  logo:        string
  accentColor: string
}

// ── Job posting ───────────────────────────────────────────────────────────────
export interface JobPosting {
  id:           string
  title:        string
  type:         JobType
  department:   string
  location:     string
  mode:         'remote' | 'onsite' | 'hybrid'
  package:      string
  skills:       string[]
  description:  string
  requirements: string[]
  status:       JobStatus
  applicants:   number
  matches:      number
  postedDate:   string
  deadline:     string
}

// ── Talent / student match ────────────────────────────────────────────────────
export interface TalentMatch {
  id:              string
  name:            string
  cosmosId:        string
  college:         string
  branch:          string
  batch:           string
  avatar:          string
  readinessScore:  number
  resumeScore:     number
  skills:          string[]
  targetRole:      string
  matchScore:      number
  matchLevel:      MatchLevel
  matchedSkills:   string[]
  missingSkills:   string[]
  email:           string
  contactStatus:   ContactStatus
  streakDays:      number
  linkedIn?:       string
  github?:         string
}

// ── College listing ───────────────────────────────────────────────────────────
export interface CollegeListing {
  id:              string
  name:            string
  city:            string
  state:           string
  logo:            string
  color:           string
  totalStudents:   number
  avgReadiness:    number
  avgPackage:      number
  placementRate:   number
  topSkills:       string[]
  contactPerson:   string
  contactEmail:    string
  contactStatus:   ContactStatus
  tier:            'Tier 1' | 'Tier 2' | 'Tier 3'
}

// ── Mail template ─────────────────────────────────────────────────────────────
export interface MailTemplate {
  id:       string
  name:     string
  subject:  string
  body:     string
  type:     'student' | 'college'
}

// ── Helpers ───────────────────────────────────────────────────────────────────
export function matchColor(level: MatchLevel): string {
  return { strong:'#10b981', good:'#a855f7', moderate:'#f59e0b', low:'#64748b' }[level]
}
export function matchBg(level: MatchLevel): string {
  return { strong:'rgba(16,185,129,0.12)', good:'rgba(168,85,247,0.12)', moderate:'rgba(245,158,11,0.12)', low:'rgba(100,116,139,0.1)' }[level]
}
export function contactBadge(s: ContactStatus): { label:string; color:string; bg:string } {
  return {
    'not-contacted':      { label:'Not Contacted',       color:'#475569', bg:'rgba(71,85,105,0.12)'   },
    'mail-sent':          { label:'Mail Sent',            color:'#06b6d4', bg:'rgba(6,182,212,0.12)'   },
    'responded':          { label:'Responded',            color:'#10b981', bg:'rgba(16,185,129,0.12)'  },
    'interview-scheduled':{ label:'Interview Scheduled',  color:'#a855f7', bg:'rgba(168,85,247,0.12)'  },
  }[s]
}

// ═══════════════════════════════════════════════════════════════════════════
//  Mock Data
// ═══════════════════════════════════════════════════════════════════════════
export const MOCK_RECRUITER: RecruiterProfile = {
  name:'Arjun Mehta', company:'Razorpay', role:'Senior Talent Acquisition',
  email:'arjun.mehta@razorpay.com', logo:'R', accentColor:'#f59e0b',
}

// TODO backend: GET /api/recruiter/jobs
export const MOCK_JOBS: JobPosting[] = [
  {
    id:'j1', title:'Backend Engineer — Node.js', type:'full-time', department:'Engineering',
    location:'Bangalore', mode:'hybrid', package:'18–28 LPA',
    skills:['Node.js','PostgreSQL','Redis','System Design','Docker'],
    description:'Build and scale payment infrastructure serving millions of transactions. Own backend services end-to-end.',
    requirements:['2+ years Node.js','PostgreSQL experience','System design knowledge'],
    status:'active', applicants:34, matches:8, postedDate:'Mar 1, 2025', deadline:'Apr 15, 2025',
  },
  {
    id:'j2', title:'Frontend Engineer — React', type:'full-time', department:'Product',
    location:'Bangalore', mode:'hybrid', package:'15–24 LPA',
    skills:['React','TypeScript','Next.js','CSS','Performance'],
    description:'Build customer-facing products used by 10M+ merchants. Own the entire frontend stack.',
    requirements:['2+ years React','TypeScript proficiency','Performance optimisation experience'],
    status:'active', applicants:28, matches:6, postedDate:'Mar 5, 2025', deadline:'Apr 20, 2025',
  },
  {
    id:'j3', title:'SDE Intern — Backend', type:'internship', department:'Engineering',
    location:'Bangalore', mode:'onsite', package:'80K/month',
    skills:['Node.js','MongoDB','REST API','Git'],
    description:'6-month internship working on Razorpay\'s core payment APIs. PPO offered to top performers.',
    requirements:['CS/IT undergrad 2025/2026 batch','Strong DSA fundamentals'],
    status:'active', applicants:112, matches:19, postedDate:'Mar 8, 2025', deadline:'Apr 5, 2025',
  },
  {
    id:'j4', title:'DevOps Engineer', type:'full-time', department:'Infrastructure',
    location:'Remote', mode:'remote', package:'20–32 LPA',
    skills:['Kubernetes','Docker','AWS','CI/CD','Terraform'],
    description:'Scale Razorpay\'s infrastructure to handle 10x growth. Build internal developer tooling.',
    requirements:['3+ years DevOps','Kubernetes production experience','AWS certified preferred'],
    status:'paused', applicants:18, matches:3, postedDate:'Feb 20, 2025', deadline:'May 1, 2025',
  },
  {
    id:'j5', title:'ML Engineer — Fraud Detection', type:'full-time', department:'AI/ML',
    location:'Bangalore', mode:'hybrid', package:'25–40 LPA',
    skills:['Python','TensorFlow','PyTorch','ML Ops','SQL'],
    description:'Build ML models for real-time fraud detection on Razorpay\'s payment platform.',
    requirements:['3+ years ML','Production model deployment','Fintech experience preferred'],
    status:'draft', applicants:0, matches:0, postedDate:'—', deadline:'—',
  },
]

// TODO backend: GET /api/recruiter/talent?jobId&keywords
export const MOCK_TALENT: TalentMatch[] = [
  {
    id:'t1', name:'Kavya Reddy',   cosmosId:'CSM-LRN-7731', college:'IIT Bombay',    branch:'CSE', batch:'2025', avatar:'KR',
    readinessScore:91, resumeScore:94, skills:['Python','TensorFlow','PyTorch','AWS','SQL'],
    targetRole:'ML Engineer', matchScore:94, matchLevel:'strong',
    matchedSkills:['Python','TensorFlow','PyTorch','SQL'], missingSkills:['ML Ops'],
    email:'kavya@iitb.ac.in', contactStatus:'not-contacted', streakDays:89, github:'github.com/kavya',
  },
  {
    id:'t2', name:'Priya Nair',    cosmosId:'CSM-LRN-3142', college:'IIT Bombay',    branch:'CSE', batch:'2025', avatar:'PN',
    readinessScore:84, resumeScore:91, skills:['React','TypeScript','Next.js','CSS','Node.js'],
    targetRole:'Frontend Developer', matchScore:88, matchLevel:'strong',
    matchedSkills:['React','TypeScript','Next.js'], missingSkills:['Performance'],
    email:'priya@iitb.ac.in', contactStatus:'mail-sent', streakDays:71,
  },
  {
    id:'t3', name:'Akash Sharma',  cosmosId:'CSM-LRN-4821', college:'IIT Bombay',    branch:'CSE', batch:'2025', avatar:'AS',
    readinessScore:68, resumeScore:72, skills:['Node.js','PostgreSQL','Docker','Redis','Git'],
    targetRole:'Backend Developer', matchScore:82, matchLevel:'good',
    matchedSkills:['Node.js','PostgreSQL','Docker'], missingSkills:['System Design','Redis'],
    email:'akash@iitb.ac.in', contactStatus:'responded', streakDays:52,
  },
  {
    id:'t4', name:'Sneha Iyer',    cosmosId:'CSM-LRN-2287', college:'IIT Bombay',    branch:'CSE', batch:'2025', avatar:'SI',
    readinessScore:79, resumeScore:81, skills:['Python','SQL','Spark','Kafka','AWS'],
    targetRole:'Data Engineer', matchScore:76, matchLevel:'good',
    matchedSkills:['Python','SQL','AWS'], missingSkills:['TensorFlow','PyTorch'],
    email:'sneha@iitb.ac.in', contactStatus:'not-contacted', streakDays:38,
  },
  {
    id:'t5', name:'Ananya Singh',  cosmosId:'CSM-LRN-9123', college:'IIT Bombay',    branch:'CSE', batch:'2025', avatar:'AS',
    readinessScore:62, resumeScore:66, skills:['Docker','Kubernetes','AWS','CI/CD','Terraform'],
    targetRole:'DevOps Engineer', matchScore:71, matchLevel:'good',
    matchedSkills:['Docker','Kubernetes','AWS','CI/CD'], missingSkills:['Terraform'],
    email:'ananya@iitb.ac.in', contactStatus:'interview-scheduled', streakDays:29,
  },
  {
    id:'t6', name:'Riya Kapoor',   cosmosId:'CSM-LRN-2345', college:'BITS Pilani',   branch:'CSE', batch:'2025', avatar:'RK',
    readinessScore:77, resumeScore:85, skills:['React','Vue','TypeScript','Node.js','CSS'],
    targetRole:'Frontend Developer', matchScore:69, matchLevel:'moderate',
    matchedSkills:['React','TypeScript'], missingSkills:['Next.js','Performance'],
    email:'riya@bits.ac.in', contactStatus:'not-contacted', streakDays:44,
  },
  {
    id:'t7', name:'Nikhil Verma',  cosmosId:'CSM-LRN-3456', college:'NIT Trichy',    branch:'IT',  batch:'2025', avatar:'NV',
    readinessScore:55, resumeScore:58, skills:['Go','PostgreSQL','Redis','REST API'],
    targetRole:'Backend Developer', matchScore:63, matchLevel:'moderate',
    matchedSkills:['PostgreSQL','Redis'], missingSkills:['Node.js','System Design','Docker'],
    email:'nikhil@nitt.edu', contactStatus:'not-contacted', streakDays:21,
  },
]

// TODO backend: GET /api/recruiter/colleges
export const MOCK_COLLEGES: CollegeListing[] = [
  {
    id:'c1', name:'IIT Bombay',          city:'Mumbai',      state:'Maharashtra', logo:'IIT', color:'#a855f7',
    totalStudents:342, avgReadiness:68, avgPackage:38, placementRate:72,
    topSkills:['Node.js','Python','React','System Design'], contactPerson:'Dr. Ramesh Kumar',
    contactEmail:'placement@iitb.ac.in', contactStatus:'responded', tier:'Tier 1',
  },
  {
    id:'c2', name:'BITS Pilani',         city:'Pilani',      state:'Rajasthan',   logo:'BIT', color:'#06b6d4',
    totalStudents:280, avgReadiness:62, avgPackage:32, placementRate:68,
    topSkills:['Java','React','ML','AWS'], contactPerson:'Prof. Anjali Sharma',
    contactEmail:'placement@bits.ac.in', contactStatus:'mail-sent', tier:'Tier 1',
  },
  {
    id:'c3', name:'NIT Trichy',          city:'Trichy',      state:'Tamil Nadu',  logo:'NIT', color:'#10b981',
    totalStudents:410, avgReadiness:55, avgPackage:18, placementRate:58,
    topSkills:['C++','Java','Python','SQL'], contactPerson:'Dr. Suresh Babu',
    contactEmail:'tpo@nitt.edu', contactStatus:'not-contacted', tier:'Tier 2',
  },
  {
    id:'c4', name:'VIT Vellore',         city:'Vellore',     state:'Tamil Nadu',  logo:'VIT', color:'#f59e0b',
    totalStudents:890, avgReadiness:48, avgPackage:12, placementRate:44,
    topSkills:['Java','Python','Web Dev'], contactPerson:'Ms. Preethi R',
    contactEmail:'placement@vit.ac.in', contactStatus:'not-contacted', tier:'Tier 2',
  },
  {
    id:'c5', name:'SRM Institute',       city:'Chennai',     state:'Tamil Nadu',  logo:'SRM', color:'#f43f5e',
    totalStudents:1200, avgReadiness:41, avgPackage:8, placementRate:38,
    topSkills:['Python','HTML','Java'], contactPerson:'Mr. Venkat K',
    contactEmail:'placement@srmist.edu.in', contactStatus:'not-contacted', tier:'Tier 3',
  },
]

export const MAIL_TEMPLATES: MailTemplate[] = [
  {
    id:'mt1', name:'Interview Invite', type:'student',
    subject:'Interview Opportunity at {{company}} — {{role}}',
    body:`Hi {{name}},\n\nWe came across your profile on COSMOS and were impressed by your background in {{skills}}.\n\nWe'd love to have you interview for the {{role}} position at {{company}}.\n\n📅 Date: [Interview Date]\n🕐 Time: [Interview Time]\n📍 Mode: [Zoom / In-person]\n\nPlease confirm your availability by replying to this email.\n\nBest regards,\n{{recruiterName}}\n{{company}}`,
  },
  {
    id:'mt2', name:'General Outreach', type:'student',
    subject:'Exciting opportunity at {{company}} — Perfect match for your profile',
    body:`Hi {{name}},\n\nYour COSMOS profile stood out for the {{role}} opening at {{company}}. With your expertise in {{skills}}, you'd be a great fit.\n\nWe offer {{package}} + excellent growth opportunities.\n\nInterested? Reply or apply here: [link]\n\nBest,\n{{recruiterName}}`,
  },
  {
    id:'mt3', name:'Campus Drive', type:'college',
    subject:'Campus Recruitment Drive — {{company}} × {{college}}',
    body:`Dear {{contactPerson}},\n\nI'm {{recruiterName}}, Senior Talent Acquisition at {{company}}. We're interested in conducting a campus recruitment drive at {{college}} for our {{batch}} batch.\n\nRoles: {{roles}}\nPackage: {{package}}\nMode: On-campus / Virtual\n\nWe'd love to schedule a call to discuss logistics.\n\nBest regards,\n{{recruiterName}}\n{{company}}`,
  },
]