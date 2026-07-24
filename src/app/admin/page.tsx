'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { loadDatabase, saveDatabase, DBStore, User, Role, Course, Enrollment, Certificate, AuditLog } from '@/services/db-store';

export default function AdminDashboardPage() {
  const [db, setDb] = useState<DBStore | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'enrollments' | 'certificates' | 'rbac' | 'users' | 'dbExplorer' | 'audit'>('overview');
  const [activeUserId, setActiveUserId] = useState<number>(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedSqlTable, setSelectedSqlTable] = useState<string>('users');

  // Modals visibility
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);
  const [showOverrideModal, setShowOverrideModal] = useState<User | null>(null);
  const [showAddCertModal, setShowAddCertModal] = useState(false);

  // Form inputs for modals
  const [newCourse, setNewCourse] = useState({ title: '', category: 'الذكاء الاصطناعي', instructor: 'د. خالد بن محمد', price: 450, capacity: 30, image: '', description: '', startDate: '2026-09-01' });
  const [newUser, setNewUser] = useState({ name: '', email: '', role_id: 4, status: 'active' as const, mfa_enabled: false });
  const [newRole, setNewRole] = useState({ name: '', code: '', description: '', permissions: [] as number[] });
  const [newCert, setNewCert] = useState({ studentName: '', courseTitle: '', grade: 'امتياز مرتفع (98%)' });

  useEffect(() => {
    const loaded = loadDatabase();
    setDb(loaded);
  }, []);

  if (!db) return <div style={{ color: '#FFF', padding: '2rem', textAlign: 'center' }}>جاري تحميل محرك قاعدة البيانات السحابية والمحلية...</div>;

  const updateDb = (newStore: DBStore) => {
    setDb({ ...newStore });
    saveDatabase(newStore);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const activeUser = db.users.find(u => u.id === activeUserId) || db.users[0];
  const activeRole = db.roles.find(r => r.id === activeUser.role_id) || db.roles[0];

  const logAction = (action: string, resource: string, severity: 'info' | 'warning' | 'critical' = 'info') => {
    const newLog: AuditLog = {
      id: db.auditLogs.length + 1,
      user: activeUser.name,
      action,
      resource,
      ip: '192.168.1.10',
      severity,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    db.auditLogs.unshift(newLog);
  };

  // CSV Exporter Utility
  const exportToCSV = (filename: string, rows: object[]) => {
    if (!rows.length) return;
    const headers = Object.keys(rows[0]).join(',');
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers, ...rows.map(e => Object.values(e).map(val => `"${val}"`).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`تم تصدير ملف ${filename}.csv بنجاح!`);
  };

  // Add Handlers
  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Course = {
      id: db.courses.length + 1,
      ...newCourse,
      enrolled_count: 0,
      image: newCourse.image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80'
    };
    db.courses.push(created);
    logAction('إنشاء دورة تدريبية', created.title);
    updateDb(db);
    setShowAddCourseModal(false);
    showToast(`تم إضافة دورة: ${created.title}`);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    const created: User = {
      id: db.users.length + 1,
      name: newUser.name,
      email: newUser.email,
      role_id: Number(newUser.role_id),
      status: newUser.status,
      mfa_enabled: newUser.mfa_enabled,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      overrides: []
    };
    db.users.push(created);
    logAction('إنشاء مستخدم جديد', created.name);
    updateDb(db);
    setShowAddUserModal(false);
    showToast(`تم إضافة المستخدم: ${created.name}`);
  };

  const handleCreateRole = (e: React.FormEvent) => {
    e.preventDefault();
    const roleId = db.roles.length + 1;
    const createdRole: Role = {
      id: roleId,
      name: newRole.name,
      code: newRole.code.toLowerCase().replace(/\s+/g, '_'),
      description: newRole.description,
      is_system: false
    };
    db.roles.push(createdRole);
    db.rolePermissions[roleId] = newRole.permissions;
    logAction('إنشاء دور مخصص جديد', createdRole.name);
    updateDb(db);
    setShowAddRoleModal(false);
    showToast(`تم إنشاء الدور المخصص: ${createdRole.name}`);
  };

  const handleIssueCert = (e: React.FormEvent) => {
    e.preventDefault();
    const code = `CERT-${Math.floor(1000 + Math.random() * 9000)}`;
    const created: Certificate = {
      id: code,
      studentName: newCert.studentName,
      courseTitle: newCert.courseTitle,
      issueDate: new Date().toISOString().split('T')[0],
      verifyCode: code,
      grade: newCert.grade
    };
    db.certificates.unshift(created);
    logAction('إصدار شهادة رقمية', `${created.studentName} - ${created.courseTitle}`);
    updateDb(db);
    setShowAddCertModal(false);
    showToast(`تم إصدار الشهادة برقم ${code}`);
  };

  const handleToggleUserStatus = (userId: number) => {
    const target = db.users.find(u => u.id === userId);
    if (target) {
      target.status = target.status === 'active' ? 'suspended' : 'active';
      logAction(target.status === 'active' ? 'تنشيط حساب' : 'تجميد حساب', target.name, 'warning');
      updateDb(db);
      showToast(`تم تغيير حالة حساب ${target.name}`);
    }
  };

  const handleSaveOverrides = (user: User, permId: number, type: 'allow' | 'deny' | 'default') => {
    if (!user.overrides) user.overrides = [];
    user.overrides = user.overrides.filter(o => o.perm_id !== permId);
    if (type !== 'default') {
      user.overrides.push({ perm_id: permId, type });
    }
    logAction('تحديث استثناءات الصلاحية المباشرة', user.name);
    updateDb(db);
    showToast(`تم تحديث استثناءات الصلاحيات لـ ${user.name}`);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0B0F19', color: '#F9FAFB', fontFamily: 'Cairo, sans-serif', padding: '1.5rem', direction: 'rtl' }}>
      
      {/* Toast Alert */}
      {toastMessage && (
        <div style={{ position: 'fixed', bottom: '20px', left: '20px', backgroundColor: '#111827', border: '1px solid #10B981', borderLeft: '4px solid #10B981', color: '#FFF', padding: '0.85rem 1.25rem', borderRadius: '8px', zIndex: 999 }}>
          ✅ {toastMessage}
        </div>
      )}

      {/* MODAL 1: ADD COURSE */}
      {showAddCourseModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', width: '100%', maxWidth: '550px', padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>➕ إضافة دورة تدريبية جديدة</h3>
            <form onSubmit={handleCreateCourse} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <input type="text" placeholder="عنوان الدورة" required value={newCourse.title} onChange={e => setNewCourse({...newCourse, title: e.target.value})} style={{ background: '#1F2937', color: '#FFF', border: '1px solid rgba(255,255,255,0.1)', padding: '0.65rem 0.85rem', borderRadius: '8px' }} />
              <input type="text" placeholder="التصنيف (مثال: الذكاء الاصطناعي)" required value={newCourse.category} onChange={e => setNewCourse({...newCourse, category: e.target.value})} style={{ background: '#1F2937', color: '#FFF', border: '1px solid rgba(255,255,255,0.1)', padding: '0.65rem 0.85rem', borderRadius: '8px' }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <input type="number" placeholder="السعر (ر.س)" required value={newCourse.price} onChange={e => setNewCourse({...newCourse, price: Number(e.target.value)})} style={{ background: '#1F2937', color: '#FFF', border: '1px solid rgba(255,255,255,0.1)', padding: '0.65rem 0.85rem', borderRadius: '8px' }} />
                <input type="number" placeholder="السعة الاستيعابية" required value={newCourse.capacity} onChange={e => setNewCourse({...newCourse, capacity: Number(e.target.value)})} style={{ background: '#1F2937', color: '#FFF', border: '1px solid rgba(255,255,255,0.1)', padding: '0.65rem 0.85rem', borderRadius: '8px' }} />
              </div>
              <input type="text" placeholder="اسم المحاضر / المدرب" required value={newCourse.instructor} onChange={e => setNewCourse({...newCourse, instructor: e.target.value})} style={{ background: '#1F2937', color: '#FFF', border: '1px solid rgba(255,255,255,0.1)', padding: '0.65rem 0.85rem', borderRadius: '8px' }} />
              <textarea placeholder="وصف الدورة والأهداف التدريبية" rows={3} value={newCourse.description} onChange={e => setNewCourse({...newCourse, description: e.target.value})} style={{ background: '#1F2937', color: '#FFF', border: '1px solid rgba(255,255,255,0.1)', padding: '0.65rem 0.85rem', borderRadius: '8px' }} />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowAddCourseModal(false)} style={{ background: 'transparent', color: '#9CA3AF', border: '1px solid rgba(255,255,255,0.1)', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer' }}>إلغاء</button>
                <button type="submit" style={{ background: '#6366F1', color: '#FFF', border: 'none', padding: '0.5rem 1.25rem', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>حفظ والدورة جديدة</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD USER */}
      {showAddUserModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', width: '100%', maxWidth: '480px', padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>👤 إضافة مستخدم جديد</h3>
            <form onSubmit={handleCreateUser} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <input type="text" placeholder="الاسم الكامل" required value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} style={{ background: '#1F2937', color: '#FFF', border: '1px solid rgba(255,255,255,0.1)', padding: '0.65rem 0.85rem', borderRadius: '8px' }} />
              <input type="email" placeholder="البريد الإلكتروني الرسمي" required value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} style={{ background: '#1F2937', color: '#FFF', border: '1px solid rgba(255,255,255,0.1)', padding: '0.65rem 0.85rem', borderRadius: '8px' }} />
              <select value={newUser.role_id} onChange={e => setNewUser({...newUser, role_id: Number(e.target.value)})} style={{ background: '#1F2937', color: '#FFF', border: '1px solid rgba(255,255,255,0.1)', padding: '0.65rem 0.85rem', borderRadius: '8px' }}>
                {db.roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#9CA3AF' }}>
                <input type="checkbox" checked={newUser.mfa_enabled} onChange={e => setNewUser({...newUser, mfa_enabled: e.target.checked})} />
                تفعيل التحقق الثنائي MFA للحساب
              </label>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowAddUserModal(false)} style={{ background: 'transparent', color: '#9CA3AF', border: '1px solid rgba(255,255,255,0.1)', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer' }}>إلغاء</button>
                <button type="submit" style={{ background: '#10B981', color: '#FFF', border: 'none', padding: '0.5rem 1.25rem', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>إضافة المستخدم</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header Bar */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#111827', padding: '1rem 1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'linear-gradient(135deg, #6366F1, #06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.2rem', color: '#FFF' }}>
            LN
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>LearnNov Enterprise Core & RBAC Control Panel</h1>
            <p style={{ fontSize: '0.78rem', color: '#9CA3AF', margin: 0 }}>نظام إدارة الصلاحيات المتقدم والدورات والشهادات الرقمية المربوط بالموقع السحابي</p>
          </div>
        </div>

        {/* Role Switcher Simulator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)', padding: '0.5rem 1rem', borderRadius: '10px', fontSize: '0.85rem' }}>
            <span style={{ color: '#9CA3AF', marginLeft: '0.5rem' }}>محاكي الحساب:</span>
            <select value={activeUserId} onChange={(e) => setActiveUserId(Number(e.target.value))} style={{ background: '#1F2937', color: '#FFF', border: '1px solid rgba(255,255,255,0.1)', padding: '0.3rem 0.6rem', borderRadius: '6px' }}>
              {db.users.map(u => (
                <option key={u.id} value={u.id}>{u.name} ({(db.roles.find(r => r.id === u.role_id) || db.roles[0]).name})</option>
              ))}
            </select>
          </div>

          <Link href="/" style={{ padding: '0.55rem 1.1rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#F9FAFB', textDecoration: 'none', fontWeight: 700, fontSize: '0.85rem' }}>
            🏠 العودة للموقع
          </Link>
        </div>
      </header>

      {/* Main Layout Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '1.5rem' }}>
        
        {/* Navigation Sidebar */}
        <aside style={{ backgroundColor: '#111827', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)', padding: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <button onClick={() => setActiveTab('overview')} style={{ textAlign: 'right', padding: '0.75rem 1rem', borderRadius: '10px', border: 'none', backgroundColor: activeTab === 'overview' ? '#6366F1' : 'transparent', color: activeTab === 'overview' ? '#FFF' : '#9CA3AF', fontWeight: 700, cursor: 'pointer' }}>
              📊 نظرة عامة ومؤشرات النظام
            </button>
            <button onClick={() => setActiveTab('courses')} style={{ textAlign: 'right', padding: '0.75rem 1rem', borderRadius: '10px', border: 'none', backgroundColor: activeTab === 'courses' ? '#6366F1' : 'transparent', color: activeTab === 'courses' ? '#FFF' : '#9CA3AF', fontWeight: 700, cursor: 'pointer' }}>
              📚 كتالوج الدورات ({db.courses.length})
            </button>
            <button onClick={() => setActiveTab('enrollments')} style={{ textAlign: 'right', padding: '0.75rem 1rem', borderRadius: '10px', border: 'none', backgroundColor: activeTab === 'enrollments' ? '#6366F1' : 'transparent', color: activeTab === 'enrollments' ? '#FFF' : '#9CA3AF', fontWeight: 700, cursor: 'pointer' }}>
              📝 طلبات التسجيل ({db.enrollments.filter(e => e.status === 'pending').length})
            </button>
            <button onClick={() => setActiveTab('certificates')} style={{ textAlign: 'right', padding: '0.75rem 1rem', borderRadius: '10px', border: 'none', backgroundColor: activeTab === 'certificates' ? '#6366F1' : 'transparent', color: activeTab === 'certificates' ? '#FFF' : '#9CA3AF', fontWeight: 700, cursor: 'pointer' }}>
              🎓 الشهادات الرقمية المعتمدة
            </button>
            <button onClick={() => setActiveTab('rbac')} style={{ textAlign: 'right', padding: '0.75rem 1rem', borderRadius: '10px', border: 'none', backgroundColor: activeTab === 'rbac' ? '#6366F1' : 'transparent', color: activeTab === 'rbac' ? '#FFF' : '#9CA3AF', fontWeight: 700, cursor: 'pointer' }}>
              🎛️ مصفوفة الصلاحيات (RBAC)
            </button>
            <button onClick={() => setActiveTab('users')} style={{ textAlign: 'right', padding: '0.75rem 1rem', borderRadius: '10px', border: 'none', backgroundColor: activeTab === 'users' ? '#6366F1' : 'transparent', color: activeTab === 'users' ? '#FFF' : '#9CA3AF', fontWeight: 700, cursor: 'pointer' }}>
              👥 إدارة المستخدمين ({db.users.length})
            </button>
            <button onClick={() => setActiveTab('dbExplorer')} style={{ textAlign: 'right', padding: '0.75rem 1rem', borderRadius: '10px', border: 'none', backgroundColor: activeTab === 'dbExplorer' ? '#6366F1' : 'transparent', color: activeTab === 'dbExplorer' ? '#FFF' : '#9CA3AF', fontWeight: 700, cursor: 'pointer' }}>
              🗄️ مستكشف قواعد البيانات SQL
            </button>
            <button onClick={() => setActiveTab('audit')} style={{ textAlign: 'right', padding: '0.75rem 1rem', borderRadius: '10px', border: 'none', backgroundColor: activeTab === 'audit' ? '#6366F1' : 'transparent', color: activeTab === 'audit' ? '#FFF' : '#9CA3AF', fontWeight: 700, cursor: 'pointer' }}>
              📜 سجلات التدقيق والأمان
            </button>
          </div>
        </aside>

        {/* Content Pane */}
        <main style={{ backgroundColor: '#111827', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)', padding: '1.5rem' }}>
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.25rem' }}>مؤشرات الإدارة والنظام الحي</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ backgroundColor: '#1F2937', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>المستخدمين المسجلين</span>
                  <h3 style={{ fontSize: '1.8rem', fontWeight: 900, margin: '0.4rem 0' }}>{db.users.length}</h3>
                </div>
                <div style={{ backgroundColor: '#1F2937', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>الدورات التدريبية المتاحة</span>
                  <h3 style={{ fontSize: '1.8rem', fontWeight: 900, margin: '0.4rem 0' }}>{db.courses.length}</h3>
                </div>
                <div style={{ backgroundColor: '#1F2937', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>طلبات الانتظار والمعالجة</span>
                  <h3 style={{ fontSize: '1.8rem', fontWeight: 900, margin: '0.4rem 0', color: '#F59E0B' }}>{db.enrollments.filter(e => e.status === 'pending').length}</h3>
                </div>
                <div style={{ backgroundColor: '#1F2937', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>الشهادات الصادرة الحية</span>
                  <h3 style={{ fontSize: '1.8rem', fontWeight: 900, margin: '0.4rem 0', color: '#10B981' }}>{db.certificates.length}</h3>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: COURSES */}
          {activeTab === 'courses' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>إدارة كتالوج الدورات والبرامج</h2>
                <button onClick={() => setShowAddCourseModal(true)} style={{ backgroundColor: '#6366F1', color: '#FFF', border: 'none', padding: '0.55rem 1.1rem', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}>
                  ➕ إضافة دورة تدريبية
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
                {db.courses.map(course => (
                  <div key={course.id} style={{ backgroundColor: '#1F2937', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <img src={course.image} alt={course.title} style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
                    <div style={{ padding: '1rem' }}>
                      <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.4rem' }}>{course.title}</h4>
                      <p style={{ fontSize: '0.8rem', color: '#9CA3AF', height: '40px', overflow: 'hidden' }}>{course.description}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', alignItems: 'center' }}>
                        <span style={{ color: '#10B981', fontWeight: 800 }}>{course.price} ر.س</span>
                        <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>المسجلين: {course.enrolled_count}/{course.capacity}</span>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>طلبات التسجيل والمعالجة</h2>
                <button onClick={() => exportToCSV('enrollments_report', db.enrollments)} style={{ backgroundColor: '#10B981', color: '#FFF', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>
                  📥 تصدير التقرير CSV
                </button>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#9CA3AF' }}>
                    <th style={{ padding: '0.75rem' }}>#</th>
                    <th style={{ padding: '0.75rem' }}>الطالب</th>
                    <th style={{ padding: '0.75rem' }}>الدورة التدريبية</th>
                    <th style={{ padding: '0.75rem' }}>الحالة</th>
                    <th style={{ padding: '0.75rem' }}>الإجراء الإداري</th>
                  </tr>
                </thead>
                <tbody>
                  {db.enrollments.map(en => (
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
                            logAction('قبول طلب تسجيل', `${en.userName} - ${en.courseTitle}`);
                            updateDb(db);
                            showToast(`تم قبول طلب تسجيل الطالب: ${en.userName}`);
                          }} style={{ backgroundColor: '#10B981', color: '#FFF', border: 'none', padding: '0.35rem 0.75rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 700 }}>
                            قبول الطلب
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>الشهادات الرقمية المعتمدة</h2>
                <button onClick={() => setShowAddCertModal(true)} style={{ backgroundColor: '#D4AF37', color: '#000', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 800, cursor: 'pointer' }}>
                  🎓 إصدار شهادة جديدة
                </button>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#9CA3AF' }}>
                    <th style={{ padding: '0.75rem' }}>رقم الشهادة</th>
                    <th style={{ padding: '0.75rem' }}>اسم الطالب</th>
                    <th style={{ padding: '0.75rem' }}>الدورة / التخصص</th>
                    <th style={{ padding: '0.75rem' }}>التقدير</th>
                  </tr>
                </thead>
                <tbody>
                  {db.certificates.map(cert => (
                    <tr key={cert.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '0.75rem', fontFamily: 'monospace', color: '#D4AF37', fontWeight: 700 }}>{cert.id}</td>
                      <td style={{ padding: '0.75rem', fontWeight: 700 }}>{cert.studentName}</td>
                      <td style={{ padding: '0.75rem' }}>{cert.courseTitle}</td>
                      <td style={{ padding: '0.75rem', color: '#10B981', fontWeight: 700 }}>{cert.grade}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 5: RBAC MATRIX */}
          {activeTab === 'rbac' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>مصفوفة التحكم بالصلاحيات (RBAC Matrix)</h2>
                <button onClick={() => setShowAddRoleModal(true)} style={{ backgroundColor: '#6366F1', color: '#FFF', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>
                  ➕ إنشاء دور مخصص جديد
                </button>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', backgroundColor: '#1F2937' }}>
                      <th style={{ padding: '0.75rem', textAlign: 'right' }}>الصلاحية</th>
                      {db.roles.map(r => (
                        <th key={r.id} style={{ padding: '0.75rem', textAlign: 'center' }}>{r.name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {db.permissions.map(perm => (
                      <tr key={perm.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 700 }}>{perm.name} <br/><span style={{ fontSize: '0.72rem', color: '#6B7280' }}>{perm.code}</span></td>
                        {db.roles.map(r => {
                          const checked = (db.rolePermissions[r.id] || []).includes(perm.id);
                          return (
                            <td key={r.id} style={{ padding: '0.75rem', textAlign: 'center' }}>
                              <input type="checkbox" checked={checked} disabled={r.code === 'super_admin'} onChange={(e) => {
                                const current = db.rolePermissions[r.id] || [];
                                const updated = e.target.checked ? [...current, perm.id] : current.filter(id => id !== perm.id);
                                db.rolePermissions[r.id] = updated;
                                logAction('تحديث مصفوفة الصلاحيات', `${r.name} -> ${perm.name}`);
                                updateDb(db);
                                showToast('تم تحديث الصلاحيات وحفظها فورياً.');
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>إدارة المستخدمين والاستثناءات المباشرة</h2>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => exportToCSV('users_report', db.users)} style={{ backgroundColor: '#10B981', color: '#FFF', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>
                    📥 تصدير CSV
                  </button>
                  <button onClick={() => setShowAddUserModal(true)} style={{ backgroundColor: '#6366F1', color: '#FFF', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>
                    👤 مستخدم جديد
                  </button>
                </div>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#9CA3AF' }}>
                    <th style={{ padding: '0.75rem' }}>المستخدم</th>
                    <th style={{ padding: '0.75rem' }}>البريد الإلكتروني</th>
                    <th style={{ padding: '0.75rem' }}>الدور الحالي</th>
                    <th style={{ padding: '0.75rem' }}>الحالة</th>
                    <th style={{ padding: '0.75rem' }}>تعديل وتجميد</th>
                  </tr>
                </thead>
                <tbody>
                  {db.users.map(u => (
                    <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '0.75rem', fontWeight: 700 }}>{u.name}</td>
                      <td style={{ padding: '0.75rem' }}>{u.email}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <span style={{ padding: '0.2rem 0.6rem', borderRadius: '99px', fontSize: '0.75rem', backgroundColor: 'rgba(99,102,241,0.2)', color: '#6366F1', fontWeight: 700 }}>
                          {(db.roles.find(r => r.id === u.role_id) || db.roles[0]).name}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <span style={{ color: u.status === 'active' ? '#10B981' : '#EF4444', fontWeight: 700 }}>{u.status === 'active' ? 'نشط' : 'مجمد'}</span>
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <button onClick={() => handleToggleUserStatus(u.id)} style={{ backgroundColor: u.status === 'active' ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)', color: u.status === 'active' ? '#EF4444' : '#10B981', border: 'none', padding: '0.3rem 0.6rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 700 }}>
                          {u.status === 'active' ? 'تجميد' : 'تنشيط'}
                        </button>
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
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1rem' }}>مستكشف واستعلامات SQL الحي</h2>
              <div style={{ marginBottom: '1rem', background: '#1F2937', padding: '0.85rem 1rem', borderRadius: '8px', color: '#10B981', fontFamily: 'monospace' }}>
                SELECT * FROM {selectedSqlTable} ORDER BY id DESC LIMIT 50;
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <select value={selectedSqlTable} onChange={(e) => setSelectedSqlTable(e.target.value)} style={{ background: '#1F2937', color: '#FFF', border: '1px solid rgba(255,255,255,0.1)', padding: '0.5rem', borderRadius: '6px' }}>
                  <option value="users">جدول المستخدمين (users)</option>
                  <option value="roles">جدول الأدوار (roles)</option>
                  <option value="courses">جدول الدورات (courses)</option>
                  <option value="enrollments">جدول التسجيلات (enrollments)</option>
                  <option value="certificates">جدول الشهادات (certificates)</option>
                </select>
                <button onClick={() => showToast(`تم تنفيذ الاستعلام على جدول ${selectedSqlTable}`)} style={{ background: '#6366F1', color: '#FFF', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}>
                  ▶ تنفيذ الاستعلام
                </button>
              </div>
              <pre style={{ background: '#0B0F19', padding: '1rem', borderRadius: '8px', color: '#F9FAFB', overflowX: 'auto', fontSize: '0.8rem', border: '1px solid rgba(255,255,255,0.08)' }}>
                {JSON.stringify(db[selectedSqlTable as keyof DBStore], null, 2)}
              </pre>
            </div>
          )}

          {/* TAB 8: AUDIT */}
          {activeTab === 'audit' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>سجل التدقيق والأمان الحقيقي</h2>
                <button onClick={() => exportToCSV('audit_logs', db.auditLogs)} style={{ backgroundColor: '#10B981', color: '#FFF', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>
                  📥 تصدير السجل CSV
                </button>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#9CA3AF' }}>
                    <th style={{ padding: '0.75rem' }}>المستخدم</th>
                    <th style={{ padding: '0.75rem' }}>العملية المنفذة</th>
                    <th style={{ padding: '0.75rem' }}>المورد المستهدف</th>
                    <th style={{ padding: '0.75rem' }}>عنوان IP</th>
                    <th style={{ padding: '0.75rem' }}>التاريخ والوقت</th>
                  </tr>
                </thead>
                <tbody>
                  {db.auditLogs.map(log => (
                    <tr key={log.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '0.75rem', fontWeight: 700 }}>{log.user}</td>
                      <td style={{ padding: '0.75rem' }}>{log.action}</td>
                      <td style={{ padding: '0.75rem' }}>{log.resource}</td>
                      <td style={{ padding: '0.75rem', fontFamily: 'monospace', color: '#6366F1' }}>{log.ip}</td>
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
