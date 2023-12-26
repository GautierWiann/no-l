import styles from '../styles/projectCard.module.css'
import { useState, useEffect } from 'react';

import { useSelector } from 'react-redux';

export default function ProjectCard(props) {
  
  
    return (
        <div className={styles.container}>
            {props.project.finished && <img className={styles.icon} id={styles.checkGreen}  src='check.png'/>}
              <div className={styles.notiglow}></div>
    <div className={styles.notiborderglow}></div>
    <div className={styles.notititle}>{props.project.name}</div>
    <div className={styles.notibody}>{props.project.desc}</div>
        </div>
    )
}
