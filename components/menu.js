import styles from '../styles/menu.module.css'
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { menuChoice } from '../reducers/menu';
export default function Menu(props) {
    
const dispatch = useDispatch()

 const options = [
    // "Analytics", 
    "Gestion projets", "Session de travail"]
 const optionsToDisplay= options.map(option => {
    return (
        <p className={styles.option} onClick={() => dispatch(menuChoice(option))}>{option}</p>
    )
 })

    return (
        <div id={styles.container}>
{optionsToDisplay}
        </div>
    )
}
