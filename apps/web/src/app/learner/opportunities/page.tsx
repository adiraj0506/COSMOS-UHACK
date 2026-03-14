'use client'

import './opportunities.css'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Briefcase, Rocket, Trophy, Calendar, BookOpen,
  Code2, TrendingUp, Zap, Youtube, RefreshCw,
} from 'lucide-react'

import DashboardShell       from '@/components/learner/dashboard/DashboardShell'
import FeaturedBanner       from '@/components/learner/opportunities/FeaturedBanner'
import OpportunityCard      from '@/components/learner/opportunities/OpportunityCard'
import OpportunityFilters   from '@/components/learner/opportunities/OpportunityFilters'
import CourseCard           from '@/components/learner/opportunities/CourseCard'

import {
  MOCK_OPPORTUNITIES,
  MOCK_COURSES,
  COURSE_DOMAINS,
  TYPE_COLOR,
} from '@/components/learner/opportunities/opportunities.types'
import type { OppType, CourseDomain } from '@/components/learner/opportunities/opportunities.types'

// ── Types ─────────────────────────────────────────────────────────────────────
type FilterType = 'all' | OppType

// ── Animation helper ──────────────────────────────────────────────────────────
const fadeUp = (i: number) => ({
  initial:    { opacity: 0, y: 14 },
  animate:    { opacity: 1, y: 0  },
  transition: { duration: 0.4, delay: 0.05 * i, ease: [0.22, 1, 0.36, 1] as const },
})

