'use client'

interface Question {
  id: string
  answered?: boolean
}

interface Props {
  questions: Question[]
  current: number
  setCurrent: (index: number) => void
}

export default function QuestionNavigator({ questions, current, setCurrent }: Props) {

  return (

    <div className="cosmos-card">

      <h3 className="nav-title">
        Navigator
      </h3>

      <div className="navigator-grid">

        {questions.map((q, i) => (

          <button
            key={q.id || i}
            onClick={() => setCurrent(i)}
            className={`
              qbtn
              ${current === i ? "active" : ""}
              ${q.answered ? "answered" : ""}
            `}
          >
            {i + 1}
          </button>

        ))}

      </div>

    </div>

  )

}