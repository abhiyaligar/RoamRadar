import sys
import os

# Add the backend directory to the Python path
backend_path = os.path.join(os.path.dirname(__file__), '..', 'backend')
sys.path.append(os.path.abspath(backend_path))

from main import app
