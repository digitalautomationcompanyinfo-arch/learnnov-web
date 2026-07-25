// ============================================================
// LearnNov Unified Persistent Cloud & Local Database Engine
// Location: src/services/db-store.ts
// ============================================================

export interface User {
  id: number;
  name: string;
  email: string;
  role_id: number;
  status: 'active' | 'suspended';
  mfa_enabled: boolean;
  avatar: string;
  overrides?: { perm_id: number; type: 'allow' | 'deny' }[];
}

export interface Role {
  id: number;
  name: string;
  code: string;
  description?: string;
  is_system?: boolean;
}

export interface Permission {
  id: number;
  name: string;
  code: string;
  module: string;
  description?: string;
}

export interface Course {
  id: number;
  title: string;
  category: string;
  instructor: string;
  price: number;
  capacity: number;
  enrolled_count: number;
  image: string;
  description: string;
  startDate: string;
}

export interface Enrollment {
  id: number;
  user_id: number;
  userName: string;
  course_id: number;
  courseTitle: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  payment_status: 'unpaid' | 'paid';
  notes?: string;
}

export interface Certificate {
  id: string;
  studentName: string;
  courseTitle: string;
  issueDate: string;
  verifyCode: string;
  grade: string;
  is_specialization?: boolean;
}

export interface AuditLog {
  id: number;
  user: string;
  action: string;
  resource: string;
  ip: string;
  severity: 'info' | 'warning' | 'critical';
  timestamp: string;
}

export interface DiscussionPost {
  id: number;
  author: string;
  authorRole: string;
  avatar: string;
  title: string;
  content: string;
  category: string;
  likes: number;
  replies: number;
  timestamp: string;
}

export interface Exam {
  id: number;
  title: string;
  courseTitle: string;
  durationMinutes: number;
  totalQuestions: number;
  passingScore: number;
  questions: { id: number; question: string; options: string[]; correctIndex: number }[];
}

const STORAGE_KEY = 'learnnov_unified_db_v2';

const INITIAL_ROLES: Role[] = [
  { id: 1, name: 'المدير العام الخارق', code: 'super_admin', description: 'صلاحيات كاملة وغير محدودة لإدارة النظام، المستخدمين، والصلاحيات', is_system: true },
  { id: 2, name: 'مدير التدريب', code: 'course_manager', description: 'إدارة الكورسات، اعتماد التسجيلات، وتنسيق المدربين', is_system: true },
  { id: 3, name: 'مدرب / محاضر', code: 'instructor', description: 'إنشاء الدورات التدريبية الخاصة به ومتابعة الطلاب والتقييمات', is_system: true },
  { id: 4, name: 'طالب / متدرب', code: 'student', description: 'تصفح الدورات التدريبية والتسجيل فيها ومتابعة التعلم', is_system: true },
  { id: 5, name: 'مراقب / زائر', code: 'viewer', description: 'صلاحيات قراءة فقط لاستعراض الإحصائيات العامة', is_system: false }
];

const INITIAL_PERMISSIONS: Permission[] = [
  { id: 1, name: 'عرض قائمة المستخدمين', code: 'users.view', module: 'إدارة المستخدمين' },
  { id: 2, name: 'إنشاء مستخدم جديد', code: 'users.create', module: 'إدارة المستخدمين' },
  { id: 3, name: 'تعديل بيانات المستخدم', code: 'users.edit', module: 'إدارة المستخدمين' },
  { id: 4, name: 'حذف حساب مستخدم', code: 'users.delete', module: 'إدارة المستخدمين' },
  { id: 5, name: 'عرض الأدوار والصلاحيات', code: 'rbac.view', module: 'إدارة الصلاحيات (RBAC)' },
  { id: 6, name: 'تعديل مصفوفة الصلاحيات', code: 'rbac.manage', module: 'إدارة الصلاحيات (RBAC)' },
  { id: 7, name: 'تعيين صلاحيات استثنائية', code: 'rbac.override', module: 'إدارة الصلاحيات (RBAC)' },
  { id: 8, name: 'تصفح قائمة الدورات', code: 'courses.view', module: 'الدورات التدريبية' },
  { id: 9, name: 'إنشاء دورة تدريبية', code: 'courses.create', module: 'الدورات التدريبية' },
  { id: 10, name: 'تعديل بيانات الدورة', code: 'courses.edit', module: 'الدورات التدريبية' },
  { id: 11, name: 'حذف دورة تدريبية', code: 'courses.delete', module: 'الدورات التدريبية' },
  { id: 12, name: 'التسجيل الذاتي في الدورة', code: 'enrollments.register', module: 'تسجيل الدورات' },
  { id: 13, name: 'إدارة ومعالجة طلبات التسجيل', code: 'enrollments.manage', module: 'تسجيل الدورات' },
  { id: 14, name: 'تصدير قائمة الطلاب', code: 'enrollments.export', module: 'تسجيل الدورات' },
  { id: 15, name: 'عرض سجل الأمان والتدقيق', code: 'audit.view', module: 'سجلات الأمان' },
  { id: 16, name: 'عرض تحليلات الذكاء الاصطناعي', code: 'ai.insights', module: 'الذكاء الاصطناعي' },
  { id: 17, name: 'إصدار ومعاينة الشهادات الرقمية', code: 'certificates.issue', module: 'الشهادات المعتمدة' }
];

