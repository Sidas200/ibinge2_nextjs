import { signInWithGoogle } from "../../../firebase";

export default async function handler(req, res) {
    if (req.method === "POST") {
        try {
            const user = await signInWithGoogle();
            res.status(200).json({ user });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
