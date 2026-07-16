import { Course, FreeSession, News, Teacher, DynamicForm, AcademySettings, Registration, ContactMessage, Coupon, ExamQuestion } from './types';

export const INITIAL_SETTINGS: AcademySettings = {
  academyName: "علّمني علوم",
  tagline: "وجهتك الاولى للعبور الى جميع مدارس المتفوقين",
  phone: "01274711669",
  whatsapp: "https://wa.me/201274711669",
  email: "info@allimnyOloom.youssefhatem.com",
  facebookUrl: "https://www.facebook.com/AllimnyOloom/",
  youtubeUrl: "https://youtube.com/@alimny.oloom",
  telegramUrl: "https://t.me/alimny_oloom",
  whatsappChannel: "https://whatsapp.com/channel/0029VbD70Hv2kNFjYSp9XT3y",
  paymentInstructions: "Vodafone Cash: 01274711669\nInstapay ID: sciteach@instapay\nبرجاء إرسال لقطة شاشة لعملية التحويل مع كود الطالب للمتابعة وتفعيل الحساب.",
  aboutText: "نؤهلك لاجتياز اختبارات القبول والتميز في مدارس STEM والضبعة النووية ومدارس التكنولوجيا التطبيقية، مع تنمية مهاراتك العلمية والأكاديمية من خلال برنامج متكامل ومتابعة مستمرة على مدار الساعة لتحقيق أفضل فرص النجاح والقبول.",
  visionText: "بناء جيلٍ من القادة والمبتكرين وصنّاع التغيير، يمتلك المعرفة والمهارات والثقة اللازمة للمنافسة محليًا وعالميًا، ويقود مستقبلًا قائمًا على العلم والإبداع والابتكار.",
  missionText: "تقديم تعليم نوعي يجمع بين التميز الأكاديمي والتطبيق العملي، ويُنمّي مهارات التفكير النقدي وحل المشكلات والإبداع والتكنولوجيا، من خلال بيئة تعليمية حديثة وبرامج متخصصة ومتابعة مستمرة، لتمكين كل طالب من الوصول إلى أقصى إمكاناته وتحقيق أهدافه العلمية والمهنية.",
  stemPrice: 1200,
  stemLecturesCount: 49,
  stemSchedule: "الأحد والأربعاء الساعة 7:00 مساءً",
  stemDiscountPercent: 10,
  stemPreBookingEnded: false
};

export const INITIAL_TEACHERS: Teacher[] = [
  {
    id: "t1",
    name: "أ. أحمد عبد الغني",
    specialty: "كبير معلمي العلوم والفيزياء بمسار STEM",
    bio: "خبرة أكثر من 15 عاماً في تدريب الطلاب على اختبارات القبول لمدارس المتفوقين ومسابقات العلوم الدولية، حائز على دبلومة في مناهج الـ STEM.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300"
  },
  {
    id: "t2",
    name: "د. هبة الشافعي",
    specialty: "أخصائية مهارات التفكير والحل الإبداعي للمشكلات",
    bio: "دكتوراة في التربية وتنمية الذكاء الإبداعي، قامت بتدريب مئات الطلاب على مخرجات القيادة وحل المشكلات المعاصرة بمقاييس عالمية.",
    image: "https://images.unsplash.com/photo-1580894732444-8febeb78fb3e?auto=format&fit=crop&q=80&w=300"
  },
  {
    id: "t3",
    name: "م. محمد رأفت",
    specialty: "رئيس قسم البرمجة والذكاء الاصطناعي والتقني",
    bio: "مهندس برمجيات متخصص في نمذجة الروبوتات وتطبيقات الويب، شغوف بتبسيط تكنولوجيا الغد للأجيال الناشئة من خلال تطبيقات عملية مبتكرة.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300"
  }
];

