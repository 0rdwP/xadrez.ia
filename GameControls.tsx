import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RefreshCw, Crown, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface GameControlsProps {
  turn: "w" | "b";
  isCheck: boolean;
  isCheckmate: boolean;
  isGameOver: boolean;
  onReset: () => void;
}

export function GameControls({
  turn,
  isCheck,
  isCheckmate,
  isGameOver,
  onReset,
}: GameControlsProps) {
  return (
    <Card className="p-4 space-y-4 relative overflow-hidden">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Status do Jogo</h2>

        <div className="flex items-center gap-2">
          <motion.div 
            className="h-3 w-3 rounded-full bg-primary"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <span>
            Vez das {turn === "w" ? "Brancas" : "Pretas"}
          </span>
        </div>

        <AnimatePresence>
          {isCheck && !isCheckmate && (
            <motion.div 
              className="flex items-center gap-2 text-destructive"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <AlertCircle className="h-4 w-4" />
              <span className="font-semibold">Xeque!</span>
            </motion.div>
          )}

          {isCheckmate && (
            <motion.div 
              className="flex items-center gap-2 text-destructive"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <Crown className="h-4 w-4" />
              <span className="font-semibold">Xeque-mate!</span>
              <motion.div
                className="absolute inset-0 bg-destructive/10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          )}

          {isGameOver && !isCheckmate && (
            <motion.div 
              className="flex items-center gap-2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <Crown className="h-4 w-4" />
              <span className="font-semibold">Rei afogado - Empate!</span>
              <motion.div
                className="absolute inset-0 bg-primary/5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Button
        variant="outline"
        className="w-full relative overflow-hidden"
        onClick={onReset}
      >
        <motion.div
          className="absolute inset-0 bg-primary/10"
          initial={false}
          whileHover={{ opacity: [0, 1] }}
          transition={{ duration: 0.2 }}
        />
        <RefreshCw className="h-4 w-4 mr-2" />
        Reiniciar Jogo
      </Button>
    </Card>
  );
}