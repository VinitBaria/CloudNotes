import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Star, Download, GraduationCap, User, Calendar, BookOpen,
  Shield, CheckCircle, ArrowLeft, Eye, FileText, MessageSquare,
  Lock, Send, ThumbsUp,
} from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { useAuth } from "@/contexts/AuthContext";

interface Review {
  _id?: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
  verified: boolean;
}

const StarRating = ({ value, onChange, size = "md" }: { value: number; onChange?: (v: number) => void; size?: "sm" | "md" | "lg" }) => {
  const iconSize = size === "sm" ? "w-3.5 h-3.5" : size === "lg" ? "w-6 h-6" : "w-4.5 h-4.5";
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <button 
          key={s} 
          type="button" 
          onClick={() => onChange?.(s)} 
          disabled={!onChange}
          className={`transition-all ${onChange ? "hover:scale-110 cursor-pointer active:scale-95" : "cursor-default"}`}
        >
          <Star 
            className={`${iconSize} ${
              s <= value 
                ? "text-amber-500 fill-amber-500 shadow-sm" 
                : "text-muted-foreground/30 fill-transparent"
            }`} 
            strokeWidth={s <= value ? 2.5 : 2}
          />
        </button>
      ))}
    </div>
  );
};

const NoteDetailPage = () => {
  const { id } = useParams();
  const [note, setNote] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user, isLoggedIn, purchaseNote, downloadFreeNote, hasPurchased, hasDownloadedFree } = useAuth();

  const [reviewsList, setReviewsList] = useState<Review[]>([]);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  
  useEffect(() => {
    // Fetch Note
    fetch(`${import.meta.env.VITE_API_URL}/notes/${id}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && (data._id || data.id)) {
          setNote(data);
        } else {
          setNote(null);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching note:", err);
        setNote(null);
        setLoading(false);
      });

    // Fetch Reviews
    fetch(`${import.meta.env.VITE_API_URL}/notes/${id}/reviews`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setReviewsList(data);
        }
      })
      .catch(err => console.error("Error fetching reviews:", err));
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background text-foreground text-xl font-heading">Loading note details...</div>;
  if (!note) return <div className="min-h-screen flex items-center justify-center bg-background text-foreground text-xl font-heading">Note not found.</div>;

  const noteId = note._id || note.id;

  const noteReviews = reviewsList;
  const isFree = note.price === 0;
  const alreadyPurchased = hasPurchased(noteId);
  const alreadyDownloaded = hasDownloadedFree(noteId);
  const hasAccess = isFree ? alreadyDownloaded : alreadyPurchased;

  // Can review: logged in + (free note always OR paid note after purchase)
  const canReview = isLoggedIn && (isFree || alreadyPurchased);
  const avgRating = noteReviews.length
    ? (noteReviews.reduce((s, r) => s + r.rating, 0) / noteReviews.length).toFixed(1)
    : (Number(note.rating) || 0).toFixed(1);

  const handleAction = () => {
    if (!isLoggedIn) return;
    if (isFree) {
      downloadFreeNote(noteId);
      // Trigger the actual file download automatically
      handleDownload();
    } else {
      purchaseNote(noteId, note.title, note.price);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRating || !newComment.trim()) return;
    
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/notes/${id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: newRating, comment: newComment.trim() }),
        credentials: 'include'
      });
      const data = await res.json();
      if (res.ok) {
        setReviewsList(prev => [data, ...prev]);
        setNewComment("");
        setNewRating(0);
        setReviewSubmitted(true);
      } else {
        alert(data.message || "Failed to submit review");
      }
    } catch (err) {
      console.error("Error submitting review:", err);
    }
  };



  const handleDownload = async () => {
    if (!note?.fileUrl) return;
    
    try {
      const res = await fetch(`http://localhost:5000/api/notes/${noteId}/download`, {
        method: 'POST',
      });
      if (res.ok) {
        const data = await res.json();
        setNote((prev: any) => ({ ...prev, downloads: data.downloads }));
      }
    } catch (err) {
      console.error("Failed to update download count", err);
    }

    let url = note.fileUrl.startsWith('http') ? note.fileUrl : `http://localhost:5000${note.fileUrl}`;
    
    // Fix spaces and special characters in URLs to avoid ERR_INVALID_RESPONSE
    url = url.replace(/ /g, '%20');

    // Cloudinary force download: try to inject fl_attachment back in now that we've encoded spaces
    if (url.includes('cloudinary.com') && url.includes('/upload/')) {
       // Only add if not already there
       if (!url.includes('fl_attachment')) {
         url = url.replace('/upload/', '/upload/fl_attachment/');
       }
    }
    
    // Use an anchor tag for more controlled downloading
    const link = document.createElement('a');
    link.href = url;
    // The download attribute works best when fl_attachment is also set on Cloudinary
    link.setAttribute('download', `${note.title.replace(/\s+/g, '_')}.pdf`);
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getPagePreviewUrl = (pageNumber: number) => {
    if (!note?.fileUrl) return "";
    const rawUrl = note.fileUrl.startsWith('http') ? note.fileUrl : `http://localhost:5000${note.fileUrl}`;
    
    if (rawUrl.includes('cloudinary.com')) {
      // Always extract the real page from the PDF using pg_ parameter
      return rawUrl
        .replace('/upload/', `/upload/c_fill,h_1000,w_750,q_auto,f_auto,pg_${pageNumber}/`)
        .split('?')[0]
        .replace('.pdf', '.jpg');
    }
    
    return rawUrl;
  };


  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Link to="/explore" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />Back to Explore
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* ── Left ── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Details */}
            <AnimatedSection>
              <div className="rounded-2xl bg-card border border-border p-6 md:p-8">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="text-xs font-semibold px-3 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20">{note.subject}</span>
                  <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-muted text-muted-foreground">Semester {note.semester}</span>
                  {isFree && <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">FREE</span>}
                </div>
                <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-3">{note.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                  <span className="flex items-center gap-1.5"><User className="w-4 h-4" /> {note.authorName || (note.author?.name) || "Unknown"}</span>
                  <span className="flex items-center gap-1.5"><GraduationCap className="w-4 h-4" /> {note.college}</span>
                  <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4" /> {note.department || "General"}</span>
                </div>
                <div className="flex items-center gap-6 mb-6 pb-6 border-b border-border">
                  <div className="flex items-center gap-2">
                    <StarRating value={Math.round(Number(avgRating))} size="md" />
                    <span className="font-bold text-foreground text-lg">{avgRating}</span>
                    <span className="text-muted-foreground text-sm">({noteReviews.length} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Download className="w-4 h-4" /><span>{note.downloads} downloads</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <FileText className="w-4 h-4" /><span>{note.pages || 0} pages</span>
                  </div>
                </div>
                <h2 className="font-heading font-bold text-lg text-foreground mb-2">Description</h2>
                <p className="text-muted-foreground leading-relaxed">{note.description}</p>
              </div>
            </AnimatedSection>

            {/* Preview Section */}
            <AnimatedSection delay={0.1}>
              <div className="rounded-2xl bg-card border border-border p-5 md:p-8">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-heading font-bold text-lg text-foreground flex items-center gap-2">
                    <Eye className="w-5 h-5 text-primary" />Note Preview
                  </h2>
                  <Button variant="ghost" size="sm" className="text-xs gap-1.5 h-8 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => window.open(note.fileUrl.startsWith('http') ? note.fileUrl : `http://localhost:5000${note.fileUrl}`, '_blank')}>
                    <Download className="w-3.5 h-3.5" />Full View
                  </Button>
                </div>
                
                <div className="rounded-xl bg-muted/20 border border-border overflow-hidden min-h-[500px] relative group flex flex-col items-center p-3 md:p-6">
                  {note.fileUrl ? (
                    <div className="w-full flex flex-col md:flex-row gap-6 justify-center relative">
                      {/* Page 1 Preview */}
                      <div className="relative flex-1 max-w-[500px] shadow-lg rounded-lg overflow-hidden border border-border bg-white group/page">
                         <img 
                           src={getPagePreviewUrl(1)} 
                           alt="Page 1 Preview"
                           className="w-full h-auto object-contain cursor-zoom-in"
                           onClick={() => window.open(note.fileUrl, '_blank')}
                         />
                         <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/50 text-white text-[10px] rounded backdrop-blur-sm">
                           Page 1
                         </div>
                      </div>


                      {/* Page 2 Preview - only if available */}
                      {(note.pages > 1 || !note.pages) && (
                         <div className="relative flex-1 max-w-[500px] shadow-lg rounded-lg overflow-hidden border border-border bg-white group/page">
                            <img 
                              src={getPagePreviewUrl(2)} 
                              alt="Page 2 Preview"
                              className="w-full h-auto object-contain cursor-zoom-in"
                              onClick={() => window.open(note.fileUrl, '_blank')}
                              onError={(e) => {
                                // If second page doesn't exist, hide this container
                                (e.target as any).closest('.group\\/page').style.display = 'none';
                              }}
                            />
                            <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/50 text-white text-[10px] rounded backdrop-blur-sm">Page 2</div>
                         </div>
                      )}

                      {/* Floating Action Button */}
                      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                         <Button variant="secondary" className="rounded-xl gap-2 shadow-2xl backdrop-blur-md bg-white/95 border-0 hover:bg-white text-primary font-bold px-10 h-11" onClick={() => window.open(note.fileUrl, '_blank')}>
                            <Eye className="w-4 h-4" /> Open Full {note.pages || ""} Pages
                         </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                       <FileText className="w-16 h-16 text-muted-foreground mb-4 opacity-10" />
                       <p className="text-muted-foreground font-medium">No preview available for this file.</p>
                       <Button variant="outline" className="mt-4 rounded-xl" onClick={handleDownload}>Try Downloading Directly</Button>
                    </div>
                  )}

                  {/* Anti-Screenshots / Gate Hint */}
                  {!hasAccess && !isFree && (
                    <div className="absolute inset-x-0 bottom-0 py-10 bg-gradient-to-t from-card via-card/95 to-transparent flex flex-col items-center justify-end px-6 text-center">
                       <Lock className="w-8 h-8 text-primary/50 mb-3" />
                       <h3 className="text-lg font-bold text-foreground mb-1">Preview Limited</h3>
                       <p className="text-sm text-muted-foreground mb-6 max-w-xs">Purchase full access to read all {note.pages || 0} pages and save these notes permanently.</p>
                       <Button onClick={handleAction} className="rounded-xl px-10 h-12 shadow-lg shadow-primary/20">Buy Now for ₹{note.price}</Button>
                    </div>
                  )}
                </div>
              </div>
            </AnimatedSection>

            {/* ── Reviews Section ── */}
            <AnimatedSection delay={0.2}>
              <div className="rounded-2xl bg-card border border-border p-6 md:p-8">
                <h2 className="font-heading font-bold text-lg text-foreground mb-6 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />Reviews
                  <span className="text-sm font-normal text-muted-foreground">({noteReviews.length})</span>
                </h2>

                {/* Write Review */}
                <div className="mb-6 rounded-xl border border-border overflow-hidden">
                  <div className="px-5 py-3 bg-muted/50 border-b border-border flex items-center gap-2">
                    <ThumbsUp className="w-4 h-4 text-primary" />
                    <span className="font-semibold text-sm text-foreground">Write a Review</span>
                    {isFree ? (
                      <span className="ml-auto text-[11px] text-emerald-500 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full">Open to all</span>
                    ) : (
                      <span className="ml-auto text-[11px] text-primary font-medium bg-primary/10 px-2 py-0.5 rounded-full">Buyers only</span>
                    )}
                  </div>

                  <div className="p-5">
                    {!isLoggedIn ? (
                      <div className="flex flex-col items-center gap-3 py-4 text-center">
                        <Lock className="w-8 h-8 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Please <Link to="/login" className="text-primary font-semibold hover:underline">sign in</Link> to write a review.</p>
                      </div>
                    ) : !canReview ? (
                      // Paid note but not purchased
                      <div className="flex flex-col items-center gap-3 py-4 text-center">
                        <Lock className="w-8 h-8 text-amber-500" />
                        <p className="text-sm font-semibold text-foreground">Purchase Required</p>
                        <p className="text-xs text-muted-foreground">You need to buy this note before leaving a review. Only verified buyers can review paid notes.</p>
                      </div>
                    ) : reviewSubmitted ? (
                      <div className="flex flex-col items-center gap-2 py-4 text-center">
                        <CheckCircle className="w-8 h-8 text-emerald-500" />
                        <p className="font-semibold text-foreground">Review submitted! Thank you.</p>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmitReview} className="space-y-4">
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Your Rating</p>
                          <StarRating value={newRating} onChange={setNewRating} size="lg" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Your Review</p>
                          <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Share your experience with this note..."
                            rows={3}
                            className="w-full rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none transition-all"
                            required
                          />
                        </div>
                        <Button type="submit" size="sm" className="rounded-xl gap-2" disabled={!newRating || !newComment.trim()}>
                          <Send className="w-4 h-4" />Submit Review
                        </Button>
                      </form>
                    )}
                  </div>
                </div>

                {/* Existing reviews */}
                <div className="space-y-4">
                  {noteReviews.length === 0 && (
                    <p className="text-center text-sm text-muted-foreground py-6">No reviews yet. Be the first!</p>
                  )}
                  <AnimatePresence>
                    {noteReviews.map((review, i) => (
                      <motion.div key={i}
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="border-b border-border last:border-0 pb-5 last:pb-0"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                              {review.name && review.name[0]}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-sm text-foreground">{review.name}</span>
                                {review.verified && (
                                  <span className="flex items-center gap-0.5 text-[10px] font-semibold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">
                                    <CheckCircle className="w-3 h-3" />Verified
                                  </span>
                                )}
                              </div>
                              <StarRating value={review.rating} size="sm" />
                            </div>
                          </div>
                           <span className="text-xs text-muted-foreground">{review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'Just now'}</span>
                        </div>
                        <p className="text-sm text-muted-foreground ml-12">{review.comment}</p>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </AnimatedSection>
          </div>

          {/* ── Right (Sticky Buy Card) ── */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <AnimatedSection direction="right">
                <motion.div whileHover={{ y: -2 }} className="rounded-2xl bg-card border border-border p-6 shadow-sm">
                  <div className="text-center mb-5">
                    {isFree ? (
                      <div>
                        <div className="font-heading text-3xl font-extrabold text-emerald-600">Free</div>
                        <p className="text-xs text-muted-foreground mt-1">No payment required</p>
                      </div>
                    ) : (
                      <div>
                        <div className="font-heading text-3xl font-extrabold text-foreground">₹{note.price}</div>
                        <p className="text-xs text-muted-foreground mt-1">One-time purchase • Lifetime access</p>
                      </div>
                    )}
                  </div>

                  {hasAccess ? (
                    <div className="space-y-3">
                      <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-center">
                        <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                        <p className="font-semibold text-foreground">{isFree ? "Downloaded!" : "Purchase Successful!"}</p>
                        <p className="text-xs text-muted-foreground mt-1">You can now download this note</p>
                      </div>
                      <Button onClick={handleDownload} className="w-full h-11 rounded-xl text-base gap-2 bg-emerald-600 hover:bg-emerald-700">
                        <Download className="w-4 h-4" />Download PDF
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {!isLoggedIn ? (
                        <Button className="w-full h-12 rounded-xl text-base gap-2" asChild>
                          <Link to="/login">{isFree ? "Sign in to Download" : "Sign in to Purchase"}</Link>
                        </Button>
                      ) : (
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button onClick={handleAction} className={`w-full h-12 rounded-xl text-base gap-2 shadow-lg ${isFree ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20 text-white" : "shadow-primary/20"}`}>
                            {isFree ? <><Download className="w-4 h-4" />Download Free</> : <><Shield className="w-4 h-4" />Buy Now — ₹{note.price}</>}
                          </Button>
                        </motion.div>
                      )}
                      <Button variant="outline" className="w-full h-11 rounded-xl gap-2">
                        <Eye className="w-4 h-4" />Preview PDF
                      </Button>
                    </div>
                  )}

                  <div className="mt-5 pt-5 border-t border-border space-y-3 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <FileText className="w-4 h-4 text-primary shrink-0" /><span>{note.pages || 0} pages, PDF format</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4 text-primary shrink-0" /><span>Semester {note.semester || 1} • {note.department || "General"}</span>
                    </div>
                    {!isFree && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Shield className="w-4 h-4 text-primary shrink-0" /><span>Secure payment via Lemon Squeezy</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Download className="w-4 h-4 text-primary shrink-0" /><span>Instant download after {isFree ? "sign in" : "purchase"}</span>
                    </div>
                  </div>

                  {/* Review gate info */}
                  {!isFree && (
                    <div className="mt-4 rounded-xl bg-muted/60 border border-border px-4 py-3 text-xs text-muted-foreground flex items-start gap-2">
                      <ThumbsUp className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                      <span>Reviews on paid notes are <strong className="text-foreground">verified buyer only</strong>. Purchase to unlock the review section.</span>
                    </div>
                  )}
                </motion.div>
              </AnimatedSection>

              <AnimatedSection delay={0.15} direction="right">
                <div className="rounded-2xl bg-card border border-border p-5 mt-4">
                  <h3 className="font-heading font-bold text-sm text-foreground mb-3">Uploaded by</h3>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">
                      {note.authorName ? note.authorName[0] : (note.author?.name ? note.author.name[0] : "U")}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">{note.authorName || note.author?.name || "Unknown Author"}</p>
                      <p className="text-xs text-muted-foreground">{note.college}</p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteDetailPage;
