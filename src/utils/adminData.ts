// Mock & Helper Data for Admin Dashboard (University Placement + ATS Analytics Platform)

export interface AdminUserRecord {
  id: string;
  name: string;
  email: string;
  avatar: string;
  college: string;
  department: string;
  year: string;
  cgpa: number;
  atsScore: number;
  skillScore: number;
  internshipCount: number;
  certificateCount: number;
  lastLogin: string;
  status: 'Active' | 'Verified' | 'Pending Verification' | 'Suspended';
  phone?: string;
  targetRole?: string;
  experienceYears?: number;
  skills: string[];
  certifications: string[];
  projects: { name: string; desc: string; tech: string }[];
  internships: { company: string; role: string; duration: string }[];
  salaryPrediction: string;
  learningProgress: number;
  jobMatches: { title: string; company: string; match: number }[];
}

export interface AdminResumeRecord {
  id: string;
  userId: string;
  candidateName: string;
  resumeName: string;
  uploadDate: string;
  atsScore: number;
  version: string;
  improvementStatus: 'AI Rewritten' | 'Optimized' | 'Needs Review' | 'Raw Upload';
  fileType: string;
  fileSize: string;
  previousVersionScore?: number;
  v1Content?: string;
  v2Content?: string;
}

export interface ResumeParsingData {
  id: string;
  candidateName: string;
  email: string;
  phone: string;
  education: string;
  skills: string[];
  projects: string[];
  internships: string[];
  certificates: string[];
  achievements: string[];
  resumeKeywords: string[];
  atsKeywords: string[];
  missingKeywords: string[];
}

export interface AdminJobRecord {
  id: string;
  title: string;
  company: string;
  salary: string;
  location: string;
  applicationsCount: number;
  requiredSkills: string[];
  status: 'Active' | 'Closed' | 'Draft';
  performanceScore: number;
  postedDate: string;
}

export interface SkillGapMetric {
  skill: 'MATLAB' | 'PLC' | 'SCADA' | 'ETAP' | 'AutoCAD' | 'Python' | 'Power BI' | 'Simulink';
  missingCount: number;
  missingPercentage: number;
  avgSalaryIncrease: string;
  demandingCompanies: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  duration: string;
}

export interface CareerPathMetric {
  role: 'Graduate Engineer Trainee' | 'Electrical Design Engineer' | 'Automation Engineer' | 'Power Systems Engineer' | 'Embedded Engineer' | 'IoT Engineer' | 'Data Analyst' | 'Software Engineer';
  avgMatch: number;
  avgSalary: string;
  demandLevel: 'High' | 'Very High' | 'Critical';
  requiredSkills: string[];
  activeVacancies: number;
}

export interface CertificationRecord {
  id: string;
  provider: 'NPTEL' | 'AWS' | 'Coursera' | 'Infosys Springboard' | 'FutureSkills Prime' | 'Google' | 'Microsoft';
  certificateName: string;
  studentName: string;
  college: string;
  uploadDate: string;
  issueDate: string;
  credentialId: string;
  status: 'Verified' | 'Pending Verification' | 'Rejected';
  fileUrl: string;
}

export interface FeedbackRecord {
  id: string;
  category: 'Resume Analysis' | 'Job Recommendations' | 'System Bug' | 'Feature Request' | 'Coaching';
  userName: string;
  userEmail: string;
  date: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Open' | 'In Progress' | 'Resolved';
  message: string;
  resolution?: string;
  adminNotes?: string;
}

export interface ActivityLogRecord {
  id: string;
  timestamp: string;
  type: 'User Login' | 'Resume Upload' | 'Certificate Upload' | 'Internship Added' | 'Job Application' | 'Learning Activity' | 'System Action';
  user: string;
  details: string;
  ipAddress: string;
}

export interface VerificationRequest {
  id: string;
  type: 'Certificate Verification' | 'Resume Review' | 'Profile Correction' | 'Document Approval' | 'Internship Verification';
  candidateName: string;
  candidateEmail: string;
  college: string;
  submittedDate: string;
  priority: 'High' | 'Medium' | 'Low';
  details: string;
  documentName?: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'More Info Requested';
}

