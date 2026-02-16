import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postApi } from "../../api/apiservice";
import { useAppDispatch } from "../../redux/hooks";
import { setJWTToken } from "../../redux/features/jwtSlice";
import { setPermissions } from "../../redux/features/permissionsSlice";
import logo from "./logo1.png";


type loginResponseType = {
  message: String,
  data: {
    token: string,
    permissions: String[],
    role: String
  },
  statusCode: number
}

export default function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data: loginResponseType = await postApi({ url: "/auth/login", data: { email, password } });

      // Support multiple token shapes
      const token = data.data.token;
      const role = data.data.role;
      const permissions = data.data.permissions;

      // Save to redux
      dispatch(setJWTToken({ jwtToken: token }));
      dispatch(setPermissions({
        permissions: permissions,
        role: role
      }));
      if (role === "STUDENT") {
        navigate("/dashboard/student")
      } else {
        navigate("/dashboard/admin")
      }
    } catch (err) {
      // postApi shows toasts; keep UI simple
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
<div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4">
<div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6 bg-[var(--surface-color)] border border-[var(--border-color)] rounded-x2 shadow-lg overflow-hidden">

  {/* LEFT LOGO */}
  <div className="flex items-center justify-center bg-[var(--color-muted)] px-10">
<img src={logo} className="w-full h-full object-contain" alt="logo" />

    
    
  </div>

  {/* RIGHT LOGIN FORM */}
  <div className="p-10 flex flex-col justify-center">

      <div className="mb-6 text-center w-full">
  <h1 className="text-2xl alignment-font-semibold text-[var(--text-primary)]">
    LMS-PLATFORM
  </h1>
  <p className="text-[var(--text-secondary)] mt-1">Sign in</p>
</div>

      <form onSubmit={handleSubmit} className="w-full max-w-sm">

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 6 }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #cbd5e1" }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 6 }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #cbd5e1" }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{ width: "100%", padding: 10, background: "#497ad5", color: "white", border: "none", borderRadius: 10 }}
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
    </div>
</div>


  );
}

//STUDENT, RBAC