import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Instructor creates quiz with questions
export const createQuizWithQuestions = async (req, res) => {
  try {
    const { lessonId, title, questions } = req.body;
    const instructorId = req.user.id;

    const quiz = await prisma.quiz.create({
      data: {
        title,
        lessonId,
        instructorId,
        totalMarks: questions.reduce((sum, q) => sum + (q.marks || 0), 0),
        questions: {
          create: questions.map((q) => ({
            text: q.text,
            type: q.type || "MCQ",
            options: q.options ? JSON.stringify(q.options) : null,
            correct: q.correct ? JSON.stringify(q.correct) : null,
            marks: q.marks || 1,
          })),
        },
      },
      include: { questions: true },
    });

    res.status(201).json(quiz);
  } catch (error) {
    console.error("Error creating quiz:", error);
    res.status(500).json({ error: "Failed to create quiz" });
  }
};

// Get quiz by ID with questions
export const getQuizById = async (req, res) => {
  try {
    const { id } = req.params;
    const quiz = await prisma.quiz.findUnique({
      where: { id: Number(id) },
      include: { questions: true },
    });

    if (!quiz) return res.status(404).json({ error: "Quiz not found" });

    res.json(quiz);
  } catch (error) {
    console.error("Error fetching quiz:", error);
    res.status(500).json({ error: "Failed to fetch quiz" });
  }
};

export const getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await prisma.quiz.findMany({
      include: { questions: true },
    });
    res.json(quizzes);
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    res.status(500).json({ error: "Failed to fetch quizzes" });
  }
}

// Submit quiz answers
export const submitQuiz = async (req, res) => {
  try {
    // Accept quizId from URL param, ensure it's a number
    const quizIdRaw = req.params.id;
    const quizId = Number(quizIdRaw);
    if (isNaN(quizId)) {
      return res.status(400).json({ error: "Invalid quiz ID" });
    }

    const { answers } = req.body; //
    if (!answers || typeof answers !== "object") {
      return res.status(400).json({ error: "Answers are required" });
    }
    const userId = req.user.id;

    // Fetch quiz and its questions
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: { questions: true },
    });
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    // Convert answer keys to numbers for correct matching
    const numericAnswers = {};
    for (const key in answers) {
      // Only convert if a key is a string representation of a number
      const numKey = Number(key);
      if (!isNaN(numKey)) {
        numericAnswers[numKey] = answers[key];
      }
    }

    // Helper function for normalization
    function normalizeString(str) {
      return String(str).trim().toLowerCase();
    }

    // Calculate the score with debug logs
    let score = 0;
    for (const q of quiz.questions) {
      const userAnswer = numericAnswers[q.id];
      if (userAnswer == null) {
        console.log(`[QUIZ SUBMIT] Skipping unanswered question id=${q.id}`);
        continue; // skip unanswered
      }

      let correctAnswer;
      try {
        correctAnswer = q.correct ? JSON.parse(q.correct) : null;
      } catch (err) {
        console.log(`[QUIZ SUBMIT] Failed to parse correct answer for question id=${q.id}:`, err, "Raw value:", q.correct);
        correctAnswer = q.correct;
      }

      // For MCQ and TRUE_FALSE, correct is usually a string; for others may be array
      // If correctAnswer is arrayed, check inclusion; else compare as string
      if (Array.isArray(correctAnswer)) {
        // Accept both string and array from a user
        let userAnsArr = userAnswer;
        if (!Array.isArray(userAnsArr)) {
          try {
            // Try to parse if given as a stringifies array
            userAnsArr = JSON.parse(userAnswer);
          } catch {
            userAnsArr = [userAnswer];
          }
        }
        // Normalize all values to string for comparison
        const correctSet = new Set(correctAnswer.map(normalizeString));
        const userSet = new Set(userAnsArr.map(normalizeString));
        const setsEqual = (
          correctSet.size === userSet.size &&
          [...correctSet].every(a => userSet.has(a))
        );
        if (setsEqual) {
          score += q.marks;
          console.log(`[QUIZ SUBMIT] Question id=${q.id}: correct! +${q.marks} marks`);
        } else {
          console.log(`[QUIZ SUBMIT] Question id=${q.id}: incorrect (multi-answer). User:`, userSet, "Correct:", correctSet);
        }
      } else {
        // Compare as string, case-insensitive, trimmed
        const userNorm = normalizeString(userAnswer);
        const correctNorm = normalizeString(correctAnswer);
        if (userNorm === correctNorm) {
          score += q.marks;
          console.log(`[QUIZ SUBMIT] Question id=${q.id}: correct! +${q.marks} marks`);
        } else {
          console.log(`[QUIZ SUBMIT] Question id=${q.id}: incorrect. User: "${userNorm}", Correct: "${correctNorm}"`);
        }
      }
    }

    // Save submission
    const submission = await prisma.quizSubmission.create({
      data: {
        quizId,
        userId,
        answers: JSON.stringify(answers),
        marksObtained: score,
      },
    });

    res.status(201).json({ score, submission });
  } catch (error) {
    console.error("Error submitting quiz:", error);
    res.status(500).json({ error: "Failed to submit quiz" });
  }
};