export interface AdminNotification {
  id: string;
  type: 'New User' | 'Resume Upload' | 'Certificate Upload' | 'Low ATS Alert' | 'Interview Reminder' | 'Job Deadline' | 'Placement Drive' | 'System Alert';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  priority: 'info' | 'warning' | 'alert' | 'success';
}

// SAMPLE INITIAL DATA - ORIGINAL ACCESSED RECORDS ONLY
export const INITIAL_USERS: AdminUserRecord[] = [
  {
    id: 'usr_mrykkjbwxiuf',
    name: 'Reethika G',
    email: 'reethikagopi5@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    college: 'Sona College of Technology, Salem',
    department: 'Electrical & Electronics Engineering',
    year: '4th Year (2023–2027)',
    cgpa: 8.65,
    atsScore: 88,
    skillScore: 92,
    internshipCount: 2,
    certificateCount: 8,
    lastLogin: 'Active Session (Original DB Access)',
    status: 'Verified',
    phone: '+91 63813 75871',
    targetRole: 'Electrical & Electronics Engineer / Software Developer',
    experienceYears: 2,
    skills: [
      'Digital Electronics',
      'Control Systems',
      'Electrical Machines',
      'Power Systems',
      'Electrical Drives',
      'SQL (DBMS)',
      'Java',
      'Data Structures & Algorithms',
      'Internet of Things (IoT)',
      'Cloud Computing',
      'ESP32 & ESP8266',
      'C / C++',
      'Problem Solving'
    ],
    certifications: [
      'Java Programming Fundamentals - INFOSYS SPRINGBOARD',
      'Data Structures & Algorithms (Java) - INFOSYS SPRINGBOARD',
      'Computational Problem Solving - INFOSYS SPRINGBOARD',
      'Database Management Systems - INFOSYS SPRINGBOARD',
      'Introduction to Internet of Things - IIT Kharagpur NPTEL',
      'Cloud Computing - IIT Kharagpur NPTEL',
      'Sensors and Actuators - IIT Kharagpur NPTEL',
      'Design Thinking – A Primer - IIT Kharagpur NPTEL'
    ],
    projects: [
      {
        name: 'Electro Path – BLE-Based Indoor Object Detection System',
        desc: 'Implemented BLE proximity positioning with ESP32 microcontroller and C algorithms.',
        tech: 'ESP32, BLE, C, RSSI'
      },
      {
        name: 'Smart Voice-Alert Battery Monitoring System',
        desc: 'Designed real-time IoT battery monitoring unit with Wi-Fi voice alerts.',
        tech: 'ESP8266, C, IoT, Wi-Fi'
      }
    ],
    internships: [
      {
        company: 'TANTRANSCO – Salem Operation Circle',
        role: 'Industrial Intern - K.R.Thoppur 400KV Substation',
        duration: 'June 2026'
      },
      {
        company: 'Titan Company Limited, Hosur',
        role: 'Inplant Trainee - Case PPC (Watches Division)',
        duration: 'June 2025'
      }
    ],
    salaryPrediction: '₹8.5 LPA - ₹12.0 LPA',
    learningProgress: 95,
    jobMatches: [
      { title: 'Electrical Design & Software Engineer', company: 'Titan / TANTRANSCO', match: 96 },
      { title: 'Graduate Engineer Trainee - Power Systems', company: 'Schneider Electric', match: 94 },
      { title: 'Automation & SCADA Specialist', company: 'ABB India', match: 91 }
    ]
  },
  {
    id: 'usr_mt5rnq4im76f',
    name: 'Reethika',
    email: 'reethikagopi@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    college: 'Sona College of Technology, Salem',
    department: 'Electrical & Electronics Engineering',
    year: '4th Year (2023–2027)',
    cgpa: 8.65,
    atsScore: 72,
    skillScore: 85,
    internshipCount: 2,
    certificateCount: 8,
    lastLogin: 'Active Session',
    status: 'Verified',
    phone: '+91 63813 75871',
    targetRole: 'Software Engineer',
    experienceYears: 1,
    skills: ['Java', 'SQL (DBMS)', 'Data Structures & Algorithms', 'C / C++', 'IoT'],
    certifications: [
      'Java Programming Fundamentals - INFOSYS SPRINGBOARD',
      'Database Management Systems - INFOSYS SPRINGBOARD'
    ],
    projects: [
      {
        name: 'Smart Battery Monitoring System',
        desc: 'IoT battery tracking node.',
        tech: 'ESP8266, C, Wi-Fi'
      }
    ],
    internships: [
      {
        company: 'TANTRANSCO',
        role: 'Substation Intern',
        duration: 'June 2026'
      }
    ],
    salaryPrediction: '₹7.5 LPA - ₹10.0 LPA',
    learningProgress: 80,
    jobMatches: [
      { title: 'Software Engineer', company: 'Infosys', match: 88 }
    ]
  }
];

