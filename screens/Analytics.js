import Head from "next/head";
import Link from "next/link";
import styles from '../styles/analytics.module.css'

import { useState, useRef, useEffect } from "react";
import Stopwatch from "../components/stopwatch";
import { Col, Row } from 'reactstrap';
import { useSelector } from 'react-redux';
export default function Analytics() {
    let userId = useSelector(state => state.user.value._id)
    const [projectsData, setProjectsData] = useState([]);
   
    useEffect(() => {
        async function call() {
            const rawresponse = await fetch(`https://noel-back.vercel.app/project/${userId}`)
            const response = await rawresponse.json()
            setProjectsData(response.projects.reverse())
        }
        call()
    }, [show])
   

    return (
        <div id={styles.container} >
           
        </div>
    );
}
