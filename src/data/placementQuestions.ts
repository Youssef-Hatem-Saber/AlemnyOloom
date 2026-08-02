import { PlacementQuestion } from '../types';

export interface InterestQuestion {
  id: string;
  question: string;
  options: {
    text: string;
    weights: Record<string, number>;
  }[];
}

// ==========================================
// 1. GENERAL PROGRAMMING & LOGIC QUESTIONS (40 Questions)
// ==========================================
export const GENERAL_QUESTIONS: PlacementQuestion[] = [
  // VERY EASY (5 Questions)
  {
    id: "g_ve_1",
    category: "general",
    difficulty: "very_easy",
    question: "ما هي نتيجة تشغيل الكود التالي:\nlet x = 5;\nlet y = x++;\nconsole.log(y, x);",
    options: ["5 6", "6 6", "5 5", "6 5"],
    correctAnswer: "5 6",
    points: 2
  },
  {
    id: "g_ve_2",
    category: "general",
    difficulty: "very_easy",
    question: "أي نوع من أنواع البيانات التالية يمثل قيمة منطقية صحيحة أو خاطئة (True / False)؟",
    options: ["String", "Integer", "Boolean", "Float"],
    correctAnswer: "Boolean",
    points: 2
  },
  {
    id: "g_ve_3",
    category: "general",
    difficulty: "very_easy",
    question: "في لغات البرمجة، ما هي الكلمة المفتاحية المستخدمة لتعريف دالة (Function) في لغة Python؟",
    options: ["function", "def", "func", "void"],
    correctAnswer: "def",
    points: 2
  },
  {
    id: "g_ve_4",
    category: "general",
    difficulty: "very_easy",
    question: "ما هي نتيجة العملية الحسابية التالية في معظم لغات البرمجة: 17 % 5؟",
    options: ["3", "2", "1", "0"],
    correctAnswer: "2",
    points: 2
  },
  {
    id: "g_ve_5",
    category: "general",
    difficulty: "very_easy",
    question: "أي الرموز التالية يستخدم للمقارنة المنطقية للتأكد من تساوي القيمتين والنوع معاً (Strict Equality) في لغة JS؟",
    options: ["=", "==", "===", "!="],
    correctAnswer: "===",
    points: 2
  },

  // EASY (5 Questions)
  {
    id: "g_e_1",
    category: "general",
    difficulty: "easy",
    question: "ما هي نتيجة الكود التالي:\nlet a = [1, 2, 3];\nlet b = [...a, 4];\nconsole.log(b);",
    options: ["[1, 2, 3, 4]", "[[1, 2, 3], 4]", "[1, 2, 3]", "Error"],
    correctAnswer: "[1, 2, 3, 4]",
    points: 2
  },
  {
    id: "g_e_2",
    category: "general",
    difficulty: "easy",
    question: "أي من الحلقات التالية تُنفذ الكود الخاص بها مرة واحدة على الأقل حتى وإن كان الشرط خاطئاً من البداية؟",
    options: ["while loop", "for loop", "do-while loop", "foreach loop"],
    correctAnswer: "do-while loop",
    points: 2
  },
  {
    id: "g_e_3",
    category: "general",
    difficulty: "easy",
    question: "ما هي القيمة المخزنة في المتغير z بعد تنفيذ هذا الكود:\nlet x = 10, y = 20;\nlet z = (x > y) ? x : y;",
    options: ["10", "20", "true", "false"],
    correctAnswer: "20",
    points: 2
  },
  {
    id: "g_e_4",
    category: "general",
    difficulty: "easy",
    question: "ماذا يسمى استدعاء الدالة لنفسها داخل كودها الخاص؟",
    options: ["Recursion (الاستدعاء الذاتي)", "Iteration (التكرار)", "Overloading (زيادة التحميل)", "Encapsulation"],
    correctAnswer: "Recursion (الاستدعاء الذاتي)",
    points: 2
  },
  {
    id: "g_e_5",
    category: "general",
    difficulty: "easy",
    question: "أي من الخيارات التالية يمثل الطريقة الصحيحة لإضافة تعليق سطر واحد (Single-line Comment) في لغة C++؟",
    options: ["# Comment", "// Comment", "/* Comment */", "<!-- Comment -->"],
    correctAnswer: "// Comment",
    points: 2
  },

  // MEDIUM (5 Questions)
  {
    id: "g_m_1",
    category: "general",
    difficulty: "medium",
    question: "ما هي نتيجة الكود التالي:\nfunction test() {\n  console.log(x);\n  var x = 10;\n}\ntest();",
    options: ["10", "ReferenceError: x is not defined", "undefined", "null"],
    correctAnswer: "undefined",
    points: 2
  },
  {
    id: "g_m_2",
    category: "general",
    difficulty: "medium",
    question: "أي من تراكيب البيانات (Data Structures) يعمل وفق مبدأ 'الداخل أولاً يخرج أولاً' (FIFO)؟",
    options: ["Stack (المكدس)", "Queue (الطابور)", "Binary Tree", "Graph"],
    correctAnswer: "Queue (الطابور)",
    points: 2
  },
  {
    id: "g_m_3",
    category: "general",
    difficulty: "medium",
    question: "ما هي القيمة الناتجة عن استدعاء الدالة التالية solve(4):\nfunction solve(n) {\n  if (n <= 1) return 1;\n  return n * solve(n - 1);\n}",
    options: ["4", "10", "24", "120"],
    correctAnswer: "24",
    points: 2
  },
  {
    id: "g_m_4",
    category: "general",
    difficulty: "medium",
    question: "في البرمجة الكائنية (OOP)، ما هي الميزة التي تسمح لكائن جديد بوراثة الخصائص والدوال من كائن أب؟",
    options: ["Polymorphism (تعدد الأشكال)", "Inheritance (الوراثة)", "Encapsulation (الكبسلة)", "Abstraction"],
    correctAnswer: "Inheritance (الوراثة)",
    points: 2
  },
  {
    id: "g_m_5",
    category: "general",
    difficulty: "medium",
    question: "ماذا سينتج عن تشغيل الكود التالي:\nconsole.log(typeof NaN);",
    options: ["'number'", "'NaN'", "'undefined'", "'object'"],
    correctAnswer: "'number'",
    points: 2
  },

  // ABOVE MEDIUM (5 Questions)
  {
    id: "g_am_1",
    category: "general",
    difficulty: "above_medium",
    question: "ما هي نتيجة تشغيل هذا الكود في JavaScript:\nlet a = { x: 1 };\nlet b = { x: 1 };\nconsole.log(a === b, a.x === b.x);",
    options: ["true true", "false false", "false true", "true false"],
    correctAnswer: "false true",
    points: 2
  },
  {
    id: "g_am_2",
    category: "general",
    difficulty: "above_medium",
    question: "ما هو تعقيد الوقت (Time Complexity) للبحث الثنائي (Binary Search) في مصفوفة مرتبة في أسوأ الحالات؟",
    options: ["O(1)", "O(N)", "O(log N)", "O(N log N)"],
    correctAnswer: "O(log N)",
    points: 2
  },
  {
    id: "g_am_3",
    category: "general",
    difficulty: "above_medium",
    question: "ما هي نتيجة تشغيل الكود التالي:\nlet arr = [1, 2, 3, 4];\nlet res = arr.reduce((acc, curr) => acc + curr, 10);\nconsole.log(res);",
    options: ["10", "20", "24", "14"],
    correctAnswer: "20",
    points: 2
  },
  {
    id: "g_am_4",
    category: "general",
    difficulty: "above_medium",
    question: "أي من المفاهيم التالية يعني الحفاظ على البيانات الحساسة داخل كائن ومنع الوصول المباشر إليها إلا من خلال دوال مخصصة؟",
    options: ["Abstraction", "Inheritance", "Encapsulation (الكبسلة)", "Polymorphism"],
    correctAnswer: "Encapsulation (الكبسلة)",
    points: 2
  },
  {
    id: "g_am_5",
    category: "general",
    difficulty: "above_medium",
    question: "ماذا يطبع الكود التالي:\nlet s1 = 'Hello';\nlet s2 = s1;\ns2 = 'World';\nconsole.log(s1);",
    options: ["Hello", "World", "HelloWorld", "Error"],
    correctAnswer: "Hello",
    points: 2
  },

  // HARD (5 Questions)
  {
    id: "g_h_1",
    category: "general",
    difficulty: "hard",
    question: "ما هي نتيجة الكود التالي:\nlet x = [1, 2, 3];\nlet y = x;\ny.push(4);\nconsole.log(x.length);",
    options: ["3", "4", "5", "Error"],
    correctAnswer: "4",
    points: 2
  },
  {
    id: "g_h_2",
    category: "general",
    difficulty: "hard",
    question: "ماذا سينتج عن تشغيل هذا الكود:\nsetTimeout(() => console.log('A'), 0);\nPromise.resolve().then(() => console.log('B'));\nconsole.log('C');",
    options: ["A B C", "C B A", "C A B", "B C A"],
    correctAnswer: "C B A",
    points: 2
  },
  {
    id: "g_h_3",
    category: "general",
    difficulty: "hard",
    question: "ما هو المفهوم الذي تعبر عنه دالة تمتلك حق الوصول إلى متغيرات النطاق الأبوي لها (Lexical Scope) حتى بعد انتهائه؟",
    options: ["Closure (الإغلاق)", "Hoisting (الرفع)", "Recursion", "Currying"],
    correctAnswer: "Closure (الإغلاق)",
    points: 2
  },
  {
    id: "g_h_4",
    category: "general",
    difficulty: "hard",
    question: "أي من الخوارزميات التالية تستخدم لترتيب البيانات بكفاءة تعقيد زمنية O(N log N) في أسوأ الأحوال وتعتمد على مبدأ فرق تسد؟",
    options: ["Bubble Sort", "Insertion Sort", "Merge Sort", "Selection Sort"],
    correctAnswer: "Merge Sort",
    points: 2
  },
  {
    id: "g_h_5",
    category: "general",
    difficulty: "hard",
    question: "ماذا سينتج عن تشغيل هذا الكود في JavaScript:\nconsole.log(1 + '2' + 3);",
    options: ["6", "123", "15", "NaN"],
    correctAnswer: "123",
    points: 2
  },

  // VERY HARD (5 Questions)
  {
    id: "g_vh_1",
    category: "general",
    difficulty: "very_hard",
    question: "ماذا سينتج عن تشغيل هذا الكود:\nconst obj = { prop: 42 };\nObject.freeze(obj);\nobj.prop = 33;\nconsole.log(obj.prop);",
    options: ["33", "42", "undefined", "TypeError (في الوضع الصارم)"],
    correctAnswer: "42",
    points: 2
  },
  {
    id: "g_vh_2",
    category: "general",
    difficulty: "very_hard",
    question: "ما هو تعقيد المساحة (Space Complexity) الإضافي للدوال التكرارية العمياء التي تستدعي ذاتها N مرة (Recursion Call Stack)؟",
    options: ["O(1)", "O(N)", "O(log N)", "O(N²)"],
    correctAnswer: "O(N)",
    points: 2
  },
  {
    id: "g_vh_3",
    category: "general",
    difficulty: "very_hard",
    question: "ما هي نتيجة مقارنة المصفوفات التالية في JavaScript:\nconsole.log([] == ![]);",
    options: ["true", "false", "TypeError", "undefined"],
    correctAnswer: "true",
    points: 2
  },
  {
    id: "g_vh_4",
    category: "general",
    difficulty: "very_hard",
    question: "أي من المفاهيم التالية في قواعد البيانات (Database Systems) يضمن سلامة البيانات ومنع حدوث تعارض عند إجراء العمليات المتزامنة؟",
    options: ["Indexing", "Normalization", "ACID Transactions", "Sharding"],
    correctAnswer: "ACID Transactions",
    points: 2
  },
  {
    id: "g_vh_5",
    category: "general",
    difficulty: "very_hard",
    question: "ما هي نتيجة تشغيل الكود التالي:\nlet x = null;\nconsole.log(typeof x);",
    options: ["'null'", "'undefined'", "'object'", "'value'"],
    correctAnswer: "'object'",
    points: 2
  },

  // PROFESSIONAL (5 Questions)
  {
    id: "g_p_1",
    category: "general",
    difficulty: "professional",
    question: "ما هو الفرق الأساسي بين العمليات والعمليات المتعددة (Process vs Thread)؟",
    options: [
      "الـ Process تشارك الذاكرة مع العمليات الأخرى، بينما الـ Thread يمتلك ذاكرة مستقلة تماماً.",
      "الـ Process يمتلك مساحة عنوان ذاكرة مستقلة (Address Space)، بينما الـ Threads تشترك في نفس ذاكرة العملية الأبوية.",
      "الـ Thread أبطأ بكثير في الإنشاء والتبديل (Context Switching) من الـ Process.",
      "لا يوجد فرق بينهما، كلاهما مصطلحين لنفس الشيء."
    ],
    correctAnswer: "الـ Process يمتلك مساحة عنوان ذاكرة مستقلة (Address Space)، بينما الـ Threads تشترك في نفس ذاكرة العملية الأبوية.",
    points: 2
  },
  {
    id: "g_p_2",
    category: "general",
    difficulty: "professional",
    question: "ما هو تعقيد الوقت لخوارزمية دايجسترا (Dijkstra's Algorithm) لإيجاد أقصر مسار عند استخدام مصفوفة المجاورة (Adjacency Matrix)؟",
    options: ["O(V + E)", "O(V²)", "O(E log V)", "O(V³)"],
    correctAnswer: "O(V²)",
    points: 2
  },
  {
    id: "g_p_3",
    category: "general",
    difficulty: "professional",
    question: "ماذا يطلق على مشكلة الانتظار اللانهائي حيث تحظر عمليتان بعضهما البعض بانتظار تحرير الموارد المشتركة؟",
    options: ["Race Condition", "Deadlock (الاستعصاء)", "Starvation", "Throttling"],
    correctAnswer: "Deadlock (الاستعصاء)",
    points: 2
  },
  {
    id: "g_p_4",
    category: "general",
    difficulty: "professional",
    question: "ما هي نتيجة تشغيل هذا الكود:\nconst add = (a) => (b) => a + b;\nconst addFive = add(5);\nconsole.log(addFive(3));",
    options: ["8", "15", "Error", "undefined"],
    correctAnswer: "8",
    points: 2
  },
  {
    id: "g_p_5",
    category: "general",
    difficulty: "professional",
    question: "أي من أنماط التصميم (Design Patterns) يستخدم للحصول على نسخة وحيدة فقط من كائن ما على مستوى التطبيق بالكامل؟",
    options: ["Factory Pattern", "Observer Pattern", "Singleton Pattern", "Decorator Pattern"],
    correctAnswer: "Singleton Pattern",
    points: 2
  },

  // EXPERT (5 Questions)
  {
    id: "g_ex_1",
    category: "general",
    difficulty: "expert",
    question: "ماذا سينتج عن تشغيل هذا الكود:\nconsole.log(1);\nsetTimeout(() => console.log(2), 0);\nnew Promise((resolve) => {\n  console.log(3);\n  resolve();\n}).then(() => console.log(4));\nconsole.log(5);",
    options: ["1 3 5 2 4", "1 3 5 4 2", "1 5 3 4 2", "1 3 4 5 2"],
    correctAnswer: "1 3 5 4 2",
    points: 2
  },
  {
    id: "g_ex_2",
    category: "general",
    difficulty: "expert",
    question: "ما هو تعقيد الزمن (Worst-case) لإدخال وحذف عنصر في شجرة بحث ثنائية متوازنة (Balanced Binary Search Tree مثل Red-Black Tree)؟",
    options: ["O(1)", "O(log N)", "O(N)", "O(N log N)"],
    correctAnswer: "O(log N)",
    points: 2
  },
  {
    id: "g_ex_3",
    category: "general",
    difficulty: "expert",
    question: "أي من خيارات البيانات التالية تعبر عن بنية (Garbage Collector) في محرك JavaScript V8؟",
    options: [
      "يقوم بمسح كامل الذاكرة بشكل عشوائي دون تمييز عمر الكائنات.",
      "يعتمد على مبدأ تقسيم الذاكرة لأجيال (Generational GC: Young & Old generation) لتحسين الأداء وتقليص وقت التوقف.",
      "يعمل فقط عند إغلاق المتصفح بشكل كامل.",
      "يعتمد بالكامل على عد المراجع اليدوي من قبل المبرمج."
    ],
    correctAnswer: "يعتمد على مبدأ تقسيم الذاكرة لأجيال (Generational GC: Young & Old generation) لتحسين الأداء وتقليص وقت التوقف.",
    points: 2
  },
  {
    id: "g_ex_4",
    category: "general",
    difficulty: "expert",
    question: "ماذا سينتج عن تشغيل الكود التالي:\nlet x = 0.1 + 0.2;\nconsole.log(x === 0.3);",
    options: ["true", "false", "Error", "undefined"],
    correctAnswer: "false",
    points: 2
  },
  {
    id: "g_ex_5",
    category: "general",
    difficulty: "expert",
    question: "ما هو البروتوكول المسؤول عن تحويل البيانات وتقسيمها إلى حزم وتأمين موثوقية وصولها وخلوها من الأخطاء عبر الشبكات؟",
    options: ["IP", "HTTP", "TCP", "DNS"],
    correctAnswer: "TCP",
    points: 2
  }
];

