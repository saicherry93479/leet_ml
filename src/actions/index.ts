import { runPython } from "./python";
import { submission } from "./submission";
import { sendMail, verifyEmail } from "./verifyemail";

export const server = {
    runPython,
    verifyEmail,
    sendMail,
    submission
}