import * as React from 'react';
import { Component } from 'react-simplified';
import { NavLink } from 'react-router-dom';
import { Task, taskService } from './services';
import { Category, categoryService, Priority, priorityService } from './services';
import { Alert, Card, Row, Column, Button, Form } from './widgets'; 
import { Container, SubHeader, CenteredRow, InputGroup, Badge } from './widgets'; 
import { Table, THead, TBody, Tr, CollapsingTr, Th, Td} from './widgets'; 
import { createHashHistory } from 'history';

/** @type {*} */
const history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a user

/**
 * @description class containing the list of all active tasks
 * @export
 * exported to index.tsx and routed to /tasks
 * @class TaskList
 * @extends {Component}
 */
export class TaskList extends Component {
    /**
     * @description array storing all active tasks retrieved from mySQL datbase
     * @type {Task[]}
     * @memberof TaskList
     */
    tasks: Task[] = [];
  
    /**
     * @description renders /tasks
     * @return {*} 
     * @memberof TaskList
     */
    render() {
      return (
        <Container>
          <Card title="Your Active Tasks">
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
                  let status = "";
                  let status_badge = "secondary";
                  let deadline = "";
                  if (task.name.length > 60) {
                    name_overflow = " [...]";
                  }
                  if (task.priority == "High") {
                    badge = "danger";
                  } else if (task.priority == "Medium") {
                    badge = "warning";
                  } else {
                    badge = "secondary";
                  }
                  if (task.expires < 0) {
                    status = "Expired";
                    status_badge = "danger";
                    if (task.expires == -1) {
                      deadline = (task.expires * -1) + " day ago";
                    } else {
                      deadline = (task.expires * -1) + " days ago";
                    }
                  } else {
                    status = "Active";
                    status_badge = "primary";
                    if (task.expires == 0) {
                      deadline = "Today";
                    } else if (task.expires == 1) {
                      deadline = "In " + task.expires + " day"
                    } else {
                      deadline = "In " + task.expires + " days";
                    }
                  }
                  return (
                    <React.Fragment key={task.id}>
                      <Tr>
                        <Td width={1}><Button.Expand target={task.id}></Button.Expand></Td>
                        <Td width={5}>{task.name.substring(0,60) + name_overflow}</Td>
                        <Td><Badge badge={badge}>{task.priority}</Badge></Td>
                        <Td>{task.category}</Td>
                        <Td>{deadline}</Td>
                        <Td><Badge badge={status_badge}>{status}</Badge></Td>
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
                  );
                })}
              </TBody>
            </Table>
          </Card>
          <Button.Success onClick={this.add}>Add a task</Button.Success>
        </Container>
      );
    }
  
    /**
     * @description mySQL query called each time the component is loaded
     * @memberof TaskList
     */
    mounted() {
      taskService.getTasks((tasks) => {
        this.tasks = tasks;
      });
    }
  
    /**
     * @description routes to /add
     * @memberof TaskList
     */
    add() {
      history.push('/add/');
    }
  
    /**
     * @description marks an active task as finished
     * @param {number} id
     * @memberof TaskList
     */
    finish(id: number) {
      taskService.finishTask(id, () => {
        history.push('/finished_tasks/');
        history.goBack();
        Alert.success("Task completed, good job!");
      });
    }

    /**
     * @description deletes a task from the mySQL database
     * @param {number} id
     * @memberof TaskList
     */
    remove(id: number) {
      taskService.removeTask(id, () => {
        history.push('/');
        history.goBack();
        Alert.danger("Task removed.");
      });
    }

    /**
     * @description sort method called on table-header click, evaluates what property to sort tasks after - then calls the reOrder()-method as a sort-function
     * @memberof TaskList
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
     * @memberof TaskList
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
 * @description class containing the list of all finished tasks
 * @export
 * exported to index.tsx and routed to /finished_tasks
 * @class FinishedTaskList
 * @extends {Component}
 */
export class FinishedTaskList extends Component {
  /**
   * @description array storing all finished tasks retrieved from mySQL database
   * @type {Task[]}
   * @memberof FinishedTaskList
   */
  tasks: Task[] = [];
  
