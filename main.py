from flask import Flask, url_for, render_template, send_from_directory

app = Flask(__name__, static_url_path='/assets', static_folder='assets/build')

@app.route('/')
def home():
    return render_template("index.html")

@app.route('/blog/')
def blog():
    return render_template("blog.html")