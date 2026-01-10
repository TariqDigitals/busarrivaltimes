import { Shield, Sparkles, Users, Gauge } from 'lucide-react';

export function WhyDifferentSection() {
  const differences = [
    {
      icon: Gauge,
      title: 'Fastest Updates',
      description: 'We refresh arrival data every 30 seconds automatically, ensuring you always have the most accurate information without lifting a finger.',
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your data stays on your device. We never track your location or personal information. Complete transparency, zero compromises.',
    },
    {
      icon: Sparkles,
      title: 'Clean & Simple',
      description: 'No clutter, no ads, no distractions. Just a beautiful, intuitive interface designed for one thing: getting you on the right bus, fast.',
    },
    {
      icon: Users,
      title: 'Built for Singapore',
      description: 'Made specifically for Singapore commuters by understanding local needs. Optimized for LTA data with features that matter to you.',
    },
  ];

  return (
    <section className="mt-12 pt-12 border-t border-gray-200 dark:border-gray-700">
      <div className="text-center space-y-4 px-4 mb-10">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Why We're Different
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
          Not just another bus app. We've built something truly better for Singapore commuters.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
        {differences.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="group relative bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:border-teal-200 dark:hover:border-cyan-700 transition-all duration-300"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-teal-500/5 to-cyan-500/5 dark:from-teal-400/10 dark:to-cyan-400/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500" />

              <div className="relative space-y-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 dark:from-teal-600 dark:to-cyan-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-6 h-6 text-white" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
