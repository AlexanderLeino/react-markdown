import React from 'react'
import { Note } from './App'
import {useParams, Navigate, Outlet, useOutletContext} from 'react-router-dom'

type NoteLayoutProps = {
    notes: Note[]
}

export const NoteLayout = ({notes}: NoteLayoutProps) => {
   const {id} = useParams()
   const note = notes.find(n => n.id === id)
   console.log('Note', note)
   if(note === null || note === undefined) return <Navigate to='/' replace />
  return (
    <Outlet context={note}/>
  )
}

export function useNote(){
    return useOutletContext<Note>()
}