// ==========================================
// 2. WEB DEVELOPMENT QUESTIONS (30 Questions)
// ==========================================
export const WEB_QUESTIONS: PlacementQuestion[] = [
  // VERY EASY & EASY
  {
    id: "w_ve_1",
    category: "web",
    difficulty: "very_easy",
    question: "أي عنصر HTML يستخدم لإنشاء رابط تشعبي (Hyperlink)؟",
    options: ["<link>", "<a>", "<href>", "<url>"],
    correctAnswer: "<a>",
    points: 2
  },
  {
    id: "w_ve_2",
    category: "web",
    difficulty: "very_easy",
    question: "ما هو الغرض من استخدام خاصية 'alt' في وسم الصور <img>؟",
    options: ["تغيير أبعاد الصورة", "إظهار نص بديل إذا فشل تحميل الصورة", "تلوين خلفية الصورة", "تحديد مسار الصورة"],
    correctAnswer: "إظهار نص بديل إذا فشل تحميل الصورة",
    points: 2
  },
  {
    id: "w_e_1",
    category: "web",
    difficulty: "easy",
    question: "كيف تستهدف عنصر يمتلك كلاس باسم 'card' في ملف CSS؟",
    options: ["#card", ".card", "card", "*card"],
    correctAnswer: ".card",
    points: 2
  },
  {
    id: "w_e_2",
    category: "web",
    difficulty: "easy",
    question: "أي لغة تستخدم لإعطاء الصفحات هيكلية المحتوى وتوزيع العناصر الأساسية؟",
    options: ["CSS", "HTML", "JavaScript", "PHP"],
    correctAnswer: "HTML",
    points: 2
  },
  {
    id: "w_e_3",
    category: "web",
    difficulty: "easy",
    question: "أي خاصية CSS تستخدم لجعل النص عريضاً (Bold)؟",
    options: ["font-style", "font-weight", "text-decoration", "font-size"],
    correctAnswer: "font-weight",
    points: 2
  },

  // MEDIUM & ABOVE MEDIUM
  {
    id: "w_m_1",
    category: "web",
    difficulty: "medium",
    question: "ماذا تفعل القيمة flex-direction: column في CSS Flexbox؟",
    options: [
      "ترتب العناصر أفقياً من اليسار لليمين",
      "ترتب العناصر رأسياً من الأعلى إلى الأسفل",
      "تخفي العناصر داخل الحاوية",
      "توزع العناصر بشكل دائري"
    ],
    correctAnswer: "ترتب العناصر رأسياً من الأعلى إلى الأسفل",
    points: 2
  },
  {
    id: "w_m_2",
    category: "web",
    difficulty: "medium",
    question: "ما الفرق الأساسي بين sessionStorage و localStorage؟",
    options: [
      "sessionStorage لا يحذف البيانات نهائياً بينما localStorage يحذفها فوراً.",
      "sessionStorage يحذف البيانات تلقائياً بمجرد إغلاق التبويب/المتصفح، بينما localStorage يحتفظ بالبيانات بشكل دائم.",
      "localStorage لا يعمل إلا باتصال إنترنت و sessionStorage يعمل بدونه.",
      "لا يوجد أي فرق سوى المساحة التخزينية فقط."
    ],
    correctAnswer: "sessionStorage يحذف البيانات تلقائياً بمجرد إغلاق التبويب/المتصفح، بينما localStorage يحتفظ بالبيانات بشكل دائم.",
    points: 2
  },
  {
    id: "w_m_3",
    category: "web",
    difficulty: "medium",
    question: "أي دالة تستخدم لإرسال طلب HTTP لجلب بيانات بصيغة JSON من خادم خارجي بالاعتماد على الـ Promises؟",
    options: ["request()", "fetch()", "getJSON()", "http.get()"],
    correctAnswer: "fetch()",
    points: 2
  },
  {
    id: "w_am_1",
    category: "web",
    difficulty: "above_medium",
    question: "في JavaScript، ما هو الـ DOM (Document Object Model)؟",
    options: [
      "مكتبة لتسريع خوادم الويب وتأمين قواعد البيانات.",
      "تمثيل هيكلي للمستند (HTML Document) كشجرة كائنات تتيح لـ JS تعديل المحتوى والتصميم والأحداث.",
      "محرك تشغيل برمجيات الويب في المتصفح.",
      "إطار عمل لبناء تطبيقات الموبايل الهجينة."
    ],
    correctAnswer: "تمثيل هيكلي للمستند (HTML Document) كشجرة كائنات تتيح لـ JS تعديل المحتوى والتصميم والأحداث.",
    points: 2
  },
  {
    id: "w_am_2",
    category: "web",
    difficulty: "above_medium",
    question: "كيف يمكن تضمين ملف CSS خارجي داخل صفحة HTML؟",
    options: [
      "<style src='style.css'>",
      "<link rel='stylesheet' href='style.css'>",
      "<script href='style.css'>",
      "<css href='style.css'>"
    ],
    correctAnswer: "<link rel='stylesheet' href='style.css'>",
    points: 2
  },
  {
    id: "w_am_3",
    category: "web",
    difficulty: "above_medium",
    question: "ماذا تفعل التعليمة box-sizing: border-box في CSS؟",
    options: [
      "تجعل الحاشية والحدود ضمن العرض والارتفاع الإجمالي للعنصر.",
      "تضيف حدوداً عريضة ومحاطة بظل داكن حول العناصر.",
      "تلغي هوامش العناصر الخارجية تماماً.",
      "تمنع العناصر من الالتفاف والتمدد."
    ],
    correctAnswer: "تجعل الحاشية والحدود ضمن العرض والارتفاع الإجمالي للعنصر.",
    points: 2
  },

  // HARD & VERY HARD
  {
    id: "w_h_1",
    category: "web",
    difficulty: "hard",
    question: "في React، ما هو الـ Virtual DOM وكيف يساعد في تحسين الأداء؟",
    options: [
      "شجرة كائنات تعمل في الخادم وتغني المتصفح عن تحميل الريندر كلياً.",
      "نسخة خفيفة من الـ DOM الفعلي في الذاكرة، يقارن التغييرات (Diffing) ويحدث الأجزاء المتغيرة فقط في الـ DOM الحقيقي بكفاءة.",
      "تقنية لتخزين البيانات المحلية بطريقة مشفرة وسريعة.",
      "محرك ثنائي الأبعاد لعرض الرسوم المتحركة في صفحات الويب."
    ],
    correctAnswer: "نسخة خفيفة من الـ DOM الفعلي في الذاكرة، يقارن التغييرات (Diffing) ويحدث الأجزاء المتغيرة فقط في الـ DOM الحقيقي بكفاءة.",
    points: 2
  },
  {
    id: "w_h_2",
    category: "web",
    difficulty: "hard",
    question: "أي من الخيارات التالية يصف بروتوكول HTTPS؟",
    options: [
      "نسخة جديدة من بروتوكول جلب البيانات تعمل بأداء أبطأ لحماية الصور.",
      "بروتوكول HTTP عادي مضاف إليه طبقة أمان وتشفير SSL/TLS لحماية البيانات المتبادلة بين المتصفح والخادم.",
      "بروتوكول خاص بتطبيقات الهاتف لا يمكن للمتصفحات العادية تفسيره.",
      "نظام لإرسال البريد الإلكتروني السريع عبر الويب."
    ],
    correctAnswer: "بروتوكول HTTP عادي مضاف إليه طبقة أمان وتشفير SSL/TLS لحماية البيانات المتبادلة بين المتصفح والخادم.",
    points: 2
  },
  {
    id: "w_h_3",
    category: "web",
    difficulty: "hard",
    question: "ماذا يحدث عند استدعاء event.preventDefault() في معالج أحداث JavaScript؟",
    options: [
      "يمنع انتقال الحدث للعناصر الأبوية (Stop Propagation).",
      "يلغي السلوك الافتراضي للمتصفح المصاحب للحدث (مثل إرسال الاستمارة أو فتح الرابط).",
      "يحذف العنصر تماماً من شجرة الـ DOM.",
      "يقوم بإيقاف تشغيل الخادم فوراً لمنع الاختراق."
    ],
    correctAnswer: "يلغي السلوك الافتراضي للمتصفح المصاحب للحدث (مثل إرسال الاستمارة أو فتح الرابط).",
    points: 2
  },
  {
    id: "w_vh_1",
    category: "web",
    difficulty: "very_hard",
    question: "ما هو الـ CSRF (Cross-Site Request Forgery) وكيف تحمي تطبيقات الويب منه؟",
    options: [
      "هجوم يحقن نصوصاً خبيثة بالموقع، ويتم الحماية منه بفحص المدخلات.",
      "ثغرة تمكن المهاجم من إجبار متصفح الضحية على إرسال طلب HTTP خبيث لخادم يثق بمتصفح الضحية، ويتم الحماية باستخدام رموز Anti-CSRF Tokens.",
      "محاولة لسرقة قاعدة البيانات عبر حقن أوامر SQL خبيثة.",
      "هجوم لتعطيل الخادم عن طريق إرسال ملايين الطلبات الوهمية."
    ],
    correctAnswer: "ثغرة تمكن المهاجم من إجبار متصفح الضحية على إرسال طلب HTTP خبيث لخادم يثق بمتصفح الضحية، ويتم الحماية باستخدام رموز Anti-CSRF Tokens.",
    points: 2
  },
  {
    id: "w_vh_2",
    category: "web",
    difficulty: "very_hard",
    question: "في React، ما هو الفرق بين useMemo و useCallback؟",
    options: [
      "useMemo تحفظ قيم الحسابات المعقدة (Values)، بينما useCallback تحفظ وتخزن مرجع الدالة ذاتها (Functions) لمنع إعادة إنشائها.",
      "useMemo تستخدم للربط بقاعدة البيانات و useCallback تستخدم لجلب بيانات الـ API.",
      "useCallback تحفظ قيم الحسابات و useMemo تحفظ مرجع الدالة.",
      "كلاهما متطابقان تماماً ويستخدمان بالتبادل دون فرق."
    ],
    correctAnswer: "useMemo تحفظ قيم الحسابات المعقدة (Values)، بينما useCallback تحفظ وتخزن مرجع الدالة ذاتها (Functions) لمنع إعادة إنشائها.",
    points: 2
  },
  {
    id: "w_vh_3",
    category: "web",
    difficulty: "very_hard",
    question: "ما هو مفهوم الـ Hydration في إطارات عمل الويب التي تدعم ريندر الخادم (SSR مثل Next.js)؟",
    options: [
      "عملية ضغط صفحات HTML المرسلة لتقليل استهلاك السيرفر.",
      "عملية ربط أكواد JavaScript التفاعلية بصفحات الHTML الاستاتيكية التي تم إنشاؤها ورندرتها مسبقاً في الخادم.",
      "تحسين جودة الصور المعروضة ديناميكياً.",
      "حذف الملفات التالفة والقديمة من ذاكرة التخزين المؤقت للمتصفح تلقائياً."
    ],
    correctAnswer: "عملية ربط أكواد JavaScript التفاعلية بصفحات الHTML الاستاتيكية التي تم إنشاؤها ورندرتها مسبقاً في الخادم.",
    points: 2
  },

  // PROFESSIONAL & EXPERT
  {
    id: "w_p_1",
    category: "web",
    difficulty: "professional",
    question: "أي من البروتوكولات التالية يعتبر الأنسب لبناء اتصال ثنائي الاتجاه، مستمر، ومنخفض التأخير (Real-time Communication) بين المتصفح والخادم؟",
    options: ["HTTP/1.1", "WebSockets", "Long Polling", "REST API over HTTP/2"],
    correctAnswer: "WebSockets",
    points: 2
  },
  {
    id: "w_p_2",
    category: "web",
    difficulty: "professional",
    question: "في هندسة البرمجيات للويب، ما هو الفرق الجوهري بين Session-based Authentication و Token-based Authentication (مثل JWT)؟",
    options: [
      "الـ Session تحفظ حالتها بالكامل بالخادم (Stateful)، بينما الـ JWT تحمل كافة البيانات بداخلها ولا تحتاج لحفظ حالة بالخادم (Stateless).",
      "الـ JWT أبطأ بكثير ولا تناسب الهواتف المحمولة.",
      "الـ Session تخزن بالكامل بمتصفح العميل والـ JWT يخزن بالكامل بالسيرفر.",
      "الـ Session لا يمكن اختراقها بينما الـ JWT غير آمن كلياً."
    ],
    correctAnswer: "الـ Session تحفظ حالتها بالكامل بالخادم (Stateful)، بينما الـ JWT تحمل كافة البيانات بداخلها ولا تحتاج لحفظ حالة بالخادم (Stateless).",
    points: 2
  },
  {
    id: "w_p_3",
    category: "web",
    difficulty: "professional",
    question: "ماذا تعني خاصية 'Critical Rendering Path' في تطوير الويب وتحسين أداء المواقع؟",
    options: [
      "طريق حماية وتأمين ملفات الباك إند الحساسة.",
      "سلسلة الخطوات التي يتخذها المتصفح لتحويل أكواد HTML و CSS و JS إلى بكسلات حية تظهر على شاشة المستخدم.",
      "كود برمجي خاص بتشغيل خوارزميات الذكاء الاصطناعي بالمتصفح.",
      "طريقة هيكلة وتنظيم قاعدة البيانات للموقع."
    ],
    correctAnswer: "سلسلة الخطوات التي يتخذها المتصفح لتحويل أكواد HTML و CSS و JS إلى بكسلات حية تظهر على شاشة المستخدم.",
    points: 2
  },
  {
    id: "w_ex_1",
    category: "web",
    difficulty: "expert",
    question: "كيف يساهم ضبط ترويسة الأمان 'Content Security Policy' (CSP) في حماية تطبيقات الويب من هجمات XSS؟",
    options: [
      "عن طريق تشفير قاعدة البيانات بالكامل.",
      "عن طريق تحديد النطاقات والمصادر الموثوقة التي يُسمح للمتصفح بتحميل وتشغيل ملفات السكربت والبيانات منها.",
      "عن طريق تصفية وفحص مدخلات مستخدم الباك إند فقط.",
      "عن طريق حظر استخدام ملفات CSS الخارجية نهائياً."
    ],
    correctAnswer: "عن طريق تحديد النطاقات والمصادر الموثوقة التي يُسمح للمتصفح بتحميل وتشغيل ملفات السكربت والبيانات منها.",
    points: 2
  },
  {
    id: "w_ex_2",
    category: "web",
    difficulty: "expert",
    question: "أي من التقنيات التالية تصف طريقة عمل الـ Service Workers في تطبيقات الويب التقدمية (PWA)؟",
    options: [
      "برامج تعمل بالباك إند لإدارة خوادم قواعد البيانات.",
      "سكربتات تعمل في الخلفية بشكل منفصل عن صفحة الويب، تتيح اعتراض طلبات الشبكة، التخزين المؤقت المتقدم، ودعم التشغيل بدون إنترنت (Offline).",
      "مكونات بصرية متحركة لتسريع رندر واجهات React.",
      "أداة لتشغيل ألعاب المتصفح ثلاثية الأبعاد."
    ],
    correctAnswer: "سكربتات تعمل في الخلفية بشكل منفصل عن صفحة الويب، تتيح اعتراض طلبات الشبكة، التخزين المؤقت المتقدم، ودعم التشغيل بدون إنترنت (Offline).",
    points: 2
  },
  {
    id: "w_ex_3",
    category: "web",
    difficulty: "expert",
    question: "عند استخدام React 18، ما هي الوظيفة الأساسية لميزة Concurrent Rendering؟",
    options: [
      "تمكين التطبيق من العمل على خوادم متعددة في نفس الوقت.",
      "تتيح لـ React إيقاف عمليات الرندر مؤقتاً، استئنافها، أو التخلي عنها لتظل واجهة المستخدم مستجيبة وتفاعلية أثناء العمليات الثقيلة.",
      "تثبيت وتحديث إضافات المتصفح تلقائياً.",
      "تسهيل الاتصال بقواعد البيانات دون الحاجة لـ API."
    ],
    correctAnswer: "تتيح لـ React إيقاف عمليات الرندر مؤقتاً، استئنافها، أو التخلي عنها لتظل واجهة المستخدم مستجيبة وتفاعلية أثناء العمليات الثقيلة.",
    points: 2
  },
  
  // EXTRA WEB (6 Questions to reach 30)
  {
    id: "w_ext_1",
    category: "web",
    difficulty: "medium",
    question: "ماذا يمثل الرمز 404 في أكواد استجابة HTTP (HTTP Status Codes)؟",
    options: ["نجاح الطلب (OK)", "الصفحة غير موجودة (Not Found)", "خطأ داخلي بالخادم (Internal Server Error)", "غير مصرح بالدخول (Unauthorized)"],
    correctAnswer: "الصفحة غير موجودة (Not Found)",
    points: 2
  },
  {
    id: "w_ext_2",
    category: "web",
    difficulty: "hard",
    question: "أي مما يلي يمثل الطريقة الصحيحة لتبادل البيانات بين المكون الأب والمكون الابن في React؟",
    options: ["عن طريق الـ State فقط", "عن طريق تمرير الخصائص (Props) من الأب للابن", "باستخدام LocalStorage دائماً", "لا يمكن نقل البيانات بينهما"],
    correctAnswer: "عن طريق تمرير الخصائص (Props) من الأب للابن",
    points: 2
  },
  {
    id: "w_ext_3",
    category: "web",
    difficulty: "above_medium",
    question: "في CSS Grid، أي تعليمة تستخدم لتحديد عدد وتوزيع الأعمدة بحجم مرن وتلقائي التكرار؟",
    options: ["grid-template-columns: repeat(auto-fit, minmax(200px, 1fr))", "grid-column: 1 / 3", "grid-align: center", "display: block"],
    correctAnswer: "grid-template-columns: repeat(auto-fit, minmax(200px, 1fr))",
    points: 2
  },
  {
    id: "w_ext_4",
    category: "web",
    difficulty: "very_hard",
    question: "ما هي التقنية المستخدمة لتسريع الاستجابة وتحميل الموقع عالمياً عبر توزيع الملفات الاستاتيكية على سيرفرات جغرافية قريبة من المستخدم؟",
    options: ["CDN (Content Delivery Network)", "SQL Sharding", "Load Balancing", "Docker Containers"],
    correctAnswer: "CDN (Content Delivery Network)",
    points: 2
  },
  {
    id: "w_ext_5",
    category: "web",
    difficulty: "professional",
    question: "أي من دوال التخزين المؤقت في المتصفح تتيح حفظ الملفات وجلبها لتعمل كلياً في الخلفية مع الـ Service Worker؟",
    options: ["Cache API", "IndexedDB", "Cookies", "LocalSession"],
    correctAnswer: "Cache API",
    points: 2
  },
  {
    id: "w_ext_6",
    category: "web",
    difficulty: "easy",
    question: "أي خاصية CSS تستخدم لإضافة هوامش خارجية (Spacing) حول العناصر؟",
    options: ["padding", "margin", "border", "gap"],
    correctAnswer: "margin",
    points: 2
  }
];

