import * as express from 'express';
import * as nunjucks from 'nunjucks';
import * as path from 'path';
const app = express();

const assets_location = path.join(__dirname, 'assets/build');
app.use('/assets', express.static(assets_location));

nunjucks.configure('templates', {
    autoescape: true,
    express: app
});

app.get('/', (req, res) => {
    res.render('index.html');
});

app.get('/blog/', (req, res) => {
    res.render('blog.html');
});

app.get('/blog/:article_id', (req, res) => {
    res.render('article.html');
});


app.listen(5000, () => {
    console.log("Portfolio running on port 5000");
})


