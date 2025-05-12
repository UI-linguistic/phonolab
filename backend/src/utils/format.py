from flask import jsonify


def success_response(message: str = "Success", data: dict = None, status_code: int = 200):
    """
    Return a standardized success response.
    """
    payload = {"status": "success", "message": message}
    if data is not None:
        payload["data"] = data
    return jsonify(payload), status_code


def error_response(message: str = "An error occurred", status_code: int = 400, errors: dict = None):
    """
    Return a standardized error response.
    """
    payload = {"status": "error", "message": message}
    if errors:
        payload["errors"] = errors
    return jsonify(payload), status_code
