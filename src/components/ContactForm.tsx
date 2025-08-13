import React, { useState } from "react";

interface ContactFormProps {
  endpoint?: string; // Optional, defaults to "/api/contact"
}

const ContactForm: React.FC<ContactFormProps> = ({ endpoint = "/api/contact" }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const validateEmail = (email: string) => {
    // Simple but effective email regex
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.toLowerCase());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("All fields are required.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setStatus("sending");
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }
      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      console.error(err);
      setStatus("error");
      setError("Failed to send message. Please try again later.");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.75rem", maxWidth: "400px" }}>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
      />
      <input
        type="email"
        placeholder="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
      />
      <textarea
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
        rows={5}
        style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
      />
      {error && <div style={{ color: "red", fontSize: "0.9rem" }}>{error}</div>}
      <button
        type="submit"
        disabled={status === "sending"}
        style={{
          padding: "0.5rem",
          borderRadius: "4px",
          border: "none",
          backgroundColor: "#007bff",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        {status === "sending" ? "Sending..." : "Send Message"}
      </button>
      {status === "success" && <div style={{ color: "green", fontSize: "0.9rem" }}>Message sent successfully!</div>}
    </form>
  );
};

export default ContactForm;
