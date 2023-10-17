from . import ConnectionPoolHandler
import threading
import oracledb
from sqlalchemy import create_engine

class OracleHandler:
    connectionPool = ConnectionPoolHandler.ConnectionPool()
    thread_local = threading.local()
    _instance = None
    engine = None

    def __init__(self):
        pass

    def __new__(cls):
        if cls._instance is None:
            connection = ConnectionPoolHandler.getEnvConfig()
            cls._instance = super(OracleHandler, cls).__new__(cls)
            cls.engine = create_engine(
                f'oracle+oracledb://:@',
                connect_args={
                    "user": connection['user'],
                    "password": connection['password'],
                    "dsn": connection['dsn'],
                    "config_dir": connection['config_dir'],
                    "wallet_location": connection['wallet_location'],
                    "wallet_password": connection['wallet_password'],
                })
        return cls._instance
    
    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = OracleHandler()
        return cls._instance

    def get_connection(self):
        if not hasattr(self.thread_local, 'connection'):
            self.thread_local.connection = self.connectionPool.acquire()
        return self.thread_local.connection

    def release_connection(self):
        connection = getattr(self.thread_local, 'connection', None)
        if connection:
            self.connectionPool.release(connection)
            del self.thread_local.connection

    @staticmethod
    def get_engine():
        return OracleHandler.get_instance().engine

    @staticmethod
    def execute(statements):
        _instance = OracleHandler.get_instance()
        connection = _instance.get_connection()
        cursor = connection.cursor()
        try:
            if type(statements) == list:
                for statement in statements:
                    cursor.execute(statement)
            else:
                cursor.execute(statements)
            connection.commit()
        except oracledb.DatabaseError as e:
            print(e)
            connection.rollback()
        finally:
            cursor.close()
            _instance.release_connection()
    
    @staticmethod
    def executeMany(queryString, values):
        _instance = OracleHandler.get_instance()
        connection = _instance.get_connection()
        cursor = connection.cursor()
        try:
            for value in values:
                cursor.executemany(queryString, value)
            connection.commit()
        except oracledb.DatabaseError as e:
            print(e)
            connection.rollback()
        finally:
            cursor.close()
            _instance.release_connection()

    @staticmethod
    def query(query):
        _instance = OracleHandler.get_instance()
        connection = _instance.get_connection()
        cursor = connection.cursor()
        try:
            cursor.execute(query)
            resultSet = cursor.fetchall()
            columnSet = [desc[0] for desc in cursor.description]
        except oracledb.DatabaseError as e:
            print(e)
            print(query)
            resultSet = [1]
            columnSet = ["Error"]
        finally:
            cursor.close()
            _instance.release_connection()
        return resultSet, columnSet
    
    @staticmethod
    def queryMany(query, size=100000):
        _instance = OracleHandler.get_instance()
        connection = _instance.get_connection()
        cursor = connection.cursor()
        try:
            cursor.execute(query)
            resultSet = cursor.fetchmany(size)
            columnSet = [desc[0] for desc in cursor.description]
        except oracledb.DatabaseError as e:
            print(e)
            print(query)
            resultSet = [1]
            columnSet = ["Error"]
        finally:
            cursor.close()
            _instance.release_connection()
        return resultSet, columnSet
    
    @staticmethod
    def test():
        resultSet = OracleHandler.query("select * from TEST_SAMPLE order by id asc")
        for result in resultSet:
            print(result)
