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

const ENGLISH_TRANSLATIONS: Record<string, { question: string; options: string[]; correctAnswer: string }> = {
  q_math_1: {
    question: "In triangle ABC, AB = 4 cm, BC = 9 cm. The maximum perimeter of the triangle = ..... where the length of AC is an integer.",
    options: ["23 cm", "26 cm", "24 cm", "25 cm"],
    correctAnswer: "25 cm"
  },
  q_math_2: {
    question: "In a parallelogram ABCD, if the diagonal AC bisects angles A and C, then the figure ABCD is a:",
    options: ["Rectangle", "Square", "Rhombus", "None of the above is required"],
    correctAnswer: "Rhombus"
  },
  q_math_3: {
    question: "In the opposite figure, if the area of the shaded part is 1/3 of the area of the triangle, then the ratio of the area of the circle to the area of the triangle = .....",
    options: ["1:2", "1:1", "3:2", "2:1"],
    correctAnswer: "3:2"
  },
  q_math_4: {
    question: "A sphere touches the faces of a cube from the inside. If the diameter of the sphere is 4 cm, then the volume of the cube = .....",
    options: ["64 cm³", "512 cm³", "400 cm³", "216 cm³"],
    correctAnswer: "64 cm³"
  },
  q_math_5: {
    question: "A cuboid has dimensions in the ratio 4 : 3 : 2. If its total surface area is 208 cm², then its volume equals .....",
    options: ["96 cm³", "216 cm³", "24 cm³", "192 cm³"],
    correctAnswer: "192 cm³"
  },
  q_math_6: {
    question: "A rectangle has dimensions x and x - 5, and its perimeter is 26 cm. Then its area = .....",
    options: ["12 cm²,", "13 cm²", "36 cm²", "144 cm²"],
    correctAnswer: "36 cm²"
  },
  q_math_7: {
    question: "Two similar triangles have perimeters in the ratio (7 : 5). If the area of the first triangle is 343, then the area of the second triangle = .....",
    options: ["225", "245", "175", "350"],
    correctAnswer: "175"
  },
  q_math_8: {
    question: "∛5 is:",
    options: ["A rational number but not an integer", "A natural number", "An integer but not a natural number", "An irrational number"],
    correctAnswer: "An irrational number"
  },
  q_math_9: {
    question: "In the opposite figure, if L1 || L2, then x = .....",
    options: ["30 degrees", "45 degrees", "50 degrees", "40 degrees"],
    correctAnswer: "40 degrees"
  },
  q_math_10: {
    question: "When a fair die is rolled once, the probability of obtaining a number divisible by 7 is:",
    options: ["Zero", "1/7", "1", "-1"],
    correctAnswer: "Zero"
  },
  q_sci_1: {
    question: "What is a group of cells with similar structure and function called?",
    options: ["Body", "Organ", "Tissue", "System"],
    correctAnswer: "Tissue"
  },
  q_sci_2: {
    question: "What is the function of the cell membrane?",
    options: [
      "Prevents excess water from leaving the cell",
      "Prevents excess water from entering the cell",
      "Allows free passage of substances",
      "Allows controlled passage of substances"
    ],
    correctAnswer: "Allows controlled passage of substances"
  },
  q_sci_3: {
    question: "Select the correct statement from the following:",
    options: [
      "Most plants are made of cells",
      "Only animals are made of cells",
      "Only bacteria are made of cells",
      "All living organisms are made of cells"
    ],
    correctAnswer: "All living organisms are made of cells"
  },
  q_sci_4: {
    question: "Which of the following is correct about the cell wall in a plant cell?",
    options: [
      "The cell wall determines the cell shape and protects it",
      "The cell wall is located on the inner side of the membrane",
      "The cell wall is composed of protein and lipid fibers",
      "The cell wall allows controlled passage of substances"
    ],
    correctAnswer: "The cell wall determines the cell shape and protects it"
  },
  q_sci_5: {
    question: "Which of the following components is not present in all types of cells?",
    options: ["Cell membrane", "Cell wall", "Cytoplasm", "Genetic material (DNA)"],
    correctAnswer: "Cell wall"
  },
  q_sci_6: {
    question: "If scientists succeed in transplanting chloroplasts from a plant into human skin cells, it is reasonable to expect that this human's skin:",
    options: [
      "Will be protected from radiation",
      "Will be able to produce oxygen",
      "Will be impermeable to water",
      "Will be able to tan easily"
    ],
    correctAnswer: "Will be able to produce oxygen"
  },
  q_sci_7: {
    question: "What is the primary function of chlorophyll in plants?",
    options: [
      "Absorbing light energy",
      "Decomposing carbon dioxide",
      "Making plant leaves toxic to insects",
      "Protecting plants from diseases"
    ],
    correctAnswer: "Absorbing light energy"
  },
  q_sci_8: {
    question: "Which of the following represents the correct levels of organization in an organism from smallest to largest?",
    options: [
      "Tissue, Organ, Cell, Organism",
      "Cell, Tissue, Organ, Organ system, Organism",
      "Organ, Tissue, Cell, Organ system, Organism",
      "Cell, Organ, Tissue, Organism"
    ],
    correctAnswer: "Cell, Tissue, Organ, Organ system, Organism"
  },
  q_sci_9: {
    question: "Which of the following parts is found only in plant cells and not in animal cells?",
    options: ["Nucleus", "Cytoplasm", "Chloroplasts and cell wall", "Plasma membrane"],
    correctAnswer: "Chloroplasts and cell wall"
  },
  q_sci_10: {
    question: "Which system is responsible for the movement of all body parts?",
    options: ["Respiratory system", "Digestive system", "Nervous system", "Muscular system"],
    correctAnswer: "Muscular system"
  }
};

