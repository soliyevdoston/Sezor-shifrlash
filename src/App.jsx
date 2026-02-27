import { useEffect, useMemo, useRef, useState } from "react";

const clampShift = (value) => {
  const asNumber = Number(value);
  if (Number.isNaN(asNumber)) return 0;
  return Math.min(100, Math.max(0, asNumber));
};

const createStep = (id, type = "caesar") => ({
  id,
  type,
  mode: "encode",
  shift: 3,
  preserveCase: true
});

const operationCatalog = [
  {
    groupId: "transform",
    items: [
      { id: "replace" },
      { id: "reverse" },
      { id: "case-transform" },
      { id: "numeral-system" },
      { id: "bitwise" }
    ]
  },
  {
    groupId: "alphabets",
    items: [
      { id: "morse" },
      { id: "spelling" }
    ]
  },
  {
    groupId: "ciphers",
    items: [
      { id: "enigma" },
      { id: "caesar", available: true },
      { id: "affine" },
      { id: "rot13" },
      { id: "a1z26" },
      { id: "vigenere" },
      { id: "bacon" },
      { id: "substitution" },
      { id: "rail-fence" }
    ]
  },
  {
    groupId: "encoding",
    items: [
      { id: "base32" },
      { id: "base64" },
      { id: "ascii85" },
      { id: "baudot" },
      { id: "unicode" },
      { id: "url-encoding" },
      { id: "punycode" }
    ]
  },
  {
    groupId: "modern-cryptography",
    items: [
      { id: "block" },
      { id: "rc4" },
      { id: "hash" },
      { id: "hmac" }
    ]
  }
];

