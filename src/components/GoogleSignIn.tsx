"use client";

import { useRef, useState } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import type { IUser } from "@/lib/types";

interface GoogleCredentialResponse {
  credential: string;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: {
            client_id: string;
            callback: (response: GoogleCredentialResponse) => void;
          }) => void;
          renderButton: (element: HTMLElement, options: Record<string, string>) => void;
        };
      };
    };
  }
}

export default function GoogleSignIn() {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const container = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const initializeGoogle = () => {
    if (!clientId || !container.current || !window.google) return;
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: async ({ credential }) => {
        setBusy(true);
        try {
          const response = await api.post<{ token: string; user: IUser }>(
            "/auth/google",
            { idToken: credential },
            false
          );
          login(response.token, response.user);
          toast.success("Signed in with Google.");
          router.push("/dashboard");
        } catch (error) {
          toast.error((error as Error).message);
        } finally {
          setBusy(false);
        }
      },
    });
    container.current.replaceChildren();
    window.google.accounts.id.renderButton(container.current, {
      theme: "outline",
      size: "large",
      width: "350",
      text: "continue_with",
    });
  };

  if (!clientId) {
    return (
      <p className="mt-3 rounded-xl bg-amber-50 px-4 py-3 text-center text-xs text-amber-700">
        Google sign-in requires NEXT_PUBLIC_GOOGLE_CLIENT_ID.
      </p>
    );
  }

  return (
    <div className="mt-3">
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onReady={initializeGoogle}
        onError={() => toast.error("Could not load Google sign-in.")}
      />
      <div ref={container} className={busy ? "pointer-events-none opacity-60" : "flex justify-center"} />
    </div>
  );
}
