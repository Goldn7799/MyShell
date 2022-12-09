//import module
const fs = require("fs");
const prompt = require("prompt-sync")();
const os = require("os");
const { exec } = require("child_process");
const { exit } = require("process");

//prepeare
console.clear()
console.log("Starting...")


//setup variable
let db = {}
let history = []
let lock = true

//main js
const main = ()=>{
  fs.readFile("./db.json", "utf-8", (err, data)=>{
    if (err){
      console.error("Missing db.json");
      console.log("Creating db.json");
      fs.writeFile("./db.json", JSON.stringify({
        "Name": "SGStudio",
        "Machine": os.platform()
      }), err =>{ 
        if (err){
          console.error(`Error : ${err}`)
        }else {
          console.log("Succes Creating db.json")
          fs.writeFile("./history.json", JSON.stringify(["help"]), err =>{ 
            if (err){
              console.error(`Error : ${err}`)
            }else {
              console.log("Succes Creating history.json")
              setTimeout(()=>{ main() }, 1500)
            }
          })
        }
      })
    }else {
      db = JSON.parse(data);
      fs.readFile("./history.json", "utf-8", (error, datas)=>{
        if(error){
          console.error(`Missing history.json`);
          console.log("creating history.json")
          fs.writeFile("./history.json", JSON.stringify(["help"]), err =>{ 
            if (err){
              console.error(`Error : ${err}`)
            }else {
              console.log("Succes Creating history.json")
              setTimeout(()=>{ main() }, 1500)
            }
          })
        }else {
          history = JSON.parse(datas)
          if (db.Name == "SGStudio"){ comments = `You can Change Name with execute "setname"` }else { comments = 'Copyright By SGStudio' }
          console.log(`
          Arch : ${os.arch()}
          Ram : ${(os.freemem / 1000000000).toFixed(2)}GB / ${(os.totalmem() / 1000000000).toFixed(2)}GB
          Up Time : ${(os.uptime() / 3600 % 24).toFixed(0)}H ${(os.uptime % 3600 / 60).toFixed(0)}M

          "help"/"?" For Help
          ${comments}
          `)
          cmd();
        }
      })
    }
  })
}

//command line
const cmd = ()=>{
  var command = prompt(`${db.Name}@${db.Machine} => `);
  history.push(command);
  search(command);
}

//search
const search = (item)=>{
  if (item == "clear"){
    console.clear();
    cmd();
  }else if (item == "help"||item == "?"){
    console.log(`
      clear //for clear shell
      help //show command list
      runos <command> //run shell command
      tools <action> //Hack Tools
      log <string> //console log
      systeminfo //show system information
      version //console version
      setname //set console name or machine name
      exit //exit console
      `)
    cmd();
  }else if (item == "exit"){
    if (prompt("Exit? (y/n): ") == "y"){
      console.log("terminating...");
      fs.writeFile("./history.json", JSON.stringify(history), (err)=>{
        if(err){
          console.error(err);
          exit();
        }else{
          exit();
        }
      })
    }else {
      console.log("aborted");
      cmd();
    }
  }else if (item.substring(0, 5) == "runos"){
    if (item.substring(6) == ""){
      console.log("Please Insert Command");
      cmd();
    }else {
      console.log(`Running : ${item.substring(6)}`)
      exec(`${item.substring(6)}`, (error, stdout, stderr) => {
          if (error) {
              console.log(`error: ${error.message}`);
              // return;
          }
          if (stderr) {
              console.log(`stderr: ${stderr}`);
              // return;
          }
          console.log(stdout);
          cmd();
      });
    }
  }else if (item.substring(0, 5) == "tools"){
    tools(item.substring(6));
  }else if (item.substring(0, 3) == "log"){
    console.debug(item.substring(4));
    cmd();
  }else if (item == "systeminfo"){
    console.log(`
    -----SYSTEM-----
    Arch : ${os.arch()}
    CPU : ${os.cpus().map(data => { if (lock){ lock = false; return data.model; } })}
    Ram : ${(os.freemem / 1000000000).toFixed(2)}GB / ${(os.totalmem() / 1000000000).toFixed(2)}GB
    Home Dir : ${os.homedir()}
    Hostname : ${os.hostname()}
    IP : ${os.networkInterfaces().wlp3s0.map(data=>{ return data.address })}
    Platform : ${os.platform()}
    Release : ${os.release()}
    Version : ${os.version()}
    Up Time : ${(os.uptime() / 3600 % 24).toFixed(0)}H ${(os.uptime % 3600 / 60).toFixed(0)}M
    `)
    cmd();
  }else if (item == "version"){
    fs.readFile("./package.json", "utf-8", (err, data)=>{
      if (err){
        console.error("Error Read Version")
        cmd()
      }else {
        console.log(`
          -----Version-----
          Name : ${JSON.parse(data).name}
          Version : ${JSON.parse(data).version}
          Desc : ${JSON.parse(data).description}
          Author : ${JSON.parse(data).author}
          WA : 081228020195
        `)
        cmd()
      }
    })
  }else if (item == "setname"){
    console.log("-----Set Name-----");
    console.log("1.Set Name")
    console.log("2.Set Machine Name")
    console.log("0. Exit")
    let opt = prompt("Chose : ")
    if (opt == 1){
      db.Name = prompt("Name : ");
      fs.writeFile("./db.json", JSON.stringify(db), (err)=>{
        if(err){
          console.error("failed Write Change");
          cmd()
        }else{
          console.log("Change Saved")
          cmd()
        }
      })
    }else if (opt == 2){
      db.Machine = prompt("Machine : ");
      fs.writeFile("./db.json", JSON.stringify(db), (err)=>{
        if(err){
          console.error("failed Write Change");
          cmd()
        }else{
          console.log("Change Saved")
          cmd()
        }
      })
    }else{
      console.debug("aborted")
      cmd()
    }
  }
  else{
    console.error(`Command ${item} not Found`);
    cmd();
  }
}

//tools
const tools = (action)=>{
  if (action == "ddos"){
    console.log("starting ddos");
    const fpms = 100;
    const menu = ()=>{
      console.clear();
      console.log("1. DDOS Web");
      console.log("2. DDOS IP");
      console.log("0. Exit");
      var opt = prompt("chose : ");
      if (opt == 0){
        cmd();
      }else if (opt == 1){
        var ip = prompt("IP : ");
        let cout = prompt("Req : ");
        let limit = 0, succes = 0, failed = 0, loglimit = 0;
        var log = ``;
        let requ = setInterval(()=>{
          if (loglimit > 9){
            log = ``
            loglimit=0;
          }else {
            cout--;
            loglimit++;
            log += `
          Succes`
          }
        }, 50)
        let ddos = setInterval(()=>{
          if (cout < 0){
            clearInterval(ddos);
            clearInterval(requ);
            console.log("DONE");
            cmd()
          }else {
            console.clear();
            console.log(`
            Send To : ${ip}
            Request Remeaining : ${cout}
            Limit : ${limit}
            Succes : ${succes}
            Failed : ${failed}
    -------------------LOG--------------------
      ${log}
            `)
          }
        }, fpms);
      }
      else {
        menu();
      }
    }
    menu()
  }else if (action == "help"){
    console.log(`
      ddos //ddos tools
    `)
    cmd();
  }
  else {
    console.error(`Try run "tools help"`);
    cmd();
  }
}

//start
main();