'use client'
import NewNoteCard from '@/components/NewNoteCard';
import NoteCard from '@/components/NoteCard';
import { ChangeEvent, useEffect, useState } from 'react';

interface INote {
  id: string;
  date: Date;
  content: string;
}

export default function Home() {
  const [search, setSearch] = useState('');
  const [notes, setNotes] = useState<INote[]>([]);

  useEffect(() => {
    const notesOnStorage = localStorage.getItem('notes');
    if (notesOnStorage) {
      setNotes(JSON.parse(notesOnStorage));
    }
  }, []); 
  const onNoteCreated = (content: string) => {
    const newNotes = {
      id: crypto.randomUUID(),
      date: new Date(),
      content
    }
    const notesArray = [newNotes, ...notes]
    setNotes(notesArray)
    localStorage.setItem('notes', JSON.stringify(notesArray))

  }

  const onNoteDeleted = (id: string) => {
    const notesArray = notes.filter(note => {
      return note.id !== id
    })
    setNotes(notesArray);

    localStorage.setItem('notes', JSON.stringify(notesArray))

  }

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearch(query)
  }

  const filteredNotes = search !== ''
    ? notes.filter(note => note.content.toLocaleLowerCase().includes(search.toLocaleLowerCase()))
    : notes

  return (
    <div className='mx-auto max-w-6xl my-12 space-y-6 px-5 '>
      <form className='w-full '>
        <input
          type="text"
          placeholder='Busque em suas notas... '
          className='w-full bg-transparent text-3xl  font-semibold tracking-tight outline-none placeholder:text-slate-500'
          onChange={handleSearch}
          value={search}
        />
      </form>
      <div className='h-px bg-slate-700' />
      <div className='grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px]'>
        <NewNoteCard onNoteCreated={onNoteCreated} />
        {filteredNotes.map(note => {
          return <NoteCard key={note.id} id={note.id} date={note.date} content={note.content} onNoteDeleted={onNoteDeleted} />
        })}
      </div>
    </div>
  );
}
