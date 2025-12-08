"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import styled from "@emotion/styled";
import type { AgentResponse, AgentContext, AgentResult } from "@/lib/agent/types";

function uid() {
  try {
    const k = localStorage.getItem("userKey");
    if (k) return k;
  } catch {}
  const v = "u_" + Math.random().toString(36).slice(2);
  try {
    localStorage.setItem("userKey", v);
  } catch {}
  return v;
}

// ---------- STYLED COMPONENTS ----------
const FloatingButton = styled.button`
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: 40;
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 9999px;
  background-color: #2563eb;
  color: white;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Panel = styled.div`
  position: fixed;
  bottom: 6rem;
  right: 1.5rem;
  z-index: 40;
  width: 380px;
  max-height: 75vh;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Header = styled.div`
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e5e7eb;
  font-weight: 600;
  background-color: #f9fafb;
  color: gray;
`;

const Messages = styled.div`
  padding: 0.75rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const MessageRow = styled.div<{ align: "start" | "end" }>`
  display: flex;
  justify-content: ${(p) => (p.align === "end" ? "flex-end" : "flex-start")};
`;

const MessageBubble = styled.div<{ role: "user" | "ai" }>`
  max-width: 80%;
  padding: 0.5rem 0.75rem;
  border-radius: 1rem;
  background: ${(p) => (p.role === "user" ? "#2563eb" : "#f3f4f6")};
  color: ${(p) => (p.role === "user" ? "white" : "black")};
`;

const Card = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 0.75rem;
  margin-top: 10px;
`;

const CardTitle = styled.div`
  font-weight: 700;
  color: black;
`;

const CardMeta = styled.div`
  font-size: 0.875rem;
  color: #4b5563;
`;

const CardPrice = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  margin-top: 0.25rem;
  color: #6b7280;

`;

const CardWhy = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const PillButton = styled.button<{ tone: "neutral" | "primary" | "accent" }>`
  padding: 0.25rem 0.75rem;
  font-size: 0.875rem;
  border-radius: 0.5rem;
  background-color: ${(p) =>
    p.tone === "primary"
      ? "#2563eb"
      : p.tone === "accent"
      ? "#4f46e5"
      : "#e5e7eb"};
  color: ${(p) => (p.tone === "neutral" ? "black" : "white")};
`;

const Footer = styled.div`
  padding: 0.75rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  gap: 0.5rem;
`;

const Input = styled.input`
  flex: 1;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  padding: 0.5rem 0.75rem;
  color: black;
`;

const SendButton = styled.button`
  padding: 0.5rem 0.75rem;
  border-radius: 0.75rem;
  background-color: #2563eb;
  color: white;
  &:disabled {
    opacity: 0.5;
  }
