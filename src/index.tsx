import * as React from 'react';
import { Component } from 'react-simplified';
import ReactDOM from 'react-dom';
import { NavLink, HashRouter, Route } from 'react-router-dom';
import { createHashHistory } from 'history';
import { Note, noteService } from './services';
import { Task, taskService } from './services';
import { TaskList, FinishedTaskList, AddTask, TaskEdit } from './tasks'
import { CategoryList, CategoryEdit } from './cat'
import { Alert, Card, Row, Column, NavBar, Button, Form } from './widgets';
import { Container, CardGroup, NoteCard, SubHeader, CenteredRow, InputGroup, Badge, BadgePrimary } from './widgets';
import { Table, THead, TBody, Tr, CollapsingTr, Th, Td} from './widgets';
import '@fortawesome/fontawesome-free/js/all.js';

/** @type {*} */
const history = createHashHistory();

/**
 * @description class containing the NavBar which acts as the main menu for the application
 * @class Menu
 * @extends {Component}
 */
class Menu extends Component {
  render() {
    return (
      <NavBar version="Version Beta1.1">
        <NavBar.Link to="/">Home</NavBar.Link>
        <NavBar.Link to="/tasks">Tasks</NavBar.Link>
        <NavBar.Link to="/finished_tasks">Finished Tasks</NavBar.Link>
        <NavBar.Link to="/categories">Categories</NavBar.Link>
      </NavBar>
    );
  }
}

/**
 * @description class containing the home and welcome screen of the application, displays todays tasks, productivity bar and quick notes -
 * routed to /
 * @class Home
 * @extends {Component}
 */
class Home extends Component {
  /**
   * @description array storing all tasks retrieved from mySQL database
   * @type {Task[]}
   * @memberof Home
   */
  tasks: Task[] = [];

  /**
   * @description array storing all notes retrieved from mySQL database
   * @type {Note[]}
   * @memberof Home
   */
  notes: Note[] = [];

  /**
   * @description generates a note-object for creating new notes
   * @memberof Home
   */
  note = new Note();

  /**
   * @description stores the count of total tasks in the database
   * @type {number}
   * @memberof Home
   */
  total_tasks: number = 0;

  /**
   * @description stores the count of finished tasks in the database
   * @type {number}
   * @memberof Home
   */
  finished_tasks: number = 0;

  /**
   * @description renders /
   * @return {*} 
   * @memberof Home
   */
  render() {
    let d = new Date();
    let days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    let day = days[d.getDay()]
    let month_day = d.getDate();
    let dateEnding = "th";
    if (month_day == 1) {
      dateEnding = "st";
    } else if (month_day == 2) {
      dateEnding = "nd";
    } else if (month_day == 3) {
      dateEnding = "rd";
    }
    let date = "Today, " + (day.charAt(0).toUpperCase() + day.slice(1)) + " " + months[d.getMonth()] + " " + month_day + dateEnding + " " + d.getFullYear();
    let percentFinished = Math.floor((this.finished_tasks / this.total_tasks) * 100);

    return (
      <Container>
        <Card title="Welcome!">
          Welcome to your To-Do Application. It's {day}, let's get some work done!
        </Card>
        <Card title={date}>{this.today()}</Card>
        <Card title="Productivity bar">
          <SubHeader>How many % of your total tasks have you completed?</SubHeader>
          <div className="progress">
            <div className="progress-bar" role="progressbar" style={{width: percentFinished + "%"}} aria-valuenow={percentFinished} aria-valuemin={0} aria-valuemax={100}>{percentFinished}% of your tasks</div>
          </div>
        </Card>
        <Card title="Quick notes">
          <SubHeader>For all the little things in life</SubHeader>
          <Row>
            <Column width={6}><h6 className="card-title">Add a new note</h6></Column>
            <Column width={6} right><h6 className="card-title">Color</h6></Column>
          </Row>
          <InputGroup margin={3}>
            <input value={this.note.name} type="text" className="form-control bg-dark text-white" placeholder="Enter a name for your note" onChange={(event) => (this.note.name = event.currentTarget.value)} maxLength={100} />
            <input type="color" className="form-control form-control-color" value={this.note.color} onChange={(event) => (this.note.color = event.currentTarget.value)} title="Choose your color" />
          </InputGroup>
          <Form.InputWithButton value={this.note.description} buttonType="success" onChange={(event) => (this.note.description = event.currentTarget.value)} onClick={this.addNote} placeholder="Add some description to your note">Add note</Form.InputWithButton>
          <hr></hr>
          <CardGroup>
          {this.notes.map((note) => {
              return (
                <div key={note.id} className="col">
                  <NoteCard title={note.name} color={note.color} to={"/notes/" + note.id}  onClick={() => this.removeNote(note.id)}>
                    {note.description}
                  </NoteCard>
                </div>
            )})}
          </CardGroup>
        </Card>
      </Container>
    );
  }