export const INITIAL_COURSES: Course[] = [
  {
    id: "c1",
    title: "برنامج مسار المتفوقين الشامل (STEM & الضبعة)",
    description: "أقوى برامج الأكاديمية لتأهيل الطلاب لاختبارات قبول مدارس STEM ومدرسة الضبعة النووية والتكنولوجيا التطبيقية.",
    longDescription: "يضم المسار الشامل أكثر من 40 محاضرة تفاعلية تدريبية تركز على شرح مادة الاستعداد الذهني (IQ) والعلوم التطبيقية والرياضيات المتقدمة، حيث يتولى تدريس كل مادة معلم متخصص لضمان التميز الأكاديمي، بالإضافة إلى التدريب الشامل على المقابلات الشخصية التفاعلية وكيفية اجتيازها بثقة. يحتوي الكورس على نماذج امتحانات فعلية دورية وواجبات تصحح الكترونياً لضمان تحقيق التفوق والالتحاق بالمدرسة المستهدفة.",
    price: 1200,
    level: "الصف الثالث الإعدادي",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600",
    lecturesCount: 42,
    duration: "4 شهور",
    isPublished: true,
    category: "STEM"
  },
  {
    id: "c2",
    title: "مبادئ الفيزياء الفلكية والطاقة النووية",
    description: "بوابة المعرفة المخصصة للتحضير لمدرسة الضبعة للطاقة النووية السلمية والعلوم الهندسية المتطورة.",
    longDescription: "يستهدف هذا الكورس تمليك الطلاب المفاتيح الأساسية للفيزياء الحديثة، تركيب الذرة، وتطبيقات الطاقة النووية السلمية، والرياضيات الفيزيائية. الكورس يشمل تجارب معملية ومحاكاة رقمية تلتزم بأعلى قدر من الجودة العلمية.",
    price: 800,
    level: "الشهادة الإعدادية والثانوية",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600",
    lecturesCount: 20,
    duration: "2 شهر",
    isPublished: true,
    category: "علوم"
  },
  {
    id: "c3",
    title: "أساسيات البرمجة وتطوير الويب للفتيان",
    description: "منهج عملي لبناء أولى تطبيقاتك وموقعك الإلكتروني باستخدام التفكير المنطقي ولغة جافاسكريبت.",
    longDescription: "المنهج مصمم للأعمار من 11 لـ 16 سنة لتعليم لغات المستقبل وتطوير المواقع التفاعلية وحل المشكلات بطريقة خوارزمية. يحصل كل طالب في نهاية البرنامج على مشروع تخرج متكامل ينشر أونلاين.",
    price: 650,
    level: "من سن 11 إلى 16 سنة",
    image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=600",
    lecturesCount: 16,
    duration: "1.5 شهر",
    isPublished: true,
    category: "برمجة"
  }
];

export const INITIAL_FORMS: DynamicForm[] = [
  {
    id: "form-stem",
    title: "طلب التسجيل في محاضرة STEM التعريفية المجانية",
    description: "املأ البيانات التالية لحجز مقعدك في البث المباشر القادم للتعريف بمدارس المتفوقين ونظام الامتحانات.",
    fields: [
      { id: "f1", label: "اسم الطالب ثلاثي", type: "text", required: true },
      { id: "f_phone", label: "رقم الهاتف", type: "phone", required: true },
      { id: "f2", label: "المدرسة الحالية", type: "text", required: true },
      { id: "f3", label: "نسبة المجموع المتوقعة (إرشادية %)", type: "number", required: false },
      { id: "f4", label: "المحافظة", type: "select", required: true, options: ["القاهرة", "الجيزة", "الإسكندرية", "الدقهلية", "الغربية", "القليوبية", "الشرقية", "محافظة أخرى"] },
      { id: "f5", label: "نوع التقديم المستهدف", type: "select", required: true, options: ["مدارس STEM للمتفوقين", "مدرسة الضبعة النووية", "مدارس التكنولوجيا التطبيقية", "أخرى"] }
    ]
  },
  {
    id: "form-nuclear",
    title: "الندوة الإرشادية لفرص الالتحاق بمدرسة الضبعة النووية",
    description: "سجل الآن لحضور اللقاء المفتوح مع خبراء الطاقة والمسؤولين لمعرفة شروط التقديم لعام 2026.",
    fields: [
      { id: "fn1", label: "الاسم بالكامل", type: "text", required: true },
      { id: "fn_phone", label: "رقم الهاتف", type: "phone", required: true },
      { id: "fn2", label: "مجموع الصف الثالث الإعدادي (اختياري)", type: "number", required: false },
      { id: "fn3", label: "المحافظة السكنية", type: "text", required: true },
      { id: "fn4", label: "هل تريد الانضمام للجروب الخاص بـ علّمني علوم؟", type: "select", required: true, options: ["نعم، بالتأكيد", "لا، أكتفي بحضور اللقاء"] }
    ]
  },
  {
    id: "form-generic",
    title: "استبيان قياس الاهتمام بمسارات التكنولوجيا والذكاء الاصطناعي",
    description: "تساعدنا إجاباتك على تطوير البرامج الجديدة الملائمة لشغفك وتطلعاتك المستقبلية.",
    fields: [
      { id: "g1", label: "الاسم", type: "text", required: true },
      { id: "g_phone", label: "رقم الهاتف", type: "phone", required: true },
      { id: "g2", label: "أكثر مجال يثير اهتمامك", type: "select", required: true, options: ["علم الروبوتات", "برمجة تطبيقات الهاتف", "تصميم الألعاب", "الذكاء الاصطناعي التوليدي"] },
      { id: "g3", label: "ملاحظات أو أسئلة تود طرحها", type: "textarea", required: false }
    ]
  }
];

