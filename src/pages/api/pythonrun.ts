import { spawn } from "child_process";

export async function POST({ request }) {
  const body = await request.json();
  const { code } = body;

  if (!code) {
    return new Response(JSON.stringify({ error: "No code provided" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  return new Promise((resolve) => {
    const python = spawn("python3", ["-c", code]);
    let output = "";
    let error = "";

    python.stdout.on("data", (data) => {
      output += data.toString();
    });

    python.stderr.on("data", (data) => {
      error += data.toString();
    });

    python.on("close", (code) => {
      if (code !== 0) {
        resolve(
          new Response(
            JSON.stringify({ message: error || "An error occurred" }),
            {
              status: 500,
              success: false,
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
        );
      } else {
        resolve(
          new Response(
            JSON.stringify({ output: output, status: 200, success: true }),
            {
              status: 200,
              success: true,
              output: output,
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
        );
      }
    });

    // Set a timeout to kill the process if it runs too long
    setTimeout(() => {
      python.kill();
      resolve(
        new Response(JSON.stringify({ error: "Execution timed out" }), {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        })
      );
    }, 10000); // 10 second timeout
  });
}
