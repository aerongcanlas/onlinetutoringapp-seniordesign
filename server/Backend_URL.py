from flask import Flask, make_response, jsonify
from flask_mysqldb import MySQL
import random
import MySQLdb.cursors
import json


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
            LIMIT 5")
    mysql.connection.commit()
    myResult = myCursor.fetchall()

    # resp = make_response(
    #     json.dumps(myResult), 200)
    # resp.headers['Access-Control-Allow-Origin'] = '*'

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
            Tutor.Availability,\
            group_concat(Subject.SubjectName separator ',') AS Subjects\
            From Tutor\
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
                    concat(Tutor.FirstName,' ',Tutor.LastName) AS TutorName, \
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


@app.route('/appointment/insert/<string:SID>/<string:TID>/<string:Date>/<string:Time>/<string:Duration>/<string:SubjectName>', methods=['GET', 'POST'])
def Appointment_insert(SID, TID, Date, Time, Duration, SubjectName):
    AppointmentsID = []
    myCursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    myCursor.execute('SELECT AppointmentID FROM Appointments')
    mysql.connection.commit()
    myResult = myCursor.fetchall()
    for x in myResult:
        AppointmentsID.append(x['AppointmentID'])

    AppointmentID = 'A' + str(random.randrange(9)) + str(random.randrange(9))\
        + random.choice('ABCDEFGHIJKLMNOPQRSTUVWXYZ')+str(random.randrange(9))

    while AppointmentID in AppointmentsID:
        AppointmentID = 'A' + str(random.randrange(9)) + str(random.randrange(9))\
            + random.choice('ABCDEFGHIJKLMNOPQRSTUVWXYZ') + \
            str(random.randrange(9))

    myCursor.execute('INSERT INTO Appointments VALUES (%s, %s, %s, %s, %s, %s,%s)',
                     (AppointmentID, SID, TID, Date, Time, Duration, SubjectName))
    mysql.connection.commit()

    msg = f'Insert successful, Appointment ID = {AppointmentID}, Student Username = {SID}, Tutor Username = {TID}'
    return msg


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


@app.route('/favoritelists', methods=['GET'])
def FavoriteLists():
    myCursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    myCursor.execute("SELECT FavoriteLists.SID AS Student_Username,\
                    FavoriteLists.TID AS Tutor_Username,\
                    concat(Tutor.FirstName,' ',Tutor.LastName) AS TutorName, \
                    concat(Student.FirstName,' ', Student.LastName) AS StudentName \
                    FROM FavoriteLists\
                    INNER JOIN Student ON FavoriteLists.SID = Student.Username\
                    INNER JOIN Tutor ON FavoriteLists.TID = Tutor.Username")

    mysql.connection.commit()
    myResult = myCursor.fetchall()
    if myResult:
        return jsonify(myResult)
    else:
        return 'Error Fetching Database'


@app.route('/favoritelists/<string:Username>', methods=['GET'])
def FavoriteLists_Username(Username):
    myCursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    myCursor.execute("SELECT FavoriteLists.SID AS Student_Username,\
                    FavoriteLists.TID AS Tutor_Username,\
                    concat(Student.FirstName,' ', Student.LastName) AS StudentName \
                    concat(Tutor.FirstName,' ',Tutor.LastName) AS TutorName, \
                    concat(Student.FirstName,' ', Student.LastName) AS StudentName \
                    FROM FavoriteLists\
                    INNER JOIN Student ON FavoriteLists.SID = Student.Username\
                    INNER JOIN Tutor ON FavoriteLists.TID = Tutor.Username\
                    WHERE FavoriteLists.SID = %s", (Username,))

    mysql.connection.commit()
    myResult = myCursor.fetchall()
    if myResult:
        return jsonify(myResult)
    else:
        return 'Error Fetching Database'


@app.route('/favoritelists/insert/<string:SID>/<string:TID>', methods=['GET', 'POST'])
def FavoriteLists_insert(SID, TID):
    myCursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    myCursor.execute('INSERT INTO FavoriteLists VALUES (%s, %s)', (TID, SID,))
    mysql.connection.commit()

    msg = f'Insert successful, Student Username = {SID}, Tutor Username = {TID}'
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


@app.route('/login/<username>/<password>', methods=['GET'])
def login(username, password):
    account_types = ["Student", "Tutor"]

    if username and password:
        for account_type in account_types:
            myCursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
            myCursor.execute(
                f"SELECT * FROM {account_type} WHERE Username= %s", [username])
            mysql.connection.commit()

            account = myCursor.fetchone()

            if account:
                return make_response(account, 200)
    else:
        return make_response("Please include username and password", 500)

    return make_response('No Account, need to create new account', 500)


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
