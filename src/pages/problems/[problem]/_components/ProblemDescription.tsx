import React, { useEffect, useState } from "react";

import {
  AiOutlineLike,
  AiFillLike,
  AiOutlineDislike,
  AiFillDislike,
} from "react-icons/ai";
import { FaRegStar, FaStar } from "react-icons/fa";
import { TiInputChecked } from "react-icons/ti";
import axios from "axios";
import { ImCheckboxUnchecked } from "react-icons/im";
import type { Problem, ProblemList, Users } from "@/types";

type props = {
  user: Users;
  problems: [Problem];
  problemId: string;
};

const problemDescription = ({ user, problems, problemId }: props) => {
  const [clickedProblems, setClickedProblems] = useState<Problem>();
  const [clickedProblemsId, setClickedProblemId] = useState<string>();

  const [difficultyColors, setDifficultyColor] = useState([
    {
      type: "Hard",
      textColor: "text-red-200",
      bgColor: "bg-red-500",
    },
    {
      type: "Medium",
      textColor: "text-orange-200",
      bgColor: "bg-orange-500",
    },
    {
      type: "Easy",
      textColor: "text-lime-200",
      bgColor: "bg-lime-500",
    },
  ]);

  // console.log(user)
  useEffect(() => {
    if (problems) {
      problems.forEach((problem: any, index) => {
        if (problem.id === problemId) {
          setClickedProblems(problem);
          setClickedProblemId(problem.id);
        }
      });
    }
  }, [problems]);

  useEffect(() => {
    console.log("changed ", clickedProblems);
  }, [clickedProblems]);

  return (
    <div className="bg-slate-700">
      <div className="flex h-11 w-full items-center pt-2 bg-slate-600 text-white overflow-x-hidden overflow-y-auto">
        <div
          className={
            "bg-slate-700 rounded-t-[5px] px-5 py-[10px] text-xs cursor-pointer"
          }
        >
          Description
        </div>
      </div>
      <div className="bg-slate-700">
        <div className="text-lg text-white p-5">
          {clickedProblems?.order}. {clickedProblems?.title}
        </div>
        {/* section 1 */}
        <div className="flex items-center justify-start m-2">
          <div
            className={`mx-4 px-4 py-1 w-15 rounded-full backdrop-blur-smtext-base
                    ${difficultyColors.map((difficultyTypes) => {
                      if (
                        difficultyTypes.type === clickedProblems?.difficulty
                      ) {
                        return (
                          " " +
                          difficultyTypes.bgColor +
                          " " +
                          difficultyTypes.bgColor +
                          " "
                        );
                      }
                    })}
                     `}
          >
            {clickedProblems?.difficulty}
          </div>
          {/*  Solved Section  */}
          <div className="mx-2 cursor-pointer">
            {user?.problemList.map((userProblem: ProblemList, index: any) => (
              <div key={index}>
                {userProblem?._id === clickedProblemsId ? (
                  userProblem?.solved ? (
                    <TiInputChecked size={30} color={"green"} />
                  ) : (
                    <ImCheckboxUnchecked size={20} color={"green"} />
                  )
                ) : (
                  "" // An empty string is rendered when the IDs don't match
                )}
              </div>
            ))}
          </div>
        </div>

        {/* section 2 */}
        <div className="px-5 py-2 text-white">
          {/* For HTML content Rendering */}
          <div
            dangerouslySetInnerHTML={{
              __html: clickedProblems?.description || "",
            }}
          />
        </div>
        {/* section 3 */}
        <div className="mt-4 px-5">
          {clickedProblems?.examples?.map((examples, index) => (
            <div key={index}>
              <p className="font-medium text-white ">
                Example {index+1}
              </p>
              <div className="example-card">
                <pre>
                  <strong className="text-white">Input: </strong>{" "}
                  {examples.inputText}
                  <br />
                  <strong>Output:</strong> {examples.outputText}
                  <br />
                  {examples.explanation && (
                    <>
                      <strong>Explanation: </strong> {examples.explanation}
                    </>
                  )}
                </pre>
              </div>
            </div>
          ))}
        </div>
        <div className="px-5 py-2 text-white">
          {clickedProblems?.constraints && (
            <>
              Constraints:
              <br />
              <strong>
                <div
                  className="m-5"
                  dangerouslySetInnerHTML={{
                    __html: clickedProblems?.constraints || "",
                  }}
                />
              </strong>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default problemDescription;