// ==========================================
// 3. MOBILE DEVELOPMENT QUESTIONS (30 Questions)
// ==========================================
export const MOBILE_QUESTIONS: PlacementQuestion[] = [
  // VERY EASY & EASY
  {
    id: "m_ve_1",
    category: "mobile",
    difficulty: "very_easy",
    question: "أي شركة طورت إطار عمل Flutter الشهير لبناء التطبيقات؟",
    options: ["Facebook / Meta", "Apple", "Microsoft", "Google"],
    correctAnswer: "Google",
    points: 2
  },
  {
    id: "m_ve_2",
    category: "mobile",
    difficulty: "very_easy",
    question: "ما هي لغة البرمجة التي يعتمد عليها تطوير تطبيقات نظام iOS بشكل أصلي (Native) حالياً؟",
    options: ["Objective-C", "Swift", "Dart", "Kotlin"],
    correctAnswer: "Swift",
    points: 2
  },
  {
    id: "m_e_1",
    category: "mobile",
    difficulty: "easy",
    question: "ما هي لغة البرمجة الأساسية والحديثة المعتمدة لتطوير تطبيقات الأندرويد الأصلية (Native Android)؟",
    options: ["Java", "Kotlin", "Python", "JavaScript"],
    correctAnswer: "Kotlin",
    points: 2
  },
  {
    id: "m_e_2",
    category: "mobile",
    difficulty: "easy",
    question: "ما هو ملف التكوين الأساسي في مشاريع Flutter والمسؤول عن تعريف التبعيات والمكتبات والخطوط والصور؟",
    options: ["index.html", "pubspec.yaml", "AndroidManifest.xml", "App.json"],
    correctAnswer: "pubspec.yaml",
    points: 2
  },
  {
    id: "m_e_3",
    category: "mobile",
    difficulty: "easy",
    question: "ما هي ميزة 'Hot Reload' في Flutter؟",
    options: [
      "إعادة تشغيل الهاتف المحمول تلقائياً لتثبيت التطبيق.",
      "تطبيق التغييرات التي تجريها على الكود فوراً وبثوانٍ معدودة دون خسارة حالة التطبيق الحالية (State).",
      "تحديث قاعدة البيانات السحابية فوراً.",
      "مسح الملفات التالفة لتسريع المعالج."
    ],
    correctAnswer: "تطبيق التغييرات التي تجريها على الكود فوراً وبثوانٍ معدودة دون خسارة حالة التطبيق الحالية (State).",
    points: 2
  },

  // MEDIUM & ABOVE MEDIUM
  {
    id: "m_m_1",
    category: "mobile",
    difficulty: "medium",
    question: "ما هي دالة دورة الحياة (Lifecycle method) التي يتم استدعاؤها مرة واحدة فقط عند بدء إنشاء الـ StatefulWidget في Flutter؟",
    options: ["build()", "initState()", "dispose()", "setState()"],
    correctAnswer: "initState()",
    points: 2
  },
  {
    id: "m_m_2",
    category: "mobile",
    difficulty: "medium",
    question: "ما هو الـ Safe Area في تصميم واجهات الموبايل؟",
    options: [
      "جدار حماية لحماية التطبيق من الاختراق الخارجي.",
      "مكون برمجي يضمن عدم تداخل عناصر واجهة المستخدم مع النتوءات المادية للهاتف (الشاشات المنحنية، ثقب الكاميرا، النوتش).",
      "منطقة لحفظ كلمات المرور المشفرة.",
      "مساحة خالية لتقليص حجم شاشة التطبيق."
    ],
    correctAnswer: "مكون برمجي يضمن عدم تداخل عناصر واجهة المستخدم مع النتوءات المادية للهاتف (الشاشات المنحنية، ثقب الكاميرا، النوتش).",
    points: 2
  },
  {
    id: "m_m_3",
    category: "mobile",
    difficulty: "medium",
    question: "في React Native، ما هو المكون الأساسي المكافئ لعنصر <div> في الويب والمسؤول عن الاحتواء والتنسيق؟",
    options: ["<Text>", "<View>", "<Container>", "<Scroll>"],
    correctAnswer: "<View>",
    points: 2
  },
  {
    id: "m_am_1",
    category: "mobile",
    difficulty: "above_medium",
    question: "في لغة Dart، ماذا يعني استخدام الرمز '?' بعد نوع المتغير (مثل String? name)؟",
    options: [
      "أن المتغير مشفر ولا يمكن قراءته.",
      "أن المتغير يقبل القيمة الفارغة (Nullable) كجزء من أمان القيم الفارغة (Null Safety).",
      "أن المتغير عبارة عن دالة شرطية.",
      "لا معنى له ويسبب خطأ تجميعي."
    ],
    correctAnswer: "أن المتغير يقبل القيمة الفارغة (Nullable) كجزء من أمان القيم الفارغة (Null Safety).",
    points: 2
  },
  {
    id: "m_am_2",
    category: "mobile",
    difficulty: "above_medium",
    question: "أي أداة في Flutter تستخدم لحفظ كميات صغيرة من البيانات البسيطة (مثل تفضيلات المستخدم والوضع الداكن) محلياً بشكل دائم؟",
    options: ["SQLite", "Shared Preferences", "Firebase Firestore", "Redux Store"],
    correctAnswer: "Shared Preferences",
    points: 2
  },
  {
    id: "m_am_3",
    category: "mobile",
    difficulty: "above_medium",
    question: "ما هو الفرق بين StatelessWidget و StatefulWidget في Flutter؟",
    options: [
      "Stateless لا يعرض صوراً والـ Stateful يعرض كل أنواع الوسائط.",
      "Stateless لا يمتلك حالة داخلية قابلة للتغيير وتحديث الـ UI بعد البناء، بينما Stateful يمتلك حالة ديناميكية تتحدث باستدعاء setState.",
      "Stateless يعمل فقط للاندرويد والـ Stateful للآيفون.",
      "Stateless أبطأ بكثير في الأداء."
    ],
    correctAnswer: "Stateless لا يمتلك حالة داخلية قابلة للتغيير وتحديث الـ UI بعد البناء، بينما Stateful يمتلك حالة ديناميكية تتحدث باستدعاء setState.",
    points: 2
  },

  // HARD & VERY HARD
  {
    id: "m_h_1",
    category: "mobile",
    difficulty: "hard",
    question: "في Dart، ماذا يمثل الـ Streams وكيف يختلف عن الـ Futures؟",
    options: [
      "الـ Futures تستخدم لنقل الصور والـ Streams لنقل النصوص.",
      "الـ Future يعيد قيمة واحدة فقط في وقت لاحق، بينما الـ Stream يعيد سلسلة متتابعة من الأحداث والبيانات المتغيرة بمرور الوقت.",
      "الـ Stream يعمل بشكل متزامن كلياً والـ Future يعمل بشكل غير متزامن.",
      "الـ Futures تعمل فقط مع البلوتوث."
    ],
    correctAnswer: "الـ Future يعيد قيمة واحدة فقط في وقت لاحق، بينما الـ Stream يعيد سلسلة متتابعة من الأحداث والبيانات المتغيرة بمرور الوقت.",
    points: 2
  },
  {
    id: "m_h_2",
    category: "mobile",
    difficulty: "hard",
    question: "عند استخدام مكتبة Bloc لإدارة الحالة في Flutter، ما هو دور الـ Events والـ States؟",
    options: [
      "الـ Events تمثل أحداث واجهة المستخدم المدخلة من العميل، والـ States تمثل الحالة البرمجية الناتجة التي تعيد رسم الواجهة.",
      "الـ Events هي اتصال قواعد البيانات والـ States هي ملفات التخزين المؤقت.",
      "الـ States هي المدخلات والـ Events هي المخرجات.",
      "لا دور لهما في معمارية الـ Bloc."
    ],
    correctAnswer: "الـ Events تمثل أحداث واجهة المستخدم المدخلة من العميل، والـ States تمثل الحالة البرمجية الناتجة التي تعيد رسم الواجهة.",
    points: 2
  },
  {
    id: "m_h_3",
    category: "mobile",
    difficulty: "hard",
    question: "ماذا تفعل الأداة Key في Flutter؟",
    options: [
      "تستخدم لتشفير وحماية التطبيق.",
      "تساعد محرك ريندر Flutter في تتبع هوية الـ Widgets والحفاظ على حالتها أثناء إعادة الترتيب أو الحذف من شجرة العناصر.",
      "تفتح خيارات المطور بالهاتف.",
      "لا فائدة منها في التطبيقات العادية."
    ],
    correctAnswer: "تساعد محرك ريندر Flutter في تتبع هوية الـ Widgets والحفاظ على حالتها أثناء إعادة الترتيب أو الحذف من شجرة العناصر.",
    points: 2
  },
  {
    id: "m_vh_1",
    category: "mobile",
    difficulty: "very_hard",
    question: "كيف تتعامل تطبيقات الهواتف مع القيود الصارمة لذاكرة النظام التشغيلي (OS Memory Management) وتجنب الـ Out Of Memory crashes؟",
    options: [
      "عن طريق إغلاق الهاتف فوراً.",
      "بالاستماع لأحداث تراجع الذاكرة المتاحة (Low Memory Warnings) وتنظيف الكاش غير الضروري، وإلغاء الاستماع للدوال غير النشطة (disposed listeners).",
      "تطبيقات الموبايل لا تتأثر بذاكرة النظام نهائياً.",
      "بزيادة حجم الرام بالهاتف تلقائياً."
    ],
    correctAnswer: "بالاستماع لأحداث تراجع الذاكرة المتاحة (Low Memory Warnings) وتنظيف الكاش غير الضروري، وإلغاء الاستماع للدوال غير النشطة (disposed listeners).",
    points: 2
  },
  {
    id: "m_vh_2",
    category: "mobile",
    difficulty: "very_hard",
    question: "ما هو دور الـ MethodChannel في إطار عمل Flutter؟",
    options: [
      "لتسريع عملية فك تشفير البيانات الكبيرة.",
      "لربط كود Flutter وجافا سكريبت بالمتصفح.",
      "لتوفير وسيلة اتصال وتبادل رسائل بين كود Dart والواجهات البرمجية الأصلية للهاتف (Kotlin/Swift API) لتشغيل ميزات الجهاز.",
      "قناة بث حي للفيديوهات."
    ],
    correctAnswer: "لتوفير وسيلة اتصال وتبادل رسائل بين كود Dart والواجهات البرمجية الأصلية للهاتف (Kotlin/Swift API) لتشغيل ميزات الجهاز.",
    points: 2
  },
  {
    id: "m_vh_3",
    category: "mobile",
    difficulty: "very_hard",
    question: "في React Native، ما هو الـ 'New Architecture' وما هو الـ JSI (JavaScript Interface) مقارنة بالـ Bridge القديم؟",
    options: [
      "نظام لنقل الكود البرمجي لخوادم جوجل بشكل أسرع.",
      "بنية جديدة تتيح اتصالاً مباشراً ومتزامناً بين محرك JS والـ Native Threads دون الحاجة لمرور البيانات وتشفيرها عبر الـ JSON Bridge البطيء.",
      "طريقة لعرض إعلانات ممولة داخل التطبيقات.",
      "تحديث خاص بإدارة الألوان والخطوط التلقائية."
    ],
    correctAnswer: "بنية جديدة تتيح اتصالاً مباشراً ومتزامناً بين محرك JS والـ Native Threads دون الحاجة لمرور البيانات وتشفيرها عبر الـ JSON Bridge البطيء.",
    points: 2
  },

  // PROFESSIONAL & EXPERT
  {
    id: "m_p_1",
    category: "mobile",
    difficulty: "professional",
    question: "كيف يعمل محرك ريندر Flutter (Impeller / Skia) لتقديم واجهات سريعة بمعدل 60 أو 120 إطاراً في الثانية؟",
    options: [
      "يقوم بتحويل الكود البرمجي لملفات HTML و CSS وعرضها بالمتصفح الداخلي للهاتف.",
      "يرسم كل بكسل بداخل الشاشة مباشرة بالاعتماد على وحدة معالجة الرسوميات (GPU) ومكتبات الرسوميات (Metal/Vulkan) دون الاعتماد على عناصر الـ Native UI الأوتوماتيكية.",
      "يقوم بتسريع سرعة معالج الهاتف المحمول بوضع طاقة مرتفع.",
      "لا يستخدم الرسوميات ويعتمد بالكامل على المعالج الرئيسي CPU."
    ],
    correctAnswer: "يرسم كل بكسل بداخل الشاشة مباشرة بالاعتماد على وحدة معالجة الرسوميات (GPU) ومكتبات الرسوميات (Metal/Vulkan) دون الاعتماد على عناصر الـ Native UI الأوتوماتيكية.",
    points: 2
  },
  {
    id: "m_p_2",
    category: "mobile",
    difficulty: "professional",
    question: "ماذا تعني ميزة 'App Sandboxing' في أنظمة تشغيل الهواتف الذكية (iOS & Android)؟",
    options: [
      "ميزة تمنع تشغيل الألعاب على الهواتف حماية للأطفال.",
      "نظام أمان يعزل كل تطبيق في بيئة تشغيلية آمنة ومعزولة تمنع وصوله المباشر لبيانات التطبيقات الأخرى أو النظام دون تصريح صريح وموافقة المستخدم.",
      "مساحة خالية لتخزين ملفات التحميل غير المصرح بها.",
      "نظام لعرض الإشعارات بألوان مميزة."
    ],
    correctAnswer: "نظام أمان يعزل كل تطبيق في بيئة تشغيلية آمنة ومعزولة تمنع وصوله المباشر لبيانات التطبيقات الأخرى أو النظام دون تصريح صريح وموافقة المستخدم.",
    points: 2
  },
  {
    id: "m_p_3",
    category: "mobile",
    difficulty: "professional",
    question: "عند بناء تطبيق Flutter، كيف يمكنك معالجة وحل مشكلة جلب مئات العناصر من الـ API وعرضها في مصفوفة دون حدوث بطء (Jank) في الحركة؟",
    options: [
      "باستخدام دالة setState داخل حلقة تكرارية طويلة.",
      "باستخدام ListView.builder ليقوم برسم وعرض العناصر الظاهرة فقط على الشاشة (Lazy Loading) وتدمير/إعادة تدوير العناصر خارج الشاشة.",
      "بتقسيم الشاشة لعدة أجزاء ثابتة.",
      "بتحميل البيانات وصورها بجودة منخفضة جداً دائماً."
    ],
    correctAnswer: "باستخدام ListView.builder ليقوم برسم وعرض العناصر الظاهرة فقط على الشاشة (Lazy Loading) وتدمير/إعادة تدوير العناصر خارج الشاشة.",
    points: 2
  },
  {
    id: "m_ex_1",
    category: "mobile",
    difficulty: "expert",
    question: "كيف تؤثر عملية 'Dart AOT Compilation' مقارنة بـ 'JIT Compilation' في أداء وجودة ونوعية التطبيق النهائي للمستخدم؟",
    options: [
      "AOT تجمع الكود مسبقاً للغة الآلة الأصلية مما يقلص حجم التطبيق وزمن الإقلاع بشكل كبير، بينما JIT تجمع الكود أثناء التشغيل وتناسب التطوير السريع.",
      "AOT تجعل التطبيق يحتاج لاتصال إنترنت دائم و JIT يعمل بدون إنترنت كلياً.",
      "JIT تسرع الريندر النهائي ولا تدعم الأندرويد العادي.",
      "لا يوجد بينهما أي فرق برمجياً."
    ],
    correctAnswer: "AOT تجمع الكود مسبقاً للغة الآلة الأصلية مما يقلص حجم التطبيق وزمن الإقلاع بشكل كبير، بينما JIT تجمع الكود أثناء التشغيل وتناسب التطوير السريع.",
    points: 2
  },
  {
    id: "m_ex_2",
    category: "mobile",
    difficulty: "expert",
    question: "ما هو مفهوم الـ 'Deep Linking' وكيف يختلف الـ App Links (Android) والـ Universal Links (iOS) عن الـ Schema المخصص؟",
    options: [
      "روابط مشفرة تستخدم لفتح الخوادم السحابية.",
      "ميزة تتيح فتح صفحات معينة داخل التطبيق مباشرة عبر روابط ويب قياسية (HTTPS)، وتتطلب التحقق من ملكية النطاق لحماية الخصوصية وموثوقية الفتح التلقائي.",
      "روابط لفتح متجر التطبيقات فقط.",
      "روابط لمشاركة الصور بجودة عالية."
    ],
    correctAnswer: "ميزة تتيح فتح صفحات معينة داخل التطبيق مباشرة عبر روابط ويب قياسية (HTTPS)، وتتطلب التحقق من ملكية النطاق لحماية الخصوصية وموثوقية الفتح التلقائي.",
    points: 2
  },
  {
    id: "m_ex_3",
    category: "mobile",
    difficulty: "expert",
    question: "عند تحسين استهلاك الطاقة والبطارية في تطبيق موبايل، أي الممارسات التالية تعتبر الأفضل للتحديثات الجغرافية المستمرة بالخلفية؟",
    options: [
      "طلب تحديثات دقيقة من الـ GPS كل ثانية بغض النظر عن حركة المستخدم.",
      "استخدام خوارزمية Geofencing مدمجة وتحديث الإحداثيات فقط عند استشعار الحركة عبر الحساسات المدمجة بالأجهزة (Fused Location / Activity Recognition).",
      "إجراء العمليات الحسابية الثقيلة باستمرار بالخلفية وحظر معالج الجهاز.",
      "استخدام صور متحركة بشكل دائم بالخلفية."
    ],
    correctAnswer: "استخدام خوارزمية Geofencing مدمجة وتحديث الإحداثيات فقط عند استشعار الحركة عبر الحساسات المدمجة بالأجهزة (Fused Location / Activity Recognition).",
    points: 2
  },

  // EXTRA MOBILE (6 Questions to reach 30)
  {
    id: "m_ext_1",
    category: "mobile",
    difficulty: "medium",
    question: "ما هو الـ Scaffold في Flutter؟",
    options: ["مكتبة لحفظ الصور والوسائط", "هيكل أساسي يوفر عناصر واجهة جاهزة مثل الـ AppBar والـ BottomNavigationBar والـ Drawer", "أداة لتشغيل الكود غير المتزامن", "مكتبة لحساب الرياضيات المعقدة"],
    correctAnswer: "هيكل أساسي يوفر عناصر واجهة جاهزة مثل الـ AppBar والـ BottomNavigationBar والـ Drawer",
    points: 2
  },
  {
    id: "m_ext_2",
    category: "mobile",
    difficulty: "hard",
    question: "ما هي الأداة الموصى بها لإدارة الحزم البرمجية والمكتبات الخارجية في لغة Dart وتطوير Flutter؟",
    options: ["NPM", "Pip", "Pub.dev", "NuGet"],
    correctAnswer: "Pub.dev",
    points: 2
  },
  {
    id: "m_ext_3",
    category: "mobile",
    difficulty: "above_medium",
    question: "في Flutter، أي عنصر يستخدم لإضافة تأثيرات النقر وتفاعل اللمس الجذاب للعناصر البصرية التي لا تدعم التفاعل افتراضياً؟",
    options: ["InkWell / GestureDetector", "Container", "Padding", "CustomPainter"],
    correctAnswer: "InkWell / GestureDetector",
    points: 2
  },
  {
    id: "m_ext_4",
    category: "mobile",
    difficulty: "very_hard",
    question: "أي مكتبة لقواعد البيانات المحلية تناسب تطبيقات الموبايل وتعمل كمخزن سريع جداً للبيانات على هيئة Key-Value مكتوب بلغة Dart بالكامل؟",
    options: ["Hive", "SQLite", "Firebase", "PostgreSQL"],
    correctAnswer: "Hive",
    points: 2
  },
  {
    id: "m_ext_5",
    category: "mobile",
    difficulty: "professional",
    question: "ماذا يسمى المفهوم الذي يسمح للمطور بكتابة كود واحد فقط ليعمل بكفاءة على عدة أنظمة مثل أندرويد وآي أو إس؟",
    options: ["Native development", "Cross-Platform development", "Web rendering", "Hybrid coding"],
    correctAnswer: "Cross-Platform development",
    points: 2
  },
  {
    id: "m_ext_6",
    category: "mobile",
    difficulty: "easy",
    question: "ما هي الأداة الأساسية للتعامل مع صور واجهة المستخدم وضبط المسافات الداخلية للعناصر في فلاتر؟",
    options: ["Margin", "Padding", "Row", "Stack"],
    correctAnswer: "Padding",
    points: 2
  }
];

