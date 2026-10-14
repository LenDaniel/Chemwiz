const plans = {
  free: {
    key: "free",
    name: "Free",
    aiDailyLimit: 5,
    notesAccess: "basic",
    quizAccess: "limited",
  },
  student_plus: {
    key: "student_plus",
    name: "Student Plus",
    aiDailyLimit: 50,
    notesAccess: "full",
    quizAccess: "full",
  },
  teacher: {
    key: "teacher",
    name: "Teacher",
    aiDailyLimit: 100,
    notesAccess: "full",
    quizAccess: "full",
    classTools: true,
  },
  school: {
    key: "school",
    name: "School",
    aiDailyLimit: 500,
    notesAccess: "full",
    quizAccess: "full",
    classTools: true,
    bulkUsers: true,
  },
};

module.exports = plans;