export const INITIAL_FREE_SESSIONS: FreeSession[] = [
  {
    id: "fs1",
    title: "المحاضرة التأسيسية المجانية لاختبارات القبول لمدارس STEM",
    slug: "free-session-stem",
    date: "25 يونيو 2026 - الساعة 7:00 مساءً",
    description: "فرصة رائعة للتعرف على شكل الأسئلة، واستراتيجيات الحل السريع لمادة الاستعداد الذهني والمنطقي IQ ومحاور مادة العلوم العامة.",
    formId: "form-stem",
    image: "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=600",
    registeredCount: 142,
    isStemTrack: true
  },
  {
    id: "fs2",
    title: "ندوة تعريفية خاصة بشروط ومزايا مدرسة الضبعة النووية",
    slug: "free-session-nuclear",
    date: "28 يونيو 2026 - الساعة 8:00 مساءً",
    description: "من يملك حق التقديم؟ وكيف تستعد لاختبارات التقييم النفسي والذكاء؟ لقاء مفتوح يجيب عن تساؤلات أولياء الأمور والطلاب.",
    formId: "form-nuclear",
    image: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&q=80&w=600",
    registeredCount: 89,
    isStemTrack: false
  }
];

export const INITIAL_NEWS: News[] = [
  {
    id: "n1",
    title: "صدور الشروط الرسمية للتقديم بمدارس STEM لعام 2026",
    slug: "stem-2026",
    content: "أعلنت وزارة التربية والتعليم والتعليم الفني اليوم الشروط المسبقة لحجز واختبارات التقدم لمدارس المتفوقين في العلوم والتكنولوجيا (STEM). تشمل المعايير حصول الطالب على 98% في المجموع الكلي أو الحصول على الدرجات النهائية في مادتين من ثلاث مواد أساسية: (العلوم - الرياضيات - اللغة الإنجليزية). يبدأ التسجيل الإلكتروني في الأول من يوليو القادم ونعد طلابنا الأعزاء بتأهيل شامل واحترافي كما عهدونا لنجتاز هذه العقبة معاً نحو حلم العباقرة.",
    image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=600",
    date: "18 يونيو 2026"
  },
  {
    id: "n2",
    title: "تحديثات هامة لمدرستنا النووية بالضبعة وزيادة أعداد المقبولين",
    slug: "nuclear-update",
    content: "صرح مصدر رسمي بالإدارة العامة للتعليم الصناعي بوجود خطة لتوسيع الطاقة الاستيعابية لمدرسة الضبعة النووية هذا العام نتيجة لزيادة الكوادر والمنح والاتفاقات. سيتيح هذا زيادة فرصة قبول المتميزين في الرياضيات والذكاء التكنولوجي. تقدم منصة علّمني علوم تدريباً خاصاً يمتد لأكثر من 40 ساعة مكثفة للقبول بالضبعة النووية.",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600",
    date: "14 يونيو 2026"
  }
];

