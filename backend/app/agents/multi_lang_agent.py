import logging
from typing import Dict, Any
from app.services.llm_service import llm_service

logger = logging.getLogger("negosphere.agent.multilang")

LANGUAGES = {
    "English": "English",
    "Hindi": "Hindi (हिंदी)",
    "Tamil": "Tamil (தமிழ்)",
    "Telugu": "Telugu (తెలుగు)",
    "Kannada": "Kannada (ಕನ್ನಡ)",
    "Malayalam": "Malayalam (മലയാളം)"
}

LOCALIZED_FALLBACKS = {
    "Hindi": {
        "opening": "नमस्ते! मैं आज {product_name} खरीदना चाहता हूँ। मुझे यह बाजार में ₹{target_price:,} के आसपास दिख रहा है। क्या आप इस कीमत पर दे सकते हैं?",
        "followup": "अगर आप ₹{target_price:,} में तैयार हैं, तो मैं अभी तुरंत भुगतान करूँगा।",
        "objection": "मैं आपकी बात समझता हूँ, लेकिन मेरा बजट सीमित है। क्या हम ₹{target_price:,} पर डील पक्की कर सकते हैं?"
    },
    "Tamil": {
        "opening": "வணக்கம்! நான் இன்று {product_name} வாங்க விரும்புறேன். சந்தையில் ₹{target_price:,} வரை கிடைக்கிறது. இந்த விலைக்கு தர முடியுமா?",
        "followup": "₹{target_price:,} விலைக்கு சம்மதித்தால் நான் உடனே பணம் செலுத்துகிறேன்.",
        "objection": "உங்கள் நிலைமை புரிகிறது, ஆனால் என் பட்ஜெட் ₹{target_price:,} தான். கொஞ்சம் குறைத்து தர முடியுமா?"
    },
    "Telugu": {
        "opening": "నమస్కారం! నేను ఈ రోజు {product_name} కొనాలనుకుంటున్నాను. మార్కెట్లో ఇది ₹{target_price:,} కి లభిస్తోంది. మీరు ఈ ధరకు ఇవ్వగలరా?",
        "followup": "మీరు ₹{target_price:,} కి ఇస్తే నేను వెంటనే చెల్లింపు పూర్తి చేస్తాను.",
        "objection": "నా బడ్జెట్ పరిమితంగా ఉంది. మనం ₹{target_price:,} దగ్గర డీల్ పూర్తి చేయవచ్చా?"
    },
    "Kannada": {
        "opening": "ನಮಸ್ಕಾರ! ನಾನು ಇಂದು {product_name} ಖರೀದಿಸಲು ಬಯಸುತ್ತೇನೆ. ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಇದು ₹{target_price:,} ಕ್ಕೆ ಲಭ್ಯವಿದೆ. ನೀವು ಈ ಬೆಲೆಗೆ ನೀಡಬಹುದೇ?",
        "followup": "ನೀವು ₹{target_price:,} ಗೆ ಒಪ್ಪಿದರೆ ನಾನು ತಕ್ಷಣ ಪಾವತಿ ಮಾಡುತ್ತೇನೆ.",
        "objection": "ನನ್ನ ಬಜೆಟ್ ನಿಗದಿಯಾಗಿದೆ. ನಾವು ₹{target_price:,} ನಲ್ಲಿ ಡೀಲ್ ಮುಗಿಸಬಹುದೇ?"
    },
    "Malayalam": {
        "opening": "നമസ്കാരം! ഞാൻ ഇന്ന് {product_name} വാങ്ങാൻ ആഗ്രഹിക്കുന്നു. വിപണിയിൽ ഇത് ₹{target_price:,} രൂപയ്ക്ക് ലഭ്യമാണ്. ഈ വിലയ്ക്ക് നൽകാൻ കഴിയുമോ?",
        "followup": "₹{target_price:,} രൂപയ്ക്ക് സമ്മതിക്കുകയാണെങ്കിൽ ഞാൻ ഉടനടി പേയ്‌മെന്റ് ചെയ്യാം.",
        "objection": "എന്റെ ബജറ്റ് പരിമിതമാണ്. നമുക്ക് ₹{target_price:,} രൂപയ്ക്ക് ഈ ഡീൽ ഉറപ്പിക്കാമോ?"
    }
}

class MultiLangAgent:
    """
    Agent 6: Multi-language Negotiation Agent
    Responsibility: Adapts negotiation messages fluently into 6 supported target languages:
    English, Hindi, Tamil, Telugu, Kannada, Malayalam.
    Preserves negotiation tone and cultural etiquette over literal translations.
    """
    async def process(self, scripts: Dict[str, Any], target_language: str = "English", product_name: str = "", target_price: float = 0) -> Dict[str, Any]:
        if target_language == "English" or target_language not in LANGUAGES:
            return {
                "language": "English",
                "opening_line": scripts.get("opening_line", ""),
                "followup_script": scripts.get("followup_script", ""),
                "objection_response": scripts.get("objection_response", "")
            }

        # Attempt LLM natural contextual translation
        prompt = f"""
        Adapt the following negotiation messages naturally into {target_language}.
        Do not do literal word-for-word translation. Maintain an authentic, polite yet firm negotiation tone.

        Opening Line: {scripts.get('opening_line')}
        Follow-up Script: {scripts.get('followup_script')}
        Objection Handler: {scripts.get('objection_response')}

        Return JSON with keys: opening_line, followup_script, objection_response.
        """
        system_instruction = f"You are a native {target_language} linguistic expert specializing in commercial negotiations."

        llm_res = await llm_service.generate_json(prompt, system_instruction)
        if isinstance(llm_res, dict) and "opening_line" in llm_res and len(llm_res["opening_line"]) > 5:
            return {
                "language": target_language,
                "opening_line": llm_res.get("opening_line"),
                "followup_script": llm_res.get("followup_script"),
                "objection_response": llm_res.get("objection_response")
            }

        # Fallback to authentic regional scripts
        lang_dict = LOCALIZED_FALLBACKS.get(target_language, {})
        target_p = int(target_price) if target_price > 0 else 5000
        return {
            "language": target_language,
            "opening_line": lang_dict.get("opening", scripts.get("opening_line")).format(product_name=product_name, target_price=target_p),
            "followup_script": lang_dict.get("followup", scripts.get("followup_script")).format(product_name=product_name, target_price=target_p),
            "objection_response": lang_dict.get("objection", scripts.get("objection_response")).format(product_name=product_name, target_price=target_p)
        }

multi_lang_agent = MultiLangAgent()
