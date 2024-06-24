import os
import subprocess
import tempfile
import werkzeug
import logging
from flask import Flask, request, jsonify
from PIL import Image
from pydub import AudioSegment
from pydub.playback import play
from flask_cors import CORS
from datetime import datetime


app = Flask(__name__)

CORS(app)
logging.basicConfig(level=logging.DEBUG)

def print_image_with_rundll32(image_path,frame_type):
    try:
        # Determine the printer name based on the condition
        print("frame_type")
        print(frame_type)
        print(frame_type)
        if frame_type == 'stripx2':
            printer_name = 'DS-RX1 (Photostrips)'
        else :
            printer_name = 'DS-RX1'
        print(printer_name)
        # Print the image using rundll32
        print_command = f'rundll32.exe C:\\Windows\\System32\\shimgvw.dll,ImageView_PrintTo /pt "{image_path}" "{printer_name}"'
        logging.debug(f"Executing print command: {print_command}")
        subprocess.run(print_command, check=True, shell=True)
        logging.debug(f"Print command sent for file: {image_path}")
    except subprocess.CalledProcessError as e:
        logging.error(f"Error printing file: {e}")
        raise
    except ValueError as e:
        logging.error(e)
        raise


@app.route('/api/switch-printer/<printer_model>/<frame_type>/', methods=['POST'])
def switch_printer(printer_model, frame_type):
    print(request.files)
    print(request)
    
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    safe_filename = werkzeug.utils.secure_filename(file.filename)
    temp_dir = tempfile.gettempdir()
    file_path = os.path.join(temp_dir, safe_filename)
    file.save(file_path)


    print(file_path)
    try:
        # Print the image file
        print_image_with_rundll32(file_path,frame_type)
    except Exception as e:
        logging.error(f"Error processing print job: {e}")
        return jsonify({'error': str(e)}), 500
    finally:
        os.remove(file_path)
    
    return jsonify({'status': 'success', 'message': 'Print job started successfully.'})




@app.route('/api/play_sound/', methods=['POST'])
def play_sound():
    try:
        # Get JSON data from request
        data = request.get_json()
        if not data or 'file_name' not in data:
            return jsonify({"error": "File name is required"}), 400

        file_name = data['file_name']

        print(file_name)

        # Path to the directory containing the sound files
        sound_files_directory = "playsound/"

        # Construct the full file path
        file_path = os.path.join(sound_files_directory, file_name)

        print(file_path)

        print(datetime.now())

        # Check if the file exists
        if not os.path.isfile(file_path):
            return jsonify({"error": "File not found"}), 404

        # Play the sound file using pydub
        sound = AudioSegment.from_file(file_path)
        play(sound)

        return jsonify({"status": "Playing sound", "file_name": file_name}), 200
    except Exception as e:
        app.logger.error(f"Error occurred: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8001)
