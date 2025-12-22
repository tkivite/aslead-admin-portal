"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { applicationsService } from "@/services/applications.api";
import type { Document, Applicant } from "@/types/applications.types";

interface DocumentsEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  applicantId: number;
  applicationId: number;
  applicantInfo?: Applicant;
  programId: number;
  campusId: number;
  paymentReference?: string;
  initialDocuments?: Document[];
  onDocumentsUpdated?: (docs: Document[]) => void;
}

type LocalDoc = Document & { isNew?: boolean; removed?: boolean };

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export default function DocumentsEditor({
  isOpen,
  onClose,
  onSuccess,
  applicantId,
  initialDocuments,
  onDocumentsUpdated,
}: DocumentsEditorProps) {
  const [docs, setDocs] = useState<LocalDoc[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fetch = React.useCallback(async () => {
    try {
      setLoading(true);
      const existing = await applicationsService.getApplicantDocuments(applicantId);
      setDocs(existing || []);
      return existing || [];
    } catch (err) {
      console.error(err);
      toast.error("Failed to load documents");
      return [] as Document[];
    } finally {
      setLoading(false);
    }
  }, [applicantId]);

  useEffect(() => {
    if (!isOpen) return;
    // If parent passed initial documents via prop, use them and skip fetching
    if (initialDocuments && Array.isArray(initialDocuments)) {
      setDocs(initialDocuments as LocalDoc[]);
      return;
    }

    // Otherwise fetch from API
    fetch();
  }, [isOpen, fetch, initialDocuments]);

  const handleRemoveToggle = (documentId?: number) => {
    setDocs((prev) =>
      prev.map((d) => (d.documentId === documentId ? { ...d, removed: !d.removed } : d))
    );
  };

  const handleAddFile = async (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await fileToBase64(file);
      setDocs((prev) => [
        ...prev,
        {
          documentId: Math.floor(Math.random() * 1000000) * -1,
          documentType: type,
          content: base64,
          isNew: true,
        } as LocalDoc,
      ]);
    } catch (err) {
      console.error(err);
      toast.error("Failed to read file");
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Use document endpoints: add new documents and delete removed ones
      const toAdd = docs.filter((d) => d.isNew && !d.removed);
      const toDelete = docs.filter((d) => d.removed && d.documentId > 0);

      // First, delete server-side documents for those marked removed
      const deletePromises = toDelete.map((d) => applicationsService.deleteDocument(d.documentId));
      const deleteResults = await Promise.allSettled(deletePromises);

      // Determine which deletes succeeded/failed
      const successfulDeletes = toDelete
        .map((d, idx) => ({ doc: d, result: deleteResults[idx] }))
        .filter((x) => x.result.status === "fulfilled")
        .map((x) => x.doc.documentId);

      const failedDeletes = toDelete
        .map((d, idx) => ({ doc: d, result: deleteResults[idx] }))
        .filter((x) => x.result.status === "rejected")
        .map((x) => x.doc.documentId);

      if (failedDeletes.length > 0) {
        console.error("Some document deletions failed:", { failedDeletes });
        toast.warn("Some document deletions failed. Check console for details.");
      }

      // Remove successfully deleted docs from local state, and restore 'removed' flag for failures
      setDocs((prev) => {
        const afterDeletes = prev
          .filter((d) => !successfulDeletes.includes(d.documentId))
          .map((d) => (failedDeletes.includes(d.documentId) ? { ...d, removed: false } : d));

        // Notify parent with current server-backed docs (exclude temp negative IDs)
        if (typeof onDocumentsUpdated === "function") {
          onDocumentsUpdated(afterDeletes.filter((d) => d.documentId > 0).map((d) => ({ ...d })));
        }

        return afterDeletes;
      });


type AddError = {
  doc: (typeof toAdd)[number];
  err: unknown;
};


      // Then, add new documents one by one so we can replace temp docs with server-created docs
      const addErrors: AddError[] = [];
      for (const newDoc of toAdd) {
        try {
          const created = await applicationsService.addApplicantDocument({ applicant: { applicantId }, documentType: newDoc.documentType, content: newDoc.content });

          // Replace the temp doc with the created doc in state and notify parent
          setDocs((prev) => {
            const updated = prev.map((d) => (d.documentId === newDoc.documentId ? { ...created } : d));
            if (typeof onDocumentsUpdated === "function") {
              onDocumentsUpdated(updated.filter((d) => d.documentId > 0).map((d) => ({ ...d })));
            }
            return updated;
          });
        } catch (err) {
          console.error("Failed to add document:", err);
          addErrors.push({ doc: newDoc, err });
        }
      }

      if (addErrors.length > 0) {
        toast.warn("Some document uploads failed. Check console for details.");
      }

      // Build current documents list (exclude any removed flags)
      setDocs((prev) => {
        const current = prev.filter((d) => !d.removed).map((d) => ({ ...d }));
        if (typeof onDocumentsUpdated === "function") {
          onDocumentsUpdated(current.filter((d) => d.documentId > 0).map((d) => ({ ...d })));
        }
        return current;
      });

      toast.success("Documents updated successfully");

      // Close modal and notify parent flow (if caller uses onSuccess to refresh other data)
      if (typeof onSuccess === "function") {
        onSuccess();
      }
      if (typeof onClose === "function") {
        onClose();
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to save document changes");
    } finally {
      setSaving(false);
    }

    
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-500 bg-opacity-75"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative z-10 w-full max-w-2xl p-6 bg-white rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Edit Documents</h3>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {docs.map((d) => (
                    <div key={d.documentId} className={`border rounded p-2 relative ${d.removed ? "opacity-50" : ""}`}>
                      <div className="text-xs font-medium text-gray-700">{d.documentType.replace("_", " ")}</div>
                      <div className="text-xs text-gray-500 mt-1 truncate">Document #{d.documentId}</div>
                      <div className="mt-2">
                        {d.content?.startsWith("JVBERi") || d.documentType.toLowerCase().includes("pdf") ? (
                          <div className="text-xs text-gray-500">PDF</div>
                        ) : (
                          <img src={`data:image/jpeg;base64,${d.content}`} alt={d.documentType} className="w-full h-24 object-cover rounded" />
                        )}
                      </div>
                      <div className="absolute right-2 top-2 flex gap-1">
                        <button
                          onClick={() => handleRemoveToggle(d.documentId)}
                          className="text-red-600 bg-white p-1 rounded-full hover:bg-gray-100"
                          title={d.removed ? "Restore" : "Remove"}
                        >
                          {d.removed ? "Undo" : "Remove"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <label className="flex flex-col text-sm">
                    <span className="text-xs text-gray-600">National ID</span>
                    <input type="file" accept="image/*,application/pdf" onChange={(e) => handleAddFile(e, "NATIONAL_ID")} />
                  </label>
                  <label className="flex flex-col text-sm">
                    <span className="text-xs text-gray-600">Passport Photo</span>
                    <input type="file" accept="image/*" onChange={(e) => handleAddFile(e, "PASSPORT_PHOTO")} />
                  </label>
                  <label className="flex flex-col text-sm">
                    <span className="text-xs text-gray-600">Other Document</span>
                    <input type="file" accept="image/*,application/pdf" onChange={(e) => handleAddFile(e, "OTHER")} />
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button onClick={onClose} className="px-4 py-2 bg-gray-100 rounded">Cancel</button>
                  <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-primary text-white rounded">
                    {saving ? "Saving..." : "Save Documents"}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
