/**
 * Education, experience & achievements timeline.
 *
 * Add future COOP placements, internships, roles, hackathons, bootcamps,
 * certifications, competitions and awards here. Entries appear in the order
 * listed. Only add real, verified information — leave `period` out if unsure.
 */
export type TimelineType =
  | "education"
  | "award"
  | "competition"
  | "internship"
  | "coop"
  | "role"
  | "hackathon"
  | "bootcamp"
  | "certification";

export type TimelineEntry = {
  id: string;
  type: TimelineType;
  title: string;
  titleAr?: string;
  organization?: string;
  organizationAr?: string;
  period?: string;
  periodAr?: string;
  description?: string;
  descriptionAr?: string;
  /** Slug of a related project, e.g. "thabat". */
  project?: string;
  url?: string;
};

export const timeline: TimelineEntry[] = [
  {
    id: "pnu-it",
    type: "education",
    title: "Bachelor's in Information Technology",
    titleAr: "بكالوريوس تقنية المعلومات",
    organization: "Princess Nourah bint Abdulrahman University",
    organizationAr: "جامعة الأميرة نورة بنت عبدالرحمن",
    period: "Expected graduation: June 2027",
    periodAr: "التخرج المتوقع: يونيو ٢٠٢٧",
  },
  {
    id: "defensthon-robotics",
    type: "award",
    title: "Third Place — Robotics Track",
    titleAr: "المركز الثالث — مسار الروبوتات",
    organization: "Defensthon",
    organizationAr: "Defensthon",
    description: "Awarded for THABAT, a mixed-reality bomb-disposal training experience with a physical haptic glove.",
    descriptionAr: "عن مشروع ثبات، تجربة تدريبية بالواقع المختلط لتفكيك القنابل مع قفاز لمسي حقيقي.",
    project: "thabat",
  },
];
