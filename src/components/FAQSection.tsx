import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      question: 'How accurate are the bus arrival times?',
      answer: 'Our data comes directly from LTA DataMall, which provides real-time information from bus tracking systems. The times are typically accurate within 1-2 minutes and update every 30 seconds automatically.',
    },
    {
      question: 'Do I need to create an account?',
      answer: 'No account needed! All your favorites and search history are stored locally on your device. This means your data stays private and the app works instantly without any login.',
    },
    {
      question: 'Does this work offline?',
      answer: 'Partially. While you need internet to get live arrival times, you can still access your favorite stops list and recently viewed stops. The app caches data intelligently for a better experience.',
    },
    {
      question: 'Why are some buses showing "No data"?',
      answer: 'This happens when buses are not currently operating (outside service hours) or when there are temporary service disruptions. The LTA system provides this status in real-time.',
    },
    {
      question: 'Can I use this on my phone and computer?',
      answer: 'Yes! This is a progressive web app that works perfectly on phones, tablets, and computers. On mobile, you can even add it to your home screen for a native app experience.',
    },
    {
      question: 'Is my location data tracked?',
      answer: 'Absolutely not. When you use the "Find Nearby" feature, location data is processed entirely on your device and never sent to our servers. We respect your privacy completely.',
    },
    {
      question: 'What does "wheelchair accessible" mean?',
      answer: 'This indicates that the bus arriving is equipped with wheelchair ramps and designated spaces. This information comes from the bus fleet data and helps passengers with mobility needs.',
    },
    {
      question: 'How can I report an issue or suggest a feature?',
      answer: 'We\'d love to hear from you! You can reach us through the Contact page. We actively read all feedback and regularly update the app based on user suggestions.',
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="mt-12 pt-12 border-t border-gray-200 dark:border-gray-700">
      <div className="text-center space-y-4 px-4 mb-10">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Frequently Asked Questions
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
          Everything you need to know about using our bus arrival tracker
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-4 space-y-3">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-200 hover:shadow-md"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full px-6 py-4 flex items-center justify-between text-left gap-4 group"
            >
              <span className="font-semibold text-gray-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-cyan-400 transition-colors">
                {faq.question}
              </span>
              <ChevronDown
                className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform duration-300 flex-shrink-0 ${
                  openIndex === index ? 'rotate-180' : ''
                }`}
              />
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ${
                openIndex === index ? 'max-h-96' : 'max-h-0'
              }`}
            >
              <div className="px-6 pb-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                {faq.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
