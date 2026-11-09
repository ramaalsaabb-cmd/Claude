/**
 * Skills — confirmed only. No percentages, no unconfirmed tools.
 *
 * `matches` links a skill to project `technologies` (case-insensitive),
 * so the Skills section can show where each skill appears in your work.
 */
export type SkillGroupId = "languages" | "immersive" | "modeling" | "hardware" | "cyber" | "tools";

export type Skill = { name: string; nameAr?: string; matches?: string[] };
export type SkillGroup = { id: SkillGroupId; icon: "code" | "glasses" | "box" | "cpu" | "shield" | "wrench"; skills: Skill[] };

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
      { name: "Object-Oriented Programming", nameAr: "البرمجة كائنية التوجه" },
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
      { name: "Meta Quest", matches: ["Meta Quest", "Meta Quest 3"] },
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
      { name: "BNO055", matches: ["BNO055"] },
      { name: "Microcontrollers", nameAr: "المتحكمات الدقيقة", matches: ["ESP32", "Arduino"] },
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
    id: "cyber",
    icon: "shield",
    skills: [
      { name: "Cybersecurity Fundamentals", nameAr: "أساسيات الأمن السيبراني" },
      { name: "Computer Networking", nameAr: "شبكات الحاسب" },
      { name: "CCNA" },
      { name: "Security Awareness", nameAr: "التوعية الأمنية", matches: ["Security Awareness"] },
    ],
  },
  {
    id: "tools",
    icon: "wrench",
    skills: [{ name: "Git" }, { name: "GitHub" }, { name: "Visual Studio Code" }, { name: "MATLAB" }],
  },
];
