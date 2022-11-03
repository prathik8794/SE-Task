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
    //console.log(req.body);
    let tmp=[];
    let id=[];
    let owner1 = req.body.owner;
    let repo1 = req.body.repo;
    try {
      for(let j=1;j<=10;j++){
      const result = await octokit.request("GET /repos/{owner}/{repo}/pulls", {
          owner: owner1,
          repo: repo1,
          page:j,
          per_page: 100,
      });
       //console.log(result.data.length);
        for(let i=0;i<result.data.length;i++){
            // console.log(result.data[i].title+" "+result.data[i].id);
            tmp.push(result.data[i].title);
            id.push(result.data[i].id);
        }
    }
    } catch (error) {
      console.log(`Error! Status: ${error.status}. Message: ${error.response.data.message}`)
    } 
    res.render('index',{tmp:tmp,repo1:repo1,owner1:owner1,id:id});
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));