export const INITIAL_RESUMES: AdminResumeRecord[] = [
  {
    id: 'res_mrykldglo4hx',
    userId: 'usr_mrykkjbwxiuf',
    candidateName: 'Reethika G',
    resumeName: 'Reethika_G_Resume.pdf',
    uploadDate: '2026-07-24',
    atsScore: 88,
    version: 'v2.0 (Active)',
    improvementStatus: 'AI Rewritten',
    fileType: 'PDF',
    fileSize: '416 KB',
    previousVersionScore: 64,
    v1Content: `REETHIKA G
Email: reethikagopi5@gmail.com
Education: B.E. EEE at Sona College of Technology, Salem
Experience: TANTRANSCO 400KV Substation Intern & Titan Company Trainee.
Skills: Digital Electronics, Control Systems, SQL, C/C++, Java, IoT.`,
    v2Content: `REETHIKA G
Electrical & Electronics Engineer / Software Developer
Location: Salem, Tamil Nadu | Email: reethikagopi5@gmail.com | Phone: 6381375871

SUMMARY
Motivated Electrical and Electronics Engineering student (CGPA: 8.645) with hands-on experience in IoT system design, embedded microcontrollers (ESP32, ESP8266), and high-voltage substation operations. Possesses 8 Infosys Springboard & IIT Kharagpur NPTEL certifications across Java, DSA, DBMS, Cloud Computing, and IoT.

INDUSTRIAL INTERNSHIPS
• TANTRANSCO – Salem Operation Circle: K.R.Thoppur 400KV Substation Industrial Intern (June 2026)
• Titan Company Limited, Hosur: Inplant Trainee - Case PPC Watches Division (June 2025)

PROJECTS
• Electro Path: BLE-Based Indoor Object Detection System (ESP32, BLE, C, RSSI Proximity)
• Smart Voice-Alert Battery Monitoring System (ESP8266, C, IoT, Wi-Fi)`
  }
];

export const INITIAL_PARSED_RESUMES: ResumeParsingData[] = [
  {
    id: 'parse_000',
    candidateName: 'Reethika G',
    email: 'reethikagopi5@gmail.com',
    phone: '6381375871',
    education: 'B.E. Electrical and Electronics Engineering - Sona College of Technology, Salem (2023-2027) | CGPA: 8.645/10',
    skills: ['Digital Electronics', 'Control Systems', 'Electrical Machines', 'Power Systems', 'Electrical Drives', 'SQL (DBMS)', 'Java', 'Data Structures & Algorithms', 'Internet of Things (IoT)', 'Cloud Computing', 'ESP32 & ESP8266', 'C / C++'],
    projects: ['Electro Path – BLE-Based Indoor Object Detection System', 'Smart Voice-Alert Battery Monitoring System'],
    internships: ['TANTRANSCO 400KV Substation Intern - K.R.Thoppur', 'Titan Company Limited - Case PPC Watches Division Trainee'],
    certificates: [
      'Java Programming Fundamentals - INFOSYS SPRINGBOARD',
      'Data Structures & Algorithms - INFOSYS SPRINGBOARD',
      'Database Management Systems - INFOSYS SPRINGBOARD',
      'Introduction to IoT - IIT Kharagpur NPTEL',
      'Cloud Computing - IIT Kharagpur NPTEL',
      'Sensors and Actuators - IIT Kharagpur NPTEL'
    ],
    achievements: ['Qualified – Aptithon 2025', 'Top 30 – Engineers Day Contest 2024', '3rd Prize – Wires & Sparks Circuit Crafters'],
    resumeKeywords: ['ESP32', 'BLE', 'RSSI', '400KV Substation', 'TANTRANSCO', 'SQL', 'Java', 'IoT', 'Control Systems', 'Digital Electronics'],
    atsKeywords: ['Embedded Systems', 'IoT Microcontrollers', 'Substation Safety', 'Database Management', 'Java OOP', 'C++ Programming'],
    missingKeywords: ['MATLAB Simulink', 'PLC SCADA', 'ETAP Load Flow']
  }
];

