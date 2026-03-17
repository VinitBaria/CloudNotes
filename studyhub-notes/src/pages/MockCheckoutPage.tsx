import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CreditCard, ArrowLeft, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function MockCheckoutPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");
  const noteId = searchParams.get("note_id");
  const amount = searchParams.get("amount");
  const navigate = useNavigate();

  const [simulating, setSimulating] = useState(false);

  const handleSimulatePayment = () => {
    setSimulating(true);
    setTimeout(() => {
      // Upon successful test mode mock payment, we redirect to the success page as Lemon Squeezy would.
      navigate(`/payment-success?order_id=${orderId}&note_id=${noteId}`);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Button variant="ghost" size="sm" className="mb-4 text-muted-foreground hover:text-foreground" asChild>
          <Link to={`/note/${noteId}`}>
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Note
          </Link>
        </Button>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card border border-border rounded-3xl overflow-hidden shadow-2xl shadow-primary/5"
        >
          {/* Header */}
          <div className="bg-gradient-to-br from-primary via-primary/90 to-accent px-6 py-6 border-b border-border/10 text-white relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <CreditCard className="w-24 h-24 rotate-12" />
            </div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-5 h-5" />
              <span className="font-bold text-sm tracking-widest uppercase">Test Mode Checkout</span>
            </div>
            <h1 className="font-heading text-2xl font-bold mt-2">StudyHub Notes</h1>
          </div>

          <div className="p-8">
            <div className="text-center mb-8">
              <p className="text-sm text-muted-foreground uppercase tracking-widest font-semibold mb-1">Total Due</p>
              <div className="font-heading text-5xl font-extrabold text-foreground">₹{amount || "0"}</div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-between py-3 border-b border-border">
                 <span className="text-sm text-muted-foreground">Order ID</span>
                 <span className="text-sm font-medium font-mono text-foreground">#{orderId?.slice(-6) || "..."}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-border">
                 <span className="text-sm text-muted-foreground">Note ID</span>
                 <span className="text-sm font-medium font-mono text-foreground">#{noteId?.slice(-6) || "..."}</span>
              </div>
            </div>

            <Button 
              className="w-full h-12 rounded-xl text-base gap-2 bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-500/20" 
              onClick={handleSimulatePayment}
              disabled={simulating}
            >
              <CheckCircle2 className="w-5 h-5" /> 
              {simulating ? "Processing Payment..." : "Simulate Successful Return"}
            </Button>
            
            <p className="text-xs text-center text-muted-foreground mt-6">
              This is a local environment mock checkout page because no Lemon Squeezy API Key was provided.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
