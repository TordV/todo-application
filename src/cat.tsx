import * as React from 'react';
import { Component } from 'react-simplified';
import { NavLink } from 'react-router-dom';
import { Task, taskService } from './services';
import { Category, categoryService } from './services';
import { Alert, Card, Row, Column, Button, Form } from './widgets';
import { Container, SubHeader, CenteredRow, CollapsingRow, InputGroup, Badge } from './widgets';
import { Table, THead, TBody, Tr, CollapsingTr, Th, Td} from './widgets';
import { createHashHistory } from 'history';

/** @type {*} */
const history = createHashHistory();

/**
 * @description class containing the list of all categories and active tasks under those categories
 * @export 
 * exported to index.tsx and routed to /categories
 * @class CategoryList
 * @extends {Component}
 */
export class CategoryList extends Component {
  /**
   * @description array storing all categories retrieved from mySQL database
   * @type {Category[]}
   * @memberof CategoryList
   */
  categories: Category[] = [];

  /**
   * @description array storing all tasks retrieved from mySQL database
   * @type {Task[]}
   * @memberof CategoryList
   */
  tasks: Task[] = [];

  /**
   * @description generates a category-object for creating new categories
   * @memberof CategoryList
   */
  category = new Category();

  /**
   * @description renders /categories
   * @return {*} 
   * @memberof CategoryList
   */
  render() {
    return (
      <Container>
        <Card title="Your Categories">
          {this.categories.map((category) => {
            return (
              <React.Fragment key={category.id}>
                <Card title="">
                  <Row topPadding={2}>
                    <Column width={6}><h5 className="card-title">{category.name}</h5></Column>
                    <Column width={6} right><Button.Expand target={category.id}></Button.Expand></Column>
                    <CollapsingRow id={category.id}>
                      <CenteredRow>
                        <NavLink className="btn btn-secondary" to={'/categories/' + category.id}>Edit this category</NavLink>
                        <Button.Danger onClick={() => this.remove(category.id)}>Delete category</Button.Danger>
                      </CenteredRow>
                    </CollapsingRow>
                    {this.checkForTasks(category.id)}
                  </Row>
                </Card>
                <Row topPadding={4}>
                </Row>
              </React.Fragment>
            )
          })}
        </Card>
        <Card title="Add a new category">
            <Form.InputWithButton value={this.category.name} buttonType="success" onChange={(event) => (this.category.name = event.currentTarget.value)} onClick={this.add} placeholder="Enter a fitting name for your new category">Add category</Form.InputWithButton>
        </Card>
      </Container>
    );
  }

  /**
   * @description mySQL queries called each time the component is loaded
   * @memberof CategoryList
   */
  mounted() {
    categoryService.getCategories((categories) => {
      this.categories = categories;
    });
    categoryService.getTasks((tasks) => {
      this.tasks = tasks;
    });
  }

  /**
   * @description checks for active tasks under a category, and returns either a table of tasks, or a message that no tasks were found
   * @param {number} id
   * @return {*} 
   * @memberof CategoryList
   */
  checkForTasks(id: number) {
    if (this.tasks.some((task) => (task.category_id == id))) {
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
            {this.tasks.filter((task) => (task.category_id == id))
              .map((task) => {
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
                      <Td width={6}>{task.name.substring(0,60) + name_overflow}</Td>
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
                          <Button.Danger onClick={() => this.removeTask(task.id)}>Delete this task</Button.Danger>
                        </CenteredRow>
                      </Td>
                    </CollapsingTr>
                  </React.Fragment>
                );
              }
            )}
          </TBody>
        </Table>
      );
    } else {
      return (
        <SubHeader>You have no active tasks from this category</SubHeader>
      );
    }
  }

  /**
   * @description deletes a category from the mySQL database
   * @param {number} id
   * @memberof CategoryList
   */
  remove(id: number) {
    categoryService.removeCategory(id, () => {
      history.push('/');
      history.goBack();
      Alert.danger("Category removed.");
    });
  }

  /**
   * @description marks an active task as finished
   * @param {number} id
   * @memberof CategoryList
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
   * @memberof CategoryList
   */
  removeTask(id: number) {
    taskService.removeTask(id, () => {
      history.push('/tasks/');
      history.goBack();
      Alert.danger("Task removed.");
    });
  }

  /**
   * @description adds a category to the mySQL database
   * @memberof CategoryList
   */
  add() {
    categoryService.addCategory(this.category, () => {
      history.push('/tasks/');
      history.goBack();
    });
    Alert.success("New category added!");
  }

  /**
   * @description sort method called on table-header click, evaluates what property to sort tasks after - then calls the reOrder()-method as a sort-function
   * @memberof CategoryList
   */
  sort() {
    let sort_prop = sessionStorage.getItem("sortProp");
    let current_sort_prop = sessionStorage.getItem("currentSortProp");
    
    // checks for the selected sort property (sort_prop) (which header the user clicked), and then checks if the app is already sorting by that property (current_sort_prop),
    // this way it can flip from descending to ascending sorting and vice verca. 
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
   * @memberof CategoryList
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
 * @description class for editing a selected category
 * @export
 * exported to index.tsx and routed to /categories/:id
 * @class CategoryEdit
 * @extends {Component<{ match: { params: { id: string } } }>}
 */
export class CategoryEdit extends Component<{ match: { params: { id: string } } }> {
  /**
   * @description category-object to store the properties of the selected category
   * @memberof CategoryEdit
   */
  category = new Category();

  /**
   * @description renders /categories/:id
   * @return {*} 
   * @memberof CategoryEdit
   */
  render() {
    return (
      <Container>
        <Card title="Edit category">
          <InputGroup>
            <Form.Input
              type="text"
              value={this.category.name}
              onChange={(event) => (this.category.name = event.currentTarget.value)}
              id="edit_category"
              name="Enter a fitting name"
              placeholder="Enter a fitting name"
              width="12" 
            />
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
   * @description mySQL query that selects the selected category and stores its properties in the declared category-object
   * @memberof CategoryEdit
   */
  mounted() {
      categoryService.getCategory(Number(this.props.match.params.id), (category) => {
      this.category = category;
      });
  }

  /**
   * @description saves changes to the selected category
   * @memberof CategoryEdit
   */
  save() {
      categoryService.updateCategory(this.category, () => {
      history.push('/categories');
      });
      Alert.info("Category updated.");
  }

  /**
   * @description cancels and routes back to /categories
   * @memberof CategoryEdit
   */
  cancel() {
      history.push('/categories');
  }
}