"use client";

import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "@/styles/Toast.module.css"; 

const ToastProvider = () => (
  <ToastContainer
    position="top-right"
    autoClose={3000}
    hideProgressBar={true} 
    newestOnTop={false}
    closeOnClick
    rtl={false}
    pauseOnFocusLoss={false}
    draggable={false}
    pauseOnHover={false}
    transition={Slide} 
    theme="light"
    toastClassName={styles.toast} 
    bodyClassName={styles.body}
    progressClassName={styles.progress}
  />
);

export default ToastProvider;