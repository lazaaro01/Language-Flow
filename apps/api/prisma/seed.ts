import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Levels
  const levels = await Promise.all(
    [
      { name: 'Beginner', minXp: 0, maxXp: 1000 },
      { name: 'Elementary', minXp: 1000, maxXp: 3000 },
      { name: 'Intermediate', minXp: 3000, maxXp: 7000 },
      { name: 'Advanced', minXp: 7000, maxXp: 15000 },
      { name: 'Fluent', minXp: 15000, maxXp: 999999 },
    ].map((l) => prisma.level.upsert({ where: { name: l.name }, create: l, update: l })),
  );

  // Achievements
  const achievements = [
    { title: 'First Steps', description: 'Complete your first lesson', icon: '🎯', conditionType: 'lessons', conditionCount: 1, xpReward: 100 },
    { title: 'Dedicated Learner', description: 'Complete 10 lessons', icon: '📚', conditionType: 'lessons', conditionCount: 10, xpReward: 300 },
    { title: 'Knowledge Seeker', description: 'Complete 50 lessons', icon: '🏆', conditionType: 'lessons', conditionCount: 50, xpReward: 1000 },
    { title: 'Streak Beginner', description: '3-day study streak', icon: '🔥', conditionType: 'streak', conditionCount: 3, xpReward: 150 },
    { title: 'Streak Master', description: '30-day study streak', icon: '💪', conditionType: 'streak', conditionCount: 30, xpReward: 2000 },
    { title: 'Chatterbox', description: 'Start 10 conversations', icon: '💬', conditionType: 'conversations', conditionCount: 10, xpReward: 500 },
    { title: 'Vocabulary Builder', description: 'Review 100 flashcards', icon: '📖', conditionType: 'flashcards', conditionCount: 100, xpReward: 500 },
    { title: 'Rising Star', description: 'Reach Intermediate level', icon: '⭐', conditionType: 'level', conditionCount: 3, xpReward: 1000 },
    { title: 'Perfect Score', description: 'Get 100% on a lesson', icon: '💯', conditionType: 'perfect', conditionCount: 1, xpReward: 200 },
    { title: 'Social Butterfly', description: 'Participate in the weekly ranking', icon: '🦋', conditionType: 'ranking', conditionCount: 1, xpReward: 100 },
  ];

  for (const a of achievements) {
    await prisma.achievement.upsert({
      where: { id: a.title },
      create: { ...a, id: a.title },
      update: a,
    });
  }

  // Grammar Lessons
  const beginnerLevel = levels[0];
  const elementaryLevel = levels[1];

  const grammarLessons = [
    { title: 'Verb To Be', description: 'Learn the verb "to be" in present tense', module: 'grammar', order: 1, levelId: beginnerLevel.id,
      exercises: [
        { type: 'multiple-choice', question: 'I ___ a student.', options: JSON.stringify(['am', 'is', 'are', 'be']), correctAnswer: 'am', order: 1 },
        { type: 'multiple-choice', question: 'She ___ a teacher.', options: JSON.stringify(['am', 'is', 'are', 'be']), correctAnswer: 'is', order: 2 },
        { type: 'fill-blank', question: 'We ___ happy.', correctAnswer: 'are', order: 3 },
        { type: 'fill-blank', question: 'They ___ at home.', correctAnswer: 'are', order: 4 },
        { type: 'multiple-choice', question: '___ you ready?', options: JSON.stringify(['Am', 'Is', 'Are', 'Be']), correctAnswer: 'Are', order: 5 },
      ],
    },
    { title: 'Present Simple', description: 'Learn the present simple tense', module: 'grammar', order: 2, levelId: beginnerLevel.id,
      exercises: [
        { type: 'multiple-choice', question: 'He ___ coffee every morning.', options: JSON.stringify(['drink', 'drinks', 'drinking', 'drank']), correctAnswer: 'drinks', order: 1 },
        { type: 'fill-blank', question: 'They ___ (work) in an office.', correctAnswer: 'work', order: 2 },
        { type: 'multiple-choice', question: 'She ___ (not like) spicy food.', options: JSON.stringify(['don\'t like', 'doesn\'t like', 'not like', 'no like']), correctAnswer: 'doesn\'t like', order: 3 },
        { type: 'fill-blank', question: '___ you speak English?', correctAnswer: 'Do', order: 4 },
        { type: 'fill-blank', question: 'The sun ___ (rise) in the east.', correctAnswer: 'rises', order: 5 },
      ],
    },
    { title: 'Past Simple', description: 'Learn the past simple tense', module: 'grammar', order: 3, levelId: elementaryLevel.id,
      exercises: [
        { type: 'multiple-choice', question: 'She ___ (go) to London last year.', options: JSON.stringify(['go', 'goes', 'went', 'gone']), correctAnswer: 'went', order: 1 },
        { type: 'fill-blank', question: 'I ___ (watch) a movie yesterday.', correctAnswer: 'watched', order: 2 },
        { type: 'multiple-choice', question: 'They ___ (not/come) to the party.', options: JSON.stringify(['didn\'t come', 'not came', 'didn\'t came', 'not come']), correctAnswer: 'didn\'t come', order: 3 },
        { type: 'fill-blank', question: '___ you see the game last night?', correctAnswer: 'Did', order: 4 },
        { type: 'fill-blank', question: 'He ___ (buy) a new car.', correctAnswer: 'bought', order: 5 },
      ],
    },
  ];

  for (const lesson of grammarLessons) {
    const { exercises, ...lessonData } = lesson;
    const created = await prisma.lesson.create({ data: lessonData });
    for (const ex of exercises) {
      await prisma.exercise.create({ data: { ...ex, lessonId: created.id } });
    }
  }

  // Vocabulary Lessons
  const vocabularyLessons = [
    { title: 'Work & Office', description: 'Essential vocabulary for the workplace', module: 'vocabulary', order: 1, levelId: beginnerLevel.id,
      exercises: [
        { type: 'multiple-choice', question: 'What does "colleague" mean?', options: JSON.stringify(['Friend', 'Co-worker', 'Boss', 'Client']), correctAnswer: 'Co-worker', order: 1 },
        { type: 'multiple-choice', question: 'A ___ is a person who manages a team.', options: JSON.stringify(['manager', 'employee', 'intern', 'receptionist']), correctAnswer: 'manager', order: 2 },
        { type: 'fill-blank', question: 'I have a ___ (meeting) at 3 PM.', correctAnswer: 'meeting', order: 3 },
        { type: 'fill-blank', question: 'She works as a software ___ (developer).', correctAnswer: 'developer', order: 4 },
        { type: 'multiple-choice', question: 'The opposite of "hire" is:',
          options: JSON.stringify(['employ', 'fire', 'recruit', 'interview']), correctAnswer: 'fire', order: 5 },
      ],
    },
    { title: 'Travel', description: 'Essential vocabulary for traveling', module: 'vocabulary', order: 2, levelId: beginnerLevel.id,
      exercises: [
        { type: 'multiple-choice', question: 'Where do you catch a flight?', options: JSON.stringify(['Bus station', 'Airport', 'Train station', 'Harbor']), correctAnswer: 'Airport', order: 1 },
        { type: 'fill-blank', question: 'I need to ___ (book) a hotel room.', correctAnswer: 'book', order: 2 },
        { type: 'multiple-choice', question: 'A ___ is a document you need to travel abroad.',
          options: JSON.stringify(['visa', 'ticket', 'passport', 'ID']), correctAnswer: 'passport', order: 3 },
        { type: 'fill-blank', question: 'The ___ (luggage) is too heavy.', correctAnswer: 'luggage', order: 4 },
        { type: 'fill-blank', question: 'We have a ___ (layover) of 3 hours.', correctAnswer: 'layover', order: 5 },
      ],
    },
  ];

  for (const lesson of vocabularyLessons) {
    const { exercises, ...lessonData } = lesson;
    const created = await prisma.lesson.create({ data: lessonData });
    for (const ex of exercises) {
      await prisma.exercise.create({ data: { ...ex, lessonId: created.id } });
    }
  }

  // Technology Vocabulary
  const techLesson = await prisma.lesson.create({
    data: { title: 'Technology', description: 'Tech vocabulary for developers', module: 'vocabulary', order: 3, levelId: elementaryLevel.id },
  });

  const techExercises = [
    { type: 'multiple-choice', question: 'What is a "repository"?', options: JSON.stringify(['A place to store code', 'A type of computer', 'A programming language', 'A bug']), correctAnswer: 'A place to store code', order: 1 },
    { type: 'multiple-choice', question: 'What does "deploy" mean?', options: JSON.stringify(['To delete code', 'To release an app', 'To write tests', 'To fix bugs']), correctAnswer: 'To release an app', order: 2 },
    { type: 'fill-blank', question: 'A ___ (bug) is an error in the code.', correctAnswer: 'bug', order: 3 },
    { type: 'fill-blank', question: 'We use Git for ___ (version) control.', correctAnswer: 'version', order: 4 },
    { type: 'multiple-choice', question: 'What is a "framework"?', options: JSON.stringify(['A tool for design', 'A structure for building apps', 'A database', 'A server']), correctAnswer: 'A structure for building apps', order: 5 },
  ];

  for (const ex of techExercises) {
    await prisma.exercise.create({ data: { ...ex, lessonId: techLesson.id } });
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
