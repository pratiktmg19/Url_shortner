const express = require('express');
const app = express();
const mongoose = require('mongoose');
const ShortUrl = require('./models/shortUrl');

//connecting the mongodb database in localhost
mongoose.connect('mongodb://localhost/urlShortner',{
    useNewUrlParser: true, useUnifiedTopology:true
})

//settting up the veiw engine for ejs
app.set('view engine', 'ejs')

//middleware
app.use(express.urlencoded({extended:false}));//incoming request  

app.get('/',async (req, res) => {
    const shorturls = await ShortUrl.find()
    res.render('index',{shor:shorturls});
})

app.post('/shortUrls', async (req, res) => {
   await ShortUrl.create({full: req.body.fullUrl})//body-parser
   res.redirect('/');
})

app.get('/:shortUrl',async (req, res)=>{
    const shortUrl = await ShortUrl.findOne({short: req.params.shortUrl})
    if(shortUrl == null) return res.status(404);
    shortUrl.clicks++;
    shortUrl.save();
    
    res.redirect(shortUrl.full)
})
app.listen(process.env.PORT || 3000);