export const INITIAL_REGISTRATIONS: Registration[] = [
  {
    id: "reg1",
    studentCode: "AO100234",
    studentName: "يوسف إبراهيم محمد",
    studentPhone: "01124567890",
    studentEmail: "youssef.ibrahim@example.com",
    senderType: "student",
    currentSchool: "مدرسة طه حسين الإعدادية",
    governorate: "القاهرة",
    courseId: "c1",
    dynamicData: {},
    paymentStatus: "Paid",
    paymentMethod: "فودافون كاش",
    registeredAt: "2026-06-15T14:32:00.000Z",
    pricePaid: 1200
  },
  {
    id: "reg2",
    studentCode: "AO100235",
    studentName: "سارة محمود علي",
    studentPhone: "01598765432",
    studentEmail: "sarah.parent@example.com",
    senderType: "parent",
    currentSchool: "مدرسة أم الأبطال التجريبية",
    governorate: "الجيزة",
    courseId: "c1",
    dynamicData: {},
    paymentStatus: "Pending",
    paymentMethod: "إنستاباي",
    registeredAt: "2026-06-19T09:12:00.000Z",
    pricePaid: 1200
  },
  {
    id: "reg3",
    studentCode: "AO100236",
    studentName: "أدهم هاني محمود",
    studentPhone: "01211122233",
    studentEmail: "adham.coder@example.com",
    senderType: "student",
    currentSchool: "مدرسة اللغات القومية بالرمل",
    governorate: "الإسكندرية",
    courseId: "c3",
    dynamicData: {},
    paymentStatus: "Paid",
    paymentMethod: "تحويل بنكي",
    registeredAt: "2026-06-10T18:45:00.000Z",
    pricePaid: 650
  },
  {
    id: "reg4",
    studentCode: "AO100237",
    studentName: "كريم أحمد جلال",
    studentPhone: "01034343434",
    studentEmail: "karim.stem.free@gmail.com",
    senderType: "student",
    currentSchool: "مدرسة جمال عبد الناصر",
    governorate: "الدقهلية",
    freeSessionId: "fs1",
    dynamicFormId: "form-stem",
    dynamicData: {
      "f1": "كريم أحمد جلال",
      "f2": "مدرسة جمال عبد الناصر",
      "f3": "98.5",
      "f4": "الدقهلية",
      "f5": "مدارس STEM للمتفوقين"
    },
    paymentStatus: "Paid",
    paymentMethod: "مجاني",
    registeredAt: "2026-06-20T11:05:00.000Z",
    pricePaid: 0
  }
];

export const INITIAL_MESSAGES: ContactMessage[] = [
  {
    id: "m1",
    name: "م. أشرف الحسيني (ولي أمر)",
    phone: "01022233344",
    email: "ashraf.parent@yahoo.com",
    senderType: "parent",
    message: "ابني حصل على مجموع 98.7% في الشهادة الإعدادية هذا العام، ونريد الاشتراك مباشرة في مسار المتفوقين للتأهيل لاختمبارات STEM. هل الكورس يبدأ أونلاين بالكامل أم هناك لقاءات تفاعلية؟ شكراً لكم.",
    date: "19 يونيو 2026",
    solved: false
  },
  {
    id: "m2",
    name: "ندى خالد شعبان",
    phone: "01155555555",
    email: "nada.khalid@gmail.com",
    senderType: "student",
    message: "هل يمكنني الالتحاق بكورس البرمجة وأنا أدرس حالياً بالمرحلة الثانوية وليس الإعدادية؟ وهل الشهادة الممنوحة معتمدة من الأكاديمية؟",
    date: "17 يونيو 2026",
    solved: true
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: "cp1",
    code: "STEM10",
    discountType: "percent",
    discountValue: 10,
    isActive: true
  },
  {
    id: "cp2",
    code: "EXCEL20",
    discountType: "percent",
    discountValue: 20,
    isActive: true
  },
  {
    id: "cp3",
    code: "OLM100",
    discountType: "fixed",
    discountValue: 100,
    isActive: true
  }
];

