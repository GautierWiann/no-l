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
        setRsum(real) }
        if (props.project.finished) {
            setStyle({color:'#6ad09d'})
        }
    },[])

    function updateTaskFinishedById( taskId , newFinishedValue) {
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
            setStyle({color:'#6ad09d'})
        } else {
            setStyle({})
        }
    }, [finished])

    async function handleDeleteTask(t) {
        const rawResponse = await fetch('http://localhost:3000/task/delete', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ taskId: t._id, projectId: props.project._id, userId: userId}),
        });
      
        const response = await rawResponse.json(); 
        if (response.result) {
            setTasksData(response.project.tasks)
        }
        console.log("🚀 ~ file: Project.js:40 ~ handleDelete ~ response:", response)
    }
    const tasksToDisplay = tasksData.map(task => {
        return (
            <Col md={{ size: '4' }} className={styles.taskCol}>
                <TaskCard projectId={props.project._id} show={true} handleDelete={() => handleDeleteTask(task)} recal={(taskId , newFinishedValue) => updateTaskFinishedById(taskId , newFinishedValue)} task={task} />
            </Col>
        )
    })

    async function handleDelete() {
        const rawResponse = await fetch('http://localhost:3000/project/delete', {
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

        const rawResponse = await fetch('http://localhost:3000/project/end-project', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, projectId: props.project._id, finished: !finished }),
        });
    
        const response = await rawResponse.json();
        console.log("🚀 ~ file: taskCard.js:36 ~ handleFinish ~ response:", response)
        if(response.result){
        setFinished(response.project.finished)
        
       }
      }
    return (
        <div className={styles.container}>
            <Row style={{justifyContent: 'space-between'}}>
                <Col md="7">
                    <p className={styles.title} style={style}>{props.project.name}</p>
                    <p className={styles.desc}>{props.project.desc}</p>
                </Col>
                <Col md="4" style={{textAlign:'right'}}>
                    <p>budget théorique restant : {props.project.budget - tsum}h</p>
                    <p>budget réel restant : {Math.floor(props.project.budget - rsum)}h{(Math.round(((props.project.budget - rsum) % 1) * 60) != 0)&&Math.round(((props.project.budget - rsum) % 1) * 60)}</p>
                    {(balance >0 ) && <p style={{color: '#6ad09d'}}>bonus : {Math.floor(balance)}h{(Math.round(((balance) % 1) * 60) != 0)&&Math.round(((balance) % 1) * 60)}</p>}
                    {(balance <0 ) && <p style={{color: '#9b2915'}}>malus : {Math.floor(balance)}h{(Math.round(((balance) % 1) * 60) != 0)&&Math.round(((balance) % 1) * 60)*-1}</p>}
                </Col>
            </Row>
            <div className={styles.tasksDiv}>
                {tasksToDisplay}
            </div>
            {!show &&<div className={styles.buttonDiv}>
             <div className='btn' onClick={() => setShow(true)}>Ajouter une tâche</div>
             <div className='btn' onClick={() => handleFinish()}> {finished ? "Reprendre le projet" : "Projet Terminé"}</div>
            <div className='btn' onClick={() => handleDelete()}>Supprimer le projet</div>
            </div>}
            {show && <AddTasks show={() => setShow(false)} setTasksData={(e) => setTasksData(e)} projectId={props.project._id} />}
        </div>
    )
}
