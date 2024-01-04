import styles from '../styles/project.module.css'
import { useState, useEffect } from 'react';
import { Col, Row } from 'reactstrap';
import { useSelector } from 'react-redux';
import TaskCard from './taskCard';
import AddTasks from './AddTasks';
export default function Project(props) {
    let userId = useSelector(state => state.user.value._id)
    console.log("🚀 ~ file: Project.js:8 ~ Project ~ props:", props)
    const [show, setShow] = useState(false)
    const [recalcul, setRecalcul] = useState(false)
    const [tasksData, setTasksData] = useState([])
    const [tsum, setTsum] = useState(0)
    const [rsum, setRsum] = useState(0)
    const [style, setStyle] = useState({})
    const [balance, setBalance] = useState(0)

    const [finished, setFinished] = useState(props.project.finished)
    //mettre un ref down?

    useEffect(() => {
        if (props.project.tasks) {
            setTasksData(props.project.tasks.reverse())

            let theorical = 0
            let real = 0
            let b = 0
            for (const task of props.project.tasks) {
                theorical += task.budget
                if (task.finished) {
                    let bal = 0
                    for (const session of task.sessions) {
                        bal += session.duration
                    }
                    bal = bal - task.budget
                    b += bal
                }
                setBalance(-b)
                for (const session of task.sessions) {
                    real += session.duration
                }
            }
            setTsum(theorical)
            setRsum(real)
        }
        if (props.project.finished) {
            setStyle({ color: '#6ad09d' })
        }
    }, [])

    function updateTaskFinishedById(taskId, newFinishedValue) {
        const updatedTasksData = tasksData.map((task) =>
            task._id === taskId ? { ...task, finished: newFinishedValue } : task
        );

        setTasksData(updatedTasksData)
    }
    useEffect(() => {

        let b = 0
        for (const task of tasksData) {

            if (task.finished) {
                let bal = 0
                for (const session of task.sessions) {
                    bal += session.duration
                }
                bal = bal - task.budget
                b += bal
            }
            setBalance(-b)
        }
    }, [tasksData])

    useEffect(() => {
        if (finished) {
            setStyle({ color: '#6ad09d' })
        } else {
            setStyle({})
        }
    }, [finished])

    async function handleDeleteTask(t) {
        const rawResponse = await fetch('https://no-l-back.vercel.app/task/delete', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ taskId: t._id, projectId: props.project._id, userId: userId }),
        });

        const response = await rawResponse.json();
        if (response.result) {
            setTasksData(response.project.tasks)
        }
        console.log("🚀 ~ file: Project.js:40 ~ handleDelete ~ response:", response)
    }
    const tasksToDisplay = tasksData.map(task => {
        return (
            <Col md={{ size: '4' }} xs={{ size: 11 }} className={styles.taskCol}>
                <TaskCard projectId={props.project._id} show={true} handleDelete={() => handleDeleteTask(task)} recal={(taskId, newFinishedValue) => updateTaskFinishedById(taskId, newFinishedValue)} task={task} />
            </Col>
        )
    })

    async function handleDelete() {
        const rawResponse = await fetch('https://noel-back.vercel.app/project/delete', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, projectId: props.project._id }),
        });

        const response = await rawResponse.json();
        console.log("🚀 ~ file: addTasks.js:35 ~ handleValidate ~ response:", response)
        if (response.result) {
            props.show()
        }
    }

    async function handleFinish() {

        const rawResponse = await fetch('https://noel-back.vercel.app/project/end-project', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, projectId: props.project._id, finished: !finished }),
        });

        const response = await rawResponse.json();
        console.log("🚀 ~ file: taskCard.js:36 ~ handleFinish ~ response:", response)
        if (response.result) {
            setFinished(response.project.finished)

        }
    }
    return (
        <div className={styles.container}>
            <div style={{ width: '100%' }} onClick={() => handleDelete()}><svg className={styles.icon} id={styles.trash} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M3 6v18h18v-18h-18zm5 14c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4-18v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.315c0 .901.73 2 1.631 2h5.712z" /></svg></div>

            <Row style={{ justifyContent: 'space-between' }}>
                <Col md="7">
                    <p className={styles.title} style={style}>{props.project.name}</p>
                    <p className={styles.desc}>{props.project.desc}</p>
                </Col>
                <Col md="4" className={styles.intelDiv}>
                    <p>budget théorique restant : {props.project.budget - tsum}h</p>
                    <p>budget réel restant : {Math.floor(props.project.budget - rsum)}h{(Math.round(((props.project.budget - rsum) % 1) * 60) != 0) && Math.round(((props.project.budget - rsum) % 1) * 60)}</p>
                    {(balance > 0) && <p style={{ color: '#6ad09d' }}>bonus : {Math.floor(balance)}h{(Math.round(((balance) % 1) * 60) != 0) && Math.round(((balance) % 1) * 60)}</p>}
                    {(balance < 0) && <p style={{ color: '#9b2915' }}>malus : {Math.floor(balance)}h{(Math.round(((balance) % 1) * 60) != 0) && Math.round(((balance) % 1) * 60) * -1}</p>}
                </Col>
            </Row>
            <svg className={styles.icon} id={styles.plus} onClick={() => setShow(true)} xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 24 24">
                <path d="M 12 2 C 6.4889971 2 2 6.4889971 2 12 C 2 17.511003 6.4889971 22 12 22 C 17.511003 22 22 17.511003 22 12 C 22 6.4889971 17.511003 2 12 2 z M 12 4 C 16.430123 4 20 7.5698774 20 12 C 20 16.430123 16.430123 20 12 20 C 7.5698774 20 4 16.430123 4 12 C 4 7.5698774 7.5698774 4 12 4 z M 11 7 L 11 11 L 7 11 L 7 13 L 11 13 L 11 17 L 13 17 L 13 13 L 17 13 L 17 11 L 13 11 L 13 7 L 11 7 z"></path>
            </svg> <div className={styles.tasksDiv}>
                {tasksToDisplay}
            </div>

            {!show && <div className={styles.buttonDiv}>
                <div className={`btn ${styles.onlyWeb}`}  onClick={() => setShow(true)}>Ajouter une tâche</div>
                <div className='btn' onClick={() => handleFinish()}> {finished ? "Reprendre le projet" : "Projet Terminé"}</div>
                <div className={`btn ${styles.onlyWeb}`} onClick={() => handleDelete()}>Supprimer le projet</div>
            </div>}
            {show && <AddTasks show={() => setShow(false)} setTasksData={(e) => setTasksData(e)} projectId={props.project._id} />}
        </div>
    )
}