// ==========================================
// 4. ARTIFICIAL INTELLIGENCE & DATA SCIENCE (30 Questions)
// ==========================================
export const AI_QUESTIONS: PlacementQuestion[] = [
  // VERY EASY & EASY
  {
    id: "a_ve_1",
    category: "ai",
    difficulty: "very_easy",
    question: "ما هي المكتبة الأساسية المكتوبة بلغة Python والمستخدمة لتصوير ورسم المخططات البيانية والرسوم التوضيحية؟",
    options: ["Flask", "Django", "Matplotlib", "Requests"],
    correctAnswer: "Matplotlib",
    points: 2
  },
  {
    id: "a_ve_2",
    category: "ai",
    difficulty: "very_easy",
    question: "ما هي الطريقة الصحيحة لفتح ملف وقراءة محتواه تلقائياً في لغة بايثون لتفادي ترك الملف مفتوحاً بالذاكرة؟",
    options: [
      "open('file.txt')",
      "with open('file.txt') as f:",
      "read_file('file.txt')",
      "file.open()"
    ],
    correctAnswer: "with open('file.txt') as f:",
    points: 2
  },
  {
    id: "a_e_1",
    category: "ai",
    difficulty: "easy",
    question: "في بايثون، أي من الخيارات التالية يمثل تركيب بيانات غير قابل للتعديل بعد الإنشاء (Immutable Data Structure)؟",
    options: ["List", "Dictionary", "Tuple", "Set"],
    correctAnswer: "Tuple",
    points: 2
  },
  {
    id: "a_e_2",
    category: "ai",
    difficulty: "easy",
    question: "ما هي مكتبة Python الأكثر شهرة واستخداماً لتطوير وبناء خوارزميات تعلم الآلة الكلاسيكية مثل Regression و SVM؟",
    options: ["PyTorch", "TensorFlow", "Scikit-Learn", "NLTK"],
    correctAnswer: "Scikit-Learn",
    points: 2
  },
  {
    id: "a_e_3",
    category: "ai",
    difficulty: "easy",
    question: "أي من القيم التالية تعبر عن دالة Lambda في لغة Python؟",
    options: [
      "دالة مخصصة للتعامل مع الذاكرة.",
      "دالة مجهولة الاسم (Anonymous Function) يتم كتابتها وتطبيقها في سطر واحد فقط.",
      "أداة لتكرار الحلقات البرمجية.",
      "مفهوم للوراثة من كائنات متعددة."
    ],
    correctAnswer: "دالة مجهولة الاسم (Anonymous Function) يتم كتابتها وتطبيقها في سطر واحد فقط.",
    points: 2
  },

  // MEDIUM & ABOVE MEDIUM
  {
    id: "a_m_1",
    category: "ai",
    difficulty: "medium",
    question: "ما هو الهدف الأساسي من عملية 'Data Cleaning' (تنظيف البيانات) في مشاريع تعلم الآلة؟",
    options: [
      "تغيير نوع قاعدة البيانات من SQL إلى NoSQL.",
      "حذف القيم المفقودة، معالجة البيانات المتكررة والغير صحيحة لتحسين جودة وأداء النموذج في التعلم.",
      "تشفير الكود لمنع سرقته.",
      "ضغط حجم البيانات لتقليل استهلاك مساحة التخزين."
    ],
    correctAnswer: "حذف القيم المفقودة، معالجة البيانات المتكررة والغير صحيحة لتحسين جودة وأداء النموذج في التعلم.",
    points: 2
  },
  {
    id: "a_m_2",
    category: "ai",
    difficulty: "medium",
    question: "في مكتبة Pandas، أي دالة تستخدم لعرض الإحصائيات الوصفية الأساسية للأعمدة الرقمية (مثل المتوسط والإنحراف والمعياري)؟",
    options: ["df.info()", "df.describe()", "df.head()", "df.mean()"],
    correctAnswer: "df.describe()",
    points: 2
  },
  {
    id: "a_m_3",
    category: "ai",
    difficulty: "medium",
    question: "أي من خوارزميات تعلم الآلة التالية تنتمي لعائلة التعلم غير الخاضع للإشراف (Unsupervised Learning) وتستخدم لتجميع العناصر المتشابهة؟",
    options: ["Linear Regression", "Logistic Regression", "K-Means Clustering", "Decision Tree"],
    correctAnswer: "K-Means Clustering",
    points: 2
  },
  {
    id: "a_am_1",
    category: "ai",
    difficulty: "above_medium",
    question: "ما الفرق الأساسي بين خوارزميات التصنيف (Classification) والتنبؤ بالقيم المستمرة (Regression)؟",
    options: [
      "التصنيف يتنبأ بقيم رقمية مستمرة (مثل السعر)، والـ Regression يتنبأ بفئة محددة من الاختيارات (مثل نوع الحيوان).",
      "التصنيف يتنبأ بفئات متقطعة (Discrete Classes)، بينما الـ Regression يتنبأ بقيم عددية مستمرة (Continuous Values).",
      "التصنيف لا يحتاج إلى مرحلة تدريب على الإطلاق.",
      "الـ Regression يستخدم فقط لمعالجة الصور."
    ],
    correctAnswer: "التصنيف يتنبأ بفئات متقطعة (Discrete Classes)، بينما الـ Regression يتنبأ بقيم عددية مستمرة (Continuous Values).",
    points: 2
  },
  {
    id: "a_am_2",
    category: "ai",
    difficulty: "above_medium",
    question: "في تدريب النماذج، ماذا يعني حدوث مشكلة الـ Underfitting؟",
    options: [
      "أن النموذج يتمتع بدقة ممتازة على كل أنواع البيانات ولكن سرعته بطيئة للغاية.",
      "أن النموذج بسيط جداً لدرجة تجعله عاجزاً عن فهم العلاقة والأنماط الأساسية في بيانات التدريب والاختبار على حد سواء.",
      "حفظ النموذج للبيانات بشكل كامل ومفرط وفشله في التعميم.",
      "امتلاء حجم الذاكرة العشوائية وتوقف المعالجة."
    ],
    correctAnswer: "أن النموذج بسيط جداً لدرجة تجعله عاجزاً عن فهم العلاقة والأنماط الأساسية في بيانات التدريب والاختبار على حد سواء.",
    points: 2
  },
  {
    id: "a_am_3",
    category: "ai",
    difficulty: "above_medium",
    question: "في بايثون، أي تعبير يستخدم لإنشاء مصفوفة جديدة بشكل مختصر ومباشر (List Comprehension) تحتوي على الأعداد الزوجية فقط؟",
    options: [
      "[x for x in range(10) if x % 2 == 0]",
      "[x if x % 2 == 0 in range(10)]",
      "list(range(10)).filter(even)",
      "[x for x % 2 == 0]"
    ],
    correctAnswer: "[x for x in range(10) if x % 2 == 0]",
    points: 2
  },

  // HARD & VERY HARD
  {
    id: "a_h_1",
    category: "ai",
    difficulty: "hard",
    question: "ما هي ميزة تقنية 'Cross-Validation' (مثل K-Fold) في تقييم نماذج تعلم الآلة؟",
    options: [
      "تقليل استهلاك الذاكرة وتسريع وقت التدريب بنسبة 50%.",
      "تتيح تدريب وتقييم النموذج على عدة تقسيمات مختلفة للبيانات لضمان دقة التقييم وتجنب التحيز وتقليل التباين.",
      "تساعد في تنظيف البيانات تلقائياً وحذف السطور المكررة.",
      "تستخدم فقط لتشغيل كود بايثون على معالجات متعددة."
    ],
    correctAnswer: "تتيح تدريب وتقييم النموذج على عدة تقسيمات مختلفة للبيانات لضمان دقة التقييم وتجنب التحيز وتقليل التباين.",
    points: 2
  },
  {
    id: "a_h_2",
    category: "ai",
    difficulty: "hard",
    question: "عند حساب مصفوفة الارتباك (Confusion Matrix)، ماذا يمثل مقياس الـ Precision (الدقة المحددة)؟",
    options: [
      "نسبة التنبؤات الإيجابية الصحيحة من إجمالي الحالات التي تنبأ النموذج بأنها إيجابية فعلياً.",
      "نسبة التنبؤات الصحيحة كلياً مقارنة بإجمالي حجم البيانات.",
      "قدرة النموذج على التعرف على الحالات السلبية فقط.",
      "متوسط الخطأ التربيعي للقيم المكتشفة."
    ],
    correctAnswer: "نسبة التنبؤات الإيجابية الصحيحة من إجمالي الحالات التي تنبأ النموذج بأنها إيجابية فعلياً.",
    points: 2
  },
  {
    id: "a_h_3",
    category: "ai",
    difficulty: "hard",
    question: "ما هو الغرض من استخدام تقنيات 'Feature Scaling' مثل Normalization أو Standardization قبل تدريب النموذج؟",
    options: [
      "حذف المميزات والخصائص غير الضرورية لتوفير المساحة.",
      "توحيد نطاقات وقيم المميزات المختلفة لمنع تداخل أبعاد البيانات الكبيرة وتسريع تقارب خوارزميات التحسين (مثل Gradient Descent).",
      "زيادة أبعاد مصفوفات المدخلات.",
      "تغيير صيغ البيانات النصية إلى كلمات رقمية."
    ],
    correctAnswer: "توحيد نطاقات وقيم المميزات المختلفة لمنع تداخل أبعاد البيانات الكبيرة وتسريع تقارب خوارزميات التحسين (مثل Gradient Descent).",
    points: 2
  },
  {
    id: "a_vh_1",
    category: "ai",
    difficulty: "very_hard",
    question: "ما هي مشكلة تلاشي التدرج (Vanishing Gradient Problem) في الشبكات العصبية العميقة وكيف تؤثر في التدريب؟",
    options: [
      "تلاشي قيم البيانات تماماً وحذفها من الهارد ديسك.",
      "حدوث صغر متناهي وتلاشي لقيم التدرجات أثناء الانتشار العكسي، مما يمنع الأوزان في الطبقات الأولى للشبكة من التحديث والتعلم بكفاءة.",
      "زيادة سرعة التدريب لدرجة تجعل النموذج يحفظ البيانات فوراً.",
      "توقف بطاقة الرسوميات GPU عن المعالجة بسبب زيادة الحرارة."
    ],
    correctAnswer: "حدوث صغر متناهي وتلاشي لقيم التدرجات أثناء الانتشار العكسي، مما يمنع الأوزان في الطبقات الأولى للشبكة من التحديث والتعلم بكفاءة.",
    points: 2
  },
  {
    id: "a_vh_2",
    category: "ai",
    difficulty: "very_hard",
    question: "ما الفرق الأساسي بين معماريات الشبكات العصبية الالتفافية (CNN) والشبكات العصبية المتكررة (RNN)؟",
    options: [
      "الـ CNN تستخدم لمعالجة البيانات النصية المتسلسلة والـ RNN لمعالجة الصور ثلاثية الأبعاد.",
      "الـ CNN مخصصة لاستخراج الأنماط البصرية من الصور والمصفوفات ثنائية الأبعاد، بينما الـ RNN مخصصة لمعالجة البيانات المتسلسلة والزمنية (مثل النصوص والصوت) بفضل ذاكرتها الداخلية.",
      "الـ RNN أسرع بكثير في التدريب ولا تحتاج لبطاقات رسومية GPU.",
      "لا توجد فروق معمارية برمجية بينهما."
    ],
    correctAnswer: "الـ CNN مخصصة لاستخراج الأنماط البصرية من الصور والمصفوفات ثنائية الأبعاد، بينما الـ RNN مخصصة لمعالجة البيانات المتسلسلة والزمنية (مثل النصوص والصوت) بفضل ذاكرتها الداخلية.",
    points: 2
  },
  {
    id: "a_vh_3",
    category: "ai",
    difficulty: "very_hard",
    question: "ما هو دور خوارزميات تعظيم هامش الفصل (مثل Support Vector Machines) وكيف يؤثر الـ Kernel Trick بداخلها؟",
    options: [
      "يقوم بضغط أحجام الصور لتسهيل تصنيفها.",
      "يتيح تحويل البيانات غير القابلة للفصل خطياً في أبعادها الحالية إلى أبعاد أعلى (Higher-Dimensional Space) لتسهيل فصلها خطياً بأقل تكلفة حسابية.",
      "توليد صور ونصوص وهمية بدقة عالية.",
      "تسجيل وتثبيت مكتبات بايثون بالخلفية."
    ],
    correctAnswer: "يتيح تحويل البيانات غير القابلة للفصل خطياً في أبعادها الحالية إلى أبعاد أعلى (Higher-Dimensional Space) لتسهيل فصلها خطياً بأقل تكلفة حسابية.",
    points: 2
  },

  // PROFESSIONAL & EXPERT
  {
    id: "a_p_1",
    category: "ai",
    difficulty: "professional",
    question: "ما هي ميزة آلية الانتباه الذاتي (Self-Attention Mechanism) في معمارية الـ Transformers والمستخدمة في النماذج اللغوية الضخمة (LLMs)؟",
    options: [
      "تمنع الشبكة العصبية من حظر الذاكرة وحفظ ملفات كبيرة.",
      "تسمح للنموذج بحساب العلاقات والأهمية النسبية بين جميع الكلمات بداخل النص بشكل متوازٍ ومباشر بغض النظر عن المسافات الفاصلة بينها.",
      "تعتمد على ترتيب وتصنيف الكلمات أبجدياً فقط لتسهيل قراءتها.",
      "تقوم بضغط حجم النصوص لتقليل تكلفة التشغيل."
    ],
    correctAnswer: "تسمح للنموذج بحساب العلاقات والأهمية النسبية بين جميع الكلمات بداخل النص بشكل متوازٍ ومباشر بغض النظر عن المسافات الفاصلة بينها.",
    points: 2
  },
  {
    id: "a_p_2",
    category: "ai",
    difficulty: "professional",
    question: "أي من خيارات التحسين (Optimizers) التالية يعتمد على فكرة ضبط وتعديل معدل التعلم الفردي لكل وزن ديناميكياً بناءً على تدرجاته السابقة (Adaptive Learning Rate)؟",
    options: ["Stochastic Gradient Descent (SGD)", "Adam", "Mini-batch Gradient Descent", "L-BFGS"],
    correctAnswer: "Adam",
    points: 2
  },
  {
    id: "a_p_3",
    category: "ai",
    difficulty: "professional",
    question: "ما هي التقنية المستخدمة لتعديل أوزان نموذج لغوي ضخم تم تدريبه مسبقاً (Pre-trained LLM) عبر تدريبه على كمية بيانات صغيرة ومخصصة لمجال طبي أو قانوني محدد؟",
    options: ["Fine-Tuning (الضبط الدقيق)", "Reinforcement Learning", "Web Scraping", "Data Imputation"],
    correctAnswer: "Fine-Tuning (الضبط الدقيق)",
    points: 2
  },
  {
    id: "a_ex_1",
    category: "ai",
    difficulty: "expert",
    question: "كيف تساهم ميزة 'Regularization' (مثل L1 Lasso و L2 Ridge) في حماية وعلاج نماذج تعلم الآلة من الوقوع في مشكلة الـ Overfitting؟",
    options: [
      "عن طريق زيادة كميات البيانات عبر نسخها عدة مرات.",
      "بإضافة حد عقوبة (Penalty Term) لدالة الخسارة يعاقب النموذج على الأوزان الكبيرة أو المعقدة، مما يجبره على تعلم أنماط أبسط وأكثر تعميماً.",
      "بحظر الأوزان الكبيرة تماماً وحذفها من النموذج.",
      "بزيادة عدد مرات دوران التدريب (Epochs) بشكل لامتناهي."
    ],
    correctAnswer: "بإضافة حد عقوبة (Penalty Term) لدالة الخسارة يعاقب النموذج على الأوزان الكبيرة أو المعقدة، مما يجبره على تعلم أنماط أبسط وأكثر تعميماً.",
    points: 2
  },
  {
    id: "a_ex_2",
    category: "ai",
    difficulty: "expert",
    question: "عند استخدام خوارزمية التعلم المعزز (Reinforcement Learning)، ماذا تمثل معادلة بيلمان (Bellman Equation)؟",
    options: [
      "معادلة لحساب عدد الخلايا العصبية في الشبكة.",
      "تصف العلاقة الرياضية بين القيمة الحالية لولاية معينة (State Value) والقيم المستقبلية المتوقعة للحصول على أفضل السياسات والقرارات المتتالية.",
      "صيغة رياضية لتنظيف البيانات المفقودة.",
      "خوارزمية لتصنيف الصور إلى مجموعات متشابهة."
    ],
    correctAnswer: "تصف العلاقة الرياضية بين القيمة الحالية لولاية معينة (State Value) والقيم المستقبلية المتوقعة للحصول على أفضل السياسات والقرارات المتتالية.",
    points: 2
  },
  {
    id: "a_ex_3",
    category: "ai",
    difficulty: "expert",
    question: "ما هو مبدأ عمل الشبكات التوليدية المتنافسة (Generative Adversarial Networks - GANs)؟",
    options: [
      "تعتمد على دمج عدة نماذج تصنيف لحساب النسبة المتوسطة.",
      "تتكون من نموذج مولد (Generator) يحاول تخليق عينات بيانات مزيفة تحاكي الحقيقة، ونموذج مميز (Discriminator) يحاول التمييز بين الحقيقي والمزيف في صراع تنافسي يدرب كليهما.",
      "تستخدم فقط لتشغيل أكواد بايثون على بطاقات رسومية متعددة.",
      "أداة للتحكم في استهلاك الذاكرة وتخفيض درجات الحرارة."
    ],
    correctAnswer: "تتكون من نموذج مولد (Generator) يحاول تخليق عينات بيانات مزيفة تحاكي الحقيقة، ونموذج مميز (Discriminator) يحاول التمييز بين الحقيقي والمزيف في صراع تنافسي يدرب كليهما.",
    points: 2
  },
  
  // EXTRA AI (6 Questions to reach 30)
  {
    id: "a_ext_1",
    category: "ai",
    difficulty: "medium",
    question: "أي مما يلي يمثل الطريقة الصحيحة لحذف الأعمدة التي تحتوي على قيم فارغة في مكتبة Pandas؟",
    options: ["df.dropna(axis=1)", "df.drop_null()", "df.clean()", "df.dropna(axis=0)"],
    correctAnswer: "df.dropna(axis=1)",
    points: 2
  },
  {
    id: "a_ext_2",
    category: "ai",
    difficulty: "hard",
    question: "ما هي دالة التنشيط (Activation Function) التي تحول مخرجات الشبكة العصبية إلى توزيع احتمالي يعبر عن احتمالية الانتماء لكل فئة في التصنيف متعدد الفئات؟",
    options: ["ReLU", "Sigmoid", "Softmax", "Tanh"],
    correctAnswer: "Softmax",
    points: 2
  },
  {
    id: "a_ext_3",
    category: "ai",
    difficulty: "above_medium",
    question: "في تعلم الآلة، ماذا يمثل مصطلح الـ 'Hyperparameters'؟",
    options: ["الخصائص والمعالم التي يتم حسابها وتحديثها تلقائياً أثناء تدريب النموذج.", "الإعدادات والمتغيرات الخارجية التي يقوم المبرمج بضبطها وتحديدها يدوياً قبل بدء عملية التدريب (مثل معدل التعلم وحجم الدفعة).", "معدل استهلاك المعالج الرسومي.", "عدد الحواسيب المتصلة بالشبكة السحابية."],
    correctAnswer: "الإعدادات والمتغيرات الخارجية التي يقوم المبرمج بضبطها وتحديدها يدوياً قبل بدء عملية التدريب (مثل معدل التعلم وحجم الدفعة).",
    points: 2
  },
  {
    id: "a_ext_4",
    category: "ai",
    difficulty: "very_hard",
    question: "أي من المشاكل التالية يصف تدهور النموذج وتراجع دقته بمرور الوقت بسبب تغير العلاقات والخصائص الإحصائية للبيانات الفعلية مقارنة ببيانات التدريب القديمة؟",
    options: ["Data Drift / Concept Drift", "Overfitting", "Gradient Explosion", "Class Imbalance"],
    correctAnswer: "Data Drift / Concept Drift",
    points: 2
  },
  {
    id: "a_ext_5",
    category: "ai",
    difficulty: "professional",
    question: "ما هو دور خوارزمية PCA (Principal Component Analysis) في علم البيانات؟",
    options: ["لزيادة أبعاد المصفوفات وتخزين بيانات جديدة.", "لتقليل أبعاد البيانات (Dimensionality Reduction) عبر إسقاطها على محاور جديدة تحافظ على أكبر قدر ممكن من التباين والاختلاف.", "لتوليد كلمات مرور قوية تلقائياً.", "لإدارة الذاكرة بالخلفية."],
    correctAnswer: "لتقليل أبعاد البيانات (Dimensionality Reduction) عبر إسقاطها على محاور جديدة تحافظ على أكبر قدر ممكن من التباين والاختلاف.",
    points: 2
  },
  {
    id: "a_ext_6",
    category: "ai",
    difficulty: "easy",
    question: "أي من هياكل البيانات التالية في بايثون تمنع تكرار القيم بداخلها تماماً وتحافظ على عناصر فريدة؟",
    options: ["List", "Dictionary", "Set", "Tuple"],
    correctAnswer: "Set",
    points: 2
  }
];

