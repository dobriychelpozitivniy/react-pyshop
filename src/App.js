import React, { Component } from 'react'
import { Route, NavLink, Switch, Redirect } from 'react-router-dom'
import Auth from './Auth/Auth';
import AddNote from './AddNote/AddNote';
import Notes from './Notes/Notes';
import './App.scss'
import firebaseconfig from './firebase/firebaseConfig'
import firebase from 'firebase'
import Preloader from './UI/Preloader/Preloader';

firebase.initializeApp(firebaseconfig)


class App extends Component {
  state = {
    isLoggedIn: false,
    isLoad: true
  }

  logoutHandler = () => {
    this.setState({isLoad: true})
    firebase.auth().signOut()
     .then(() => {
       setTimeout(() => {
         this.setState({isLoad: false})
       }, 1000)
     })
  }

  routes = () => {
    let routes = (
      <Switch>
        {/* <Route path="/" exact render={() => <h1>Home page</h1>} /> */}
        <Route path='/auth' component={Auth} />
        <Route path="/show" component={Notes} />
        <Redirect to={'/show'} />
      </Switch>

    )
    

    if(this.state.isLoggedIn) {
      routes = (
        <Switch>
          {/* <Route path="/" exact render={() => <h1>Home page</h1>} /> */}
          <Route path="/show" component={Notes} />
          <Route path="/add" component={AddNote} />
          <Redirect to={'/show'} />
        </Switch>
      )
    }

    return routes
  }

  componentDidMount() {
    

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log("Вошел")
        this.timer = setTimeout(() => {
          this.setState({isLoad: false, isLoggedIn: true})
     }, 1000)
      } else {
        console.log("Не вошел")
        this.timer = setTimeout(() => {
          this.setState({isLoad: false, isLoggedIn: false})
     }, 1000)
      }
    })
  }

  componentWillUnmount() {
    clearTimeout(this.timer)
}

  render() {
    
    return (
      this.state.isLoad 
      ? <Preloader/>
      :
      <div className="App">
        <nav className="nav">
          <ul>
            <li>
              {this.state.isLoggedIn 
              ? null
              : <NavLink
                to="/auth"
                exact
                activeClassName={'wfm-active'}
              >Авторизация</NavLink>}
            </li>
            <li>
              <NavLink to="/show"
              >Список заметок</NavLink>
            </li>
            <li>
              {this.state.isLoggedIn
              ?
              <NavLink to="/add"
              >Добавить заметку</NavLink>
              : null}
            </li>
          </ul>
          {this.state.isLoggedIn ?
            <p style={{textAlign: 'center'}}><button
              onClick={this.logoutHandler}
            >
              Выйти
           </button></p>
            : null
          }
        </nav>
        <hr />
        {this.routes()}

      </div>
      
    );
  }
}

export default App
