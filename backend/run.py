"""Main entry point for TokBiz Flask application"""
import os
from app import create_app, db
from dotenv import load_dotenv

load_dotenv()

app = create_app(os.getenv("FLASK_ENV", "development"))

@app.shell_context_processor
def make_shell_context():
    """Make app context available in shell"""
    return {"db": db}

@app.route("/health", methods=["GET"])
def health_check():
    """Health check endpoint"""
    return {"status": "ok", "message": "TokBiz backend is running"}, 200

if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=int(os.getenv("FLASK_PORT", 5000)),
        debug=os.getenv("FLASK_ENV") == "development"
    )
