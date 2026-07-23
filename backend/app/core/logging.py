import logging
import uuid
from contextvars import ContextVar
from typing import Optional

request_id_ctx: ContextVar[Optional[str]] = ContextVar("request_id", default=None)

class RequestIDFilter(logging.Filter):
    def filter(self, record: logging.LogRecord) -> bool:
        record.request_id = request_id_ctx.get() or "no-req-id"
        return True

def setup_logging():
    log_format = "[%(asctime)s] [%(levelname)s] [req_id=%(request_id)s] [%(name)s]: %(message)s"
    formatter = logging.Formatter(log_format)
    
    handler = logging.StreamHandler()
    handler.setFormatter(formatter)
    handler.addFilter(RequestIDFilter())
    
    root_logger = logging.getLogger("negosphere")
    root_logger.setLevel(logging.INFO)
    root_logger.handlers = [handler]

def generate_request_id() -> str:
    req_id = f"req-{uuid.uuid4().hex[:8]}"
    request_id_ctx.set(req_id)
    return req_id

logger = logging.getLogger("negosphere")
