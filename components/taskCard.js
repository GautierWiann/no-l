import styles from '../styles/projectCard.module.css'
import { useState, useEffect } from 'react';
import { Row } from 'reactstrap';
import { useSelector } from 'react-redux';

export default function TaskCard(props) {

  let userId = useSelector(state => state.user.value._id)
  const [finished, setFinished] = useState(props.task.finished)
  const [sumTime, setSumTime] = useState(0)
  const [style, setStyle] = useState({})
  const [checkStyle, setCheckStyle] = useState(styles.checkWhite)
  useEffect(() => {
    let sum = 0
    for (const session of props.task.sessions) {
      sum += session.duration
    }
    if (!props.show) {
      setStyle({ height: 'fit-content' })
    }
    if (props.task.finished) {
      setCheckStyle(styles.checkGreen)
    }
    setSumTime(sum)
  }, [])

  async function handleFinish() {

    const rawResponse = await fetch('https://no-l-back.vercel.app/task/end-task', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId: props.task._id, projectId: props.projectId, userId: userId, finished: !finished }),
    });

    const response = await rawResponse.json();
    console.log("🚀 ~ file: taskCard.js:36 ~ handleFinish ~ response:", response)
    setFinished(response.task.finished)
    props.recal(response.task._id, response.task.finished)
    if (response.task.finished) {
      setCheckStyle(styles.checkGreen)
    } else setCheckStyle(styles.checkWhite)
  }


  return (
    <div className={styles.container} id={styles.taskContainer} style={style}>
      {props.show &&
        <div>
          <img className={styles.icon} id={checkStyle}  src='check.png' onClick={() => {handleFinish()}}/>
          <div onClick={() => props.handleDelete()}><svg className={styles.icon} id={styles.trash}  xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M3 6v18h18v-18h-18zm5 14c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4-18v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.315c0 .901.73 2 1.631 2h5.712z" /></svg></div></div>}
          <div className={styles.notiglow}>
          
        </div>
      <div className={styles.notiborderglow}></div>
      <Row style={{ margin: '0 10px 0 2px', justifyContent: 'space-between' }}>
        <div className={styles.notititle}>{props.task.name}</div>
        <div className={styles.notititle}> {Math.floor(sumTime)} h {(Math.round(((sumTime) % 1) * 60) != 0)&&Math.round(((sumTime) % 1) * 60)} sur {Math.floor(props.task.budget)}h{(Math.round(((props.task.budget) % 1) * 60) != 0)&&Math.round(((props.task.budget) % 1) * 60)}</div>
      </Row>
      {props.show && <div className={styles.notibody}>{props.task.desc}</div>}
    </div>
  )
}
