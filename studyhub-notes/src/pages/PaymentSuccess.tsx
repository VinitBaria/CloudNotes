import { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");
  const noteId = searchParams.get("note_id");
  const navigate = useNavigate();

  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");

  useEffect(() => {
    if (!orderId) {
      setStatus("error");
      return;
    }

    const verifyPayment = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/payment/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order_id: orderId, noteId }),
          credentials: 'include'
        });

        if (res.ok) {
          setStatus("success");
          // Add a small delay then reload or navigate to the note
          setTimeout(() => {
            if (noteId) {
              window.location.href = `/note/${noteId}`;
            } else {
              navigate("/explore");
            }
          }, 3000);
        } else {
          setStatus("error");
        }
      } catch (err) {
        console.error("Verification error:", err);
        setStatus("error");
      }
    };

    verifyPayment();
  }, [orderId, noteId, navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-card border border-border rounded-2xl p-8 text-center shadow-lg"
      >
        {status === "verifying" && (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <h1 className="font-heading text-xl font-bold text-foreground">Verifying Payment...</h1>
            <p className="text-sm text-muted-foreground">Please wait while we confirm your transaction securely.</p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center gap-4">
            <CheckCircle className="w-16 h-16 text-emerald-500" />
            <h1 className="font-heading text-2xl font-bold text-foreground">Payment Successful!</h1>
            <p className="text-sm text-muted-foreground">Thank you for your purchase. You now have full access to this note.</p>
            <p className="text-xs text-muted-foreground mt-2">Redirecting you to your note...</p>
            
            <Button className="mt-4 rounded-xl gap-2 w-full" asChild>
              <Link to={noteId ? `/note/${noteId}` : "/explore"}>
                View Note Now <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 font-bold text-2xl">
              !
            </div>
            <h1 className="font-heading text-2xl font-bold text-foreground">Verification Failed</h1>
            <p className="text-sm text-muted-foreground">We couldn't verify your payment right now. If your account was charged, please contact support.</p>
            
            <Button className="mt-4 rounded-xl w-full" variant="outline" asChild>
              <Link to="/explore">Return to Explore</Link>
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;
