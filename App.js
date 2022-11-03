import { Octokit } from "octokit"
import express from "express"
import ejs from "ejs"
import path from "path"
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bodyParser from "body-parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true })); 
//app.set("views", path.join(__dirname, "views"));

const octokit = new Octokit({
  auth: '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'
});

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/form.html'));
  });

app.post('/', async (req,res) => {
    console.log(req.body);
    let tmp=[];
    let owner = req.body.owner;
    let repo = req.body.repo;
    try {
      for(let j=1;j<=10;j++){
      const result = await octokit.request("GET /repos/{owner}/{repo}/pulls", {
          owner: owner,
          repo: repo,
          page:j,
          per_page: 100,
        });
        console.log(result.data.length);
        for(let i=0;i<result.data.length;i++){
            // console.log(result.data[i].title+" "+result.data[i].id);
            // document.getElementById("root").innerText = result.data[i].title;
            tmp.push(result.data[i].title);
        }
    }
    } catch (error) {
      console.log(`Error! Status: ${error.status}. Message: ${error.response.data.message}`)
    } 
    res.render('index',{tmp:tmp});
});

app.listen(4000, () => console.log('Example app listening on port 4000!'));