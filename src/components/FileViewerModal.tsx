import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Copy,
  Download,
  Check,
  Edit3,
  Save,
  FileCode,
  FileText,
  FileBox,
} from 'lucide-react';

export const FileViewerModal: React.FC = () => {
  const { viewingFile, setViewingFile, createItem } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [copied, setCopied] = useState(false);

  if (!viewingFile) return null;

  const { item, fullPath } = viewingFile;
  const content = isEditing ? editedContent : (item.content ?? '/* Archivo binario o sin contenido de texto */');

  const handleStartEdit = () => {
    setEditedContent(item.content ?? '');
    setIsEditing(true);
  };

  const handleSave = () => {
    createItem(item.name, false, editedContent);
    setViewingFile({
      item: { ...item, content: editedContent, size: `${editedContent.length} B` },
      fullPath,
    });
    setIsEditing(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = item.name;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-6 backdrop-blur-md">
      <div className="flex h-full max-h-[85vh] w-full max-w-3xl flex-col rounded-2xl border-2 border-red-500/70 bg-[#101010] shadow-[0_0_30px_rgba(255,26,26,0.35)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950 px-4 py-3">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <FileCode className="h-5 w-5 text-[#ff3333] shrink-0" />
            <div className="truncate">
              <div className="font-mono text-xs font-bold text-white truncate">{item.name}</div>
              <div className="font-mono text-[10px] text-zinc-500 truncate">{fullPath}</div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {item.type !== 'binary' && (
              <>
                {isEditing ? (
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-1 rounded-lg border border-green-500 bg-green-950/40 px-2.5 py-1 font-mono text-xs font-bold text-green-300 hover:bg-green-900/60"
                  >
                    <Save className="h-3.5 w-3.5" />
                    <span>Guardar</span>
                  </button>
                ) : (
                  <button
                    onClick={handleStartEdit}
                    className="flex items-center gap-1 rounded-lg border border-zinc-700 bg-zinc-900 px-2.5 py-1 font-mono text-xs font-bold text-zinc-300 hover:border-red-500 hover:text-white"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Editar</span>
                  </button>
                )}
              </>
            )}

            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:border-zinc-700"
              title="Copiar"
            >
              {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
            </button>

            <button
              onClick={handleDownload}
              className="p-1.5 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:border-zinc-700"
              title="Descargar"
            >
              <Download className="h-4 w-4" />
            </button>

            <button
              onClick={() => setViewingFile(null)}
              className="p-1.5 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-red-400 hover:border-red-900"
              title="Cerrar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content Viewer / Editor */}
        <div className="flex-1 overflow-y-auto p-4 bg-[#0a0a0a]">
          {isEditing ? (
            <textarea
              value={editedContent}
              onChange={e => setEditedContent(e.target.value)}
              className="h-full min-h-[300px] w-full resize-none bg-transparent font-mono text-xs text-zinc-200 outline-none leading-relaxed"
              spellCheck={false}
            />
          ) : (
            <pre className="font-mono text-xs text-zinc-300 whitespace-pre-wrap leading-relaxed">
              {content}
            </pre>
          )}
        </div>

        {/* Footer info bar */}
        <div className="flex items-center justify-between border-t border-zinc-800/80 bg-zinc-950 px-4 py-2 font-mono text-[10px] text-zinc-500">
          <div className="flex items-center gap-3">
            <span>Permisos: {item.permissions || 'rw-r--r--'}</span>
            <span>Tamaño: {item.size || `${(item.content?.length || 0)} B`}</span>
          </div>
          <div>Modificado: {item.modified || '2026-08-17'}</div>
        </div>
      </div>
    </div>
  );
};
