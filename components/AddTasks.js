import styles from '../styles/createProject&Tasks.module.css'
import { useState } from 'react';
import { Row } from 'reactstrap';
import { useSelector } from 'react-redux';
export default function AddTasks(props) {
    console.log("🚀 ~ file: addTasks.js:6 ~ AddTasks ~ props:", props)

    let userId = useSelector(state => state.user.value._id)
    const [state, setState] = useState({});
    const [valide1, setValide1] = useState(false)
    const [valide2, setValide2] = useState(false)
    const [valide3, setValide3] = useState(false)
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setState((prevProps) => ({
            ...prevProps,
            [name]: value
        }));
    };
    async function handleValidate() {

        if (!state.name || !state.desc || !state.budget) {
            console.log('erreur')
            if (!state.name) { setValide1(true) }
            if (!state.desc) { setValide2(true) }
            if (!state.budget) { setValide3(true) }
        } else {
            const rawResponse = await fetch('https://noel-back.vercel.app/task/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ task: { name: state.name, budget: Number(state.budget), desc: state.desc }, userId, projectId: props.projectId }),
            });

            const response = await rawResponse.json();
            console.log("🚀 ~ file: addTasks.js:35 ~ handleValidate ~ response:", response)
            if (response.result) {
                props.show()
                props.setTasksData(response.project.tasks.reverse())
                //notification good
            }
        }
    }

    return (
        <div id={styles.container}>
            <Row className={styles.Row}>
                <div className={styles.formGroup}>
                    <input
                        name="name"
                        type="input"
                        className={styles.formField}
                        placeholder=""
                        required=""
                        value={state.name}
                        invalid={valide1}
                        onChange={(e) => handleInputChange(e)}
                    />
                    <label for="name" className={styles.formLabel}>
                        Nom de la tâche
                    </label>
                </div>
                <div className={styles.formGroup} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <input
                        name="budget"
                        style={{ width: "100px", textAlign: "center" }}
                        type="text"
                        className={styles.formField}
                        placeholder="0"
                        required=""
                        invalid={valide3}
                        value={state.budget}
                        onChange={(e) => {
                            e.target.value = e.target.value.replace(/[^\d.]/g, '')
                            handleInputChange(e)
                        }}
                    />
                    <label for="name" className={styles.formLabel}>
                        Budget horaire
                    </label>
                </div>
            </Row>
            <Row className={styles.Row}>
                <div className={styles.formGroup} style={{ width: '100%' }}>
                    <textarea
                        name="desc"
                        type="textarea"
                        id={styles.messageInputField}
                        className={styles.formField}
                        placeholder=""
                        required=""
                        value={state.desc}
                        invalid={valide2}
                        onChange={(e) => handleInputChange(e)}
                    />
                    <label for="name" className={styles.formLabel}>
                        description de la tâche
                    </label>
                </div></Row>
            <Row className={styles.Row} style={{justifyContent:'flex-end'}}>
                <button class="btn"  style={{width:'fit-content'}} onClick={() => handleValidate()}>
                    Valider
                </button>
            </Row>
        </div>
    )
}