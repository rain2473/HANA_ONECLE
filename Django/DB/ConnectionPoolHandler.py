import oracledb
from queue import Queue
import threading
import environ
import os
from dotenv import load_dotenv

pool_min = 2
pool_max = 4

current_dir = os.path.dirname(os.path.abspath(__file__))
env_file_path = os.path.join(current_dir, "DBconfig.env")
load_dotenv(env_file_path)

def getEnvConfig():
    config = {}
    try:
        environ.Env.read_env(env_file_path)
    except:
        raise Exception("ENV FILE NOT FOUND")
    try:
        config['user'] = os.environ.get('user')
        config['password'] = os.environ.get('password')
        config['dsn'] = os.environ.get('dsn')
        config['config_dir'] = os.environ.get('config_dir')
        config['wallet_location'] = os.environ.get('wallet_location')
        config['wallet_password'] = os.environ.get('wallet_password')
    except:
            raise Exception("ENV NOT AVAILABLE")
    return config

# 커넥션 풀 클래스 정의
class ConnectionPool:
    _instance_lock = threading.Lock()
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            with cls._instance_lock:
                if cls._instance is None:
                    cls._instance = super().__new__(cls)
                    cls._instance._init_connection_pool()
        return cls._instance

    def _init_connection_pool(self):
        self.queue = Queue()
        self.config = getEnvConfig()
        for _ in range(pool_min):
            connection = self.create_connection()
            self.queue.put(connection)

    def create_connection(self):
        connection = oracledb.connect(
            user = self.config['user'],
            password = self.config['password'],
            dsn = self.config['dsn'],
            config_dir = self.config['config_dir'],
            wallet_location = self.config['wallet_location'],
            wallet_password = self.config['wallet_password']
        )
        return connection

    def acquire(self):
        if self.queue.empty():
            if self.queue.qsize() < pool_max:
                connection = self.create_connection()
                self.queue.put(connection)
            else:
                raise Exception("Connection pool is full")
        return self.queue.get()

    def release(self, connection):
        try:
            self.queue.put(connection)
        except self.queue.Full:
            connection.close()
        except oracledb.DatabaseError:
            connection.close()