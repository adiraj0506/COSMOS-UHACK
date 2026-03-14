"use client";

import ArcGauge from "@/components/ui/ArcGauge";

type Skill = {
  name: string;
  value: number;
};

type Task = {
  text: string;
  done: boolean;
};

type Props = {
  score: number;
  role: string;
  skills: Skill[];
  tasks: Task[];
};

export default function ReadinessCard({
  score,
  role,
  skills,
  tasks,
}: Props) {
  return (
    <div className="col-span-6 rounded-2xl border border-white/10 bg-[#0c1328]/70 backdrop-blur-xl p-6 shadow-xl">

      {/* HEADER */}
      <div className="flex justify-between items-start">
        <h2 className="text-white text-lg font-semibold">
          Your Readiness Score
        </h2>

        <div className="text-orange-400 font-bold bg-black/30 px-3 py-1 rounded-lg">
          🔥 52
        </div>
      </div>

      {/* MAIN SECTION */}
      <div className="flex gap-6 mt-6">

        {/* GAUGE */}
        <div className="flex flex-col items-center">

          <ArcGauge value={score} />

          <p className="text-gray-400 text-sm mt-2">
            Readiness Breakdown
          </p>

        </div>

        {/* RIGHT PANEL */}
        <div className="flex-1">

          <p className="text-gray-400 text-sm">
            Target Role:
          </p>

          <p className="text-white font-semibold mb-4">
            {role}
          </p>

          {/* SKILLS */}
          <div className="space-y-2">

            {skills.map((skill) => (
              <div key={skill.name} className="text-sm">

                <div className="flex justify-between text-gray-300">
                  <span>{skill.name}</span>
                  <span>{skill.value}%</span>
                </div>

                <div className="h-2 bg-white/10 rounded mt-1">

                  <div
                    className="h-2 rounded bg-gradient-to-r from-purple-500 to-violet-400"
                    style={{ width: `${skill.value}%` }}
                  />

                </div>

              </div>
            ))}

          </div>

        </div>
      </div>

      {/* WEEK TASKS */}

      <div className="mt-6 border-t border-white/10 pt-4">

        <p className="text-gray-400 text-sm mb-3">
          Week 1
        </p>

        <div className="space-y-2">

          {tasks.map((task, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">

              <span>
                {task.done ? "✔️" : "⬜"}
              </span>

              <span
                className={
                  task.done ? "text-gray-300" : "text-gray-500"
                }
              >
                {task.text}
              </span>

            </div>
          ))}

        </div>

      </div>

    </div>
  );
}