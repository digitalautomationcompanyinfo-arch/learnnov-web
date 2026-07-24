'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { loadDatabase, saveDatabase } from '@/services/db-store';

export default function ProfilePage() {
  const { userName, userRole, accessToken } = useAuth();
  const { language, isRtl } = useLanguage();

  const [name, setName] = useState(userName || 'طالب ليرنوف المتميز');
  const [email, setEmail] = useState('student@learnnov.com');
  const [bio, setBio] = useState('طالب شغوف بهندسة الذكاء الاصطناعي وتطوير تطبيقات الويب المتقدمة.');
  const [mfa, setMfa] = useState(true);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const db = loadDatabase();
    if (db.users[0]) {
      db.users[0].name = name;
      db.users[0].email = email;
      db.users[0].mfa_enabled = mfa;
      saveDatabase(db);
    }
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

      <div className="glass-panel profile-header" style={{ borderLeft: '5px solid #6366f1' }}>
        <div className="profile-avatar" style={{ background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)', color: 'white' }}>
          {name ? name.charAt(0) : '👤'}
        </div>
        <div className="profile-info">
          <h1>{name}</h1>
          <p>{userRole === 'instructor' ? (language === 'ar' ? 'عضو هيئة تدريس محترف' : 'Professional Instructor') : (language === 'ar' ? 'طالب أكاديمي في هندسة البيانات والذكاء الاصطناعي' : 'Academic AI & Data Student')}</p>
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
              <label>{language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>{language === 'ar' ? 'نوع الحساب والصلاحية' : 'Account Role'}</label>
              <input type="text" value={userRole === 'instructor' ? 'محاضر / مدرب' : 'طالب أكاديمي'} readOnly />
            </div>
            <div className="form-group">
              <label>{language === 'ar' ? 'حالة التوثيق الرقمي' : 'JWT Auth Security'}</label>
              <input type="text" value={accessToken ? 'نشط وموثق برمز سحابي' : 'جلسة محلية محفوطة'} readOnly />
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
