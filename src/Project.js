const Projects = [
    {
        'title': "Homeworks",
        'todoItems': [
            {
                "title": "do schience homework",
                "description": "teacher wants etc etc"
            },
        ]
    },
    {
        'title': "School",
        'todoItems': []
    },
    {
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
        console.log("GETING PROJECTS");
        return Object.keys(Projects);
    }

    const getTodosByProjectName = (projectName) => {
        return {projectName: Projects[projectName]}
    }

    const getProjectsAndTodos = () => {
        return Projects
    }

    const getProjectsDeadlineToday = () => {
        const res = {}
        return res
    }


    return { getAllProjects, getTogetTodosByProjectNamedos }
})()

export default projectManager;