export function getQuestionData(q: ExamQuestion, lang: 'ar' | 'en') {
  if (lang === 'en' && (q.subject === 'math' || q.subject === 'science')) {
    const trans = ENGLISH_TRANSLATIONS[q.id];
    if (trans) {
      return {
        ...q,
        question: trans.question,
        options: trans.options,
        correctAnswer: trans.correctAnswer
      };
    }
  }
  return q;
}

interface ExamPageProps {
  questions: ExamQuestion[];
  registrations: Registration[];
  submissions?: ExamSubmission[];
  onAddSubmission: (submission: ExamSubmission) => void;
  onNavigateHome: () => void;
}

export default function ExamPage({ questions, registrations, submissions = [], onAddSubmission, onNavigateHome }: ExamPageProps) {
  // Identification Form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Lookup state
  const [studentCode, setStudentCode] = useState('');

  // Mode and Language Selection
  const [activeTab, setActiveTab] = useState<'full' | 'english_only'>('full');
  const [isEnglishOnly, setIsEnglishOnly] = useState(false);
  const [examLang, setExamLang] = useState<'ar' | 'en'>('ar');

  // Matched User details (for english only search)
  const [matchedStudentName, setMatchedStudentName] = useState('');
  const [matchedStudentEmail, setMatchedStudentEmail] = useState('');

  // Result details
  const [englishOnlyNewScore, setEnglishOnlyNewScore] = useState<number | null>(null);
  const [hasPreviousSub, setHasPreviousSub] = useState(false);

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

  // Check if phone matches any registered student or previous submission
  useEffect(() => {
    const cleanPhone = phone.trim();
    if (cleanPhone.length >= 10) {
      // 1. Check in submissions
      const subMatch = submissions.find(
        s => s.phone.trim() === cleanPhone || s.phone.replace(/^0/, '').trim() === cleanPhone.replace(/^0/, '').trim()
      );
      if (subMatch) {
        setMatchedStudentName(subMatch.name);
        setMatchedStudentEmail(subMatch.email);
        setStudentCode(subMatch.studentCode || '');
        return;
      }

      // 2. Check in registrations
      const regMatch = registrations.find(
        r => r.studentPhone.trim() === cleanPhone || r.studentPhone.replace(/^0/, '').trim() === cleanPhone.replace(/^0/, '').trim()
      );
      if (regMatch) {
        setMatchedStudentName(regMatch.studentName);
        setMatchedStudentEmail(regMatch.studentEmail);
        setStudentCode(regMatch.studentCode || '');
        return;
      }
    }
    
    setMatchedStudentName('');
    setMatchedStudentEmail('');
    setStudentCode('');
  }, [phone, registrations, submissions]);

  // Set name and email from match in english_only mode
  useEffect(() => {
    if (activeTab === 'english_only') {
      if (matchedStudentName) {
        setName(matchedStudentName);
        setEmail(matchedStudentEmail);
      } else {
        setName('');
        setEmail('');
      }
    }
  }, [activeTab, matchedStudentName, matchedStudentEmail]);

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
      const savedIsEnglishOnly = localStorage.getItem('ao_exam_is_english_only') === 'true';
      const savedLang = localStorage.getItem('ao_exam_lang') as 'ar' | 'en' || 'ar';
      
      if (startTime > 0) {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const limit = savedIsEnglishOnly ? 600 : 2400;
        const remaining = limit - elapsed;
        if (remaining > 0) {
          setName(savedName);
          setPhone(savedPhone);
          setEmail(savedEmail);
          setStudentCode(savedCode);
          setIsEnglishOnly(savedIsEnglishOnly);
          setExamLang(savedLang);
          if (savedIsEnglishOnly) {
            setActiveSubject('english');
          }
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
          localStorage.removeItem('ao_exam_is_english_only');
          localStorage.removeItem('ao_exam_lang');
        }
      }
    }
  }, []);

  // Check if they have already completed the exam on this device
  useEffect(() => {
    const completedStatus = localStorage.getItem('ao_exam_completed_status');
    const lastResultStr = localStorage.getItem('ao_exam_last_result');
    if (completedStatus === 'true' && lastResultStr) {
      try {
        const lastResult = JSON.parse(lastResultStr);
        setFinalScore(lastResult.score);
        setTimeSpent(lastResult.timeSpent);
        setSubmittedAtStr(lastResult.date);
        setAnswers(lastResult.answers || {});
        setIsEnglishOnly(!!lastResult.isEnglishOnly);
        setEnglishOnlyNewScore(lastResult.englishOnlyNewScore);
        setHasPreviousSub(!!lastResult.hasPreviousSub);
        setCompleted(true);
      } catch (e) {
        console.error("Error loading completed exam state from localStorage", e);
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

    // Check for duplicate submission
    const cleanPhone = phone.trim();
    const cleanEmail = email.trim().toLowerCase();

    const phoneMatchedSub = cleanPhone.length >= 10 ? submissions.find(s => 
      s.phone && (s.phone.trim() === cleanPhone || s.phone.replace(/^0/, '').trim() === cleanPhone.replace(/^0/, '').trim())
    ) : null;

    const emailMatchedSub = cleanEmail.length > 3 ? submissions.find(s => 
      s.email && s.email.trim().toLowerCase() === cleanEmail
    ) : null;

    const matchedSub = phoneMatchedSub || emailMatchedSub;
    if (matchedSub) {
      const isEnglishAlreadyRetaken = matchedSub.answers?.englishRetaken === "true";
      if (activeTab === 'full') {
        alert("🚨 عذراً، لقد قمت بأداء الاختبار الكامل مسبقاً. يُسمح لك بمحاولة واحدة إضافية لإعادة قسم اللغة الإنجليزية فقط من التبويب المخصص.");
        return;
      } else if (activeTab === 'english_only' && isEnglishAlreadyRetaken) {
        alert("🚨 عذراً، لقد استنفدت فرصة إعادة اختبار اللغة الإنجليزية بالفعل. لا يمكنك دخول الاختبار مجدداً.");
        return;
      }
    }

    setFormSubmitted(true);
    setStarted(true);

    const limit = isEnglishOnly ? 600 : 2400;
    setTimeLeft(limit);

    // Save states to prevent cheating on refresh
    localStorage.setItem('ao_exam_running', 'true');
    localStorage.setItem('ao_exam_student_name', name);
    localStorage.setItem('ao_exam_student_phone', phone);
    localStorage.setItem('ao_exam_student_email', email);
    localStorage.setItem('ao_exam_student_code', studentCode);
    localStorage.setItem('ao_exam_start_time', Date.now().toString());
    localStorage.setItem('ao_exam_is_english_only', isEnglishOnly ? 'true' : 'false');
    localStorage.setItem('ao_exam_lang', examLang);
    if (isEnglishOnly) {
      setActiveSubject('english');
    }
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
      const translatedQ = getQuestionData(q, examLang);
      const selected = answers[q.id];
      if (selected && selected.trim() === translatedQ.correctAnswer.trim()) {
        score += q.points || 2;
      }
    });
    return score;
  };

  const submitExamResults = (finalTimeSpentSeconds: number) => {
    const minutes = Math.floor(finalTimeSpentSeconds / 60);
    const seconds = finalTimeSpentSeconds % 60;
    const timeSpentStr = `${minutes} دقيقة و ${seconds} ثانية`;
    const nowStr = new Date().toLocaleString('ar-EG');

    const cleanPhone = phone.trim();
    const existingSub = submissions.find(s => 
      s.phone.trim() === cleanPhone || 
      s.phone.replace(/^0/, '').trim() === cleanPhone.replace(/^0/, '').trim()
    );

    let finalScoreVal = 0;
    let totalPointsVal = questions.length * 2;
    let updatedAnswers = { ...answers };
    let submissionId = `sub_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const englishQuestions = questions.filter(q => q.subject === 'english');

    if (isEnglishOnly) {
      let newEnglishScore = 0;
      englishQuestions.forEach((q) => {
        const selected = answers[q.id];
        if (selected && selected.trim() === q.correctAnswer.trim()) {
          newEnglishScore += q.points || 2;
        }
      });
      setEnglishOnlyNewScore(newEnglishScore);
      setHasPreviousSub(!!existingSub);

      if (existingSub) {
        let prevEnglishScore = 0;
        englishQuestions.forEach((q) => {
          const selected = existingSub.answers[q.id];
          if (selected && selected.trim() === q.correctAnswer.trim()) {
            prevEnglishScore += q.points || 2;
          }
        });

        finalScoreVal = existingSub.score - prevEnglishScore + newEnglishScore;
        totalPointsVal = existingSub.totalPoints;
        submissionId = existingSub.id;

        updatedAnswers = { ...existingSub.answers };
        englishQuestions.forEach((q) => {
          if (answers[q.id]) {
            updatedAnswers[q.id] = answers[q.id];
          } else {
            delete updatedAnswers[q.id];
          }
        });
        
        // Mark that the student has completed the English retake
        updatedAnswers.englishRetaken = "true";
      } else {
        finalScoreVal = newEnglishScore;
        totalPointsVal = questions.length * 2;
        
        // Even if there was no previous sub, since they took English-only, it counts as their English retake
        updatedAnswers.englishRetaken = "true";
      }
    } else {
      finalScoreVal = calculateScore();
    }

    setFinalScore(finalScoreVal);
    setTimeSpent(timeSpentStr);
    setSubmittedAtStr(nowStr);
    setCompleted(true);

    const submission: ExamSubmission = {
      id: submissionId,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      studentCode: studentCode || undefined,
      score: finalScoreVal,
      totalPoints: totalPointsVal,
      answers: updatedAnswers,
      submittedAt: new Date().toISOString()
    };

    onAddSubmission(submission);

    // Clear active test states
    localStorage.removeItem('ao_exam_running');
    localStorage.removeItem('ao_exam_answers');
    localStorage.removeItem('ao_exam_start_time');
    localStorage.removeItem('ao_exam_is_english_only');
    localStorage.removeItem('ao_exam_lang');
    localStorage.setItem('ao_exam_completed_status', 'true');
    localStorage.setItem('ao_exam_last_result', JSON.stringify({
      score: finalScoreVal,
      timeSpent: timeSpentStr,
      date: nowStr,
      answers: updatedAnswers,
      isEnglishOnly,
      englishOnlyNewScore: isEnglishOnly ? questions.filter(q => q.subject === 'english' && answers[q.id]?.trim() === q.correctAnswer.trim()).length * 2 : undefined,
      hasPreviousSub: !!existingSub
    }));
  };

  const handleManualSubmit = () => {
    setShowConfirmSubmit(false);
    const startTime = Number(localStorage.getItem('ao_exam_start_time') || Date.now());
    const spent = Math.floor((Date.now() - startTime) / 1000);
    const limit = isEnglishOnly ? 600 : 2400;
    submitExamResults(Math.min(spent, limit));
  };

  const handleAutoSubmit = () => {
    const limit = isEnglishOnly ? 600 : 2400;
    submitExamResults(limit);
    alert(`⏳ انتهى الوقت المحدد للاختبار (${isEnglishOnly ? '10 دقائق' : '40 دقيقة'})! تم تسليم إجاباتك تلقائياً.`);
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

  const cleanPhone = phone.trim();
  const cleanEmail = email.trim().toLowerCase();

  const phoneMatchedSub = cleanPhone.length >= 10 ? submissions.find(s => 
    s.phone && (s.phone.trim() === cleanPhone || s.phone.replace(/^0/, '').trim() === cleanPhone.replace(/^0/, '').trim())
  ) : null;

  const emailMatchedSub = cleanEmail.length > 3 ? submissions.find(s => 
    s.email && s.email.trim().toLowerCase() === cleanEmail
  ) : null;

  const duplicateSubmission = phoneMatchedSub || emailMatchedSub;
  const isEnglishAlreadyRetaken = duplicateSubmission?.answers?.englishRetaken === "true";

  // Block status based on activeTab
  const isBlocked = duplicateSubmission 
    ? (activeTab === 'full' || isEnglishAlreadyRetaken)
    : false;

  const subjectsOrder: ('english' | 'iq' | 'math' | 'science')[] = ['english', 'iq', 'math', 'science'];

  const englishQuestionsCount = questions.filter(q => q.subject === 'english').length;
  const totalQuestionsToSolveCount = isEnglishOnly ? englishQuestionsCount : questions.length;
  const answeredCount = isEnglishOnly
    ? questions.filter(q => q.subject === 'english' && answers[q.id]).length
    : Object.keys(answers).length;
  const progressPercent = Math.round((answeredCount / totalQuestionsToSolveCount) * 100);

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
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">البوابة الإلكترونية للاختبارات</h1>
            <p className="text-slate-400 text-sm">أكاديمية علّمني علوم - بوابة العبور لمدارس المتفوقين STEM</p>
          </div>

          {/* Premium Tab Selector */}
          <div className="flex border border-slate-700/60 rounded-2xl p-1 bg-slate-900/60">
            <button
              type="button"
              onClick={() => {
                setActiveTab('full');
                setIsEnglishOnly(false);
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeTab === 'full'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-450 hover:text-white hover:bg-slate-750/30'
              }`}
            >
              📝 الاختبار الكامل (40 دقيقة)
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('english_only');
                setIsEnglishOnly(true);
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeTab === 'english_only'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-450 hover:text-white hover:bg-slate-750/30'
              }`}
            >
              🇬🇧 اختبار الإنجليزي فقط (10 دقائق)
            </button>
          </div>

          {/* Rules and Information */}
          <div className="bg-slate-700/30 border border-slate-700 rounded-2xl p-5 text-sm space-y-3">
            <h3 className="font-extrabold text-blue-400 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" />
              تعليمات وضوابط الاختبار الهامّة:
            </h3>
            {activeTab === 'full' ? (
              <ul className="list-disc list-inside space-y-2 text-slate-300">
                <li>يتكون الاختبار من <strong>40 سؤالاً</strong> (10 أسئلة لكل مادة: علوم، رياضيات، ذكاء، وإنجليزي).</li>
                <li>الزمن المحدد للاختبار <strong>40 دقيقة</strong> يبدأ فور الضغط على بدء الاختبار.</li>
                <li>يتم احتساب <strong>درجتين</strong> لكل سؤال، والمجموع الكلي من <strong>80 درجة</strong>.</li>
                <li>يرجى إدخال بياناتك بدقة للتعرف على كود الطالب الخاص بك وحفظ نتيجتك فوراً.</li>
                <li>يمكنك اختيار لغة أسئلة العلوم والرياضيات (عربي أو إنجليزي) بالأسفل.</li>
              </ul>
            ) : (
              <ul className="list-disc list-inside space-y-2 text-slate-300">
                <li>يتكون الاختبار من <strong>10 أسئلة</strong> في مادة اللغة الإنجليزية فقط.</li>
                <li>الزمن المحدد للاختبار <strong>10 دقائق</strong> يبدأ فور الضغط على بدء الاختبار.</li>
                <li>يتم احتساب <strong>درجتين</strong> لكل سؤال، والمجموع الكلي من <strong>20 درجة</strong>.</li>
                <li>عند تسليم هذا الاختبار، سيتم تلقائياً <strong>حذف أي درجة سابقة</strong> حصلت عليها في قسم الإنجليزية واستبدالها بالدرجة الجديدة في نتيجتك الكلية.</li>
              </ul>
            )}
          </div>

          <form onSubmit={handleStartExam} className="space-y-4">
            {/* Phone input field (Always visible and first in English-only mode) */}
            {activeTab === 'english_only' ? (
              <>
                <div className="space-y-1 font-mono">
                  <label className="text-xs font-bold text-slate-400 block">رقم الهاتف (الواتساب المسجل سابقاً)</label>
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

                {matchedStudentName ? (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-blue-950/40 border border-blue-800/80 rounded-2xl p-4 flex items-start gap-2.5 text-blue-450 text-xs font-bold"
                  >
                    <CheckCircle className="w-5 h-5 shrink-0 text-blue-400" />
                    <div>
                      <p className="text-blue-300">👋 مرحباً بك يا {matchedStudentName}!</p>
                      <p className="mt-1 text-slate-300">تم العثور على بيانات تسجيلك السابقة بنجاح.</p>
                      <p className="mt-0.5 text-blue-400/80">سيتم تحديث نتيجتك المسجلة تحت الكود: <span className="font-mono text-white text-sm">{studentCode || 'AO100XXX'}</span> فور إنهائك للاختبار.</p>
                    </div>
                  </motion.div>
                ) : phone.trim().length >= 10 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-amber-950/30 border border-amber-800/50 rounded-2xl p-4 space-y-4"
                  >
                    <div className="flex items-start gap-2.5 text-amber-400 text-xs font-bold">
                      <AlertCircle className="w-5 h-5 shrink-0 text-amber-400" />
                      <div>
                        <p className="text-amber-300">⚠️ رقم الهاتف هذا غير مسجل في الاختبارات السابقة.</p>
                        <p className="mt-0.5 text-amber-500/80">للبدء كاختبار جديد، يرجى ملء اسمك وبريدك الإلكتروني بالأسفل لتسجيل نتيجة جديدة:</p>
                      </div>
                    </div>

                    <div className="space-y-4 border-t border-slate-700/60 pt-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 block">الاسم ثلاثي أو رباعي</label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            placeholder="محمد أحمد علي..."
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl py-3 px-4 pr-10 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all font-bold"
                          />
                          <User className="w-4 h-4 text-slate-500 absolute top-4 right-3.5" />
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
                            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl py-3 px-4 pr-10 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all font-bold"
                          />
                          <Mail className="w-4 h-4 text-slate-500 absolute top-4 right-3.5" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : null}
              </>
            ) : (
              <>
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

                {/* Language selection for Science and Math */}
                <div className="space-y-1 pt-2">
                  <label className="text-xs font-bold text-slate-455 block mb-1.5">لغة أسئلة العلوم والرياضيات:</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setExamLang('ar')}
                      className={`py-3 px-4 rounded-xl border text-center text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        examLang === 'ar'
                          ? 'bg-blue-600/10 border-blue-500 text-white shadow-sm font-extrabold'
                          : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span>🇸🇦</span>
                      <span>العربية (العربية)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setExamLang('en')}
                      className={`py-3 px-4 rounded-xl border text-center text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        examLang === 'en'
                          ? 'bg-blue-600/10 border-blue-500 text-white shadow-sm font-extrabold'
                          : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span>🇬🇧</span>
                      <span>English (الإنجليزية)</span>
                    </button>
                  </div>
                </div>
              </>
            )}

            {studentCode && activeTab === 'full' && !duplicateSubmission && (
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

            {/* Case 1: Already took Full, and currently viewing Full Tab */}
            {duplicateSubmission && activeTab === 'full' && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-amber-950/40 border border-amber-800/85 rounded-2xl p-4 flex items-start gap-2.5 text-amber-455 text-xs font-bold text-right"
              >
                <AlertCircle className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
                <div>
                  <p className="text-amber-300 font-extrabold text-sm">⚠️ تم أداء الاختبار الكامل مسبقاً</p>
                  <p className="mt-1 text-slate-300 leading-relaxed font-bold">
                    عذراً، هذا الحساب مسجل باسم (<strong>{duplicateSubmission.name}</strong>) وقد أدى الاختبار الكامل بالفعل.
                  </p>
                  <p className="mt-1.5 text-amber-400">
                    يمكنك الانتقال لعلامة التبويب الأخرى **"اختبار الإنجليزية فقط"** بالأعلى لتحسين درجتك (فرصة واحدة فقط).
                  </p>
                </div>
              </motion.div>
            )}

            {/* Case 2: Already took Full, currently viewing English-only Tab, and has NOT retaken English yet */}
            {duplicateSubmission && activeTab === 'english_only' && !isEnglishAlreadyRetaken && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-emerald-950/40 border border-emerald-800/80 rounded-2xl p-4 flex items-start gap-2.5 text-emerald-450 text-xs font-bold text-right"
              >
                <CheckCircle className="w-5 h-5 shrink-0 text-emerald-400 mt-0.5" />
                <div>
                  <p className="text-emerald-300 font-extrabold text-sm">🌟 فرصة إعادة قسم اللغة الإنجليزية</p>
                  <p className="mt-1 text-slate-300 leading-relaxed font-bold">
                    مرحباً بك يا <strong>{duplicateSubmission.name}</strong>. لديك فرصة **واحدة إضافية** لإعادة قسم اللغة الإنجليزية فقط.
                  </p>
                  <p className="mt-1.5 text-emerald-400/90 font-bold">
                    عند الانتهاء والتسليم، سيتم تحديث نتيجتك الإجمالية بالدرجة الجديدة وحفظها تلقائياً.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Case 3: Already took English-only retake (Blocked completely) */}
            {duplicateSubmission && activeTab === 'english_only' && isEnglishAlreadyRetaken && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-rose-950/40 border border-rose-800/80 rounded-2xl p-4 flex items-start gap-2.5 text-rose-455 text-xs font-bold text-right"
              >
                <AlertCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
                <div>
                  <p className="text-rose-300 font-extrabold text-sm">⚠️ استنفاد كافة المحاولات المتاحة</p>
                  <p className="mt-1 text-slate-300 leading-relaxed font-bold">
                    لقد استنفدت بالفعل محاولة الاختبار الكامل وفرصة إعادة قسم اللغة الإنجليزية لهذا الحساب.
                  </p>
                  <p className="mt-1.5 text-rose-400 font-bold">غير مسموح بأداء الاختبار أو التعديل عليه مرة أخرى.</p>
                </div>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isBlocked}
              className={`w-full py-3.5 px-4 rounded-xl font-bold transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 mt-4 text-base ${
                isBlocked 
                  ? 'bg-slate-800 text-slate-500 border border-slate-700/50 cursor-not-allowed shadow-none active:scale-100' 
                  : 'bg-gradient-to-l from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white hover:shadow-blue-500/20 cursor-pointer'
              }`}
            >
              <span>{activeTab === 'full' ? 'ابدأ الاختبار الكامل الآن' : 'ابدأ اختبار الإنجليزية فقط'}</span>
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
    const nextSubject = !isEnglishOnly && activeIndex < 3 ? subjectsOrder[activeIndex + 1] : null;
    const prevSubject = !isEnglishOnly && activeIndex > 0 ? subjectsOrder[activeIndex - 1] : null;

    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 pb-24 font-sans" dir="rtl">
        {/* Sticky Header */}
        <header className="sticky top-0 bg-slate-900/95 backdrop-blur border-b border-slate-800 z-30 shadow-md">
          <div className="max-w-5xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center text-xl shadow-inner">
                {isEnglishOnly ? '🇬🇧' : '⚡'}
              </div>
              <div>
                <h1 className="text-sm sm:text-base font-black text-white">
                  {isEnglishOnly ? 'اختبار اللغة الإنجليزية' : 'الاختبار التقييمي العام'}
                </h1>
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
          <div className={isEnglishOnly ? "max-w-3xl mx-auto space-y-6" : "grid grid-cols-1 lg:grid-cols-4 gap-6"}>
            
            {/* Sidebar Navigation - Subject tabs */}
            {!isEnglishOnly && (
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
            )}

            {/* Questions area */}
            <div className={isEnglishOnly ? "space-y-6" : "lg:col-span-3 space-y-6"}>
              
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
                {activeSubject === 'english' && (
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm" dir="ltr">
                    <div className="flex items-center gap-2 border-b border-slate-850 pb-3">
                      <span className="text-xl">📖</span>
                      <h3 className="text-base font-black text-white">Reading Comprehension Passage</h3>
                    </div>
                    <div className="text-slate-350 text-xs sm:text-sm leading-relaxed space-y-4 font-sans select-text text-left">
                      <p className="font-extrabold text-blue-400">Please read the following passage carefully, then answer the questions below:</p>
                      <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-850/80 whitespace-pre-line text-justify font-sans">
                        {`Garbage cans are not magical portals. Trash does not disappear when you toss it in a can. Yet, the average American throws away an estimated 1,600 pounds of waste each year. If there are no magic garbage fairies, where does all that trash go?

There are four methods to managing waste: recycling, landfilling, composting, and incinerating. Each method has its strengths and weaknesses. Let's take a quick look at each. 

Recycling is the process of turning waste into new materials. For example, used paper can be turned into paperboard, which can be used to make book covers. Recycling can reduce pollution, save materials, and lower energy use. Yet, some argue that recycling wastes energy. They believe that collecting, processing, and converting waste uses more energy than it saves. Still, most people agree that recycling is better for the planet than landfilling. 

Landfilling is the oldest method of managing waste. In its simplest form, landfilling is when people bury garbage in a hole. Over time the practice of landfilling has advanced. Garbage is compacted before it is thrown into the hole. In this way, more garbage can fit in each landfill. Large liners are placed in the bottom of landfills so that toxic garbage juice doesn't get into the groundwater. Sadly, these liners don't always work. Landfills may pollute the local water supply. Not to mention that all of that garbage stinks. Nobody wants to live next to a landfill. This makes it hard to find new locations for landfills. 

As landfill space increases, interest in composting grows. Composting is when people pile up organic matter, such as food waste, and allow it to decompose. The product of this decomposition is compost. Compost can be added to the soil to make the soil richer and better for growing crops. While composting is easy to do onsite somewhere, like home or school, it's hard to do after the garbage gets all mixed up. This is because plastic and other inorganic materials must be removed from the compost pile or they will pollute the soil. There's a lot of plastic in garbage, which makes it hard to compost on a large scale. 

One thing that is easier to do is burning garbage. There are two main ways to incinerate waste. The first is to create or harvest a fuel from the waste, such as methane gas, and burn the fuel. The second is to burn the waste directly. The heat from the incineration process can boil water, which can power steam generators.`}
                      </div>
                    </div>
                  </div>
                )}

                {activeQuestions.map((originalQ, idx) => {
                  const q = getQuestionData(originalQ, examLang);
                  const globalIndex = questions.indexOf(originalQ) + 1;
                  const selectedVal = answers[originalQ.id];

                  return (
                    <motion.div
                      key={originalQ.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-slate-900 border border-slate-850 rounded-2xl p-5 space-y-4 shadow-sm hover:border-slate-800 transition-all text-right"
                    >
                      <div className="flex gap-2.5 items-start">
                        <span className="bg-blue-600/10 border border-blue-500/20 text-blue-400 px-2 py-0.5 rounded-lg text-xs font-mono font-bold mt-0.5 shrink-0">
                          س {globalIndex}
                        </span>
                        <h3 className={`text-sm sm:text-base font-black text-white leading-relaxed whitespace-pre-line ${activeSubject === 'english' ? 'text-left' : 'text-right'}`} dir={activeSubject === 'english' ? 'ltr' : 'rtl'}>
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
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2" dir={activeSubject === 'english' || (examLang === 'en' && (activeSubject === 'math' || activeSubject === 'science')) ? 'ltr' : 'rtl'}>
                        {q.options.map((opt, oIdx) => {
                          const isSel = selectedVal === opt;
                          const letter = examLang === 'en' || activeSubject === 'english'
                            ? ['A', 'B', 'C', 'D'][oIdx] || String(oIdx + 1)
                            : ['أ', 'ب', 'ج', 'د'][oIdx] || String(oIdx + 1);

                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => handleSelectOption(originalQ.id, opt)}
                              className={`w-full flex items-center gap-3 p-3.5 rounded-xl border text-right text-xs sm:text-sm font-bold transition-all cursor-pointer active:scale-[0.99] ${
                                isSel 
                                  ? 'bg-blue-600/10 border-blue-500 text-white shadow-md' 
                                  : 'bg-slate-850/60 border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white'
                              } ${activeSubject === 'english' || (examLang === 'en' && (activeSubject === 'math' || activeSubject === 'science')) ? 'text-left' : 'text-right'}`}
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

            {isEnglishOnly && (
              <div className="max-w-md mx-auto bg-slate-950/50 border border-slate-800/80 rounded-2xl p-4 text-right text-xs font-bold space-y-2 mt-2">
                <p className="text-blue-400 text-sm">💡 تفاصيل تحديث درجة اللغة الإنجليزية:</p>
                <ul className="list-disc list-inside space-y-1.5 text-slate-350">
                  <li>درجة اللغة الإنجليزية الجديدة: <strong className="text-white text-sm font-mono">{englishOnlyNewScore}</strong> من 20 درجة.</li>
                  {hasPreviousSub ? (
                    <li className="text-emerald-400">🎉 تم العثور على نتيجتك السابقة وحفظ النتيجة الكلية المعدلة بنجاح ({finalScore} من 80).</li>
                  ) : (
                    <li className="text-amber-400">ℹ️ تم حفظ نتيجتك كاختبار جديد للغة الإنجليزية فقط ({englishOnlyNewScore} من 20).</li>
                  )}
                </ul>
              </div>
            )}

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
                      {subjQs.map((originalQ) => {
                        const q = getQuestionData(originalQ, examLang);
                        const globalIndex = questions.indexOf(originalQ) + 1;
                        const selectedVal = answers[originalQ.id];
                        const isCorrect = selectedVal?.trim() === q.correctAnswer.trim();

                        return (
                          <div 
                            key={originalQ.id} 
                            className={`p-4 rounded-xl border text-xs sm:text-sm space-y-2 transition-all ${
                              isCorrect 
                                ? 'bg-emerald-950/15 border-emerald-900/60' 
                                : 'bg-rose-950/15 border-rose-900/60'
                            }`}
                          >
                            <div className="flex gap-2 items-start" dir={subj === 'english' || (examLang === 'en' && (subj === 'math' || subj === 'science')) ? 'ltr' : 'rtl'}>
                              <span className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold shrink-0 mt-0.5 ${
                                isCorrect ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                              }`}>
                                س {globalIndex}
                              </span>
                               <h4 className={`font-extrabold text-white leading-relaxed ${subj === 'english' || (examLang === 'en' && (subj === 'math' || subj === 'science')) ? 'text-left' : 'text-right'}`}>{q.question}</h4>
                            </div>

                            {q.image && (
                              <div className="my-2 max-w-xs overflow-hidden rounded-lg border border-slate-800 bg-slate-950 mx-auto">
                                <img 
                                  src={q.image} 
                                  alt={`رسم توضيحي للسؤال ${globalIndex}`} 
                                  className="w-full h-auto object-contain max-h-40 mx-auto block" 
                                />
                              </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1.5 font-bold text-xs" dir={subj === 'english' || (examLang === 'en' && (subj === 'math' || subj === 'science')) ? 'ltr' : 'rtl'}>
                              <div className={subj === 'english' || (examLang === 'en' && (subj === 'math' || subj === 'science')) ? 'text-left' : 'text-right'}>
                                <span className="text-slate-400 block mb-0.5">إجابتك:</span>
                                <span className={isCorrect ? 'text-emerald-400 font-extrabold' : 'text-rose-400 font-extrabold'}>
                                  {selectedVal || '(لم تجب)'}
                                </span>
                              </div>
                              {!isCorrect && (
                                <div className={subj === 'english' || (examLang === 'en' && (subj === 'math' || subj === 'science')) ? 'text-left' : 'text-right'}>
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
