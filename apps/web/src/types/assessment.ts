export type QuestionStatus =
  | 'correct'
  | 'completed'
  | 'current'
  | 'highlighted'
  | 'orange'
  | 'unattempted'

export interface Question {
  id: number
  status: QuestionStatus
}

export interface Goal {
  id: string
  icon: string
  label: string
  subLabel?: string
}

export interface Topic {
  id: string
  icon: string
  label: string
  checked: boolean
  editable?: boolean
}

export type PaceMode = 'practice' | 'timed'

export interface NavItem {
  id: string
  icon: string
  label: string
}
