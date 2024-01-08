import styles from '../styles/stopwatch.module.css'
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Row, Col } from 'reactstrap'

export default function Stopwatch(props) {

  let userId = useSelector(state => state.user.value._id)
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [time, setTime] = useState(0);
  console.log("🚀 ~ file: stopwatch.js:12 ~ Stopwatch ~ time:", time)
  const [rsum, setRsum] = useState(0)
  const [sessionId, setSessionId] = useState("")
  const [durations, setDurations] = useState([])
  const [start, setStart] = useState()


function calculTimePassed() {
  const timeDifferenceInMilliseconds = new Date(Date.now()) - start;
 return (timeDifferenceInMilliseconds / (1000 * 60 * 60));
 }

  useEffect(() => {
    let interval = null;
    let real = 0
    for (const session of props.task.sessions) {
      real += session.duration
    }
    real += time / 3600000
    setRsum(real)
    if (isActive && isPaused === false) {
      interval = setInterval(() => {
        let dur = 0
        if (durations[0]){
        for (const duration of durations) {
          dur += duration
        }}
        dur += calculTimePassed()
        setTime(dur);
      }, 10);
    } else {
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
    };


  }, [isActive, isPaused]);
  useEffect(() => {
    let real = 0
    for (const session of props.task.sessions) {
      real += session.duration
    }
    real += time / 3600000
    setRsum(real)
  }, [props])

  const handleStart = async () => {
    setStart(new Date(Date.now()))
    setIsActive(true);
    setIsPaused(false);
    const rawResponse = await fetch('https://noel-back.vercel.app/task/add-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId: props.task._id, projectId: props.projectId, userId: userId, session: {} }),
    });

    const response = await rawResponse.json();
    if (response.result) {
      //notification good
      setSessionId(response.sessionId)
    }
  };
 
  const handlePauseResume = () => {
    if (!isPaused) {
      setDurations([...durations, calculTimePassed()])
    } else {
      setStart(new Date(Date.now()))
    }
 
    setIsPaused(!isPaused);
  };
  const handleFinish = async () => {
    setIsActive(!isActive)
    const rawResponse = await fetch('https://noel-back.vercel.app/task/end-session', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId: props.task._id, projectId: props.projectId, userId: userId, sessionId, duration: time }),
    });

    const response = await rawResponse.json();
    if (response.result) {
      setTime(0)
      setSessionId("")
      //notification good
    }
  }

  const StartButton = (
    <div className={styles.buttonStart} onClick={handleStart}>
      Start
    </div>
  );

  const ActiveButtons = (
    <Row className={styles.buttonsDiv}>
      <div className={styles.buttonPause} onClick={handlePauseResume}>
        {isPaused ? "Reprendre" : "Pause"}
      </div>
      <div className={styles.buttonFinish} onClick={handleFinish}>
        Terminé
      </div>
    </Row>
  );

  return (
    <div id={styles.container}>
      <Row>
        <Col md={{ size: 6 }} style={{ marginTop: '5vh' }} className={styles.taskCard}>
          {/* <Row>
          <Col md="7"> */}
          <p className={styles.title}>{props.task.name}</p>
          <p className={styles.desc}>{props.task.desc}</p>
          {/* </Col> */}
          {/* <Col md="4" style={{ textAlign: 'right' }}> */}
          <p>budget restant : {Math.floor(props.task.budget - rsum)}h{(Math.round(((props.task.budget - rsum) % 1) * 60) != 0) && Math.round(((props.task.budget - rsum) % 1) * 60)}</p>

          {/* </Col>
          </Row> */}
        </Col>
        <Col md={{ size: 5, offset: 1 }} >
          <div className={styles.timerCol}>
            <div className={styles.timer}>
              <span className="digits">
                {("0" + Math.floor((time) % 60)).slice(-2)}:
              </span>
              <span className="digits">
                {("0" + Math.floor((time * 60) % 60)).slice(-2)}
              </span>
            </div>
            <div className={styles.buttonsDiv}>
              {isActive ? ActiveButtons : StartButton}
            </div></div>
        </Col></Row>
    </div>
  );
}
