import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

function Admin() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    instructor: "",
  });

  const adminLabel = useMemo(
    () => (user ? `${user.username} (${user.email})` : ""),
    [user]
  );

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await api.get("/courses");
      setCourses(res.data);
    } catch (error) {
      console.error("Failed to load courses", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.instructor) {
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post("/courses", form);
      setCourses((prev) => [res.data, ...prev]);
      setForm({ title: "", description: "", instructor: "" });
    } catch (error) {
      console.error("Failed to create course", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: "30px", maxWidth: "1100px", margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>Tableau admin</h1>
          <p style={{ color: "#666", marginTop: "8px" }}>
            Connecte en tant que {adminLabel}
          </p>
        </div>
        <button
          onClick={fetchCourses}
          style={{
            padding: "10px 16px",
            backgroundColor: "#5f2a74",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Rafraichir
        </button>
      </div>

      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
          marginBottom: "24px",
        }}
      >
        <h2 style={{ marginTop: 0 }}>Creer un cours</h2>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "12px" }}>
          <input
            type="text"
            placeholder="Titre"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            style={inputStyle}
          />
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={4}
            style={inputStyle}
          />
          <input
            type="text"
            placeholder="Instructeur"
            value={form.instructor}
            onChange={(e) => setForm({ ...form, instructor: e.target.value })}
            style={inputStyle}
          />
          <button
            type="submit"
            disabled={submitting}
            style={{
              padding: "12px",
              backgroundColor: submitting ? "#a78dc0" : "#5f2a74",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: submitting ? "not-allowed" : "pointer",
              fontWeight: "bold",
            }}
          >
            {submitting ? "Creation..." : "Publier le cours"}
          </button>
        </form>
      </div>

      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
        }}
      >
        <h2 style={{ marginTop: 0, marginBottom: "12px" }}>Cours</h2>
        {loading ? (
          <div>Chargement des cours...</div>
        ) : courses.length === 0 ? (
          <div style={{ color: "#777" }}>Aucun cours</div>
        ) : (
          <div style={{ display: "grid", gap: "12px" }}>
            {courses.map((course) => (
              <div
                key={course._id}
                style={{
                  border: "1px solid #eee",
                  borderRadius: "8px",
                  padding: "14px",
                  display: "grid",
                  gap: "6px",
                }}
              >
                <div style={{ fontWeight: "bold" }}>{course.title}</div>
                <div style={{ color: "#555" }}>{course.description}</div>
                <div style={{ color: "#6b21a8" }}>{course.instructor}</div>
                <div style={{ fontSize: "14px", color: "#777" }}>
                  {course.students?.length || 0} etudiants inscrits
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "6px",
  border: "1px solid #ddd",
  fontSize: "14px",
};

export default Admin;
