import React, {useState, useMemo} from 'react'
import {Link} from 'react-router-dom'
import {Row, Col, Stack, Button, Form, Card, Badge, Modal} from 'react-bootstrap'
import ReactSelect from 'react-select'
import styles from './NotesLists.module.css'
import { Note, Tag } from './App'
type NoteListProps = {
    availableTags: Tag[]
    notes: Note[],
    deleteTag: (id:string) => void,
    updateTag: (id: string, label: string) => void
}

type SimplifiedNote = {
   tags: Tag[],
   title: string,
   id: string,


}


export const NoteList = ({availableTags, notes, updateTag, deleteTag}: NoteListProps) => {
    const [selectedTags, setSelectedTags] = useState<Tag[]>([])
    const [title, setTitle] = useState('')
    const [isOpen, setIsOpen] = useState(false)

    const filteredNotes = useMemo(() => {
        return notes.filter(note => {
            return (title === '' || note.title.toLowerCase().includes(title.toLowerCase())) && (selectedTags.length === 0 || selectedTags.every(tag => note.tags.some(noteTag => noteTag.id === tag.id)))
        })
    }, [title, selectedTags, notes])
  return (
    <>
        <Row className='align-items-center mb-4'>
            <Col>
                <h1>Notes</h1>
            </Col>
            <Col xs='auto'>
                <Stack gap={2} direction='horizontal'>
                   <Link to='/new'>
                    <Button variant='primary'>Create</Button>
                   </Link>
                   <Button variant='outline-secondary' onClick={() => setIsOpen(true)}>Edit Tags</Button>
                </Stack>
            </Col>
        </Row>
        <Form>
            <Row className='mb-4'>
                <Col>
                <Form.Group controlId='title'>
                    <Form.Label>Title</Form.Label>
                    <Form.Control type="text" value={title} onChange={(e) => setTitle(e.target.value)}></Form.Control>
                </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId='tags'>
                        <Form.Label>Tags</Form.Label>
                        <ReactSelect value={selectedTags.map(tag => {
                            return {label: tag.label, value: tag.id}
                        })} 
                        isMulti
                        onChange={tags => {
                            setSelectedTags(tags.map(tag => {
                                return {label: tag.label, id: tag.value}
                            }))
                        }}
                        options={availableTags.map(tag => {
                            return {label: tag.label, value: tag.id}
                        })}
                        />
                        
                    </Form.Group>
                </Col>
            </Row>
        </Form>
        <Row xs={1} sm={2} lg={3} xl={4} className='g-3'>
            {filteredNotes.map(note => {
                return (
                    <Col key={note.id}>
                        <NoteCard id={note.id}  title={note.title} tags={note.tags}/>
                    </Col>
                )
            })}
        </Row>
        <EditTagsModal show={isOpen} onUpdate={updateTag} onDelete={deleteTag} handleClose={() => setIsOpen(false)} availableTags={availableTags}/>
    </>
  )
}

const NoteCard = ({id, title, tags}: SimplifiedNote) => {
    return <Card 
        as={Link} 
        to={`/${id}`} 
        className={`h-100 text-rest text-decoration-none ${styles.card}`}
        >
        <Card.Body>
            <Stack gap={2} className='align-items-center justify-content-center h-100'>
                <span className='fs-5'>{title}</span>
                {tags.length > 0 && (<Stack gap={1} direction='horizontal' className='justify-conent-center flex-wrap'>
                    {tags.map(tag => (
                        <Badge className='text-truncate' key={tag.id}>{tag.label}</Badge>
                    ))}
                </Stack>)}
            </Stack>
        </Card.Body>
    </Card>
}
type EditTagsProps = {
    availableTags: Tag[],
    show: boolean,
    handleClose: () => void,
    onDelete: (id: string) => void,
    onUpdate: (id: string, label: string) => void,
}

const EditTagsModal = ({availableTags, show, handleClose, onDelete, onUpdate}: EditTagsProps) => {
    return <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
            <Modal.Title>Edit Tags</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Stack gap={2}>
                    {availableTags.map(tag => (
                        <Row key={tag.id}>
                            <Col>
                            <Form.Control type='text' value={tag.label} onChange={(e) => onUpdate(tag.id, e.target.value)}/>
                               </Col>
                            <Col xs='auto'>  
                                <Button variant='outline-danger' onClick={() => onDelete(tag.id)}>&times;</Button>
                            </Col>
                               
                        </Row>
                    ))}
                </Stack>
            </Form>
        </Modal.Body>
    </Modal>
}
