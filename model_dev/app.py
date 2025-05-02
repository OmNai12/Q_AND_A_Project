# === Imports ===
import redis
import pymongo
import time
import json
import os
from dotenv import load_dotenv
from model_logic import engine  # Custom logic for processing PDFs

# === Load Environment Variables from .env File ===
load_dotenv()

# === Redis Configuration ===
redis_client = redis.Redis(
    host=os.getenv('REDIS_HOST', 'localhost'),
    port=int(os.getenv('REDIS_PORT', 6379)),
    db=int(os.getenv('REDIS_DB', 0)),
)
queue_name = os.getenv('REDIS_QUEUE_NAME')

# === MongoDB Configuration ===
MONGO_URI = os.getenv('MONGO_URI')
MONGO_DB = os.getenv('MONGO_DB')
MONGO_COLLECTION = os.getenv('MONGO_COLLECTION')

mongo_client_handler = pymongo.MongoClient(MONGO_URI)
mongo_db_handler = mongo_client_handler[MONGO_DB]
collection = mongo_db_handler[MONGO_COLLECTION]

# === Debug Mode Flag ===
DEBUG = os.getenv('DEBUG', 'False').lower() in ('true', '1', 't')


# === Job Processing Logic ===
def process_job(job_data):
    """Process a single job pulled from the Redis queue."""
    try:
        # Decode and parse the job data (assumed JSON)
        json_string = job_data.decode('utf-8')
        job_info = json.loads(json_string)
        
        # Extract necessary details
        pdf_filename = job_info['fileName']
        quiz_id = job_info['quizId']
        
        if DEBUG:
            print(f"[DEBUG] Processing PDF: {pdf_filename}, Quiz ID: {quiz_id}")
        
        # Full path to the PDF file
        fullpath = os.path.join(os.getenv('FILEPATH'), pdf_filename)

        # Generate questions using the model engine
        questions = engine.get_json_data(fullpath)
        
        # Update MongoDB document with generated questions
        filter_query = {"quizId": quiz_id}
        update_operation = {"$push": {"quiz": questions}}
        collection.update_one(filter_query, update_operation)
        
        print(f"[INFO] Job {quiz_id} completed and saved to MongoDB")
        return True

    except Exception as e:
        print(f"[ERROR] Error processing job: {e}")
        
        # Optional: Log error to MongoDB for diagnostics
        error_log = {
            'job_id': job_info.get('job_id', 'unknown'),
            'filename': job_info.get('fileName', 'unknown'),
            'status': 'failed',
            'error': str(e),
            'timestamp': time.time()
        }
        collection.insert_one(error_log)
        return False


# === Main Worker Loop ===
def main_loop():
    """Continuously monitor the Redis queue and process incoming jobs."""
    print(f"[INFO] Starting PDF processing service. Monitoring Redis queue: {queue_name}")
    
    while True:
        try:
            # Wait for a job to appear in the Redis queue (1s timeout)
            job = redis_client.blpop(queue_name, timeout=1)
            
            if job:
                # Extract job data from (queue_name, job_data) tuple
                _, job_data = job
                process_job(job_data)
        
        except Exception as e:
            print(f"[ERROR] Error in main loop: {e}")
            # Sleep briefly and continue to avoid crashing the worker
            time.sleep(1)


# === Entry Point ===
if __name__ == "__main__":
    main_loop()
