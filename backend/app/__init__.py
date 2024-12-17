from flask import Flask
from flask_cors import CORS
from config import Config
from .api import api

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Enable CORS
    CORS(app, resources={
        r"/api/*": {
            "origins": ["https://uaf-cgpa-frontend.azurestaticapps.net"],
            "supports_credentials": False
        }
    })
    
    # Register blueprints
    app.register_blueprint(api, url_prefix='/api')
    
    return app
