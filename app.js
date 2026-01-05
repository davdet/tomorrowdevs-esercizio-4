const fetchTasks = async () => {
    const res = await fetch('http://localhost:3000/tasks')
    const tasks = await res.json()
    return tasks
}

const tasks = await fetchTasks()
const table = document.getElementById('tableBody')

const createRow = (task, index) => {
    const row = table.insertRow()
    row.id = `row${index}`
    const title = row.insertCell()
    title.innerHTML = task.title
    const createdAt = row.insertCell()
    createdAt.innerHTML = task.createdAt
    const completed = row.insertCell()
    completed.id = `status${index}`
    completed.innerHTML = task.completed

    const changeStatus = row.insertCell()
    const btnChangeStatus = document.createElement('input')
    btnChangeStatus.type = 'button'
    btnChangeStatus.id = `changeStatusElement${index}`
    btnChangeStatus.value = 'Change Status'
    btnChangeStatus.addEventListener('click', () => {
        fetch(`http://localhost:3000/tasks/${task.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: tasks[index].title,
                completed: !tasks[index].completed,
            }),
        })
            .then(res => res.json())
            .then(data => {
                console.log('Updated:', data)
                tasks[index].completed = data.completed
                document.getElementById(`status${index}`).innerHTML = data.completed
            })
    })
    changeStatus.appendChild(btnChangeStatus)

    const deleteElement = row.insertCell()
    const btnDelete = document.createElement('input')
    btnDelete.type = 'button'
    btnDelete.id = `deleteElement${index}`
    btnDelete.value = 'Delete'
    btnDelete.addEventListener('click', () => {
        fetch(`http://localhost:3000/tasks/${task.id}`, {
            method: 'DELETE',
        })
            .then(res => res.json())
            .then(data => {
                console.log('Deleted:', data)
                tasks.splice(index, 1)
                document.getElementById(`row${index}`).remove()
            })
    })
    deleteElement.appendChild(btnDelete)
}

tasks.forEach((t, i) => {
    createRow(t, i)
})

const submitButton = document.getElementById("fsubmit")
submitButton.addEventListener('click', (e) => {
    e.preventDefault()
    const newTask = {
        title: document.getElementById('ftitle').value,
        completed: document.getElementById('fcompleted').checked
    }

    fetch(`http://localhost:3000/tasks`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...newTask }),
    })
        .then(res => res.json())
        .then(data => {
            console.log('Created:', data)
            tasks.push(data)
            createRow(data, tasks.length - 1)
        })
})

console.log('tasks', await fetchTasks())