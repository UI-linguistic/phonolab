import uuid
from flask import request, make_response, g

COOKIE_NAME = "session_id"
COOKIE_MAX_AGE = 60 * 60 * 24 * 365  # 1 year


def get_or_create_session_id():
    """
    Retrieves the session_id from the cookie, or generates one if missing.
    Stores it in Flask's `g` for easy access during the request lifecycle.
    """
    session_id = request.cookies.get(COOKIE_NAME)

    if not session_id:
        session_id = str(uuid.uuid4())

    g.session_id = session_id
    return session_id


def attach_session_cookie(response):
    """
    Adds the session_id cookie to the outgoing response if it's not already set.
    This should be called in an `after_request` hook.
    """
    session_id = getattr(g, "session_id", None)

    if session_id and not request.cookies.get(COOKIE_NAME):
        response.set_cookie(
            COOKIE_NAME,
            session_id,
            max_age=COOKIE_MAX_AGE,
            httponly=True,
            samesite="Lax",
            secure=False  # True if serving over HTTPS only
        )

    return response
