/**
 * Skills — confirmed only. No percentages, no unconfirmed tools.
 *
 * `matches` links a skill to project `technologies` (case-insensitive),
 * so the Skills section can show where each skill appears in your work.
 */
export type SkillGroupId = "languages" | "immersive" | "modeling" | "hardware" | "tools";

export type Skill = { name: string; nameAr?: string; matches?: string[] };
export type SkillGroup = { id: SkillGroupId; icon: "code" | "glasses" | "box" | "cpu" | "wrench"; skills: Skill[] };

export const skillGroups: SkillGroup[] = [
  {
    id: "languages",
    icon: "code",
    skills: [
      { name: "C#", matches: ["C#"] },
      { name: "Python" },
      { name: "Java" },
      { name: "JavaScript" },
      { name: "SQL" },
    ],
  },
  {
    id: "immersive",
    icon: "glasses",
    skills: [
      { name: "Unity", matches: ["Unity"] },
      { name: "Unreal Engine", matches: ["Unreal Engine"] },
      { name: "Virtual Reality", nameAr: "الواقع الافتراضي", matches: ["Virtual Reality"] },
      { name: "Augmented Reality", nameAr: "الواقع المعزز" },
      { name: "Mixed Reality", nameAr: "الواقع المختلط", matches: ["Mixed Reality"] },
      { name: "XR Interaction Toolkit" },
    ],
  },
  {
    id: "modeling",
    icon: "box",
    skills: [
      { name: "Autodesk Maya", matches: ["Autodesk Maya"] },
      { name: "3D Modeling", nameAr: "النمذجة ثلاثية الأبعاد", matches: ["3D Modeling"] },
      { name: "Digital Environment Modeling", nameAr: "نمذجة البيئات الرقمية", matches: ["Environment Modeling"] },
    ],
  },
  {
    id: "hardware",
    icon: "cpu",
    skills: [
      { name: "ESP32", matches: ["ESP32"] },
      { name: "Arduino", matches: ["Arduino"] },
      { name: "Sensors", nameAr: "الحساسات", matches: ["Motion Sensors"] },
      { name: "Electronics Prototyping", nameAr: "النماذج الأولية للإلكترونيات", matches: ["Electronics"] },
      {
        name: "Hardware/Software Integration",
        nameAr: "دمج العتاد والبرمجيات",
        matches: ["Hardware/Software Integration", "Hardware Integration"],
      },
    ],
  },
  {
    id: "tools",
    icon: "wrench",
    skills: [{ name: "Git" }, { name: "GitHub" }, { name: "Visual Studio Code" }, { name: "MATLAB" }],
  },
];