// ==========================================
// 5. ROBOTICS & ARDUINO QUESTIONS (30 Questions)
// ==========================================
export const ROBOTICS_QUESTIONS: PlacementQuestion[] = [
  // VERY EASY & EASY
  {
    id: "r_ve_1",
    category: "robotics",
    difficulty: "very_easy",
    question: "أي وحدة من وحدات القياس التالية تستخدم لقياس المقاومة الكهربائية (Resistance)؟",
    options: ["Volt (فولت)", "Ampere (أمبير)", "Ohm (أوم)", "Watt (واط)"],
    correctAnswer: "Ohm (أوم)",
    points: 2
  },
  {
    id: "r_ve_2",
    category: "robotics",
    difficulty: "very_easy",
    question: "ما هو الجهد الكهربائي القياسي المخرج من معظم أطراف (Output Pins) لوحة Arduino UNO عند ضبطها على القيمة HIGH؟",
    options: ["1.2 فولت", "3.3 فولت", "5 فولت", "12 فولت"],
    correctAnswer: "5 فولت",
    points: 2
  },
  {
    id: "r_e_1",
    category: "robotics",
    difficulty: "easy",
    question: "ما هي الدالة المستخدمة في بيئة Arduino لتحديد دور الطرف (Pin Mode) هل هو مدخل للبيانات (INPUT) أم مخرج لها (OUTPUT)؟",
    options: ["digitalWrite()", "pinMode()", "analogRead()", "setupMode()"],
    correctAnswer: "pinMode()",
    points: 2
  },
  {
    id: "r_e_2",
    category: "robotics",
    difficulty: "easy",
    question: "ما هو دور المقاومة الكهربائية المتصلة بالتوالي مع الـ LED في الدوائر الإلكترونية؟",
    options: [
      "لتكبير شدة الضوء وجعله ساطعاً جداً.",
      "لتقليل قيمة الجهد المتردد وحماية الـ LED من الاحتراق عبر الحد من شدة التيار المار بداخلها.",
      "لتحسين استجابة الاستشعار اللاسلكي.",
      "لتغيير لون إضاءة الـ LED."
    ],
    correctAnswer: "لتقليل قيمة الجهد المتردد وحماية الـ LED من الاحتراق عبر الحد من شدة التيار المار بداخلها.",
    points: 2
  },
  {
    id: "r_e_3",
    category: "robotics",
    difficulty: "easy",
    question: "أي طرف من أطراف الـ LED يمثل القطب الموجب (Anode) الذي يجب توصيله بالجهد الموجب؟",
    options: ["الطرف الأطول", "الطرف الأقصر", "كلا الطرفين متساويين", "الطرف ذو اللون الأحمر فقط"],
    correctAnswer: "الطرف الأطول",
    points: 2
  },

  // MEDIUM & ABOVE MEDIUM
  {
    id: "r_m_1",
    category: "robotics",
    difficulty: "medium",
    question: "ما هي الوظيفة الأساسية للـ Relay (المرحل الكهربائي) في دوائر الأتمتة والروبوتات؟",
    options: [
      "قياس المسافة بين الروبوت والعوائق.",
      "مفتاح كهربائي يتم التحكم به إلكترونياً يسمح لدائرة جهد منخفض (مثل الأردوينو 5 فولت) بالتحكم في تشغيل دائرة جهد وتيار عالٍ (مثل الأجهزة المنزلية 220 فولت) بأمان.",
      "تخزين الطاقة الكهربائية وحماية اللوحة من الانقطاع.",
      "تحويل الإشارات الرقمية إلى إشارات تماثلية."
    ],
    correctAnswer: "مفتاح كهربائي يتم التحكم به إلكترونياً يسمح لدائرة جهد منخفض (مثل الأردوينو 5 فولت) بالتحكم في تشغيل دائرة جهد وتيار عالٍ (مثل الأجهزة المنزلية 220 فولت) بأمان.",
    points: 2
  },
  {
    id: "r_m_2",
    category: "robotics",
    difficulty: "medium",
    question: "في لغة البرمجة C++ المستخدمة للأردوينو، ما الفرق بين المتغيرات المحلّية (Local Variables) والمتغيرات العامة (Global Variables)؟",
    options: [
      "المحلية يمكن قراءتها من أي دالة، بينما العامة تقرأ فقط داخل الدالة التي تم تعريفها بها.",
      "العامة يتم تعريفها خارج جميع الدوال ويمكن الوصول إليها واستخدامها من أي مكان في الكود، بينما المحلية تُعرف داخل دالة معينة ويقتصر نطاقها عليها فقط.",
      "المتغيرات العامة تعمل فقط على الأندرويد والمحلية على الكمبيوتر.",
      "لا يوجد فرق سوى في الحجم التخزيني فقط."
    ],
    correctAnswer: "العامة يتم تعريفها خارج جميع الدوال ويمكن الوصول إليها واستخدامها من أي مكان في الكود، بينما المحلية تُعرف داخل دالة معينة ويقتصر نطاقها عليها فقط.",
    points: 2
  },
  {
    id: "r_m_3",
    category: "robotics",
    difficulty: "medium",
    question: "أي من الحساسات (Sensors) التالية يعمل على إرسال موجات صوتية عالية التردد واستقبالها لحساب المسافة الفاصلة عن العوائق؟",
    options: ["LDR Sensor", "DHT11 Temp & Humidity Sensor", "Ultrasonic Sensor (HC-SR04)", "PIR Motion Sensor"],
    correctAnswer: "Ultrasonic Sensor (HC-SR04)",
    points: 2
  },
  {
    id: "r_am_1",
    category: "robotics",
    difficulty: "above_medium",
    question: "كيف تختلف أطراف التعديل النبضي العرضي (PWM Pins) عن الأطراف الرقمية العادية (Digital Pins) في لوحة Arduino UNO؟",
    options: [
      "الـ PWM تدعم التوصيل ببطاقات الذاكرة الخارجية.",
      "الـ PWM تتيح محاكاة إخراج إشارات تناظرية متدرجة (Analog-like Output) عبر تغيير دورة العمل (Duty Cycle) للتحكم في شدة الإضاءة وسرعة المحركات.",
      "الـ PWM تعمل فقط بجهد 12 فولت.",
      "الـ PWM تستخدم فقط لتحديد اتجاه القبلة."
    ],
    correctAnswer: "الـ PWM تتيح محاكاة إخراج إشارات تناظرية متدرجة (Analog-like Output) عبر تغيير دورة العمل (Duty Cycle) للتحكم في شدة الإضاءة وسرعة المحركات.",
    points: 2
  },
  {
    id: "r_am_2",
    category: "robotics",
    difficulty: "above_medium",
    question: "ما هو الغرض من استخدام دالة map() في كود برمجة الأردوينو؟",
    options: [
      "لعرض خريطة جغرافية عبر شاشة الـ LCD.",
      "لتحويل وتناسب قيمة رقمية من نطاق قيم محدد إلى نطاق قيم جديد (مثال: تحويل قراءة حساس تناظري من 0-1023 إلى قيمة تحكم PWM من 0-255).",
      "لتسجيل وحفظ إحداثيات الحركة للروبوت.",
      "لتوصيل الأردوينو بشبكات الواي فاي تلقائياً."
    ],
    correctAnswer: "لتحويل وتناسب قيمة رقمية من نطاق قيم محدد إلى نطاق قيم جديد (مثال: تحويل قراءة حساس تناظري من 0-1023 إلى قيمة تحكم PWM من 0-255).",
    points: 2
  },
  {
    id: "r_am_3",
    category: "robotics",
    difficulty: "above_medium",
    question: "ماذا يسمى الموتور (Motor) الذي يسمح لك بالتحكم بدقة متناهية في زاوية الدوران الخاصة به (مثل الحركة من 0 إلى 180 درجة بالتمام والكمال)؟",
    options: ["DC Motor", "Stepper Motor", "Servo Motor", "Brushless Motor"],
    correctAnswer: "Servo Motor",
    points: 2
  },

  // HARD & VERY HARD
  {
    id: "r_h_1",
    category: "robotics",
    difficulty: "hard",
    question: "أي من الخيارات التالية يمثل البروتوكول السلكي المسمى SPI (Serial Peripheral Interface)؟",
    options: [
      "بروتوكول لاسلكي يعتمد على البلوتوث.",
      "بروتوكول اتصالات سلكي متزامن يعتمد على 4 أسلاك (MISO, MOSI, SCK, SS) يدعم نقل البيانات بسرعة فائقة بين وحدة التحكم والملحقات.",
      "بروتوكول ينقل البيانات عبر سلكين فقط هما SDA و SCL.",
      "نظام لتوصيل الطاقة الكهربائية عن بعد."
    ],
    correctAnswer: "بروتوكول اتصالات سلكي متزامن يعتمد على 4 أسلاك (MISO, MOSI, SCK, SS) يدعم نقل البيانات بسرعة فائقة بين وحدة التحكم والملحقات.",
    points: 2
  },
  {
    id: "r_h_2",
    category: "robotics",
    difficulty: "hard",
    question: "لماذا يجب استخدام دائرة متكاملة لقيادة المحركات (مثل L298N H-Bridge) بدلاً من توصيل الـ DC Motor مباشرة بأطراف الأردوينو؟",
    options: [
      "لتنظيف كود البرمجة وتسريعه.",
      "لأن المحركات تستهلك تياراً كهربائياً عالياً جداً يفوق قدرة أطراف الأردوينو (والتي حدها الأقصى 40 مللي أمبير)، بجانب الحاجة لعكس اتجاه حركة الدوران إلكترونياً.",
      "لتشغيل المحرك بدون بطارية خارجية.",
      "لحماية المحركات من الأتربة والرطوبة."
    ],
    correctAnswer: "لأن المحركات تستهلك تياراً كهربائياً عالياً جداً يفوق قدرة أطراف الأردوينو (والتي حدها الأقصى 40 مللي أمبير)، بجانب الحاجة لعكس اتجاه حركة الدوران إلكترونياً.",
    points: 2
  },
  {
    id: "r_h_3",
    category: "robotics",
    difficulty: "hard",
    question: "ما هي ميزة استخدام المقاطعات (Interrupts) مثل attachInterrupt() في الأردوينو؟",
    options: [
      "تسمح للوحة الأردوينو بإيقاف استهلاك الطاقة والتشغيل التلقائي.",
      "تتيح الاستجابة الفورية واللحظية للأحداث الخارجية الطارئة فور وقوعها عن طريق إيقاف تنفيذ الكود الحالي مؤقتاً وتشغيل دالة خدمة المقاطعة (ISR) ثم العودة للكود الرئيسي.",
      "تستخدم لمقاطعة اتصال المتسللين وحماية الدوائر.",
      "تسرع تحميل أكواد البرمجة للوحة."
    ],
    correctAnswer: "تتيح الاستجابة الفورية واللحظية للأحداث الخارجية الطارئة فور وقوعها عن طريق إيقاف تنفيذ الكود الحالي مؤقتاً وتشغيل دالة خدمة المقاطعة (ISR) ثم العودة للكود الرئيسي.",
    points: 2
  },
  {
    id: "r_vh_1",
    category: "robotics",
    difficulty: "very_hard",
    question: "عند التعامل مع لوحة ESP32، ما هو دور نظام التشغيل FreeRTOS المدمج؟",
    options: [
      "لأتمتة عملية رفع الكود السحابي.",
      "نظام تشغيل مدمج بالوقت الفعلي (Real-Time OS) يتيح تعدد المهام الحقيقي (Multi-tasking) وتوزيع تشغيل المهام البرمجية بالتوازي على نواتي المعالج (Dual-core execution).",
      "أداة لتشغيل ألعاب الفيديو مباشرة على اللوحة.",
      "بروتوكول لزيادة الجهد الكهربائي تلقائياً."
    ],
    correctAnswer: "نظام تشغيل مدمج بالوقت الفعلي (Real-Time OS) يتيح تعدد المهام الحقيقي (Multi-tasking) وتوزيع تشغيل المهام البرمجية بالتوازي على نواتي المعالج (Dual-core execution).",
    points: 2
  },
  {
    id: "r_vh_2",
    category: "robotics",
    difficulty: "very_hard",
    question: "ماذا يسمى الارتداد الميكانيكي الحادث عند الضغط على زر ضاغط (Switch Bounce) وكيف يتم معالجته برمجياً (Debouncing)؟",
    options: [
      "اهتزاز ميكانيكي بالأسلاك ويتم حله بلحام القطع.",
      "تولد قراءات منطقية متكررة خاطئة وسريعة للغاية لحظة التلامس الميكانيكي، ويتم حله برمجياً بإضافة تأخير زمني بسيط (Delay) أو فحص تغير الحالة بعد استقرار زمني محدد.",
      "تلف في لوحة الأردوينو بسبب زيادة الضغط العنيف.",
      "سلوك طبيعي ولا يحتاج لمعالجة برمجية إطلاقاً."
    ],
    correctAnswer: "تولد قراءات منطقية متكررة خاطئة وسريعة للغاية لحظة التلامس الميكانيكي، ويتم حله برمجياً بإضافة تأخير زمني بسيط (Delay) أو فحص تغير الحالة بعد استقرار زمني محدد.",
    points: 2
  },
  {
    id: "r_vh_3",
    category: "robotics",
    difficulty: "very_hard",
    question: "أي من البروتوكولات اللاسلكية التالية يعتبر الأنسب لإرسال قراءات حساسات خفيفة ومتقطعة من روبوت متصل بالإنترنت إلى خادم سحابي بأقل استهلاك للطاقة والبيانات؟",
    options: ["HTTP POST", "FTP", "MQTT (Message Queuing Telemetry Transport)", "RTSP"],
    correctAnswer: "MQTT (Message Queuing Telemetry Transport)",
    points: 2
  },

  // PROFESSIONAL & EXPERT
  {
    id: "r_p_1",
    category: "robotics",
    difficulty: "professional",
    question: "ما هو مبدأ عمل الـ Pull-up والـ Pull-down Resistors في دوائر الأزرار الرقمية؟",
    options: [
      "لتنظيم قيمة الجهد المتردد وحماية الزر من الاحتراق.",
      "لضمان إعطاء الطرف الرقمي حالة منطقية مستقرة ومحددة بدقة (إما 5 فولت HIGH أو 0 فولت LOW) ومنع حالة التعويم (Floating State) المشوشة والغير مستقرة عند ترك الزر غير مضغوط.",
      "لتكبير التيار الكهربائي لزيادة سرعة الحركة.",
      "لمنع التيار من الانعكاس تلقائياً."
    ],
    correctAnswer: "لضمان إعطاء الطرف الرقمي حالة منطقية مستقرة ومحددة بدقة (إما 5 فولت HIGH أو 0 فولت LOW) ومنع حالة التعويم (Floating State) المشوشة والغير مستقرة عند ترك الزر غير مضغوط.",
    points: 2
  },
  {
    id: "r_p_2",
    category: "robotics",
    difficulty: "professional",
    question: "أي من التقنيات التالية تصف خوارزمية التحكم والتغذية الراجعة المعروفة بـ PID (Proportional-Integral-Derivative Controller)؟",
    options: [
      "خوارزمية لتشفير البيانات المرسلة بالبلوتوث.",
      "نظام تحكم مستمر يقوم بحساب قيمة الخطأ وتطبيق تصحيح تدريجي متزن يعتمد على الخطأ الحالي والخطأ المتراكم ومعدل التغير للوصول للاستقرار بدقة (مثل استقرار حركة طائرة درون).",
      "طريقة لعرض إحداثيات الحركة تلقائياً.",
      "بروتوكول لزيادة سرعة دوران المحرك للحد الأقصى."
    ],
    correctAnswer: "نظام تحكم مستمر يقوم بحساب قيمة الخطأ وتطبيق تصحيح تدريجي متزن يعتمد على الخطأ الحالي والخطأ المتراكم ومعدل التغير للوصول للاستقرار بدقة (مثل استقرار حركة طائرة درون).",
    points: 2
  },
  {
    id: "r_p_3",
    category: "robotics",
    difficulty: "professional",
    question: "ما هو الـ ADC (Analog to Digital Converter) وبأي دقة يعمل المعالج في Arduino UNO الافتراضي؟",
    options: [
      "محول يحول الإشارة الرقمية لتناظرية بدقة 12 بت.",
      "محول يحول الجهد التناظري المستمر إلى قيمة رقمية مقابلة، ويعمل في Arduino UNO بدقة 10 بت (مما يترجم القراءة إلى نطاق من 0 إلى 1023).",
      "برنامج لإعادة هيكلة ملفات الذاكرة العشوائية.",
      "أداة لقياس درجة الحرارة عن بعد."
    ],
    correctAnswer: "محول يحول الجهد التناظري المستمر إلى قيمة رقمية مقابلة، ويعمل في Arduino UNO بدقة 10 بت (مما يترجم القراءة إلى نطاق من 0 إلى 1023).",
    points: 2
  },
  {
    id: "r_ex_1",
    category: "robotics",
    difficulty: "expert",
    question: "لماذا يحدث تلف لملفات الذاكرة المؤقتة (RAM) في لوحات الأردوينو الضعيفة عند الاستخدام المفرط للنصوص String الكبيرة وكيف يمكن تجنب ذلك برمجياً؟",
    options: [
      "بسبب تفتت الذاكرة (Memory Fragmentation) الناتج عن الديناميكية المتكررة لإنشاء وحذف كائنات String، ويتم تجنبه باستخدام مصفوفات الحروف الثابتة C-style strings (char arrays) واستخدام ماكرو F().",
      "بسبب زيادة درجات الحرارة للميكروكنترولر، ويتم تجنبه بوضع مروحة تبريد.",
      "بسبب حظر اتصال الواي فاي، ويتم تجنبه بحذف الملفات نهائياً.",
      "لا يحدث أي تلف برمجياً للذاكرة في الأردوينو."
    ],
    correctAnswer: "بسبب تفتت الذاكرة (Memory Fragmentation) الناتج عن الديناميكية المتكررة لإنشاء وحذف كائنات String، ويتم تجنبه باستخدام مصفوفات الحروف الثابتة C-style strings (char arrays) واستخدام ماكرو F().",
    points: 2
  },
  {
    id: "r_ex_2",
    category: "robotics",
    difficulty: "expert",
    question: "عند بناء نظام حقيقي للسيارات ذاتية القيادة باستخدام ROS (Robot Operating System)، ماذا يمثل مفهوم الـ Pub/Sub Architecture؟",
    options: [
      "نظام لحظر اتصال اللوحات المبرمجة بالإنترنت حماية لها.",
      "بنية اتصالات موزعة تتيح للعقد البرمجية (Nodes) نشر رسائل بيانات (Publish Topics) واستقبالها (Subscribe) بشكل غير متزامن لتسهيل تبادل معلومات الحساسات والحركة.",
      "طريقة لعرض إعلانات ممولة داخل شاشة الروبوت.",
      "بروتوكول لزيادة سرعة معالجة الصور بالروبوت."
    ],
    correctAnswer: "بنية اتصالات موزعة تتيح للعقد البرمجية (Nodes) نشر رسائل بيانات (Publish Topics) واستقبالها (Subscribe) بشكل غير متزامن لتسهيل تبادل معلومات الحساسات والحركة.",
    points: 2
  },
  {
    id: "r_ex_3",
    category: "robotics",
    difficulty: "expert",
    question: "ماذا يسمى نظام مراقبة السلامة البرمجية المدمج بالمتحكمات (Watchdog Timer) وكيف يساعد في منع الروبوت من التعليق أو التصرف بشكل عشوائي؟",
    options: [
      "مؤقت أمان يقوم بمراقبة كود التشغيل وإجراء إعادة تشغيل تلقائية كاملة للمتحكم (Hardware Reset) إذا علق الكود أو توقف عن الاستجابة وإعادة تصفير المؤقت خلال فترة زمنية محددة.",
      "أداة لتسجيل وحفظ إحداثيات الحركة.",
      "ساعة رقمية تعرض التوقيت الفعلي للمستخدم.",
      "نظام لتشغيل المحرك بدون تيار كهربائي."
    ],
    correctAnswer: "مؤقت أمان يقوم بمراقبة كود التشغيل وإجراء إعادة تشغيل تلقائية كاملة للمتحكم (Hardware Reset) إذا علق الكود أو توقف عن الاستجابة وإعادة تصفير المؤقت خلال فترة زمنية محددة.",
    points: 2
  },

  // EXTRA ROBOTICS (6 Questions to reach 30)
  {
    id: "r_ext_1",
    category: "robotics",
    difficulty: "medium",
    question: "أي دالة في Arduino تستخدم لتأخير تنفيذ الكود لفترة زمنية محددة بالملي ثانية؟",
    options: ["sleep()", "delay()", "wait()", "hold()"],
    correctAnswer: "delay()",
    points: 2
  },
  {
    id: "r_ext_2",
    category: "robotics",
    difficulty: "hard",
    question: "ما هو بروتوكول الاتصال سلكياً الذي يستخدم سلكين فقط (SDA و SCL) لربط الـ Arduino بعدة ملحقات؟",
    options: ["UART", "I2C", "SPI", "Bluetooth"],
    correctAnswer: "I2C",
    points: 2
  },
  {
    id: "r_ext_3",
    category: "robotics",
    difficulty: "above_medium",
    question: "أي من الحساسات التالية يقوم بقياس درجة الحرارة ونسبة الرطوبة في الجو المحيط؟",
    options: ["LDR Sensor", "DHT11 / DHT22 Sensor", "HC-SR04 Ultrasonic", "PIR Motion Sensor"],
    correctAnswer: "DHT11 / DHT22 Sensor",
    points: 2
  },
  {
    id: "r_ext_4",
    category: "robotics",
    difficulty: "very_hard",
    question: "ماذا يعني مصطلح الـ I/O Multiplexing في الدوائر الإلكترونية؟",
    options: ["توسيع عدد أطراف الدخول والخروج باستخدام دوائر متكاملة (مثال: Shift Register 74HC595) للتحكم في مخارج متعددة بأقل أطراف تحكم ممكنة.", "حظر تشغيل اللوحة الكهربائية.", "دمج المحركات مع الحساسات في منفذ واحد.", "طريقة لتشفير إشارات الراديو اللاسلكية."],
    correctAnswer: "توسيع عدد أطراف الدخول والخروج باستخدام دوائر متكاملة (مثال: Shift Register 74HC595) للتحكم في مخارج متعددة بأقل أطراف تحكم ممكنة.",
    points: 2
  },
  {
    id: "r_ext_5",
    category: "robotics",
    difficulty: "professional",
    question: "ما هي القيمة القصوى المقروءة من طرف تناظري (Analog Pin) على لوحة Arduino UNO عند تطبيق جهد 5 فولت عليه؟",
    options: ["255", "500", "1023", "4095"],
    correctAnswer: "1023",
    points: 2
  },
  {
    id: "r_ext_6",
    category: "robotics",
    difficulty: "easy",
    question: "ما هي الدالة الأساسية لكود أردوينو والتي تحتوي على الإعدادات الأولية للوحة ويتم تشغيلها مرة واحدة فقط في البداية؟",
    options: ["loop()", "setup()", "main()", "init()"],
    correctAnswer: "setup()",
    points: 2
  }
];

