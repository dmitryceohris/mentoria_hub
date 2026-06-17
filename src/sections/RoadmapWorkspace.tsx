import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowClockwise, BookOpen, Flag, Target } from "@phosphor-icons/react";
import { WorkspaceRail } from "./WorkspaceSections";
import type { StudentProfile } from "./AuthFlowSections";
import { courses, opportunities as fallbackOpportunities } from "../data/content";
import type { Opportunity } from "../data/content";
import { clearCachedRoadmap, generateRoadmap } from "../lib/roadmap";
import type { Roadmap, RoadmapProfile, RoadmapStep } from "../lib/roadmap";

type Props = {
  profile: StudentProfile;
  extraOpportunities?: Opportunity[];
  onLogout: () => void;
};

const MAX_DIRECTIONS = 5;

const DIRECTION_OPTIONS = [
  { id: "stem", label: "STEM" },
  { id: "science", label: "Наука и исследования" },
  { id: "programming", label: "Программирование" },
  { id: "business", label: "Бизнес" },
  { id: "finance", label: "Финансы" },
  { id: "social-impact", label: "Социальное влияние" },
  { id: "admissions", label: "Поступление в вуз" },
  { id: "english", label: "Английский / IELTS / SAT" },
];

const typeIcon = {
  course: BookOpen,
  opportunity: Target,
  action: Flag,
} as const;

export function RoadmapWorkspace({ profile, extraOpportunities = [], onLogout }: Props) {
  const opportunityPool = extraOpportunities.length > 0 ? extraOpportunities : fallbackOpportunities;

  const [selected, setSelected] = useState<string[]>(
    () => profile.opportunityPreferences.directions.slice(0, MAX_DIRECTIONS)
  );
  const [phase, setPhase] = useState<"select" | "path">("select");
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [loading, setLoading] = useState(false);

  const roadmapProfile: RoadmapProfile = useMemo(
    () => ({
      name: profile.name,
      grade: profile.grade,
      interests: profile.interests,
      academicDirection: profile.academicDirection,
      directions: selected,
    }),
    [profile, selected]
  );

  function toggle(id: string) {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= MAX_DIRECTIONS) return prev;
      return [...prev, id];
    });
  }

  async function build(force = false) {
    setPhase("path");
    setLoading(true);
    if (force) clearCachedRoadmap(roadmapProfile);
    const result = await generateRoadmap(roadmapProfile, opportunityPool, courses);
    setRoadmap(result);
    setLoading(false);
  }

  function stepLink(step: RoadmapStep): { to?: string; href?: string } {
    if (step.type === "course" && step.refId) return { to: `/courses/${step.refId}` };
    if (step.type === "opportunity" && step.refId) {
      const opp = opportunityPool.find((o) => o.id === step.refId);
      if (opp?.applyUrl) return { href: opp.applyUrl };
    }
    return {};
  }

  return (
    <section className="flow-screen workspace-screen roadmap-screen" aria-labelledby="roadmap-title">
      <WorkspaceRail onLogout={onLogout} />

      <div className="workspace-shell roadmap-shell">
        <div className="workspace-heading roadmap-heading">
          <p className="flow-kicker">Your Mentoria roadmap</p>
          <h1 id="roadmap-title">Путь развития: 9 → 12 класс</h1>
        </div>

        {phase === "select" ? (
          <div className="roadmap-select">
            <p className="roadmap-select-intro">
              Выбери до {MAX_DIRECTIONS} направлений, которые тебе интересны — Mentoria построит маршрут развития под них.
            </p>

            <div className="option-grid roadmap-option-grid" role="group" aria-label="Направления развития">
              {DIRECTION_OPTIONS.map((option) => {
                const isSelected = selected.includes(option.id);
                const disabled = !isSelected && selected.length >= MAX_DIRECTIONS;
                return (
                  <button
                    key={option.id}
                    type="button"
                    className={`option-chip${isSelected ? " option-chip-selected" : ""}`}
                    aria-pressed={isSelected}
                    disabled={disabled}
                    onClick={() => toggle(option.id)}
                  >
                    <span>{option.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="roadmap-select-actions">
              <span className="roadmap-select-count">{selected.length} / {MAX_DIRECTIONS}</span>
              <button
                className="primary-action"
                type="button"
                disabled={selected.length === 0}
                onClick={() => build(true)}
              >
                Построить мой путь →
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="roadmap-path-header">
              <p>{roadmap?.summary ?? "Mentoria подбирает шаги под выбранные направления…"}</p>
              <button
                className="secondary-action compact-action"
                type="button"
                onClick={() => setPhase("select")}
                disabled={loading}
              >
                <ArrowClockwise size={15} weight="bold" />
                <span>Изменить направления</span>
              </button>
            </div>

            {loading ? (
              <div className="roadmap-loading" aria-live="polite">
                <span className="roadmap-pulse" />
                <p>Mentoria строит твой маршрут…</p>
              </div>
            ) : (
              <ol className="roadmap-path" aria-label="Roadmap steps">
                {roadmap?.steps.map((step, i) => {
                  const Icon = typeIcon[step.type];
                  const link = stepLink(step);
                  const side = i % 2 === 0 ? "roadmap-node-left" : "roadmap-node-right";

                  return (
                    <motion.li
                      key={`${step.grade}-${i}`}
                      className={`roadmap-node ${side}`}
                      initial={{ opacity: 0, y: 24, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: i * 0.18, duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
                    >
                      <span className="roadmap-grade" aria-hidden="true">{step.grade}</span>
                      <div className="roadmap-card">
                        <div className="roadmap-card-head">
                          <Icon size={18} weight="duotone" />
                          <span className="roadmap-type">
                            {step.type === "course" ? "Курс" : step.type === "opportunity" ? "Возможность" : "Шаг"}
                          </span>
                        </div>
                        <h3>{step.title}</h3>
                        <p>{step.description}</p>
                        {link.to ? (
                          <Link className="roadmap-card-link" to={link.to}>Открыть курс →</Link>
                        ) : link.href ? (
                          <a className="roadmap-card-link" href={link.href} target="_blank" rel="noreferrer">Подать заявку →</a>
                        ) : null}
                      </div>
                    </motion.li>
                  );
                })}
              </ol>
            )}
          </>
        )}
      </div>
    </section>
  );
}