  /**
   * @description mySQL queries called each time the component is loaded
   * @memberof Home
   */
  mounted() {
    taskService.getTodaysTasks((tasks) => {
      this.tasks = tasks;
    });
    noteService.getNotes((notes) => {
      this.notes = notes;
    })
    taskService.countTotalTasks((count) => {
      this.total_tasks = count;
    });
    taskService.countFinishedTasks((count) => {
      this.finished_tasks = count;
    });
  }

  /**
   * @description checks for tasks that expires on the current day, and returns either a table of tasks, or a message that no tasks were found
   * @return {*} 
   * @memberof Home
   */
  today() {
    if (this.tasks.length == 0) {
      return (
        <React.Fragment>
          <Row>
            <Column>You have no tasks expiring today, maybe you should create one?</Column>
          </Row>
          <Row>
            <Column><Button.Success onClick={this.add}>Add a task</Button.Success></Column>
          </Row>
        </React.Fragment>
        );
    } else {
      return (
        <Table>
          <THead>
            <Tr>
              <Th><i className="fa fa-angle-double-down" aria-hidden="true"></i></Th>
              <Th pointer onClick={() => { sessionStorage.setItem('sortProp', "name"); this.sort() }}>Task</Th>
              <Th pointer onClick={() => { sessionStorage.setItem('sortProp', "priority"); this.sort() }}>Priority</Th>
              <Th pointer onClick={() => { sessionStorage.setItem('sortProp', "category"); this.sort() }}>Category</Th>
              <Th pointer onClick={() => { sessionStorage.setItem('sortProp', "expires"); this.sort() }}>Deadline</Th>
              <Th>Status</Th>
              <Th>Finish</Th>
            </Tr>
          </THead>
          <TBody>
            {this.tasks.map((task) => {
              let name_overflow = "";
              let badge = "secondary";
              if (task.name.length > 60) {
                name_overflow = " [...]";
              }
              if (task.priority == "High") {
                badge = "badge bg-danger";
              } else if (task.priority == "Medium") {
                badge = "badge bg-warning";
              } else {
                badge = "badge bg-secondary";
              }
              return (
                <React.Fragment key={task.id}>
                  <Tr>
                    <Td width={1}><Button.Expand target={task.id}></Button.Expand></Td>
                    <Td width={6}>{task.name.substring(0,60) + name_overflow}</Td>
                    <Td><Badge badge={badge}>{task.priority}</Badge></Td>
                    <Td>{task.category}</Td>
                    <Td>Today!</Td>
                    <Td><BadgePrimary>Active</BadgePrimary></Td>
                    <Td><Button.Success onClick={() => this.finish(task.id)}><i className="fa fa-check" aria-hidden="true"></i></Button.Success></Td>
                  </Tr>
                  <CollapsingTr id={task.id}>
                    <Td colSpan={7}>
                      <Card title="">
                        <SubHeader>Task description</SubHeader>
                        <Row>
                          <Column>{task.description}</Column>
                        </Row>
                      </Card>
                      <CenteredRow>
                        <NavLink className="btn btn-secondary" to={'/tasks/' + task.id}>Edit this task</NavLink>
                        <Button.Danger onClick={() => this.remove(task.id)}>Delete this task</Button.Danger>
                      </CenteredRow>
                    </Td>
                  </CollapsingTr>
                </React.Fragment>
            )})}
          </TBody>
        </Table>
      );
    }
  }

  /**
   * @description routes to /add
   * @memberof Home
   */
  add() {
    history.push('/add/');
  }

