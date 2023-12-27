import styles from '../styles/createProject&Tasks.module.css'
import { useState } from 'react';
import { Row } from 'reactstrap';
export default function CreateProject(props) {
    const [state, setState] = useState({});
    console.log("🚀 ~ file: createProject.js:6 ~ CreateProject ~ state:", state)
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
            const rawResponse = await fetch('https://noel-back.vercel.app/project/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ project: { name: state.name, budget: Number(state.budget), desc: state.desc }, userId: "RwvZNfRY3HthTWSual7hLQDK" }),
            });

            const response = await rawResponse.json(); 
            if(response.result) {
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
                        Nom du projet
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
                            e.target.value = e.target.value.replace(/\D/g, '')
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
                        description du projet
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