const TRANSLATIONS = {
  uz: {
    htmlLang: "uz",
    pageTitle: "Sezor Cipher Studio",
    eyebrow: "Shifr maydoni",
    heroTitle: "Sezor Cipher Studio",
    heroSubtitle:
      "Cryptii uslubidagi zanjirli ish jarayoni: Sezar shifrining bir nechta bosqichini ketma-ket qo'llang va yakuniy natijani real vaqtda ko'ring.",
    labels: {
      language: "Til",
      input: "Kirish matni",
      pipeline: "Transform zanjiri",
      output: "Natija",
      mode: "Rejim",
      shift: "Siljitish",
      preserveCase: "Katta-kichik harflarni saqlash"
    },
    placeholders: {
      input: "Masalan: Salom Dunyo",
      output: "Natija shu yerda chiqadi"
    },
    units: {
      chars: "belgi",
      steps: "bosqich"
    },
    pipelineHint: "Kirish -> Bosqich 1 -> ... -> Chiqish",
    stepLabel: "Bosqich",
    buttons: {
      up: "Yuqoriga",
      down: "Pastga",
      remove: "O'chirish",
      addOperation: "+ Operatsiya qo'shish",
      resetPipeline: "Zanjirni tiklash",
      clearAll: "Hammasini tozalash",
      copy: "Nusxa olish",
      close: "Yopish"
    },
    modes: {
      encode: "Shifrlash",
      decode: "Deshifrlash"
    },
    status: {
      idle: "",
      noInput: "Nusxa olish uchun kirish matni yo'q.",
      noOutput: "Nusxa olish uchun natija yo'q.",
      copied: "Matn nusxalandi.",
      denied: "Clipboard ruxsati topilmadi."
    },
    library: {
      title: "Operatsiyalar kutubxonasi",
      noteBefore: "Cryptii uslubida: hozir faol modul faqat ",
      noteAfter: ". Qolganlari keyingi bosqichda ulanadi.",
      ariaLabel: "Operatsiyalar kutubxonasi"
    },
    categories: {
      transform: "Transformatsiya",
      alphabets: "Alifbolar",
      ciphers: "Shifrlar",
      encoding: "Kodlash",
      "modern-cryptography": "Zamonaviy kriptografiya"
    },
    operations: {
      replace: "Almashtirish",
      reverse: "Teskari qilish",
      "case-transform": "Registrni o'zgartirish",
      "numeral-system": "Sanoq tizimi",
      bitwise: "Bitli amal",
      morse: "Morze kodi",
      spelling: "Fonetik alifbo",
      enigma: "Enigma mashinasi",
      caesar: "Sezar shifri",
      affine: "Affine shifri",
      rot13: "ROT13",
      a1z26: "A1Z26",
      vigenere: "Vigenere shifri",
      bacon: "Bacon shifri",
      substitution: "Alifbo almashtirish",
      "rail-fence": "Rail fence shifri",
      base32: "Base32",
      base64: "Base64",
      ascii85: "Ascii85",
      baudot: "Baudot kodi",
      unicode: "Unicode kod nuqtalari",
      "url-encoding": "URL kodlash",
      punycode: "Punycode",
      block: "Blokli shifr",
      rc4: "RC4",
      hash: "Xesh funksiyasi",
      hmac: "HMAC"
    },
    languages: {
      uz: "O'zbekcha",
      ru: "Ruscha",
      en: "Inglizcha"
    }
  },
  ru: {
    htmlLang: "ru",
    pageTitle: "Sezor Cipher Studio",
    eyebrow: "Шифровальная зона",
    heroTitle: "Sezor Cipher Studio",
    heroSubtitle:
      "Цепочка преобразований в стиле Cryptii: применяйте несколько шагов шифра Цезаря подряд и сразу получайте финальный результат.",
    labels: {
      language: "Язык",
      input: "Входной текст",
      pipeline: "Цепочка преобразований",
      output: "Результат",
      mode: "Режим",
      shift: "Сдвиг",
      preserveCase: "Сохранять регистр символов"
    },
    placeholders: {
      input: "Например: Привет Мир",
      output: "Здесь появится результат"
    },
    units: {
      chars: "символов",
      steps: "шагов"
    },
    pipelineHint: "Ввод -> Шаг 1 -> ... -> Вывод",
    stepLabel: "Шаг",
    buttons: {
      up: "Вверх",
      down: "Вниз",
      remove: "Удалить",
      addOperation: "+ Добавить операцию",
      resetPipeline: "Сбросить цепочку",
      clearAll: "Очистить все",
      copy: "Копировать",
      close: "Закрыть"
    },
    modes: {
      encode: "Шифровать",
      decode: "Расшифровать"
    },
    status: {
      idle: "",
      noInput: "Нет входного текста для копирования.",
      noOutput: "Нет результата для копирования.",
      copied: "Текст скопирован.",
      denied: "Нет доступа к буферу обмена."
    },
    library: {
      title: "Библиотека операций",
      noteBefore: "В стиле Cryptii сейчас активен только модуль ",
      noteAfter: ". Остальные модули добавим на следующем этапе.",
      ariaLabel: "Библиотека операций"
    },
    categories: {
      transform: "Преобразование",
      alphabets: "Алфавиты",
      ciphers: "Шифры",
      encoding: "Кодирование",
      "modern-cryptography": "Современная криптография"
    },
    operations: {
      replace: "Замена",
      reverse: "Реверс",
      "case-transform": "Изменение регистра",
      "numeral-system": "Система счисления",
      bitwise: "Побитовая операция",
      morse: "Азбука Морзе",
      spelling: "Фонетический алфавит",
      enigma: "Машина Энигма",
      caesar: "Шифр Цезаря",
      affine: "Аффинный шифр",
      rot13: "ROT13",
      a1z26: "A1Z26",
      vigenere: "Шифр Виженера",
      bacon: "Шифр Бэкона",
      substitution: "Алфавитная подстановка",
      "rail-fence": "Шифр железнодорожной решетки",
      base32: "Base32",
      base64: "Base64",
      ascii85: "Ascii85",
      baudot: "Код Бодо",
      unicode: "Кодовые точки Unicode",
      "url-encoding": "URL кодирование",
      punycode: "Punycode",
      block: "Блочный шифр",
      rc4: "RC4",
      hash: "Хеш функция",
      hmac: "HMAC"
    },
    languages: {
      uz: "Узбекский",
      ru: "Русский",
      en: "Английский"
    }
  },
  en: {
    htmlLang: "en",
    pageTitle: "Sezor Cipher Studio",
    eyebrow: "Cipher workspace",
    heroTitle: "Sezor Cipher Studio",
    heroSubtitle:
      "Cryptii-style pipe workflow: chain multiple Caesar steps and see the final output in real time.",
    labels: {
      language: "Language",
      input: "Input text",
      pipeline: "Transform pipeline",
      output: "Output",
      mode: "Mode",
      shift: "Shift",
      preserveCase: "Preserve letter case"
    },
    placeholders: {
      input: "Example: Hello World",
      output: "Output appears here"
    },
    units: {
      chars: "chars",
      steps: "steps"
    },
    pipelineHint: "Input -> Step 1 -> ... -> Output",
    stepLabel: "Step",
    buttons: {
      up: "Move up",
      down: "Move down",
      remove: "Remove",
      addOperation: "+ Add operation",
      resetPipeline: "Reset pipeline",
      clearAll: "Clear all",
      copy: "Copy output",
      close: "Close"
    },
    modes: {
      encode: "Encode",
      decode: "Decode"
    },
    status: {
      idle: "",
      noInput: "No input text to copy.",
      noOutput: "No output to copy.",
      copied: "Text copied.",
      denied: "Clipboard permission is unavailable."
    },
    library: {
      title: "Operation library",
      noteBefore: "In Cryptii style, the only active module right now is ",
      noteAfter: ". Other modules will be added in the next phase.",
      ariaLabel: "Operation library"
    },
    categories: {
      transform: "Transform",
      alphabets: "Alphabets",
      ciphers: "Ciphers",
      encoding: "Encoding",
      "modern-cryptography": "Modern cryptography"
    },
    operations: {
      replace: "Replace",
      reverse: "Reverse",
      "case-transform": "Case transform",
      "numeral-system": "Numeral system",
      bitwise: "Bitwise operation",
      morse: "Morse code",
      spelling: "Spelling alphabet",
      enigma: "Enigma machine",
      caesar: "Caesar cipher",
      affine: "Affine cipher",
      rot13: "ROT13",
      a1z26: "A1Z26",
      vigenere: "Vigenere cipher",
      bacon: "Bacon cipher",
      substitution: "Alphabetical substitution",
      "rail-fence": "Rail fence cipher",
      base32: "Base32",
      base64: "Base64",
      ascii85: "Ascii85",
      baudot: "Baudot code",
      unicode: "Unicode code points",
      "url-encoding": "URL encoding",
      punycode: "Punycode",
      block: "Block cipher",
      rc4: "RC4",
      hash: "Hash function",
      hmac: "HMAC"
    },
    languages: {
      uz: "Uzbek",
      ru: "Russian",
      en: "English"
    }
  }
};

