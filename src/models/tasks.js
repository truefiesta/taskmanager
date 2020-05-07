import {FilterType} from "../const";
import {getTasksByFilter} from "../utils/filter.js";

export default class Tasks {
  constructor() {
    this._tasks = [];
    // Модель должна учитывать текущий фильтр.
    // Установим фильтр по умолчанию.
    this._activeFilterType = FilterType.ALL;

    // Для реализации паттерна Observer. Здесь копятся handlerы, которые будут реагировать
    // на изменение данных. Модель будет вызывать эти коллбэки и говорить, что она обновилась.
    this._dataChangeHandlers = [];
    // Здесь будем хранить коллбэки на изменение фильтров.
    this._filterChangeHandlers = [];
  }

  // Метод для получения задач, учитывающий фильтр.
  getTasks() {
    return getTasksByFilter(this._tasks, this._activeFilterType);
  }

  // Метод для получения всего массива задач из модели задач без фильтров.
  getUnfilteredTasks() {
    return this._tasks;
  }

  // Метод для записи задач.
  setTasks(tasks) {
    this._tasks = Array.from(tasks);
    this._callHandlers(this._dataChangeHandlers);
  }

  // Метод для установки выбранного фильтра и вызова коллбэков при изменении фильтра.
  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }

  // Метод для обновления конкретной задачи. Принимает id обновляемой задачи
  // и обновленную задачу. Реализация метода переносится из BoardController.
  updateTask(id, task) {
    const index = this._tasks.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._tasks = [].concat(this._tasks.slice(0, index), task, this._tasks.slice(index + 1));
    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  // Метод для добавления функции изменения фильтров в масскив коллбэков.
  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  // Метод для установки коллбэка, который будет добавлен в массив коллбэков.
  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  // Метод для вызова коллбэков, если модель изменилась.
  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
