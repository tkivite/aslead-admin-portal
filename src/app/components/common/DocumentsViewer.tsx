"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FileText, /* Download, */ Eye, X, ChevronLeft, ChevronRight } from "lucide-react"
import { applicationsService } from "@/services/applications.api"
import { Document } from "@/types/applications.types"
import Image from "next/image"

interface DocumentsViewerProps {
  applicantId: number
  applicantName: string
}

export default function DocumentsViewer({ applicantId, applicantName }: DocumentsViewerProps) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    fetchDocuments()
  }, [applicantId])

  const fetchDocuments = async () => {
    try {
      setLoading(true)
      const docs = await applicationsService.getApplicantDocuments(applicantId)
      setDocuments(docs)
    } catch (error) {
      console.error("Error fetching documents:", error)
    } finally {
      setLoading(false)
    }
  }

  // Get image data URL - content is already base64 encoded
  const getImageDataUrl = (document: Document): string => {
    const base64Content = document.content

    // Determine MIME type based on document type or content header
    let mimeType = "image/jpeg" // default

    // Check if it's a PDF based on base64 header or document type
    if (document.documentType.toLowerCase().includes("pdf") || base64Content.startsWith("JVBERi")) {
      mimeType = "application/pdf"
    } else if (base64Content.startsWith("iVBORw0KGgo")) {
      mimeType = "image/png"
    } else if (base64Content.startsWith("/9j/")) {
      mimeType = "image/jpeg"
    } else if (base64Content.startsWith("R0lGOD")) {
      mimeType = "image/gif"
    }

    return `data:${mimeType};base64,${base64Content}`
  }

  // Helper function to determine file extension
/*   const getFileExtension = (document: Document): string => {
    const content = document.content

    if (document.documentType.toLowerCase().includes("pdf") || content.startsWith("JVBERi")) {
      return "pdf"
    } else if (content.startsWith("iVBORw0KGgo")) {
      return "png"
    } else if (content.startsWith("/9j/")) {
      return "jpg"
    } else if (content.startsWith("R0lGOD")) {
      return "gif"
    }

    return "jpg" // default
  } */

