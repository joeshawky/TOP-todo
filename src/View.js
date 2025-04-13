import projectManager from './Project'

const View = (() => {
    const projectsSection = document.querySelector('.projects')

    const renderSidebar = () => {
        projectsSection.innerHTML = '';

        const projects = projectManager.getProjects()
        projects.forEach(p => {
            const div = document.createElement('div')
            div.classList.add('project')

            const paragraph = document.createElement('p')
            paragraph.innerText = p

            div.appendChild(paragraph)
            projectsSection.appendChild(div)
        })
    };

    const renderContent = () => {
        // return;
        const viewTitle = document.querySelector('.activeView').textContent
        console.log(viewTitle);

        if (viewTitle === "All Projects") {

        } else if (viewTitle === "Today") {

        }else {
            const projects = projectManager.getProjects()

        }
        


    }

    const renderAll = () => {
        renderSidebar();
        renderContent();
    }

    const handleProjectClick = (e) => {
        // Remove any project with 'active' class
        // const activeProjects = document.querySelectorAll('.activeProject')
        // activeProjects.forEach(elem => elem.classList.remove('activeProject'))

        const activeViews = document.querySelectorAll('.activeView')
        activeViews.forEach(elem => elem.classList.remove('activeView'))

        // Set current project's class to 'active' (highlights bg)
        let element = e.srcElement
        if (element.tagName === 'P') {
            element = element.parentElement
        }
        console.log(element);
        element.classList.add("activeView")

        // Open current project's todo items in content
        const projectTitle = element.innerText
        const todos = projectManager.getTodos(projectTitle)
        renderContent()
        console.log(todos)
    }

    const handleViewClick = (e) => {
        // Remove any project with 'active' class
        let activeViews = document.querySelectorAll('.activeView')
        activeViews.forEach(elem => elem.classList.remove('activeView'))

        // Check which view is coming from 'event'
        // Set current view's class to active (highlights bg)
        // Open current project's todo items in content
        console.log(e);
    }

    const showProjectInput = () => {
        const newProjectDiv = document.querySelector('.projectPrompt')
        newProjectDiv.style.opacity = 1
        newProjectDiv.style.visibility = 'visible'
        newProjectDiv.style.height = 'auto'
    }

    const hideProjectInput = () => {
        const newProjectDiv = document.querySelector('.projectPrompt')
        newProjectDiv.style.opacity = 0
        newProjectDiv.style.visibility = "hidden"
        newProjectDiv.style.height = 0
    }


    const handleNewProjectClick = () => {
        showProjectInput()
    }

    const handleNewTodoClick = () => {
        console.log();
    }

    const handleNewProjectConfirmBtn = () => {
        const projectName = document.querySelector('#projectName').value

        // validate project name
        // add new project using projectManager
        console.log(projectName);
    }

    const handleNewProjectDeclineBtn = () => {
        hideProjectInput()
    }

    const initEventHandlers = () => {
        const projectBtns = document.querySelectorAll('.projects')
        projectBtns.forEach(pe => pe.addEventListener('click', handleProjectClick))

        const viewBtns = document.querySelectorAll('.view')
        viewBtns.forEach(v => v.addEventListener('click', handleViewClick))

        const newProjectBtn = document.querySelector('.newProject')
        newProjectBtn.addEventListener('click', handleNewProjectClick)
        
        const newTodoBtn = document.querySelector('.newItem')
        newTodoBtn.addEventListener('click', handleNewTodoClick)

        const newProjectConfirmBtn = document.querySelector('.confirm')
        newProjectConfirmBtn.addEventListener('click', handleNewProjectConfirmBtn)

        const newProjectdeclineBtn = document.querySelector('.decline')
        newProjectdeclineBtn.addEventListener('click', handleNewProjectDeclineBtn)


    }

    const init = () => {
        initEventHandlers();
        renderAll();
    }


    return { init, renderSidebar, renderContent, renderAll }
})()

export default View;

