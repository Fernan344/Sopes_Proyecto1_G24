import MySQLdb
from flask import Flask, jsonify, request
from flask_mysqldb import MySQL
from datetime import datetime

app = Flask(__name__)
app.config['MYSQL_HOST'] = '35.184.7.29'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = '1234'
app.config['MYSQL_DB'] = 'Proyecto1'
mysql = MySQL(app)

@app.route('/publicar', methods=['POST'])
def createProduct(): 

    fecha = datetime.strptime(request.json['fecha'], '%d/%m/%Y')
    newDate = datetime.strftime(fecha, '%Y-%m-%d')

    cursor = mysql.connection.cursor()

    try:
        cursor.execute('INSERT INTO twit (nombre, comentario, fecha, upvotes, downvotes, api) VALUES (%s, %s, %s, %s, %s, \'python\')',
            (request.json['nombre'], request.json['comentario'], newDate, int(request.json['upvotes']), int(request.json['downvotes'])))
        mysql.connection.commit()
    except MySQLdb.Error as e:
        print(e)
    try:
        cursor.execute('SELECT MAX(id) FROM twit')
        idTwit = cursor.fetchall()
    except MySQLdb.Error as e:
        print(e)

    for i in range(0, len(request.json['hashtags'])):
        try:
            hashtag = request.json['hashtags'][i]
            cursor.execute('INSERT INTO hashtags (hashtag) VALUES (%s)',
                (hashtag,))
            mysql.connection.commit()

            try:
                cursor.execute('SELECT MAX(id) FROM hashtags')
                idHash = cursor.fetchall()
            except MySQLdb.Error as e:
                print(e)

            try:
                cursor.execute('INSERT INTO hash_twit (idTwit, idHash) VALUES (%s, %s)',
                    (idTwit[0][0], idHash[0][0]))
                mysql.connection.commit()
            except MySQLdb.Error as e:
                print(e)

        except MySQLdb.Error as e:
            try:
                cursor.execute('SELECT id FROM hashtags WHERE hashtag = %s', (hashtag,))
                idHash = cursor.fetchall()

                try:
                    cursor.execute('INSERT INTO hash_twit (idTwit, idHash) VALUES (%s, %s)',
                        (idTwit[0][0], idHash[0][0]))
                    mysql.connection.commit()
                except MySQLdb.Error as e:
                    print(e)

            except MySQLdb.Error as e:
                print(e)
        

    return jsonify({"message": "ingresado"})

if __name__ == '__main__':
    app.run(debug=True, port=4500)