const shiftLetter = (char, shift, preserveCase) => {
  const lower = char.toLowerCase();
  const code = lower.charCodeAt(0);
  if (code < 97 || code > 122) return char;

  const shifted = String.fromCharCode(((code - 97 + shift) % 26) + 97);
  if (!preserveCase) return shifted;

  return char >= "A" && char <= "Z" ? shifted.toUpperCase() : shifted;
};

const caesarCipher = (text, shift, preserveCase) =>
  text
    .split("")
    .map((char) => shiftLetter(char, shift, preserveCase))
    .join("");

const applyStep = (text, step) => {
  if (step.type !== "caesar") return text;

  const normalizedShift = ((step.shift % 26) + 26) % 26;
  const effectiveShift =
    step.mode === "encode"
      ? normalizedShift
      : (26 - normalizedShift) % 26;

  return caesarCipher(text, effectiveShift, step.preserveCase);
};

export default function App() {
  const [language, setLanguage] = useState("uz");
  const [inputText, setInputText] = useState("");
  const [steps, setSteps] = useState([createStep(1)]);
  const [copyInputStatus, setCopyInputStatus] = useState("idle");
  const [copyOutputStatus, setCopyOutputStatus] = useState("idle");
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [insertPosition, setInsertPosition] = useState(0);
  const nextId = useRef(2);
  const t = TRANSLATIONS[language];

  useEffect(() => {
    document.documentElement.lang = t.htmlLang;
    document.title = t.pageTitle;
  }, [t]);

  const operationLabel = (operationId) => t.operations[operationId] ?? operationId;
  const countText = (value, unit) => `${value} ${unit}`;

  const outputText = useMemo(
    () => steps.reduce((transformed, step) => applyStep(transformed, step), inputText),
    [inputText, steps]
  );

  const stageOutputs = useMemo(() => {
    let transformed = inputText;
    return steps.map((step) => {
      transformed = applyStep(transformed, step);
      return transformed;
    });
  }, [inputText, steps]);

  const updateStep = (id, patch) => {
    setSteps((current) =>
      current.map((step) => (step.id === id ? { ...step, ...patch } : step))
    );
    setCopyInputStatus("idle");
    setCopyOutputStatus("idle");
  };

  const openLibraryAt = (position) => {
    setInsertPosition(position);
    setIsLibraryOpen(true);
  };

  const addOperation = (operationId) => {
    if (operationId !== "caesar") return;

    const id = nextId.current;
    nextId.current += 1;

    setSteps((current) => {
      const safePosition = Math.min(Math.max(insertPosition, 0), current.length);
      const next = [...current];
      next.splice(safePosition, 0, createStep(id, operationId));
      return next;
    });

    setCopyInputStatus("idle");
    setCopyOutputStatus("idle");
    setIsLibraryOpen(false);
  };

  const removeStep = (id) => {
    setSteps((current) => {
      if (current.length <= 1) return [createStep(1)];
      return current.filter((step) => step.id !== id);
    });
    setCopyInputStatus("idle");
    setCopyOutputStatus("idle");
  };

  const moveStep = (id, direction) => {
    setSteps((current) => {
      const index = current.findIndex((step) => step.id === id);
      if (index < 0) return current;

      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= current.length) return current;

      const next = [...current];
      const [moved] = next.splice(index, 1);
      next.splice(targetIndex, 0, moved);
      return next;
    });
    setCopyInputStatus("idle");
    setCopyOutputStatus("idle");
  };

  const resetPipeline = () => {
    setSteps([createStep(1)]);
    nextId.current = 2;
    setCopyInputStatus("idle");
    setCopyOutputStatus("idle");
  };

  const clearAll = () => {
    setInputText("");
    setSteps([createStep(1)]);
    nextId.current = 2;
    setCopyInputStatus("idle");
    setCopyOutputStatus("idle");
  };

  const copyText = async (text, setStatus, emptyKey = "noOutput") => {
    if (!text) {
      setStatus(emptyKey);
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setStatus("copied");
    } catch {
      setStatus("denied");
    }
  };

  return (
    <>
      <div className="background-glow background-glow-a" />
      <div className="background-glow background-glow-b" />

      <main className="app-shell">
        <header className="hero">
          <div className="hero-top">
            <p className="eyebrow">{t.eyebrow}</p>
            <label className="language-switch" htmlFor="languageSelect">
              <span>{t.labels.language}</span>
              <select
                id="languageSelect"
                className="control"
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
              >
                <option value="uz">{t.languages.uz}</option>
                <option value="ru">{t.languages.ru}</option>
                <option value="en">{t.languages.en}</option>
              </select>
            </label>
          </div>
          <h1>{t.heroTitle}</h1>
          <p className="subtitle">{t.heroSubtitle}</p>
        </header>

        <section className="panel-grid">
          <article className="panel input-panel">
            <div className="panel-head">
              <h2>{t.labels.input}</h2>
              <span className="count-tag">{countText(inputText.length, t.units.chars)}</span>
            </div>
            <textarea
              className="text-zone"
              placeholder={t.placeholders.input}
              spellCheck={false}
              value={inputText}
              onChange={(event) => {
                setInputText(event.target.value);
                setCopyInputStatus("idle");
                setCopyOutputStatus("idle");
              }}
            />
            <div className="output-actions">
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => copyText(inputText, setCopyInputStatus, "noInput")}
              >
                {t.buttons.copy}
              </button>
              <span className="status">{t.status[copyInputStatus]}</span>
            </div>
          </article>

          <div className="insert-slot panel-insert-slot">
            <button
              className="insert-btn"
              type="button"
              aria-label={t.buttons.addOperation}
              onClick={() => openLibraryAt(0)}
            >
              +
            </button>
          </div>

          <article className="panel pipeline-panel">
            <div className="panel-head">
              <h2>{t.labels.pipeline}</h2>
              <span className="count-tag">{countText(steps.length, t.units.steps)}</span>
            </div>

            <div className="pipeline-hint">{t.pipelineHint}</div>

            <div className="step-list">
              {steps.map((step, index) => (
                <div key={step.id}>
                  <section className="step-card">
                    <div className="step-head">
                      <strong>
                        {t.stepLabel} {index + 1}: {operationLabel(step.type)}
                      </strong>
                      <span className="count-tag mono">
                        {countText(stageOutputs[index]?.length ?? 0, t.units.chars)}
                      </span>
                    </div>

                    <div className="field-group compact">
                      <label htmlFor={`mode-${step.id}`}>{t.labels.mode}</label>
                      <select
                        id={`mode-${step.id}`}
                        className="control"
                        value={step.mode}
                        onChange={(event) =>
                          updateStep(step.id, { mode: event.target.value })
                        }
                      >
                        <option value="encode">{t.modes.encode}</option>
                        <option value="decode">{t.modes.decode}</option>
                      </select>
                    </div>

                    <div className="field-group compact">
                      <div className="label-row">
                        <label htmlFor={`shift-range-${step.id}`}>{t.labels.shift}</label>
                        <span className="mono">{step.shift}</span>
                      </div>
                      <input
                        id={`shift-range-${step.id}`}
                        type="range"
                        min="0"
                        max="100"
                        value={step.shift}
                        onChange={(event) =>
                          updateStep(step.id, { shift: clampShift(event.target.value) })
                        }
                      />
                      <input
                        className="control mono"
                        type="number"
                        min="0"
                        max="100"
                        value={step.shift}
                        onChange={(event) =>
                          updateStep(step.id, { shift: clampShift(event.target.value) })
                        }
                      />
                    </div>

                    <div className="field-group compact">
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={step.preserveCase}
                          onChange={(event) =>
                            updateStep(step.id, { preserveCase: event.target.checked })
                          }
                        />
                        <span>{t.labels.preserveCase}</span>
                      </label>
                    </div>

                    <div className="step-actions">
                      <button
                        className="btn btn-soft"
                        type="button"
                        onClick={() => moveStep(step.id, "up")}
                        disabled={index === 0}
                      >
                        {t.buttons.up}
                      </button>
                      <button
                        className="btn btn-soft"
                        type="button"
                        onClick={() => moveStep(step.id, "down")}
                        disabled={index === steps.length - 1}
                      >
                        {t.buttons.down}
                      </button>
                      <button
                        className="btn btn-danger"
                        type="button"
                        onClick={() => removeStep(step.id)}
                      >
                        {t.buttons.remove}
                      </button>
                    </div>
                  </section>
                </div>
              ))}
            </div>

            <div className="actions">
              <button className="btn btn-soft" type="button" onClick={resetPipeline}>
                {t.buttons.resetPipeline}
              </button>
              <button className="btn btn-soft" type="button" onClick={clearAll}>
                {t.buttons.clearAll}
              </button>
            </div>
          </article>

          <div className="insert-slot panel-insert-slot">
            <button
              className="insert-btn"
              type="button"
              aria-label={t.buttons.addOperation}
              onClick={() => openLibraryAt(steps.length)}
            >
              +
            </button>
          </div>

          <article className="panel output-panel">
            <div className="panel-head">
              <h2>{t.labels.output}</h2>
              <span className="count-tag">{countText(outputText.length, t.units.chars)}</span>
            </div>
            <textarea
              className="text-zone"
              readOnly
              value={outputText}
              placeholder={t.placeholders.output}
            />
            <div className="output-actions">
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => copyText(outputText, setCopyOutputStatus)}
              >
                {t.buttons.copy}
              </button>
              <span className="status">{t.status[copyOutputStatus]}</span>
            </div>
          </article>
        </section>
      </main>

      {isLibraryOpen ? (
        <div
          className="library-backdrop"
          role="presentation"
          onClick={() => setIsLibraryOpen(false)}
        >
          <section
            className="library-modal"
            role="dialog"
            aria-modal="true"
            aria-label={t.library.ariaLabel}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="library-head">
              <h2>{t.library.title}</h2>
              <button
                className="btn btn-soft"
                type="button"
                onClick={() => setIsLibraryOpen(false)}
              >
                {t.buttons.close}
              </button>
            </div>

            <p className="library-note">
              {t.library.noteBefore}
              <strong>{operationLabel("caesar")}</strong>
              {t.library.noteAfter}
            </p>

            <div className="library-groups">
              {operationCatalog.map((category) => (
                <section key={category.groupId} className="library-group">
                  <h3>{t.categories[category.groupId]}</h3>
                  <div className="operation-grid">
                    {category.items.map((item) => {
                      const isAvailable = Boolean(item.available);
                      return (
                        <button
                          key={item.id}
                          className={`operation-item ${isAvailable ? "is-active" : "is-disabled"}`}
                          type="button"
                          disabled={!isAvailable}
                          onClick={() => addOperation(item.id)}
                        >
                          <span className="dot" />
                          <span>{operationLabel(item.id)}</span>
                        </button>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
