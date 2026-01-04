"use client";

import { useEffect, useState } from "react";
import { Monitor, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function MobileWarning() {
  const [isMobile, setIsMobile] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!isMobile || isDismissed) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <Card className="max-w-md bg-card/95 backdrop-blur-xl border-cyan-500/30 p-6">
        <div className="flex justify-end mb-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsDismissed(true)}
            className="h-8 w-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-cyan-500/20 border-2 border-cyan-500/50 flex items-center justify-center">
            <Monitor className="w-8 h-8 text-cyan-400" />
          </div>
          
          <h3 className="text-xl font-display font-semibold mb-2">
            Desktop Experience Recommended
          </h3>
          
          <p className="text-muted-foreground mb-6 leading-relaxed">
            This platform is optimized for desktop screens. For the best terminal 
            experience and full workspace functionality, please access from a desktop 
            or laptop device.
          </p>
          
          <Button
            onClick={() => setIsDismissed(true)}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
          >
            Continue Anyway
          </Button>
        </div>
      </Card>
    </div>
  );
}
