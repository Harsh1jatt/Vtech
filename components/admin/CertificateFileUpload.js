"use client";

import { useEffect, useRef, useState } from "react";
import { FileText, Image as ImageIcon, Upload } from "lucide-react";
import styles from "./CertificateFileUpload.module.css";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ["application/pdf", "image/jpeg", "image/png"];

function formatSize(bytes) {
  if (!bytes) return "Size unavailable";
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export default function CertificateFileUpload({ value, onChange, error, required = false }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(value?.previewUrl || null);

  useEffect(() => () => {
    if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const selectFile = (file) => {
    if (!file) return;
    if (!ACCEPTED_TYPES.includes(file.type)) {
      onChange(null, "Certificate file must be a PDF, JPG or PNG.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      onChange(null, "Certificate file must be smaller than 5 MB.");
      return;
    }
    if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    const nextPreviewUrl = URL.createObjectURL(file);
    setPreviewUrl(nextPreviewUrl);
    onChange({ name: file.name, type: file.type, size: file.size, previewUrl: nextPreviewUrl }, "");
  };

  const removeFile = () => {
    if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    onChange(null, "");
    if (inputRef.current) inputRef.current.value = "";
  };

  const openPreview = () => {
    if (previewUrl) window.open(previewUrl, "_blank", "noopener,noreferrer");
  };

  return <div className={styles.uploadField}>
    <label className={styles.uploadLabel} htmlFor="certificate-file">Certificate File {required && <span className={styles.required}>*</span>}</label>
    {!value ? <button type="button" className={`${styles.uploadDropzone} ${dragging ? styles.uploadDragging : ""}`} onClick={() => inputRef.current?.click()} onDragOver={(event) => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={(event) => { event.preventDefault(); setDragging(false); selectFile(event.dataTransfer.files[0]); }}><Upload size={23} /><strong>Upload certificate</strong><span>Drag &amp; drop your certificate or click to browse</span><small>PDF, JPG or PNG · Maximum 5 MB</small><span className={styles.chooseFile}>Choose File</span></button> : <div className={styles.filePreviewCard}>{value.type === "application/pdf" ? <FileText size={24} /> : <ImageIcon size={24} />}<div className={styles.filePreviewInfo}><strong>{value.name}</strong><span>{value.type === "application/pdf" ? "PDF" : "Image"} · {formatSize(value.size)}</span></div><div className={styles.fileActions}><button type="button" className={styles.fileAction} onClick={openPreview} disabled={!previewUrl}>Preview</button><button type="button" className={styles.fileAction} onClick={removeFile}>Remove</button></div></div>}
    <input ref={inputRef} id="certificate-file" className={styles.fileInput} type="file" accept="application/pdf,image/jpeg,image/png" onChange={(event) => selectFile(event.target.files[0])} />
    {value && value.type?.startsWith("image/") && previewUrl && <img className={styles.imagePreview} src={previewUrl} alt={`Preview of ${value.name}`} />}
    {error && <span className={styles.error} role="alert">{error}</span>}
  </div>;
}
