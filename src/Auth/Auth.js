import React, { Component } from 'react'
import './Auth.scss'
import is from 'is_js'
import firebase from 'firebase'
import Preloader from '../UI/Preloader/Preloader'


export default class Auth extends Component {
  state = {
    isErrorLoginOrRegister: false,
    messageErrorLoginOrRegister: '',
    isLoad: false,
    isAuth: false,
    isFormValid: false,
    formControls: {
      email: {
        value: '',
        type: 'email',
        label: 'email',
        color: '#000',
        errorMessage: 'Введите корректный email',
        valid: true,
        touched: false,
        validation: {
          required: true,
          email: true
        }
      },
      password: {
        value: '',
        type: 'password',
        color: '#000',
        label: 'Пароль',
        errorMessage: 'Минимальная длина пароля 6 символов',
        valid: true,
        touched: false,
        validation: {
          required: true,
          minLength: 6
        }
      }
    }
  }

  validateControl(value, validation) {
    if (!validation) {
      return true
    }

    let isValid = true

    if (validation.required) {
      isValid = value.trim() !== '' && isValid
    }

    if (validation.email) {
      isValid = is.email(value) && isValid
    }

    if (validation.minLength) {
      isValid = value.length >= validation.minLength && isValid
    }

    return isValid
  }

  onChangeHandler = (event, controlName) => {

    const formControls = { ...this.state.formControls }
    const control = { ...formControls[controlName] }

    control.value = event.target.value
    control.touched = true
    control.valid = this.validateControl(control.value, control.validation)

    formControls[controlName] = control

    let isFormValid = true

    Object.keys(formControls).forEach(name => {
      isFormValid = formControls[name].valid && isFormValid && formControls[name].touched
    })

    this.setState({
      formControls, isFormValid
    })
  }

  submitHandler = (event) => {
    event.preventDefault()
  }

  renderErrorLoginOrRegister = () => {
    return (
      <div style={{ color: 'red' }}>{this.state.messageErrorLoginOrRegister}</div>
    )
  }

  identifyErrorFirebase = (error) => {
    let identifyError = ''
    if(error.code == 'auth/wrong-password') {
      identifyError = 'Вы ввели неверный пароль'
      this.setState({
        isErrorLoginOrRegister: true,
        messageErrorLoginOrRegister: identifyError
      })
    }
    if(error.code == 'auth/user-not-found') {
      identifyError = 'Такого пользователя не существует'
      this.setState({
        isErrorLoginOrRegister: true,
        messageErrorLoginOrRegister: identifyError
      })
    }
    if(error.code == 'auth/email-already-in-use') {
      identifyError = 'Такой email уже зарегестрирован'
      this.setState({
        isErrorLoginOrRegister: true,
        messageErrorLoginOrRegister: identifyError
      })
    }
  }


  renderError(controlName) {
    const control = this.state.formControls[controlName]

    

    if (control.touched) {
      
      return (
        control.valid
          ? null
          : <div style={{ color: 'red' }}>{control.errorMessage}</div>
      )
    } 
  }

  // validColor(controlName) {
  //   const formControls = { ...this.state.formControls }
  //   const control = { ...formControls[controlName] }
  //   control.color = 'green'
  //     formControls[controlName] = control
  //     this.setState({
  //       formControls
  //     })

  // }

  renderButtons() {
    return (
      <>
        <button
          disabled={!this.state.isFormValid}
          onClick={this.loginHandler}
        >
          Войти
      </button>
        <button
          disabled={!this.state.isFormValid}
          onClick={this.registerHandler}
        >
          Зарегистрироваться
      </button>
      </>
    )
  }

  loginHandler = () => {
    this.setState({ isLoad: true })
    firebase.auth().signInWithEmailAndPassword(this.state.formControls.email.value, this.state.formControls.password.value)
      .then((user) => {
        console.log(user)
        console.log("Вы вошли")
        setTimeout(() => {
          this.setState({ isLoad: false })
        }, 1000);
      })
      .catch((error) => {
        console.log(error)
        this.identifyErrorFirebase(error)
        console.log(this.state)
        setTimeout(() => {
          this.setState({ isLoad: false })
        }, 1000);
      })
  }

  registerHandler = () => {
    this.setState({ isLoad: true })
    firebase.auth().createUserWithEmailAndPassword(this.state.formControls.email.value, this.state.formControls.password.value)
      .then((user) => {
        console.log(user)
        console.log("Успешно зарегестрирован")
        setTimeout(() => {
          this.setState({ isLoad: false })
        }, 1500);
      })
      .catch((error) => {
        // const err = {
        //   isErrorLoginOrRegister: true,
        //   messageErrorLoginOrRegister: error.message
        // }
        // this.setState({
        //   errorLoginOrRegister: err
        // })
        // console.log(this.state)
        console.log(error)
        this.identifyErrorFirebase(error)
        setTimeout(() => {
          this.setState({ isLoad: false })
        }, 1500);
      })
  }

  renderInputs() {
    return Object.keys(this.state.formControls).map((controlName, index) => {
      const control = this.state.formControls[controlName]
      const htmlFor = `${control.type}-${Math.random()}`
      control.color = control.valid && control.touched ? 'green' : null
      return (
        <>
          <label
           htmlFor=""
           style={{color: control.color}}
           >{control.label}: </label>
          <input
            type={control.type}
            id={htmlFor}
            value={control.value}
            onChange={event => this.onChangeHandler(event, controlName)}
          />
          {this.renderError(controlName)}
          <br/>
        </>
      )
    })
  }

  render() {
    return (
      this.state.isLoad
        ? <Preloader />
        :
        <div className="auth">
          <h1 className="auth__header">Авторизация</h1>
          <form
            onSubmit={this.submitHandler}
            className="auth__form"
          >
            {this.renderInputs()}
            {this.renderButtons()}
          </form>
          {this.state.isErrorLoginOrRegister
            ? this.renderErrorLoginOrRegister()
            : null
          }
        </div>
    )
  }
}
