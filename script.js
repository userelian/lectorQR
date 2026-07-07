const fileInput=document.getElementById("fileInput");
const canvas=document.getElementById("canvas");
const ctx=canvas.getContext("2d");
const result=document.getElementById("result");
const cameraBtn=document.getElementById("cameraBtn");

fileInput.addEventListener("change",leerImagen);

cameraBtn.onclick=iniciarCamara;



function mostrarWifi(texto){

if(!texto.startsWith("WIFI:")){

result.innerHTML="<b>Contenido:</b><br>"+texto;
return;

}

const datos={};

texto
.replace("WIFI:","")
.split(";")
.forEach(parte=>{

const p=parte.indexOf(":");

if(p!=-1){

const clave=parte.substring(0,p);

const valor=parte.substring(p+1);

datos[clave]=valor;

}

});

result.innerHTML=`

<b>📶 SSID:</b><br>${datos.S||""}<br><br>

<b>🔒 Seguridad:</b><br>${datos.T||""}<br><br>

<b>🔑 Contraseña:</b>

<span id="pass">${datos.P||""}</span>

<br>

<button class="copy" onclick="copiar()">Copiar contraseña</button>

`;

}

function copiar(){

const pass=document.getElementById("pass").textContent;

navigator.clipboard.writeText(pass);

alert("Contraseña copiada");

}



function leerImagen(e){

const archivo=e.target.files[0];

if(!archivo) return;

const img=new Image();

img.onload=function(){

canvas.width=img.width;

canvas.height=img.height;

ctx.drawImage(img,0,0);

const imageData=ctx.getImageData(0,0,canvas.width,canvas.height);

const code=jsQR(imageData.data,imageData.width,imageData.height);

if(code){

mostrarWifi(code.data);

}else{

result.innerHTML="No se encontró un QR.";

}

}

img.src=URL.createObjectURL(archivo);

}



function iniciarCamara(){

const qr=new Html5Qrcode("reader");

qr.start(

{

facingMode:"environment"

},

{

fps:10,

qrbox:250

},

(texto)=>{

mostrarWifi(texto);

qr.stop();

}

);

}