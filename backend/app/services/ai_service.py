import os
import requests
from openai import OpenAI

class AiService:
    @staticmethod
    def get_response(prompt: str, system_prompt: str = "You are an AI assistant for business analytics and forecasting.") -> str:
        provider = os.getenv("AI_PROVIDER", "openai").lower()

        if provider == "ollama":
            return AiService._ollama_response(prompt, system_prompt)
        else:
            return AiService._openai_response(prompt, system_prompt)

    @staticmethod
    def _ollama_response(prompt: str, system_prompt: str) -> str:
        url = os.getenv("OLLAMA_API_URL", "http://localhost:11434").rstrip("/") + "/api/generate"
        model = os.getenv("OLLAMA_MODEL", "qwen")

        payload = {
            "model": model,
            "prompt": prompt,
            "system": system_prompt,
            "stream": False,
            "options": {
                "temperature": 0.7,
                "num_predict": 450
            }
        }

        try:
            response = requests.post(url, json=payload, timeout=30)
            response.raise_for_status()
            return response.json().get("response", "").strip()
        except Exception as exc:
            return f"Unable to call Ollama service: {exc}"

    @staticmethod
    def _openai_response(prompt: str, system_prompt: str) -> str:
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            return f"OpenAI API key not set. Returning prompt: {prompt}"

        model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
        client = OpenAI(api_key=api_key)

        try:
            response = client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": prompt},
                ],
                temperature=0.7,
                max_tokens=450,
            )
            return response.choices[0].message.content.strip()
        except Exception as exc:
            return f"Unable to call OpenAI service: {exc}"