// ==========================================
// 6. TRACK RECOMMENDATION (INTEREST) QUIZ (10 Questions)
// ==========================================
export const INTEREST_QUESTIONS: InterestQuestion[] = [
  {
    id: "int_1",
    question: "هل تستمتع بتصميم الأشكال، تناسق الألوان، وترتيب العناصر البصرية؟",
    options: [
      { text: "نعم، أحب الجانب الجمالي والبصري كثيراً", weights: { web: 5, mobile: 3 } },
      { text: "أفضل التفكير المنطقي والعمليات البرمجية الباطنية", weights: { ai: 4, robotics: 4 } },
      { text: "أحب العمل على الجانبين بالتساوي", weights: { web: 3, mobile: 4, robotics: 2 } }
    ]
  },
  {
    id: "int_2",
    question: "ما نوع المشاريع التي تثير حماسك أكثر وتتمنى بنائها؟",
    options: [
      { text: "مواقع إلكترونية تفاعلية يستعرضها الملايين عبر المتصفح", weights: { web: 5 } },
      { text: "تطبيقات هواتف ذكية ممتازة متوفرة بمتجر Google Play و App Store", weights: { mobile: 5 } },
      { text: "أنظمة ذكية تتنبأ بالمستقبل أو تتعرف على الصور والأصوات بدقة", weights: { ai: 5 } },
      { text: "روبوتات، طائرات درون، أو أجهزة منزلية ذكية تتفاعل مع الواقع", weights: { robotics: 5 } }
    ]
  },
  {
    id: "int_3",
    question: "ما هو شعورك تجاه الرياضيات، الإحصاء، وتحليل جداول البيانات الضخمة؟",
    options: [
      { text: "أعشق الرياضيات والاستنتاج التحليلي وحل المسائل المعقدة", weights: { ai: 5, robotics: 3 } },
      { text: "أفضل كتابة أكواد تفاعلية عملية دون الدخول في تفاصيل رياضية معقدة", weights: { web: 4, mobile: 4 } },
      { text: "أحب الرياضيات البسيطة فقط المرتبطة بحسابات الأبعاد والدوائر الكهربائية", weights: { robotics: 4, web: 1 } }
    ]
  },
  {
    id: "int_4",
    question: "هل تفضل التعامل مع المكونات الملموسة والأسلاك (Hardware) أم تفضل العمل البرمجي بالكامل (Software)؟",
    options: [
      { text: "أحب الهاردوير وربط المكونات المادية وتصميم الدوائر الإلكترونية", weights: { robotics: 5 } },
      { text: "أفضل العمل على الحاسوب وتطوير الأنظمة البرمجية بالكامل", weights: { web: 4, mobile: 4, ai: 4 } }
    ]
  },
  {
    id: "int_5",
    question: "أي من بيئات العمل التالية تفضلها عند استخدام البرامج والألعاب؟",
    options: [
      { text: "الكمبيوتر ومتصفح الويب (Chrome, Safari, etc)", weights: { web: 5, ai: 3 } },
      { text: "شاشة الموبايل والتطبيقات السريعة المتنقلة", weights: { mobile: 5 } },
      { text: "اللوحات المبرمجة والشاشات الصغيرة المرتبطة بالقطع المادية", weights: { robotics: 5 } }
    ]
  },
  {
    id: "int_6",
    question: "هل تنجذب إلى كيفية اتخاذ الآلات للقرارات الذكية وفهم سلوك البشر؟",
    options: [
      { text: "نعم، يثيرني جداً كيف يفكر ChatGPT وكيف تقترح البرامج الفيديوهات", weights: { ai: 5 } },
      { text: "أفضل البرمجيات المحددة بقواعد واضحة وواجهات استجابة تفاعلية", weights: { web: 4, mobile: 4, robotics: 2 } }
    ]
  },
  {
    id: "int_7",
    question: "ما هو الجانب الأكثر أهمية بالنسبة لك عند بناء مشروع جديد؟",
    options: [
      { text: "رؤية النتيجة البصرية والتصميم النهائي للمستخدم فوراً", weights: { web: 5, mobile: 4 } },
      { text: "المنطق البرمجي الخفي وصحة البيانات المخزنة وجودتها", weights: { ai: 4, web: 2, mobile: 2 } },
      { text: "حركة الروبوت أو تشغيل الحساسات والقطع المادية في الواقع", weights: { robotics: 5 } }
    ]
  },
  {
    id: "int_8",
    question: "إذا تعطل مشروعك، أي نوع من المشكلات تفضل البحث عنه وحله (Debugging)؟",
    options: [
      { text: "أخطاء في أماكن الأزرار، الألوان، أو استجابة التصميم على الهواتف", weights: { web: 4, mobile: 4 } },
      { text: "أخطاء منطقية، مشاكل في دقة النتائج الإحصائية ومصفوفات الرياضيات", weights: { ai: 5 } },
      { text: "أسلاك مفصولة، تلف في الحساسات، أو مشاكل في قيم الفولت الكهربائي", weights: { robotics: 5 } }
    ]
  },
  {
    id: "int_9",
    question: "كيف ترى نفسك تعمل في المستقبل بعد انتهاء دراستك البرمجية؟",
    options: [
      { text: "مطور مستقل (Freelancer) أبني مواقع للشركات عن بعد", weights: { web: 5, mobile: 3 } },
      { text: "مطور تطبيقات لشركات ناشئة أو إطلاق تطبيقي الخاص بالمتجر", weights: { mobile: 5, web: 2 } },
      { text: "عالم بيانات أو مهندس ذكاء اصطناعي في شركة برمجية كبرى", weights: { ai: 5 } },
      { text: "مهندس أنظمة مدمجة أو مصمم روبوتات في مصنع أو مختبر تقني", weights: { robotics: 5 } }
    ]
  },
  {
    id: "int_10",
    question: "أي من العلوم المدرسية الآتية كنت تفضلها وتجد متعة في دراستها؟",
    options: [
      { text: "الفيزياء والإلكترونيات والطاقة الكهربائية", weights: { robotics: 5 } },
      { text: "الرياضيات والإحصاء والعمليات الرقمية والمنطقية", weights: { ai: 5 } },
      { text: "اللغات والرسم والفنون والتعبير الإنشائي والبصري", weights: { web: 4, mobile: 4 } }
    ]
  }
];

