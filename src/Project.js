import storage from "./storage";
import todoManager from "./Todo";

const projectManager = (() => {
    const getAllProjects = () => {
        // return Projects;
        return storage.getProjects()
    }

    const getAllProjectsDueToday = () => {
        const today = new Date().toLocaleDateString('en-CA'); // 'YYYY-MM-DD' in user's local time
        const projects = storage.getProjects()

        return projects
            .map(project => {
            const filteredTodos = project.todoItems.filter(todo => todo.dueDate === today);
            if (filteredTodos.length > 0) {
                return {
                ...project,
                todoItems: filteredTodos
                };
            }
            return null;
            })
            .filter(Boolean); // Remove nulls
    }

    

    const constructProject = (projectName) => {
        projectName = projectName.trim()
        if (!projectName) return;
        const projects = storage.getProjects()
        const projectExists = projects.map(p => p.title).includes(projectName)
        if (projectExists) return;
        return {
            "id": crypto.randomUUID(),
            'title': projectName,
            'todoItems': []
        }
    }

    const createNewProject = (projectName) => {
        const newProject = constructProject(projectName)
        if (!newProject) return;

        storage.addProject(newProject)
    }


    const getTodoById = (todoId) => {
        const projects = storage.getProjects()
        const todo = projects.flatMap(p => p.todoItems).find(t => t.id === todoId)
        const projectWithTodo = projects.find(project =>
                                project.todoItems.some(todo => todo.id === todoId));

        return {...todo, projectId: projectWithTodo.id}
    }

    const updateTodo = (id, title, description, dueDate,  projectId) => {
        const projects = storage.getProjects()

        const todo = projects.flatMap(p => p.todoItems)
                .find(todo => todo.id === id);

        todoManager.updateTodo(todo, title, description, dueDate)

        let movedTodo = null;
        projects.forEach(project => {
            const index = project.todoItems.findIndex(todo => todo.id === id);
            if (index !== -1) {
              movedTodo = project.todoItems.splice(index, 1)[0]; // remove and store
            }
          });
        
        if (!movedTodo) {
        console.warn("Todo not found");
        return;
        }
    
        // Step 2: Add the todo to the destination project
        const destination = projects.find(p => p.id === projectId);
        if (!destination) {
        console.warn("Destination project not found");
        return;
        }
    
        destination.todoItems.push(movedTodo);
        storage.saveProjects(projects)
    }

    const getProjectById = (projectId) => {
        const projects = storage.getProjects()
        return projects.find(p => p.id === projectId)
    }

    const removeProjectById = (projectId) => {
        let projects = storage.getProjects()
        projects = projects.filter(p => p.id !== projectId)
        storage.saveProjects(projects)
    }

    const updateTodoCompleteState = (todoId, state) => {
        const projects = storage.getProjects()

        const todo = projects.flatMap(p => p.todoItems)
                .find(todo => todo.id === todoId);

        todo.completed = state;

        storage.saveProjects(projects)
    }
    return { updateTodoCompleteState, removeProjectById, getProjectById, updateTodo,  getTodoById, createNewProject, getAllProjects, getAllProjectsDueToday }
})()

export default projectManager;