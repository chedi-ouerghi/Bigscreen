import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const generateRandomText = (length = 6) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join("");
};

interface CaptchaProps {
  onSuccess: () => void;
}

const Captcha: React.FC<CaptchaProps> = ({ onSuccess }) => {
  const [mathAnswer, setMathAnswer] = useState("");
  const [captchaText, setCaptchaText] = useState(""); // texte du canvas à comparer
  const [userInput, setUserInput] = useState("");
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState<number>(() => {
    const saved = localStorage.getItem("captcha_attempts");
    return saved ? parseInt(saved) : 0;
  });
  const [blockedUntil, setBlockedUntil] = useState<number>(() => {
    const saved = localStorage.getItem("captcha_blocked_until");
    return saved ? parseInt(saved) : 0;
  });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Génération du captcha et mise à jour de captchaText
  const generateCaptcha = () => {
    const text = generateRandomText();
    setCaptchaText(text); // ⚠ Important pour la comparaison
    setUserInput(""); // vider le champ à chaque nouveau captcha

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Fond avec gradient
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, "#d0e8ff");
        gradient.addColorStop(1, "#a0c4ff");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Texte
        ctx.font = "bold 30px 'Segoe UI', sans-serif";
        ctx.fillStyle = "#000";
        ctx.textBaseline = "middle";
        ctx.fillText(text, 20 + Math.random() * 10, 40 + Math.random() * 5);

        // Bruit graphique
        for (let i = 0; i < 8; i++) {
          ctx.beginPath();
          ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
          ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
          ctx.strokeStyle = `rgba(0,0,0,${0.1 + Math.random() * 0.3})`;
          ctx.stroke();
        }
      }
    }
  };

  useEffect(() => {
    // Si déjà vérifié
    const verified = localStorage.getItem("captcha_verified");
    if (verified === "true") {
      onSuccess();
    } else {
      generateCaptcha();
    }
  }, []);

  const handleVerify = () => {
    const now = Date.now();
    if (blockedUntil && now < blockedUntil) {
      setError("⏳ Trop d'échecs. Réessayez dans 10 minutes.");
      return;
    }

    // Vérification math
    if (mathAnswer.trim() !== "2") {
      setError("❌ Mauvaise réponse au calcul !");
      incrementAttempts();
      return;
    }

    // Vérification texte Canvas
    if (userInput.trim() !== captchaText) {
      setError("❌ Texte incorrect ! Faites attention aux majuscules/minuscules.");
      incrementAttempts();
      return;
    }

    // Succès
    setError("");
    localStorage.setItem("captcha_verified", "true");
    onSuccess();
  };

  const incrementAttempts = () => {
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    localStorage.setItem("captcha_attempts", newAttempts.toString());

    if (newAttempts >= 4) {
      const blockTime = Date.now() + 10 * 60 * 1000; // 10 minutes
      setBlockedUntil(blockTime);
      localStorage.setItem("captcha_blocked_until", blockTime.toString());
      setError("⏳ Trop d'échecs. Réessayez dans 10 minutes.");
    } else {
      setError(`❌ Échec ${newAttempts}/4. Attention !`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl max-w-md mx-auto space-y-6 border border-white/30"
    >
      <h2 className="text-2xl font-bold text-center text-blue-700">
        🔒 Vérification Captcha
      </h2>

      {/* Canvas Verification */}
      <div className="space-y-2">
        <label className="font-semibold text-gray-700">
          2️⃣ Recopiez le texte ci-dessous
        </label>
        <canvas
          ref={canvasRef}
          width={220}
          height={80}
          className="w-full rounded-xl shadow-inner border border-gray-200"
        />
        <motion.input
          whileFocus={{ scale: 1.02, boxShadow: "0 0 8px rgba(59, 130, 246, 0.5)" }}
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Saisir le texte affiché"
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <motion.button
          onClick={generateCaptcha}
          whileHover={{ scale: 1.05 }}
          className="mt-2 px-5 py-2 bg-gray-100 rounded-xl hover:bg-gray-200 text-gray-700 font-semibold transition"
        >
          🔄 Recharger
        </motion.button>
      </div>

      {error && (
        <p className="text-red-500 font-medium text-sm text-center">{error}</p>
      )}

      <motion.button
        onClick={handleVerify}
        whileHover={{ scale: 1.03 }}
        className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition"
      >
        Vérifier
      </motion.button>
    </motion.div>
  );
};

export default Captcha;
