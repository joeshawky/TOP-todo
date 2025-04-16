import projectManager from "./Project";
import storage from "./storage";

const TodoManager = (() => {
    const updateTodo = (todo, newTItle, newDescription, newDueDate) => {
        todo.title = newTItle;
        todo.description = newDescription
        todo.dueDate = newDueDate
    }

    const createTodo = (title, description, dueDate, projectId) => {
        const projects = storage.getProjects()
        const todoId = crypto.randomUUID()
        const project = projects.find(p => p.id === projectId)
        const newTodo = {
            title,
            description,
            dueDate,
            completed: false,
            id: todoId
        }
        project.todoItems.push(newTodo)
        storage.saveProjects(projects)
    }

    const removeTodoById = (todoId) => {
        const projects = storage.getProjects()
        projects.forEach(project => {
            const todoIndex = project.todoItems.findIndex(todo => todo.id === todoId)
            if (todoIndex !== -1) project.todoItems.splice(todoIndex, 1)
        })

        storage.saveProjects(projects)
    }

    return { removeTodoById, createTodo, updateTodo }
})()

export default TodoManager;