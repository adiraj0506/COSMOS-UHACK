// ── Types ─────────────────────────────────────────────────────────────────────
export type OppType = 'job' | 'internship' | 'hackathon' | 'event' | 'open-source'

export interface Opportunity {
  id:          string
  type:        OppType
  title:       string
  company:     string
  logo:        string        // emoji or first letter
  logoGrad:    string        // CSS gradient string
  location:    string
  mode:        'remote' | 'onsite' | 'hybrid'
  tags:        string[]
  desc:        string
  deadline:    string        // ISO date
  posted:      string        // e.g. "2d ago"
  match:       number        // 0-100 AI match score
  prize?:      string        // for hackathons
  applyUrl:    string
  featured?:   boolean
  isNew?:      boolean
}

export type CourseDomain = 'Backend' | 'Frontend' | 'DSA' | 'System Design' | 'DevOps' | 'ML/AI'

export interface YTCourse {
  id:        string
  title:     string
  channel:   string
  views:     string
  duration:  string
  domain:    CourseDomain
  thumbBg:   string          // gradient for thumbnail bg
  thumbEmoji:string
  tag:       string
  tagColor:  string
  url:       string
}

// ── Helpers ───────────────────────────────────────────────────────────────────
export function daysLeft(iso: string): number {
  return Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000)
}

export function deadlineLabel(iso: string): string {
  const d = daysLeft(iso)
  if (d < 0)  return 'Expired'
  if (d === 0) return 'Closes today'
  if (d <= 7)  return `${d}d left`
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

export const TYPE_COLOR: Record<OppType, string> = {
  job:          '#6366f1',
  internship:   '#06b6d4',
  hackathon:    '#a855f7',
  event:        '#f59e0b',
  'open-source':'#10b981',
}

export const TYPE_LABEL: Record<OppType, string> = {
  job:          'Full-time Job',
  internship:   'Internship',
  hackathon:    'Hackathon',
  event:        'Event',
  'open-source':'Open Source',
}

// ── Mock data ─────────────────────────────────────────────────────────────────
// TODO backend teammate: GET /api/opportunities?type&domain&search → Opportunity[]
export const MOCK_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'o1', type: 'job', featured: true, isNew: true,
    title: 'Backend Engineer — Node.js & PostgreSQL',
    company: 'Razorpay', logo: 'R', logoGrad: 'linear-gradient(135deg,#2563eb,#1d4ed8)',
    location: 'Bangalore, India', mode: 'hybrid',
    tags: ['Node.js','PostgreSQL','System Design','REST API'],
    desc: 'Build and scale payment infrastructure serving millions of transactions. Own backend services end-to-end from design to deployment.',
    deadline: '2025-05-15', posted: '1d ago', match: 91, applyUrl: '#',
  },
  {
    id: 'o2', type: 'internship', isNew: true,
    title: 'Software Engineering Intern — Backend',
    company: 'Zepto', logo: 'Z', logoGrad: 'linear-gradient(135deg,#7c3aed,#a855f7)',
    location: 'Mumbai, India', mode: 'onsite',
    tags: ['Node.js','MongoDB','Docker','Redis'],
    desc: '6-month internship building microservices for India\'s fastest growing q-commerce platform. PPO offered to top performers.',
    deadline: '2025-04-25', posted: '2d ago', match: 87, applyUrl: '#',
  },
  {
    id: 'o3', type: 'hackathon', featured: true,
    title: 'SolveForIndia — National Hackathon',
    company: 'Google India', logo: 'G', logoGrad: 'linear-gradient(135deg,#ea4335,#fbbc04)',
    location: 'Online + Bangalore Finals', mode: 'hybrid',
    tags: ['AI/ML','Web','Social Impact'],
    desc: 'Build tech solutions for Bharat. ₹25L prize pool. Top teams get Google mentorship and fast-track interviews.',
    deadline: '2025-04-30', posted: '3d ago', match: 82, prize: '₹25,00,000', applyUrl: '#',
  },
  {
    id: 'o4', type: 'job',
    title: 'Senior Backend Developer — Go/Kubernetes',
    company: 'Cred', logo: 'C', logoGrad: 'linear-gradient(135deg,#1f2937,#374151)',
    location: 'Bangalore, India', mode: 'remote',
    tags: ['Go','Kubernetes','gRPC','AWS'],
    desc: 'Design distributed systems for India\'s premium credit card management platform. 3+ years experience required.',
    deadline: '2025-05-20', posted: '4d ago', match: 74, applyUrl: '#',
  },
  {
    id: 'o5', type: 'event',
    title: 'React India Conference 2025',
    company: 'GeekyAnts', logo: '⚛', logoGrad: 'linear-gradient(135deg,#0ea5e9,#38bdf8)',
    location: 'Goa, India', mode: 'onsite',
    tags: ['React','Next.js','Frontend','Networking'],
    desc: 'India\'s largest React conference. 50+ speakers, workshops, and networking with 1000+ developers.',
    deadline: '2025-06-01', posted: '5d ago', match: 68, applyUrl: '#',
  },
  {
    id: 'o6', type: 'open-source', isNew: true,
    title: 'Contributor — Appwrite Backend SDK',
    company: 'Appwrite', logo: 'A', logoGrad: 'linear-gradient(135deg,#f02e65,#ff6b9d)',
    location: 'Remote', mode: 'remote',
    tags: ['TypeScript','Node.js','Open Source','SDK'],
    desc: 'Fix bugs and add features to Appwrite\'s Node.js SDK. Great for building OSS portfolio and getting hired.',
    deadline: '2025-12-31', posted: '1w ago', match: 79, applyUrl: '#',
  },
  {
    id: 'o7', type: 'internship',
    title: 'Platform Engineering Intern',
    company: 'Swiggy', logo: 'S', logoGrad: 'linear-gradient(135deg,#f97316,#ea580c)',
    location: 'Bangalore, India', mode: 'onsite',
    tags: ['Python','Kafka','Docker','Microservices'],
    desc: 'Work on Swiggy\'s platform engineering team. Build internal tooling and improve developer experience.',
    deadline: '2025-04-18', posted: '6d ago', match: 71, applyUrl: '#',
  },
  {
    id: 'o8', type: 'hackathon',
    title: 'HackMIT — Flagship Hackathon',
    company: 'MIT', logo: 'M', logoGrad: 'linear-gradient(135deg,#1e3a5f,#2563eb)',
    location: 'Cambridge, MA (Online eligible)', mode: 'hybrid',
    tags: ['All Domains','$10K Prize','Global'],
    desc: 'One of the world\'s most prestigious 24-hour hackathons. Win $10K and recruitment from top tech companies.',
    deadline: '2025-05-05', posted: '1w ago', match: 65, prize: '$10,000', applyUrl: '#',
  },
  {
    id: 'o9', type: 'job', isNew: true,
    title: 'Full Stack Developer — React + Node',
    company: 'Groww', logo: 'G', logoGrad: 'linear-gradient(135deg,#10b981,#059669)',
    location: 'Bangalore, India', mode: 'hybrid',
    tags: ['React','Node.js','TypeScript','AWS'],
    desc: 'Build fintech products used by 10M+ investors. End-to-end ownership from UI to backend APIs.',
    deadline: '2025-05-10', posted: '2d ago', match: 83, applyUrl: '#',
  },
]

