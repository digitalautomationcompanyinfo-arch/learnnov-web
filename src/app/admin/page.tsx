'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface User {
  id: number;
  name: string;
  email: string;
  role_id: number;
  status: string;
  mfa_enabled: boolean;
  avatar: string;
  overrides?: { perm_id: number; type: 'allow' | 'deny' }[];
}

interface Role {
  id: number;
  name: string;
  code: string;
  badgeClass: string;
}

interface Permission {
  id: number;
  name: string;
  code: string;
  module: string;
}

interface Course {
  id: number;
  title: string;
  category_id: number;
  instructor: string;
  price: number;
  capacity: number;
  enrolled_count: number;
  image: string;
  description: string;
  startDate: string;
}

interface Enrollment {
  id: number;
  user_id: number;
  userName: string;
  course_id: number;
  courseTitle: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  payment_status: 'unpaid' | 'paid';
}

interface Certificate {
  id: string;
  studentName: string;
  courseTitle: string;
  issueDate: string;
  verifyCode: string;
}

interface AuditLog {
  id: number;
  user: string;
  action: string;
  resource: string;
  ip: string;
  severity: 'info' | 'warning' | 'critical';
  timestamp: string;
}

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'enrollments' | 'certificates' | 'rbac' | 'users' | 'dbExplorer' | 'audit'>('overview');

  const [roles, setRoles] = useState<Role[]>([
    { id: 1, name: 'المدير العام الخارق', code: 'super_admin', badgeClass: 'badge-danger' },
    { id: 2, name: 'مدير التدريب', code: 'course_manager', badgeClass: 'badge-warning' },
    { id: 3, name: 'مدرب / محاضر', code: 'instructor', badgeClass: 'badge-info' },
    { id: 4, name: 'طالب / متدرب', code: 'student', badgeClass: 'badge-success' },
    { id: 5, name: 'مراقب / زائر', code: 'viewer', badgeClass: 'badge-info' }
  ]);

  const [permissions] = useState<Permission[]>([
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
  ]);

  const [rolePermissions, setRolePermissions] = useState<Record<number, number[]>>({
    1: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
    2: [1, 8, 9, 10, 12, 13, 14, 15, 16, 17],
    3: [8, 9, 10, 13, 14, 17],
    4: [8, 12, 17],
    5: [1, 5, 8]
  });

  const [users, setUsers] = useState<User[]>([
    { id: 1, name: 'سارة الأحمد (المدير العام)', email: 'sara.admin@learnnov.com', role_id: 1, status: 'active', mfa_enabled: true, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80', overrides: [] },
    { id: 2, name: 'د. خالد بن محمد (محاضر)', email: 'khaled.instructor@learnnov.com', role_id: 3, status: 'active', mfa_enabled: true, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80', overrides: [] },
    { id: 3, name: 'م. عمر الشمري (مدير تدريب)', email: 'omar.manager@learnnov.com', role_id: 2, status: 'active', mfa_enabled: false, avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&q=80', overrides: [] },
    { id: 4, name: 'منى العتيبي (طالبة)', email: 'mona.student@learnnov.com', role_id: 4, status: 'active', mfa_enabled: false, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80', overrides: [] },
    { id: 5, name: 'فيصل الزهراني (طالب)', email: 'faisal.student@learnnov.com', role_id: 4, status: 'active', mfa_enabled: false, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80', overrides: [] },
    { id: 6, name: 'نورة القحطاني (زائر)', email: 'noura.viewer@learnnov.com', role_id: 5, status: 'suspended', mfa_enabled: false, avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80', overrides: [] }
  ]);

  const [activeUserId, setActiveUserId] = useState<number>(1);
  const [courses, setCourses] = useState<Course[]>([
    { id: 1, title: 'احتراف هندسة الأوامر والذكاء الاصطناعي التوليدي', category_id: 1, instructor: 'د. خالد بن محمد', price: 450, capacity: 25, enrolled_count: 18, image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80', description: 'دورة عملية مكثفة لتعلم بناء تطبيقات واعدك تقنيات الذكاء الاصطناعي مع نماذج LLMs', startDate: '2026-08-01' },
    { id: 2, title: 'بناء تطبيقات الويب الفائقة السرعة بـ Next.js و React', category_id: 2, instructor: 'د. خالد بن محمد', price: 590, capacity: 30, enrolled_count: 24, image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80', description: 'تعلم تصميم وتطوير واجهات المستخدم التفاعلية وإرسال واستقبال البيانات مع التشفير', startDate: '2026-08-10' },
    { id: 3, title: 'أساسيات الأمن السيبراني واختبار الاختراق الأخلاقي', category_id: 3, instructor: 'د. خالد بن محمد', price: 620, capacity: 20, enrolled_count: 20, image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80', description: 'دورة تدريبية شاملة تغطي أساسيات حماية الشبكات والثغرات الأمنية والأمن الرقمي', startDate: '2026-08-15' },
    { id: 4, title: 'إدارة المشاريع الرقمية والتحول البرمجي (Agile & Scrum)', category_id: 4, instructor: 'م. عمر الشمري', price: 350, capacity: 40, enrolled_count: 12, image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80', description: 'دورة إدارية متخصصة لقيادة فرق العمل والتحول الرقمي بكفاءة فائقة', startDate: '2026-09-01' }
  ]);

  const [enrollments, setEnrollments] = useState<Enrollment[]>([
    { id: 1, user_id: 4, userName: 'منى العتيبي', course_id: 1, courseTitle: 'احتراف هندسة الأوامر والذكاء الاصطناعي', date: '2026-07-20', status: 'approved', payment_status: 'paid' },
    { id: 2, user_id: 4, userName: 'منى العتيبي', course_id: 2, courseTitle: 'بناء تطبيقات الويب بـ Next.js', date: '2026-07-23', status: 'pending', payment_status: 'unpaid' },
    { id: 3, user_id: 5, userName: 'فيصل الزهراني', course_id: 1, courseTitle: 'احتراف هندسة الأوامر والذكاء الاصطناعي', date: '2026-07-21', status: 'approved', payment_status: 'paid' },
    { id: 4, user_id: 5, userName: 'فيصل الزهراني', course_id: 3, courseTitle: 'أساسيات الأمن السيبراني واختبار الاختراق', date: '2026-07-24', status: 'pending', payment_status: 'unpaid' }
  ]);

  const [certificates, setCertificates] = useState<Certificate[]>([
    { id: 'CERT-9821', studentName: 'منى العتيبي', courseTitle: 'احتراف هندسة الأوامر والذكاء الاصطناعي', issueDate: '2026-07-22', verifyCode: 'CERT-9821' },
    { id: 'CERT-9822', studentName: 'فيصل الزهراني', courseTitle: 'احتراف هندسة الأوامر والذكاء الاصطناعي', issueDate: '2026-07-23', verifyCode: 'CERT-9822' }
  ]);

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    { id: 1, user: 'سارة الأحمد', action: 'تحديث الصلاحية', resource: 'RBAC Matrix', ip: '192.168.1.10', severity: 'info', timestamp: '2026-07-24 09:30' },
    { id: 2, user: 'منى العتيبي', action: 'طلب تسجيل جديد', resource: 'دورة Next.js', ip: '185.220.101.5', severity: 'info', timestamp: '2026-07-24 09:15' },
    { id: 3, user: 'سارة الأحمد', action: 'تجميد حساب', resource: 'نورة القحطاني', ip: '192.168.1.10', severity: 'critical', timestamp: '2026-07-24 08:45' }
  ]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedSqlTable, setSelectedSqlTable] = useState<string>('users');

  const activeUser = users.find(u => u.id === activeUserId) || users[0];
  const activeRole = roles.find(r => r.id === activeUser.role_id) || roles[0];

  function showToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  }

  function userHasPermission(code: string): boolean {
    if (activeRole.code === 'super_admin') return true;
    const perm = permissions.find(p => p.code === code);
    if (!perm) return false;
    if (activeUser.overrides) {
      const ov = activeUser.overrides.find(o => o.perm_id === perm.id);
      if (ov) return ov.type === 'allow';
    }
    return (rolePermissions[activeRole.id] || []).includes(perm.id);
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0B0F19', color: '#F9FAFB', fontFamily: 'Cairo, sans-serif', padding: '1.5rem', direction: 'rtl' }}>
      
      {/* Toast Alert */}
      {toastMessage && (
        <div style={{ position: 'fixed', bottom: '20px', left: '20px', backgroundColor: '#111827', border: '1px solid #10B981', borderLeft: '4px solid #10B981', color: '#FFF', padding: '0.85rem 1.25rem', borderRadius: '8px', zIndex: 999 }}>
          ✅ {toastMessage}
        </div>
      )}

      {/* Header Bar */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#111827', padding: '1rem 1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'linear-gradient(135deg, #6366F1, #06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.2rem', color: '#FFF' }}>
            LN
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>LearnNov Admin & RBAC Core</h1>
            <p style={{ fontSize: '0.78rem', color: '#9CA3AF', margin: 0 }}>لوحة التحكم وإدارة الصلاحيات والدورات التدريبية المربوطة بالموقع</p>
          </div>
        </div>

        {/* Role Switcher Simulator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)', padding: '0.5rem 1rem', borderRadius: '10px', fontSize: '0.85rem' }}>
            <span style={{ color: '#9CA3AF', marginLeft: '0.5rem' }}>محاكي الحساب:</span>
            <select value={activeUserId} onChange={(e) => setActiveUserId(Number(e.target.value))} style={{ background: '#1F2937', color: '#FFF', border: '1px solid rgba(255,255,255,0.1)', padding: '0.3rem 0.6rem', borderRadius: '6px' }}>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.name} ({(roles.find(r => r.id === u.role_id) || roles[0]).name})</option>
              ))}
            </select>
          </div>

          <Link href="/" style={{ padding: '0.55rem 1.1rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#F9FAFB', textDecoration: 'none', fontWeight: 700, fontSize: '0.85rem' }}>
            🏠 العودة للرئيسية
          </Link>
        </div>
      </header>

      {/* Main Layout Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '1.5rem' }}>
        
        {/* Navigation Sidebar */}
        <aside style={{ backgroundColor: '#111827', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)', padding: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <button onClick={() => setActiveTab('overview')} style={{ textAlign: 'right', padding: '0.75rem 1rem', borderRadius: '10px', border: 'none', backgroundColor: activeTab === 'overview' ? '#6366F1' : 'transparent', color: activeTab === 'overview' ? '#FFF' : '#9CA3AF', fontWeight: 700, cursor: 'pointer' }}>
              📊 نظرة عامة والذكاء الاصطناعي
            </button>
            <button onClick={() => setActiveTab('courses')} style={{ textAlign: 'right', padding: '0.75rem 1rem', borderRadius: '10px', border: 'none', backgroundColor: activeTab === 'courses' ? '#6366F1' : 'transparent', color: activeTab === 'courses' ? '#FFF' : '#9CA3AF', fontWeight: 700, cursor: 'pointer' }}>
              📚 كتالوج الدورات والتسجيل
            </button>
            <button onClick={() => setActiveTab('enrollments')} style={{ textAlign: 'right', padding: '0.75rem 1rem', borderRadius: '10px', border: 'none', backgroundColor: activeTab === 'enrollments' ? '#6366F1' : 'transparent', color: activeTab === 'enrollments' ? '#FFF' : '#9CA3AF', fontWeight: 700, cursor: 'pointer' }}>
              📝 طلبات التسجيل ({enrollments.filter(e => e.status === 'pending').length})
            </button>
            <button onClick={() => setActiveTab('certificates')} style={{ textAlign: 'right', padding: '0.75rem 1rem', borderRadius: '10px', border: 'none', backgroundColor: activeTab === 'certificates' ? '#6366F1' : 'transparent', color: activeTab === 'certificates' ? '#FFF' : '#9CA3AF', fontWeight: 700, cursor: 'pointer' }}>
              🎓 الشهادات الرقمية المعتمدة
            </button>
            <button onClick={() => setActiveTab('rbac')} style={{ textAlign: 'right', padding: '0.75rem 1rem', borderRadius: '10px', border: 'none', backgroundColor: activeTab === 'rbac' ? '#6366F1' : 'transparent', color: activeTab === 'rbac' ? '#FFF' : '#9CA3AF', fontWeight: 700, cursor: 'pointer' }}>
              🎛️ مصفوفة الصلاحيات (RBAC)
            </button>
            <button onClick={() => setActiveTab('users')} style={{ textAlign: 'right', padding: '0.75rem 1rem', borderRadius: '10px', border: 'none', backgroundColor: activeTab === 'users' ? '#6366F1' : 'transparent', color: activeTab === 'users' ? '#FFF' : '#9CA3AF', fontWeight: 700, cursor: 'pointer' }}>
              👥 إدارة المستخدمين
            </button>
            <button onClick={() => setActiveTab('dbExplorer')} style={{ textAlign: 'right', padding: '0.75rem 1rem', borderRadius: '10px', border: 'none', backgroundColor: activeTab === 'dbExplorer' ? '#6366F1' : 'transparent', color: activeTab === 'dbExplorer' ? '#FFF' : '#9CA3AF', fontWeight: 700, cursor: 'pointer' }}>
              🗄️ مستكشف SQL
            </button>
            <button onClick={() => setActiveTab('audit')} style={{ textAlign: 'right', padding: '0.75rem 1rem', borderRadius: '10px', border: 'none', backgroundColor: activeTab === 'audit' ? '#6366F1' : 'transparent', color: activeTab === 'audit' ? '#FFF' : '#9CA3AF', fontWeight: 700, cursor: 'pointer' }}>
              📜 سجل التدقيق الأمني
            </button>
          </div>
        </aside>

        {/* Content Pane */}
        <main style={{ backgroundColor: '#111827', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)', padding: '1.5rem' }}>
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.25rem' }}>مؤشرات الأداء والصلاحيات</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ backgroundColor: '#1F2937', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>المستخدمين المسجلين</span>
                  <h3 style={{ fontSize: '1.8rem', fontWeight: 900, margin: '0.4rem 0' }}>{users.length}</h3>
                </div>
                <div style={{ backgroundColor: '#1F2937', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>الدورات التدريبية</span>
                  <h3 style={{ fontSize: '1.8rem', fontWeight: 900, margin: '0.4rem 0' }}>{courses.length}</h3>
                </div>
                <div style={{ backgroundColor: '#1F2937', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>طلبات الانتظار</span>
                  <h3 style={{ fontSize: '1.8rem', fontWeight: 900, margin: '0.4rem 0', color: '#F59E0B' }}>{enrollments.filter(e => e.status === 'pending').length}</h3>
                </div>
                <div style={{ backgroundColor: '#1F2937', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>الصلاحيات الفعالة</span>
                  <h3 style={{ fontSize: '1.8rem', fontWeight: 900, margin: '0.4rem 0', color: '#10B981' }}>{permissions.length}</h3>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: COURSES */}
          {activeTab === 'courses' && (
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.25rem' }}>كتالوج الدورات التدريبية والتسجيل</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
                {courses.map(course => (
                  <div key={course.id} style={{ backgroundColor: '#1F2937', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <img src={course.image} alt={course.title} style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
                    <div style={{ padding: '1rem' }}>
                      <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.4rem' }}>{course.title}</h4>
                      <p style={{ fontSize: '0.8rem', color: '#9CA3AF', height: '40px', overflow: 'hidden' }}>{course.description}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', alignItems: 'center' }}>
                        <span style={{ color: '#10B981', fontWeight: 800 }}>{course.price} ر.س</span>
                        <button onClick={() => {
                          const newEn = { id: enrollments.length + 1, user_id: activeUser.id, userName: activeUser.name, course_id: course.id, courseTitle: course.title, date: '2026-07-24', status: 'pending' as const, payment_status: 'unpaid' as const };
                          setEnrollments([...enrollments, newEn]);
                          showToast('تم تقديم طلب التسجيل بنجاح!');
                        }} style={{ backgroundColor: '#6366F1', color: '#FFF', border: 'none', padding: '0.4rem 0.85rem', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>
                          تسجيل الآن
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: ENROLLMENTS */}
          {activeTab === 'enrollments' && (
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.25rem' }}>طلبات التسجيل المعلقة والمقبولة</h2>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#9CA3AF' }}>
                    <th style={{ padding: '0.75rem' }}>#</th>
                    <th style={{ padding: '0.75rem' }}>اسم الطالب</th>
                    <th style={{ padding: '0.75rem' }}>الدورة التدريبية</th>
                    <th style={{ padding: '0.75rem' }}>الحالة</th>
                    <th style={{ padding: '0.75rem' }}>الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {enrollments.map(en => (
                    <tr key={en.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '0.75rem' }}>#{en.id}</td>
                      <td style={{ padding: '0.75rem', fontWeight: 700 }}>{en.userName}</td>
                      <td style={{ padding: '0.75rem' }}>{en.courseTitle}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <span style={{ padding: '0.2rem 0.6rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 700, backgroundColor: en.status === 'approved' ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)', color: en.status === 'approved' ? '#10B981' : '#F59E0B' }}>
                          {en.status === 'approved' ? 'مقبول' : 'قيد الانتظار'}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        {en.status === 'pending' && (
                          <button onClick={() => {
                            en.status = 'approved';
                            setEnrollments([...enrollments]);
                            showToast(`تم قبول طلب: ${en.userName}`);
                          }} style={{ backgroundColor: '#10B981', color: '#FFF', border: 'none', padding: '0.3rem 0.6rem', borderRadius: '6px', cursor: 'pointer' }}>
                            قبول
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 4: CERTIFICATES */}
          {activeTab === 'certificates' && (
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.25rem' }}>الشهادات الرقمية المعتمدة (QR Code Verification)</h2>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#9CA3AF' }}>
                    <th style={{ padding: '0.75rem' }}>رقم الشهادة</th>
                    <th style={{ padding: '0.75rem' }}>الطالب</th>
                    <th style={{ padding: '0.75rem' }}>الدورة</th>
                    <th style={{ padding: '0.75rem' }}>التاريخ</th>
                  </tr>
                </thead>
                <tbody>
                  {certificates.map(cert => (
                    <tr key={cert.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '0.75rem', fontFamily: 'monospace', color: '#D4AF37' }}>{cert.id}</td>
                      <td style={{ padding: '0.75rem', fontWeight: 700 }}>{cert.studentName}</td>
                      <td style={{ padding: '0.75rem' }}>{cert.courseTitle}</td>
                      <td style={{ padding: '0.75rem', color: '#9CA3AF' }}>{cert.issueDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 5: RBAC MATRIX */}
          {activeTab === 'rbac' && (
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.25rem' }}>مصفوفة الصلاحيات للأدوار (RBAC Matrix)</h2>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', backgroundColor: '#1F2937' }}>
                      <th style={{ padding: '0.75rem', textAlign: 'right' }}>الصلاحية التفصيلية</th>
                      {roles.map(r => (
                        <th key={r.id} style={{ padding: '0.75rem', textAlign: 'center' }}>{r.name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {permissions.map(perm => (
                      <tr key={perm.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 700 }}>{perm.name} <br/><span style={{ fontSize: '0.72rem', color: '#6B7280' }}>{perm.code}</span></td>
                        {roles.map(r => {
                          const checked = (rolePermissions[r.id] || []).includes(perm.id);
                          return (
                            <td key={r.id} style={{ padding: '0.75rem', textAlign: 'center' }}>
                              <input type="checkbox" checked={checked} disabled={r.code === 'super_admin'} onChange={(e) => {
                                const current = rolePermissions[r.id] || [];
                                const updated = e.target.checked ? [...current, perm.id] : current.filter(id => id !== perm.id);
                                setRolePermissions({ ...rolePermissions, [r.id]: updated });
                                showToast('تم تحديث الصلاحية فورياً.');
                              }} style={{ width: '18px', height: '18px', accentColor: '#6366F1', cursor: 'pointer' }} />
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: USERS */}
          {activeTab === 'users' && (
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.25rem' }}>إدارة مستخدمي المنصة</h2>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#9CA3AF' }}>
                    <th style={{ padding: '0.75rem' }}>المستخدم</th>
                    <th style={{ padding: '0.75rem' }}>البريد الإلكتروني</th>
                    <th style={{ padding: '0.75rem' }}>الدور الحالي</th>
                    <th style={{ padding: '0.75rem' }}>الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '0.75rem', fontWeight: 700 }}>{u.name}</td>
                      <td style={{ padding: '0.75rem' }}>{u.email}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <span style={{ padding: '0.2rem 0.6rem', borderRadius: '99px', fontSize: '0.75rem', backgroundColor: 'rgba(99,102,241,0.2)', color: '#6366F1', fontWeight: 700 }}>
                          {(roles.find(r => r.id === u.role_id) || roles[0]).name}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <span style={{ color: u.status === 'active' ? '#10B981' : '#EF4444', fontWeight: 700 }}>{u.status === 'active' ? 'نشط' : 'مجمد'}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 7: SQL EXPLORER */}
          {activeTab === 'dbExplorer' && (
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1rem' }}>مستكشف SQL التفاعلي</h2>
              <div style={{ marginBottom: '1rem', background: '#1F2937', padding: '0.75rem 1rem', borderRadius: '8px', color: '#10B981', fontFamily: 'monospace' }}>
                SELECT * FROM {selectedSqlTable} LIMIT 50;
              </div>
              <select value={selectedSqlTable} onChange={(e) => setSelectedSqlTable(e.target.value)} style={{ background: '#1F2937', color: '#FFF', border: '1px solid rgba(255,255,255,0.1)', padding: '0.5rem', borderRadius: '6px', marginBottom: '1rem' }}>
                <option value="users">users</option>
                <option value="roles">roles</option>
                <option value="courses">courses</option>
                <option value="enrollments">enrollments</option>
              </select>
            </div>
          )}

          {/* TAB 8: AUDIT */}
          {activeTab === 'audit' && (
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.25rem' }}>سجل التدقيق والأمان</h2>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#9CA3AF' }}>
                    <th style={{ padding: '0.75rem' }}>المستخدم</th>
                    <th style={{ padding: '0.75rem' }}>العملية</th>
                    <th style={{ padding: '0.75rem' }}>المورد</th>
                    <th style={{ padding: '0.75rem' }}>التاريخ</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map(log => (
                    <tr key={log.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '0.75rem', fontWeight: 700 }}>{log.user}</td>
                      <td style={{ padding: '0.75rem' }}>{log.action}</td>
                      <td style={{ padding: '0.75rem' }}>{log.resource}</td>
                      <td style={{ padding: '0.75rem', color: '#9CA3AF' }}>{log.timestamp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </main>
      </div>

    </div>
  );
}
