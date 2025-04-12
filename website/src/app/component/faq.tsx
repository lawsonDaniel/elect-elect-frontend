'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react'; // Optional: use lucide icons for +/-

const faqs = [
  {
    question: 'How do I create an account on the website?',
    answer: 'We offer a wide range of engineering and technology programs at undergraduate and postgraduate levels.',
  },
  {
    question: 'I forgot my password. How can I reset it?',
    answer: 'You can apply via our university portal by creating an account and filling out the admission form online.',
  },
  {
    question: 'Can I use this platform to chat with my lecturers or classmates?',
    answer: 'We are located inside the University of Jos permanent site campus, Faculty of Engineering.',
  },
  {
    question: 'How do I make payments for departmental dues?',
    answer: 'Use the contact form or visit the map section above for location and phone numbers.',
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="px-[4.27%] md:px-[7.78%] py-12 bg-greyText text-black">
      <h2 className="text-center text-xl md:text-2xl font-semibold mb-8 text-black">
        Got questions? We've got answers.
      </h2>
      <div className="space-y-4">
      {faqs.map((faq, index) => (
  <div
    key={index}
    className="border border-gray-600 rounded-lg overflow-hidden transition-all duration-300"
  >
    <button
      className="flex items-center w-full p-5 text-left gap-4"
      onClick={() => toggleFAQ(index)}
    >
      <span className="shrink-0">
        {openIndex === index ? (
          <Minus color='black' className="w-4 h-4" />
        ) : (
          <Plus color='black' className="w-4 h-4" />
        )}
      </span>
      <span className="text-sm md:text-base">{faq.question}</span>
    </button>
    {openIndex === index && (
      <div className="px-5 pb-5 text-sm text-black">
        {faq.answer}
      </div>
    )}
  </div>
))}
      </div>
    </section>
  );
}
