import json
import logging
import httpx
from typing import Dict, Any, Optional
from app.config import settings

logger = logging.getLogger("negosphere.llm")

class LLMService:
    def __init__(self):
        self.gemini_key = settings.GEMINI_API_KEY
        self.openai_key = settings.OPENAI_API_KEY

    async def generate_json(self, prompt: str, system_instruction: Optional[str] = None) -> Dict[str, Any]:
        """Generate structured JSON using available LLM or intelligent fallback."""
        if self.gemini_key:
            try:
                res = await self._call_gemini(prompt, system_instruction, response_mime_type="application/json")
                if res:
                    return json.loads(res)
            except Exception as e:
                logger.warning(f"Gemini API call failed, falling back: {e}")

        if self.openai_key:
            try:
                res = await self._call_openai(prompt, system_instruction, json_mode=True)
                if res:
                    return json.loads(res)
            except Exception as e:
                logger.warning(f"OpenAI API call failed, falling back: {e}")

        # Fallback to local parsing logic if LLM is unavailable
        return {"status": "fallback", "message": "Using heuristic engine"}

    async def generate_text(self, prompt: str, system_instruction: Optional[str] = None) -> str:
        """Generate text response using available LLM or fallback."""
        if self.gemini_key:
            try:
                res = await self._call_gemini(prompt, system_instruction)
                if res:
                    return res
            except Exception as e:
                logger.warning(f"Gemini text call failed: {e}")

        if self.openai_key:
            try:
                res = await self._call_openai(prompt, system_instruction)
                if res:
                    return res
            except Exception as e:
                logger.warning(f"OpenAI text call failed: {e}")

        return ""

    async def _call_gemini(self, prompt: str, system_instruction: Optional[str] = None, response_mime_type: Optional[str] = None) -> str:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={self.gemini_key}"
        
        contents = []
        if system_instruction:
            contents.append({"role": "user", "parts": [{"text": f"System Instructions: {system_instruction}"}]})
            contents.append({"role": "model", "parts": [{"text": "Understood. I will follow these instructions."}]})
        
        contents.append({"role": "user", "parts": [{"text": prompt}]})

        payload: Dict[str, Any] = {"contents": contents}
        if response_mime_type == "application/json":
            payload["generationConfig"] = {"responseMimeType": "application/json"}

        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(url, json=payload)
            if resp.status_code == 200:
                data = resp.json()
                try:
                    return data["candidates"][0]["content"]["parts"][0]["text"]
                except (KeyError, IndexError):
                    return ""
            else:
                logger.error(f"Gemini API error {resp.status_code}: {resp.text}")
                return ""

    async def _call_openai(self, prompt: str, system_instruction: Optional[str] = None, json_mode: bool = False) -> str:
        url = "https://api.openai.com/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {self.openai_key}",
            "Content-Type": "application/json"
        }
        
        messages = []
        if system_instruction:
            messages.append({"role": "system", "content": system_instruction})
        messages.append({"role": "user", "content": prompt})

        payload: Dict[str, Any] = {
            "model": "gpt-4o-mini",
            "messages": messages
        }
        if json_mode:
            payload["response_format"] = {"type": "json_object"}

        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(url, headers=headers, json=payload)
            if resp.status_code == 200:
                data = resp.json()
                return data["choices"][0]["message"]["content"]
            return ""

llm_service = LLMService()
