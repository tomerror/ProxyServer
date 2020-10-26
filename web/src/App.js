import React, { Component } from 'react';
import './App.css';
import socketIOClient from "socket.io-client";
import axios from 'axios';
import Person from './components/Person/Person';
import Page from './components/Page/Page';
const PROXY = "http://localhost:4000/";

class App extends Component {
  state = {
    persons: [],
    pages: [],
    page: 0
  }

  componentDidMount() {
    const socket = socketIOClient(PROXY);
    socket.on('response', data => {
      let pages = []
      for (let i = 1; i <= data.total_pages; i++) {
        pages.push(i)
      }
      this.setState({ 
        pages: pages,
        persons: data.data,
        page: data.page
      })
    });

    socket.on('error', message => {
      alert(message)
    })
  }

  getData = (pageNumber) => {
    if(pageNumber != this.state.page){
      axios({
        method: 'get',
        url: PROXY + `?page=${pageNumber}`
      })
      .then(response => {
        alert(response.data)
        this.setState({ response: response.data })
      })
      .catch(error => {
        alert(error.response.data)
      })
    }
  }

  render() {
    const personList = this.state.persons.map(person => {
      return (<Person key={person.id} person={person} />)
    })
    const pages = this.state.pages.map((link, key) => {
      return (
        <Page key={key} page={link} active={this.state.page} click={(p) => this.getData(p)} />
      )
    })

    return (
      <div>
        <div className="title">Home Assignment</div>
        {this.state.persons.length === 0 ? <button onClick={() => this.getData(1)}> Get Data </button> : null}
        <div className="personsPanel">
          {personList}
        </div>
        <div className="pages">
          {pages}
        </div>
      </div>
    )
  }
}

export default App;