const INITIAL_ROLE_PERMISSIONS: Record<number, number[]> = {
  1: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
  2: [1, 8, 9, 10, 12, 13, 14, 15, 16, 17],
  3: [8, 9, 10, 13, 14, 17],
  4: [8, 12, 17],
  5: [1, 5, 8]
};

const INITIAL_USERS: User[] = [
  { id: 1, name: 'سارة الأحمد (المدير العام)', email: 'sara.admin@learnnov.com', role_id: 1, status: 'active', mfa_enabled: true, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80', overrides: [] },
  { id: 2, name: 'د. خالد بن محمد (محاضر)', email: 'khaled.instructor@learnnov.com', role_id: 3, status: 'active', mfa_enabled: true, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80', overrides: [] },
  { id: 3, name: 'م. عمر الشمري (مدير تدريب)', email: 'omar.manager@learnnov.com', role_id: 2, status: 'active', mfa_enabled: false, avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&q=80', overrides: [] },
  { id: 4, name: 'منى العتيبي (طالبة)', email: 'mona.student@learnnov.com', role_id: 4, status: 'active', mfa_enabled: false, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80', overrides: [] },
  { id: 5, name: 'فيصل الزهراني (طالب)', email: 'faisal.student@learnnov.com', role_id: 4, status: 'active', mfa_enabled: false, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80', overrides: [] },
  { id: 6, name: 'نورة القحطاني (زائر)', email: 'noura.viewer@learnnov.com', role_id: 5, status: 'suspended', mfa_enabled: false, avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80', overrides: [] }
];

const INITIAL_COURSES: Course[] = [
  { id: 1, title: 'احتراف هندسة الأوامر والذكاء الاصطناعي التوليدي', category: 'الذكاء الاصطناعي', instructor: 'د. خالد بن محمد', price: 450, capacity: 25, enrolled_count: 18, image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80', description: 'دورة عملية مكثفة لتعلم بناء تطبيقات واعدك تقنيات الذكاء الاصطناعي مع نماذج LLMs المتقدمة', startDate: '2026-08-01' },
  { id: 2, title: 'بناء تطبيقات الويب الفائقة السرعة بـ Next.js و React', category: 'هندسة البرمجيات', instructor: 'د. خالد بن محمد', price: 590, capacity: 30, enrolled_count: 24, image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80', description: 'تعلم تصميم وتطوير واجهات المستخدم التفاعلية وإرسال واستقبال البيانات مع التشفير وسرعة فائقة', startDate: '2026-08-10' },
  { id: 3, title: 'أساسيات الأمن السيبراني واختبار الاختراق الأخلاقي', category: 'الأمن السيبراني', instructor: 'د. خالد بن محمد', price: 620, capacity: 20, enrolled_count: 20, image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80', description: 'دورة تدريبية شاملة تغطي أساسيات حماية الشبكات والثغرات الأمنية والأمن الرقمي', startDate: '2026-08-15' },
  { id: 4, title: 'إدارة المشاريع الرقمية والتحول البرمجي (Agile & Scrum)', category: 'إدارة التقنية', instructor: 'م. عمر الشمري', price: 350, capacity: 40, enrolled_count: 12, image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80', description: 'دورة إدارية متخصصة لقيادة فرق العمل والتحول الرقمي بكفاءة فائقة', startDate: '2026-09-01' }
];

const INITIAL_ENROLLMENTS: Enrollment[] = [
  { id: 1, user_id: 4, userName: 'منى العتيبي', course_id: 1, courseTitle: 'احتراف هندسة الأوامر والذكاء الاصطناعي', date: '2026-07-20', status: 'approved', payment_status: 'paid' },
  { id: 2, user_id: 4, userName: 'منى العتيبي', course_id: 2, courseTitle: 'بناء تطبيقات الويب بـ Next.js', date: '2026-07-23', status: 'pending', payment_status: 'unpaid' },
  { id: 3, user_id: 5, userName: 'فيصل الزهراني', course_id: 1, courseTitle: 'احتراف هندسة الأوامر والذكاء الاصطناعي', date: '2026-07-21', status: 'approved', payment_status: 'paid' },
  { id: 4, user_id: 5, userName: 'فيصل الزهراني', course_id: 3, courseTitle: 'أساسيات الأمن السيبراني واختبار الاختراق', date: '2026-07-24', status: 'pending', payment_status: 'unpaid' }
];

const INITIAL_CERTIFICATES: Certificate[] = [
  { id: 'CERT-9821', studentName: 'منى العتيبي', courseTitle: 'احتراف هندسة الأوامر والذكاء الاصطناعي', issueDate: '2026-07-20', verifyCode: 'CERT-9821', grade: 'امتياز مرتفع (98%)' },
  { id: 'CERT-9822', studentName: 'فيصل الزهراني', courseTitle: 'احتراف هندسة الأوامر والذكاء الاصطناعي', issueDate: '2026-07-21', verifyCode: 'CERT-9822', grade: 'ممتاز (94%)' }
];

const INITIAL_AUDIT_LOGS: AuditLog[] = [
  { id: 1, user: 'سارة الأحمد', action: 'تحديث مصفوفة الصلاحيات', resource: 'RBAC Matrix', ip: '192.168.1.10', severity: 'info', timestamp: '2026-07-24 09:30' },
  { id: 2, user: 'منى العتيبي', action: 'تقديم طلب تسجيل جديد', resource: 'دورة Next.js', ip: '185.220.101.5', severity: 'info', timestamp: '2026-07-24 09:15' },
  { id: 3, user: 'سارة الأحمد', action: 'تجميد حساب زائر', resource: 'نورة القحطاني', ip: '192.168.1.10', severity: 'critical', timestamp: '2026-07-24 08:45' }
];

const INITIAL_DISCUSSIONS: DiscussionPost[] = [
  { id: 1, author: 'د. خالد بن محمد', authorRole: 'محاضر خبير', avatar: '👨‍🏫', title: 'كيف تختار النموذج المناسب للمشروع (GPT-4o vs Claude 3.5 Sonnet)؟', content: 'في هذا التساؤل نناقش المعايير الأساسية لاختيار النماذج التوليدية بناءً على زمن الاستجابة، السعر، ودقة الكود.', category: 'الذكاء الاصطناعي', likes: 18, replies: 6, timestamp: 'منذ ساعتين' },
  { id: 2, author: 'منى العتيبي', authorRole: 'طالبة متميزة', avatar: '👩‍🎓', title: 'أفضل الممارسات لربط Supabase مع Next.js 15 App Router', content: 'ما هي الطريقة المثلى لمعالجة الجلسات والـ RLS في مكونات Server Components؟ شاركوني تجاربكم!', category: 'هندسة البرمجيات', likes: 12, replies: 4, timestamp: 'منذ 5 ساعات' }
];

const INITIAL_EXAMS: Exam[] = [
  {
    id: 1,
    title: 'الاختبار التأهيلي في هندسة الأوامر والنماذج التوليدية',
    courseTitle: 'احتراف هندسة الأوامر والذكاء الاصطناعي',
    durationMinutes: 15,
    totalQuestions: 3,
    passingScore: 70,
    questions: [
      { id: 1, question: 'ما هو مفهوم Few-Shot Prompting في التعامل مع النماذج اللغوية؟', options: ['إرسال طلب بدون أي أمثلة', 'تقديم مجموعة أمثلة توضيحية داخل الأمر لنفس المهمة', 'إجبار النموذج على التوقف عن التفكير'], correctIndex: 1 },
      { id: 2, question: 'أي من التقنيات التالية تساعد على منع الهلوسة في الإجابات؟', options: ['Retrieval-Augmented Generation (RAG)', 'زيادة درجة الحرارة Temperature إلى 2.0', 'حذف التعليمات الإرشادية'], correctIndex: 0 },
      { id: 3, question: 'ما المقصد بـ System Prompt في النماذج الذكية؟', options: ['رسالة الخطأ التي يرجعها الخادم', 'التعليمات الأساسية الموجهة لشخصية ودور النموذج الذكي', 'رابط الدفع الخاص بالخدمة'], correctIndex: 1 }
    ]
  }
];

export interface GoogleWorkspaceConfig {
  clientId: string;
  clientSecret: string;
  domain: string;
  serviceAccountEmail: string;
  calendarSyncEnabled: boolean;
  classroomSyncEnabled: boolean;
  status: 'connected' | 'disconnected';
}

export interface YouTubeConfig {
  apiKey: string;
  channelId: string;
  playlistId: string;
  autoEmbedEnabled: boolean;
  status: 'connected' | 'disconnected';
}

const INITIAL_GOOGLE_CONFIG: GoogleWorkspaceConfig = {
  clientId: '1098234710923-learnnov-web.apps.googleusercontent.com',
  clientSecret: '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6',
  domain: 'learnnov.com',
  serviceAccountEmail: 'workspace-service@learnnov.iam.gserviceaccount.com',
  calendarSyncEnabled: true,
  classroomSyncEnabled: true,
  status: 'connected'
};

const INITIAL_YOUTUBE_CONFIG: YouTubeConfig = {
  apiKey: 'AIzaSyLearnNov_YouTube_Data_v3_Key_2026',
  channelId: 'UC_LearnNov_Academic_Cloud_Official',
  playlistId: 'PL_LearnNov_AI_and_Cybersecurity_Lectures',
  autoEmbedEnabled: true,
  status: 'connected'
};

export interface DBStore {
  roles: Role[];
  permissions: Permission[];
  rolePermissions: Record<number, number[]>;
  users: User[];
  courses: Course[];
  enrollments: Enrollment[];
  certificates: Certificate[];
  auditLogs: AuditLog[];
  discussions: DiscussionPost[];
  exams: Exam[];
  googleConfig?: GoogleWorkspaceConfig;
  youtubeConfig?: YouTubeConfig;
}

export function loadDatabase(): DBStore {
  if (typeof window === 'undefined') {
    return {
      roles: INITIAL_ROLES,
      permissions: INITIAL_PERMISSIONS,
      rolePermissions: INITIAL_ROLE_PERMISSIONS,
      users: INITIAL_USERS,
      courses: INITIAL_COURSES,
      enrollments: INITIAL_ENROLLMENTS,
      certificates: INITIAL_CERTIFICATES,
      auditLogs: INITIAL_AUDIT_LOGS,
      discussions: INITIAL_DISCUSSIONS,
      exams: INITIAL_EXAMS,
      googleConfig: INITIAL_GOOGLE_CONFIG,
      youtubeConfig: INITIAL_YOUTUBE_CONFIG
    };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initialStore: DBStore = {
        roles: INITIAL_ROLES,
        permissions: INITIAL_PERMISSIONS,
        rolePermissions: INITIAL_ROLE_PERMISSIONS,
        users: INITIAL_USERS,
        courses: INITIAL_COURSES,
        enrollments: INITIAL_ENROLLMENTS,
        certificates: INITIAL_CERTIFICATES,
        auditLogs: INITIAL_AUDIT_LOGS,
        discussions: INITIAL_DISCUSSIONS,
        exams: INITIAL_EXAMS,
        googleConfig: INITIAL_GOOGLE_CONFIG,
        youtubeConfig: INITIAL_YOUTUBE_CONFIG
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialStore));
      return initialStore;
    }
    const parsed = JSON.parse(raw);
    if (!parsed.googleConfig) parsed.googleConfig = INITIAL_GOOGLE_CONFIG;
    if (!parsed.youtubeConfig) parsed.youtubeConfig = INITIAL_YOUTUBE_CONFIG;
    return parsed;
  } catch {
    return {
      roles: INITIAL_ROLES,
      permissions: INITIAL_PERMISSIONS,
      rolePermissions: INITIAL_ROLE_PERMISSIONS,
      users: INITIAL_USERS,
      courses: INITIAL_COURSES,
      enrollments: INITIAL_ENROLLMENTS,
      certificates: INITIAL_CERTIFICATES,
      auditLogs: INITIAL_AUDIT_LOGS,
      discussions: INITIAL_DISCUSSIONS,
      exams: INITIAL_EXAMS,
      googleConfig: INITIAL_GOOGLE_CONFIG,
      youtubeConfig: INITIAL_YOUTUBE_CONFIG
    };
  }
}

export function saveDatabase(store: DBStore): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  }
}
