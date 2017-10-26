from flask import Flask, url_for, render_template, send_from_directory

app = Flask(__name__, static_url_path='/assets', static_folder='assets/build')

# TODO: Apply canonical url metadata
# TODO: Decide on slug url and article permalink structure

@app.route('/')
def home():
    return render_template("index.html")

@app.route('/blog/')
def blog():
    return render_template("blog.html")

@app.route('/blog/<int:article_id>')
def blog_article(article_id):
    return render_template("article.html")
