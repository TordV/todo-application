import { pool } from './mysql-pool';

/**
 * @description Task-class, tasks are stored as objects of the Task-class
 * @export
 * @class Task
 */
export class Task {
  id: number = 0;
  name: string = "";
  description: string = "";
  priority_id: number = 1;
  priority: string = "";
  category_id: number = 1;
  category: string = "";
  expire_date: string = "";
  expires: number = 0;
  finished: number = 0;
}

/**
 * @description Note-class, notes are stored as objects of the Note-class
 * @export
 * @class Note
 */
export class Note {
  id: number = 0;
  name: string = "";
  description: string = "";
  color: string = "#ffff88";
}

/**
 * @description Category-class, categories are stored as objects of the Category-class
 * @export
 * @class Category
 */
export class Category {
  id: number = 0;
  name: string = "";
}

/**
 * @description Priority-class, priorities are stored as objects of the Priority-class
 * @export
 * @class Priority
 */
export class Priority {
  id: number = 0;
  name: string = "";
}

/**
 * @description class containing mySQL-queries related to tasks
 * @class TaskService
 */
class TaskService {
  /**
   * @description selects all active tasks from the tasks-table
   * @param {(tasks: Task[]) => void} success
   * @memberof TaskService
   */
  getTasks(success: (tasks: Task[]) => void) {
    pool.query('SELECT Tasks.id, Tasks.name, Tasks.description, Tasks.priority_id, Tasks.finished, datediff(Tasks.exp_date , CURRENT_DATE()) AS expires, Priorities.name AS priority, Categories.name AS category FROM Tasks INNER JOIN Priorities ON (Priorities.id = Tasks.priority_id) INNER JOIN Categories ON (Categories.id = Tasks.category_id) WHERE Tasks.finished=0 ORDER BY expires', 
    (error, results) => {
      if (error) return console.error(error);

      success(results);
    });
  }

  /**
   * @description selects all active tasks from the tasks-table that expires on the current day
   * @param {(tasks: Task[]) => void} success
   * @memberof TaskService
   */
  getTodaysTasks(success: (tasks: Task[]) => void) {
    pool.query('SELECT Tasks.id, Tasks.name, Tasks.description, Tasks.priority_id, Tasks.finished, datediff(Tasks.exp_date , CURRENT_DATE()) AS expires, Priorities.name AS priority, Categories.name AS category FROM Tasks INNER JOIN Priorities ON (Priorities.id = Tasks.priority_id) INNER JOIN Categories ON (Categories.id = Tasks.category_id) WHERE Tasks.finished=0 AND Tasks.exp_date=CURRENT_DATE()', 
    (error, results) => {
      if (error) return console.error(error);

      success(results);
    });
  }


  /**
   * @description selects all finished tasks from the tasks-table
   * @param {(tasks: Task[]) => void} success
   * @memberof TaskService
   */
  getFinishedTasks(success: (tasks: Task[]) => void) {
    pool.query('SELECT Tasks.id, Tasks.name, Tasks.description, Tasks.priority_id, Tasks.finished, datediff(Tasks.exp_date , CURRENT_DATE()) AS expires, Priorities.name AS priority, Categories.name AS category FROM Tasks INNER JOIN Priorities ON (Priorities.id = Tasks.priority_id) INNER JOIN Categories ON (Categories.id = Tasks.category_id) WHERE Tasks.finished=1 ORDER BY expires', 
    (error, results) => {
      if (error) return console.error(error);

      success(results);
    });
  }

  /**
   * @description selects a task from the tasks-table by task-id
   * @param {number} id
   * @param {(task: Task) => void} success
   * @memberof TaskService
   */
  getTask(id: number, success: (task: Task) => void) {
    pool.query('SELECT Tasks.id, Tasks.name, Tasks.description, Tasks.category_id, Tasks.priority_id, Tasks.finished, DATE_FORMAT(Tasks.exp_date, "%Y/%m/%d") AS expire_date, Priorities.name AS priority, Categories.name AS category FROM Tasks INNER JOIN Priorities ON (Priorities.id = Tasks.priority_id) INNER JOIN Categories ON (Categories.id = Tasks.category_id) WHERE Tasks.id=?', 
    [id], (error, results) => {
      if (error) return console.error(error);

      success(results[0]);
    });
  }

