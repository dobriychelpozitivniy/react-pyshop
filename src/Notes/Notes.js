import React, { Component } from 'react'
import moment from '../../node_modules/moment/moment'
import firebase from 'firebase'
import Note from './Note/Note.js'
import Preloader from '../UI/Preloader/Preloader'
import Fuse from 'fuse.js'

var filterTimeout = 0

export default class Notes extends Component {
  state = {
    isLoad: true,
    notes: [],
    inputTest: 0,
    test: 0
  }

  filter(notes,search) {
    const fuse = new Fuse(notes, {
      keys: [
        'date',
        'name',
        'text',
        'datePassed'
      ],
      shouldSort: true,
    threshold: 0.6,
    location: 0,
    distance: 100,
    minMatchCharLength: 1
    })
    let result = fuse.search(search)
    for(let i = 0; i < result.length; i++) {
      result[i] = result[i].item
      // console.log(result1[i])
    }
    console.log(result)
    // this.setState({inputTest: search})
    return result
  }

  renderNotes = (event = 0) => {
    // var test = 0
    let notes = this.state.notes
    console.log(notes)
    //////

    notes = event ?  this.filter(this.state.notes,event) : this.state.notes
    
    // console.log("event", notes)


    /////
    
    return notes.map((note,i) => {
      // console.log("note: ",note)
      // console.log("noteNAME: ",note.name)
      // console.log("noteITEM: ",note.item)
      // console.log("noteITEMname:",note.item.name)
      // console.log(note.date)
      
      // console.log(date)
      return (
          <Note
           name={note.name}
           text={note.text}
           date={note.date}
           datePassed={note.datePassed}
          />
      )
    })
  }

  getNotesFromFirebase = async () => {
    try {
      const notesFromFirebase = await (await firebase.database().ref('notes').once('value')).val()
      let notes = Object.values(notesFromFirebase)
      
      let date = moment()
      let datePassed = moment()
      let nowDate = moment()
      notes.map((note,i) => {
        date = moment(note.date)
        datePassed = nowDate.from(date,true)
        note.datePassed = datePassed
        note.date = moment(date).format("HH:mm:ss DD.MM.YYYY")
        
        console.log("NOTEDATENEW", note.date)
      })
      this.setState({
        notes
      })
    } catch(err) {
      console.log(err)
    }
  }

  async componentDidMount() {
    await this.getNotesFromFirebase()
    const timer = setTimeout(() => {
      this.setState({ isLoad: false })
    }, 500);
  }

  changeInput(eventValue) {
    clearTimeout(filterTimeout)
    filterTimeout = setTimeout(() => {
      this.setState({inputTest: eventValue})
    },450)
  }

  

  render() {
    
    return (
      this.state.isLoad 
       ? <Preloader />
       :
      <>
      
       
      <p style={{textAlign: 'center'}}>
      <span>Фильтр: </span>
      <input 
      type="text" 
      onChange={event => this.changeInput(event.target.value)}
      />
      </p>
      <div className="note">
      {this.renderNotes(this.state.inputTest)} 
      </div>
      </>
    )
  }
}


