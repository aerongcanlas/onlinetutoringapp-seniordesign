from flask import Flask, make_response, jsonify, request
from flask_mysqldb import MySQL
import random
import MySQLdb.cursors
import json
import bcrypt


app = Flask(__name__)
app.secret_key = 'OnlineTutoringApp'
app.config['MYSQL_HOST'] = '34.31.111.68'
app.config['MYSQL_USER'] = 'OnlineTutorDatabase'
app.config['MYSQL_PASSWORD'] = 'OnlineTutorDatabase'
app.config['MYSQL_DB'] = 'OnlineTutoringApp'
app.config['JSON_SORT_KEYS'] = False
mysql = MySQL(app)


@app.after_request
def headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = '*'
    return response


@app.route('/tutors', methods=['GET'])
def tutor():
    myCursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    myCursor.execute("SELECT Tutor.Username AS Username,\
            concat(Tutor.FirstName,' ',Tutor.LastName) AS TutorName,\
            Tutor.Email AS Email,\
            Tutor.AboutMe AS AboutMe,\
            Tutor.TotalHours AS TotalHours,\
            Tutor.ProfilePicture AS ProfilePicture,\
            group_concat(Subject.SubjectName separator ',') AS Subjects\
            From Tutor\
            INNER JOIN Subject ON Tutor.Username = Subject.TID\
            GROUP BY Tutor.Username\
            LIMIT 10")
    mysql.connection.commit()
    myResult = myCursor.fetchall()

    if myResult:
        # return resp
        return jsonify(myResult)
    else:
        return 'Error fetching in tutor'


@app.route('/tutors/<username>', methods=['GET'])
def tutor_username(username):
    myCursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    myCursor.execute("SELECT Tutor.Username AS Username,\
                     concat(Tutor.FirstName,' ',Tutor.LastName) AS TutorName,\
                     Tutor.Email AS Email,\
            Tutor.AboutMe AS AboutMe,\
            Tutor.TotalHours AS TotalHours,\
            Tutor.ProfilePicture AS ProfilePicture,\
            group_concat(Subject.SubjectName separator ',') AS Subjects\
            FROM Tutor\
            INNER JOIN Subject ON Tutor.Username = Subject.TID\
            WHERE Tutor.Username = %s\
            GROUP BY Tutor.Username", (username,))
    mysql.connection.commit()
    myResult = myCursor.fetchone()
    if myResult:
        return jsonify(myResult)
    else:
        return 'Username unfounded in database'


@app.route('/tutorsall/<username>', methods=['GET'])
def tutor_info(username):
    myCursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    myCursor.execute("SELECT *\
            From Tutor\
            WHERE Tutor.Username = %s\
            GROUP BY Tutor.Username", (username,))
    mysql.connection.commit()
    myResult = myCursor.fetchone()
    if myResult:
        return jsonify(myResult)
    else:
        return 'Username unfounded in database'


@app.route('/students', methods=['GET'])
def Student():
    myCursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    myCursor.execute('SELECT * FROM Student')
    mysql.connection.commit()
    myResult = myCursor.fetchall()
    if myResult:
        return jsonify(myResult)
    else:
        return 'Error fetching in Student'


@app.route('/appointments', methods=['GET'])
def Appointments():
    myCursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    myCursor.execute("SELECT Appointments.AppointmentID, \
                    Appointments.SID as StudentID,\
                    Appointments.TID as TutorID,\
                    concat(Tutor.FirstName,' ',Tutor.LastName) AS TutorName, \
                    concat(Student.FirstName,' ', Student.LastName) AS StudentName,\
                    concat(Appointments.Date,' ',Appointments.Time) AS Date_Time,\
                    Appointments.Duration,\
                    Appointments.SubjectName as Subject\
                    From Appointments\
                    INNER JOIN Student ON Appointments.SID = Student.Username\
                    INNER JOIN Tutor ON Appointments.TID = Tutor.Username")

    mysql.connection.commit()
    myResult = myCursor.fetchall()
    if myResult:
        return jsonify(myResult)
    else:
        return 'Error fetching in Appointments'


@app.route('/appointment/<string:Username>', methods=['GET'])
def Appointments_Username(Username):

    myCursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    myCursor.execute("SELECT Appointments.AppointmentID, \
                    Appointments.SID AS Student_Username,\
                    Appointments.TID AS Tutor_Username,\
                    concat(Tutor.FirstName,' ',Tut or.LastName) AS TutorName, \
                    concat(Student.FirstName,' ', Student.LastName) AS StudentName,\
                    concat(Appointments.Date,' ',Appointments.Time) AS Date_Time,\
                    Appointments.Duration,\
                    Appointments.SubjectName\
                    From Appointments\
                    INNER JOIN Student ON Appointments.SID = Student.Username\
                    INNER JOIN Tutor ON Appointments.TID = Tutor.Username\
                    WHERE Appointments.SID  = %s OR Appointments.TID = %s", (Username, Username,))
    mysql.connection.commit()
    myResult = myCursor.fetchall()
    if myResult:
        return jsonify(myResult)
    else:
        return 'Username have no appointments in database'


