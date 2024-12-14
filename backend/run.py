from app import create_app
from config import Config

app = create_app()

if __name__ == "__main__":
    print("🚀 UAF Result API is starting...")
    print(f"📡 API will be available at: http://localhost:{Config.PORT}/api/result?reg_number=XXXX-ag-XXXX")
    app.run(
        host=Config.HOST,
        port=Config.PORT,
        debug=Config.DEBUG
    )
