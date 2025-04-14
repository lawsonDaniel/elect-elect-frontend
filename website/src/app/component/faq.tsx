'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react'; // Optional: use lucide icons for +/-

const faqs = [
  {
    question: 'How do I create an account on the website?',
    answer: 'The ability to create an account on the web application is reserved for only students and staff of the depatment.',
  },
  {
    question: "I forgot my password. How can I reset it?",
    answer:
      "Click on the 'Forgot Password?' link on the login page. Enter your registered email address, and a password reset link will be sent to you. Follow the instructions to set a new password.",
  },
  {
    question: "Can I use this platform to chat with my lecturers or classmates?",
    answer:
      "Currently, this platform is focused on dues payment, providing academic resources for students and administrative updates.",
  },
  {
    question: "How do I make payments for departmental dues?",
    answer:
      "Simply click the 'Pay Dues' button and you will be directed to a secure Paystack checkout. You can pay using your card, bank transfer, USSD, or QR code. Once the payment is successful, you'll receive a receipt automatically.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="px-[4.27%] md:px-[7.78%] py-12 bg-greyText text-black">
      <h2 className="text-center text-xl md:text-2xl font-semibold mb-8">
        Got questions? We&apos;ve got answers.
      </h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={index} className="border border-gray-600 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleFAQ(index)}
                className="flex items-center w-full p-5 text-left gap-4"
              >
                <span className="shrink-0">
                  {isOpen ? (
                    <Minus className="w-4 h-4" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                </span>
                <span className="text-sm md:text-base">{faq.question}</span>
              </button>
              <div
                className={`transition-all duration-500 ease-in-out px-5 overflow-hidden text-sm text-black ${
                  isOpen ? 'max-h-[200px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="pb-5 text-[#6B7280]">{faq.answer}</div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
