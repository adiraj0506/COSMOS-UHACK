'use client'

interface TopbarProps {
  userName: string
}

export default function Topbar({ userName }: TopbarProps) {

  const icons = ['✉', '◎', '🔔']

  return (

    <div className="topbar">

      <div className="topbar-title">
        Welcome Back,
        <span className="topbar-username">{userName}</span>
      </div>

      <div className="topbar-actions">

        {icons.map((icon, i) => (
          <button key={i} className="topbar-icon">
            {icon}
          </button>
        ))}

        <div className="topbar-avatar">
          {userName[0]}
        </div>

      </div>

    </div>

  )

}