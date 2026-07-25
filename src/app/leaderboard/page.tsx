'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

interface StudentRank {
  rank: number;
  name: string;
  avatar: string;
  track: string;
  xp: number;
  gpa: string;
  streak: number;
  badge: string;
}

export default function LeaderboardPage() {
  const { isLoggedIn, userName, isLoading } = useAuth();
  const { language, isRtl } = useLanguage();

  const [activeTrack, setActiveTrack] = useState<'all' | 'ai' | 'security' | 'web'>('all');

  const leaderData: StudentRank[] = [
    { rank: 1, name: 'سارة الأحمد', avatar: '👩‍💻', track: 'هندسة الذكاء الاصطناعي', xp: 9850, gpa: '99.2%', streak: 45, badge: '🥇 خبير ماسي Diamond' },
    { rank: 2, name: userName || 'طالب ليرنوف المتميز', avatar: '🎓', track: 'تطوير تطبيقات الويب بـ Next.js', xp: 9420, gpa: '98.5%', streak: 32, badge: '🥈 محترف ذهبي Gold' },
    { rank: 3, name: 'م. عبد الله العتيبي', avatar: '👨‍💻', track: 'الأمن السيبراني والـ RBAC', xp: 9110, gpa: '97.8%', streak: 28, badge: '🥉 متفوق فضي Silver' },
    { rank: 4, name: 'د. يوسف الغامدي', avatar: '🧠', track: 'هندسة الأوامر والـ Prompts', xp: 8840, gpa: '96.5%', streak: 21, badge: '🎖️ متميز Elite' },
    { rank: 5, name: 'ريم المطيري', avatar: '⚡', track: 'قواعد البيانات السحابية Supabase', xp: 8520, gpa: '95.9%', streak: 19, badge: '🎖️ متميز Elite' },
    { rank: 6, name: 'خالد بن محمد', avatar: '🚀', track: 'تطوير تطبيقات الويب بـ Next.js', xp: 8200, gpa: '95.0%', streak: 15, badge: '⭐ متقدم Pro' },
    { rank: 7, name: 'منى الشمري', avatar: '💻', track: 'الأمن السيبراني والـ RBAC', xp: 7950, gpa: '94.2%', streak: 12, badge: '⭐ متقدم Pro' },
    { rank: 8, name: 'عمر الزهراني', avatar: '🛡️', track: 'هندسة الذكاء الاصطناعي', xp: 7600, gpa: '93.5%', streak: 10, badge: '⭐ متقدم Pro' },
  ];

  if (isLoading || !isLoggedIn) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0b0f19', color: '#FFF' }}>
        جاري تحميل لائحة المتفوقين والشرف الأكاديمي...
      </div>
    );
  }

  return (
    <main className="dashboard-container" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header Banner */}
      <div className="glass-panel profile-header" style={{ borderLeft: '5px solid #F59E0B', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>
            🏆 {language === 'ar' ? 'لائحة الشرف ولوحة المتفوقين الأكاديمية' : 'Global Academic Leaderboard & Honor Roll'}
          </h1>
          <p style={{ color: '#94A3B8', marginTop: '0.3rem' }}>
            {language === 'ar' ? 'تصنيف أفضل طلاب المنصة بناءً على معدل الاختبارات، المشاريع المسلمة، وأيام الاستمرارية.' : 'Global rankings based on exam GPA, submitted projects, and study streaks.'}
          </p>
        </div>
      </div>

      {/* Top 3 Podium Display */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginTop: '2.5rem', alignItems: 'flex-end' }}>
        
        {/* 2nd Place */}
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '20px', borderTop: '6px solid #C0C0C0', textAlign: 'center', background: 'linear-gradient(180deg, rgba(192,192,192,0.1) 0%, rgba(11,15,25,0.8) 100%)' }}>
          <div style={{ fontSize: '2.5rem' }}>🥈</div>
          <div style={{ fontSize: '2.2rem', margin: '0.4rem 0' }}>{leaderData[1].avatar}</div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFF', margin: '0.2rem 0' }}>{leaderData[1].name}</h3>
          <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginBottom: '0.75rem' }}>{leaderData[1].track}</div>
          <span style={{ backgroundColor: 'rgba(192,192,192,0.2)', color: '#E2E8F0', padding: '0.35rem 0.85rem', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 800 }}>
            {leaderData[1].xp} XP
          </span>
        </div>

        {/* 1st Place (Center / Taller) */}
        <div className="glass-panel" style={{ padding: '2rem 1.5rem', borderRadius: '20px', borderTop: '6px solid #F59E0B', textAlign: 'center', background: 'linear-gradient(180deg, rgba(245,158,11,0.15) 0%, rgba(11,15,25,0.9) 100%)', transform: 'scale(1.05)' }}>
          <div style={{ fontSize: '3rem' }}>🥇</div>
          <div style={{ fontSize: '2.8rem', margin: '0.4rem 0' }}>{leaderData[0].avatar}</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#FFF', margin: '0.2rem 0' }}>{leaderData[0].name}</h3>
          <div style={{ fontSize: '0.8rem', color: '#FCD34D', marginBottom: '0.75rem', fontWeight: 700 }}>{leaderData[0].track}</div>
          <span style={{ backgroundColor: '#F59E0B', color: '#111827', padding: '0.4rem 1rem', borderRadius: '99px', fontSize: '0.85rem', fontWeight: 900 }}>
            {leaderData[0].xp} XP 🔥
          </span>
        </div>

        {/* 3rd Place */}
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '20px', borderTop: '6px solid #CD7F32', textAlign: 'center', background: 'linear-gradient(180deg, rgba(205,127,50,0.1) 0%, rgba(11,15,25,0.8) 100%)' }}>
          <div style={{ fontSize: '2.5rem' }}>🥉</div>
          <div style={{ fontSize: '2.2rem', margin: '0.4rem 0' }}>{leaderData[2].avatar}</div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFF', margin: '0.2rem 0' }}>{leaderData[2].name}</h3>
          <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginBottom: '0.75rem' }}>{leaderData[2].track}</div>
          <span style={{ backgroundColor: 'rgba(205,127,50,0.2)', color: '#FDBA74', padding: '0.35rem 0.85rem', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 800 }}>
            {leaderData[2].xp} XP
          </span>
        </div>

      </div>

      {/* Leaderboard Table */}
      <div className="glass-panel" style={{ marginTop: '2.5rem', padding: '1.5rem', borderRadius: '16px', overflowX: 'auto' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFF', marginBottom: '1.25rem' }}>
          📜 {language === 'ar' ? 'جدول ترتيب المتفوقين الكامل' : 'Complete Honor Roll Rankings'}
        </h3>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: isRtl ? 'right' : 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#94A3B8', fontSize: '0.85rem' }}>
              <th style={{ padding: '0.75rem 1rem' }}># الترتيب</th>
              <th style={{ padding: '0.75rem 1rem' }}>الطالب</th>
              <th style={{ padding: '0.75rem 1rem' }}>المسار الأكاديمي</th>
              <th style={{ padding: '0.75rem 1rem' }}>المعدل (GPA)</th>
              <th style={{ padding: '0.75rem 1rem' }}>الأيام المتوالية</th>
              <th style={{ padding: '0.75rem 1rem' }}>نقاط الخبرة XP</th>
              <th style={{ padding: '0.75rem 1rem' }}>الرتبة الأكاديمية</th>
            </tr>
          </thead>
          <tbody>
            {leaderData.map(student => (
              <tr 
                key={student.rank} 
                style={{
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  backgroundColor: student.rank === 2 ? 'rgba(99,102,241,0.12)' : 'transparent',
                  color: '#FFF',
                  fontSize: '0.9rem'
                }}
              >
                <td style={{ padding: '1rem', fontWeight: 800, color: student.rank <= 3 ? '#F59E0B' : '#94A3B8' }}>
                  #{student.rank}
                </td>
                <td style={{ padding: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{ fontSize: '1.2rem' }}>{student.avatar}</span>
                  <span>{student.name}</span>
                </td>
                <td style={{ padding: '1rem', color: '#CBD5E1', fontSize: '0.85rem' }}>{student.track}</td>
                <td style={{ padding: '1rem', color: '#10B981', fontWeight: 800 }}>{student.gpa}</td>
                <td style={{ padding: '1rem', color: '#06B6D4', fontWeight: 700 }}>{student.streak} يوم 🔥</td>
                <td style={{ padding: '1rem', fontWeight: 900, color: '#F59E0B' }}>{student.xp}</td>
                <td style={{ padding: '1rem', fontSize: '0.8rem' }}>{student.badge}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