  /**
   * @description update a task in the task-table
   * @param {Task} task
   * @param {() => void} success
   * @memberof TaskService
   */
  updateTask(task: Task, success: () => void) {
    pool.query(
      'UPDATE Tasks SET name=?, description=?, category_id=?, priority_id=?, exp_date=?, finished=? WHERE id=?',
      [task.name, task.description, task.category_id, task.priority_id, task.expire_date, task.finished, task.id],
      (error, results) => {
        if (error) return console.error(error);

        success();
      }
    );
  }

  /**
   * @description updates a task as finished in the task-table
   * @param {number} id
   * @param {() => void} success
   * @memberof TaskService
   */
  finishTask(id: number, success: () => void) {
    pool.query(
      'UPDATE Tasks SET finished=1 WHERE id=?', 
      [id], (error, results) => {
        if (error) return console.error(error);

        success();
      }
    );
  }

  /**
   * @description updates a task af not finished in the task-table
   * @param {number} id
   * @param {() => void} success
   * @memberof TaskService
   */
  unfinishTask(id: number, success: () => void) {
    pool.query(
      'UPDATE Tasks SET finished=0 WHERE id=?', 
      [id], (error, results) => {
        if (error) return console.error(error);

        success();
      }
    );
  }

  /**
   * @description deletes a task from the task-table
   * @param {number} id
   * @param {() => void} success
   * @memberof TaskService
   */
  removeTask(id: number, success: () => void) {
    pool.query(
      'DELETE FROM Tasks WHERE id=?', 
      [id], (error, results) => {
        if (error) return console.error(error);

        success();
      }
    );
  }

  /**
   * @description adds a task to the task-table
   * @param {Task} task
   * @param {() => void} success
   * @memberof TaskService
   */
  addTask(task: Task, success: () => void) {
    pool.query(
      'INSERT INTO Tasks (id, name, description, priority_id, category_id, exp_date, finished) VALUES (NULL, ?, ?, ?, ?, ?, 0)',
      [task.name, task.description, task.priority_id, task.category_id, task.expire_date],
      (error, results) => {
        if (error) return console.error(error);

        success();
      }
    );
  }

  /**
   * @description counts total tasks in the tasks-table
   * @param {(count: number) => void} success
   * @memberof TaskService
   */
  countTotalTasks(success: (count: number) => void) {
    pool.query(
      'SELECT COUNT(*) AS total_tasks FROM Tasks',
      (error, results) => {
        if (error) return console.error(error);

        success(results[0].total_tasks);
      }
    );
  }

  /**
   * @description counts finished tasks in the tasks-table
   * @param {(count: number) => void} success
   * @memberof TaskService
   */
  countFinishedTasks(success: (count: number) => void) {
    pool.query(
      'SELECT COUNT(*) AS finished_tasks FROM Tasks WHERE finished=1',
      (error, results) => {
        if (error) return console.error(error);

        success(results[0].finished_tasks);
      }
    );
  }

}

export let taskService = new TaskService();

/**
 * @description class containing mySQL-queries related to notes
 * @class NoteService
 */
class NoteService {
  /**
   * @description selects all notes from the notes-table
   * @param {(notes: Note[]) => void} success
   * @memberof NoteService
   */
  getNotes(success: (notes: Note[]) => void) {
    pool.query('SELECT * FROM Notes ORDER BY id', 
    (error, results) => {
      if (error) return console.error(error);

      success(results);
    });
  }

  /**
   * @description selects a note from the notes-table by note-id
   * @param {number} id
   * @param {(note: Note) => void} success
   * @memberof NoteService
   */
  getNote(id: number, success: (note: Note) => void) {
    pool.query('SELECT * FROM Notes WHERE id=?', 
    [id], (error, results) => {
      if (error) return console.error(error);

      success(results[0]);
    });
  }

  /**
   * @description updates a note in the note-table
   * @param {Note} note
   * @param {() => void} success
   * @memberof NoteService
   */
  updateNote(note: Note, success: () => void) {
    pool.query(
      'UPDATE Notes SET name=?, description=?, color=? WHERE id=?',
      [note.name, note.description, note.color, note.id],
      (error, results) => {
        if (error) return console.error(error);

        success();
      }
    );
  }

