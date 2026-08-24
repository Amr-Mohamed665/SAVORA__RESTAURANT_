import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";

/** Inactivity timeout: 30 minutes in milliseconds */
const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000;

/** Events that count as user activity */
const ACTIVITY_EVENTS = ["mousemove", "mousedown", "keydown", "touchstart", "scroll"];

/**
 * Decode the JWT payload (base64url) and return the expiry timestamp in ms.
 * Returns null if the token is missing or malformed.
 */
function getTokenExpiry(token) {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp ? payload.exp * 1000 : null; // convert seconds → ms
  } catch {
    return null;
  }
}

/** Returns true if the stored token is present but already expired. */
function isTokenExpired(token) {
  const expiry = getTokenExpiry(token);
  if (!expiry) return false; // no expiry info — treat as valid
  return Date.now() >= expiry;
}
import { authService } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const expiryTimerRef = useRef(null);
  const inactivityTimerRef = useRef(null);
  const lastActivityRef = useRef(Date.now());

  const isAuthenticated = !!user && !!token;
  const isAdmin = user?.role === "admin";

  // Restore authentication state after refresh
  useEffect(() => {
    let mounted = true;

    const restoreAuth = async () => {
      const savedToken = localStorage.getItem("token");

      if (!savedToken) {
        if (mounted) {
          setToken(null);
          setUser(null);
          setLoading(false);
        }
        return;
      }

      try {
        const userData = await authService.getMe();

        if (mounted) {
          setUser(userData);
          setToken(savedToken);
        }
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        if (mounted) {
          setUser(null);
          setToken(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    restoreAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const login = useCallback(async (email, password) => {
    const { user: userData, token: newToken } = await authService.login(
      email,
      password,
    );

    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(userData));

    setToken(newToken);
    setUser(userData);

    return userData;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const { user: userData, token: newToken } = await authService.register(
      name,
      email,
      password,
    );

    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(userData));

    setToken(newToken);
    setUser(userData);

    return userData;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("lastActivity");

    // Clear the JWT expiry watcher
    if (expiryTimerRef.current) {
      clearInterval(expiryTimerRef.current);
      expiryTimerRef.current = null;
    }

    // Clear the inactivity watcher
    if (inactivityTimerRef.current) {
      clearInterval(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }

    setToken(null);
    setUser(null);
  }, []);

  /**
   * Whenever the token changes, schedule an auto-logout exactly when it
   * expires. Also poll every 30 s in case the system clock drifts or the
   * tab was backgrounded.
   */
  useEffect(() => {
    if (expiryTimerRef.current) {
      clearInterval(expiryTimerRef.current);
      expiryTimerRef.current = null;
    }

    if (!token) return;

    // If the token is already expired on mount (e.g. after a long idle), log
    // out immediately instead of waiting for the next API call.
    if (isTokenExpired(token)) {
      logout();
      window.location.href = "/login";
      return;
    }

    const expiry = getTokenExpiry(token);

    if (expiry) {
      // setTimeout fires exactly at expiry
      const msUntilExpiry = expiry - Date.now();
      const exactTimer = setTimeout(() => {
        logout();
        window.location.href = "/login";
      }, msUntilExpiry);

      // Also poll every 30 s as a safety net for backgrounded tabs
      expiryTimerRef.current = setInterval(() => {
        if (isTokenExpired(token)) {
          logout();
          window.location.href = "/login";
        }
      }, 30_000);

      return () => {
        clearTimeout(exactTimer);
        clearInterval(expiryTimerRef.current);
        expiryTimerRef.current = null;
      };
    }
  }, [token, logout]);

  /**
   * Inactivity auto-logout: reset the last-activity timestamp on any user
   * interaction. A 1-minute polling interval checks whether INACTIVITY_TIMEOUT_MS
   * has elapsed since the last recorded activity. If so, the user is logged out.
   */
  useEffect(() => {
    if (!token) return;

    // Initialise / refresh the last-activity timestamp
    lastActivityRef.current = Date.now();
    localStorage.setItem("lastActivity", lastActivityRef.current);

    const handleActivity = () => {
      lastActivityRef.current = Date.now();
      localStorage.setItem("lastActivity", lastActivityRef.current);
    };

    ACTIVITY_EVENTS.forEach((evt) =>
      window.addEventListener(evt, handleActivity, { passive: true })
    );

    inactivityTimerRef.current = setInterval(() => {
      // Also read from localStorage so multiple tabs share the same activity clock
      const stored = parseInt(localStorage.getItem("lastActivity") || "0", 10);
      const lastActive = Math.max(lastActivityRef.current, stored);

      if (Date.now() - lastActive >= INACTIVITY_TIMEOUT_MS) {
        logout();
        window.location.href = "/login";
      }
    }, 60_000); // check every 60 s

    return () => {
      ACTIVITY_EVENTS.forEach((evt) =>
        window.removeEventListener(evt, handleActivity)
      );
      if (inactivityTimerRef.current) {
        clearInterval(inactivityTimerRef.current);
        inactivityTimerRef.current = null;
      }
    };
  }, [token, logout]);

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
