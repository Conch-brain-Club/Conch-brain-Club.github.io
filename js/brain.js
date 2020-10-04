let container = {
    id: undefined,
    system: undefined,
    time: undefined
}

let baseUrl = "https://www.ccczg.site/cloudshell"

function create(system){
    if(!container.id){
        window.fetch(baseUrl + "/create?" + system,{
            method:"GET"
        }).then((res)=>{
            if(res.status==200){
                res.text().then((text)=>{
                    container.id = text;
                    container.system = system;
                    container.time = -1;

                    //延迟容器生命周期
                    delay();
                    tryConnect();
                });
            }
            else{
                alert("出错了,请刷新后重试");
            }
        });
    }
    else{
        alert("请先关闭当前运行中的环境");
    }
}

function tryConnect(){
    if(container.id){
        let num = Math.round((Math.random()*100000)).toString();
        let str = prompt("请输入"+num);
        if(!str || str==""){
            kill();
        }
        else if(str == num){
            let url = baseUrl + "/" + container.id;
            document.querySelector("#shell").querySelector("iframe").src = url;
        }
        else{
            setTimeout(tryConnect,1000);
        }
    }
    else{
        alert("请先创建环境");
    }
}

function kill(){
    if(container.id){
        fetch(baseUrl + "/kill?" + container.id,{
            method:"GET"
        }).then((res)=>{
            res.text().then((text)=>{
                if(text.includes(container.id)){
                    container.id = undefined;
                    document.querySelector("#shell").querySelector("iframe").src = "";
                }
                else{
                    console.log("kill container defeat");
                }
            });
        });
    }
}

function delay(){
    if(container.id){
        fetch(baseUrl + "/delay?" + container.id,{
            method:"GET"
        }).then((res)=>{
            res.text().then((text)=>{
                console.log(text);
                container.time++;
            });
        });
        setTimeout(delay,1000*60);
    }
}

function createContainer(system){
    //创建容器
    create(system);
    //离开网页关闭容器
    window.addEventListener('beforeunload',kill);
}

function fullScreen(){
    document.querySelector("#btn_mini").click();
    setTimeout(()=>{
        let iframe = document.querySelector("#shell").querySelector("iframe");
        let fullScreenFrame = document.querySelector("#fullScreenFrame");
        fullScreenFrame.src = iframe.src;
        iframe.src = "";
        fullScreenFrame.removeAttribute("hidden");
    },500);
    document.querySelector(".exitFullScreen").removeAttribute("hidden");
    document.querySelector("nav").setAttribute("hidden","hidden");
}

function exitFullScreen(){
    let iframe = document.querySelector("#shell").querySelector("iframe");
    let fullScreenFrame = document.querySelector("#fullScreenFrame");
    iframe.src = fullScreenFrame.src;
    fullScreenFrame.src = "";
    fullScreenFrame.setAttribute("hidden","hidden");
    document.querySelector("#showModal").click();
    document.querySelector(".exitFullScreen").setAttribute("hidden","hidden");
    document.querySelector("nav").removeAttribute("hidden");
}

function reconnect(){
    let url = baseUrl + "/" + container.id;
    document.querySelector("#shell").querySelector("iframe").src = url;
}

function showRunning(){
    if(container.id){
        try {
            document.querySelector("#running").removeAttribute("hidden");
            document.querySelector("#containerSystem").innerText = container.system;
            document.querySelector("#containerId").innerText = container.id;
            document.querySelector("#containerTime").innerText = container.time + " min ago";
        } catch (error) {}
    }
    else{
        try {
            document.querySelector("#running").setAttribute("hidden","hidden");
        } catch (error) {}
    }
    setTimeout(showRunning,2000);
}

showRunning();