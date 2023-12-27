import styles from '../styles/modifyProject.module.css'
import { useState, useEffect } from 'react';
import { Col, Row } from 'reactstrap';
import { useSelector } from 'react-redux';
import ProjectCard from './ProjectCard';
import Project from './Project';

export default function ModifyProject(props) {
    let userId = useSelector(state => state.user.value._id)
    const [projectsData, setProjectsData] = useState([]);
    const [projectData, setProjectData] = useState([]);
    const [show, setShow] = useState(true)
    console.log("🚀 ~ file: deleteProject.js:8 ~ DeleteProject ~ projectsData:", projectsData)

    useEffect(() => {
        async function call() {
            const rawresponse = await fetch(`https://no-l-back.vercel.app/project/${userId}`)
            const response = await rawresponse.json()
            setProjectsData(response.projects.reverse())
        }
        call()
    }, [show])
    function handleClick(p) {
        setShow(false)
        setProjectData(p)
    }
    const projectsToDisplay = projectsData.map(p => {
        return (
            <Col md={{ size: 4, offset: 1 }} style={{ marginTop: '4vh' }} onClick={() => handleClick(p)}>
                <ProjectCard project={p} />
            </Col>)
    })
    return (
        <div className={styles.container}>
            {show && <Row className={styles.rowProjectCards}>
                {projectsToDisplay}</Row>}
            {!show && <Project project={projectData} show={() => setShow(true)} />}
        </div>
    )
}
