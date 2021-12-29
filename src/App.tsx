import React, { useState, useEffect } from 'react'
import './App.css'
// import Chess from './Chess/Chess'

import Amplify, { API } from 'aws-amplify'
import config from './aws-exports'

import { withAuthenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'

// import { createNote as createNoteMutation, deleteNote as deleteNoteMutation } from './graphql/mutations';

Amplify.configure(config)

interface AuthProp {
  signOut: Function
  user: {}
}

class App extends React.Component {

  constructor(prop: AuthProp) {
    console.log(prop)
    for (let k of Object.keys(prop.user)) {
      console.log(k)
    }
    super(prop)
  }


  render() {
    return (
      <div>hello</div>
      // <div className="App">
      //   <h1>My Notes App</h1>
      //   <input
      //     onChange={e => setFormData({ ...formData, 'name': e.target.value })}
      //     placeholder="Note name"
      //     value={formData.name}
      //   />
      //   <input
      //     onChange={e => setFormData({ ...formData, 'description': e.target.value })}
      //     placeholder="Note description"
      //     value={formData.description}
      //   />
      //   <button onClick={createNote}>Create Note</button>
      //   <div style={{ marginBottom: 30 }}>
      //     {
      //       notes.map(note => (
      //         <div key={note.id || note.name}>
      //           <h2>{note.name}</h2>
      //           <p>{note.description}</p>
      //           <button onClick={() => deleteNote(note)}>Delete note</button>
      //         </div>
      //       ))
      //     }
      //   </div>
      //   <AmplifySignOut />
      // </div>
    )
  }
}

export default withAuthenticator(App)
