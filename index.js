// api.openweathermap.org/data/2.5/weather?q=Pune&appid=56299d29db3e91dc729c87bb01b49dab
const http = require('http');
const fs = require('fs');
var requests = require('requests');
const urlbar = require('url');

const homeFile = fs.readFileSync('home.html', 'utf-8' );
const staticFile = fs.readFileSync('static.html', 'utf-8' );
const nfFile = fs.readFileSync('notfound.html', 'utf-8' );


const replaceVal = (tempVal, OrgVal) => {
    if (OrgVal.cod!=404) {
    let temperature = tempVal.replace("{%tempval%}", OrgVal.main.temp);
    temperature = temperature.replace("{%tempmin%}", OrgVal.main.temp_min);
    temperature = temperature.replace("{%tempmax%}", OrgVal.main.temp_max);
    temperature = temperature.replace("{%location%}", OrgVal.name);
    temperature = temperature.replace("{%country%}", OrgVal.sys.country);
    temperature = temperature.replace("{%tempstat%}", OrgVal.weather[0].main);
    return temperature;
    }  else {
        throw new Error('custom Error');
    }
    
}

const server = http.createServer((req, res)=>{
    const parsedUrl =urlbar.parse(req.url, true);
    if (parsedUrl.pathname === '/getweather') {
        const cityname = parsedUrl.query.city;
        const apiurl = "https://api.openweathermap.org/data/2.5/weather?q="+cityname+"&appid=56299d29db3e91dc729c87bb01b49dab"
        requests(
            apiurl)
        .on('data', (chunk)=>{
            try {
            const objarray = [JSON.parse(chunk)];
            const realTimeData = objarray
            .map(val => replaceVal(homeFile, val))
            .join('');
            res.write(realTimeData);
            }  catch(e) {
                res.write("<script>alert('Sorry page not found');window.open('/','_self');</script>");
                res.end();

            }   
        })
        .on('end', (err)=>{
            if (err) {
                return console.log('Error'+err);
            }
            res.end();
        });
    } else if (req.url=="/") {
        res.write(staticFile);
        res.end();

    } else  {
        res.write(nfFile);
        res.end();
    }
});     

server.listen(8000, '127.0.0.1', () =>{
    console.log('Listening')
});