@app.route('/set-appointment', methods=['POST'])
def new_appointment():
    try:
        data = request.get_json()
        myCursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        myCursor.execute('INSERT INTO Appointments (SID, TID, date, time, subject) VALUES (%s, %s, %s, %s, %s)',
                         (data["SID"], data["TID"], data["date"], data["time"], data["subject"],))
        mysql.connection.commit()

        myCursor.execute('UPDATE Availability\
                        SET booked = 1\
                        WHERE TID = %s AND day = %s AND startTime = %s',
                         (data["TID"], data["date"], data["time"],))
        mysql.connection.commit()
        mysql.connection

        return 'insert success'
    except mysql.connection.IntegrityError as e:
        error_msg = str(e)
        return f"Error: {error_msg}"


@app.route('/availability/<username>/<date>', methods=['GET'])
def availability(username, date):
    myCursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    myCursor.execute("SELECT startTime\
                     FROM Availability\
                     WHERE TID = %s\
                     AND DATE(day) = %s\
                     AND booked=0", (username, date,))
    mysql.connection.commit()
    myResult = myCursor.fetchall()
    if myResult:
        return json.dumps(myResult, default=str)
    else:
        return 'Error Fetching Database'


@app.route('/availablehours', methods=['GET'])
def AvailableHours():
    myCursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    myCursor.execute("SELECT AvailableHours.TID AS Username,\
                    concat(Tutor.FirstName,' ',Tutor.LastName) AS TutorName,\
                    concat(AvailableHours.Date,' ',AvailableHours.Time) AS Date_Time,\
                    AvailableHours.Duration,\
                    Subject.SubjectName\
                    From AvailableHours\
                    INNER JOIN Tutor ON AvailableHours.TID = Tutor.Username\
                    INNER JOIN Subject ON AvailableHours.TID = Subject.TID")

    mysql.connection.commit()
    myResult = myCursor.fetchall()
    if myResult:
        return jsonify(myResult)
    else:
        return 'Error Fetching Database'


@app.route('/availablehours/<string:Username>', methods=['GET'])
def AvailableHours_Username(Username):
    myCursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    myCursor.execute("SELECT AvailableHours.TID AS Username,\
                    concat(Tutor.FirstName,' ',Tutor.LastName) AS TutorName,\
                    concat(AvailableHours.Date,' ',AvailableHours.Time) AS Date_Time,\
                    AvailableHours.Duration,\
                    Subject.SubjectName\
                    From AvailableHours\
                    INNER JOIN Tutor ON AvailableHours.TID = Tutor.Username\
                    INNER JOIN Subject ON AvailableHours.TID = Subject.TID\
                    WHERE AvailableHours.TID =%s", (Username,))

    mysql.connection.commit()
    myResult = myCursor.fetchall()
    if myResult:
        return jsonify(myResult)
    else:
        return 'Error Fetching Database'


@app.route('/availablehours/insert/<string:Username>/<string:Date>/<string:Time>/<string:Duration>', methods=['GET', 'POST'])
def AvailableHours_insert(Username, Date, Time, Duration):
    myCursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    myCursor.execute('INSERT INTO AvailableHours VALUES (%s, %s, %s, %s)',
                     (Username, Date, Time, Duration,))
    mysql.connection.commit()

    msg = f'Insert successful, Username = {Username}, Date= {Date}, Time = {Time}'
    return msg


@app.route('/favorites', methods=['POST'])
def favorites():
    data = request.get_json()
    myCursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    myCursor.execute("SELECT Tutor.Username AS Username,\
            concat(Tutor.FirstName,' ',Tutor.LastName) AS TutorName,\
            Tutor.Email AS Email,\
            Tutor.AboutMe AS AboutMe,\
            Tutor.TotalHours AS TotalHours,\
            Tutor.ProfilePicture AS ProfilePicture,\
            group_concat(Subject.SubjectName separator ',') AS Subjects\
                    FROM Favorites\
                    RIGHT JOIN Tutor ON Favorites.TID = Tutor.Username\
                    INNER JOIN Subject ON Tutor.Username = Subject.TID\
                    WHERE Favorites.SID = %s\
                    GROUP BY Tutor.Username", (data["SID"],))
    mysql.connection.commit()
    myResult = myCursor.fetchall()
    if myResult:
        return jsonify(myResult)
    else:
        return 'Error Fetching Database'


@app.route('/add-favorite', methods=['POST'])
def add_favorite():
    data = request.get_json()
    myCursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    myCursor.execute('INSERT INTO Favorites VALUES (%s, %s)',
                     (data["SID"], data["TID"],))
    mysql.connection.commit()

    msg = f'Insert successful'
    return msg


