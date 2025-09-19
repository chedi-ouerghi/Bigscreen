// pages/Index.tsx
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";
import type { RepeatType } from "framer-motion";
import { Airplay, Chrome, Smartphone, Coffee, Archive } from "lucide-react";
import { useEffect } from "react";
import { useLoader } from "@/components/loaderCore";

const floatY = {
  animate: { y: [0, -8, 0] },
  transition: { duration: 4, repeat: Infinity as unknown as number, repeatType: "loop" as RepeatType }
};

export default function Index() {
  const navigate = useNavigate();
  const { startLoadingAndNavigate } = useLoader();
  const controls = useAnimation();

  const handleNavigation = (path: string) => {
    startLoadingAndNavigate(path, navigate);
  };

  useEffect(() => {
    controls.start({
      x: ["0%", "-100%"],
      transition: {
        x: {
          repeat: Infinity as unknown as number,
          repeatType: "loop" as RepeatType,
          duration: 15,
        },
      },
    });
  }, [controls]);

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-b from-[#f5fbff] via-[#eaf6ff] to-[#eef3ff] relative">
      {/* decorative accents */}
      <div className="absolute -z-10 inset-0 pointer-events-none">
        <div className="absolute -left-24 -top-24 w-96 h-96 rounded-full bg-gradient-to-tr from-[#e0f7ff] to-transparent opacity-60 blur-3xl"></div>
        <div className="absolute right-0 bottom-0 w-[420px] h-[420px] rounded-full bg-gradient-to-br from-[#f0e8ff] to-transparent opacity-60 blur-3xl"></div>
      </div>
       
      <header className="sticky top-0 z-50 w-full bg-white/30 backdrop-blur-lg shadow-lg border-b border-white/10">
        <div className="container mx-auto flex h-16 items-center justify-between px-6 md:px-12">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-[#1e90ff] to-[#6b4cf0] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">BS</span>
            </div>
            <span className="font-bold text-slate-800">BigScreen</span>
          </div>
          
          <Button
            className="shadow-md px-4 py-2 bg-gradient-to-r from-[#1e90ff] to-[#6b4cf0] hover:from-[#1b7fe6] hover:to-[#5a3be0] text-white rounded-full transition-all hover:shadow-xl"
            onClick={() => handleNavigation('/survey')}
          >
            Get Started
          </Button>
        </div>
      </header>
       
      <section className="relative container mx-auto px-6 md:px-12 py-16 md:py-24">       
        <div className="absolute top-0 left-0 w-full h-72 bg-gradient-to-b from-[#06b6d4]/6 to-transparent -z-10"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#7c3aed]/6 rounded-full blur-3xl -z-10"></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">         
          <div className="max-w-2xl">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-[#0f1720]"
            >
              Votre enquête 
              BigScreen simplifiée
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-6 text-lg md:text-xl text-slate-600 max-w-xl font-medium"
            >
              Répondez à 20 questions rapides, soumettez vos réponses et recevez instantanément 
              un e-mail de confirmation avec vos résultats approuvés.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <Button
                size="lg"
                className="shadow-lg px-6 py-3 bg-gradient-to-r from-[#1e90ff] to-[#6b4cf0] hover:from-[#1b7fe6] hover:to-[#5a3be0] text-white rounded-full transition-shadow hover:shadow-2xl"
                onClick={() => handleNavigation('/survey')}
              >
                Commencer l'enquête
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-6 py-3 border-gray-300 text-[#334155] hover:bg-gray-50 rounded-full"
                onClick={() => handleNavigation('/learn-more')}
              >
                En savoir plus
              </Button>
            </motion.div>

            <div className="mt-10 overflow-hidden">
              {/* carousel items list (icon + title) */}
              {(() => {
                const items = [
                  { icon: Airplay, title: "AirPlay Partner" },
                  { icon: Archive, title: "Archive Co." },
                  { icon: Chrome, title: "Chrome Labs" },
                  { icon: Smartphone, title: "Mobile Partner" },
                  { icon: Coffee, title: "Coffee Sponsor" },
                ];

                // duplicate for seamless loop
                const loopItems = [...items, ...items];

                return (
                  <motion.div
                    initial={{ x: "0%" }}
                    animate={controls}
                    className="flex items-center gap-8 text-[#475569] whitespace-nowrap py-2"
                  >
                    {loopItems.map((it, idx) => {
                      const Icon = it.icon;
                      const isDuplicate = idx >= items.length;
                      return (
                        <div
                          key={idx}
                          className="flex flex-col items-center justify-center min-w-[92px] text-center"
                          aria-hidden={isDuplicate}
                        >
                          <div className="p-3 bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 flex items-center justify-center">
                            <Icon className="w-7 h-7 text-[#475569]" />
                          </div>
                          <div className="mt-2 text-xs font-semibold text-slate-600">
                            {it.title}
                          </div>
                        </div>
                      );
                    })}
                  </motion.div>
                );
              })()}
            </div>
          </div>

          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[620px] h-[420px] lg:h-[480px]">
              <div className="absolute inset-0 bg-gradient-to-br from-[#06b6d4]/12 to-[#7c3aed]/12 rounded-3xl transform rotate-1"></div>
              <div className="absolute inset-0 bg-white/40 rounded-3xl border border-white/20 backdrop-blur-sm"></div>
              
              <div className="relative z-10 w-full h-full overflow-hidden rounded-3xl shadow-2xl border-2 border-white/20 bg-gradient-to-br from-blue-50 to-purple-50">
  <img
    src="images/event.jpg"
    alt="BigScreen Survey Interface"
    className="w-full h-full object-cover"
  />
</div>


              <motion.div
                {...floatY}
                className="absolute z-20 top-8 -left-4 w-56 rounded-xl p-4 shadow-2xl border border-white/40 bg-white/95 backdrop-blur-md"
              >
                <div className="text-sm font-medium text-[#1f2937] mb-2">Progress</div>
                <ul className="text-sm text-[#374151] space-y-2">
                  <li className="flex items-center gap-3">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-sm bg-[#e6f4ea] text-[#059669] text-xs">✓</span>
                    5 / 20 answered
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-sm bg-[#eef2ff] text-[#4f46e5] text-xs">●</span>
                    Next: Question 6
                  </li>
                </ul>
              </motion.div>

              <motion.div
                {...{ animate: { y: [0, 6, 0] }, transition: { duration: 5, repeat: Infinity, ease: "easeInOut" } }}
                className="absolute z-20 right-6 bottom-6 w-64 rounded-xl p-5 shadow-2xl border border-white/40 bg-white/95 backdrop-blur-md"
              >
                <div className="text-sm font-medium text-[#1f2937] mb-2">Email confirmation</div>
                <div className="text-sm text-[#374151]">
                  <div className="font-semibold mb-1">Status: <span className="text-green-600">Approved</span></div>
                  <div className="text-xs text-gray-500 mt-2">Sent to: Your_email@email.com</div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}