import { useState } from "react";
import { motion } from "framer-motion";
import { Upload as UploadIcon, FileText, Image, CheckCircle, Video, FileArchive, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BRANCHES_WITH_SUBJECTS, ALL_BRANCHES } from "@/lib/constants";

const UploadPage = () => {
  const [submitted, setSubmitted] = useState(false);
  const [uploadType, setUploadType] = useState<"pdf" | "zip">("pdf");
  
  const [title, setTitle] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [subject, setSubject] = useState("");
  const [semester, setSemester] = useState("");
  const [college, setCollege] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [price, setPrice] = useState("0");
  const [pages, setPages] = useState("10");

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<File | null>(null);
  const [previewVideo, setPreviewVideo] = useState<File | null>(null);

  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async () => {
    if (!title || !subject || !college) {
      alert("Please fill in title, subject and college.");
      return;
    }
    const file = uploadType === "pdf" ? pdfFile : zipFile;
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("subject", subject);
    formData.append("semester", semester);
    formData.append("college", college);
    formData.append("department", selectedBranch);
    formData.append("description", description);
    formData.append("tags", tags);
    formData.append("price", price);
    formData.append("pages", pages);
    formData.append("file", file);
    if (previewImage) formData.append("thumbnail", previewImage);

    try {
      const res = await fetch("http://localhost:5000/api/notes", {
        method: "POST",
        body: formData,
        credentials: "include"
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        const err = await res.json();
        alert(err.message || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("An error occurred during upload.");
    } finally {
      setIsUploading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <CheckCircle className="w-20 h-20 text-success mx-auto mb-5" />
          <h2 className="font-heading text-3xl font-bold text-foreground mb-2">Notes Uploaded!</h2>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto">Your notes are being reviewed and will appear on the marketplace soon.</p>
          <Button onClick={() => setSubmitted(false)} size="lg" className="rounded-xl">Upload More</Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 max-w-4xl">
        {/* Header - Back to Old Simple Layout */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
            <UploadIcon className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">Upload Notes</h1>
            <p className="text-muted-foreground leading-none mt-1">Share your study materials and earn money</p>
          </div>
        </div>

        {/* Main Card */}
        <div className="rounded-3xl bg-card border border-border p-6 sm:p-8 lg:p-10 shadow-sm space-y-8">
          
          {/* Form Fields */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Title</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Operating System Complete Notes" className="rounded-xl h-12 bg-muted/20 border-border" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Branch</Label>
                <Select onValueChange={(val) => { setSelectedBranch(val); setSubject(""); }}>
                  <SelectTrigger className="rounded-xl h-12 bg-muted/20 border-border px-4">
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {ALL_BRANCHES.map(branch => <SelectItem key={branch} value={branch}>{branch}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Subject</Label>
                {!selectedBranch ? (
                  <Input disabled placeholder="Select branch first" className="rounded-xl h-12 bg-muted/10 px-4" />
                ) : (
                  <Select value={subject} onValueChange={setSubject}>
                    <SelectTrigger className="rounded-xl h-12 bg-muted/20 border-border px-4">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {(BRANCHES_WITH_SUBJECTS[selectedBranch as keyof typeof BRANCHES_WITH_SUBJECTS] || []).map(sub => (
                        <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                      ))}
                      <SelectItem value="Other_manual">Other (Type manually)</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Semester</Label>
                <Select onValueChange={setSemester}>
                  <SelectTrigger className="rounded-xl h-12 bg-muted/20 border-border">
                    <SelectValue placeholder="Select semester" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => <SelectItem key={s} value={String(s)}>Semester {s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">College</Label>
                <Input value={college} onChange={(e) => setCollege(e.target.value)} placeholder="e.g., GEC Surat" className="rounded-xl h-12 bg-muted/20 border-border" />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold">Description</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe what's included..." rows={4} className="rounded-xl bg-muted/20 border-border" />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold">Tags (Optional)</Label>
              <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="e.g. handwritten, important, pyqs, assignment" className="rounded-xl h-12 bg-muted/20 border-border" />
              <p className="text-[10px] text-muted-foreground ml-1">Separate tags with commas</p>
            </div>
          </div>

          {/* Upload Type - Unified Background */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Upload Type</Label>
            <div className="flex gap-4">
              {["pdf", "zip"].map((type) => (
                <button
                  key={type}
                  onClick={() => setUploadType(type as any)}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-xl border-2 p-4 transition-all ${
                    uploadType === type
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-muted/20 text-muted-foreground hover:border-primary/30"
                  }`}
                >
                  {type === "pdf" ? <FileText className="w-5 h-5" /> : <FileArchive className="w-5 h-5" />}
                  <span className="font-bold text-sm uppercase tracking-wide">{type === "pdf" ? "PDF Notes" : "ZIP / Assignment"}</span>
                </button>
              ))}
            </div>
          </div>

          {/* File Upload Area - Unified bg-muted/20 */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Upload File</Label>
            {(uploadType === "pdf" ? pdfFile : zipFile) ? (
              <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/20 p-4">
                {uploadType === "pdf" ? <FileText className="w-8 h-8 text-primary" /> : <FileArchive className="w-8 h-8 text-primary" />}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate">{(uploadType === "pdf" ? pdfFile : zipFile)?.name}</p>
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-tighter opacity-70">
                    {(((uploadType === "pdf" ? pdfFile : zipFile)?.size || 0) / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => uploadType === "pdf" ? setPdfFile(null) : setZipFile(null)}><X className="w-4 h-4" /></Button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl p-10 cursor-pointer bg-muted/20 hover:bg-muted/40 transition-all group">
                <UploadIcon className="w-10 h-10 text-muted-foreground group-hover:text-primary mb-3" />
                <span className="text-sm font-bold">Click to upload {uploadType === "pdf" ? "PDF" : "ZIP"}</span>
                <input type="file" className="hidden" accept={uploadType === "pdf" ? ".pdf" : ".zip"} onChange={(e) => {
                  const f = e.target.files?.[0] || null;
                  uploadType === "pdf" ? setPdfFile(f) : setZipFile(f);
                }} />
              </label>
            )}
          </div>

          {/* Thumbnail Image - Unified bg-muted/20 */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Preview Image (optional)</Label>
            {previewImage ? (
              <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/20 p-4">
                <Image className="w-8 h-8 text-primary" />
                <div className="flex-1 truncate text-sm font-bold">{previewImage.name}</div>
                <Button variant="ghost" size="sm" onClick={() => setPreviewImage(null)}><X className="w-4 h-4" /></Button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl p-8 cursor-pointer bg-muted/20 hover:bg-muted/40 transition-all group">
                <Image className="w-8 h-8 text-muted-foreground group-hover:text-primary mb-2" />
                <span className="text-sm font-bold">Upload image</span>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => setPreviewImage(e.target.files?.[0] || null)} />
              </label>
            )}
          </div>

          {/* Pricing - Unified bg-muted/20 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Price (₹)</Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-primary">₹</span>
                <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0 for free" className="rounded-xl h-12 bg-muted/20 border-border pl-8 font-bold" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Total Pages</Label>
              <Input type="number" value={pages} onChange={(e) => setPages(e.target.value)} className="rounded-xl h-12 bg-muted/20 border-border font-bold" />
            </div>
          </div>

          {/* Submit */}
          <Button size="lg" className="w-full rounded-xl h-14 text-base font-bold shadow-lg shadow-primary/20" onClick={handleUpload} disabled={isUploading}>
            {isUploading ? "Uploading..." : "Upload Notes"}
          </Button>

        </div>
      </div>
    </div>
  );
};

export default UploadPage;