// TODO backend teammate: GET /api/courses?domain → YTCourse[]
export const MOCK_COURSES: YTCourse[] = [
  {
    id: 'c1', domain: 'Backend',
    title: 'Node.js Crash Course — Build REST APIs from Scratch',
    channel: 'Traversy Media', views: '2.1M', duration: '1:30:00',
    thumbBg: 'linear-gradient(135deg,#1e3a5f,#2563eb)', thumbEmoji: '🟢',
    tag: 'Node.js', tagColor: '#10b981', url: '#',
  },
  {
    id: 'c2', domain: 'System Design',
    title: 'System Design Interview — Complete Guide for 2025',
    channel: 'Gaurav Sen', views: '5.4M', duration: '2:15:00',
    thumbBg: 'linear-gradient(135deg,#4f1787,#7c3aed)', thumbEmoji: '🏗️',
    tag: 'System Design', tagColor: '#a855f7', url: '#',
  },
  {
    id: 'c3', domain: 'DSA',
    title: 'Dynamic Programming — All Patterns in One Video',
    channel: 'NeetCode', views: '3.8M', duration: '3:00:00',
    thumbBg: 'linear-gradient(135deg,#064e3b,#10b981)', thumbEmoji: '🧩',
    tag: 'DSA', tagColor: '#10b981', url: '#',
  },
  {
    id: 'c4', domain: 'Backend',
    title: 'PostgreSQL Full Course — Databases for Developers',
    channel: 'Hussein Nasser', views: '1.2M', duration: '4:30:00',
    thumbBg: 'linear-gradient(135deg,#1e3a5f,#0369a1)', thumbEmoji: '🐘',
    tag: 'PostgreSQL', tagColor: '#06b6d4', url: '#',
  },
  {
    id: 'c5', domain: 'DevOps',
    title: 'Docker & Kubernetes Complete Course 2025',
    channel: 'TechWorld with Nana', views: '4.2M', duration: '5:00:00',
    thumbBg: 'linear-gradient(135deg,#0c4a6e,#0369a1)', thumbEmoji: '🐳',
    tag: 'DevOps', tagColor: '#0ea5e9', url: '#',
  },
  {
    id: 'c6', domain: 'System Design',
    title: 'Designing Data-Intensive Applications — Key Takeaways',
    channel: 'ByteByteGo', views: '2.8M', duration: '1:45:00',
    thumbBg: 'linear-gradient(135deg,#312e81,#6366f1)', thumbEmoji: '📐',
    tag: 'System Design', tagColor: '#6366f1', url: '#',
  },
  {
    id: 'c7', domain: 'ML/AI',
    title: 'LLMs & RAG — Build AI Apps with Node.js',
    channel: 'Fireship', views: '900K', duration: '0:45:00',
    thumbBg: 'linear-gradient(135deg,#1f0a35,#7c3aed)', thumbEmoji: '🤖',
    tag: 'AI/ML', tagColor: '#a855f7', url: '#',
  },
  {
    id: 'c8', domain: 'DSA',
    title: 'Graph Algorithms — BFS, DFS, Dijkstra Explained',
    channel: 'Abdul Bari', views: '6.1M', duration: '2:30:00',
    thumbBg: 'linear-gradient(135deg,#1c1917,#44403c)', thumbEmoji: '🕸️',
    tag: 'Graphs', tagColor: '#f59e0b', url: '#',
  },
]

export const COURSE_DOMAINS: CourseDomain[] = ['Backend','DSA','System Design','DevOps','Frontend','ML/AI']