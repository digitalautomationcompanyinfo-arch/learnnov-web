'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function CareerGuidancePage() {
  const { language, isRtl } = useLanguage();
  const [selectedTrack, setSelectedTrack] = useState<'ai' | 'cyber' | 'web'>('ai');
  const [studentSkills, setStudentSkills] = useState<string[]>(['Python', 'Prompt Engineering', 'Next.js']);
  const [newSkill, setNewSkill] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const tracks = {
    ai: {
      title: language === 'ar' ? 'مهندس ذكاء اصطناعي وتطبيقات توليدية (AI Engineer)' : 'Generative AI & LLM Engineer',
      salary: language === 'ar' ? '18,000 - 32,000 ر.س / شهرياً' : '18,000 - 32,000 SAR / Month',
      demand: 'مرتفع جداً 🔥',
      description: language === 'ar' ? 'تصميم وتطوير النماذج التوليدية، تقنيات RAG، وربط الوكلاء الذكيين بالمنظومات المؤسسية.' : 'Build generative models, RAG pipelines, and agentic workflows for enterprise solutions.',
      keySkills: ['Python', 'PyTorch', 'Prompt Engineering', 'LangChain', 'Vector DBs (Pinecone/Qdrant)', 'RAG Architecture'],
      recommendedCourses: ['احتراف هندسة الأوامر والذكاء الاصطناعي', 'بناء وكلاء الذكاء الاصطناعي المستقلين']
    },
    cyber: {
      title: language === 'ar' ? 'مهندس أمن سيبراني واختبار اختراق (Cybersecurity Specialist)' : 'Cybersecurity & Ethical Hacker',
      salary: language === 'ar' ? '16,000 - 28,000 ر.س / شهرياً' : '16,000 - 28,000 SAR / Month',
      demand: 'طلب عالي جداً 🛡️',
      description: language === 'ar' ? 'حماية البنى التحتية، فحص الثغرات الأمنية، واختبار اختراق الشبكات والأنظمة السحابية.' : 'Protect enterprise infrastructure, execute penetration tests, and secure cloud environments.',
      keySkills: ['Network Security', 'Penetration Testing', 'OWASP Top 10', 'Wireshark', 'Metasploit', 'SOC Monitoring'],
      recommendedCourses: ['أساسيات الأمن السيبراني واختبار الاختراق الأخلاقي', 'أمان الشبكات والبروتوكولات']
    },
    web: {
      title: language === 'ar' ? 'مطور تطبيقات ويب متقدمة (Fullstack Next.js Engineer)' : 'Fullstack Web Engineer',
      salary: language === 'ar' ? '15,000 - 25,000 ر.س / شهرياً' : '15,000 - 25,000 SAR / Month',
      demand: 'نمو مستمر 🚀',
      description: language === 'ar' ? 'بناء واجهات برمجية فائقة السرعة مع React 19 و Next.js ورابط قواعد البيانات السحابية.' : 'Develop high-performance web applications using React 19, Next.js, and cloud backend databases.',
      keySkills: ['TypeScript', 'React 19', 'Next.js App Router', 'TailwindCSS', 'Node.js', 'Supabase / PostgreSQL'],
      recommendedCourses: ['بناء تطبيقات الويب الفائقة السرعة بـ Next.js', 'تصميم قواعد البيانات SQL']
    }
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill.trim() && !studentSkills.includes(newSkill.trim())) {
      setStudentSkills([...studentSkills, newSkill.trim()]);
      setNewSkill('');
      setToastMsg(language === 'ar' ? 'تم إضافة المهارة بنجاح إلى ملفك المهني!' : 'Skill added to career profile!');
      setTimeout(() => setToastMsg(null), 3000);
    }
  };

  const currentTrack = tracks[selectedTrack];

  // Calculate Match Percentage
  const matchedSkillsCount = currentTrack.keySkills.filter(s => studentSkills.some(st => st.toLowerCase().includes(s.toLowerCase()))).length;
  const matchPercentage = Math.min(100, Math.round((matchedSkillsCount / currentTrack.keySkills.length) * 100) + 40);

  return (
    <main className="dashboard-container" dir={isRtl ? 'rtl' : 'ltr'} style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto' }}>
      
      {toastMsg && (
        <div style={{ position: 'fixed', bottom: '20px', left: '20px', backgroundColor: '#111827', border: '1px solid #10B981', borderLeft: '4px solid #10B981', color: '#FFF', padding: '0.85rem 1.25rem', borderRadius: '8px', zIndex: 999 }}>
          ✅ {toastMsg}
        </div>
      )}

      {/* Header */}
      <div className="glass-panel profile-header" style={{ borderLeft: '5px solid #10B981', marginBottom: '2rem' }}>
        <div className="profile-avatar" style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', color: 'white', fontSize: '2rem' }}>
          💼
        </div>
        <div className="profile-info">
          <h1>
            {language === 'ar' ? 'مرشد ليرنوف المهني والتوجيه الأكاديمي' : 'LearnNov AI Career Pathfinder'}
          </h1>
          <p>
            {language === 'ar' 
              ? 'تحليل المهارات المكتسبة ومطابقتها مع متطلبات سوق العمل التقني في المملكة والخليج' 
              : 'Match your learned skills with job market demands and technical career paths'}
          </p>
        </div>
      </div>

      {/* Track Switcher */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => setSelectedTrack('ai')}
          style={{ flex: 1, padding: '1rem', borderRadius: '12px', border: selectedTrack === 'ai' ? '2px solid #6366F1' : '1px solid rgba(255,255,255,0.08)', background: selectedTrack === 'ai' ? 'rgba(99,102,241,0.15)' : 'rgba(17,24,39,0.7)', color: '#FFF', fontWeight: 800, cursor: 'pointer', textAlign: 'right' }}
        >
          🤖 {language === 'ar' ? 'مسار الذكاء الاصطناعي (AI)' : 'AI Engineering Track'}
        </button>
        <button
          onClick={() => setSelectedTrack('cyber')}
          style={{ flex: 1, padding: '1rem', borderRadius: '12px', border: selectedTrack === 'cyber' ? '2px solid #10B981' : '1px solid rgba(255,255,255,0.08)', background: selectedTrack === 'cyber' ? 'rgba(16,185,129,0.15)' : 'rgba(17,24,39,0.7)', color: '#FFF', fontWeight: 800, cursor: 'pointer', textAlign: 'right' }}
        >
          🛡️ {language === 'ar' ? 'مسار الأمن السيبراني (Cyber)' : 'Cybersecurity Track'}
        </button>
        <button
          onClick={() => setSelectedTrack('web')}
          style={{ flex: 1, padding: '1rem', borderRadius: '12px', border: selectedTrack === 'web' ? '2px solid #3B82F6' : '1px solid rgba(255,255,255,0.08)', background: selectedTrack === 'web' ? 'rgba(59,130,246,0.15)' : 'rgba(17,24,39,0.7)', color: '#FFF', fontWeight: 800, cursor: 'pointer', textAlign: 'right' }}
        >
          🌐 {language === 'ar' ? 'مسار هندسة البرمجيات (Web)' : 'Fullstack Web Track'}
        </button>
      </div>

      {/* Selected Track Details */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem', marginBottom: '2rem' }}>
        
        {/* Main Career Analysis Panel */}
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, color: '#FFF' }}>{currentTrack.title}</h2>
            <span style={{ backgroundColor: 'rgba(16,185,129,0.2)', color: '#10B981', padding: '0.3rem 0.75rem', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 700 }}>
              {currentTrack.demand}
            </span>
          </div>

          <p style={{ fontSize: '0.9rem', color: '#CBD5E1', lineHeight: '1.6', marginBottom: '1.5rem' }}>{currentTrack.description}</p>

          <div style={{ backgroundColor: '#1E293B', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>{language === 'ar' ? 'متوسط الراتب المتوقع في السوق:' : 'Average Market Salary:'}</span>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#10B981', margin: '0.2rem 0 0 0' }}>{currentTrack.salary}</h3>
          </div>

          <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.75rem', color: '#FFF' }}>
            {language === 'ar' ? 'المهارات المطلوبة لإتقان هذا المسار:' : 'Required Core Skills:'}
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
            {currentTrack.keySkills.map((skill, idx) => (
              <span key={idx} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#F8FAFC', padding: '0.35rem 0.75rem', borderRadius: '8px', fontSize: '0.82rem' }}>
                ✓ {skill}
              </span>
            ))}
          </div>

          <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.75rem', color: '#FFF' }}>
            {language === 'ar' ? 'الدورات الموصى بها لإتمام المسار:' : 'Recommended Courses:'}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {currentTrack.recommendedCourses.map((c, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(99,102,241,0.1)', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid rgba(99,102,241,0.2)' }}>
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#FFF' }}>📚 {c}</span>
                <Link href="/" style={{ color: '#6366F1', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 700 }}>
                  {language === 'ar' ? 'عرض الدورة ←' : 'View Course →'}
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Skill Matcher & CV Builder Side Widget */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Match Score Card */}
          <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: '14px', textAlign: 'center', borderTop: '4px solid #6366F1' }}>
            <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>{language === 'ar' ? 'نسبة الجاهزية والتطابق المهني' : 'Career Readiness Score'}</span>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#6366F1', margin: '0.5rem 0' }}>
              {matchPercentage}%
            </div>
            <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '99px', overflow: 'hidden', marginBottom: '0.75rem' }}>
              <div style={{ width: `${matchPercentage}%`, height: '100%', background: 'linear-gradient(90deg, #6366F1, #10B981)' }}></div>
            </div>
            <span style={{ fontSize: '0.78rem', color: '#10B981', fontWeight: 700 }}>
              {matchPercentage >= 70 ? (language === 'ar' ? 'مؤهل للتقديم على الوظائف!' : 'Ready for Job Applications!') : (language === 'ar' ? 'مستوى متوسط - واصل التعلم' : 'Intermediate - Keep Learning')}
            </span>
          </div>

          {/* Student Skills Inventory */}
          <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: '14px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '0.75rem', color: '#FFF' }}>
              {language === 'ar' ? 'مهاراتك المكتسبة الحالية:' : 'Your Skill Inventory:'}
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
              {studentSkills.map((sk, idx) => (
                <span key={idx} style={{ background: '#1E293B', color: '#10B981', padding: '0.25rem 0.6rem', borderRadius: '6px', fontSize: '0.78rem', border: '1px solid rgba(16,185,129,0.3)' }}>
                  {sk}
                </span>
              ))}
            </div>

            <form onSubmit={handleAddSkill} style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                placeholder={language === 'ar' ? 'إضافة مهارة جديدة...' : 'Add skill...'}
                value={newSkill}
                onChange={e => setNewSkill(e.target.value)}
                style={{ flex: 1, padding: '0.45rem 0.75rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', background: '#0F172A', color: '#FFF', fontSize: '0.8rem' }}
              />
              <button type="submit" style={{ background: '#10B981', color: '#FFF', border: 'none', padding: '0.45rem 0.85rem', borderRadius: '6px', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem' }}>
                +
              </button>
            </form>
          </div>

        </div>

      </div>

    </main>
  );
}
