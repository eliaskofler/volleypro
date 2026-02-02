from apscheduler.schedulers.background import BackgroundScheduler
from flask import Flask, jsonify
from datetime import datetime

# Import jobs
from jobs.beach import save_beach
from jobs.volley import save_volley

app = Flask(__name__)

# Scheduler
scheduler = BackgroundScheduler()
scheduler.add_job(save_beach, 'interval', hours=6, id="beach_job", next_run_time=datetime.now())
scheduler.add_job(save_volley, 'interval', hours=6, id="volley_job", next_run_time=datetime.now())
scheduler.start()

@app.route("/")
def index():
    return "FIVB Python Server Running!"

@app.route("/health")
def health():
    return jsonify({"status": "ok"})

if __name__ == "__main__":
    try:
        app.run(host="0.0.0.0", port=8000)
    except (KeyboardInterrupt, SystemExit):
        scheduler.shutdown()