// ── KPI card ──────────────────────────────────────────────────────────────────
function KpiCard({ icon: Icon, label, value, delta, deltaGood, color }: {
  icon: React.ElementType; label: string; value: string | number
  delta: string; deltaGood: boolean; color: string
}) {
  return (
    <div className="op-kpi" style={{ boxShadow: `inset 0 0 48px ${color}08, 0 4px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div className="op-kpi__icon" style={{ background: `${color}18`, border: `1px solid ${color}28`, boxShadow: `0 0 10px ${color}20` }}>
          <Icon size={15} style={{ color }} />
        </div>
        <span className={`op-kpi__delta ${deltaGood ? 'op-kpi__delta--good' : 'op-kpi__delta--warn'}`}>{delta}</span>
      </div>
      <p className="op-kpi__value">{value}</p>
      <p className="op-kpi__label">{label}</p>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function OpportunitiesPage() {
  // Filter + search state
  const [filter,       setFilter]       = useState<FilterType>('all')
  const [search,       setSearch]       = useState('')
  const [sort,         setSort]         = useState('match')
  const [courseDomain, setCourseDomain] = useState<CourseDomain>('Backend')
  const [loading,      setLoading]      = useState(false)

  // ── Filtered + sorted opportunities ────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = MOCK_OPPORTUNITIES

    if (filter !== 'all') {
      list = list.filter(o => o.type === filter)
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(o =>
        o.title.toLowerCase().includes(q) ||
        o.company.toLowerCase().includes(q) ||
        o.tags.some(t => t.toLowerCase().includes(q))
      )
    }

    return [...list].sort((a, b) => {
      if (sort === 'match')    return b.match - a.match
      if (sort === 'deadline') return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
      return 0 // recent — keep original order
    })
  }, [filter, search, sort])

  // Featured opportunity (top match, featured flag)
  const featured = MOCK_OPPORTUNITIES.find(o => o.featured && (filter === 'all' || o.type === filter))

  // Courses filtered by domain
  const courses = MOCK_COURSES.filter(c => c.domain === courseDomain)

  // Derived counts
  const counts = {
    jobs:       MOCK_OPPORTUNITIES.filter(o => o.type === 'job').length,
    internships:MOCK_OPPORTUNITIES.filter(o => o.type === 'internship').length,
    hackathons: MOCK_OPPORTUNITIES.filter(o => o.type === 'hackathon').length,
    highMatch:  MOCK_OPPORTUNITIES.filter(o => o.match >= 80).length,
  }

  async function refresh() {
    setLoading(true)
    // TODO backend teammate: refetch GET /api/opportunities
    await new Promise(r => setTimeout(r, 900))
    setLoading(false)
  }

  return (
    <DashboardShell activeHref="/learner/opportunities">

      {/* ── Page header ── */}
      <motion.div {...fadeUp(0)}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}
      >
        <div>
          <h1 style={{
            fontSize: 18, fontWeight: 900, color: '#fff',
            letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{ filter: 'drop-shadow(0 0 8px #a855f7)' }}>🚀</span>
            Opportunities
          </h1>
          <p style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>
            Jobs · Internships · Hackathons · Events · Open Source — curated for your profile
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
          onClick={refresh}
          disabled={loading}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 16px', borderRadius: 12,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#94a3b8', fontSize: 11, fontWeight: 600,
            cursor: 'pointer', transition: 'all 0.15s',
          }}
        >
          <RefreshCw size={12} style={{ animation: loading ? 'op-spin 0.85s linear infinite' : 'none' }} />
          {loading ? 'Refreshing…' : 'Refresh'}
        </motion.button>
      </motion.div>

      {/* ── KPI strip ── */}
      <motion.div {...fadeUp(1)} className="op-kpi-strip">
        <KpiCard icon={Briefcase}   label="Jobs Available"      value={counts.jobs}        delta="8 new today"    deltaGood={true}  color="#6366f1" />
        <KpiCard icon={Rocket}      label="Internships"         value={counts.internships}  delta="3 new today"    deltaGood={true}  color="#06b6d4" />
        <KpiCard icon={Trophy}      label="Hackathons"          value={counts.hackathons}   delta="2 closing soon" deltaGood={false} color="#a855f7" />
        <KpiCard icon={Zap}         label="Strong Matches (80%+)" value={counts.highMatch} delta="Based on profile" deltaGood={true} color="#10b981" />
      </motion.div>

      {/* ── Featured banner ── */}
      {featured && (
        <motion.div {...fadeUp(2)}>
          <FeaturedBanner opp={featured} />
        </motion.div>
      )}

      {/* ── Opportunities section ── */}
      <motion.div {...fadeUp(3)}>
        <p className="op-section-title">✦ Latest Opportunities</p>

        {/* Filters */}
        <OpportunityFilters
          active={filter}
          search={search}
          sort={sort}
          onFilter={setFilter}
          onSearch={setSearch}
          onSort={setSort}
        />

        {/* Results count */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <span style={{ fontSize: 10, color: '#475569', fontWeight: 600 }}>
            {filtered.length} result{filtered.length !== 1 ? 's' : ''}
            {filter !== 'all' ? ` · ${filter}` : ''}
            {search ? ` for "${search}"` : ''}
          </span>
          {(filter !== 'all' || search) && (
            <button
              onClick={() => { setFilter('all'); setSearch('') }}
              style={{
                fontSize: 9.5, color: '#7c3aed', fontWeight: 700,
                background: 'none', border: 'none', cursor: 'pointer', padding: 0,
              }}
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="op-empty">
              <span className="op-empty__icon">🪐</span>
              <p className="op-empty__title">No opportunities found</p>
              <p className="op-empty__sub">Try adjusting your filters or search terms</p>
            </motion.div>
          ) : (
            <motion.div
              key={`${filter}-${search}`}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="op-opp-grid"
            >
              {filtered.map((opp, i) => (
                <OpportunityCard key={opp.id} opp={opp} index={i} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── YouTube Courses section ── */}
      <motion.div {...fadeUp(4)} style={{ marginTop: 28 }}>
        <p className="op-section-title">✦ Suggested Course Lectures</p>

        {/* Domain selector */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 10 }}>
          <div className="op-domain-row" style={{ margin: 0, flex: 1 }}>
            {COURSE_DOMAINS.map(d => (
              <button
                key={d}
                className={`op-domain-pill ${courseDomain === d ? 'active' : ''}`}
                onClick={() => setCourseDomain(d)}
              >
                {d === 'Backend'       ? '🟢' :
                 d === 'Frontend'      ? '⚛️' :
                 d === 'DSA'           ? '🧩' :
                 d === 'System Design' ? '🏗️' :
                 d === 'DevOps'        ? '🐳' : '🤖'}
                {' '}{d}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
            <Youtube size={14} style={{ color: '#f43f5e' }} />
            <span style={{ fontSize: 10, color: '#475569', fontWeight: 600 }}>
              Sourced from YouTube
            </span>
          </div>
        </div>

        {/* Course grid */}
        <AnimatePresence mode="wait">
          {courses.length === 0 ? (
            <motion.div key="empty-courses"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="op-empty">
              <span className="op-empty__icon">📺</span>
              <p className="op-empty__title">No courses yet for {courseDomain}</p>
              <p className="op-empty__sub">More content coming soon</p>
            </motion.div>
          ) : (
            <motion.div
              key={courseDomain}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="op-course-grid"
            >
              {courses.map((course, i) => (
                <CourseCard key={course.id} course={course} index={i} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom padding */}
        <div style={{ height: 24 }} />
      </motion.div>

      {/* Spin animation */}
      <style>{`@keyframes op-spin { to { transform: rotate(360deg); } }`}</style>

    </DashboardShell>
  )
}
