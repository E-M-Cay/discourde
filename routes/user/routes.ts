var express = require('express');
var router = express.Router();
import {Request, Response} from "express"



router.get('/', function(req:Request, res:Response){
    res.send('Hello fdp')
});
 
module.exports = router