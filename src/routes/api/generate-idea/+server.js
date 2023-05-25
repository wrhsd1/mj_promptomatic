import { IDEA_GENERATOR_EXPLANATION,  } from "$lib/constants";
import { error, json } from '@sveltejs/kit';
import { ChatGPTBrowserClient } from '@waylaidwanderer/chatgpt-api';
import { env } from 'process';

import {
  IDEA_GENERATOR_PHOTOGRAPHER,
  IDEA_GENERATOR_PAINTER,
  // IDEA_GENERATOR_CRAZY_ARTIST,
  IDEA_GENERATOR_FASHION_DESIGNER,
  IDEA_GENERATOR_STREET_PHOTOGRAPHER,
  IDEA_GENERATOR_ARCHITECT,
  IDEA_GENERATOR_MOVIE_CONCEPT_ARTIST,
  IDEA_GENERATOR_GRAPHIC_DESIGNER,
  IDEA_GENERATOR_GRAPHIC_NOVEL_ARTIST,
} from "$lib/constants.js";

const personalities = {
  photographer: IDEA_GENERATOR_PHOTOGRAPHER,
  painter: IDEA_GENERATOR_PAINTER,
  // crazy_artist: IDEA_GENERATOR_CRAZY_ARTIST,
  fashion_designer: IDEA_GENERATOR_FASHION_DESIGNER,
  street_photographer: IDEA_GENERATOR_STREET_PHOTOGRAPHER,
  architect: IDEA_GENERATOR_ARCHITECT,
  movie_concept_artist: IDEA_GENERATOR_MOVIE_CONCEPT_ARTIST,
  graphic_designer: IDEA_GENERATOR_GRAPHIC_DESIGNER,
  graphic_novel_artist: IDEA_GENERATOR_GRAPHIC_NOVEL_ARTIST,
  weight_master: IDEA_GENERATOR_PHOTOGRAPHER

};

export async function POST({ request, fetch }) {
    const { personality_key, api_key } = await request.json();
    const personality = personalities[personality_key];
    const accessToken = (api_key === "1") ? `${env.KEY}` : api_key;
    const clientOptions = {
    reverseProxyUrl: `${env.ENDPOINT}`,
    accessToken: accessToken,

};
const chatGptClient = new ChatGPTBrowserClient(clientOptions);

    
    if (!personality_key || !api_key) {
        throw error(400, "Invalid request. Please provide prompt_text, personality_key, and api_key.");
    }

    try {
        const max_tokens = 40;
        const stringMessages = `${IDEA_GENERATOR_EXPLANATION}\n${personality}\nGive me a creative idea`;
        console.log(stringMessages);
        const response = await chatGptClient.sendMessage( stringMessages );

        const data1 = response;
        console.log(data1);
        if (data1.error) {
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
