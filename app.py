from flask import Flask, render_template

# Flask instance
app = Flask(__name__)

# route decorator
@app.route('/')

def index():
    return render_template("index.html")

# Route for user greeting
@app.route('/hello/<name>')
def user(name):
    return "Hello, {}".format(name)