export const INITIAL_EXAM_QUESTIONS: ExamQuestion[] = [
  // --- ENGLISH (1-10) ---
  {
    id: "q_eng_1",
    subject: "english",
    question: "Which best explains why the author begins the text by talking about magical garbage fairies?",
    options: [
      "He is putting a common misconception to rest.",
      "He is trying to get the reader's attention.",
      "He is addressing his concern in a serious way.",
      "He is supporting his argument with evidence."
    ],
    correctAnswer: "He is trying to get the reader's attention.",
    points: 2
  },
  {
    id: "q_eng_2",
    subject: "english",
    question: "Which best defines the meaning of incineration as it is used in the text?",
    options: [
      "To bury waste materials in a large hole",
      "To allow waste products to decompose and become fertilizer",
      "To burn waste materials and harvest the energy",
      "To turn waste materials into products like book covers"
    ],
    correctAnswer: "To burn waste materials and harvest the energy",
    points: 2
  },
  {
    id: "q_eng_3",
    subject: "english",
    question: "Which was not cited in the third paragraph as an issue with landfilling?",
    options: [
      "Landfills are smelly.",
      "Usable materials are wasted in landfills.",
      "Landfills may pollute the water supply.",
      "It is difficult to find locations for landfills."
    ],
    correctAnswer: "Usable materials are wasted in landfills.",
    points: 2
  },
  {
    id: "q_eng_4",
    subject: "english",
    question: "Which conclusion could best be supported with text from the passage?",
    options: [
      "Each method of waste management has its drawbacks.",
      "Recycling is without a doubt the best way to handle waste.",
      "Incineration is the best way to process waste.",
      "All large cities should create massive compost piles."
    ],
    correctAnswer: "Each method of waste management has its drawbacks.",
    points: 2
  },
  {
    id: "q_eng_5",
    subject: "english",
    question: "Which best expresses the main idea of the fourth paragraph?",
    options: [
      "Landfills take up a lot of space.",
      "Composting is good for the soil but it can be hard to do.",
      "The process of composting is very complicated and scientific.",
      "There is a lot of plastic garbage in landfills."
    ],
    correctAnswer: "Composting is good for the soil but it can be hard to do.",
    points: 2
  },
  {
    id: "q_eng_6",
    subject: "english",
    question: "Which best expresses the meaning of the word compacted as it is used in the third paragraph?",
    options: [
      "Garbage is burned before it is thrown in a hole.",
      "Garbage is put in trucks before it is thrown in a hole.",
      "Garbage is crushed smaller before it is thrown in a hole.",
      "Garbage is put in a can before it is thrown in a hole."
    ],
    correctAnswer: "Garbage is crushed smaller before it is thrown in a hole.",
    points: 2
  },
  {
    id: "q_eng_7",
    subject: "english",
    question: "Which best expresses the author's main purpose in writing this?",
    options: [
      "To convince readers to recycle and compost",
      "To persuade readers that recycling is a waste of resources",
      "To compare and contrast recycling and landfilling",
      "To inform readers of methods of waste management"
    ],
    correctAnswer: "To inform readers of methods of waste management",
    points: 2
  },
  {
    id: "q_eng_8",
    subject: "english",
    question: "Which is not included in this text?",
    options: [
      "A description of how trash is collected",
      "A description of the uses of compost",
      "A description of the two methods of incinerating trash",
      "A description of how landfills have advanced over time"
    ],
    correctAnswer: "A description of how trash is collected",
    points: 2
  },
  {
    id: "q_eng_9",
    subject: "english",
    question: "Which best explains why composting is not feasible on a large scale?",
    options: [
      "People wouldn't want to touch all of that gross rotting food.",
      "It would smell too bad in densely populated cities.",
      "It would attract rodents that would spread disease.",
      "Plastic would get into the compost and turn it into a pollutant."
    ],
    correctAnswer: "Plastic would get into the compost and turn it into a pollutant.",
    points: 2
  },
  {
    id: "q_eng_10",
    subject: "english",
    question: "Which title best expresses the main idea of this text?",
    options: [
      "The Magic of Recycling: Bringing Back What Was Once Lost",
      "Methods of Waste Management: Pros and Cons",
      "Recycling, Landfilling, or Composting: Which is Best For You?",
      "Do Your Part: How to Save the Earth by Recycling and Composting"
    ],
    correctAnswer: "Methods of Waste Management: Pros and Cons",
    points: 2
  },

  // --- IQ (11-20) ---
  {
    id: "q_iq_1",
    subject: "iq",
    question: "ما هو العدد التالي في هذه المتتالية؟ 2، 4، 8، 16، 32، ...",
    options: ["40", "48", "64", "50"],
    correctAnswer: "64",
    points: 2
  },
  {
    id: "q_iq_2",
    subject: "iq",
    question: "التناظر اللفظي: القلب : الصدر تشبه العين : ______",
    options: ["الرمش", "الوجه", "الرؤية", "الدمع"],
    correctAnswer: "الوجه",
    points: 2
  },
  {
    id: "q_iq_3",
    subject: "iq",
    question: "كم شهراً في السنة يحتوي على 28 يوماً؟",
    options: ["شهر واحد", "4 أشهر", "6 أشهر", "12 شهراً"],
    correctAnswer: "12 شهراً",
    points: 2
  },
  {
    id: "q_iq_4",
    subject: "iq",
    question: "إذا كان أحمد أطول من علي، وعلي أطول من حسن، فمن هو الأقصر بينهم؟",
    options: ["أحمد", "علي", "حسن", "علي وحسن متساويان"],
    correctAnswer: "حسن",
    points: 2
  },
  {
    id: "q_iq_5",
    subject: "iq",
    question: "ما هو العدد الذي يحل محل علامة الاستفهام؟ 1، 3، 6، 10، ؟",
    options: ["11", "13", "15", "18"],
    correctAnswer: "15",
    points: 2
  },
  {
    id: "q_iq_6",
    subject: "iq",
    question: "ما هي الكلمة الغريبة بين هذه الكلمات؟ [سكين - ملعقة - شوكة - طبق]",
    options: ["سكين", "ملعقة", "شوكة", "طبق"],
    correctAnswer: "طبق",
    points: 2
  },
  {
    id: "q_iq_7",
    subject: "iq",
    question: "إذا كان لديك 3 تفاحات، وأخذتَ مني تفاحتين، فكم تفاحة أصبحت تمتلكها؟",
    options: ["تفاحة واحدة", "تفاحتان", "3 تفاحات", "5 تفاحات"],
    correctAnswer: "تفاحتان",
    points: 2
  },
  {
    id: "q_iq_8",
    subject: "iq",
    question: "شقيق خالك الوحيد نائم على أريكتك، من يكون هذا الشخص؟",
    options: ["عمك", "والدك", "جدك", "ابن عمك"],
    correctAnswer: "والدك",
    points: 2
  },
  {
    id: "q_iq_9",
    subject: "iq",
    question: "ما هو الحرف التالي في هذه المتتالية؟ س، ف، م، أ، م، ...",
    options: ["ن", "ش", "ج", "خ"],
    correctAnswer: "ج",
    points: 2
  },
  {
    id: "q_iq_10",
    subject: "iq",
    question: "إذا كان: 2 + 3 = 10 و 7 + 2 = 63 و 6 + 5 = 66؛ فكم يساوي 8 + 4؟",
    options: ["32", "48", "84", "96"],
    correctAnswer: "96",
    points: 2
  },

  // --- MATH (21-30) ---
  {
    id: "q_math_1",
    subject: "math",
    question: "المثلث ا ب ج فيه اب = 4 سم، ب ج = 9 سم فإن أكبر محيط للمثلث = ..... حيث طول ا ج عدد صحيح",
    options: ["23 سم", "26 سم", "24 سم", "25 سم"],
    correctAnswer: "25 سم",
    points: 2
  },
  {
    id: "q_math_2",
    subject: "math",
    question: "في متوازي أضلاع ا ب ج د إذا كان القطر اج ينصف الزاويتين ج، ا فإن الشكل ا ب ج د يكون:",
    options: ["مستطيل", "مربع", "معين", "لا يشترط أي شكل سابق"],
    correctAnswer: "معين",
    points: 2
  },
  {
    id: "q_math_3",
    subject: "math",
    question: "في الشكل المقابل إذا كان مساحة الجزء المظلل 1/3 مساحة المثلث، فإن النسبة بين مساحة الدائرة إلى مساحة المثلث = .....",
    options: ["1:2", "1:1", "3:2", "2:1"],
    correctAnswer: "3:2",
    points: 2,
    image: "/math_q3.jpg"
  },
  {
    id: "q_math_4",
    subject: "math",
    question: "كرة تمس أوجه مكعب من الداخل، إذا كان طول قطر الكرة 4 سم فإن حجم المكعب = .....",
    options: ["64 سم³", "512 سم³", "400 سم³", "216 سم³"],
    correctAnswer: "64 سم³",
    points: 2
  },
  {
    id: "q_math_5",
    subject: "math",
    question: "متوازي مستطيلات النسبة بين أبعادها 4 : 3 : 2 فإذا كانت مساحته الكلية 208 سم² فإن حجمه يساوي .....",
    options: ["96 سم³", "216 سم³", "24 سم³", "192 سم³"],
    correctAnswer: "192 سم³",
    points: 2
  },
  {
    id: "q_math_6",
    subject: "math",
    question: "المستطيل الذي بعداه س ، س - 5 ومحيطه 26 سم فإن مساحته = .....",
    options: ["12 سم²", "13 سم²", "36 سم²", "144 سم²"],
    correctAnswer: "36 سم²",
    points: 2
  },
  {
    id: "q_math_7",
    subject: "math",
    question: "مثلثان متشابهان النسبة بين محيطيهما (7 : 5) فإذا كانت مساحة الأول 343 فإن مساحة سطح الثاني = .....",
    options: ["225", "245", "175", "350"],
    correctAnswer: "175",
    points: 2
  },
  {
    id: "q_math_8",
    subject: "math",
    question: "∛5 هو:",
    options: ["عدد نسبي وليس عدد صحيح", "عدد طبيعي", "عدد صحيح وليس عدد طبيعي", "عدد غير نسبي"],
    correctAnswer: "عدد غير نسبي",
    points: 2
  },
  {
    id: "q_math_9",
    subject: "math",
    question: "في الشكل المقابل إذا كان L1 || L2 فإن س = .....",
    options: ["30 درجة", "45 درجة", "50 درجة", "40 درجة"],
    correctAnswer: "40 درجة",
    points: 2,
    image: "/math_q9.png"
  },
  {
    id: "q_math_10",
    subject: "math",
    question: "عند إلقاء حجر نرد مرة واحدة فإن احتمال ظهور عدد يقبل القسمة على 7 يساوي:",
    options: ["صفر", "1/7", "1", "-1"],
    correctAnswer: "صفر",
    points: 2
  },

  // --- SCIENCE (31-40) ---
  {
    id: "q_sci_1",
    subject: "science",
    question: "كيف تُسمّى مجموعة الخلايا الّتي لها مبنى مُشابِه ووظيفة مُشترَكة؟",
    options: ["جسم", "عضو", "نسيج", "جهاز"],
    correctAnswer: "نسيج",
    points: 2
  },
  {
    id: "q_sci_2",
    subject: "science",
    question: "ما هي وظيفة غشاء الخليّة؟",
    options: [
      "منع خروج فائض الماء من الخلية",
      "منع دخول فائض الماء إلى الخلية",
      "يُمكّن مروراً حراً للمواد",
      "يُمكّن مروراً مراقباً للمواد"
    ],
    correctAnswer: "يُمكّن مروراً مراقباً للمواد",
    points: 2
  },
  {
    id: "q_sci_3",
    subject: "science",
    question: "أشِّر على الجملة الصّحيحة من بين الجُمل التّالية:",
    options: [
      "غالبيّة النّباتات مبنيّة من خلايا",
      "الحيوانات فقط مبنيّة من خلايا",
      "البكتيريا فقط مبنيّة من خلايا",
      "جميع الكائنات الحيّة مبنيّة من خلايا"
    ],
    correctAnswer: "جميع الكائنات الحيّة مبنيّة من خلايا",
    points: 2
  },
  {
    id: "q_sci_4",
    subject: "science",
    question: "ما الصحيح قولُه عن الجدار في الخليّة النباتيّة؟",
    options: [
      "الجدار يُحدِّّد شكل الخليّة ويحميها",
      "الجدار موجود في الجهة الداخليّة للغشاء",
      "الجدار مُكوَّن من ألياف زلاليّة ودهنيّة",
      "الجدار يسمح بانتقال الموادّ بشكلٍ مراقَبٍ"
    ],
    correctAnswer: "الجدار يُحدِّّد شكل الخليّة ويحميها",
    points: 2
  },
  {
    id: "q_sci_5",
    subject: "science",
    question: "أي مركب من المركبات التالية غير موجود في جميع أنواع الخلايا؟",
    options: ["غشاء الخلية", "جدار الخلية", "السيتوبلازم", "المادة الوراثية DNA"],
    correctAnswer: "جدار الخلية",
    points: 2
  },
  {
    id: "q_sci_6",
    subject: "science",
    question: "إذا نجح العلماء في زراعة بلاستيدات خضراء مأخوذة من نبتة في خلايا جِلْد إنسان، فإنّه من المعقول أنّ جِلْد هذا الإنسان:",
    options: [
      "سيكون محميًّا من الأشعّة",
      "سيكون قادرًا على إنتاج الأوكسجين",
      "سيكون غير نفّاذ للماء",
      "سيكون قادرًا على الاسْمِّرار بسهولة"
    ],
    correctAnswer: "سيكون قادرًا على إنتاج الأوكسجين",
    points: 2
  },
  {
    id: "q_sci_7",
    subject: "science",
    question: "ما الوظيفة الأساسية لمادة الكلوروفيل لدى النباتات? ",
    options: [
      "امتصاص الطاقة الضوئية",
      "تفكيك ثاني أكسيد الكربون",
      "جعل أوراق النباتات سامة للحشرات",
      "وقاية النباتات من الأمراض"
    ],
    correctAnswer: "امتصاص الطاقة الضوئية",
    points: 2
  },
  {
    id: "q_sci_8",
    subject: "science",
    question: "أيّ مما يلي يمثل الترتيب الصحيح لمستويات التنظيم في الكائن الحي من الأصغر إلى الأكبر؟",
    options: [
      "نسيج، عضو، خلية، كائن حي",
      "خلية، نسيج، عضو، جهاز، كائن حي",
      "عضو، نسيج، خلية، جهاز، كائن حي",
      "خلية، عضو، نسيج، كائن حي"
    ],
    correctAnswer: "خلية، نسيج، عضو، جهاز، كائن حي",
    points: 2
  },
  {
    id: "q_sci_9",
    subject: "science",
    question: "أي جزء من الأجزاء التالية موجود فقط في الخلية النباتية وليس في الخلية الحيوانية؟",
    options: ["النواة", "السيتوبلازم", "البلاستيدات الخضراء والجدار الخلوي", "الغشاء البلازمي"],
    correctAnswer: "البلاستيدات الخضراء والجدار الخلوي",
    points: 2
  },
  {
    id: "q_sci_10",
    subject: "science",
    question: "ما الجهاز المسؤول عن حركة جميع أجزاء الجسم؟",
    options: ["الجهاز التنفسي", "الجهاز الهضمي", "الجهاز العصبي", "الجهاز العضلي"],
    correctAnswer: "الجهاز العضلي",
    points: 2
  }
];
