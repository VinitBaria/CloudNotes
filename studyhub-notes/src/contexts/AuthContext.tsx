import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import toast from "react-hot-toast";

export interface Transaction {
  id: string;
  type: "purchase" | "earning";
  noteTitle: string;
  amount: number;
  date: string;
  counterparty: string; // buyer name or seller name
}

export interface UploadedNote {
  _id?: string;
  id: string;
  title: string;
  subject: string;
  price: number;
  downloads: number;
  earnings: number;
  uploadedDate: string;
  createdAt?: string;
}

export interface User {
  _id?: string;
  name: string;
  email: string;
  college: string;
  avatar: string; // initials
  joinedDate: string;
  totalEarnings: number;
  totalSpent: number;
  uploadedNotes: UploadedNote[];
  purchasedNoteIds: string[];
  transactions: Transaction[];
  downloadedFreeNoteIds: string[];
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  needsOnboarding: boolean;
  isAdmin: boolean;
  adminMode: boolean;
  toggleAdminMode: () => void;
  login: (email: string, password?: string) => Promise<boolean>;
  logout: () => void;
  purchaseNote: (noteId: string, noteTitle: string, price: number) => void;
  downloadFreeNote: (noteId: string) => void;
  hasPurchased: (noteId: string) => boolean;
  hasDownloadedFree: (noteId: string) => boolean;
  updateProfile: (name: string, college: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const mockUser: User = {
  name: "Vinit Baria",
  email: "vinit@example.com",
  college: "GEC Surat",
  avatar: "VB",
  joinedDate: "January 2025",
  role: "user",
  totalEarnings: 1240,
  totalSpent: 147,
  uploadedNotes: [
    { id: "u1", title: "Operating System Complete Notes", subject: "Computer Science", price: 49, downloads: 342, earnings: 980, uploadedDate: "2025-10-15" },
    { id: "u2", title: "DBMS Lab Manual", subject: "Computer Science", price: 29, downloads: 89, earnings: 260, uploadedDate: "2025-11-20" },
  ],
  purchasedNoteIds: [],
  downloadedFreeNoteIds: [],
  transactions: [
    { id: "t1", type: "earning", noteTitle: "Operating System Complete Notes", amount: 49, date: "2026-03-08", counterparty: "Ravi P." },
    { id: "t2", type: "earning", noteTitle: "Operating System Complete Notes", amount: 49, date: "2026-03-05", counterparty: "Meera K." },
    { id: "t3", type: "earning", noteTitle: "DBMS Lab Manual", amount: 29, date: "2026-03-01", counterparty: "Sahil R." },
    { id: "t4", type: "purchase", noteTitle: "Machine Learning Notes", amount: 59, date: "2026-02-25", counterparty: "Arjun M." },
    { id: "t5", type: "purchase", noteTitle: "Engineering Mathematics III", amount: 29, date: "2026-02-10", counterparty: "Aman K." },
    { id: "t6", type: "purchase", noteTitle: "Digital Electronics Lab Manual", amount: 19, date: "2026-01-30", counterparty: "Sneha P." },
    { id: "t7", type: "earning", noteTitle: "Operating System Complete Notes", amount: 49, date: "2026-01-28", counterparty: "Pooja S." },
    { id: "t8", type: "earning", noteTitle: "DBMS Lab Manual", amount: 29, date: "2026-01-22", counterparty: "Jay D." },
  ],
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [adminMode, setAdminMode] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {credentials: 'include'})
      .then(res => res.json())
      .then(data => {
        if (data._id) {
          setUser({ 
            ...mockUser, 
            _id: data._id,
            email: data.email, 
            name: data.name,
            college: data.college || '',
            role: data.role || 'user',
            purchasedNoteIds: data.purchasedNotes || [],
            uploadedNotes: data.uploadedNotes || [] 
          });
        }
      })
      .catch(err => {
         console.error('Not logged in:', err);
      })
      .finally(() => {
         setIsLoading(false);
      });
  }, []);

  const login = async (email: string, password?: string) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: password || '12345' }),
        credentials: 'include'
      });
      const data = await res.json();
      if (res.ok) {
        setUser({ 
          ...mockUser, 
          _id: data._id,
          email: data.email, 
          name: data.name,
          college: data.college || '',
          role: data.role || 'user',
          purchasedNoteIds: data.purchasedNotes || [],
          uploadedNotes: data.uploadedNotes || []
        });
        return true;
      }
      return false;
    } catch (e) { console.error(e); return false; }
  };

  const logout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, { method: 'POST', credentials: 'include' });
      setUser(null);
    } catch(e) {}
  };

  const purchaseNote = async (noteId: string, noteTitle: string, price: number) => {
    if (!user) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/payment/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ noteId }),
        credentials: 'include'
      });
      const data = await res.json();
      
      if (res.ok && data.checkout_url) {
         window.location.href = data.checkout_url;
      } else {
         toast.error("Payment error: " + (data.message || "Failed to initiate checkout."));
      }
    } catch (e) {
      console.error("Payment failed:", e);
      toast.error("Something went wrong with the payment process.");
    }
  };

  const downloadFreeNote = (noteId: string) => {
    if (!user) return;
    setUser((prev) => {
      if (!prev) return prev;
      if (prev.downloadedFreeNoteIds.includes(noteId)) return prev;
      return { ...prev, downloadedFreeNoteIds: [...prev.downloadedFreeNoteIds, noteId] };
    });
  };

  const hasPurchased = (noteId: string) => !!user && user.purchasedNoteIds.includes(noteId);
  const hasDownloadedFree = (noteId: string) => !!user && user.downloadedFreeNoteIds.includes(noteId);

  const updateProfile = async (name: string, college: string) => {
    if (!user) return false;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, college }),
        credentials: 'include'
      });
      const data = await res.json();
      if (res.ok) {
        setUser(prev => prev ? { 
          ...prev, 
          name: data.name, 
          college: data.college,
          avatar: data.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
        } : null);
        return true;
      }
      return false;
    } catch(e) {
      console.error(e);
      return false;
    }
  };

  const needsOnboarding = !!user && !user.college;
  const isAdmin = user?.role === 'admin' || user?.email === 'vinitbaria2006@gmail.com';
  const toggleAdminMode = () => setAdminMode(prev => !prev);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, isLoading, needsOnboarding, isAdmin, adminMode: isAdmin && adminMode, toggleAdminMode, login, logout, purchaseNote, downloadFreeNote, hasPurchased, hasDownloadedFree, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};