/*   const downloadDocument = (document: Document) => {
    const dataUrl = getImageDataUrl(document)
    const link = document.createElement("a")
    link.href = dataUrl

    // Create filename based on document type and ID
    const fileExtension = getFileExtension(document)
    link.download = `${document.documentType}_${document.documentId}.${fileExtension}`

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } */

  const openImageModal = (document: Document, index: number) => {
    setSelectedDocument(document)
    setCurrentImageIndex(index)
  }

  const closeModal = () => {
    setSelectedDocument(null)
  }

  const navigateImage = (direction: "prev" | "next") => {
    if (direction === "prev") {
      const prevIndex = currentImageIndex > 0 ? currentImageIndex - 1 : viewableDocuments.length - 1
      setCurrentImageIndex(prevIndex)
      setSelectedDocument(viewableDocuments[prevIndex])
    } else {
      const nextIndex = currentImageIndex < viewableDocuments.length - 1 ? currentImageIndex + 1 : 0
      setCurrentImageIndex(nextIndex)
      setSelectedDocument(viewableDocuments[nextIndex])
    }
  }

  if (loading) {
    return (
      <div className="space-y-2">
        <h4 className="font-medium text-textDark flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Documents
        </h4>
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-tertiary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  // if (!documents || documents.length === 0) {
    if (!documents || !Array.isArray(documents) || documents.length === 0) {

    return (
      <div className="space-y-2">
        <h4 className="font-medium text-textDark flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Documents
        </h4>
        <p className="text-sm text-gray-500">No documents uploaded</p>
      </div>
    )
  }


    const viewableDocuments = documents.filter((doc) => {
      const content = doc.content
      return (
        content.startsWith("iVBORw0KGgo") || // PNG
        content.startsWith("/9j/") || // JPEG
        content.startsWith("R0lGOD") || // GIF
        content.startsWith("JVBERi") || // PDF
        doc.documentType.toLowerCase().includes("image") ||
        doc.documentType.toLowerCase().includes("pdf")
      )
    })
  

  return (
    <>
      <div className="space-y-2">
        <h4 className="font-medium text-textDark flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Documents ({documents.length})
        </h4>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {
            (documents.length > 0)  &&
            documents.map((document, index) => {
              const isImage =
                document.content.startsWith("iVBORw0KGgo") ||
                document.content.startsWith("/9j/") ||
                document.content.startsWith("R0lGOD") ||
                document.documentType.toLowerCase().includes("image")

              const isPdf = document.content.startsWith("JVBERi") || document.documentType.toLowerCase().includes("pdf")

              const isViewable = isImage || isPdf
              const viewableIndex = viewableDocuments.findIndex((doc) => doc.documentId === document.documentId)

              return (
                <motion.div
                  key={document.documentId}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="relative group border border-gray-200 rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow"
                >
                  {isViewable ? (
                    <div className="aspect-square cursor-pointer" onClick={() => openImageModal(document, viewableIndex)}>
                      {isImage ? (
                        <Image
                          src={getImageDataUrl(document) || "/placeholder.svg"}
                          alt={document.documentType}
                          className="w-full h-full object-cover"
                          width={800}
                          height={600}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-red-50">
                          <div className="text-center">
                            <FileText className="h-8 w-8 text-red-600 mx-auto mb-1" />
                            <span className="text-xs text-red-600 font-medium">PDF</span>
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                        <Eye className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-square flex items-center justify-center bg-gray-100">
                      <FileText className="h-8 w-8 text-gray-400" />
                    </div>
                  )}

                  <div className="p-2">
                    <p className="text-xs font-medium text-gray-700 truncate" title={document.documentType}>
                      {document.documentType.replace("_", " ")}
                    </p>
                    <p className="text-xs text-gray-500">Document #{document.documentId}</p>
                  </div>

                  {/*  <button
                  onClick={(e) => {
                    e.stopPropagation()
                    downloadDocument(document)
                  }}
                  className="absolute top-2 right-2 p-1 bg-white bg-opacity-80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-opacity-100"
                  title="Download"
                >
                  <Download className="h-3 w-3 text-gray-600" />
                </button> */}
                </motion.div>
              )
            
            })}
        </div>
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedDocument && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl max-h-full bg-white rounded-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <div>
                  <h3 className="font-medium text-gray-900">{selectedDocument.documentType.replace("_", " ")}</h3>
                  <p className="text-sm text-gray-500">{applicantName}</p>
                </div>
                <div className="flex items-center gap-2">
                  {viewableDocuments.length > 1 && (
                    <>
                      <button onClick={() => navigateImage("prev")} className="p-2 hover:bg-gray-100 rounded-full">
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <span className="text-sm text-gray-500">
                        {currentImageIndex + 1} / {viewableDocuments.length}
                      </span>
                      <button onClick={() => navigateImage("next")} className="p-2 hover:bg-gray-100 rounded-full">
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </>
                  )}
                 {/*  <button
                    onClick={() => downloadDocument(selectedDocument)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                    title="Download"
                  >
                    <Download className="h-4 w-4" />
                  </button> */}
                  <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-full">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Document Content */}
              <div className="p-4">
                {selectedDocument.content.startsWith("JVBERi") ||
                selectedDocument.documentType.toLowerCase().includes("pdf") ? (
                  <div className="w-full h-[70vh]">
                    <iframe
                      src={getImageDataUrl(selectedDocument)}
                      className="w-full h-full border-0"
                      title={selectedDocument.documentType}
                    />
                  </div>
                ) : (
                  <Image
                    src={getImageDataUrl(selectedDocument) || "/placeholder.svg"}
                    alt={selectedDocument.documentType}
                    className="max-w-full max-h-[70vh] object-contain mx-auto"
                    width={800}
                    height={600}
                  />
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
