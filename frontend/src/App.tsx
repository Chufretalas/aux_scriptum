import { useEffect, useState } from "react"
import styles from "./App.module.css"
import ollama from "ollama/dist/browser.cjs";

export default function App() {
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")

    const [response, setResponse] = useState("")

    const [currentModel, setCurrentModel] = useState("")

    const [allModels, setAllModels] = useState<string[]>([])

    async function checkText() {

        setResponse("")

        const res = await ollama.generate({
            model: currentModel,
            stream: true,
            prompt: `I am practicing my german writing. Can you please proofread the following text and explain my errors: ${content}`
        })

        for await (const part of res) {
            console.log(part)
            setResponse(prev => prev + part.response)
        }
    }

    useEffect(() => {
        ollama.list().then(res => {
            setAllModels(res.models.map(m => m.name))
            if (res.models.length > 0) {
                setCurrentModel(res.models[0].name)
            } else {
                //TODO: instruct user to dowload something
            }
        })
    }, [])

    return (
        <>
            <header>
                <div>
                    <select name="model_select" id="model_select"
                        value={currentModel} onChange={e => setCurrentModel(e.currentTarget.value)}>
                        {allModels.map((m, idx) => (<option key={idx} value={m}>{m}</option>))}
                    </select>
                </div>
            </header>
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
        </>
    )
}