// Delete quiz
export const deleteQuiz = async (req, res) => {
    try {
        const quizId = Number(req.params.id);
        if (isNaN(quizId)) return res.status(400).json({ error: "Invalid quiz ID" });

        // Delete all submissions related to the quiz
        await prisma.quizSubmission.deleteMany({
            where: { quizId },
        });

        // Delete all questions related to the quiz
        await prisma.question.deleteMany({
            where: { quizId },
        });

        // Finally, delete the quiz
        await prisma.quiz.delete({
            where: { id: quizId },
        });

        res.status(200).json({ message: "Quiz deleted successfully" });
    } catch (error) {
        console.error("Error deleting quiz:", error);
        res.status(500).json({ error: "Failed to delete quiz" });
    }
};

export const getQuizSubmissions = async (req, res) => {
    try {
        const quizId = Number(req.params.id);
        if (isNaN(quizId)) return res.status(400).json({ error: "Invalid quiz ID" });
        const submissions = await prisma.quizSubmission.findMany({
            where: { quizId },
            include: {
                user:{
                    select:{
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                        avatarUrl: true,
                        createdAt: true,
                        updatedAt: true,
                    }
                }

            }
        });
        res.json(submissions);
    } catch (error) {
        console.error("Error fetching quiz submissions:", error);
        res.status(500).json({ error: "Failed to fetch quiz submissions" });
    }
}

export const updateQuiz = async (req, res) => {
    try {
        const quizId = Number(req.params.id);
        if (isNaN(quizId)) return res.status(400).json({ error: "Invalid quiz ID" });

        const { title, questions } = req.body;
        if (!questions || !Array.isArray(questions)) {
            return res.status(400).json({ error: "Questions must be an array" });
        }

        // Update quiz title first
        const updatedQuiz = await prisma.quiz.update({
            where: { id: quizId },
            data: { title },
            include: { questions: true },
        });

        // Existing and incoming question IDs
        const existingIds = updatedQuiz.questions.map(q => q.id);
        const incomingIds = questions.filter(q => q.id).map(q => Number(q.id));

        // Delete removed questions
        const toDelete = existingIds.filter(id => !incomingIds.includes(id));
        if (toDelete.length > 0) {
            await prisma.question.deleteMany({ where: { id: { in: toDelete } } });
        }

        // Update existing or create new questions
        await Promise.all(
            questions.map(async (q) => {
                try {
                    if (q.id) {
                        const id = Number(q.id);
                        if (isNaN(id)) throw new Error(`Invalid question ID: ${q.id}`);

                        await prisma.question.update({
                            where: { id },
                            data: {
                                text: q.text,
                                type: q.type || "MCQ",
                                options: q.options ? JSON.stringify(q.options) : null,
                                correct: q.correct ? JSON.stringify(q.correct) : null,
                                marks: q.marks || 1,
                            },
                        });
                    } else {
                        await prisma.question.create({
                            data: {
                                quizId,
                                text: q.text,
                                type: q.type || "MCQ",
                                options: q.options ? JSON.stringify(q.options) : null,
                                correct: q.correct ? JSON.stringify(q.correct) : null,
                                marks: q.marks || 1,
                            },
                        });
                    }
                } catch (err) {
                    console.error(`Failed to update/create question: ${q.id || "new"}`, err);
                }
            })
        );

        // Recalculate totalMarks
        const allQuestions = await prisma.question.findMany({ where: { quizId } });
        const totalMarks = allQuestions.reduce((sum, q) => sum + (q.marks || 0), 0);

        // Update quiz with new totalMarks
        const finalQuiz = await prisma.quiz.update({
            where: { id: quizId },
            data: { totalMarks },
            include: { questions: true },
        });

        res.json(finalQuiz);
    } catch (error) {
        console.error("Error updating quiz:", error);
        res.status(500).json({ error: "Failed to update quiz" });
    }
};