import { spawn } from "child_process";

export async function POST({ request }) {
  try {
    const { code, problem } = await request.json();

    if (!code || !problem) {
      return new Response(
        JSON.stringify({ success: false, message: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    // console.log("problem ", problem);
    // console.log('inputs ', problem.testCases.map((testcase) => testcase.input))
    const result = await runPythonCode(
      code,
      [problem.testCases[0].input]
    );
    console.log('result is ',result)

    if (result.error) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Error during execution",
          error: result.error,
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // console.log(problem.testCases[0].output)
    // const allTestsPassed = result.output.slice(0,1).every(
    //   (output, i) => output.trim() === problem.testCases[i].output.trim()
    // );
    console.log('result.output[0] ',result.output[0])
    console.log('problem.testCases[0].output ',problem.testCases[0].output)
    const allTestsPassed = result.output[0] ===  problem.testCases[0].output
    if (allTestsPassed) {
      //   await updateUserProblemStatus(user._id, index, code);
      return new Response(
        JSON.stringify({
          success: true,
          message: "All Test Cases passed",
          data: result.output,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Not all Test Cases passed",
          data: result.output,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    console.error("Error in POST handler:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

async function runPythonCode(code, inputs) {
  return new Promise((resolve) => {
    const python = spawn("python3", ["-c", code]);
    let output = [];
    let error = "";

    python.stdout.on("data", (data) => {
      output.push(data.toString().trim());
    });

    python.stderr.on("data", (data) => {
      error += data.toString();
    });

    python.on("close", (code) => {
      if (code !== 0) {
        resolve({
          output: [],
          error: error || "An error occurred during execution",
        });
      } else {
        resolve({ output });
      }
    });

    // Send inputs to the Python process
    inputs.forEach((input) => python.stdin.write(input + "\n"));
    python.stdin.end();

    // Set a timeout to kill the process if it runs too long
    setTimeout(() => {
      python.kill();
      resolve({ output: [], error: "Execution timed out" });
    }, 10000); // 10 second timeout
  });
}

// async function updateUserProblemStatus(userId, problemIndex, code) {
//   const updateObject = {
//     [`problemList.${problemIndex}.solved`]: true,
//     [`problemList.${problemIndex}.solvedAnswer`]: code,
//   };

//   await updateUserById(userId, updateObject);

//   const updatedUser = await getUserById(userId);
//   const solvedProblems = updatedUser.problemList.filter(problem => problem.solved === true);
//   await updateUserById(userId, { totalSolved: solvedProblems.length });
// }
