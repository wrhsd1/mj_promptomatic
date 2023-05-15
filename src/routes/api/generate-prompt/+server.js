import { MIDJOURNEY_EXPLANATION_SHORT } from "$lib/constants";
import { PROMPT_FILLER_EXPLANATION } from "$lib/constants.js";
import { error, json } from '@sveltejs/kit';
import { env } from 'process';


export async function POST({ request, fetch }) {
    const { prompt_text, api_key, num_replies = 1 } = await request.json();

    if (!prompt_text || !api_key) {
        throw error(400, "Invalid request. Please provide prompt_text, personality_key, and api_key.");
    }

    try {
        const max_tokens = 700;
        const pretmessages = ` Translate the following to English, and only  display the translated results as the example
input: 一只猫
a cat
now, let's begin: ${prompt_text}`;
        const tresponse = await fetch(`${env.ENDPOINT}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: pretmessages,
                stop: null,
                temperature: 1.0
            })
        });
        const tresponseData = await tresponse.json();
        //console.log(tresponseData);
        console.log(tresponseData.response);  
        const stringMessages = `${MIDJOURNEY_EXPLANATION_SHORT}\n${PROMPT_FILLER_EXPLANATION}\nGive me ${num_replies} examples of:` + tresponseData.response;
        //console.log(stringMessages);
        const response = await fetch(`${env.ENDPOINT}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: stringMessages,
                stop: null,
                temperature: 1.0
            })
        });
        const responseData = await response.json();
        console.log(responseData);
        if (responseData.error) {
            throw new Error(responseData.error.message)
        }
        // only one reply, but as a string separated by newlines. Make it an array.
        const reply = responseData.response.trim();
        // First remove all text before the first /imagine prompt:
        const replyWithoutIntro = reply.substring(reply.indexOf("/imagine"));
        // Then split the string into an array of replies, separated by newlines:
        const replies = replyWithoutIntro.split("\n");
        return json({
            status: 200,
            replies: replies,
        });
    } catch (err) {
        console.error("Error generating prompt:", err);
        throw error(500, "Failed to generate prompt: " + err.message);

    }
}