  /**
   * @description marks an active task as finished
   * @param {number} id
   * @memberof Home
   */
  finish(id: number) {
    taskService.finishTask(id, () => {
      history.push('/finished_tasks/');
      history.goBack();
      Alert.success("Task completed, good job!");
    });
  }

  /**
   * @description deletes a task from the mysql database
   * @param {number} id
   * @memberof Home
   */
  remove(id: number) {
    taskService.removeTask(id, () => {
      history.push('/tasks/');
      history.goBack();
      Alert.danger("Task removed.");
    });
  }

  /**
   * @description adds a note to the mySQL database
   * @memberof Home
   */
  addNote() {
    noteService.addNote(this.note, () => {
      history.push('/tasks/');
      history.goBack();
    });
    Alert.success("Note added!");
  }

  /**
   * @description deletes a note from the mySQL database
   * @param {number} id
   * @memberof Home
   */
  removeNote(id: number) {
    noteService.removeNote(id, () => {
      history.push('/tasks/');
      history.goBack();
    });
    Alert.danger("Note deleted!");
  }

  /**
   * @description sort method called on table-header click, evaluates what property to sort tasks after - then calls the reOrder()-method as a sort-function
   * @memberof Home
   */
  sort() {
    let sort_prop = sessionStorage.getItem("sortProp");
    let current_sort_prop = sessionStorage.getItem("currentSortProp");
    
    // checks for the selected sort property (sort_prop) (which header the user clicked), and then checks if the app is already sorting by that property (current_sort_prop),
    // this was it can flip from descending to ascending sorting and vice verca. 
    // This check has to come before the this.tasks.sort-function because the sort function will repeat itself many times and mess up the sessionstorage-setItem function

    if (sort_prop == "name") {
      if (current_sort_prop != "name") {
        sessionStorage.setItem('currentSortProp', "name");
      } else {
        sessionStorage.setItem('currentSortProp', "re_name");
      }
    }

    if (sort_prop == "priority") {
      if (current_sort_prop != "priority") {
        sessionStorage.setItem('currentSortProp', "priority");
      } else {
        sessionStorage.setItem('currentSortProp', "re_priority");
      }
    }

    if (sort_prop == "category") {
      if (current_sort_prop != "category") {
        sessionStorage.setItem('currentSortProp', "category");
      } else {
        sessionStorage.setItem('currentSortProp', "re_category");
      }
    }

    if (sort_prop == "expires") {
      if (current_sort_prop != "expires") {
        sessionStorage.setItem('currentSortProp', "expires");
      } else {
        sessionStorage.setItem('currentSortProp', "re_expires");
      }
    }

    // runs the sort function (reOrder) now that the correct sorting property has been selected
    this.tasks.sort((a, b) => Number(this.reOrder(a, b)));
  }

  /**
   * @description sort function that sorts two tasks 'a' and 'b' by the sorting-property decided by the sort()-method
   * @param {Task} a
   * @param {Task} b
   * @return {*} 
   * @memberof Home
   */
  reOrder(a: Task, b: Task) {
    let sort_prop = sessionStorage.getItem("sortProp");
    let current_sort_prop = sessionStorage.getItem("currentSortProp");

    if (sort_prop == "name") {
      if (current_sort_prop != "name") {
        let fa = a.name.toLowerCase(), fb = b.name.toLowerCase();
        if (fa > fb) {
            return -1;
        }
        if (fa < fb) {
            return 1;
        }
          return 0;
      } else {
        let fa = b.name.toLowerCase(), fb = a.name.toLowerCase();
        if (fa > fb) {
            return -1;
        }
        if (fa < fb) {
            return 1;
        }
          return 0;
      }
    } 

    if (sort_prop == "priority") {
      if (current_sort_prop != "priority") {
        let fa = a.priority_id, fb = b.priority_id;

        if (fa > fb) {
            return -1;
        }
        if (fa < fb) {
            return 1;
        }
          return 0;
      } else {
        let fa = b.priority_id, fb = a.priority_id;

        if (fa > fb) {
            return -1;
        }
        if (fa < fb) {
            return 1;
        }
          return 0;
      }
    }

    if (sort_prop == "category") {
      if (current_sort_prop != "category") {
        let fa = a.category.toLowerCase(), fb = b.category.toLowerCase();
        if (fa > fb) {
            return -1;
        }
        if (fa < fb) {
            return 1;
        }
          return 0;
      } else {
        let fa = b.category.toLowerCase(), fb = a.category.toLowerCase();
        if (fa > fb) {
            return -1;
        }
        if (fa < fb) {
            return 1;
        }
          return 0;
      }
    } 

    if (sort_prop == "expires") {
      if (current_sort_prop != "expires") {
        let fa = a.expires, fb = b.expires;

        if (fa > fb) {
            return -1;
        }
        if (fa < fb) {
            return 1;
        }
          return 0;
      } else {
        let fa = b.expires, fb = a.expires;

        if (fa > fb) {
            return -1;
        }
        if (fa < fb) {
            return 1;
        }
          return 0;
      }
    }
  }
}

