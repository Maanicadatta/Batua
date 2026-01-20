// src/pages/Onboarding.jsx
import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

/* ---------- small generic bits ---------- */
function CurrencySelect({ disabled }) {
  return (
    <select className="cur" disabled={disabled}>
      <option>₹</option><option>$</option><option>€</option>
    </select>
  );
}
function Line({ label, disabled, value, onChange }) {
  // keep an internal value but mirror whatever the parent passes in
  const [amt, setAmt] = React.useState(value ?? "");
  React.useEffect(() => { setAmt(value ?? ""); }, [value]);

  const handleChange = (e) => {
    // allow digits and a single decimal point
    const next = e.target.value.replace(/[^\d.]/g, "").replace(/(\..*)\./g, "$1");
    setAmt(next);
    onChange?.(next);                 // keep as string so typing "12." works
  };

  return (
    <div className="line-field">
      <span className="line-label">{label}:</span>
      <div className="line-input">
        <CurrencySelect disabled={disabled} />
        <input
          type="text"
          inputMode="decimal"
          placeholder="0"
          value={amt}
          onChange={handleChange}
          readOnly={!!disabled}       // focusable when view mode toggles on/off
        />
      </div>
    </div>
  );
}


/* ---------- DOB (DD / MM / YYYY) ---------- */
function DOBField({ label = "What is Your Date Of Birth?", value, onChange }) {
  const [dd, setDD]   = useState(value?.dd ?? "");
  const [mm, setMM]   = useState(value?.mm ?? "");
  const [yyyy, setYY] = useState(value?.yyyy ?? "");

  const ddRef = React.useRef(null);
  const mmRef = React.useRef(null);
  const yyRef = React.useRef(null);

  const pad2 = (v) => (v && v.length === 1 ? `0${v}` : v);

  const emit = (nDD, nMM, nYY) => {
    onChange?.({
      dd: nDD,
      mm: nMM,
      yyyy: nYY,
      iso: nDD && nMM && nYY ? `${nYY}-${nMM}-${nDD}` : "",
      display: nDD && nMM && nYY ? `${nDD}/${nMM}/${nYY}` : "",
    });
  };

  const onDay = (v) => {
    let nv = v.replace(/\D/g, "").slice(0, 2);
    if (nv) nv = Math.min(parseInt(nv, 10), 31).toString();
    const padded = pad2(nv);
    setDD(padded);
    if (padded.length === 2) mmRef.current?.focus();
    emit(padded, mm, yyyy);
  };

  const onMonth = (v) => {
    let nv = v.replace(/\D/g, "").slice(0, 2);
    if (nv) nv = Math.min(parseInt(nv, 10), 12).toString();
    const padded = pad2(nv);
    setMM(padded);
    if (padded.length === 2) yyRef.current?.focus();
    emit(dd, padded, yyyy);
  };

  const onYear = (v) => {
    const now = new Date().getFullYear();
    let nv = v.replace(/\D/g, "").slice(0, 4);
    if (nv.length === 4) {
      const clamped = Math.max(1900, Math.min(now, parseInt(nv, 10))).toString();
      setYY(clamped);
      emit(dd, mm, clamped);
    } else {
      setYY(nv);
      emit(dd, mm, nv);
    }
  };

  // datalists (dropdowns) allow pick OR type
  const days  = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, "0"));
  const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
  const years = (() => {
    const y = new Date().getFullYear();
    const start = y - 100; // last 100 years
    return Array.from({ length: 101 }, (_, i) => String(start + i));
  })();

  return (
    <div className="dob-container wiz-block">
      <h2 className="wiz-q">{label}</h2>

      <div className="dob-inputs">
        <input
          ref={ddRef}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="DD"
          className="dob-box"
          list="dob-days"
          value={dd}
          onChange={(e) => onDay(e.target.value)}
          aria-label="Day"
        />
        <input
          ref={mmRef}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="MM"
          className="dob-box"
          list="dob-months"
          value={mm}
          onChange={(e) => onMonth(e.target.value)}
          aria-label="Month"
        />
        <input
          ref={yyRef}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="YYYY"
          className="dob-box dob-year"
          list="dob-years"
          value={yyyy}
          onChange={(e) => onYear(e.target.value)}
          aria-label="Year"
        />

        <datalist id="dob-days">
          {days.map((d) => (<option key={d} value={d} />))}
        </datalist>
        <datalist id="dob-months">
          {months.map((m) => (<option key={m} value={m} />))}
        </datalist>
        <datalist id="dob-years">
          {years.map((y) => (<option key={y} value={y} />))}
        </datalist>
      </div>
    </div>
  );
}

