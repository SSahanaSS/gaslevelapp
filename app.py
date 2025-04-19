from flask import Flask, jsonify, request
from flask_cors import CORS
import pywhatkit
import random
import datetime
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://postgres:Soup%402004@localhost:5432/gas_monitoring"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Simulate gas level (can be replaced with real sensor values)
gas_level = random.uniform(30, 100)

@app.route('/gas-level', methods=['GET'])
def get_gas_level():
    try:
        print("inside get gas level")
        with db.engine.connect() as connection:
            query = text("SELECT gaslevel FROM gas_readings ORDER BY readingtime DESC LIMIT 1")
            result = connection.execute(query).fetchone()
            if result:
                gas_level = result[0]
                if gas_level < 20:
                    # Trigger WhatsApp message if gas level is below 20
                    val = trigger_whatsapp("+916381032503", "Refill Needed !!!!")
                    print("WhatsApp message sent")
                    if val == 200:
                        return jsonify({'gaslevel': gas_level, 'message': 'Refill Needed'}), 200
                    else:
                        return jsonify({'gaslevel': gas_level, 'message': 'Error in sending WhatsApp'}), 500
                else:
                    # Just return the gas level if it's above 20
                    return jsonify({'gaslevel': gas_level}), 200
            else:
                return jsonify({'gaslevel': -1, 'message': 'Error retrieving gas level'}), 400
    except Exception as e:
        return jsonify({'Message': f"{e}"}), 404


def trigger_whatsapp(phone_number, message):
    try:
        # Get current time and schedule message to be sent in 1 minute
        now = datetime.datetime.now()
        send_time = now + datetime.timedelta(minutes=1)  # Safe 1-minute buffer
        send_hour = send_time.hour
        send_minute = send_time.minute

        # Print the scheduled time for debugging
        print(f"Scheduled send time: {send_time} (Hour: {send_hour}, Minute: {send_minute})")

        # Send the WhatsApp message
        pywhatkit.sendwhatmsg(phone_number, message, send_hour, send_minute, wait_time=60, tab_close=True)
        print("WhatsApp message sent successfully!")
        return 200
    except Exception as e:
        print(f"Error sending message: {e}")
        return 500


if __name__ == '__main__':
    print("Starting Flask app")
    app.run(host='0.0.0.0', port=8090, debug=True)