`;

// ---------- COMPONENT ----------
function Pill({
  children,
  onClick,
  tone = "neutral",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  tone?: "neutral" | "primary" | "accent";
}) {
  return (
    <PillButton onClick={onClick} tone={tone}>
      {children}
    </PillButton>
  );
}

export default function FloatingAgent() {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msgs, setMsgs] = useState<
    { role: "user" | "ai"; text: string; payload?: AgentResponse | null }[]
  >([]);
  const [compareSet, setCompareSet] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [slots, setSlots] = useState<string[]>([]);
  const me = useMemo(uid, []);
  const inputRef = useRef<HTMLInputElement>(null);

  const send = async (text?: string, context?: AgentContext) => {
    const msg = (text ?? inputRef.current?.value ?? "").trim();
    if (!msg) return;
    setMsgs((m) => [...m, { role: "user", text: msg }]);
    if (!text && inputRef.current) inputRef.current.value = "";
    setBusy(true);
    const res = await fetch("/api/agent", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ message: msg, context, userKey: me }),
    });

    console.log("res", res);
    const data: AgentResponse = await res.json();
    setMsgs((m) => [...m, { role: "ai", text: data.reply, payload: data }]);
    setSlots(data.slots || []);
    setBusy(false);
  };

  const save = async (id: string) => {
    await fetch("/api/favorite/add", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ userKey: me, listingId: id }),
    });
    const r = await fetch("/api/favorite/list", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ userKey: me }),
    });
    const j = await r.json();
    setFavorites(j.favorites || []);
  };

  const compareToggle = (id: string) => {
    setCompareSet((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  };

  const compareRun = async () => {
    if (compareSet.length < 2) return alert("Pick at least two.");
    const r = await fetch("/api/compare", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ listingIds: compareSet }),
    });
    const j = await r.json();
    alert(
      j.summary +
        "\n\n" +
        j.items
          .map(
            (x: any) =>
              `• ${x.title} — ${x.area}, ${x.beds}bd/${x.baths}ba, ${x.price}`
          )
          .join("\n")
    );
  };

  const alertCreate = async (last: AgentResponse) => {
    const contact = prompt("Where should we send alerts (email or WhatsApp number)?");
    if (!contact) return;
    await fetch("/api/alerts/create", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        userKey: me,
        filters: { lastResults: last.results },
        contact,
        channel: contact.includes("@") ? "email" : "whatsapp",
      }),
    });
    alert("Alert created 👍");
  };

  const propose = async () => {
    const r = await fetch("/api/schedule/propose", { method: "POST" });
    const j = await r.json();
    setSlots(j.slots || []);
  };

  const book = async (listingId?: string) => {
    const name = prompt("Your name:");
    const email = prompt("Your email:");
    const slotIso = prompt("Pick a slot ISO from the purple buttons (you can paste):");
    if (!name || !email || !slotIso) return;
    const r = await fetch("/api/schedule/book", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ listingId: listingId || "unknown", slotIso, name, email }),
    });
    const j = await r.json();
    const blob = new Blob([j.ics], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "viewing.ics";
    a.click();
    URL.revokeObjectURL(url);
    alert("Booked (demo). ICS downloaded.");
  };

  const estimate = async (priceM: number) => {
    const downPct = Number(prompt("Down payment %", "20") || "20");
    const ratePct = Number(prompt("Annual interest %", "12") || "12");
    const years = Number(prompt("Years", "20") || "20");
    const r = await fetch("/api/payment/estimate", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ priceM, downPct, ratePct, years }),
    });
    const j = await r.json();
    alert(
      `~ ${j.monthly.toLocaleString()} ${j.currency}/mo (estimate). Principal: ${j.principal.toLocaleString()} ${j.currency}`
    );
  };

  useEffect(() => {
    if (open && msgs.length === 0)
      setMsgs([
        {
          role: "ai",
          text: "Hi! Tell me what you’re looking for (e.g., '3-bed in Bole under 10M').",
          payload: null,
        },
      ]);
  }, [open]);

  return (
    <>
      <FloatingButton onClick={() => setOpen((v) => !v)}>
        {open ? "×" : "🤖"}
      </FloatingButton>

      {open && (
        <Panel>
          <Header>Ask our AI about listings</Header>
          <Messages>
            {msgs.map((m, i) => (
              <div key={i}>
                <MessageRow align={m.role === "user" ? "end" : "start"}>
                  <MessageBubble role={m.role}>{m.text}</MessageBubble>
                </MessageRow>

                {m.role === "ai" && m.payload?.results?.length ? (
                  <div>
                    {m.payload.results.map((r: AgentResult) => (
                      <Card key={r.id}>
                        <CardTitle>{r.title}</CardTitle>
                        <CardMeta>
                          {r.beds} bd · {r.baths} ba · {r.area}
                        </CardMeta>
                        <CardPrice>{r.price}</CardPrice>
                        {r.why && <CardWhy>Why: {r.why}</CardWhy>}
                        <Actions>
                          <Pill
                            onClick={() => save(r.id)}
                            tone="neutral"
                          >
                            {favorites.includes(r.id) ? "Saved ✓" : "Save"}
                          </Pill>
                          <Pill
                            onClick={() => compareToggle(r.id)}
                            tone="neutral"
                          >
                            {compareSet.includes(r.id) ? "Selected ✓" : "Compare"}
                          </Pill>
                          <Pill onClick={() => book(r.id)} tone="primary">
                            Book
                          </Pill>
                          <Pill
                            onClick={() =>
                              estimate(
                                Number(r.price.replace(/[^\d.]/g, "")) || 10
                              )
                            }
                            tone="accent"
                          >
                            Estimate
                          </Pill>
                        </Actions>
                      </Card>
                    ))}
                  </div>
                ) : null}

                {m.role === "ai" && m.payload?.suggestions?.length ? (
                  <Actions>
                    <Pill onClick={() => m.payload && alertCreate(m.payload!)}>
                      Create alert
                    </Pill>
                    {compareSet.length >= 2 && (
                      <Pill onClick={compareRun} tone="accent">
                        Run compare ({compareSet.length})
                      </Pill>
                    )}
                    <Pill onClick={propose}>Propose slots</Pill>
                  </Actions>
                ) : null}
              </div>
            ))}
          </Messages>

          {slots.length > 0 && (
            <div style={{ padding: "0 0.75rem 0.5rem" }}>
              <div style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>
                Proposed viewing slots:
              </div>
              <Actions>
                {slots.map((s) => (
                  <Pill
                    key={s}
                    onClick={() => navigator.clipboard.writeText(s)}
                    tone="accent"
                  >
                    {new Date(s).toLocaleString()}
                  </Pill>
                ))}
              </Actions>
              <div style={{ fontSize: "0.625rem", color: "#6b7280", marginTop: "0.25rem" }}>
                Click a slot to copy ISO; use “Book” on a card to confirm (demo flow).
              </div>
            </div>
          )}

          <Footer>
            <Input
              ref={inputRef}
              placeholder="3-bed in Bole under 10M…"
              onKeyDown={(e) => e.key === "Enter" && !busy && send()}
            />
            <SendButton onClick={() => send()} disabled={busy}>
              {busy ? "…" : "Send"}
            </SendButton>
          </Footer>
        </Panel>
      )}
    </>
  );
}
