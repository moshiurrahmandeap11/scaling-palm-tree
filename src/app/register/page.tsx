"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { toast } from "react-hot-toast";
import { IUser, UserRole } from "@/lib/types";
import { useImageUpload } from "@/components/ImgbbUpload";

export default function RegisterPage() {
  const { login } = useAuth();
  const router = useRouter();
  const { upload, uploading } = useImageUpload();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    photoURL: "",
    role: "supporter" as UserRole,
  });
  const [file, setFile] = useState<File | undefined>();
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(form.password)) {
      toast.error("Password must be at least 8 characters with uppercase, lowercase, and a number.");
      return;
    }
    setLoading(true);
    try {
      let photoURL = form.photoURL;
      if (file) {
        const url = await upload(file);
        if (url) photoURL = url;
      }
      const res = await api.post<{ token: string; user: IUser }>("/auth/register", {
        ...form,
        photoURL,
      });
      login(res.token, res.user);
      toast.success(
        `Account created! You received ${res.user.credits} credits.`
      );
      router.push("/dashboard");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto flex max-w-md flex-col px-4 py-16">
      <div className="card-surface p-8">
        <h1 className="text-2xl font-extrabold text-slate-800">Create your account</h1>
        <p className="mt-1 text-sm text-slate-500">
          Supporters get 50 credits, creators get 20 on signup.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="label">Full Name</label>
            <input required className="input" value={form.name} onChange={(e) => set("name", e.target.value)} />
          </div>
          <div>
            <label className="label">Email</label>
            <input
              type="email"
              required
              className="input"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
            />
          </div>
          <div>
            <label className="label">Password</label>
            <input
              type="password"
              required
              minLength={8}
              className="input"
              value={form.password}
              onChange={(e) => set("password", e.target.value)}
            />
          </div>
          <div>
            <label className="label">Profile Picture</label>
            <input
              type="file"
              accept="image/*"
              className="input"
              onChange={(e) => setFile(e.target.files?.[0])}
            />
            <p className="mt-1 text-xs text-slate-400">
              Or paste an image URL:
            </p>
            <input
              className="input mt-1"
              placeholder="https://..."
              value={form.photoURL}
              onChange={(e) => set("photoURL", e.target.value)}
            />
            {uploading && <p className="mt-1 text-xs text-violet-600">Uploading image...</p>}
          </div>
          <div>
            <label className="label">I want to join as</label>
            <select
              className="input"
              value={form.role}
              onChange={(e) => set("role", e.target.value)}
            >
              <option value="supporter">Supporter</option>
              <option value="creator">Creator</option>
            </select>
          </div>
          <button type="submit" disabled={loading || uploading} className="btn-primary w-full">
            {loading ? "Creating..." : "Register"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-violet-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}
