import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Clock, 
  User, 
  Phone, 
  Mail, 
  Award, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle, 
  AlertCircle, 
  HelpCircle,
  BookOpen,
  BrainCircuit,
  Binary,
  Flame,
  ArrowRight
} from 'lucide-react';
import { ExamQuestion, ExamSubmission, Registration } from '../types';

interface ExamPageProps {
  questions: ExamQuestion[];
  registrations: Registration[];
  onAddSubmission: (submission: ExamSubmission) => void;
  onNavigateHome: () => void;
}

export default function ExamPage({ questions, registrations, onAddSubmission, onNavigateHome }: ExamPageProps) {
  // Identification Form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Lookup state
  const [studentCode, setStudentCode] = useState('');

  // Exam state
  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(2400); // 40 minutes in seconds
  const [activeSubject, setActiveSubject] = useState<'english' | 'iq' | 'math' | 'science'>('english');
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

  // Result state
  const [completed, setCompleted] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [timeSpent, setTimeSpent] = useState('');
  const [submittedAtStr, setSubmittedAtStr] = useState('');

  // Check if phone matches any registered student
  useEffect(() => {
    const cleanPhone = phone.trim();
    if (cleanPhone.length >= 10) {
      const match = registrations.find(
        r => r.studentPhone.trim() === cleanPhone || r.studentPhone.replace(/^0/, '').trim() === cleanPhone.replace(/^0/, '').trim()
      );
      if (match && match.studentCode) {
        setStudentCode(match.studentCode);
      } else {
        setStudentCode('');
      }
    } else {
      setStudentCode('');
    }
  }, [phone, registrations]);

  // Check if there is an active exam saved in localStorage
  useEffect(() => {
    const savedRunning = localStorage.getItem('ao_exam_running');
    if (savedRunning === 'true') {
      const savedName = localStorage.getItem('ao_exam_student_name') || '';
      const savedPhone = localStorage.getItem('ao_exam_student_phone') || '';
      const savedEmail = localStorage.getItem('ao_exam_student_email') || '';
      const savedCode = localStorage.getItem('ao_exam_student_code') || '';
      const savedAnswers = localStorage.getItem('ao_exam_answers');
      const startTime = Number(localStorage.getItem('ao_exam_start_time') || 0);
      
      if (startTime > 0) {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const remaining = 2400 - elapsed;
        if (remaining > 0) {
          setName(savedName);
          setPhone(savedPhone);
          setEmail(savedEmail);
          setStudentCode(savedCode);
          if (savedAnswers) {
            setAnswers(JSON.parse(savedAnswers));
          }
          setTimeLeft(remaining);
          setFormSubmitted(true);
          setStarted(true);
        } else {
          // If time limit passed while away, auto-submit what was saved
          localStorage.removeItem('ao_exam_running');
          localStorage.removeItem('ao_exam_answers');
          localStorage.removeItem('ao_exam_start_time');
        }
      }
    }
  }, []);

  // Sync answers to localstorage
  useEffect(() => {
    if (started && !completed) {
      localStorage.setItem('ao_exam_answers', JSON.stringify(answers));
    }
  }, [answers, started, completed]);

  // Timer countdown
  useEffect(() => {
    if (!started || completed) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [started, completed]);

  const handleStartExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !email.trim()) return;

    setFormSubmitted(true);
    setStarted(true);

    // Save states to prevent cheating on refresh
    localStorage.setItem('ao_exam_running', 'true');
    localStorage.setItem('ao_exam_student_name', name);
    localStorage.setItem('ao_exam_student_phone', phone);
    localStorage.setItem('ao_exam_student_email', email);
    localStorage.setItem('ao_exam_student_code', studentCode);
    localStorage.setItem('ao_exam_start_time', Date.now().toString());
  };

  const handleSelectOption = (questionId: string, optionText: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionText
    }));
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q) => {
      const selected = answers[q.id];
      if (selected && selected.trim() === q.correctAnswer.trim()) {
        score += q.points || 2;
      }
    });
    return score;
  };

  const submitExamResults = (finalTimeSpentSeconds: number) => {
    const score = calculateScore();
    const minutes = Math.floor(finalTimeSpentSeconds / 60);
    const seconds = finalTimeSpentSeconds % 60;
    const timeSpentStr = `${minutes} دقيقة و ${seconds} ثانية`;
    const nowStr = new Date().toLocaleString('ar-EG');

    setFinalScore(score);
    setTimeSpent(timeSpentStr);
    setSubmittedAtStr(nowStr);
    setCompleted(true);

    // Save submission to database
    const submissionId = `sub_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const submission: ExamSubmission = {
      id: submissionId,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      studentCode: studentCode || undefined,
      score,
      totalPoints: questions.length * 2,
      answers,
      submittedAt: new Date().toISOString()
    };

    onAddSubmission(submission);

    // Clear active test states
    localStorage.removeItem('ao_exam_running');
    localStorage.removeItem('ao_exam_answers');
    localStorage.removeItem('ao_exam_start_time');
    localStorage.setItem('ao_exam_completed_status', 'true');
    localStorage.setItem('ao_exam_last_result', JSON.stringify({
      score,
      timeSpent: timeSpentStr,
      date: nowStr,
      answers
    }));
  };

  const handleManualSubmit = () => {
    setShowConfirmSubmit(false);
    const startTime = Number(localStorage.getItem('ao_exam_start_time') || Date.now());
    const spent = Math.floor((Date.now() - startTime) / 1000);
    submitExamResults(Math.min(spent, 2400));
  };

  const handleAutoSubmit = () => {
    submitExamResults(2400);
    alert('⏳ انتهى الوقت المحدد للاختبار (40 دقيقة)! تم تسليم إجاباتك تلقائياً.');
  };

  // Format time (MM:SS)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Filter questions for active subject
  const activeQuestions = questions.filter(q => q.subject === activeSubject);

  // Subject translation
  const subjectNames = {
    english: 'اللغة الإنجليزية',
    iq: 'الذكاء (IQ)',
    math: 'الرياضيات',
    science: 'العلوم'
  };

  const subjectsOrder: ('english' | 'iq' | 'math' | 'science')[] = ['english', 'iq', 'math', 'science'];

  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round((answeredCount / questions.length) * 100);

  // Render identification form
  if (!started && !completed) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center" dir="rtl">
        <div className="max-w-xl w-full bg-slate-800 rounded-3xl p-8 border border-slate-700/60 shadow-2xl space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/30 rounded-2xl flex items-center justify-center text-3xl mx-auto text-blue-400 shadow-md">
              📝
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">الاختبار التقييمي العام</h1>
            <p className="text-slate-400 text-sm">أكاديمية علّمني علوم - بوابة العبور لمدارس المتفوقين STEM</p>
          </div>

          <div className="bg-slate-700/40 border border-slate-700 rounded-2xl p-5 text-sm space-y-3">
            <h3 className="font-extrabold text-blue-400 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" />
              تعليمات وضوابط الاختبار الهامّة:
            </h3>
            <ul className="list-disc list-inside space-y-2 text-slate-300">
              <li>يتكون الاختبار من <strong>40 سؤالاً</strong> (10 أسئلة لكل مادة: علوم، رياضيات، ذكاء، وإنجليزي).</li>
              <li>الزمن المحدد للاختبار <strong>40 دقيقة</strong> يبدأ فور الضغط على بدء الاختبار.</li>
              <li>يتم احتساب <strong>درجتين</strong> لكل سؤال، والمجموع الكلي من <strong>80 درجة</strong>.</li>
              <li>يرجى إدخال بياناتك بدقة للتعرف على كود الطالب الخاص بك وحفظ نتيجتك فوراً.</li>
              <li>في حال إغلاق الصفحة أو التحديث، سيبقى المؤقت مستمراً وسيتم الاحتفاظ بإجاباتك.</li>
            </ul>
          </div>

          <form onSubmit={handleStartExam} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 block">الاسم ثلاثي أو رباعي</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="محمد أحمد علي..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 pr-10 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all font-bold"
                />
                <User className="w-4 h-4 text-slate-500 absolute top-4 right-3.5" />
              </div>
            </div>

            <div className="space-y-1 font-mono">
              <label className="text-xs font-bold text-slate-400 block">رقم الهاتف (الواتساب)</label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  placeholder="01xxxxxxxxx"
                  pattern="^01[0-9]{9}$"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 pr-10 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all font-bold"
                />
                <Phone className="w-4 h-4 text-slate-500 absolute top-4 right-3.5" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 block">البريد الإلكتروني</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="student@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 pr-10 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all font-bold"
                />
                <Mail className="w-4 h-4 text-slate-500 absolute top-4 right-3.5" />
              </div>
            </div>

            {studentCode && (
              <motion.div 
                initial={{ opacity: 0, y: 5 }} 
                animate={{ opacity: 1, y: 0 }}
                className="bg-emerald-950/40 border border-emerald-800/80 rounded-2xl p-4 flex items-start gap-2.5 text-emerald-400 text-xs font-bold"
              >
                <CheckCircle className="w-5 h-5 shrink-0 text-emerald-400" />
                <div>
                  <p className="text-emerald-300">🎉 تم التعرف على كود الطالب الخاص بك تلقائياً!</p>
                  <p className="mt-1 font-mono text-white text-sm">كود الطالب: {studentCode}</p>
                  <p className="mt-0.5 text-emerald-500/80">سيتم ربط وحفظ النتيجة تحت اسمك في قاعدة بيانات الأكاديمية.</p>
                </div>
              </motion.div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-l from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3.5 px-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-blue-500/20 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 mt-4 text-base"
            >
              <span>ابدأ الاختبار الآن</span>
              <ChevronLeft className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Render active exam layout
  if (started && !completed) {
    const activeIndex = subjectsOrder.indexOf(activeSubject);
    const nextSubject = activeIndex < 3 ? subjectsOrder[activeIndex + 1] : null;
    const prevSubject = activeIndex > 0 ? subjectsOrder[activeIndex - 1] : null;

    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 pb-24 font-sans" dir="rtl">
        {/* Sticky Header */}
        <header className="sticky top-0 bg-slate-900/95 backdrop-blur border-b border-slate-800 z-30 shadow-md">
          <div className="max-w-5xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center text-xl shadow-inner">
                ⚡
              </div>
              <div>
                <h1 className="text-sm sm:text-base font-black text-white">الاختبار التقييمي</h1>
                <p className="text-slate-400 text-xs hidden sm:block">الطالب: {name} {studentCode && <span className="font-mono text-blue-400">({studentCode})</span>}</p>
              </div>
            </div>

            {/* Timer Block */}
            <div className={`flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-2xl border text-sm font-black transition-all ${
              timeLeft < 300 
                ? 'bg-rose-950/60 border-rose-500 text-rose-400 animate-pulse' 
                : timeLeft < 600 
                ? 'bg-amber-950/40 border-amber-600 text-amber-400' 
                : 'bg-slate-850 border-slate-700 text-white'
            }`}>
              <Clock className="w-4 h-4" />
              <span className="font-mono tracking-wider">{formatTime(timeLeft)}</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-800 h-1">
            <div 
              className="bg-gradient-to-l from-blue-500 to-indigo-500 h-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </header>

        {/* Main Body */}
        <main className="max-w-5xl mx-auto px-4 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* Sidebar Navigation - Subject tabs */}
            <div className="lg:col-span-1 space-y-2">
              <div className="bg-slate-900 border border-slate-850 p-3 rounded-2xl space-y-1.5">
                <span className="text-xs font-black text-slate-500 block px-2.5 mb-2">أقسام الاختبار:</span>
                
                {[
                  { id: 'english', label: 'اللغة الإنجليزية', icon: BookOpen, color: 'text-sky-400 bg-sky-950/40' },
                  { id: 'iq', label: 'اختبار الذكاء (IQ)', icon: BrainCircuit, color: 'text-pink-400 bg-pink-950/40' },
                  { id: 'math', label: 'الرياضيات', icon: Binary, color: 'text-amber-400 bg-amber-950/40' },
                  { id: 'science', label: 'العلوم والتكنولوجيا', icon: Flame, color: 'text-emerald-400 bg-emerald-950/40' }
                ].map((subj) => {
                  const Icon = subj.icon;
                  const isAct = activeSubject === subj.id;
                  // Count answered in this subject
                  const subjQs = questions.filter(q => q.subject === subj.id);
                  const subjAns = subjQs.filter(q => answers[q.id]).length;

                  return (
                    <button
                      key={subj.id}
                      onClick={() => setActiveSubject(subj.id as any)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                        isAct 
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/10' 
                          : 'bg-slate-850 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-lg ${isAct ? 'bg-white/20 text-white' : subj.color}`}>
                          <Icon className="w-4 h-4 text-slate-300" />
                        </div>
                        <span>{subj.label}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                        isAct ? 'bg-white/20 text-white' : 'bg-slate-900 text-slate-400'
                      }`}>
                        {subjAns} / {subjQs.length}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Progress Panel */}
              <div className="bg-slate-900 border border-slate-850 p-4 rounded-2xl text-center space-y-2.5 hidden lg:block">
                <div className="text-xs font-bold text-slate-400">الإجابات المنجزة</div>
                <div className="text-3xl font-black text-white font-mono">{answeredCount} <span className="text-sm font-bold text-slate-500">/ {questions.length}</span></div>
                <div className="text-[10px] text-slate-500 font-bold">بمعدل درجتين لكل سؤال صحيح</div>
              </div>
            </div>

            {/* Questions area */}
            <div className="lg:col-span-3 space-y-6">
              
              {/* Category Header */}
              <div className="bg-gradient-to-l from-blue-900/30 to-indigo-900/30 border border-blue-800/30 p-4 rounded-2xl flex items-center gap-3">
                <span className="text-2xl">
                  {activeSubject === 'english' ? '🇬🇧' : activeSubject === 'iq' ? '🧠' : activeSubject === 'math' ? '📐' : '🧬'}
                </span>
                <div>
                  <h2 className="text-base font-black text-white">{subjectNames[activeSubject]}</h2>
                  <p className="text-slate-400 text-xs mt-0.5">قسم يحتوي على 10 أسئلة، كل سؤال بدرجتين.</p>
                </div>
              </div>

              {/* Questions List */}
              <div className="space-y-4">
                {activeQuestions.map((q, idx) => {
                  const globalIndex = questions.indexOf(q) + 1;
                  const selectedVal = answers[q.id];

                  return (
                    <motion.div
                      key={q.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-slate-900 border border-slate-850 rounded-2xl p-5 space-y-4 shadow-sm hover:border-slate-800 transition-all"
                    >
                      <div className="flex gap-2.5 items-start">
                        <span className="bg-blue-600/10 border border-blue-500/20 text-blue-400 px-2 py-0.5 rounded-lg text-xs font-mono font-bold mt-0.5 shrink-0">
                          س {globalIndex}
                        </span>
                        <h3 className="text-sm sm:text-base font-black text-white leading-relaxed whitespace-pre-line">
                          {q.question}
                        </h3>
                      </div>

                      {q.image && (
                        <div className="my-3 max-w-sm overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
                          <img 
                            src={q.image} 
                            alt={`رسم توضيحي للسؤال ${globalIndex}`} 
                            className="w-full h-auto object-contain max-h-56 mx-auto block" 
                          />
                        </div>
                      )}

                      {/* Options Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                        {q.options.map((opt, oIdx) => {
                          const isSel = selectedVal === opt;
                          const letter = ['أ', 'ب', 'ج', 'د'][oIdx] || String(oIdx + 1);

                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => handleSelectOption(q.id, opt)}
                              className={`w-full flex items-center gap-3 p-3.5 rounded-xl border text-right text-xs sm:text-sm font-bold transition-all cursor-pointer active:scale-[0.99] ${
                                isSel 
                                  ? 'bg-blue-600/10 border-blue-500 text-white shadow-md' 
                                  : 'bg-slate-850/60 border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white'
                              }`}
                            >
                              <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-mono shrink-0 transition-all ${
                                isSel ? 'bg-blue-500 text-white' : 'bg-slate-900 text-slate-400'
                              }`}>
                                {letter}
                              </span>
                              <span className="leading-snug">{opt}</span>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Navigation controls */}
              <div className="flex items-center justify-between pt-4 gap-4">
                {prevSubject ? (
                  <button
                    onClick={() => setActiveSubject(prevSubject)}
                    className="flex items-center gap-1 bg-slate-900 hover:bg-slate-850 text-white border border-slate-800 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                    <span>القسم السابق ({subjectNames[prevSubject]})</span>
                  </button>
                ) : (
                  <div />
                )}

                {nextSubject ? (
                  <button
                    onClick={() => setActiveSubject(nextSubject)}
                    className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    <span>القسم التالي ({subjectNames[nextSubject]})</span>
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => setShowConfirmSubmit(true)}
                    className="flex items-center gap-1.5 bg-gradient-to-l from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-3 rounded-xl text-sm font-black transition-all shadow-lg hover:shadow-emerald-500/20 active:scale-[0.98] cursor-pointer"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>تسليم وإنهاء الاختبار</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* Confirmation Modal overlay */}
        <AnimatePresence>
          {showConfirmSubmit && (
            <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 text-center relative overflow-hidden"
              >
                <div className="w-14 h-14 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-2xl flex items-center justify-center text-2xl mx-auto">
                  ⚠️
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-black text-white">هل أنت متأكد من تسليم الإجابات؟</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    لقد أجبت على <strong className="text-white font-mono text-sm">{answeredCount}</strong> سؤالاً من أصل <strong className="text-white font-mono text-sm">{questions.length}</strong>.
                    بمجرد التسليم لن تتمكن من تعديل إجاباتك أو دخول الاختبار مرة أخرى.
                  </p>
                </div>

                {answeredCount < questions.length && (
                  <div className="bg-rose-950/30 border border-rose-900/50 rounded-2xl p-3 text-rose-400 text-xs font-bold leading-normal">
                    🚨 تنبيه: هناك {questions.length - answeredCount} سؤالاً بدون إجابة، ننصحك بالرجوع وحلها أولاً!
                  </div>
                )}

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={handleManualSubmit}
                    className="flex-1 bg-gradient-to-l from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-2.5 rounded-xl text-xs font-bold transition-all shadow-md active:scale-[0.98] cursor-pointer"
                  >
                    نعم، تسليم الإجابات
                  </button>
                  <button
                    onClick={() => setShowConfirmSubmit(false)}
                    className="flex-1 bg-slate-850 hover:bg-slate-800 text-slate-300 border border-slate-800 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    تراجع وإكمال الحل
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Render completed success screen
  if (completed) {
    const totalPoints = questions.length * 2;
    const scorePercent = Math.round((finalScore / totalPoints) * 100);
    
    // Rating logic
    let rating = 'يحتاج لمزيد من التدريب';
    let ratingColor = 'text-rose-400';
    let ratingEmoji = '📚';
    if (scorePercent >= 90) {
      rating = 'عبقري / متفوق بامتياز';
      ratingColor = 'text-emerald-400';
      ratingEmoji = '👑';
    } else if (scorePercent >= 80) {
      rating = 'ممتاز جداً';
      ratingColor = 'text-teal-400';
      ratingEmoji = '🌟';
    } else if (scorePercent >= 65) {
      rating = 'جيد جداً';
      ratingColor = 'text-blue-400';
      ratingEmoji = '👍';
    } else if (scorePercent >= 50) {
      rating = 'مقبول / ناجح';
      ratingColor = 'text-amber-400';
      ratingEmoji = '✔️';
    }

    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center" dir="rtl">
        <div className="max-w-3xl w-full space-y-6">
          
          {/* Header Score summary */}
          <div className="bg-slate-900 border border-slate-850 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden text-center">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="space-y-2">
              <span className="text-4xl sm:text-5xl">{ratingEmoji}</span>
              <h1 className="text-xl sm:text-2xl font-black text-white">تهانينا! تم إتمام الاختبار بنجاح</h1>
              <p className="text-slate-400 text-xs sm:text-sm">نشكرك على إكمال اختبار الاستعداد والتقييم للقبول بمسار المتفوقين.</p>
            </div>

            {/* Score Ring indicator */}
            <div className="py-4 flex justify-center">
              <div className="relative w-36 h-36 rounded-full border-4 border-slate-800 flex flex-col justify-center items-center bg-slate-950/80 shadow-inner">
                <span className="text-xs font-bold text-slate-400">النتيجة النهائية</span>
                <span className="text-4xl font-black text-white font-mono mt-1">{finalScore}</span>
                <span className="text-xs font-bold text-slate-500 font-mono mt-0.5">/ {totalPoints} درجة</span>
              </div>
            </div>

            {/* Rating breakdown details */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800/80 text-right">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 block">النسبة المئوية</span>
                <span className="text-sm sm:text-base font-black text-white font-mono">{scorePercent}%</span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 block">التقييم العام</span>
                <span className={`text-xs sm:text-sm font-black ${ratingColor}`}>{rating}</span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 block">الوقت المستغرق</span>
                <span className="text-xs sm:text-sm font-black text-white">{timeSpent}</span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 block">تاريخ التسليم</span>
                <span className="text-[10px] sm:text-xs font-black text-slate-300 font-mono">{submittedAtStr}</span>
              </div>
            </div>
            
            <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={onNavigateHome}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center gap-1 shadow-md"
              >
                <ArrowRight className="w-4 h-4" />
                <span>العودة للموقع الرئيسي</span>
              </button>
            </div>
          </div>

          {/* Detailed Question Review */}
          <div className="bg-slate-900 border border-slate-850 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
            <h2 className="text-sm sm:text-base font-black text-white border-b border-slate-800 pb-3 flex items-center gap-2">
              <span>📊 مراجعة وتفاصيل الإجابات للأسئلة:</span>
            </h2>

            <div className="space-y-6 pt-2">
              {subjectsOrder.map((subj) => {
                const subjQs = questions.filter(q => q.subject === subj);
                
                return (
                  <div key={subj} className="space-y-3">
                    <h3 className="text-xs font-black text-slate-400 bg-slate-850 px-3 py-1.5 rounded-lg inline-block">
                      {subjectNames[subj]}
                    </h3>

                    <div className="space-y-3">
                      {subjQs.map((q) => {
                        const globalIndex = questions.indexOf(q) + 1;
                        const selectedVal = answers[q.id];
                        const isCorrect = selectedVal?.trim() === q.correctAnswer.trim();

                        return (
                          <div 
                            key={q.id} 
                            className={`p-4 rounded-xl border text-xs sm:text-sm space-y-2 transition-all ${
                              isCorrect 
                                ? 'bg-emerald-950/15 border-emerald-900/60' 
                                : 'bg-rose-950/15 border-rose-900/60'
                            }`}
                          >
                            <div className="flex gap-2 items-start">
                              <span className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold shrink-0 mt-0.5 ${
                                isCorrect ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                              }`}>
                                س {globalIndex}
                              </span>
                               <h4 className="font-extrabold text-white leading-relaxed">{q.question}</h4>
                            </div>

                            {q.image && (
                              <div className="my-2 max-w-xs overflow-hidden rounded-lg border border-slate-800 bg-slate-950">
                                <img 
                                  src={q.image} 
                                  alt={`رسم توضيحي للسؤال ${globalIndex}`} 
                                  className="w-full h-auto object-contain max-h-40 mx-auto block" 
                                />
                              </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1.5 font-bold text-xs">
                              <div>
                                <span className="text-slate-400 block mb-0.5">إجابتك:</span>
                                <span className={isCorrect ? 'text-emerald-400 font-extrabold' : 'text-rose-400 font-extrabold'}>
                                  {selectedVal || '(لم تجب)'}
                                </span>
                              </div>
                              {!isCorrect && (
                                <div>
                                  <span className="text-slate-400 block mb-0.5">الإجابة الصحيحة:</span>
                                  <span className="text-emerald-400 font-extrabold">
                                    {q.correctAnswer}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    );
  }

  return null;
}
