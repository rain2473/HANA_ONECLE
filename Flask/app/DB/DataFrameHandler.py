from DB.OracleHandler import OracleHandler
import pandas as pd

def returnDF(sql, many = False):
    if many:
        results, columns = OracleHandler.queryMany(sql)
    else:
        results, columns = OracleHandler.query(sql)
    return pd.DataFrame(results, columns=columns)

def findItemsAsJson(table, columns = "*", condition = None, orderBy = None, desc = None):
    return findItems(table, columns, condition, orderBy, desc).to_json(orient="records")

def findItems(table, columns = "*", condition = None, orderBy = None, desc = None, many = False):
    if columns == "*" or columns == "count(*)":
        columnStr = columns
    elif type(columns) != list:
        raise Exception('ERR00001 : INVALID PARAMETER TYPE : ONLY LIST TYPE AND "*" VARIABLE')
    else:
        columnStr = ", ".join(columns)

    query = f"""select {columnStr} from {table}"""

    if condition == None:
        pass
    elif type(condition) != str:
        raise Exception('ERR00010 : INVALID PARAMETER TYPE : ONLY STRING TYPE VARIABLE')
    else:
        query += f""" where {condition}"""
    
    if (orderBy == None):
        if (desc != None):
            raise Exception('ERR00011 : LOGICAL CONTRADICTION : CANNOT SPECIFY SORTING ORDER WITHOUT SORTING CRITERIA')
        else:
            pass
    elif (type(orderBy) != str):
        raise Exception('ERR00012 : INVALID PARAMETER TYPE : ONLY STRING TYPE VARIABLE')
    elif (type(columns) != str and orderBy not in columns):
        raise Exception(f"""ERR00013 : INVALID PARAMETER DATA : ONLY CONTENTS OF COLUMN VARIABLE {orderBy} not in {', '.join(columns)}""")
    else:
        query += f""" order by {orderBy}"""
        if desc == True:
            query += " desc"
        elif desc == False or desc == None:
            query += " asc"
        else:
            raise Exception('ERR00014 : INVALID PARAMETER TYPE : ONLY BOOLEAN TYPE VARIABLE')
    return returnDF(query, many)

def deleteAllItems(table):
    OracleHandler.execute(f"TRUNCATE TABLE {table}")

def deleteItemsByCondition(table, condition):
    deleted = findItems(table = table, condition = condition)
    OracleHandler.execute(f"delete from {table} where {condition}")
    return

def insertItems(table, df, many=True, batch_size=100):
    if many:
        insertMany(table, df, batch_size=100000)
    else:
        insertDefault(table, df, batch_size=100)

def insertDefault(table, df, batch_size=100):
    columnList = list(df.columns)
    if 'WORK_DT' in columnList:
        df['WORK_DT'] = df['WORK_DT'].apply(lambda x: f"TO_DATE('{x}', 'YYYY-MM-DD')")
        
    commonString = f"INSERT INTO {table} ({', '.join(columnList)}) " 
    total_rows = len(df)
    num_batches = (total_rows + batch_size - 1) // batch_size

    queryStringList = []
    for batch_num in range(num_batches):
        start_idx = batch_num * batch_size
        end_idx = min((batch_num + 1) * batch_size, total_rows)
        batch_df = df.iloc[start_idx:end_idx]
        values = batch_df.values.tolist()
        statements = ["SELECT {} FROM DUAL".format(", ".join(["'{}'".format(value) if isinstance(value, str) and 'TO_DATE' not in value else value for value in row])) for row in values]
        queryString = commonString + " UNION ALL ".join(statements)
        queryStringList.append(queryString)
    OracleHandler.execute(queryStringList)

# bulk insert
def insertMany(table, df, batch_size=100000):
    columnList = list(df.columns)
    if 'WORK_DT' in columnList:
        df['WORK_DT'] = df['WORK_DT'].dt.strftime('%Y-%m-%d')
        columnList.remove('WORK_DT')
        tmp = df.pop('WORK_DT')
        df = pd.concat([tmp, df], axis=1)
        queryString = f"INSERT INTO {table} (WORK_DT, {', '.join(columnList)})  VALUES (TO_DATE(:1, 'YYYY-MM-DD'), {', '.join([':'+str(i+2) for i in range(len(columnList))])})" 
    elif 'NEWS_DT' in columnList:
        df['NEWS_DT'] = df['NEWS_DT'].dt.strftime('%Y-%m-%d')
        columnList.remove('NEWS_DT')
        tmp = df.pop('NEWS_DT')
        df = pd.concat([tmp, df], axis=1)
        queryString = f"INSERT INTO {table} (NEWS_DT, {', '.join(columnList)})  VALUES (TO_DATE(:1, 'YYYY-MM-DD'), {', '.join([':'+str(i+2) for i in range(len(columnList))])})" 
    elif 'LASTEST' in columnList:
        df['LASTEST'] = df['LASTEST'].dt.strftime('%Y-%m-%d')
        columnList.remove('LASTEST')
        tmp = df.pop('LASTEST')
        df = pd.concat([tmp, df], axis=1)
        queryString = f"INSERT INTO {table} (LASTEST, {', '.join(columnList)})  VALUES (TO_DATE(:1, 'YYYY-MM-DD'), {', '.join([':'+str(i+2) for i in range(len(columnList))])})" 
    else:
        queryString = f"INSERT INTO {table} ({', '.join(columnList)})  VALUES ({', '.join([':'+str(i+1) for i in range(len(columnList))])})" 
    total_rows = len(df)
    num_batches = (total_rows + batch_size - 1) // batch_size
    values = []

    for batch_num in range(num_batches):
        start_idx = batch_num * batch_size
        end_idx = min((batch_num + 1) * batch_size, total_rows)
        batch_df = df.iloc[start_idx:end_idx]
        valueParts = batch_df.values.tolist()
        values.append(valueParts)
    OracleHandler.executeMany(queryString, values)

def replaceTableWithDF(table, df):
    deleteAllItems(table)
    insertItems(table, df)

def mergeTable(target, tmp, pk):
    _, columns = OracleHandler.query(f"select * from {target} where rownum = 0")
    update_values = []
    for col in columns:
        if col.upper() not in pk and col.lower() not in pk:
            update_values.append(f"{target}.{col} = {tmp}.{col}") 
    update_values = ", ".join(update_values)
    insert_values = ", ".join(f"{tmp}.{col}" for col in columns)
    on_values = " and ".join(f"{target}.{key} = {tmp}.{key}" for key in pk)
    queryString = f"MERGE INTO {target} USING {tmp} ON ({on_values}) WHEN MATCHED THEN UPDATE SET {update_values} WHEN NOT MATCHED THEN INSERT ({', '.join(columns)}) VALUES ({insert_values})"
    OracleHandler.execute(queryString)