import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Camera,
  Loader2,
  LogOut,
  Mail,
  Pencil,
  Phone,
  Receipt,
  User as UserIcon,
  X,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { useOrders } from "../../hooks/queries";
import { uploadService } from "../../services/upload";
import { formatDate, formatTZS } from "../../lib/format";

const VALID_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ProfilePage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const logout = useAuthStore((s) => s.logout);
  const { data: orders } = useOrders();

  const [editOpen, setEditOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({ name: user?.name || "", email: user?.email || "" });
  const fileRef = useRef(null);

  const totalSpent = (orders || []).reduce((s, o) => s + (o.total || 0), 0);
  const memberSince = user?.createdAt ? formatDate(user.createdAt) : "";

  const handleAvatar = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setMessage("");
    try {
      const url = await uploadService.uploadImage(file, "profile");
      await updateProfile({ avatar: url });
      setMessage("Profile photo updated.");
    } catch (err) {
      setMessage(err?.message || "Upload failed.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const openEdit = () => {
    setForm({ name: user?.name || "", email: user?.email || "" });
    setMessage("");
    setEditOpen(true);
  };

  const saveProfile = async () => {
    setSaving(true);
    setMessage("");
    try {
      if (form.email && !VALID_EMAIL.test(form.email)) {
        setMessage("Please enter a valid email.");
        setSaving(false);
        return;
      }
      const payload = {};
      if (form.name && form.name !== user?.name) payload.name = form.name;
      if (form.email && form.email !== user?.email) payload.email = form.email;
      if (Object.keys(payload).length > 0) await updateProfile(payload);
      setEditOpen(false);
    } catch (err) {
      setMessage(err?.message || "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  const initial = (user?.name || user?.email || "U").charAt(0).toUpperCase();

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-dark p-8 md:p-10 relative overflow-hidden mb-6">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/20" />
        <div className="absolute -bottom-24 -left-10 w-56 h-56 bg-primary/10" />
        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-end gap-5">
          <div className="relative">
            <div className="w-24 h-24 bg-primary flex items-center justify-center text-white text-3xl font-bold overflow-hidden border-4 border-white/20">
              {user?.avatar ? (
                <img src={user.avatar} alt={user?.name} className="w-full h-full object-cover" />
              ) : (
                initial
              )}
            </div>
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="absolute bottom-0 right-0 w-9 h-9 bg-primary text-white flex items-center justify-center border-2 border-dark hover:bg-primary-dark transition-colors cursor-pointer disabled:opacity-60"
              aria-label="Change profile photo"
            >
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatar}
            />
          </div>
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-heading)] flex items-center justify-center sm:justify-start gap-2">
              {user?.name || "PikiFood User"}
              <button
                onClick={openEdit}
                className="text-white/50 hover:text-white transition-colors cursor-pointer"
                aria-label="Edit profile"
              >
                <Pencil className="w-4 h-4" />
              </button>
            </h1>
            <p className="text-white/60 text-sm mt-1">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white/80 bg-white/10 hover:bg-white/20 border border-white/20 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Log out
          </button>
        </div>
      </div>

      {message && (
        <p className="mb-4 text-sm text-green-700 bg-green-50 border border-green-100 px-3 py-2">
          {message}
        </p>
      )}

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-gray-100 shadow-sm p-4 text-center">
          <p className="text-lg md:text-xl font-bold text-primary font-[family-name:var(--font-heading)]">
            {formatTZS(totalSpent)}
          </p>
          <p className="text-xs text-gray-500 mt-1">Total Spent</p>
        </div>
        <div className="bg-white border border-gray-100 shadow-sm p-4 text-center">
          <p className="text-lg md:text-xl font-bold text-dark font-[family-name:var(--font-heading)]">
            {(orders || []).length}
          </p>
          <p className="text-xs text-gray-500 mt-1">Orders</p>
        </div>
        <div className="bg-white border border-gray-100 shadow-sm p-4 text-center">
          <p className="text-lg md:text-xl font-bold text-dark font-[family-name:var(--font-heading)]">
            {user?.createdAt ? memberSince.split(",")[0] : "—"}
          </p>
          <p className="text-xs text-gray-500 mt-1">Member Since</p>
        </div>
      </div>

      <div className="bg-white border border-gray-100 shadow-sm divide-y divide-gray-100">
        <div className="px-5 py-4 flex items-center gap-3">
          <Mail className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-xs text-gray-400">Email</p>
            <p className="text-sm font-semibold text-dark">{user?.email || "—"}</p>
          </div>
        </div>
        <div className="px-5 py-4 flex items-center gap-3">
          <Phone className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-xs text-gray-400">Phone</p>
            <p className="text-sm font-semibold text-dark">{user?.phone || "—"}</p>
          </div>
        </div>
        <div className="px-5 py-4 flex items-center gap-3">
          <UserIcon className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-xs text-gray-400">Role</p>
            <p className="text-sm font-semibold text-dark capitalize">
              {user?.role?.replace(/_/g, " ") || "customer"}
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate("/app/orders")}
          className="w-full px-5 py-4 flex items-center gap-3 hover:bg-gray-50 transition-colors cursor-pointer text-left"
        >
          <Receipt className="w-5 h-5 text-gray-400" />
          <span className="text-sm font-semibold text-dark flex-1">Order History</span>
        </button>
      </div>

      {editOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-[70]" onClick={() => setEditOpen(false)} />
          <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-dark font-[family-name:var(--font-heading)]">
                  Edit Profile
                </h3>
                <button
                  onClick={() => setEditOpen(false)}
                  className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 cursor-pointer"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-dark" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-dark mb-1.5">Full Name</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 focus:border-primary focus:outline-none text-sm"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-1.5">Email</label>
                  <input
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 focus:border-primary focus:outline-none text-sm"
                    placeholder="you@example.com"
                  />
                </div>

                {message && (
                  <p className="text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-2">
                    {message}
                  </p>
                )}

                <button
                  onClick={saveProfile}
                  disabled={saving}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-white font-semibold hover:bg-primary-dark transition-colors cursor-pointer disabled:opacity-60"
                >
                  {saving && <Loader2 className="w-5 h-5 animate-spin" />}
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
