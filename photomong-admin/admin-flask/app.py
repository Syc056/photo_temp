from flask import Flask, request, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import random
import string
from datetime import datetime
import json
import pytz

app = Flask(__name__, static_folder='../public', template_folder='../public')

# 로컬 MySQL 데이터베이스 설정
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:1234@localhost/photo'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# CORS 설정 추가
CORS(app, supports_credentials=True, resources={r"/api/*": {"origins": ["http://localhost:3001", "http://localhost:3000"]}})

#CORS(app, supports_credentials=True, resources={r"/api/*": {"origins": "http://localhost:3001","http://localhost:3000"}})
#CORS(app, supports_credentials=True)
#CORS(app, resources={r"/api/*": {"origins": "*"}})
db = SQLAlchemy(app)

class Device(db.Model):
    __tablename__ = 'devices'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))
    device_code = db.Column(db.String(50))
    remaining_amount = db.Column(db.Integer)
    sales = db.Column(db.String(50))
    create_date = db.Column(db.DateTime, default=datetime.utcnow)
    promotion_code = db.Column(db.JSON)
    ip = db.Column(db.String(50))
# 예제 모델 설정

class PaymentLog(db.Model):
    __tablename__ = 'payment_logs' 
    id = db.Column(db.Integer, primary_key=True)
    payment_time = db.Column(db.DateTime, nullable=False)
    device = db.Column(db.String(80))
    device_code = db.Column(db.String(80))
    payment_amount = db.Column(db.Float)
    payment_method = db.Column(db.String(80))

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.String(80), primary_key=True)
    ip = db.Column(db.String(45))
    password = db.Column(db.String(255))


@app.route('/')
def index():
    return send_from_directory(app.template_folder, 'index.html')

def get_hanoi_time():
    tz = pytz.timezone('Asia/Ho_Chi_Minh')  # 베트남 하노이 시간대
    now = datetime.now(tz)
    return now.strftime('%Y.%m.%d %H:%M:%S')


@app.route('/api/users', methods=['POST'])
def create_user():
    data = request.get_json()
    new_user = User(id=data['id'],ip=data['ip'], password=data['password'])
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User created successfully'}), 201

@app.route('/api/users', methods=['GET'])
def get_users():
    users = User.query.all()
    users_list = [{
        'id': user.id,
        'ip': user.ip,
        'password': user.password
    } for user in users]
    return jsonify(users_list)


@app.route('/api/delete_user/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'User deleted successfully'})


@app.route('/api/devices', methods=['GET'])
def get_devices():
    devices = Device.query.all()
    devices_list = [{
        'id': device.id,
        'name': device.name,
        'device_code': device.device_code,
        'remaining_amount': device.remaining_amount,
        'sales': device.sales,
        'create_date': device.create_date,
        'promotion_code': device.promotion_code,
        'ip': device.ip
    } for device in devices]
    return jsonify(devices_list)


@app.route('/api/update_sales/<int:id>', methods=['PUT'])
def update_sales(id):
    data = request.get_json()
    device = Device.query.get_or_404(id)
    device.sales = data['Sales']
    db.session.commit()
    return jsonify({'message': 'Sales updated successfully'}), 200


@app.route('/api/add_device', methods=['POST'])
def add_device():
    data = request.get_json()
    new_device = Device(
        name=data['name'],
        device_code=data['device_code'],
        remaining_amount=data['remaining_amount'],
        sales=data['sales'],
        promotion_code=data['promotion_code'],
        ip=data['ip']
    )
    db.session.add(new_device)
    db.session.commit()
    return jsonify({'message': 'Device added successfully'}), 201

@app.route('/api/edit_device/<int:id>', methods=['PUT'])
def edit_device(id):
    data = request.get_json()
    device = Device.query.get_or_404(id)
    device.name = data['name']
    device.device_code = data['device_code']
    device.remaining_amount = data['remaining_amount']
    device.sales = data['sales']
    device.promotion_code = data['promotion_code']
    device.ip=data['ip']

    db.session.commit()
    return jsonify({'message': 'Device updated successfully'}), 200

@app.route('/api/delete_device/<int:id>', methods=['DELETE'])
def delete_device(id):
    device = Device.query.get_or_404(id)
    db.session.delete(device)
    db.session.commit()
    return jsonify({'message': 'Device deleted successfully'}), 200

@app.route('/api/update_print_amount/<int:id>', methods=['PUT'])
def update_print_amount(id):
    data = request.get_json()
    device = Device.query.get_or_404(id)
    device.remaining_amount = data['remaining_amount']
    db.session.commit()
    return jsonify({'message': 'Print amount updated successfully'}), 200

@app.route('/api/get_print_amount', methods=['GET'])
def get_print_amount():
    print_amount = request.args.get('printAmount', type=int)
    check_coupon = request.args.get('checkCoupon', type=int)
    if print_amount is not None:
        return jsonify({'printAmountReceived': print_amount})
    else:
        return jsonify({'error': 'No print amount provided'}), 400

@app.route('/api/summary', methods=['GET'])
def summary():
    total_remaining = db.session.query(db.func.sum(Device.remaining_amount)).scalar()
    total_sales = db.session.query(db.func.sum(db.cast(Device.sales, db.Integer))).scalar()
    return jsonify({
        'total_remaining': total_remaining,
        'total_sales': total_sales
    })

@app.route('/api/generate_promotion', methods=['POST'])
def generate_promotion():
    code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))  # 8자리 숫자로 변경
    return jsonify({'promotion_code': code})

@app.route('/api/delete_promotion/<int:id>', methods=['DELETE'])
def delete_promotion(id):
    return jsonify({'message': 'Promotion deleted successfully'}), 200

@app.route('/api/list_promotions', methods=['GET'])
def list_promotions():
    return jsonify([])

@app.route('/api/check_promotion_code', methods=['POST'])
def check_promotion_code():
    data = request.get_json()
    print(data)
    code = data['code']
    ip = data['ip']  # 요청에 디바이스 ID가 포함되어 있다고 가정합니다.

    # 해당 디바이스를 가져옵니다.
    device = Device.query.filter_by(ip=ip).first()

    if not device:
        return jsonify({'message': 'Device not found'}), 404

    # JSON 필드인 promotion_codes에서 특정 코드가 있는지 확인합니다.
    # promotion_codes 필드는 JSON 배열로 저장되어 있습니다.
    if code in device.promotion_code:
        return jsonify({'message': 'Promotion code is valid'}), 200
    else:
        return jsonify({'message': 'Promotion code is invalid'}), 404


@app.route('/api/log_payment', methods=['POST'])
def log_payment():
    data = request.get_json()
    new_log = PaymentLog(
        payment_time=get_hanoi_time(),  # 현재 하노이 시간 설정
        device=data['device'],
        device_code=data['device_code'],
        payment_amount=data['payment_amount'],
        payment_method=data['payment_method']
    )
    db.session.add(new_log)
    db.session.commit()
    return jsonify({'message': 'Payment log added successfully'}), 201


@app.route('/api/logs', methods=['GET'])
def get_logs():
    logs = PaymentLog.query.all()
    print(logs)
    logs_list = [{
        'id': log.id,
        'payment_time': log.payment_time,
        'device': log.device,
        'device_code': log.device_code,
        'payment_amount': log.payment_amount,
        'payment_method': log.payment_method
    } for log in logs]
    return jsonify(logs_list)



if __name__ == "__main__":
    app.run(host='0.0.0.0', port=9000, threaded=True, debug=True)