/**
 * @description class for editing a selected note
 * routed to /notes/:id
 * @class EditNote
 * @extends {Component<{ match: { params: { id: string } } }>}
 */
class EditNote extends Component<{ match: { params: { id: string } } }> {
  /**
   * @description note-object to store the properties of the selected note
   * @memberof EditNote
   */
  note = new Note();

  /**
   * @description renders /notes/:id
   * @return {*} 
   * @memberof EditNote
   */
  render () {
    return (
      <Container>
        <Card title="Edit this note">
          <InputGroup>
            <Form.Input
              type="text" value={this.note.name}
              onChange={(event) => (this.note.name = event.currentTarget.value)}
              id="edit_notename"
              name="Enter a name for your note"
              placeholder="Enter a name for your note"
              width="12"
            />
          </InputGroup>

          <InputGroup>
            <Form.Input
              type="text" value={this.note.description}
              onChange={(event) => (this.note.description = event.currentTarget.value)}
              id="edit_notedesc"
              name="Add some description to your note"
              placeholder="Add some description to your note"
              width="12"
            />
          </InputGroup>
          <Row>
            <label htmlFor="colorPicker" className="col-sm-2 col-form-label">Sticky note color</label>
            <Form.Color type="color" value={this.note.color} onChange={(event) => (this.note.color = event.currentTarget.value)} title="Choose your color" id="colorPicker" />
          </Row>
        </Card>
        <Row>
          <Column>
            <Button.Success onClick={this.save}>Save</Button.Success>
          </Column>
          <Column right>
            <Button.Light onClick={this.cancel}>Cancel</Button.Light>
          </Column>
        </Row>
      </Container>
    )
  }

  /**
   * @description mySQL query that selects the selected note and stores its properties in the declared note-object
   * @memberof EditNote
   */
  mounted() {
    noteService.getNote(Number(this.props.match.params.id), (note) => {
      this.note = note;
    });
  }

  /**
   * @description saves changes to the selected note
   * @memberof EditNote
   */
  save() { 
    noteService.updateNote(this.note, () => {
      history.push("/");
    });
    Alert.info("Note updated.");
  }
  
  /**
   * @description cancels the editing of a note
   * @memberof EditNote
   */
  cancel() {
    history.push("/");
  }
}

/**
 * @description class containing an about-screen in the application -
 * routed to /about
 * @class About
 * @extends {Component}
 */
class About extends Component {
  /**
   * @description renders /about
   * @return {*} 
   * @memberof About
   */
  render() {
    return (
      <Container>
        <Card title="">
          <CenteredRow>
            <h5 className="card-title">
              About this application
            </h5>
          </CenteredRow>
          <CenteredRow>
            This application was written as part of a project assignment in the course DCST1008, from the bahelor's degree Digital Infrastructure and Cybersecurity at NTNU Trondheim.
          </CenteredRow>
        </Card>
      </Container>
    )
  }
}

ReactDOM.render(
  <div>
    <Alert />
    <HashRouter>
      <div>
        <Menu />
        <Route exact path="/" component={Home} />
        <Route exact path="/about" component={About} />
        <Route exact path="/notes/:id" component={EditNote} />
        <Route exact path="/tasks" component={TaskList} />
        <Route exact path="/tasks/:id" component={TaskEdit} />
        <Route exact path="/add" component={AddTask} />
        <Route exact path="/finished_tasks" component={FinishedTaskList} />
        <Route exact path="/categories" component={CategoryList} />
        <Route exact path="/categories/:id" component={CategoryEdit} />
      </div>
    </HashRouter>
  </div>,
  document.getElementById('root')
);
