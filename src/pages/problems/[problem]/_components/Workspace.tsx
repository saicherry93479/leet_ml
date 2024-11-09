'use client'
import { useEffect, useState } from "react";
import Split from "react-split";
import Playground from "./Playground";
import type { Problem, Users } from '@/types';
import Confetti from "react-confetti";
import useWindowSize from "./useWindowSize";
import ProblemDescription from "./ProblemDescription";

type props = {
	users: Users,
	problems: [Problem],
    problemId:string
}

const workspace = ({ users, problems ,problemId}: props) => {
	const { width, height } = useWindowSize();
	const [success, setSuccess] = useState(false);

	useEffect(() => {
		// Automatically set success to false after 4 seconds
		if(success){
			const timer = setTimeout(() => {
			  setSuccess(false);
			}, 5000);
		
			// Clear the timer when the component unmounts or when success changes
			return () => clearTimeout(timer);
		}
	  }, [success]);
	
	return (
		<Split className='flex' minSize={400}>
			<ProblemDescription user={users} problems={problems} problemId={problemId} />
			<div className='bg-slate-700'>
				<Playground user={users} problems={problems} problemId={problemId} setSuccess={setSuccess} />
				{success && <Confetti gravity={0.3} tweenDuration={5000} width={width - 1} height={height - 1} />}
			</div>
		</Split>
	);
}

export default workspace
