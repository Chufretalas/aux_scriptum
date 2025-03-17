import { useEffect, useState } from "react"
import styles from "./App.module.css"
import ollama from "ollama/dist/browser.cjs";

export default function App() {
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")

    const [response, setResponse] = useState("")

    const [currentModel, setCurrentModel] = useState("")

    const [allModels, setAllModels] = useState<string[]>([])

    const [checkButtonEnabled, setCheckButtonEnabled] = useState(true)

    async function checkText() {

        setCheckButtonEnabled(false)

        setResponse("")

        try {
            const res = await ollama.generate({
                model: currentModel,
                stream: true,
                prompt: `I am practicing my german writing. Can you please proofread the following text and explain my errors: ${content}`
            })

            for await (const part of res) {
                console.log(part)
                setResponse(prev => prev + part.response)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setCheckButtonEnabled(true)
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
            <header className={styles.header}>
                <div>
                    <select name="model_select" id="model_select" className={styles.model_selector}
                        value={currentModel} onChange={e => setCurrentModel(e.currentTarget.value)}>
                        {allModels.map((m, idx) => (<option key={idx} value={m}>{m}</option>))}
                    </select>
                </div>
            </header>
            <main className={styles.main}>
                <section className={styles.user_input_section}>
                    <input type="text" name="title_input" id="title_input" className={styles.title_input}
                        placeholder="Text title..."
                        value={title} onChange={e => setTitle(e.currentTarget.value)} />
                    <textarea name="title_input" id="title_input" className={styles.content_input}
                        placeholder="The text to evaluated..." spellCheck={false}
                        value={content} onChange={e => setContent(e.currentTarget.value)} />
                </section>
                <section>
                    <button onClick={checkText} className={styles.check_button} disabled={!checkButtonEnabled}>Click here to check your text</button>
                    {response === ""
                        ? <span className={styles.response_placeholder}>:)</span>
                        : <span className={styles.response_box}>{response}</span>
                    }
                </section>
            </main>
        </>
    )
}