// ==========================================
// 7. INTELLIGENT RECOMMENDATION ALGORITHM
// ==========================================
export function runRecommendationEngine(answers: Record<string, string>): { track: string; reason: string } {
  const scores: Record<string, number> = {
    web: 0,
    mobile: 0,
    ai: 0,
    robotics: 0
  };

  INTEREST_QUESTIONS.forEach((q) => {
    const selectedText = answers[q.id];
    if (!selectedText) return;

    const matchedOption = q.options.find((opt) => opt.text === selectedText);
    if (matchedOption && matchedOption.weights) {
      Object.entries(matchedOption.weights).forEach(([track, weight]) => {
        scores[track] = (scores[track] || 0) + weight;
      });
    }
  });

  let recommendedTrackKey = 'web';
  let highestScore = -1;

  Object.entries(scores).forEach(([track, score]) => {
    if (score > highestScore) {
      highestScore = score;
      recommendedTrackKey = track;
    }
  });

  const recommendations: Record<string, { name: string; reason: string }> = {
    web: {
      name: "Web Development (تطوير الويب)",
      reason: "تشير إجاباتك إلى اهتمامك البالغ بالتصميم البصري، وتطوير مواقع الإنترنت التفاعلية، والعمل المستقل (Freelancing). يركز هذا المسار على لغات HTML و CSS و JavaScript وبناء صفحات ويب متجاوبة وجذابة للمستخدمين."
    },
    mobile: {
      name: "Mobile Development (تطوير تطبيقات الموبايل)",
      reason: "تشير إجاباتك إلى شغفك الكبير بالهواتف الذكية وتفضيلك لبناء تطبيقات مفيدة ومتاحة على متاجر التطبيقات. يركز هذا المسار على لغة Dart وإطار عمل Flutter لبناء تطبيقات سريعة وجميلة للهواتف المحمولة."
    },
    ai: {
      name: "Artificial Intelligence (الذكاء الاصطناعي وعلوم البيانات)",
      reason: "تشير إجاباتك إلى تميزك في التفكير المنطقي والتحليلي، وحبك للرياضيات والإحصاء واستكشاف الأنظمة الذكية مثل التعرف على الصور والتنبؤات. يركز هذا المسار على لغة Python ومفاهيم تعلم الآلة والشبكات العصبية العميقة."
    },
    robotics: {
      name: "Robotics & Arduino (الروبوتات وإنترنت الأشياء IoT)",
      reason: "تشير إجاباتك إلى حبك الشديد للمكونات المادية والأسلاك والتجريب الميداني والفيزياء الكهربائية والدوائر الإلكترونية. يركز هذا المسار على لغة C++ وبرمجة لوحات Arduino و ESP32 وتصميم روبوتات ذكية تتفاعل مع البيئة المحيطة بها."
    }
  };

  const result = recommendations[recommendedTrackKey] || recommendations['web'];
  return {
    track: result.name,
    reason: result.reason
  };
}

