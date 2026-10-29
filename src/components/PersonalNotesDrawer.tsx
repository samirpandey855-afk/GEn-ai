import React, { useState, useEffect } from 'react';

export interface UserNote {
  id: string;
  moduleId: string;
  moduleTitle: string;
  text: string;
  color: 'yellow' | 'green' | 'blue' | 'pink';
  timestamp: string;
}

interface PersonalNotesDrawerProps {
  currentModuleId: string;
  currentModuleTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

export const PersonalNotesDrawer: React.FC<PersonalNotesDrawerProps> = ({
  currentModuleId,
  currentModuleTitle,
  isOpen,
  onClose
}) => {
  const [notes, setNotes] = useState<UserNote[]>(() => {
    try {
      const saved = localStorage.getItem('genai_user_notes');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [newNoteText, setNewNoteText] = useState('');
  const [noteColor, setNoteColor] = useState<'yellow' | 'green' | 'blue' | 'pink'>('yellow');

  useEffect(() => {
    try {
      localStorage.setItem('genai_user_notes', JSON.stringify(notes));
    } catch (e) {
      console.error(e);
    }
  }, [notes]);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    const newNote: UserNote = {
      id: Date.now().toString(),
      moduleId: currentModuleId,
      moduleTitle: currentModuleTitle,
      text: newNoteText.trim(),
      color: noteColor,
      timestamp: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    };

    setNotes([newNote, ...notes]);
    setNewNoteText('');
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white shadow-2xl border-l border-slate-200 flex flex-col no-print">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-handwriting font-bold text-lg text-amber-700">Margin Notes</span>
            <span className="text-slate-300">·</span>
            <h3 className="font-sans font-bold text-slate-800 text-sm">Study Scribbles & Stickies</h3>
          </div>
          <p className="text-[11px] text-slate-500 font-sans">
            Jot down thoughts, exam reminders, or personal insights.
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-700 p-1 rounded-md"
        >
          ✕
        </button>
      </div>

      {/* Note Creation Form */}
      <form onSubmit={handleAddNote} className="p-4 border-b border-slate-100 bg-amber-50/40">
        <div className="text-xs text-slate-600 font-sans mb-1 font-medium">
          Add sticky note for <span className="text-amber-800 font-bold">{currentModuleTitle}</span>:
        </div>
        <textarea
          rows={3}
          value={newNoteText}
          onChange={(e) => setNewNoteText(e.target.value)}
          placeholder="E.g., In backprop, check if gradient saturates for large logits... "
          className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white font-handwriting text-base text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
        />

        <div className="flex items-center justify-between mt-2.5">
          <div className="flex items-center gap-1.5">
            {(['yellow', 'green', 'blue', 'pink'] as const).map(c => (
              <button
                key={c}
                type="button"
                onClick={() => setNoteColor(c)}
                className={`w-5 h-5 rounded-full border transition-transform ${
                  c === 'yellow' ? 'bg-amber-200 border-amber-400' :
                  c === 'green' ? 'bg-emerald-200 border-emerald-400' :
                  c === 'blue' ? 'bg-sky-200 border-sky-400' :
                  'bg-rose-200 border-rose-400'
                } ${noteColor === c ? 'scale-125 ring-2 ring-slate-800' : 'hover:scale-110'}`}
              />
            ))}
          </div>

          <button
            type="submit"
            className="px-3 py-1.5 bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold rounded-md transition-colors font-sans shadow-xs"
          >
            Pin Note
          </button>
        </div>
      </form>

      {/* Notes list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {notes.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs font-sans">
            No personal margin notes yet. Pin your first thought above!
          </div>
        ) : (
          notes.map(note => {
            const bgClass =
              note.color === 'yellow' ? 'bg-amber-100/90 border-amber-300 text-amber-950' :
              note.color === 'green' ? 'bg-emerald-100/90 border-emerald-300 text-emerald-950' :
              note.color === 'blue' ? 'bg-sky-100/90 border-sky-300 text-sky-950' :
              'bg-rose-100/90 border-rose-300 text-rose-950';

            return (
              <div
                key={note.id}
                className={`p-3.5 rounded-xl border shadow-xs relative font-handwriting text-base ${bgClass}`}
              >
                <div className="flex items-center justify-between mb-1 text-[11px] font-sans opacity-75">
                  <span className="font-semibold truncate max-w-[200px]">{note.moduleTitle}</span>
                  <span>{note.timestamp}</span>
                </div>
                <p className="whitespace-pre-wrap leading-relaxed">{note.text}</p>
                <button
                  onClick={() => handleDeleteNote(note.id)}
                  className="absolute bottom-2 right-2 text-slate-400 hover:text-rose-600 text-xs font-sans p-1 opacity-60 hover:opacity-100"
                  title="Delete note"
                >
                  ✕
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