export const INITIAL_JOBS: AdminJobRecord[] = [
  {
    id: 'job_101',
    title: 'Graduate Engineer Trainee (GET) - Power Systems',
    company: 'Schneider Electric India',
    salary: '₹7.5 LPA - ₹9.0 LPA',
    location: 'Bengaluru / Gurgaon',
    applicationsCount: 142,
    requiredSkills: ['Power Systems', 'ETAP', 'MATLAB', 'Single Line Diagram'],
    status: 'Active',
    performanceScore: 96,
    postedDate: '2026-08-10'
  },
  {
    id: 'job_102',
    title: 'Electrical Design & Simulation Specialist',
    company: 'L&T Technology Services',
    salary: '₹8.0 LPA - ₹11.5 LPA',
    location: 'Chennai / Vadodara',
    applicationsCount: 98,
    requiredSkills: ['AutoCAD Electrical', 'ETAP', 'Relay Coordination', 'Short Circuit Analysis'],
    status: 'Active',
    performanceScore: 92,
    postedDate: '2026-08-12'
  },
  {
    id: 'job_103',
    title: 'Automation & SCADA Engineer',
    company: 'ABB India',
    salary: '₹8.5 LPA - ₹12.0 LPA',
    location: 'Bengaluru / Pune',
    applicationsCount: 115,
    requiredSkills: ['PLC', 'SCADA', 'DCS', 'Siemens TIA Portal', 'Industrial Communications'],
    status: 'Active',
    performanceScore: 94,
    postedDate: '2026-08-08'
  },
  {
    id: 'job_104',
    title: 'Embedded Systems Developer',
    company: 'Bosch India',
    salary: '₹9.0 LPA - ₹13.5 LPA',
    location: 'Coimbatore / Bengaluru',
    applicationsCount: 164,
    requiredSkills: ['Embedded C', 'ARM Cortex-M', 'RTOS', 'CAN Bus', 'Python'],
    status: 'Active',
    performanceScore: 89,
    postedDate: '2026-08-05'
  },
  {
    id: 'job_105',
    title: 'Associate Software Development Engineer',
    company: 'Amazon India',
    salary: '₹18.0 LPA - ₹24.0 LPA',
    location: 'Bengaluru / Hyderabad',
    applicationsCount: 310,
    requiredSkills: ['Java', 'Data Structures', 'System Design', 'AWS', 'SQL'],
    status: 'Active',
    performanceScore: 99,
    postedDate: '2026-08-01'
  }
];

export const SKILL_GAP_METRICS: SkillGapMetric[] = [
  {
    skill: 'MATLAB',
    missingCount: 412,
    missingPercentage: 38,
    avgSalaryIncrease: '+₹2.2 LPA',
    demandingCompanies: ['MathWorks', 'Schneider Electric', 'L&T', 'Bosch', 'General Electric'],
    difficulty: 'Medium',
    duration: '4 Weeks'
  },
  {
    skill: 'PLC',
    missingCount: 520,
    missingPercentage: 48,
    avgSalaryIncrease: '+₹2.5 LPA',
    demandingCompanies: ['ABB India', 'Siemens', 'Rockwell Automation', 'Schneider Electric'],
    difficulty: 'Medium',
    duration: '6 Weeks'
  },
  {
    skill: 'SCADA',
    missingCount: 580,
    missingPercentage: 53,
    avgSalaryIncrease: '+₹2.8 LPA',
    demandingCompanies: ['ABB India', 'Yokogawa', 'Honeywell', 'Siemens', 'L&T Construction'],
    difficulty: 'Medium',
    duration: '5 Weeks'
  },
  {
    skill: 'ETAP',
    missingCount: 390,
    missingPercentage: 36,
    avgSalaryIncrease: '+₹3.2 LPA',
    demandingCompanies: ['L&T Technology Services', 'Schneider Electric', 'Burns & McDonnell', 'AtkinsRealis'],
    difficulty: 'Hard',
    duration: '6 Weeks'
  },
  {
    skill: 'AutoCAD',
    missingCount: 310,
    missingPercentage: 28,
    avgSalaryIncrease: '+₹1.8 LPA',
    demandingCompanies: ['Tata Consulting Engineers', 'L&T', 'Ramboll', 'Jacobs India'],
    difficulty: 'Easy',
    duration: '3 Weeks'
  },
  {
    skill: 'Python',
    missingCount: 240,
    missingPercentage: 22,
    avgSalaryIncrease: '+₹2.0 LPA',
    demandingCompanies: ['Tata Elxsi', 'Bosch', 'Infosys', 'Wipro', 'TCS Research'],
    difficulty: 'Easy',
    duration: '4 Weeks'
  },
  {
    skill: 'Power BI',
    missingCount: 460,
    missingPercentage: 42,
    avgSalaryIncrease: '+₹1.9 LPA',
    demandingCompanies: ['McKinsey', 'Deloitte', 'EY India', 'Accenture Strategy', 'Reliance'],
    difficulty: 'Easy',
    duration: '2 Weeks'
  },
  {
    skill: 'Simulink',
    missingCount: 430,
    missingPercentage: 39,
    avgSalaryIncrease: '+₹2.4 LPA',
    demandingCompanies: ['MathWorks', 'Hero MotoCorp', 'Mahindra Electric', 'Ather Energy'],
    difficulty: 'Hard',
    duration: '5 Weeks'
  }
];

