import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { Button, Form, Spinner } from "react-bootstrap";
import { FormEvent, useState } from "react";

export default function Home() {
  const [routine, setRoutine] = useState("");
  const [routineLoading, setRoutineLoading] = useState(false);
  const [routineLoadingError, setRoutineLoadingError] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const prompt = formData.get("prompt")?.toString().trim();
    if (prompt) {
      try {
        setRoutine("");
        setRoutineLoadingError(false);
        setRoutineLoading(true);
        const response = await fetch(
          "/api/yoga?prompt=" + encodeURIComponent(prompt)
        );
        const body = await response.json();
        setRoutine(body.routine);
      } catch (error) {
        console.error(error);
        setRoutineLoadingError(true);
      } finally {
        setRoutineLoading(false);
      }
    }
  }
  return (
    <>
      <Head>
        <title>Yoga GPT - Create Yoga Routines</title>
        <meta name="description" content="by Tonglu Yang" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1>Yoga GPT</h1>
        <div>Enter a type of yoga and AI will generate a routine for you</div>
        <Form onSubmit={handleSubmit} className={styles.inputForm}>
          <Form.Group className="mb-3" controlId="level-input">
            <Form.Label>Choose your level</Form.Label>
            <Form.Control as="select" name="level">
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </Form.Control>
          </Form.Group>
          <Form.Group className="mb-3" controlId="type-input">
            <Form.Label>What type of yoga do you prefer?</Form.Label>
            <Form.Control as="select" name="type">
              <option value="ashtanga">Ashtanga yoga</option>
              <option value="flow">Flow yoga</option>
              <option value="power">Power yoga</option>
              <option value="hatha">Hatha yoga</option>
            </Form.Control>
          </Form.Group>
          <Form.Group className="mb-3" controlId="funny-input">
            <Form.Label>
              Do you want traditional yoga or some funny yoga?
            </Form.Label>
            <Form.Control as="select" name="funny">
              <option value="traditional">Traditional yoga</option>
              <option value="funny">Funny yoga</option>
            </Form.Control>
          </Form.Group>
          <Form.Group className="mb-3" controlId="duration-input">
            <Form.Label>How long do you want to do this workout?</Form.Label>
            <Form.Control
              type="number"
              name="duration"
              min="5"
              max="120"
              step="5"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="prompt-input">
            <Form.Label>Specific prompts you want to include</Form.Label>
            <Form.Control
              name="prompt"
              placeholder="lots of downword pose, more breath control ..."
              maxLength={200}
            />
          </Form.Group>
          <Button type="submit" className="mb-3" disabled={routineLoading}>
            Yogaaaa...
          </Button>
        </Form>
        {routineLoading && <Spinner animation="border" />}
        {routineLoadingError && "Something wrong, pls try again"}
        {routine && <h5>{routine}</h5>}
      </main>
    </>
  );
}
