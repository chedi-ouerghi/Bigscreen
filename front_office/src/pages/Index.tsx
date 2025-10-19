// pages/Index.tsx
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, BarChart3, Sparkles } from "lucide-react";
import { useLoader } from "@/components/loaderCore";

export default function Index() {
  const navigate = useNavigate();
  const { startLoadingAndNavigate } = useLoader();

  const handleNavigation = (path: string) => {
    startLoadingAndNavigate(path, navigate);
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-[#E0F7FA] via-[#F3E8FF] to-[#E8F9FF] flex flex-col">
      {/* Effets d'arrière-plan */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], rotate: [0, 5, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#00BCD4]/30 to-[#7C3AED]/30 blur-3xl"
      />
      <motion.div
        animate={{ scale: [1.1, 1, 1.1], rotate: [5, 0, 5] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-gradient-to-bl from-[#42A5F5]/30 to-[#E91E63]/30 blur-3xl"
      />

      {/* Header minimal */}
      <header className="z-50 w-full flex justify-between items-center px-10 py-6 backdrop-blur-lg bg-white/30 border-b border-white/20">
        <img
          src="images/bigscreen_logo.svg"
          alt="Logo BigScreen"
          className="h-10 w-auto object-contain brightness-0"
          onClick={() => handleNavigation("/")}
        />

        <Button
          onClick={() => handleNavigation("/survey")}
          className="px-5 py-2 bg-gradient-to-r from-[#00BCD4] to-[#7C3AED] text-white rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-transform"
        >
          Commencer
        </Button>
      </header>

      {/* Section principale sans scroll */}
      <main className="flex-1 flex items-center justify-center relative px-8 md:px-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl w-full">
          {/* Texte gauche */}
          <div className="space-y-6">
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight"
            >
              <span className="bg-gradient-to-r from-[#00BCD4] to-[#7C3AED] bg-clip-text text-transparent">
                Donnez votre avis,
              </span>
              <br />
              changez le futur.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-lg text-gray-700 max-w-md"
            >
              Un seul clic pour partager vos idées. Répondez à nos sondages rapides et contribuez à
              créer les innovations de demain. Vos réponses comptent.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex gap-4 mt-8"
            >
              <Button
                onClick={() => handleNavigation("/survey")}
                className="px-8 py-3 text-lg bg-gradient-to-r from-[#00BCD4] to-[#7C3AED] text-white rounded-full shadow-xl hover:scale-105 transition-transform"
              >
                Démarrer le sondage
              </Button>
              <Button
                variant="outline"
                onClick={() => handleNavigation("/learn-more")}
                className="px-8 py-3 text-lg border-gray-300 text-gray-700 hover:bg-gray-50 rounded-full"
              >
                En savoir plus
              </Button>
            </motion.div>

            <div className="flex flex-wrap gap-6 pt-8 text-gray-600">
              <div className="flex items-center gap-2">
                <Users className="text-[#00BCD4]" />
                <span>+10 000 participants</span>
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 className="text-[#7C3AED]" />
                <span>Résultats en direct</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="text-[#E91E63]" />
                <span>Interface interactive</span>
              </div>
            </div>
          </div>

          {/* Carte animée droite */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="relative flex justify-center"
          >
            <div className="relative w-[520px] h-[360px] rounded-3xl overflow-hidden shadow-2xl bg-white/40 border border-white/30 backdrop-blur-lg">
              <img
                src="images/event.jpg"
                alt="Interface BigScreen"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Carte flottante progression */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-10 -left-10 bg-white/90 backdrop-blur-md border border-white/30 shadow-xl rounded-2xl p-4 w-52"
            >
              <p className="font-semibold text-gray-800 mb-1">Progression</p>
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "40%" }}
                  transition={{ duration: 1.5 }}
                  className="h-full bg-gradient-to-r from-[#00BCD4] to-[#7C3AED]"
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">8 / 20 réponses</p>
            </motion.div>

            {/* Carte flottante email */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md border border-white/30 shadow-xl rounded-2xl p-4 w-64"
            >
              <p className="font-semibold text-gray-800 mb-1">Confirmation envoyée ✅</p>
              <p className="text-sm text-gray-600">
                Vos réponses ont été enregistrées avec succès.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
