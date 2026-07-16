import { io, Socket } from "socket.io-client";

// Base URLs
const isLocal = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
export const API_BASE_URL = isLocal ? "http://localhost:5000" : "https://api-platform.youssefhatem.com";

export const LIVE_STREAM_BASE_URL = isLocal ? "http://localhost:8000/live" : "https://api-platform.youssefhatem.com/live";

let socket: Socket | null = null;

// --- API FETCH HELPERS ---
export async function apiRequest(endpoint: string, method: "GET" | "POST" | "PUT" | "DELETE" = "GET", body?: any) {
  const token = localStorage.getItem("ao_student_token") || localStorage.getItem("ao_lecturer_token") || localStorage.getItem("ao_admin_token");
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json"
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    
    // Check if the error is due to multi-device login invalidation
    if (response.status === 401 && data.error === "logged_in_on_another_device") {
      handleForceLogout();
      throw new Error("logged_in_on_another_device");
    }
    
    throw new Error(data.error || "Request failed");
  }

  return response.json();
}

// --- SOCKET CONNECTION ---
export function getSocket(): Socket | null {
  if (socket) return socket;

  const token = localStorage.getItem("ao_student_token") || localStorage.getItem("ao_lecturer_token") || localStorage.getItem("ao_admin_token");
  if (!token) return null;

  socket = io(API_BASE_URL, {
    auth: { token },
    reconnectionDelayMax: 10000
  });

  socket.on("force_logout", (data) => {
    console.warn("⚠️ Forced logout from server:", data.message);
    handleForceLogout();
  });

  socket.on("connect_error", (err) => {
    if (err.message === "logged_in_on_another_device") {
      handleForceLogout();
    }
  });

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

// Force logout implementation
function handleForceLogout() {
  localStorage.removeItem("ao_student_token");
  localStorage.removeItem("ao_student_user");
  localStorage.removeItem("ao_lecturer_token");
  localStorage.removeItem("ao_lecturer_user");
  disconnectSocket();
  
  // Custom event to notify React app
  window.dispatchEvent(new Event("ao_force_logged_out"));
  
  // Redirect
  window.location.href = "/login?error=another_device";
}
