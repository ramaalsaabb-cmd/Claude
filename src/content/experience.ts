/**
 * Education, experience & achievements timeline (source: CV).
 *
 * Entries are grouped automatically by `type` into:
 *   Education · Awards · Certificates & Training · Leadership & Activities · Experience
 * Within a group they appear in the order listed (newest first).
 * Add future COOP placements, internships, roles, hackathons, bootcamps,
 * certifications, competitions and awards here — real, verified info only.
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
  | "certification"
  | "leadership";

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
  // ---------------- Education ----------------
  {
    id: "pnu-it",
    type: "education",
    title: "Bachelor of Information Technology",
    titleAr: "بكالوريوس تقنية المعلومات",
    organization: "Princess Nourah bint Abdulrahman University · Riyadh",
    organizationAr: "جامعة الأميرة نورة بنت عبدالرحمن · الرياض",
    period: "08/2023 – Present · Expected graduation June 2027",
    periodAr: "٠٨/٢٠٢٣ – حتى الآن · التخرج المتوقع يونيو ٢٠٢٧",
    description:
      "Graduation project: PersonaShield AI — an AI-powered cybersecurity platform focused on personalized security awareness and digital threat detection.",
    descriptionAr:
      "مشروع التخرج: PersonaShield AI — منصة أمن سيبراني مدعومة بالذكاء الاصطناعي تركّز على التوعية الأمنية المخصّصة ورصد التهديدات الرقمية.",
  },

  // ---------------- Awards ----------------
  {
    id: "defensthon-robotics",
    type: "award",
    title: "3rd Place — Robotics Track",
    titleAr: "المركز الثالث — مسار الروبوتات",
    organization: "Defensthon · Team THABAT",
    organizationAr: "Defensthon · فريق ثبات",
    period: "05/2026",
    periodAr: "٠٥/٢٠٢٦",
    description: "Awarded for THABAT, a mixed-reality bomb-disposal training simulator with an ESP32 + BNO055 haptic glove.",
    descriptionAr: "عن مشروع ثبات، محاكي تدريبي بالواقع المختلط لتفكيك القنابل مع قفاز لمسي (ESP32 + BNO055).",
    project: "thabat",
  },
  {
    id: "pnu-appreciation",
    type: "award",
    title: "Certificate of Appreciation — Extracurricular Activities",
    titleAr: "شهادة شكر وتقدير — الأنشطة اللاصفية",
    organization: "Faculty of Computer & Information Sciences, PNU",
    organizationAr: "كلية علوم الحاسب والمعلومات، جامعة الأميرة نورة",
    period: "06/2026",
    periodAr: "٠٦/٢٠٢٦",
  },

  // ---------------- Certificates & Training ----------------
  {
    id: "tuwaiq-vr-bootcamp",
    type: "bootcamp",
    title: "VR Development & Emerging Technologies Bootcamp",
    titleAr: "معسكر تطوير الواقع الافتراضي والتقنيات الناشئة",
    organization: "Tuwaiq Academy · 160 training hours",
    organizationAr: "أكاديمية طويق · ١٦٠ ساعة تدريبية",
    period: "2026",
    periodAr: "٢٠٢٦",
  },
  {
    id: "tuwaiq-mechatronics-bootcamp",
    type: "bootcamp",
    title: "Mechatronics Engineering Fundamentals Bootcamp",
    titleAr: "معسكر أساسيات هندسة الميكاترونكس",
    organization: "Tuwaiq Academy · 100 training hours",
    organizationAr: "أكاديمية طويق · ١٠٠ ساعة تدريبية",
    period: "2026",
    periodAr: "٢٠٢٦",
  },
  {
    id: "ccna-itn",
    type: "certification",
    title: "CCNA: Introduction to Networks",
    organization: "Cisco",
    period: "2025",
    periodAr: "٢٠٢٥",
  },
  {
    id: "oracle-java",
    type: "certification",
    title: "Oracle Java Foundations",
    organization: "Oracle",
    period: "2024",
    periodAr: "٢٠٢٤",
  },
  {
    id: "cisco-junior-cyber",
    type: "certification",
    title: "Junior Cybersecurity Analyst Career Path",
    organization: "Cisco Networking Academy",
    period: "2024",
    periodAr: "٢٠٢٤",
  },

];
