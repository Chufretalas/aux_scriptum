import { useState } from "react"
import styles from "./App.module.css"
import ollama, { GenerateResponse } from "ollama/dist/browser.cjs";

export default function App() {
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")

    const [response, setResponse] = useState("")

    async function checkText() {

        setResponse("")

        const res = await ollama.generate({
            model: "mistral-nemo",
            stream: true,
            prompt: `I am practicing my german writing. Can you please proofread the following text and explain my errors: ${content}`
        })

        for await (const part of res) {
            console.log(part)
            setResponse(prev => prev + part.response)
        }
    }

    return (
        <main className={styles.main}>
            <section>
                <input type="text" name="title_input" id="title_input"
                    placeholder="Text title..."
                    value={title} onChange={e => setTitle(e.currentTarget.value)} />
                <textarea name="title_input" id="title_input"
                    placeholder="The text to evaluated..."
                    value={content} onChange={e => setContent(e.currentTarget.value)} />
            </section>
            <section>
                <button onClick={checkText}>Check</button>
                <span className={styles.response_box}>{response}</span>
            </section>
        </main>
    )
}

