const storage = (() => {
    const getProjects = () => {
        const projects = localStorage.getItem('projects')
        if (projects === 'undefined') return []
        return JSON.parse(projects) || [] 
    }

    const addProject = (project) => {
        const projects = getProjects()
        projects.push(project)
        localStorage.setItem('projects', JSON.stringify(projects))
    }

    const saveProjects = (projects) => {
        localStorage.setItem('projects', JSON.stringify(projects))
    }


    return { getProjects, addProject ,saveProjects}

})()

export default storage;