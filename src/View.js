import projectManager from './Project'

const View = (() => {
    const projectsSection = document.querySelector('.projects')

    const renderSidebar = () => {
        projectsSection.innerHTML = '';

        const projects = projectManager.getAllProjects()
        console.log(projects);

        projects.forEach(p => {
            const div = document.createElement('div')
            div.classList.add('project')
            div.setAttribute('projectId', p.id)

            const paragraph = document.createElement('p')
            paragraph.innerText = p.title

            div.appendChild(paragraph)
            projectsSection.appendChild(div)
        })
    };

    const clearContent = () => {
        const mainDiv = document.querySelector('.main')
        while (!mainDiv.firstElementChild.classList.contains('newItem')) {
            mainDiv.removeChild(mainDiv.firstElementChild);
        }
    }
    const renderContent = () => {
        clearContent();
        const activeElement = document.querySelector('.activeView')
        if (!activeElement) {
            return;
        }
        const mainDiv = document.querySelector('.main')
        const viewTitle = activeElement.textContent.trim()
        if (viewTitle === "All Projects") {
            const projects = projectManager.getAllProjects()
            let html = `<div class="contentTitle">
                <p>${viewTitle}</p>
            </div>`
            projects.forEach(p => {
                html += `<div class="projectCard">
                <div class="title">
                    ${p.title}
                </div>
                <ul class="todoList">`

                p.todoItems.forEach(item => {
                    html += `<li class="todoItem checked">
                        <input type="checkbox" name="done" id="done">
                        <div class="todoItemInfo" todoId=${item.id}>
                            <p>${item.title}</p>
                            <p>${item.dueDate}</p>
                        </div>
                    </li>`
                })

                html += `</ul>
            </div>`
            })

            html += `<div class="newItem">
                <i class="bx bx-plus"></i>
                <p>New Item</p>
            </div>`
            
            mainDiv.innerHTML = html
            const newTodoBtn = document.querySelector('.newItem')
            console.log(`tOODO BTN :${newTodoBtn}`);
            newTodoBtn.addEventListener('click', handleNewTodoClick)
            newTodoBtn.addEventListener('click', () => console.log("CLICKED"))

        } else if (viewTitle === "Today") {
            const projects = projectManager.getAllProjectsDueToday()
            console.log(projects);
            let html = `<div class="contentTitle">
                <p>${viewTitle}</p>
            </div>`
            projects.forEach(p => {
                html += `<div class="projectCard">
                <div class="title">
                    ${p.title}
                </div>
                <ul class="todoList">`

                p.todoItems.forEach(item => {
                    html += `<li class="todoItem checked">
                        <input type="checkbox" name="done" id="done">
                        <div class="todoItemInfo" todoId=${item.id}>
                            <p>${item.title}</p>
                            <p>${item.dueDate}</p>
                        </div>
                    </li>`
                })

                html += `</ul>
            </div>`
            })

            html += `<div class="newItem">
                <i class="bx bx-plus"></i>
                <p>New Item</p>
            </div>`
            
            mainDiv.innerHTML = html
            const newTodoBtn = document.querySelector('.newItem')
            console.log(`tOODO BTN :${newTodoBtn}`);
            newTodoBtn.addEventListener('click', handleNewTodoClick)
            newTodoBtn.addEventListener('click', () => console.log("CLICKED"))

        }else {
            console.log("ELSE VIEW");
            const projectId = activeElement.getAttribute('projectId')
            const todos = projectManager.getTodosByProjectId(projectId)
            let html = `<div class="contentTitle">
                <p>Project content</p>
            </div>
            <div class="projectCard">
                <div class="title">
                    ${viewTitle}
                </div>
                <ul class="todoList">`

            todos.forEach(todo => {
                html += `<li class="todoItem checked">
                        <input type="checkbox" name="done" id="done">
                        <div class="todoItemInfo">
                            <p>${todo.title}</p>
                            <p>01/04/2025</p>
                        </div>
                    </li>`
            })
            html += `</ul>
            </div>
            <div class="newItem">
                <i class="bx bx-plus"></i>
                <p>New Item</p>
            </div>`
            
            mainDiv.innerHTML = html
            const newTodoBtn = document.querySelector('.newItem')
            newTodoBtn.addEventListener('click', handleNewTodoClick)
        }

        initTodoEventHandlers()
    }

    const initTodoEventHandlers = () => {
        const todos = document.querySelectorAll('.todoItemInfo')
        todos.forEach(todo => todo.addEventListener('click', handleTodoInfoClick))
    }

    const handleTodoInfoClick = (e) => {
        console.log("CLICKED ");
        const todoId = e.currentTarget.getAttribute('todoId');

        openEditTodoPage(todoId)
    }

    const assignValuesToForm = (todoId) => {
        const popupTitle = document.querySelector('#popupTitle')
        popupTitle.innerText = "Update todo"
        const submitBtn = document.querySelector('#submitBtn')
        submitBtn.innerText = "Modify"
        const idInput = document.querySelector('#todoId')
        idInput.value = todoId

        const {id, description, title, projectId, dueDate} = projectManager.getTodosById(todoId)

        const todoTitleElem = document.querySelector('#todoTitle')
        todoTitleElem.value = title
        const todoDescriptionElem = document.querySelector('#todoDescription')
        todoDescriptionElem.value = description
        const todoDateElem = document.querySelector('#todoDate')
        todoDateElem.value = dueDate

        populateProjectOptions()
        const todoProjectElem = document.querySelector('#projectId')
        const projectOptions = todoProjectElem.querySelectorAll('option')
        projectOptions.forEach(po => {
            console.log(projectOptions);
            if (po.value === projectId)
                po.setAttribute('selected', '')
            else
                po.removeAttribute('selected')
        })
    }


    const openEditTodoPage = (todoId) => {
        resetProjectOptions()
        assignValuesToForm(todoId);
        showNewTodoPopupForm()
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
        element.classList.add("activeView")
        console.log(element);

        // Open current project's todo items in content
        const projectTitle = element.innerText
        const projectId = element.getAttribute('projectId')
        // document.querySelector().
        const todos = projectManager.getTodosByProjectId(projectId)
        console.log(`BY ID:`, todos)
        renderContent()
    }

    const handleViewClick = (e) => {
        // Remove any project with 'active' class
        let activeViews = document.querySelectorAll('.activeView')
        activeViews.forEach(elem => elem.classList.remove('activeView'))

        // Set current project's class to 'active' (highlights bg)
        let element = e.srcElement
        if (element.tagName === 'P') {
            element = element.parentElement
        }
        element.classList.add("activeView")
        console.log(element);

        // Check which view is coming from 'event'
        // Set current view's class to active (highlights bg)
        // Open current project's todo items in content
        console.log(e);
        renderContent()
    }

    const showProjectInput = () => {
        const newProjectDiv = document.querySelector('.projectPrompt')
        newProjectDiv.removeAttribute('style')
        newProjectDiv.classList.add('show')
        newProjectDiv.classList.remove('hide')
    }
    
    const hideProjectInput = () => {
        const newProjectDiv = document.querySelector('.projectPrompt')
        newProjectDiv.removeAttribute('style')
        newProjectDiv.classList.remove('show')
        newProjectDiv.classList.add('hide')
    }

    const clearProjectInput = () => {
        document.querySelector('#projectName').value = ''
    }


    const handleNewProjectClick = () => {
        showProjectInput()
    }

    

    const handleNewProjectConfirmBtn = () => {
        const projectName = document.querySelector('#projectName').value

        // add new project using projectManager
        projectManager.createNewProject(projectName)

        clearProjectInput()
        hideProjectInput()
        renderAll()
        initProjectsEventHandlers()
    }

    const initProjectsEventHandlers = () => {
        const projectBtns = document.querySelectorAll('.project')
        projectBtns.forEach(pe => pe.addEventListener('click', handleProjectClick))

        const viewBtns = document.querySelectorAll('.view')
        viewBtns.forEach(v => v.addEventListener('click', handleViewClick))
    }

    const handleNewProjectDeclineBtn = () => {
        clearProjectInput()
        hideProjectInput()
    }

    const showNewTodoPopupForm = () => {
        const popupForm = document.querySelector('.newItemPopup')
        

        popupForm.removeAttribute('style')
        popupForm.classList.remove('hide')
        popupForm.classList.add('show')
    }
    
    const hideNewTodoPopupForm = () => {
        const popupForm = document.querySelector('.newItemPopup')
        popupForm.removeAttribute('style')
        popupForm.classList.add('hide')
        popupForm.classList.remove('show')
    }

    const populateProjectOptions = () => {
        const projectsSelection = document.querySelector('#projectId');
        const projects = projectManager.getAllProjects()
        console.log(projects);
        projects.forEach(p => {
            const optionElem = document.createElement('option')
            optionElem.value = p.id
            optionElem.innerHTML = p.title
            projectsSelection.appendChild(optionElem)
        })

    }
    const handleNewTodoClick = () => {
        const popupTitle = document.querySelector('#popupTitle')
        popupTitle.innerText = "New todo"
        const submitBtn = document.querySelector('#submitBtn')
        submitBtn.innerText = "Add"
        resetProjectOptions();
        showNewTodoPopupForm();
        populateProjectOptions();
    }

    

    const handleNewTodoSubmitBtn = (e) => {  
        e.preventDefault()
        const data = new FormData(e.target);
        const { todoId, projectId, todoTitle, todoDescription, todoDate } = Object.fromEntries(data.entries());
        if (todoId) {
            projectManager.updateTodo(todoId, todoTitle, todoDescription, todoDate, projectId)
            
        }else{
            projectManager.createTodo(todoTitle, todoDescription, todoDate, projectId)
        }
        hideNewTodoPopupForm();
        renderContent()
    }

    const resetProjectOptions = (elem) => {
        const projectOptions = document.querySelector('#projectId')
        const placeholderOption = document.createElement('option')
        placeholderOption.innerText = 'Select project'
        placeholderOption.setAttribute('value', '')
        placeholderOption.setAttribute('disabled', '')
        placeholderOption.setAttribute('selected', '')
        placeholderOption.setAttribute('hidden', '')
        projectOptions.innerHTML = ''
        projectOptions.appendChild(placeholderOption);
    }
    
    const clearForm = () => {
        const form = document.querySelector('.formItems')
        form.reset()
        const projectsSelection = document.querySelector('#projectId');
        resetProjectOptions(projectsSelection)
    }

    const handleNewTodoCancelBtn = () => {  
        clearForm()
        hideNewTodoPopupForm()
    }

    const initEventHandlers = () => {
        initProjectsEventHandlers()

        const sidebar = document.querySelector('.sidebar')

        const collapseBtn = document.querySelector('#collapseBtn')
            collapseBtn.onclick = () => {
            sidebar.classList.toggle('active')
            }

        const newProjectBtn = document.querySelector('.newProject')
        newProjectBtn.addEventListener('click', handleNewProjectClick)
        
        const newTodoBtn = document.querySelector('.newItem')
        newTodoBtn.addEventListener('click', handleNewTodoClick)

        const newTodoSubmitBtn = document.querySelector('.formItems')
        newTodoSubmitBtn.addEventListener('submit', handleNewTodoSubmitBtn)

        const newTodoCancelBtn = document.querySelector('#cancelBtn')
        newTodoCancelBtn.addEventListener('click', handleNewTodoCancelBtn)

        const newProjectConfirmBtn = document.querySelector('.confirm')
        newProjectConfirmBtn.addEventListener('click', handleNewProjectConfirmBtn)

        const newProjectdeclineBtn = document.querySelector('.decline')
        newProjectdeclineBtn.addEventListener('click', handleNewProjectDeclineBtn)
    }

    const init = () => {
        renderAll();
        initEventHandlers();
    }


    return { init, renderSidebar, renderContent, renderAll }
})()

export default View;

