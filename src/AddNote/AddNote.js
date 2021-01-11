import React, { Component } from 'react'
import firebase from 'firebase'
import './AddNote.scss'
import moment from 'moment'
import is from 'is_js'

export default class AddNote extends Component {
  state = {
    isFormValid: false,
    isSend: false,
    date: '',
    formControls: {
      name: {
        value: '',
        color: '#000',
        type: 'text',
        label: 'Название',
        errorMessage: 'Минимальное количество символов: 4',
        valid: true,
        touched: false,
        validation: {
          required: true,
          minLength: 4
        }
      },
      text: {
        value: '',
        type: 'text',
        color: '#000',
        label: 'Описание',
        errorMessage: 'Минимальное количество символов: 10',
        valid: true,
        touched: false,
        validation: {
          required: true,
          minLength: 15
        }
      }
    }
  }

  submitHandler = (e) => {
    e.preventDefault()
  }

 
  

  renderInputs() {
    const control = this.state.formControls
    const htmlFor = `${control.type}-${Math.random()}`
    control.name.color = control.name.valid && control.name.touched ? 'green' : null
    control.text.color = control.text.valid && control.text.touched ? 'green' : null
    return (
      <>
       <label style={{color: control.name.color}} htmlFor="">{control.name.label}: </label>
          <input
            type={control.name.type}
            id={htmlFor}
            value={control.name.value}
            onChange={event => this.onChangeHandler(event, 'name')}
          />
          <br/>
          {control.name.valid
            ? null 
            : <span style={{color: 'red', fontSize: '12px'}}>{control.name.errorMessage}</span>
            }
          <br/>
          <label style={{display: 'inline-block', verticalAlign: 'top', marginRight: '10px', color: control.text.color}} htmlFor="">{control.text.label}: </label>
          <textarea
            className='AddNote__textarea'
            id={htmlFor + 1}
            value={control.text.value}
            rows="5" 
            cols="20"
            onChange={event => this.onChangeHandler(event, 'text')}
          ></textarea>
          <br/>
          {control.text.valid
            ? null 
            : <span style={{color: 'red',fontSize: '12px'}}>{control.text.errorMessage}</span>
            }
          <br/>
        </>
    )
    
  }

  validateControl(value, validation) {
    if (!validation) {
      return true
    }

    let isValid = true

    if (validation.required) {
      isValid = value.trim() !== '' && isValid
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

  addHandler = async () => {
    try {
      let data = await moment.utc().format()
      this.setState({
        date: data
      })
      console.log(data)
      data = moment(data)
      console.log(data.local().format())
      let note = {
        date: this.state.date,
        name: this.state.formControls.name.value,
        text: this.state.formControls.text.value
      }
      firebase.database().ref("notes").push(note)
      const formControls = {...this.state.formControls}
      formControls.name.value = ''
      formControls.text.value = ''
      this.setState({formControls, isSend: true})
    } catch (error) {
      console.log(error)
    }
  }


  render() {
    
    return (
      <div className="AddNote">
        <form className="AddNote__form" onSubmit={this.submitHandler}>
          {this.renderInputs()}
          <button
          disabled={!this.state.isFormValid} 
          onClick={this.addHandler}
          >Добавить</button>
        </form>
        {this.state.isSend 
        ? <span style={{color: "green"}}>Заметка успешно добавлена</span>
        : null
        }
      </div>
    )
  }
}
