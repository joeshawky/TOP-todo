import "./style.css"

const sidebar = document.querySelector('.sidebar')
const collapseBtn = document.querySelector('#collapseBtn')
collapseBtn.onclick = () => {
    // sidebar.style.width = '5rem'
    sidebar.classList.toggle('active')
}