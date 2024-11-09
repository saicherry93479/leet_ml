'use client'
import React, { useEffect, useState } from "react";
import Navbar from "./ProblemPageNavbar.tsx";
import Workspace from "./Workspace.tsx";
import axios from "axios";
import { problemsAll } from "./utils.ts";
import { toast } from "react-toastify";

const page = ({ problemId, allProblems }: any) => {
  const [users, setUsers] = useState<any>();
  const [problems, setProbelems] = useState<any>(allProblems || []);

  const getUser = async () => {
    let responce = await axios.get("/api/problems");
    console.log("responce ", responce);
    setUsers(responce.data.user);
    // console.log(responce.data.user);
  };

  

  useEffect(() => {
    getUser();
  
  }, []);

  const notify = () => toast("Wow so easy!");
  return (
    <div>
    
      <Navbar problemId={problemId} problems={problems} />
      <Workspace users={users} problems={problems} problemId={problemId} />
    </div>
  );
};

export default page;
