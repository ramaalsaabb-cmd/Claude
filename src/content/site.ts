/**
 * Personal information & links.
 *
 * IMPORTANT: leave a link as `null` until you have the real value.
 * Unconfigured links are hidden automatically — nothing broken is shown.
 */
export const site = {
  name: "Rama Alsaab",
  nameAr: "راما الصعب",
  title: "Creative Developer",
  titleAr: "مطوّرة إبداعية",

  location: "Riyadh, Saudi Arabia",
  locationAr: "الرياض، المملكة العربية السعودية",

  university: "Princess Nourah bint Abdulrahman University",
  universityAr: "جامعة الأميرة نورة بنت عبدالرحمن",
  degree: "Bachelor's in Information Technology",
  degreeAr: "بكالوريوس تقنية المعلومات",
  graduation: "June 2027",
  graduationAr: "يونيو ٢٠٢٧",
  studyStart: "08/2023",
  graduationProject: "PersonaShield AI — an AI-powered cybersecurity platform focused on personalized security awareness and digital threat detection.",
  graduationProjectAr: "PersonaShield AI — منصة أمن سيبراني مدعومة بالذكاء الاصطناعي تركّز على التوعية الأمنية المخصّصة ورصد التهديدات الرقمية.",

  /** Shown in the hero and contact section. Set to null to hide. */
  availability: "Open to co-op opportunities" as string | null,
  availabilityAr: "متاحة لفرص التدريب التعاوني" as string | null,

  languages: ["Arabic — Native / Bilingual", "English — Proficient"],
  languagesAr: ["العربية — اللغة الأم", "الإنجليزية — متقدّم"],

  bio: [
    "I'm an Information Technology student at Princess Nourah bint Abdulrahman University and a creative developer. I build interactive experiences that bring software, hardware, and imagination together.",
    "My work moves between immersive technologies, game development, embedded systems, and 3D modeling — a virtual scene connected to a physical prototype, a sensor that changes what happens on screen, a model that becomes part of a world. That in-between space is what I enjoy exploring most.",
    "Alongside building, I've trained in cybersecurity and networking, and I'm currently looking for a co-op opportunity where I can apply these skills to real-world projects.",
  ],
  bioAr: [
    "أنا طالبة تقنية معلومات في جامعة الأميرة نورة بنت عبدالرحمن ومطوّرة إبداعية. أبني تجارب تفاعلية تجمع بين البرمجيات والعتاد والخيال.",
    "تتنقل أعمالي بين التقنيات الغامرة وتطوير الألعاب والأنظمة المدمجة والنمذجة ثلاثية الأبعاد — مشهد افتراضي متصل بنموذج أولي حقيقي، أو حسّاس يغيّر ما يحدث على الشاشة، أو نموذج يصبح جزءاً من عالم كامل. هذه المساحة بين التخصصات هي أكثر ما أستمتع باستكشافه.",
    "إلى جانب البناء، تدرّبت في مجالي الأمن السيبراني والشبكات، وأبحث حالياً عن فرصة تدريب تعاوني أطبّق فيها هذه المهارات على مشاريع حقيقية.",
  ],

  interests: [
    "Virtual Reality",
    "Augmented Reality",
    "Mixed Reality",
    "Game Development",
    "Interactive 3D Environments",
    "Hardware Prototyping",
    "Creative Programming",
  ],
  interestsAr: [
    "الواقع الافتراضي",
    "الواقع المعزز",
    "الواقع المختلط",
    "تطوير الألعاب",
    "البيئات التفاعلية ثلاثية الأبعاد",
    "النماذج الأولية للعتاد",
    "البرمجة الإبداعية",
  ],

  background: [
    "Unity",
    "Unreal Engine",
    "Autodesk Maya",
    "C#",
    "Python",
    "Java",
    "JavaScript",
    "SQL",
    "ESP32",
    "Arduino",
    "Electronics & Sensors",
    "Cybersecurity & Networking",
    "Hardware/Software Integration",
  ],

  /** Contact & professional links — set real values to show them. */
  links: {
    email: "ramaalsaabb@gmail.com" as string | null,
    linkedin: "https://www.linkedin.com/in/rama-alsaab-50b152357/" as string | null,
    github: "https://github.com/ramaalsaabb-cmd" as string | null,
    /** Not shown on the site by default (privacy). Set e.g. "0533174556" to show a call link. */
    phone: null as string | null,
  },

  /**
   * CV file path inside /public. The download button only appears
   * when this file actually exists, e.g. place it at public/cv/Rama-Alsaab-CV.pdf
   */
  cvPath: "/cv/Rama-Alsaab-CV.pdf",

  /**
   * Optional personal photo inside /public (e.g. "/about/rama.jpg").
   * Leave null to keep the illustrated composition.
   */
  photo: null as string | null,
};

export type Site = typeof site;
