import projectManager from './Project'
import todoManager from './Todo'

const View = (() => {
    const projectsSection = document.querySelector('.projects')

    const renderSidebar = () => {
        projectsSection.innerHTML = '';

        const projects = projectManager.getAllProjects()

        projects.forEach(p => {
            const div = document.createElement('div')
            div.classList.add('project')
            div.setAttribute('projectId', p.id)

            const paragraph = document.createElement('p')
            paragraph.innerText = p.title

            const button = document.createElement('button')
            button.innerText = 'X'
            button.classList.add('removeProject')
            button.setAttribute('projectId', p.id)

            div.append(paragraph, button)
            projectsSection.appendChild(div)
        })
    };

    const renderContent = () => {
        const mainDiv = document.querySelector('.main')
        mainDiv.innerHTML = ''

        const activeElement = document.querySelector('.activeView')
        if (!activeElement) return;
        
        const viewTitle = activeElement.querySelector('p').textContent.trim()

        const allProjectsView = viewTitle === "All Projects"
        const todayProjectsView = viewTitle === "Today";

        let projects;
        if (allProjectsView) {
            projects = projectManager.getAllProjects()
        } else if (todayProjectsView) {
            projects = projectManager.getAllProjectsDueToday()
        } else {
            const projectId = activeElement.getAttribute('projectId')
            projects = [projectManager.getProjectById(projectId)]
        }

        mainDiv.innerHTML = contentHtml(viewTitle, projects)
        const newTodoBtn = document.querySelector('.newItem')
        newTodoBtn.addEventListener('click', handleNewTodoClick)
        initTodoEventHandlers()
    }

    const contentHtml = (pageTitle, projects) => {
        let html = contentTitleDivHtml(pageTitle)
        projects.forEach(p => {
            html += projectHtml(p.title, p.todoItems)
        })
        html += newTodoBtnHtml()
        return html;
    }
    const contentTitleDivHtml = (pageTitle) => {
        return `<div class="contentTitle">
                <p>${pageTitle}</p>
            </div>`
    }
    const newTodoBtnHtml = () => {
        return `<div class="newItem">
            <i class="bx bx-plus"></i>
                <p>New Item</p>
            </div>`
    }

    const projectHtml = (projectTitle, todoItems) => {
        let html = `<div class="projectCard">
                <div class="title">
                    ${projectTitle}
                </div>
                <ul class="todoList">`

        todoItems.forEach(todo => {
            html += todoHtml(todo.id, todo.title, todo.dueDate, todo.completed)
        })

        html += `</ul>
            </div>`

        return html;
    }

    const todoHtml = (todoId, todoTitle, todoDueDate, completed) => {
        return `<li class="todoItem">
                <input todoId=${todoId} class="completedCheckboxes" type="checkbox" name="done" id="done" ${completed ? 'checked' : ''}>
                <div class="todoItemInfo" todoId=${todoId}>
                <p>${todoTitle}</p>
                    <div class="dateAndBtn">
                        <p>${todoDueDate}</p>
                        <button class="removeTodo" todoId=${todoId}>X</button>
                    </div>
                </div>
            </li>`
    }

    const initTodoEventHandlers = () => {
        const todos = document.querySelectorAll('.todoItemInfo')
        todos.forEach(todo => todo.addEventListener('click', handleTodoInfoClick))

        const projectRemoveBtns = document.querySelectorAll('.removeTodo')
        projectRemoveBtns.forEach(btn => btn.addEventListener('click', handleTodoRemoveClick))

        const checkboxes = document.querySelectorAll('.completedCheckboxes')
        checkboxes.forEach(cb => cb.addEventListener('change', handleCompletedStateChange))
    }

    const handleTodoInfoClick = (e) => {
        const todoId = e.currentTarget.getAttribute('todoId');

        openEditTodoPage(todoId)
    }

    const populateFormFields = ({ id = '', title = '', description = '', dueDate = '', projectId = '' }) => {
        document.querySelector('#todoId').value = id;
        document.querySelector('#todoTitle').value = title;
        document.querySelector('#todoDescription').value = description;
        document.querySelector('#todoDate').value = dueDate;

        populateProjectOptions();
        const projectSelect = document.querySelector('#projectId');
        const options = projectSelect.querySelectorAll('option');

        options.forEach(opt => {
            if (opt.value === projectId) {
                opt.setAttribute('selected', '');
            } else {
                opt.removeAttribute('selected');
            }
        });
    }

    const openEditTodoPage = (todoId) => {
        setFormHeader('update')
        resetTodoProjectSelections()
        // assignValuesToForm(todoId);
        const todo = projectManager.getTodoById(todoId);
        populateFormFields(todo)
        showNewTodoPopupForm()
    }

    const renderAll = () => {
        renderSidebar();
        renderContent();
    }

    const handleViewClick = (e) => {
        let activeViews = document.querySelectorAll('.activeView')
        activeViews.forEach(elem => elem.classList.remove('activeView'))
        
        let element = e.srcElement
        if (element.tagName === 'P') {
            element = element.parentElement
        }
        element.classList.add("activeView")
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

        document.querySelector('#projectName').value = ''
        hideProjectInput()
        renderAll()
        initProjectsEventHandlers()
    }

    const initProjectsEventHandlers = () => {
        const projectBtns = document.querySelectorAll('.project')
        projectBtns.forEach(pe => pe.addEventListener('click', handleViewClick))

        const viewBtns = document.querySelectorAll('.view')
        viewBtns.forEach(v => v.addEventListener('click', handleViewClick))

        const projectRemoveBtns = document.querySelectorAll('.removeProject')
        projectRemoveBtns.forEach(btn => btn.addEventListener('click', handleProjectRemoveClick))
    }

    const handleProjectRemoveClick = (e) => {
        e.stopPropagation()
        const projectId = e.target.getAttribute('projectId')
        projectManager.removeProjectById(projectId)
        renderAll()
        initProjectsEventHandlers()
    }

    const handleTodoRemoveClick = (e) => {
        e.stopPropagation()
        const todoId = e.target.getAttribute('todoId')
        todoManager.removeTodoById(todoId)
        renderAll()
        initTodoEventHandlers()
        initProjectsEventHandlers()
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
        projects.forEach(p => {
            const optionElem = document.createElement('option')
            optionElem.value = p.id
            optionElem.innerHTML = p.title
            projectsSelection.appendChild(optionElem)
        })

    }

    const setFormHeader = (mode='create') => {
        const popupTitle = document.querySelector('#popupTitle');
        const submitBtn = document.querySelector('#submitBtn');

        if (mode === 'create') {
            popupTitle.innerText = 'New todo';
            submitBtn.innerText = 'Add';
        } else {
            popupTitle.innerText = 'Update todo';
            submitBtn.innerText = 'Modify';
        }
    }

    const handleNewTodoClick = () => {
        setFormHeader('create')
        resetTodoProjectSelections();
        showNewTodoPopupForm();
        populateFormFields({})
    }

    const handleNewTodoSubmitBtn = (e) => {  
        e.preventDefault()
        const data = new FormData(e.target);
        const { todoId, projectId, todoTitle, todoDescription, todoDate } = Object.fromEntries(data.entries());
        if (todoId) {
            projectManager.updateTodo(todoId, todoTitle, todoDescription, todoDate, projectId)
        }else{
            todoManager.createTodo(todoTitle, todoDescription, todoDate, projectId)
        }
        clearForm()
        hideNewTodoPopupForm();
        renderContent()
    }

    const resetTodoProjectSelections = () => {
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
        resetTodoProjectSelections()
    }

    const handleNewTodoCancelBtn = () => {  
        clearForm()
        hideNewTodoPopupForm()
    }

    const handleCompletedStateChange = (e) => {
        const todoId = e.target.getAttribute('todoId')
        const checked = e.target.checked
        projectManager.updateTodoCompleteState(todoId, checked)
    }

    const initEventHandlers = () => {
        initProjectsEventHandlers()
        initTodoEventHandlers()

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