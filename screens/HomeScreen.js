import Head from "next/head";
import Link from "next/link";
import styles from '../styles/homeScreen.module.css'
import Menu from "../components/menu";
import ManageProject from "./ManageProject";
import Session from "./Sessions";
import { useSelector } from 'react-redux';
import { useState, useRef, useEffect } from "react";
export default function HomeScreen() {

    let menuChoice = useSelector(state => state.menuChoice.value)
    console.log("🚀 ~ file: HomeScreen.js:11 ~ HomeScreen ~ menuChoice:", menuChoice)
    return (
        <div id={styles.page} >
            <Head>
                <title>Alexandre Wianni</title>
            </Head>{" "}
            <Menu />
            <div className={styles.mainDiv}>
                {(menuChoice == "Gestion projets") && <ManageProject />}
                {(menuChoice == "Session de travail") && <Session />}
                {(menuChoice !== "Session de travail" && menuChoice !== "Gestion projets") && <ManageProject />}
            </div>
        </div>
    );
}