@app.route('/remove-favorite', methods=['POST'])
def remove_favorite():
    data = request.get_json()
    myCursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    myCursor.execute('DELETE FROM Favorites WHERE SID = %s AND TID = %s',
                     (data["SID"], data["TID"],))
    mysql.connection.commit()

    msg = f'Insert successful'
    return msg


@app.route('/subjects', methods=['GET'])
def Subject():
    myCursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    myCursor.execute("SELECT Subject.TID AS Tutor_Username,\
                    concat(Tutor.FirstName,' ',Tutor.LastName) AS TutorName, \
                    Subject.SubjectName\
                    FROM Subject\
                    INNER JOIN Tutor ON Subject.TID = Tutor.Username")

    mysql.connection.commit()
    myResult = myCursor.fetchall()
    if myResult:
        return jsonify(myResult)
    else:
        return 'Error Fetching Database'


@app.route('/subjects/<string:Username>', methods=['GET'])
def Subject_Username(Username):
    myCursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    myCursor.execute("SELECT Subject.TID AS Tutor_Username,\
                    concat(Tutor.FirstName,' ',Tutor.LastName) AS TutorName, \
                    Subject.SubjectName\
                    FROM Subject\
                    INNER JOIN Tutor ON Subject.TID = Tutor.Username\
                    WHERE Subject.TID = %s", (Username,))

    mysql.connection.commit()
    myResult = myCursor.fetchall()
    if myResult:
        return jsonify(myResult)
    else:
        return 'Error Fetching Database'


@app.route('/subjects/insert/<string:TID>/<string:SubjectName>', methods=['GET', 'POST'])
def Subject_insert(TID, SubjectName):
    myCursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    myCursor.execute('INSERT INTO Subject VALUES (%s, %s)',
                     (TID, SubjectName,))
    mysql.connection.commit()

    msg = f'Insert successful, Tutor Username = {TID}, Subject Name= {SubjectName}'
    return msg


# @app.route('/login/<username>/<password>', methods=['GET'])
# def login(username, password):
#     account_types = ["Student", "Tutor"]

#     if username and password:
#         for account_type in account_types:
#             myCursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
#             myCursor.execute(
#                 f"SELECT * FROM {account_type} WHERE Username= %s", [username])
#             mysql.connection.commit()

#             account = myCursor.fetchone()

#             if account:
#                 return make_response(account, 200)
#     else:
#         return make_response("Please include username and password", 500)

#     return make_response('No Account, need to create new account', 500)


@app.route('/signup/student/<string:Username>/<string:FirstName>/<string:LastName>/<string:Email>/<string:Password>/<string:EducationLevel>', methods=['POST'])
def createStudentAccount(Username, FirstName, LastName, Email, Password, EducationLevel):

    if Username and FirstName and LastName and Email and Password and EducationLevel:
        myCursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        myCursor.execute(
            'SELECT * FROM Student WHERE Username = % s', (Username, ))
        mysql.connection.commit()
        account = myCursor.fetchone()
        if account:
            return make_response({'data': 'Username already exists !'}, 400)

        else:
            myCursor.execute('INSERT INTO Student (Username, FirstName,LastName, Email, Password, EducationLevel,TotalHours)\
            VALUES (%s, %s, %s, %s, %s, %s,%s)', (Username, FirstName, LastName, Email, Password, EducationLevel, 0, ))
            mysql.connection.commit()
            return make_response({'data': f'You have successfully registered! {Username}'}, 200)
    else:
        return 'Missing data'


@app.route('/signup/tutor/<string:Username>/<string:FirstName>/<string:LastName>/<string:Email>/<string:Password>/<string:AboutMe>/<string:Subject>', methods=['POST'])
def createTutorAccount(Username, FirstName, LastName, Email, Password, AboutMe, Subject):

    if Username and FirstName and LastName and Email and Password and AboutMe and Subject:
        myCursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        myCursor.execute(
            'SELECT * FROM Tutor WHERE Username = % s', (Username, ))
        mysql.connection.commit()
        account = myCursor.fetchone()

        if account:
            return 'Username already exists !'

        else:
            myCursor.execute('INSERT INTO Tutor (Username, FirstName,LastName, Email, Password, AboutMe,TotalHours)\
            VALUES (%s, %s, %s, %s, %s, %s,%s)', (Username, FirstName, LastName, Email, Password, AboutMe, 0, ))
            mysql.connection.commit()
            SubjectName = Subject.split(',')
            for x in SubjectName:
                myCursor.execute(
                    'INSERT INTO Subject VALUES (%s, %s)', (Username, x,))
                mysql.connection.commit()

            return make_response(f'You have successfully registered! {Username}', 200, {"Access-Control-Allow-Origin": "*"})
    else:
        return 'Missing data'


if __name__ == '__main__':
    app.run(debug=True, port=3000)
