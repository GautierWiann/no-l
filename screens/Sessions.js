import Head from "next/head";
import Link from "next/link";
import styles from '../styles/session.module.css'

import { useState, useRef, useEffect } from "react";
import Stopwatch from "../components/stopwatch";
import { Col, Row } from 'reactstrap';
import { useSelector } from 'react-redux';
import ProjectCard from '../components/ProjectCard';
import TaskCard from "../components/taskCard";
export default function Session() {
    let userId = useSelector(state => state.user.value._id)
    const [projectsData, setProjectsData] = useState([]);
    const [task, setTask] = useState({});
    console.log("🚀 ~ file: Sessions.js:15 ~ Session ~ task:", task)
    const [projectData, setProjectData] = useState({ tasks: [] });
    console.log("🚀 ~ file: Sessions.js:17 ~ Session ~ projectData:", projectData)
    const [show, setShow] = useState(true)

    useEffect(() => {
        async function call() {
            const rawresponse = await fetch(`https://no-l-back.vercel.app//project/${userId}`)
            const response = await rawresponse.json()
            setProjectsData(response.projects.reverse())
        }
        call()
    }, [show])
    function handleClick(p) {
        setShow(false)
        setProjectData(p)
    }

    function handleTaskClick(t) {
        setTask(t)
    }
    const projectsToDisplay = projectsData.map(p => {
        return (<div onClick={() => handleClick(p)} style={{ marginTop: '3vh' }}>
            <ProjectCard project={p} />
        </div>
        )
    })
    const tasksToDisplay = projectData.tasks.map(t => {
        if(t !== task){
        return (<div style={{ marginTop: '3vh' }} onClick={() => handleTaskClick(t)}>
            <TaskCard task={t} show={false} />
        </div>)
        }
    })

    return (
        <div id={styles.container} >
            <Col md='3' className={styles.projectsCol}>
                {show ? projectsToDisplay : tasksToDisplay}
            </Col>
            {task.name && <Col md={{ size: 8, offset: 1 }}> <Stopwatch task={task} projectId={projectData._id} /></Col>}
        </div>
    );
}