  /**
   * @description renders /finished_tasks
   * @return {*} 
   * @memberof FinishedTaskList
   */
  render() {
      return (
      <Container>
        <Card title="Your Completed Tasks">
          <Table>
            <THead>
              <Tr>
                <Th><i className="fa fa-angle-double-down" aria-hidden="true"></i></Th>
                <Th pointer onClick={() => { sessionStorage.setItem('sortProp', "name"); this.sort() }}>Task</Th>
                <Th pointer onClick={() => { sessionStorage.setItem('sortProp', "priority"); this.sort() }}>Priority</Th>
                <Th pointer onClick={() => { sessionStorage.setItem('sortProp', "category"); this.sort() }}>Category</Th>
                <Th pointer onClick={() => { sessionStorage.setItem('sortProp', "expires"); this.sort() }}>Deadline</Th>
                <Th>Status</Th>
                <Th>Delete</Th>
              </Tr>
            </THead>
            <TBody>
              {this.tasks.map((task) => {
                let name_overflow = "";
                let badge = "secondary";
                let status = "Finished";
                let status_badge = "success";
                let deadline = "";
                if (task.name.length > 60) {
                  name_overflow = " [...]";
                }
                if (task.priority == "High") {
                  badge = "danger";
                } else if (task.priority == "Medium") {
                  badge = "warning";
                } else {
                  badge = "secondary";
                }
                if (task.expires < 0) {
                  if (task.expires == -1) {
                    deadline = (task.expires * -1) + " day ago";
                  } else {
                    deadline = (task.expires * -1) + " days ago";
                  }
                } else {
                  if (task.expires == 0) {
                    deadline = "Today";
                  } else if (task.expires == 1) {
                    deadline = "In " + task.expires + " day"
                  } else {
                    deadline = "In " + task.expires + " days";
                  }
                }
                return (
                  <React.Fragment key={task.id}>
                    <Tr>
                    <Td width={1}><Button.Expand target={task.id}></Button.Expand></Td>
                      <Td width={6}>{task.name.substring(0,60) + name_overflow}</Td>
                      <Td><Badge badge={badge}>{task.priority}</Badge></Td>
                      <Td>{task.category}</Td>
                      <Td>{deadline}</Td>
                      <Td><Badge badge={status_badge}>{status}</Badge></Td>
                      <Td><Button.Danger onClick={() => this.remove(task.id)}><i className="fa fa-trash" aria-hidden="true"></i></Button.Danger></Td>
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
                          <Button.Warning onClick={() => this.unfinish(task.id)}>Make active</Button.Warning>
                        </CenteredRow>
                      </Td>
                  </CollapsingTr>
                  </React.Fragment>
                )
              })}
            </TBody>
          </Table>
        </Card>
      </Container>
      );
  }
    
  /**
   * @description mySQL query called each time the component is loaded
   * @memberof FinishedTaskList
   */
  mounted() {
      taskService.getFinishedTasks((tasks) => {
      this.tasks = tasks;
      });
  }
  
  /**
   * @description marks a finished task as not finished
   * @param {number} id
   * @memberof FinishedTaskList
   */
  unfinish(id: number) {
    taskService.unfinishTask(id, () => {
      history.push('/tasks/');
      history.goBack();
      Alert.warning("Task marked as not finished.");
    });
  }

  /**
   * @description deletes a task from the mySQL database
   * @param {number} id
   * @memberof FinishedTaskList
   */
  remove(id: number) {
      taskService.removeTask(id, () => {
      history.push('/tasks/');
      history.goBack();
      Alert.danger("Task permanently deleted.");
      });
  }

  /**
   * @description sort method called on table-header click, evaluates what property to sort tasks after - then calls the reOrder()-method as a sort-function
   * @memberof FinishedTaskList
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
   * @memberof FinishedTaskList
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
 * @description class for adding new tasks
 * @export
 * exports to index.tsx and routes to /add
 * @class addTask
 * @extends {Component}
 */
export class AddTask extends Component {
    /**
     * @description generates a task-object for creating new tasks
     * @memberof addTask
     */
    task = new Task();

    /**
     * @description array storing all categories retrieved from mySQL database
     * @type {Category[]}
     * @memberof addTask
     */
    categories: Category[] = [];

    /**
     * @description array storing all priorities retrieved from mySQL database
     * @type {Priority[]}
     * @memberof addTask
     */
    priorities: Priority[] = [];
  