/* ---------- Stepper (top progress rail) ---------- */
function Stepper({ active }) {
  const items = [
    { n: 1, t: "About\nYou" },
    { n: 2, t: "Income\nDetails" },
    { n: 3, t: "Spending\nDetails" },
    { n: 4, t: "Debts &\nDues" },
    { n: 5, t: "Assets &\nInvestments" },
    { n: 6, t: "Risk\nPreference" },
  ];
  return (
    <div className="wizard-stepper">
      {items.map((it, i) => {
        const idx = i + 1;
        const done = idx < active;
        const isActive = idx === active;
        return (
          <div key={it.n} className={`wiz-step ${done ? "done" : ""} ${isActive ? "active" : ""}`}>
            <span className="wiz-dot">{idx}</span>
            <span className="wiz-label">{it.t}</span>
            {idx < items.length && <span className="wiz-rail" aria-hidden />}
          </div>
        );
      })}
    </div>
  );
}

/* ---------- New 3-choice line selector (replaces slider) ---------- */
function TripleChoice({ question, left, mid, right, subLeft, subMid, subRight, value, onChange }) {
  const opts = [
    { key: "L", label: left, sub: subLeft },
    { key: "M", label: mid, sub: subMid },
    { key: "R", label: right, sub: subRight },
  ];
  return (
    <div className="wiz-block">
      {question && <h2 className="wiz-q">{question}</h2>}

      <div className="triple-line">
        {opts.map((o, i) => (
          <button
            key={o.key}
            type="button"
            className={`triple-dot ${value === o.key ? "on" : ""}`}
            onClick={() => onChange(o.key)}
            aria-pressed={value === o.key}
          />
        ))}
        <div className="triple-rail" aria-hidden />
      </div>

      <div className="triple-labels">
        {opts.map((o) => (
          <div key={o.key} className="triple-label">
            <div>{o.label}</div>
            {o.sub && <div className="wiz-sub">{o.sub}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
function SegTabs({ value, onChange }) {
  return (
    <div className="seg" role="tablist" aria-label="Income Period">
      <button
        type="button"
        className={`seg-btn ${value === "monthly" ? "on" : ""}`}
        role="tab"
        aria-selected={value === "monthly"}
        onClick={() => onChange("monthly")}
      >
        Monthly
      </button>
      <button
        type="button"
        className={`seg-btn ${value === "annually" ? "on" : ""}`}
        role="tab"
        aria-selected={value === "annually"}
        onClick={() => onChange("annually")}
      >
        Annually
      </button>
    </div>
  );
}

/* ---------- “edit cards” used in income/spend/debt/assets screens ---------- */
function EditCard({ title, fields = [], placeholder, value, onChange }) {
  // value shape: { items: string[], amounts: { [name]: number }, note: string, editMode: boolean }
  const makeInitial = React.useCallback(() => ({
    items: fields,
    amounts: Object.fromEntries(fields.map((n) => [n, 0])),
    note: "",
    editMode: true,
  }), [fields]);

  const v = value ?? makeInitial();

  const [items, setItems]     = useState(v.items);
  const [amounts, setAmounts] = useState(v.amounts);
  const [note, setNote]       = useState(v.note);
  const [editMode, setEdit]   = useState(v.editMode ?? true);
  const [tag, setTag]         = useState("");

  // if parent value changes (coming back to a step), sync local state
  React.useEffect(() => {
    setItems(v.items ?? []);
    setAmounts(v.amounts ?? {});
    setNote(v.note ?? "");
    setEdit(v.editMode ?? true);
  }, [v.items, v.amounts, v.note, v.editMode]);

  const disabled = !editMode;

  const emit = (next = {}) => {
    const out = {
      title,
      items,
      amounts,
      note,
      editMode,
      ...next,
    };
    onChange?.(out);
  };

  const commitTag = (text) => {
    const t = text.trim();
    if (!t) return;
    if (items.some((x) => x.toLowerCase() === t.toLowerCase())) { setTag(""); return; }
    const nextItems = [...items, t];
    const nextAmts  = { ...amounts, [t]: 0 };
    setItems(nextItems);
    setAmounts(nextAmts);
    setTag("");
    emit({ items: nextItems, amounts: nextAmts });
  };

  const onTagKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commitTag(tag);
    } else if (e.key === "Backspace" && !tag && items.length && editMode) {
      removeItem(items[items.length - 1]);
    }
  };

  const removeItem = (name) => {
    const nextItems = items.filter((i) => i !== name);
    const { [name]: _rm, ...rest } = amounts;
    setItems(nextItems);
    setAmounts(rest);
    emit({ items: nextItems, amounts: rest });
  };

  const onAmt = (name, v) => {
  const next = { ...amounts, [name]: v };   // keep string while editing
  setAmounts(next);
  emit({ amounts: next });
};


  const done = () => {
    setEdit(false);
    emit({ editMode: false });
  };

  return (
    <div className={`wiz-card ${!editMode ? "view-mode" : ""}`}>
      <div className="wiz-card-hd">
        <div className="wiz-card-title">{title}</div>
        <button
          className="edit"
          type="button"
          onClick={() => { const nv = !editMode; setEdit(nv); emit({ editMode: nv }); }}
          aria-label="edit"
        >
          ✎
        </button>
      </div>

      {items.map((name) => (
        <Line
          key={name}
          label={name}
          disabled={disabled}
          value={amounts[name]}
          onChange={(val) => onAmt(name, val)}
        />
      ))}

      <div className="note">
        <div className="chips">
          {items.map((name) => (
            <span key={name} className="chip">
              {name}
              {editMode && (
                <button
                  className="chip-x"
                  aria-label={`remove ${name}`}
                  type="button"
                  onClick={() => removeItem(name)}
                >
                  ×
                </button>
              )}
            </span>
          ))}

          {editMode && (
  <input
    className="tag-input"
    placeholder="Type other income sources… (press Enter)"
    aria-label={`Add ${title} item`}
    value={tag}
    onChange={(e) => setTag(e.target.value)}
    onKeyDown={onTagKeyDown}
    onBlur={() => commitTag(tag)}
    spellCheck="false"
  />
)}

        </div>

        <textarea
          className="note-ta"
          placeholder={placeholder ?? `Type Other ${title}…`}
          value={note}
          onChange={(e) => { setNote(e.target.value); emit({ note: e.target.value }); }}
          disabled={disabled}
        />
      </div>

      {editMode && (
        <div className="card-actions">
          <button className="btn-done" type="button" onClick={done}>Done</button>
        </div>
      )}
    </div>
  );
}


/* ---------- Job tags input (chips) ---------- */
function JobTagsInput({ value = [], onChange, initial = [] }) {
  // prefer the controlled `value`, but keep `initial` for first mount compatibility
  const [tags, setTags] = React.useState(value.length ? value : initial);
  const [val, setVal] = React.useState("");

  // keep local chips in sync when caller passes a stored value (e.g., when user clicks Back)
  React.useEffect(() => {
    setTags(value);
  }, [value]);


  const commit = (text) => {
    const t = text.trim();
    if (!t) return;
    // de-dupe (case-insensitive)
    const exists = tags.some((x) => x.toLowerCase() === t.toLowerCase());
    if (exists) return setVal("");
    const next = [...tags, t];
    setTags(next);
    onChange?.(next);
    setVal("");
  };

  const removeAt = (i) => {
    const next = tags.filter((_, idx) => idx !== i);
    setTags(next);
    onChange?.(next);
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commit(val);
    } else if (e.key === "Backspace" && !val && tags.length) {
      // backspace on empty input removes the last chip
      removeAt(tags.length - 1);
    }
  };

  return (
    <div className="wiz-block">
      <h2 className="wiz-q">Enter Your Job Title:</h2>

      <div className="tags-input">
        {tags.map((t, i) => (
          <span key={i} className="tag">
            {t}
            <button
              type="button"
              className="tag-x"
              aria-label={`remove ${t}`}
              onClick={() => removeAt(i)}
            >
              ×
            </button>
          </span>
        ))}

        <input
          className="tags-text under"
          placeholder="Type a job and press Enter"
value={val}

          onChange={(e) => setVal(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={() => commit(val)}        // optional: add chip on blur
          spellCheck="false"
        />
      </div>
    </div>
  );
}

/* ---------- MAIN ---------- */
export default function Onboarding() {
  const navigate = useNavigate();

  // Flat list of questions …
const questions = useMemo(() => ([
  // STEP 1 — DOB (first)
  {
    step: 1,
    render: (val, setVal) => (
      <>
        <h1 className="wiz-h1">Step 1</h1>
        <DOBField value={val} onChange={setVal} />

      </>
    ),
  },

  // STEP 1 — Job titles as chips (second)
  {
  step: 1,
  render: (val, setVal) => (
    <>
      <h1 className="wiz-h1">Step 1</h1>
      <JobTagsInput
        value={Array.isArray(val) ? val : []}   // persist chips across Next/Back
        onChange={setVal}
      />
    </>
  ),
},


  // STEP 1 — rest of your Step 1 questions
  {
    step: 1,
    render: (val, setVal) => (
      <>
        <h1 className="wiz-h1">Step 1</h1>
        <TripleChoice
          question="How secure is your current career?"
          left="Stable" mid="Moderate" right="Volatile"
          value={val} onChange={setVal} />
      </>
    ),
  },
  {
    step: 1,
    render: (val, setVal) => (
      <>
        <h1 className="wiz-h1">Step 1</h1>
        <TripleChoice
          question="How much do you expect your career to grow?"
          left="Low" mid="Medium" right="High"
          value={val} onChange={setVal} />
      </>
    ),
  },

{
  step: 2,
  render: (val, setVal) => {
    const makeInit = (fields) => ({
      items: fields,
      amounts: Object.fromEntries(fields.map((n) => [n, ""])),
      note: "",
      editMode: true,
    });

    const defaultFields = ["Primary Income", "Secondary Income"];

    // derive current state from val, or create it once
    const state = val ?? {
      active: "monthly",
      monthly: makeInit(defaultFields),
      annually: makeInit(defaultFields),
    };

    // writers that update the single source of truth (answers[qIndex])
    const setActiveTab = (tab) => setVal({ ...state, active: tab });
    const setPart = (key, data) => setVal({ ...state, [key]: data });

    const actKey   = state.active === "annually" ? "annually" : "monthly";
    const actValue = state[actKey];

    return (
      <>
        <h1 className="wiz-h1">Step 2</h1>
        <h2 className="wiz-h2">What’s Your Income Outlook?</h2>

        <SegTabs value={state.active} onChange={setActiveTab} />

        <div className="wiz-narrow">

 <EditCard
  title={state.active === "monthly" ? "Monthly" : "Annually"}
  fields={defaultFields}
  value={actValue}
  placeholder=""
  onChange={(data) => setPart(actKey, data)}
/>

</div>

      </>
    );
  },
},

    {
      step: 2,
      render: (val, setVal) => (
        <>
          <h1 className="wiz-h1">Step 2</h1>
          <TripleChoice
            question="How Stable Is Your Income?"
            left="Stable" mid="Fluctuating" right="Seasonal"
            value={val} onChange={setVal} />
        </>
      ),
    },

    // STEP 3 – Spending
    {
  step: 3,
  render: (val, setVal) => {
    const makeInit = (fields) => ({
      items: fields,
      amounts: Object.fromEntries(fields.map((n) => [n, ""])),
      note: "",
      editMode: true,
    });

    const defaultFields = ["Rent", "Food", "Utilities", "Transport"];

    const state = val ?? {
      active: "monthly",
      monthly: makeInit(defaultFields),
      annually: makeInit(defaultFields),
    };

    const setActiveTab = (tab) => setVal({ ...state, active: tab });
    const setPart = (key, data) => setVal({ ...state, [key]: data });

    const actKey = state.active === "annually" ? "annually" : "monthly";
    const actValue = state[actKey];

    return (
      <>
        <h1 className="wiz-h1">Step 3</h1>
        <h2 className="wiz-h2">What Do You Usually Spend On?</h2>

        <SegTabs value={state.active} onChange={setActiveTab} />

        <div className="wiz-narrow">
          <EditCard
            title={state.active === "monthly" ? "Monthly" : "Annually"}
            fields={defaultFields}
            value={actValue}
            placeholder=""
            onChange={(data) => setPart(actKey, data)}
          />
        </div>
      </>
    );
  },
},


    // STEP 4 – Debts
    {
  step: 4,
  render: (val, setVal) => {
    const makeInit = (fields) => ({
      items: fields,
      amounts: Object.fromEntries(fields.map((n) => [n, ""])),
      note: "",
      editMode: true,
    });

    const defaultFields = ["Liabilities", "Loans", "Credit Card", "Mortgages"];

    const state = val ?? {
      active: "monthly",
      monthly: makeInit(defaultFields),
      annually: makeInit(defaultFields),
    };

    const setActiveTab = (tab) => setVal({ ...state, active: tab });
    const setPart = (key, data) => setVal({ ...state, [key]: data });

    const actKey = state.active === "annually" ? "annually" : "monthly";
    const actValue = state[actKey];

    return (
      <>
        <h1 className="wiz-h1">Step 4</h1>
        <h2 className="wiz-h2">Do you have any Debts or Dues?</h2>

        <SegTabs value={state.active} onChange={setActiveTab} />

        <div className="wiz-narrow">
          <EditCard
            title={state.active === "monthly" ? "Monthly" : "Annually"}
            fields={defaultFields}
            value={actValue}
            placeholder=""
            onChange={(data) => setPart(actKey, data)}
          />
        </div>
      </>
    );
  },
},

    // STEP 5 – Stocks + Assets
   {
  step: 5,
  render: (val, setVal) => {
    const defaultFields = ["Stock 1", "Stock 2"];

    const state = val ?? {
      active: "monthly",
      monthly: { items: defaultFields, amounts: {}, note: "", editMode: true },
      annually: { items: defaultFields, amounts: {}, note: "", editMode: true },
    };

    const setActiveTab = (tab) => setVal({ ...state, active: tab });
    const setPart = (key, data) => setVal({ ...state, [key]: data });

    const actKey = state.active === "annually" ? "annually" : "monthly";
    const actValue = state[actKey];

    return (
      <>
        <h1 className="wiz-h1">Step 5</h1>
        <h2 className="wiz-h2">Which stocks/ETFs do you hold?</h2>

        <SegTabs value={state.active} onChange={setActiveTab} />

        <div className="wiz-narrow">
          <EditCard
            title={state.active === "monthly" ? "Monthly" : "Annually"}
            fields={defaultFields}
            value={actValue}
            placeholder=""
            onChange={(data) => setPart(actKey, data)}
          />
        </div>
      </>
    );
  },
},

  {
  step: 5,
  render: (val, setVal) => {
    const defaultFields = ["Equity", "Debt", "Real Estate", "Gold", "Alternatives"];

    const state = val ?? {
      active: "monthly",
      monthly: { items: defaultFields, amounts: {}, note: "", editMode: true },
      annually: { items: defaultFields, amounts: {}, note: "", editMode: true },
    };

    const setActiveTab = (tab) => setVal({ ...state, active: tab });
    const setPart = (key, data) => setVal({ ...state, [key]: data });

    const actKey = state.active === "annually" ? "annually" : "monthly";
    const actValue = state[actKey];

    return (
      <>
        <h1 className="wiz-h1">Step 5</h1>
        <h2 className="wiz-h2">What Assets Do You Hold?</h2>

        <SegTabs value={state.active} onChange={setActiveTab} />

        <div className="wiz-narrow">
          <EditCard
            title={state.active === "monthly" ? "Monthly" : "Annually"}
            fields={defaultFields}
            value={actValue}
            placeholder=""
            onChange={(data) => setPart(actKey, data)}
          />
        </div>
      </>
    );
  },
},


    // STEP 6 – Risk + link
    {
      step: 6,
      render: (val, setVal) => (
        <>
          <h1 className="wiz-h1">Step 6</h1>
          <h2 className="wiz-h2">What Is Your Risk Tolerance?</h2>
          <TripleChoice
            question=""
            left="Low" mid="Medium" right="High"
            value={val} onChange={setVal} />
        </>
      ),
    },
    {
      step: 6,
      render: () => (
        <>
          <h1 className="wiz-h1">Step 6</h1>
          <div className="wiz-block" style={{ textAlign: "center" }}>
  <h2 className="wiz-h2" style={{ marginTop: 10 }}>Link Live With Bank Account:</h2>
  <button className="btn btn-sm" type="button">Link Bank Account</button>
  <p style={{ maxWidth: 560, margin: "10px auto 0" }}>
    Link your bank securely—read-only, encrypted access; Batua can’t move your money.
  </p>
</div>

        </>
      ),
    },
  ]), []);

  // index of the active question
  const [qIndex, setQIndex] = useState(0);
  // local 3-choice values (stored by qIndex)
  const [answers, setAnswers] = useState({});

  const stepActive = questions[qIndex]?.step ?? 1;

 const body = useMemo(() => {
  const q = questions[qIndex];
  if (!q) return null;
  const v = answers[qIndex];                 // ← no global default here
  const setV = (nv) => setAnswers((a) => ({ ...a, [qIndex]: nv }));
  return q.render(v, setV);
}, [qIndex, answers, questions]);



  const atStart = qIndex === 0;
  const atEnd = qIndex === questions.length - 1;

  return (
    <section className="wizard feature">
      <div className="nav-spacer" aria-hidden />
      <h1 className="wizard-title">Build Your Monthly Money Plan</h1>
      <Stepper active={stepActive} />

      <div className="wizard-body">
        {body}

        {/* Buttons are now placed right under the question (fixed position within the block) */}
        <div className="wizard-buttons">
  {!atStart && (
    <button
      className="wiz-back-link"
      onClick={() => setQIndex((i) => Math.max(0, i - 1))}
    >
      back
    </button>
  )}
  <button
  className="wiz-next-fixed"
  onClick={() =>
    (atEnd ? navigate("/your-batua")
           : setQIndex((i) => Math.min(questions.length - 1, i + 1)))
  }
  aria-label="next"
  title="next"
>

    <span>Next</span> <span className="arrow">›</span>
  </button>
</div>

      </div>
    </section>
  );
}
