import redis
import pymongo
import time
import json
import os
from dotenv import load_dotenv
# from pdf_processor import generate_questions

# Load environment variables from .env file
load_dotenv()

# Configure Redis connection
redis_client = redis.Redis(
    host=os.getenv('REDIS_HOST', 'localhost'),
    port=int(os.getenv('REDIS_PORT', 6379)),
    db=int(os.getenv('REDIS_DB', 0)),
)
queue_name = os.getenv('REDIS_QUEUE_NAME')

MONGO_URI = os.getenv('MONGO_URI')
MONGO_DB = os.getenv('MONGO_DB')
MONGO_COLLECTION = os.getenv('MONGO_COLLECTION')
mongo_client_handler = pymongo.MongoClient(MONGO_URI)
mongo_db_handler = mongo_client_handler[MONGO_DB]
collection = mongo_db_handler[MONGO_COLLECTION]

# Fetch all records from the collection
# all_records = collection.find({})

# Debug mode
DEBUG = os.getenv('DEBUG', 'False').lower() in ('true', '1', 't')

def process_job(job_data):
    print(job_data)
    """Process a job from the Redis queue"""
    try:
        # Parse job data
        json_string = job_data.decode('utf-8')
        job_info = json.loads(json_string)
        # job_info = json.loads(job_data)
        pdf_filename = job_info['filename']

        print(pdf_filename)


        job_id = job_info.get('job_id', str(time.time()))
        
        if DEBUG:
            print(f"Processing PDF: {pdf_filename}, Job ID: {job_id}")
        
        # Generate questions from the PDF
        # questions = generate_questions(pdf_filename)
        
        # Store results in MongoDB
        # result = {
        #     'job_id': job_id,
        #     'filename': pdf_filename,
        #     'questions': questions,
        #     'status': 'completed',
        #     'completed_at': time.time()
        # }
        
        # collection.insert_one(result)
        print(f"Job {job_id} completed and saved to MongoDB")
        
        return True
    except Exception as e:
        print(f"Error processing job: {e}")
        # Optionally log error to MongoDB
        error_log = {
            'job_id': job_info.get('job_id', 'unknown'),
            'filename': job_info.get('filename', 'unknown'),
            'status': 'failed',
            'error': str(e),
            'timestamp': time.time()
        }
        collection.insert_one(error_log)
        return False

def main_loop():
    print(f"Starting PDF processing service. Monitoring Redis queue: {queue_name}")
    
    while True:
        try:
            # Block until a job becomes available with timeout of 1 second
            job = redis_client.blpop(queue_name, timeout=1)
            
            if job:
                # job is a tuple (queue_name, data)
                _, job_data = job
                process_job(job_data)
        except Exception as e:
            print(f"Error in main loop: {e}")
            # Continue the loop even if there's an unexpected error
            time.sleep(1)

if __name__ == "__main__":
    main_loop()