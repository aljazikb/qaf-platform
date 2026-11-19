import { useRef, useState } from "react";
import { useApp } from "../AppContext.js";
import { Button, Eyebrow, Note, fieldInput, fieldLabel } from "./ui.jsx";

const BRAND_FIELDS = [
  ["name", "اسم العلامة", "مثال: لوما"],
  ["description", "النشاط والطابع العام", "مثال: علامة عطور بهوية راقية"],
  ["personality", "شخصية العلامة", "مثال: راقية، هادئة، معاصرة"],
  ["style", "الأسلوب البصري", "مثال: بسيط وأنيق، بألوان محايدة"],
];

/** «تعديل الهوية» button and the dialog it opens; the saved brand feeds the ideas and checker pages. */
export default function EditIdentityButton() {
  const { brand, setBrand, toast } = useApp();
  const [draft, setDraft] = useState(brand);
  const [fileName, setFileName] = useState("");
  const dialogRef = useRef(null);

  const open = () => {
    setDraft(brand);
    setFileName("");
    dialogRef.current.showModal();
  };

  return (
    <>
      <Button variant="ghost" onClick={open}>تعديل الهوية</Button>
      <dialog
        ref={dialogRef}
        aria-labelledby="identity-dialog-title"
        className="m-auto w-[calc(100%-32px)] max-w-[620px] rounded-brand-sm border border-line p-6 shadow-[0_20px_80px_rgba(23,27,48,.25)] sm:rounded-brand"
      >
        <form
          className="grid gap-4 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            setBrand(draft);
            dialogRef.current.close();
            toast("تم حفظ هوية علامتك");
          }}
        >
          <div className="col-span-full">
            <Eyebrow>هوية علامتك</Eyebrow>
            <h2 id="identity-dialog-title" className="text-xl">تعديل الهوية</h2>
            <p className="mt-1 text-[13px] text-muted">تستخدم قاف هذه الهوية في اكتشاف الأفكار وفحص المحتوى.</p>
          </div>
          {BRAND_FIELDS.map(([key, label, placeholder]) => (
            <label key={key} className={fieldLabel}>
              {label}
              <input
                className={fieldInput}
                required
                maxLength={80}
                placeholder={placeholder}
                value={draft[key]}
                onChange={(e) => setDraft({ ...draft, [key]: e.target.value })}
              />
            </label>
          ))}
          <label className="col-span-full flex cursor-pointer flex-col items-center gap-1 rounded-brand-sm border-2 border-dashed border-[#8fc9cf] bg-[#f5fbfb] p-5 text-center transition-colors hover:border-green hover:bg-[#e0f2f3]">
            <span className="text-2xl text-green" aria-hidden="true">⇧</span>
            <strong className="text-sm text-navy">ارفع دليل الهوية (اختياري)</strong>
            <small className="text-muted">{fileName || "PDF · PNG · JPG"}</small>
            <input
              type="file"
              accept=".pdf,image/png,image/jpeg"
              className="sr-only"
              onChange={(e) => setFileName(e.target.files[0]?.name || "")}
            />
          </label>
          <Note className="col-span-full mt-0">✦ نموذج تجريبي: تُحفظ الهوية كما أدخلتها على هذا الجهاز، ويتطلب التحليل الفعلي لملف الهوية ربط المنصة بخدمة ذكاء اصطناعي.</Note>
          <div className="col-span-full flex flex-wrap gap-2.5">
            <Button type="submit">حفظ الهوية</Button>
            <Button variant="ghost" onClick={() => dialogRef.current.close()}>إلغاء</Button>
          </div>
        </form>
      </dialog>
    </>
  );
}
