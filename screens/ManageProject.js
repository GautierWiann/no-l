import Head from "next/head";
import Link from "next/link";
import styles from '../styles/manageProject.module.css'

import { useState, useRef, useEffect } from "react";
import CreateProject from "../components/createProject";
import ModifyProject from "../components/modifyProject";

export default function ManageProject() {

const [choice, setChoice] = useState("")
const choices = ["Créer un projet", "Gérer les projets"]
const choicesToDisplay = choices.map(c => {
    return <p className={`${styles.choice} btn`} onClick={() => setChoice(c)}>{c}</p>
})
    return (
        <div id={styles.container} >
            <div className={styles.choicesDiv}>
            {choicesToDisplay}
        </div>
        <div className={styles.mainDiv}>
        {(choice == "Créer un projet") && <CreateProject/>}
        {(choice == "Gérer les projets")&& <ModifyProject/>}
        </div>
        </div>
    );
}
