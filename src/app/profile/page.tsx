'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { loadDatabase, saveDatabase } from '@/services/db-store';

export default function ProfilePage() {
  const { userName, userRole, isLoggedIn, userEmail } = useAuth();
  const { language, isRtl } = useLanguage();

  const [name, setName] = useState(userName || 'طالب ليرنوف المتميز');
  const [email, setEmail] = useState(userEmail || 'student.demo@learnnov.com');
  const [bio, setBio] = useState('طالب شغوف بهندسة الذكاء الاصطناعي وتطوير تطبيقات الويب المتقدمة.');
  const [mfa, setMfa] = useState(true);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    if (userEmail) setEmail(userEmail);
    if (userName) setName(userName);
  }, [userEmail, userName]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const db = loadDatabase();
    const existingIndex = db.users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingIndex !== -1) {
      db.users[existingIndex].name = name;
      db.users[existingIndex].mfa_enabled = mfa;
    } else {
      db.users.push({
        id: Date.now(),
        name: name,
        email: email,
        role_id: userRole === 'admin' ? 1 : userRole === 'instructor' ? 2 : 4,
        status: 'active',
        mfa_enabled: mfa,
        created_at: new Date().toISOString()
      });
    }
    db.auditLogs.unshift({
      id: Date.now(),
      user: name,
      action: 'تحديث الملف الشخصي وإعدادات البريد الإلكتروني',
      resource: `Profile update: ${email}`,
      ip: '197.245.89.12',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    });
    saveDatabase(db);

    setToastMsg(language === 'ar' ? 'تم حفظ وإعادة توثيق بيانات الملف الشخصي بنجاح!' : 'Profile updated successfully!');
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <main className="dashboard-container" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {toastMsg && (
        <div style={{ position: 'fixed', bottom: '20px', left: '20px', backgroundColor: '#111827', border: '1px solid #10B981', borderLeft: '4px solid #10B981', color: '#FFF', padding: '0.85rem 1.25rem', borderRadius: '8px', zIndex: 999 }}>
          ✅ {toastMsg}
        </div>
      )}

      <div className="glass-panel profile-header" style={{ borderLeft: '5px solid #6366f1', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
          <div className="profile-avatar" style={{ background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)', color: 'white' }}>
            {name ? name.charAt(0) : '👤'}
          </div>
          <div className="profile-info">
            <h1>{name}</h1>
            <p style={{ margin: '0.2rem 0' }}>{email} • {userRole === 'instructor' ? (language === 'ar' ? 'عضو هيئة تدريس محترف' : 'Professional Instructor') : (language === 'ar' ? 'طالب أكاديمي في هندسة الذكاء الاصطناعي' : 'Academic AI & Data Student')}</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <span style={{ backgroundColor: 'rgba(16,185,129,0.15)', color: '#10B981', border: '1px solid rgba(16,185,129,0.3)', padding: '0.4rem 0.85rem', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 700 }}>
            🟢 بريد مفعّل وموثق بـ OTP
          </span>
          <span style={{ backgroundColor: 'rgba(99,102,241,0.15)', color: '#818CF8', border: '1px solid rgba(99,102,241,0.3)', padding: '0.4rem 0.85rem', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 700 }}>
            🔒 حماية MFA نشطة
          </span>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '2rem', marginTop: '2rem' }}>
        <h2 style={{ fontSize: '1.4rem', marginBottom: '1.5rem' }} className="text-gradient">
          {language === 'ar' ? 'إعدادات الحساب والبيانات الشخصية' : 'Account & Personal Profile Settings'}
        </h2>
        <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            <div className="form-group">
              <label>{language === 'ar' ? 'الاسم الكامل' : 'Full Name'}</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>{language === 'ar' ? 'البريد الإلكتروني المعتمد' : 'Verified Email Address'}</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>{language === 'ar' ? 'نوع الحساب والصلاحية' : 'Account Role'}</label>
              <input type="text" value={userRole === 'instructor' ? 'محاضر / مدرب' : userRole === 'admin' ? 'مدير نظام' : 'طالب أكاديمي'} readOnly />
            </div>
            <div className="form-group">
              <label>{language === 'ar' ? 'حالة التوثيق الرقمي' : 'JWT Auth Security'}</label>
              <input type="text" value={isLoggedIn ? 'نشط وموثق برمز سحابي' : 'جلسة محلية محفوطة'} readOnly />
            </div>
          </div>

          <div className="form-group">
            <label>{language === 'ar' ? 'نبذة عن الطالب والأهداف الأكاديمية' : 'Academic Bio'}</label>
            <textarea rows={3} value={bio} onChange={e => setBio(e.target.value)} style={{ padding: '0.85rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#FFF' }} />
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: '#94a3b8', cursor: 'pointer' }}>
            <input type="checkbox" checked={mfa} onChange={e => setMfa(e.target.checked)} style={{ width: '18px', height: '18px', accentColor: '#10B981' }} />
            {language === 'ar' ? 'تفعيل حماية الدخول بالتحقق الثنائي MFA (موصى به)' : 'Enable Multi-Factor Authentication (MFA)'}
          </label>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button type="submit" className="submit-btn" style={{ width: 'auto', padding: '0.75rem 2rem' }}>
              {language === 'ar' ? '💾 حفظ التعديلات والبيانات' : '💾 Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
