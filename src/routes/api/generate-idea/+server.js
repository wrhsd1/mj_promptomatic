import { IDEA_GENERATOR_EXPLANATION, } from "$lib/constants";
import { error, json } from '@sveltejs/kit';
import {
    IDEA_GENERATOR_PAINTER,
} from "$lib/constants.js";
import { env } from 'process';

const personalities = {
    painter: IDEA_GENERATOR_PAINTER,
};

export async function POST({ request, fetch }) {
    const { personality_key, api_key } = await request.json();
    const personality = personalities[personality_key];

    if (!personality_key || !api_key) {
        throw error(400, "Invalid request. Please provide prompt_text, personality_key, and api_key.");
    }

    try {
        const max_tokens = 40;
        const stringMessages = `${IDEA_GENERATOR_EXPLANATION}\n${personality}\nGive me a creative idea`;
        console.log(stringMessages);

        const data = JSON.stringify({
            message: stringMessages,
            max_tokens: max_tokens,
            n: 1,
            stop: null,
            temperature: 1.0,
        });

        const response = await fetch(`${env.ENDPOINT}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: stringMessages
            })
        });

        const data1 = await response.json();
        console.log(data1);
        if (data.error) {
            throw new Error(data.error.message)
        }
        const replies = [data1.response.trim()];

        return json({
            status: 200,
            idea: replies[0],
        });
    } catch (err) {
        console.error("Error generating idea:", err);
        throw error(500, "Failed to generate idea: " + err.message);

    }
}
