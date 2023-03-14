import type { NextApiRequest, NextApiResponse } from 'next'
import Cors from 'cors';

// Initializing the cors middleware
// You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
const cors = Cors({
    methods: ['POST', 'GET', 'HEAD', 'O'],
})

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(
    req: NextApiRequest,
    res: NextApiResponse,
    fn: Function
) {
    return new Promise((resolve, reject) => {
        fn(req, res, (result: any) => {
            if (result instanceof Error) {
                return reject(result)
            }

            return resolve(result)
        })
    })
}

const API_URI = "https://39314-3000.2.codesphere.com/createWorkspace";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    console.log("Calling Create Workspace.")
    await runMiddleware(req, res, cors);
    if (!req.body.teamId || !req.body.name) {
        return res.status(404).json({ messsage: "teamId or name is missing." })
    }
    const body = JSON.stringify({
        teamId: req.body.teamId,
        name: req.body.name
    });
    const listRes = await fetch(
        API_URI,
        {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: body,
        }
    );
    console.log(listRes);
    if (!listRes.ok) {
        console.error(listRes.statusText);
        return res.status(400).json({ messsage: listRes.statusText })
    }
    return res.status(200).json({ status: "ok" });
}
