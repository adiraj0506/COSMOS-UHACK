'use client'

import { motion } from 'framer-motion'
import { Play, Eye, Youtube } from 'lucide-react'
import type { YTCourse } from './opportunities.types.js'

interface CourseCardProps {
  course: YTCourse
  index:  number
}

export default function CourseCard({ course, index }: CourseCardProps) {
  return (
    <motion.a
      href={course.url}
      target="_blank"
      rel="noopener noreferrer"
      className="op-course-card"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.36, delay: index * 0.055, ease: [0.22, 1, 0.36, 1] }}
      style={{ textDecoration: 'none' }}
    >
      {/* Thumbnail */}
      <div className="op-course-thumb">
        {/* Gradient bg + emoji as "thumbnail" */}
        <div style={{
          width: '100%', height: '100%',
          background: course.thumbBg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 36, opacity: 0.6,
        }}>
          {course.thumbEmoji}
        </div>
        {/* Play overlay */}
        <div className="op-course-play">
          <div className="op-course-play-btn">
            <Play size={14} color="#fff" fill="#fff" style={{ marginLeft: 2 }} />
          </div>
        </div>
        {/* Duration badge */}
        <span className="op-course-duration">{course.duration}</span>
      </div>

      {/* Body */}
      <div className="op-course-body">
        <div className="op-course-channel">
          <Youtube size={10} style={{ color: '#f43f5e' }} />
          {course.channel}
        </div>
        <p className="op-course-title">{course.title}</p>
        <div className="op-course-meta">
          <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Eye size={10} style={{ color: '#475569' }} />
            <span className="op-course-views">{course.views} views</span>
          </div>
          <span className="op-course-tag" style={{
            background: `${course.tagColor}18`,
            color: course.tagColor,
            border: `1px solid ${course.tagColor}28`,
            marginLeft: 'auto',
          }}>
            {course.tag}
          </span>
        </div>
      </div>
    </motion.a>
  )
}
