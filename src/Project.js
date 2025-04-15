const Projects = [
    {
        'id': "cc6a69da-5138-42d2-825a-558c790fa447",
        'title': "Homeworks",
        'todoItems': [
            {
                'id': '2134e884-3a87-4949-bace-3e295f3e1e79',
                "title": "do schience homework",
                "description": "teacher wants etc etc",
                'dueDate': "2002-11-04"
            },
            {
                'id': '2134e884-1232-4949-bace-3e295f3e1e79',
                "title": "TODAYS TASK",
                "description": "i really dont know..",
                'dueDate': "2025-04-15"
            },
        ]
    },
    {
        "id": "9b77fe32-8a44-4b7e-bb70-4accaa850b6e",
        'title': "School",
        'todoItems': []
    },
    {
        "id": "80d5c708-d118-4226-945e-a590323f9053",
        'title': "Ytu",
        'todoItems': []
    },
];

const projectManager = (() => {
    const createProject = (name) => {
        // Check that project name is unique
    }

    const assignTodoToProject = (todoObj, projectName) => {
        Projects[projectName].push(todoObj)
    }

    const getAllProjects = () => {
        return Projects;
    }

    const getTodosByProjectName = (projectName) => {
        return Projects.filter(p => p.title === projectName)
                        .map(p => p.todoItems)
    }

    const getTodosByProjectId = (id) => {
        return Projects.filter(p => p.id === id)[0].todoItems
    }

    const getProjectsAndTodos = () => {
        return Projects
    }

    const getAllProjectsDueToday = () => {
        const today = new Date().toLocaleDateString('en-CA'); // 'YYYY-MM-DD' in user's local time
        console.log(`today: ${today}`);
        return Projects
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
        const projectExists = Projects.map(p => p.title).includes(projectName)
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

        Projects.push(newProject)
    }

    const getAllProjectsTitles = () => {
        return Projects.map(p => {return {'title': p.title, 'id': p.id}})
    }

    const getTodosProject = (todoId) => {

    }

    const getTodosById = (todoId) => {
        const todo = Projects.flatMap(p => p.todoItems).find(t => t.id === todoId)
        const projectWithTodo = Projects.find(project =>
                                project.todoItems.some(todo => todo.id === todoId));

        return {...todo, projectId: projectWithTodo.id}
    } 

    const updateTodo = (id, title, description, dueDate, projectId) => {
        const todo = Projects.flatMap(p => p.todoItems)
                .find(todo => todo.id === id);
        todo.title = title;
        todo.description = description
        todo.dueDate = dueDate

        let movedTodo = null;
        Projects.forEach(project => {
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
          const destination = Projects.find(p => p.id === projectId);
          if (!destination) {
            console.warn("Destination project not found");
            return;
          }
        
          destination.todoItems.push(movedTodo);


    }

    const createTodo = (title, description, dueDate, projectId) => {
        const todoId = crypto.randomUUID()
        const project = Projects.find(p => p.id === projectId)
        const newTodo = {
            title,
            description,
            dueDate,
            id: todoId
        }
        project.todoItems.push(newTodo)
        console.log(Projects);

    }

    return { updateTodo, createTodo, getTodosById, createNewProject, getAllProjects, getTodosByProjectName, getTodosByProjectId, getAllProjectsDueToday }
})()

export default projectManager;