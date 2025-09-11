import React, { useState } from 'react';

const FaqComponent = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "Can I Track My Assignments and Grades?",
      answer: "Yes, the LMS offers a 'Gradebook' where students can view their grades, monitor feedback on assignments, and check upcoming due dates. Instructors can also post grades and comments for each submission."
    },
    {
      question: "Does the LMS support video lessons and live classes?",
      answer: "Yes, the LMS supports video lessons and live classes."
    },
    {
      question: "How can I communicate with my instructor?",
      answer: "You can communicate with your instructor through the messaging system or scheduled office hours."
    },
    {
      question: "What support is available for students and instructors?",
      answer: "Support includes 24/7 chat, email assistance, and a comprehensive help center."
    },
    {
      question: "Are there interactive features for students?",
      answer: "Yes, interactive features include quizzes, forums, and collaborative projects."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">Frequently Asked Questions</h2>
      <p className="text-center text-gray-600 mb-8">Frequently Asked Questions offers quick answers to common queries, guiding users through features and functionalities effortlessly.</p>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border rounded-lg p-4 bg-white shadow-sm">
           <button
            className={`w-full text-left font-semibold flex justify-between items-center ${
              openIndex === index ? 'text-green-500' : 'text-black'
            }`}
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
          >
            {faq.question}
            <span>{openIndex === index ? '-' : '+'}</span>
          </button>

            {openIndex === index && (
                  <p className="mt-2 text-gray-700 text-left">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FaqComponent;