  /**
   * @description deletes a note from the note-table
   * @param {number} id
   * @param {() => void} success
   * @memberof NoteService
   */
  removeNote(id: number, success: () => void) {
    pool.query(
      'DELETE FROM Notes WHERE id=?', 
      [id], (error, results) => {
        if (error) return console.error(error);

        success();
      }
    );
  }

  /**
   * @description adds a note to the task-table
   * @param {Note} note
   * @param {() => void} success
   * @memberof NoteService
   */
  addNote(note: Note, success: () => void) {
    pool.query(
      'INSERT INTO Notes (id, name, description, color) VALUES (NULL, ?, ?, ?)',
      [note.name, note.description, note.color],
      (error, results) => {
        if (error) return console.error(error);

        success();
      }
    );
  }
}

export let noteService = new NoteService();

/**
 * @description class containing mySQL-queries related to categories
 * @class CategoryService
 */
class CategoryService {
  /**
   * @description selects all categories from the categories-table
   * @param {(categories: Category[]) => void} success
   * @memberof CategoryService
   */
  getCategories(success: (categories: Category[]) => void) {
    pool.query('SELECT * FROM Categories', 
    (error, results) => {
      if (error) return console.error(error);

      success(results);
    });
  }

  /**
   * @description selects all active tasks from the tasks-table 
   * @param {(tasks: Task[]) => void} success
   * @memberof CategoryService
   */
  getTasks(success: (tasks: Task[]) => void) {
    pool.query('SELECT Tasks.id, Tasks.name, Tasks.description, Tasks.priority_id, Tasks.category_id, Tasks.finished, datediff(Tasks.exp_date , CURRENT_DATE()) AS expires, Priorities.name AS priority, Categories.name AS category FROM Tasks INNER JOIN Priorities ON (Priorities.id = Tasks.priority_id) INNER JOIN Categories ON (Categories.id = Tasks.category_id) WHERE Tasks.finished=0 ORDER BY expires', 
    (error, results) => {
      if (error) return console.error(error);

      success(results);
    });
  }

  /**
   * @description selects a category from the category-table by category id
   * @param {number} id
   * @param {(category: Category) => void} success
   * @memberof CategoryService
   */
  getCategory(id: number, success: (category: Category) => void) {
    pool.query('SELECT * FROM Categories WHERE id=?', 
    [id], (error, results) => {
      if (error) return console.error(error);

      success(results[0]);
    });
  }

  /**
   * @description adds a category to the categories-table
   * @param {Category} category
   * @param {() => void} success
   * @memberof CategoryService
   */
  addCategory(category: Category, success: () => void) {
    pool.query(
      'INSERT INTO Categories (id, name) VALUES (NULL, ?)',
      [category.name],
      (error, results) => {
        if (error) return console.error(error);

        success();
      }
    );
  }

  /**
   * @description deletes a category from the categories-table
   * @param {number} id
   * @param {() => void} success
   * @memberof CategoryService
   */
  removeCategory(id: number, success: () => void) {
    pool.query(
      'DELETE FROM Categories WHERE id=?', 
      [id], (error, results) => {
        if (error) return console.error(error);

        success();
      }
    );
  }

  /**
   * @description updates a category from the categories-table
   * @param {Category} category
   * @param {() => void} success
   * @memberof CategoryService
   */
  updateCategory(category: Category, success: () => void) {
    pool.query(
      'UPDATE Categories SET name=? WHERE id=?',
      [category.name, category.id],
      (error, results) => {
        if (error) return console.error(error);

        success();
      }
    );
  }
}

export let categoryService = new CategoryService();

/**
 * @description class containing mySQL-queries related to priorities
 * @class PriorityService
 */
class PriorityService {
  /**
   * @description selects all priorities from the priorities table
   * @param {(priorities: Priority[]) => void} success
   * @memberof PriorityService
   */
  getPriorities(success: (priorities: Priority[]) => void) {
    pool.query('SELECT * FROM Priorities', 
    (error, results) => {
      if (error) return console.error(error);

      success(results);
    });
  }
}

export let priorityService = new PriorityService();