    /**
     * @description renders /add
     * @return {*} 
     * @memberof addTask
     */
    render() {
      return (
        <Container>
          <Card title="Add new task">
            <InputGroup>
              <Form.Input
                type="text"
                value={this.task.name}
                onChange={(event) => (this.task.name = event.currentTarget.value)}
                id="add_task"
                name="Enter a fitting name"
                placeholder="YYYY/MM/DD"
                width="12" 
              />
            </InputGroup>

            <InputGroup>
              <Form.Input
                type="text"
                value={this.task.description}
                onChange={(event) => (this.task.description = event.currentTarget.value)}
                id="add_desc"
                name="Enter a description"
                placeholder="YYYY/MM/DD"
                width="12" 
              />
            </InputGroup>
            
            <InputGroup>
              <Form.Select width="12" id="add_cat" name="Select a category" value={this.task.category_id} onChange={(event) => (this.task.category_id = Number(event.currentTarget.value))}>
                {this.categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </Form.Select>
            </InputGroup>
            
            <InputGroup>
              <Form.Select width="12" id="add_pri" name="Select a priority"value={this.task.priority_id} onChange={(event) => (this.task.priority_id = Number(event.currentTarget.value))}>
                {this.priorities.map((priority) => (
                  <option key={priority.id} value={priority.id}>{priority.name}</option>
                ))}
              </Form.Select>
            </InputGroup>
           
            <InputGroup>
              <Form.Date
                value={this.task.expire_date}
                onChange={(event) => (this.task.expire_date = event.currentTarget.value)}
                id="date"
                name="Enter a date (YYYY/MM/DD)" 
                placeholder="YYYY/MM/DD"
                width="12" 
              />
            </InputGroup>
          </Card>
          <Row>
            <Column>
              <Button.Success onClick={this.add}>Add task</Button.Success>
            </Column>
            <Column right>
              <Button.Light onClick={this.cancel}>Cancel</Button.Light>
            </Column>
          </Row>
        </Container>
      );
    }
  
    /**
     * @description mySQL-queries called each time the component is loaded
     * @memberof addTask
     */
    mounted() {
      categoryService.getCategories((categories) => {
        this.categories = categories;
      });
      priorityService.getPriorities((priorities) => {
        this.priorities = priorities;
      });
    }
  
    /**
     * @description adds a task to the mySQL database
     * @return {*} 
     * @memberof addTask
     */
    add() {
      if(!/^\d{4}\/\d{1,2}\/\d{1,2}$/.test(this.task.expire_date))
          return Alert.warning("Expiration date must be on format: YYYY/MM/DD");
      taskService.addTask(this.task, () => {
        history.push('/tasks/');
      });
      Alert.success("Task added!");
    }
  
    /**
     * @description cancels and routes back to /tasks
     * @memberof addTask
     */
    cancel() {
      history.push('/tasks/');
    }
}

/**
 * @description class for editing a selected task
 * @export
 * exported to index.tsx and routed to /tasks/:id
 * @class TaskEdit
 * @extends {Component<{ match: { params: { id: string } } }>}
 */
export class TaskEdit extends Component<{ match: { params: { id: string } } }> {
    /**
     * @description tasks-object to store the properties of the selected category
     * @memberof TaskEdit
     */
    task = new Task();

    /**
     * @description array storing all categories retrieved from mySQL database
     * @type {Category[]}
     * @memberof TaskEdit
     */
    categories: Category[] = [];

    /**
     * @description array storing all priorities retrieved from mySQL database
     * @type {Priority[]}
     * @memberof TaskEdit
     */
    priorities: Priority[] = [];

    /**
     * @description renders /tasks/:id
     * @return {*} 
     * @memberof TaskEdit
     */
    render() {
        return (
          <Container>
            <Card title="Edit task">
              <InputGroup>
                <Form.Input
                  type="text"
                  value={this.task.name}
                  onChange={(event) => (this.task.name = event.currentTarget.value)}
                  id="edit_task"
                  name="Enter a fitting name"
                  placeholder="Enter a fitting name"
                  width="6" 
                />

                <Form.Select width="6" id="edit_cat" name="Select a category"value={this.task.category_id} onChange={(event) => (this.task.category_id = Number(event.currentTarget.value))}>
                  {this.categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </Form.Select>
              </InputGroup>
              
              <InputGroup>
                <Form.Input
                  type="text"
                  value={this.task.description}
                  onChange={(event) => (this.task.description = event.currentTarget.value)}
                  id="edit_desc"
                  name="Enter a description"
                  placeholder="Enter a description"
                  width="12"
                />
              </InputGroup>

              <InputGroup>
                <Form.Select width="6" id="edit_pri" name="Select a priority"value={this.task.priority_id} onChange={(event) => (this.task.priority_id = Number(event.currentTarget.value))}>
                  {this.priorities.map((priority) => (
                  <option key={priority.id} value={priority.id}>{priority.name}</option>
                  ))}
                </Form.Select>

                <Form.Date
                  value={this.task.expire_date}
                  onChange={(event) => (this.task.expire_date = event.currentTarget.value)}
                  id="date"
                  name="Enter a date [YYYY/MM/DD]" 
                  placeholder="Enter a date [YYYY/MM/DD]"
                  width="6" 
                />
              </InputGroup>
              
              <InputGroup>
                <Form.Select width="12" id="edit_status" name="Set status.."value={this.task.finished} onChange={(event) => (this.task.finished = Number(event.currentTarget.value))}>
                  <option value={0}>Active</option>
                  <option value={1}>Finished</option>
                </Form.Select>
              </InputGroup>
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
        );
    }

    /**
     * @description mySQL-queries called each time the component is loaded
     * @memberof TaskEdit
     */
    mounted() {
        taskService.getTask(Number(this.props.match.params.id), (task) => {
        this.task = task;
        });
        categoryService.getCategories((categories) => {
        this.categories = categories;
        });
        priorityService.getPriorities((priorities) => {
        this.priorities = priorities;
        });
    }

    /**
     * @description saves changes to the selected task
     * @return {*} 
     * @memberof TaskEdit
     */
    save() {
        if(!/^\d{4}\/\d{1,2}\/\d{1,2}$/.test(this.task.expire_date))
            return Alert.warning("Expiration date must be on format: YYYY/MM/DD");
        taskService.updateTask(this.task, () => {
        history.push('/tasks/');
        });
        Alert.info("Task updated.");
    }

    /**
     * @description cancels and routes back to /tasks
     * @memberof TaskEdit
     */
    cancel() { 
        history.push('/tasks/');
    }
}