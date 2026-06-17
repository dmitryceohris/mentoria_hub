import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowClockwise, BookOpen, Flag, Target } from "@phosphor-icons/react";
import { WorkspaceRail } from "./WorkspaceSections";
import type { StudentProfile } from "./AuthFlowSections";
import { courses, opportunities as fallbackOpportunities } from "../data/content";
import type { Opportunity } from "../data/content";
import {
  clearCachedRoadmap,
  generateRoadmap,
} from "../lib/roadmap";
import type { Roadmap, RoadmapProfile, RoadmapStep } from "../lib/roadmap";

type Props = {
  profile: StudentProfile;
  extraOpportunities?: Opportunity[];
  onLogout: () => void;
};

const typeIcon = {
  course: BookOpen,
  opportunity: Target,
  action: Flag,
} as const;

function toRoadmapProfile(profile: StudentProfile): RoadmapProfile {
  return {
    name: profile.name,
    grade: profile.grade,
    interests: profile.interests,
    academicDirection: profile.academicDirection,
    directions: profile.opportunityPreferences.directions,
  };
}

export function RoadmapWorkspace({ profile, extraOpportunities = [], onLogout }: Props) {
  const opportunityPool = extraOpportunities.length > 0 ? extraOpportunities : fallbackOpportunities;
  const roadmapProfile = useMemo(() => toRoadmapProfile(profile), [profile]);

  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [loading, setLoading] = useState(true);

  async function build(force = false) {
    setLoading(true);
    if (force) clearCachedRoadmap(roadmapProfile);
    const result = await generateRoadmap(roadmapProfile, opportunityPool, courses);
    setRoadmap(result);
    setLoading(false);
  }

  useEffect(() => {
    build();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile.id]);

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
          <p>{roadmap?.summary ?? "Mentoria строит твой персональный маршрут на основе интересов и реальных возможностей."}</p>
          <button className="secondary-action compact-action" type="button" onClick={() => build(true)} disabled={loading}>
            <ArrowClockwise size={15} weight="bold" />
            <span>{loading ? "Строю…" : "Перестроить"}</span>
          </button>
        </div>

        {loading ? (
          <div className="roadmap-loading" aria-live="polite">
            <span className="roadmap-pulse" />
            <p>Mentoria подбирает шаги под твой профиль…</p>
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
                      <span className="roadmap-type">{step.type === "course" ? "Курс" : step.type === "opportunity" ? "Возможность" : "Шаг"}</span>
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
      </div>
    </section>
  );
}