export const CAREER_PATH_METRICS: CareerPathMetric[] = [
  {
    role: 'Graduate Engineer Trainee',
    avgMatch: 88,
    avgSalary: '₹6.5 LPA - ₹8.5 LPA',
    demandLevel: 'Critical',
    requiredSkills: ['Core Engineering Fundamentals', 'CAD / Simulation', 'Problem Solving'],
    activeVacancies: 1240
  },
  {
    role: 'Electrical Design Engineer',
    avgMatch: 82,
    avgSalary: '₹7.5 LPA - ₹11.0 LPA',
    demandLevel: 'High',
    requiredSkills: ['AutoCAD Electrical', 'ETAP', 'Single Line Diagrams', 'Relay Protection'],
    activeVacancies: 680
  },
  {
    role: 'Automation Engineer',
    avgMatch: 85,
    avgSalary: '₹8.0 LPA - ₹12.5 LPA',
    demandLevel: 'Very High',
    requiredSkills: ['PLC Programming', 'SCADA', 'DCS', 'TIA Portal', 'Ladder Logic'],
    activeVacancies: 890
  },
  {
    role: 'Power Systems Engineer',
    avgMatch: 79,
    avgSalary: '₹8.5 LPA - ₹13.0 LPA',
    demandLevel: 'High',
    requiredSkills: ['ETAP', 'MATLAB Simulink', 'Load Flow Analysis', 'Short Circuit Studies'],
    activeVacancies: 540
  },
  {
    role: 'Embedded Engineer',
    avgMatch: 81,
    avgSalary: '₹8.5 LPA - ₹14.0 LPA',
    demandLevel: 'Very High',
    requiredSkills: ['Embedded C', 'ARM Cortex', 'RTOS', 'I2C / SPI / CAN', 'PCB Design'],
    activeVacancies: 920
  },
  {
    role: 'IoT Engineer',
    avgMatch: 76,
    avgSalary: '₹7.2 LPA - ₹11.5 LPA',
    demandLevel: 'High',
    requiredSkills: ['ESP32 / STM32', 'MQTT', 'Python', 'Node-RED', 'Cloud Analytics'],
    activeVacancies: 610
  },
  {
    role: 'Data Analyst',
    avgMatch: 84,
    avgSalary: '₹7.0 LPA - ₹12.0 LPA',
    demandLevel: 'Critical',
    requiredSkills: ['SQL', 'Python / Pandas', 'Power BI / Tableau', 'Statistics'],
    activeVacancies: 1850
  },
  {
    role: 'Software Engineer',
    avgMatch: 90,
    avgSalary: '₹10.0 LPA - ₹22.0 LPA',
    demandLevel: 'Critical',
    requiredSkills: ['Data Structures & Algorithms', 'Java / Python / C++', 'System Design', 'Git'],
    activeVacancies: 3400
  }
];