// ==========================================
// 8. ADAPTIVE QUESTION SELECTION UTILITY (Selects 50 Questions)
// ==========================================
export function selectAdaptiveQuestions(
  chosenTrack: string,
  generalQuestions: PlacementQuestion[] = GENERAL_QUESTIONS,
  webQuestions: PlacementQuestion[] = WEB_QUESTIONS,
  mobileQuestions: PlacementQuestion[] = MOBILE_QUESTIONS,
  aiQuestions: PlacementQuestion[] = AI_QUESTIONS,
  roboticsQuestions: PlacementQuestion[] = ROBOTICS_QUESTIONS
): PlacementQuestion[] {
  const selected: PlacementQuestion[] = [];
  const difficulties: PlacementQuestion['difficulty'][] = [
    'very_easy',
    'easy',
    'medium',
    'above_medium',
    'hard',
    'very_hard',
    'professional',
    'expert'
  ];

  // Helper to shuffle arrays randomly
  const shuffle = <T>(array: T[]): T[] => {
    return array.map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  };

  // Case 1: Specific Track chosen -> Select 25 General + 25 Track = 50 questions
  if (chosenTrack !== 'لا أستطيع تحديد المسار') {
    // 1. Select 25 General questions: roughly 3 questions from each of the 8 difficulties (shuffled)
    difficulties.forEach((diff, index) => {
      const pool = generalQuestions.filter(q => q.difficulty === diff);
      const countToSelect = (index === 0 || index === 7) ? 3 : 3; // 8 difficulties * 3 = 24, add 1 more to reach 25
      const selectCount = index === 0 ? 4 : countToSelect;
      const shuffledPool = shuffle(pool);
      shuffledPool.slice(0, selectCount).forEach(q => selected.push(q));
    });

    // 2. Select 25 Track-specific questions: roughly 3 from each difficulty
    let trackPool: PlacementQuestion[] = [];
    if (chosenTrack === 'Web Development') trackPool = webQuestions;
    else if (chosenTrack === 'Mobile Development') trackPool = mobileQuestions;
    else if (chosenTrack === 'Artificial Intelligence') trackPool = aiQuestions;
    else if (chosenTrack === 'Robotics & Arduino') trackPool = roboticsQuestions;

    if (trackPool.length > 0) {
      difficulties.forEach((diff, index) => {
        const pool = trackPool.filter(q => q.difficulty === diff);
        const countToSelect = (index === 0 || index === 7) ? 3 : 3;
        const selectCount = index === 0 ? 4 : countToSelect; // reach 25
        const shuffledPool = shuffle(pool);
        shuffledPool.slice(0, selectCount).forEach(q => selected.push(q));
      });
    }

    // Sort the selected 50 questions by difficulty order to progress from easy to hard
    const diffWeight: Record<PlacementQuestion['difficulty'], number> = {
      very_easy: 1,
      easy: 2,
      medium: 3,
      above_medium: 4,
      hard: 5,
      very_hard: 6,
      professional: 7,
      expert: 8
    };

    return selected.sort((a, b) => diffWeight[a.difficulty] - diffWeight[b.difficulty]);
  } 
  
  // Case 2: Undecided track -> Select 40 General questions (5 from each of the 8 difficulties)
  // Interest questions (10 questions) will be handled separately in the UI progression flow to sum up to 50 questions total.
  difficulties.forEach((diff) => {
    const pool = generalQuestions.filter(q => q.difficulty === diff);
    const shuffledPool = shuffle(pool);
    // Take exactly 5 from each difficulty (8 * 5 = 40 questions)
    shuffledPool.slice(0, 5).forEach(q => selected.push(q));
  });

  const diffWeight: Record<PlacementQuestion['difficulty'], number> = {
    very_easy: 1,
    easy: 2,
    medium: 3,
    above_medium: 4,
    hard: 5,
    very_hard: 6,
    professional: 7,
    expert: 8
  };

  return selected.sort((a, b) => diffWeight[a.difficulty] - diffWeight[b.difficulty]);
}