export const INITIAL_CERTIFICATES: CertificationRecord[] = [
  {
    id: 'cert_001',
    provider: 'Infosys Springboard',
    certificateName: 'Java Programming Fundamentals',
    studentName: 'Reethika G',
    college: 'Sona College of Technology, Salem',
    uploadDate: '2026-07-24',
    issueDate: '2025-11-15',
    credentialId: 'INFY-SPRING-JAVA-88210',
    status: 'Verified',
    fileUrl: '#'
  },
  {
    id: 'cert_002',
    provider: 'Infosys Springboard',
    certificateName: 'Data Structures & Algorithms (Java)',
    studentName: 'Reethika G',
    college: 'Sona College of Technology, Salem',
    uploadDate: '2026-07-24',
    issueDate: '2025-12-10',
    credentialId: 'INFY-SPRING-DSA-99481',
    status: 'Verified',
    fileUrl: '#'
  },
  {
    id: 'cert_003',
    provider: 'NPTEL',
    certificateName: 'Introduction to Internet of Things',
    studentName: 'Reethika G',
    college: 'Sona College of Technology, Salem',
    uploadDate: '2026-07-24',
    issueDate: '2026-04-02',
    credentialId: 'NPTEL26CS88S12903',
    status: 'Verified',
    fileUrl: '#'
  },
  {
    id: 'cert_004',
    provider: 'NPTEL',
    certificateName: 'Cloud Computing',
    studentName: 'Reethika G',
    college: 'Sona College of Technology, Salem',
    uploadDate: '2026-07-24',
    issueDate: '2026-05-20',
    credentialId: 'NPTEL26CS99S20192',
    status: 'Verified',
    fileUrl: '#'
  }
];

export const INITIAL_FEEDBACK: FeedbackRecord[] = [
  {
    id: 'fb_101',
    category: 'Resume Analysis',
    userName: 'Reethika G',
    userEmail: 'reethikagopi5@gmail.com',
    date: '2026-07-24',
    priority: 'High',
    status: 'Resolved',
    message: 'The AI resume analysis accurately highlighted my TANTRANSCO 400KV substation internship and ESP32 IoT projects! Boosted ATS score to 88.',
    resolution: 'Verified ATS parser optimization for Electrical Engineering & Software terms.',
    adminNotes: 'Logged as original user feedback.'
  }
];

export const INITIAL_ACTIVITIES: ActivityLogRecord[] = [
  { id: 'act_01', timestamp: 'Active Session', type: 'User Login', user: 'reethikagopi5@gmail.com', details: 'User authenticated (Original DB Access)', ipAddress: '157.48.91.101' },
  { id: 'act_02', timestamp: '2026-07-24', type: 'Resume Upload', user: 'reethikagopi5@gmail.com', details: 'Uploaded Reethika_G_Resume.pdf (ATS Score: 88)', ipAddress: '157.48.91.101' },
  { id: 'act_03', timestamp: '2026-07-24', type: 'Certificate Upload', user: 'reethikagopi5@gmail.com', details: 'Verified 8 Infosys Springboard & IIT Kharagpur NPTEL Certifications', ipAddress: '157.48.91.101' },
  { id: 'act_04', timestamp: '2026-07-24', type: 'Job Application', user: 'reethikagopi5@gmail.com', details: 'Applied to Titan Company / TANTRANSCO Electrical Design & Software Engineer', ipAddress: '157.48.91.101' }
];

export const INITIAL_REQUESTS: VerificationRequest[] = [
  {
    id: 'req_001',
    type: 'Certificate Verification',
    candidateName: 'Reethika G',
    candidateEmail: 'reethikagopi5@gmail.com',
    college: 'Sona College of Technology, Salem',
    submittedDate: '2026-07-24',
    priority: 'High',
    details: 'Requesting verification for NPTEL Cloud Computing & IoT Certificates',
    documentName: 'Reethika_NPTEL_Certs.pdf',
    status: 'Approved'
  }
];

export const INITIAL_ADMIN_NOTIFICATIONS: AdminNotification[] = [
  { id: 'notif_1', type: 'New User', title: 'Original User Access Active', message: 'Reethika G (reethikagopi5@gmail.com) active session loaded from database', timestamp: 'Active Now', isRead: true, priority: 'success' },
  { id: 'notif_2', type: 'Certificate Upload', title: 'Certifications Verified', message: '8 certifications verified for Reethika G', timestamp: '2026-07-24', isRead: true, priority: 'info' }
];
